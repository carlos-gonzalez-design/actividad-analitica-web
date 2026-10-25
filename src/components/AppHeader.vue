<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isProject = computed(() => route.name === 'project')
</script>

<template>
  <header class="site-header">
    <RouterLink class="site-header__brand" to="/" aria-label="Carlos González, inicio">
      Carlos <span>González</span>
    </RouterLink>

    <RouterLink v-if="isProject" class="site-header__back eyebrow" to="/#proyectos">
      <span aria-hidden="true">←</span> Todos los proyectos
    </RouterLink>

    <template v-else>
      <nav class="site-header__nav" aria-label="Navegación principal">
        <a href="#proyectos">Proyectos</a>
        <a href="#sobre-mi">Sobre mí</a>
      </nav>
      <a class="site-header__availability eyebrow" href="mailto:hola@carlosgonzalez.design">
        <span aria-hidden="true"></span> Disponible para proyectos
      </a>
    </template>
  </header>
</template>

<style scoped>
.site-header {
  position: relative;
  z-index: 10;
  display: flex;
  min-height: clamp(4.25rem, 7vw, 6.5rem);
  align-items: center;
  justify-content: space-between;
  padding-inline: var(--page-x);
  border-bottom: 1px solid var(--color-line);
  text-transform: uppercase;

  & .site-header__brand {
    font-size: clamp(0.66rem, 0.82vw, 0.78rem);
    font-weight: 800;
    letter-spacing: -0.04em;

    span {
      color: var(--color-accent);
    }
  }

  & .site-header__nav {
    display: none;
    gap: clamp(1.75rem, 3vw, 3rem);
    font-family: var(--font-mono);
    font-size: 0.61rem;
    letter-spacing: 0.02em;

    a {
      transition: opacity var(--transition);
    }

    a:hover {
      opacity: 0.5;
    }
  }

  & .site-header__availability {
    display: none;
    align-items: center;
    gap: 0.65rem;

    span {
      width: 0.42rem;
      aspect-ratio: 1;
      border-radius: 50%;
      background: var(--color-success);
      box-shadow: 0 0 0 0.22rem rgb(68 189 88 / 12%);
    }
  }

  & .site-header__back {
    display: flex;
    align-items: center;
    gap: 0.65rem;
  }
}

@media (min-width: 48rem) {
  .site-header {
    display: grid;
    grid-template-columns: 1fr auto 1fr;

    & .site-header__nav {
      display: flex;
    }

    & .site-header__availability,
    & .site-header__back {
      display: flex;
      justify-self: end;
    }
  }
}
</style>
