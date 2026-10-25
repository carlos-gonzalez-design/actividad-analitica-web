<script setup>
import { onMounted, ref } from 'vue'
import { setAnalyticsConsent } from '../utils/umamiAnalytics'

const STORAGE_KEY = 'carlos-gonzalez-cookie-consent'
const isVisible = ref(false)
const showPreferences = ref(false)
const analyticsAllowed = ref(false)

function saveConsent(analytics) {
  const consent = {
    necessary: true,
    analytics,
    updatedAt: new Date().toISOString(),
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent))
  } catch {
    // The controls still work when browser storage is unavailable.
  }

  analyticsAllowed.value = analytics
  setAnalyticsConsent(analytics)
  isVisible.value = false
  showPreferences.value = false
}

function openPreferences() {
  showPreferences.value = true
  isVisible.value = true
}

function dismissBanner() {
  isVisible.value = false
  showPreferences.value = false
}

onMounted(() => {
  let storedConsent = null

  try {
    storedConsent = localStorage.getItem(STORAGE_KEY)
  } catch {
    // Show the banner if the browser blocks storage.
  }

  if (!storedConsent) {
    isVisible.value = true
    return
  }

  try {
    analyticsAllowed.value = JSON.parse(storedConsent).analytics === true
    setAnalyticsConsent(analyticsAllowed.value)
  } catch {
    isVisible.value = true
  }
})
</script>

<template>
  <button
    v-if="!isVisible"
    class="cookie-reopen eyebrow"
    type="button"
    aria-label="Abrir preferencias de cookies"
    @click="openPreferences"
  >
    Cookies <span aria-hidden="true">↗</span>
  </button>

  <aside
    v-if="isVisible"
    class="cookie-panel"
    aria-labelledby="cookie-title"
    aria-describedby="cookie-description"
  >
    <div class="cookie-panel__top">
      <span class="cookie-panel__index eyebrow">Preferencias · 01</span>
      <button
        class="cookie-panel__close"
        type="button"
        aria-label="Cerrar aviso de cookies"
        @click="dismissBanner"
      >
        ×
      </button>
    </div>

    <template v-if="!showPreferences">
      <h2 id="cookie-title">Una web que <span class="serif-accent">aprende.</span></h2>
      <p id="cookie-description">
        Este portfolio puede usar analítica para entender qué contenidos interesan. Elige si la permites;
        podrás cambiarlo cuando quieras.
      </p>
      <div class="cookie-panel__actions">
        <button class="cookie-panel__button cookie-panel__button--primary" type="button" @click="saveConsent(true)">
          Permitir analítica <span aria-hidden="true">↗</span>
        </button>
        <button class="cookie-panel__button" type="button" @click="saveConsent(false)">
          Rechazar
        </button>
        <button class="cookie-panel__preferences eyebrow" type="button" @click="showPreferences = true">
          Ajustar preferencias
        </button>
      </div>
    </template>

    <template v-else>
      <h2 id="cookie-title">Tus <span class="serif-accent">preferencias.</span></h2>
      <p id="cookie-description">Elige si permites medir de forma anónima cómo se usa esta web.</p>
      <div class="cookie-panel__choice">
        <div>
          <strong>Recordar tu elección</strong>
          <span>Se guarda en este navegador para respetar tus preferencias.</span>
        </div>
        <span class="cookie-panel__always eyebrow">Preferencia</span>
      </div>
      <label class="cookie-panel__choice cookie-panel__choice--toggle">
        <span>
          <strong>Analítica</strong>
          <span>Ayuda a entender qué contenidos interesan.</span>
        </span>
        <input v-model="analyticsAllowed" type="checkbox" />
      </label>
      <div class="cookie-panel__actions cookie-panel__actions--save">
        <button class="cookie-panel__button cookie-panel__button--primary" type="button" @click="saveConsent(analyticsAllowed)">
          Guardar elección <span aria-hidden="true">↗</span>
        </button>
        <button class="cookie-panel__button" type="button" @click="saveConsent(false)">
          Rechazar analítica
        </button>
      </div>
    </template>
  </aside>
</template>

