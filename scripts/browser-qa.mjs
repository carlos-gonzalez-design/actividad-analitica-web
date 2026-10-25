import { spawn } from 'node:child_process'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const root = process.cwd()
const outputDir = path.join(root, 'references', 'qa', 'cdp')
const profileDir = path.join(outputDir, `profile-${process.pid}`)
const port = 9337

await mkdir(profileDir, { recursive: true })

const browser = spawn(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--disable-background-networking',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profileDir}`,
  'about:blank',
], { stdio: 'ignore' })

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function connect() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const pages = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json())
      const page = pages.find((entry) => entry.type === 'page')
      if (page) return page.webSocketDebuggerUrl
    } catch {
      // Chrome todavía está arrancando.
    }
    await pause(250)
  }
  throw new Error('No se pudo conectar con Chrome.')
}

let socket
let sequence = 0
const pending = new Map()

function command(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++sequence
    pending.set(id, { resolve, reject })
    socket.send(JSON.stringify({ id, method, params }))
  })
}

async function evaluate(expression) {
  const result = await command('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  })
  return result.result.value
}

async function navigate(url, width, height) {
  await command('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 600,
  })
  await command('Page.navigate', { url })
  await pause(700)
}

async function capture(name) {
  const result = await command('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: false,
  })
  await writeFile(path.join(outputDir, name), Buffer.from(result.data, 'base64'))
}

const report = []

try {
  const webSocketUrl = await connect()
  socket = new WebSocket(webSocketUrl)
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true })
    socket.addEventListener('error', reject, { once: true })
  })

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data)
    if (!message.id || !pending.has(message.id)) return
    const request = pending.get(message.id)
    pending.delete(message.id)
    if (message.error) request.reject(new Error(message.error.message))
    else request.resolve(message.result)
  })

  await command('Page.enable')
  await command('Runtime.enable')

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1440, height: 1000 },
  ]) {
    await navigate('http://127.0.0.1:4173/', viewport.width, viewport.height)
    const metrics = await evaluate(`({
      requestedWidth: ${viewport.width},
      innerWidth: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
      cards: document.querySelectorAll('.project-card').length,
      imagesLoaded: [...document.images].every((image) => image.complete && image.naturalWidth > 0),
      firstCardMedia: (() => {
        const media = document.querySelector('.project-card__media')
        const image = media?.querySelector('img')
        if (!media || !image) return null
        const mediaRect = media.getBoundingClientRect()
        const imageRect = image.getBoundingClientRect()
        return {
          media: [Math.round(mediaRect.width), Math.round(mediaRect.height)],
          image: [Math.round(imageRect.width), Math.round(imageRect.height)],
          aspectRatio: getComputedStyle(image).aspectRatio
        }
      })()
    })`)
    report.push({ page: 'home', ...metrics })
    await capture(`home-${viewport.width}.png`)
    if (viewport.width === 390 || viewport.width === 1440) {
      await evaluate(`document.querySelector('#proyectos').scrollIntoView()`)
      await pause(500)
      await capture(`projects-${viewport.width}.png`)
    }
  }

  await navigate('http://127.0.0.1:4173/', 1440, 1000)
  const search = await evaluate(`(async () => {
    const input = document.querySelector('input[type="search"]')
    input.value = 'pulso'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await new Promise((resolve) => setTimeout(resolve, 100))
    const pulsoCount = document.querySelectorAll('.project-card').length
    input.value = 'zzzz'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await new Promise((resolve) => setTimeout(resolve, 100))
    return {
      pulsoCount,
      emptyMessage: document.querySelector('.project-empty')?.textContent.replace(/\\s+/g, ' ').trim() ?? null
    }
  })()`)
  report.push({ feature: 'search', ...search })
  await evaluate(`document.querySelector('.project-empty').scrollIntoView()`)
  await pause(200)
  await capture('empty-1440.png')

  await navigate('http://127.0.0.1:4173/', 390, 844)
  await evaluate(`(async () => {
    const input = document.querySelector('input[type="search"]')
    input.value = 'zzzz'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    await new Promise((resolve) => setTimeout(resolve, 100))
    document.querySelector('.project-empty').scrollIntoView()
  })()`)
  await pause(200)
  await capture('empty-390.png')

  await navigate('http://127.0.0.1:4173/proyecto/pulso-tickets', 1440, 1000)
  const project = await evaluate(`({
    title: document.querySelector('h1')?.textContent.trim(),
    galleryImages: document.querySelectorAll('.case-gallery img').length,
    imagesLoaded: [...document.images].every((image) => image.complete && image.naturalWidth > 0),
    hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth
  })`)
  report.push({ page: 'project', ...project })
  await capture('project-1440.png')

  await navigate('http://127.0.0.1:4173/proyecto/no-existe', 390, 844)
  const notFound = await evaluate(`({
    heading: document.querySelector('h1')?.textContent.trim(),
    hasBackLink: Boolean(document.querySelector('.not-found a')),
    hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth
  })`)
  report.push({ page: 'not-found', ...notFound })

  console.log(JSON.stringify(report, null, 2))
} finally {
  socket?.close()
  browser.kill()
  await pause(300)
  await rm(profileDir, { recursive: true, force: true })
}
