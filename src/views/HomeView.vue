<script setup>
import { computed, ref } from 'vue'
import projects from '../data/projects.json'
import AppFooter from '../components/AppFooter.vue'
import ProjectGrid from '../components/ProjectGrid.vue'
import ProjectSearch from '../components/ProjectSearch.vue'

const search = ref('')

// computed recalcula la lista solo cuando cambia el texto de búsqueda.
const filteredProjects = computed(() => {
  const term = search.value.trim().toLocaleLowerCase('es')
  if (!term) return projects
  return projects.filter((project) => project.name.toLocaleLowerCase('es').includes(term))
})
</script>

<template>
  <main id="contenido">
    <section id="top" class="hero" aria-labelledby="hero-title">
      <div class="hero__meta">
        <span class="eyebrow">(01 — 26)</span>
        <span class="eyebrow">Digital designer & frontend developer</span>
      </div>
      <h1 id="hero-title">Diseño experiencias<br />digitales. <span class="serif-accent">Y las hago</span><br />realidad.</h1>
      <p class="hero__intro">Diseño productos digitales con intención y los construyo con cuidado. Entre estrategia, interfaz y código.</p>
      <span class="hero__monogram" aria-hidden="true">CG</span>
      <a class="hero__scroll" href="#proyectos" aria-label="Ir a proyectos">
        <img src="/images/icons/arrow-down.svg" alt="" />
      </a>
    </section>

    <section id="proyectos" class="projects" aria-labelledby="projects-title">
      <div class="projects__heading">
        <div>
          <p class="eyebrow">Selección · 2023—2025</p>
          <h2 id="projects-title">Proyectos seleccionados</h2>
        </div>
        <span class="eyebrow">({{ String(filteredProjects.length).padStart(2, '0') }})</span>
      </div>
      <ProjectSearch v-model="search" />
      <ProjectGrid :projects="filteredProjects" />
    </section>

    <section id="sobre-mi" class="about" aria-labelledby="about-title">
      <div class="about__top">
        <p class="eyebrow">Sobre mí</p>
        <span>(02)</span>
      </div>
      <div class="about__content">
        <h2 id="about-title">Diseño con curiosidad.<br />Construyo con <span class="serif-accent">criterio.</span></h2>
        <div class="about__copy">
          <p>Soy Carlos, diseñador de producto digital y desarrollador frontend afincado en Madrid. Trabajo en el punto donde una buena idea se convierte en una experiencia clara, útil y memorable.</p>
          <p>Me interesan los sistemas, la tipografía y los pequeños detalles que hacen que un producto se sienta inevitable.</p>
          <a class="eyebrow" href="mailto:hola@carlosgonzalez.design">Hablemos de tu proyecto ↗</a>
        </div>
      </div>
    </section>
  </main>
  <AppFooter />
</template>

<style scoped>
.hero {
  position: relative;
  min-height: calc(100svh - clamp(4.25rem, 7vw, 6.5rem));
  overflow: hidden;
  padding: clamp(3rem, 7vw, 7rem) var(--page-x) clamp(3rem, 5vw, 5rem);

  & .hero__meta {
    display: flex;
    justify-content: space-between;
    gap: 1rem;

    span:last-child {
      text-align: right;
    }
  }

  h1 {
    position: relative;
    z-index: 1;
    max-width: none;
    margin-top: clamp(3rem, 7vw, 6.5rem);
    font-size: clamp(3.4rem, 7.5vw, 8.2rem);
    font-weight: 400;
    letter-spacing: -0.077em;
    line-height: 0.78;
  }

  & .hero__intro {
    position: absolute;
    z-index: 1;
    bottom: clamp(2.75rem, 5vw, 4.5rem);
    left: var(--page-x);
    max-width: 24rem;
    font-size: clamp(0.8rem, 1.1vw, 1rem);
    line-height: 1.35;
  }

  & .hero__monogram {
    position: absolute;
    right: -0.025em;
    bottom: -0.18em;
    color: rgb(255 88 56 / 9%);
    font-size: clamp(10rem, 27vw, 31rem);
    font-weight: 700;
    letter-spacing: -0.12em;
    line-height: 0.7;
  }

  & .hero__scroll {
    position: absolute;
    z-index: 2;
    right: var(--page-x);
    bottom: clamp(1.5rem, 3vw, 2.6rem);
    display: grid;
    width: clamp(3rem, 5vw, 4.75rem);
    aspect-ratio: 1;
    place-items: center;
    border: 1px solid var(--color-ink);
    border-radius: 50%;

    img {
      width: 1.15rem;
    }
  }
}

.projects {
  padding: var(--section-y) var(--page-x);
  background: var(--color-white);

  & .projects__heading {
    display: flex;
    align-items: end;
    justify-content: space-between;
    gap: 1rem;

    h2 {
      margin-block: 0.8rem clamp(1.5rem, 3vw, 2.2rem);
      font-size: clamp(2.55rem, 5.2vw, 5.6rem);
      font-weight: 400;
      letter-spacing: -0.065em;
      line-height: 0.9;
    }
  }
}

.about {
  min-height: min(46rem, 90vh);
  padding: var(--section-y) var(--page-x);

  & .about__top {
    display: flex;
    justify-content: space-between;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--color-line);

    span:last-child {
      font-size: 0.8rem;
    }
  }

  & .about__content {
    display: grid;
    gap: 3rem;
    padding-top: clamp(3rem, 7vw, 6rem);

    h2 {
      font-size: clamp(2.9rem, 6vw, 6.4rem);
      font-weight: 400;
      letter-spacing: -0.067em;
      line-height: 0.88;
    }
  }

  & .about__copy {
    max-width: 37rem;
    font-size: clamp(0.95rem, 1.25vw, 1.2rem);
    line-height: 1.45;

    p + p {
      margin-top: 1.4rem;
    }

    a {
      display: inline-block;
      margin-top: 2.6rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid;
    }
  }
}

@media (min-width: 48rem) {
  .hero__intro {
    left: 39%;
  }

  .about__content {
    grid-template-columns: 1.4fr 0.8fr;
    align-items: start;
  }
}

@media (max-width: 47.99rem) {
  .hero {
    min-height: 46rem;

    h1 {
      max-width: 100%;
      font-size: clamp(3.05rem, 13.5vw, 4.5rem);
      line-height: 0.88;
    }

    & .hero__meta span:last-child {
      max-width: 12rem;
    }

    & .hero__intro {
      right: 5rem;
    }
  }
}
</style>