<style scoped>
.cookie-panel {
  position: fixed;
  z-index: 30;
  right: clamp(1rem, 2.5vw, 2rem);
  bottom: clamp(1rem, 2.5vw, 2rem);
  width: min(27rem, calc(100vw - 2rem));
  padding: clamp(1.25rem, 3vw, 1.75rem);
  border: 1px solid var(--color-ink);
  color: var(--color-paper);
  background: var(--color-ink);
  box-shadow: 0 1rem 3rem rgb(21 21 19 / 18%);
  animation: cookie-enter 360ms cubic-bezier(.2, .7, .2, 1) both;

  h2 {
    margin-top: 1.5rem;
    font-size: clamp(1.75rem, 5vw, 2.35rem);
    font-weight: 400;
    letter-spacing: -0.065em;
    line-height: 0.98;
  }

  h2 span {
    color: var(--color-accent);
  }

  p {
    max-width: 33rem;
    margin-top: 0.85rem;
    color: rgb(242 240 235 / 75%);
    font-size: 0.84rem;
    line-height: 1.5;
  }
}

.cookie-panel__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cookie-panel__index {
  color: rgb(242 240 235 / 62%);
}

.cookie-panel__close {
  display: grid;
  width: 2rem;
  aspect-ratio: 1;
  place-items: center;
  border: 1px solid rgb(242 240 235 / 38%);
  border-radius: 50%;
  color: var(--color-paper);
  background: transparent;
  font-size: 1.3rem;
  line-height: 1;
  cursor: pointer;
  transition: color var(--transition), background var(--transition), border-color var(--transition);

  &:hover {
    border-color: var(--color-accent);
    color: var(--color-ink);
    background: var(--color-accent);
  }
}

.cookie-panel__actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.55rem;
  margin-top: 1.35rem;
}

.cookie-panel__button {
  width: 100%;
  min-height: 2.65rem;
  padding: 0.7rem 0.9rem;
  border: 1px solid rgb(242 240 235 / 48%);
  color: var(--color-paper);
  background: transparent;
  font-size: 0.72rem;
  cursor: pointer;
  transition: color var(--transition), background var(--transition), border-color var(--transition);

  &:hover {
    border-color: var(--color-paper);
    color: var(--color-ink);
    background: var(--color-paper);
  }
}

.cookie-panel__button--primary {
  border-color: var(--color-accent);
  color: var(--color-ink);
  background: var(--color-accent);
  font-weight: 700;

  &:hover {
    border-color: var(--color-paper);
    background: var(--color-paper);
  }
}

.cookie-panel__preferences {
  grid-column: 1 / -1;
  justify-self: center;
  padding: 0.45rem 0.25rem 0;
  border: 0;
  color: rgb(242 240 235 / 72%);
  background: transparent;
  text-align: left;
  text-decoration: underline;
  text-underline-offset: 0.2rem;
  cursor: pointer;
}

.cookie-panel__choice {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-block: 0.9rem;
  border-top: 1px solid rgb(242 240 235 / 22%);
  font-size: 0.75rem;

  strong,
  span > span {
    display: block;
  }

  span > span {
    margin-top: 0.25rem;
    color: rgb(242 240 235 / 62%);
    font-size: 0.68rem;
    line-height: 1.35;
  }
}

.cookie-panel__always {
  flex-shrink: 0;
  color: var(--color-accent);
  font-size: 0.55rem;
}

.cookie-panel__choice--toggle {
  cursor: pointer;

  input {
    width: 2.6rem;
    height: 1.45rem;
    flex-shrink: 0;
    accent-color: var(--color-accent);
    cursor: pointer;
  }
}

.cookie-panel__actions--save {
  margin-top: 0.3rem;
}

.cookie-reopen {
  position: fixed;
  z-index: 29;
  right: 1rem;
  bottom: 1rem;
  display: flex;
  min-height: 2.6rem;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 0.9rem;
  border: 1px solid var(--color-ink);
  border-radius: var(--radius-round);
  color: var(--color-paper);
  background: var(--color-ink);
  box-shadow: 0 0.5rem 1.5rem rgb(21 21 19 / 15%);
  font-size: 0.58rem;
  transition: color var(--transition), background var(--transition);

  &:hover {
    color: var(--color-ink);
    background: var(--color-paper);
  }
}

@keyframes cookie-enter {
  from {
    opacity: 0;
    transform: translateY(0.75rem);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cookie-panel {
    animation: none;
  }
}
</style>
