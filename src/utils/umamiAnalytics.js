const UMAMI_SCRIPT_ID = 'umami-analytics'
const UMAMI_SCRIPT_URL = 'https://cloud.umami.is/script.js'
const UMAMI_WEBSITE_ID = 'e34c24ba-5a32-43b8-93bd-eddc5b5627dd'

let analyticsAllowed = false

function loadUmami() {
  if (document.getElementById(UMAMI_SCRIPT_ID)) {
    window.umami?.track()
    return
  }

  const script = document.createElement('script')
  script.id = UMAMI_SCRIPT_ID
  script.defer = true
  script.src = UMAMI_SCRIPT_URL
  script.dataset.websiteId = UMAMI_WEBSITE_ID
  // Pageviews are sent by Vue Router only while the visitor has opted in.
  script.dataset.autoTrack = 'false'
  script.addEventListener('load', () => {
    if (analyticsAllowed) window.umami?.track()
  }, { once: true })

  document.head.appendChild(script)
}

export function setAnalyticsConsent(allowed) {
  analyticsAllowed = allowed === true
  if (analyticsAllowed) loadUmami()
}

export function trackPageView() {
  if (analyticsAllowed) window.umami?.track()
}
