<script setup>
import { computed } from 'vue'
import projects from '../data/projects.json'

const props = defineProps({ slug: { type: String, required: true } })

// La ruta dinámica entrega el slug; computed resuelve el proyecto y su siguiente caso.
const projectIndex = computed(() => projects.findIndex((item) => item.slug === props.slug))
const project = computed(() => projects[projectIndex.value])
const nextProject = computed(() => project.value ? projects[(projectIndex.value + 1) % projects.length] : null)
</script>

<template>
  <main id="contenido" class="case-study">
    <template v-if="project">
      <section class="case-hero" :style="{ '--project-color': project.color }">
        <div class="case-hero__meta eyebrow">
          <span>{{ project.category }}</span>
          <span>({{ String(project.id).padStart(2, '0') }}/{{ String(projects.length).padStart(2, '0') }})</span>
        </div>
        <h1>{{ project.name }}</h1>
        <div class="case-hero__intro">
          <p>{{ project.details.intro }}</p>
          <dl>
            <div>
              <dt>Año</dt>
              <dd>{{ project.year }}</dd>
            </div>
            <div>
              <dt>Servicios / tecnologías</dt>
              <dd>{{ project.technologies.join(' · ') }}</dd>
            </div>
          </dl>
        </div>
        <figure class="case-hero__cover">
          <img :src="project.image" :alt="`Imagen principal de ${project.name}`" width="1600" height="1200" />
          <span aria-hidden="true">{{ String(project.id).padStart(2, '0') }}</span>
        </figure>
      </section>

      <section class="case-story" aria-label="Sobre el proyecto">
        <div class="case-story__row">
          <span class="eyebrow">01 · Contexto</span>
          <p class="case-story__lead">{{ project.details.summary }}</p>
        </div>
        <div class="case-story__row">
          <span class="eyebrow">02 · El reto</span>
          <div>
            <h2>{{ project.details.headline }}</h2>
            <p>{{ project.details.body }}</p>
          </div>
        </div>
      </section>

      <section v-if="project.gallery?.length" class="case-gallery" aria-label="Galería del proyecto">
        <img
          v-for="(image, index) in project.gallery"
          :key="image"
          :class="{ 'case-gallery__image--wide': index === 0 && project.gallery.length > 1 }"
          :src="image"
          :alt="`Vista ${index + 1} del proyecto ${project.name}`"
          loading="lazy"
        />
      </section>

      <section class="case-closing">
        <span class="eyebrow">03 · El resultado</span>
        <div>
          <h2>{{ project.details.closing }}</h2>
          <p>Una solución flexible y coherente, pensada para acompañar al producto más allá de su lanzamiento.</p>
        </div>
      </section>

      <RouterLink
        v-if="nextProject"
        class="next-project"
        :to="`/proyecto/${nextProject.slug}`"
        :style="{ '--next-color': nextProject.color }"
      >
        <span class="eyebrow">Siguiente proyecto</span>
        <span class="next-project__title">{{ nextProject.name }}</span>
        <img src="/images/icons/arrow-right.svg" alt="" aria-hidden="true" />
      </RouterLink>
    </template>

    <section v-else class="not-found">
      <p class="eyebrow">404 · Proyecto no encontrado</p>
      <h1>Este proyecto no existe.</h1>
      <RouterLink to="/#proyectos">← Volver a todos los proyectos</RouterLink>
    </section>
  </main>
</template>

<style scoped>
.case-hero {
  padding: clamp(3rem, 6vw, 6rem) var(--page-x) var(--section-y);

  & .case-hero__meta {
    display: flex;
    justify-content: space-between;
  }

  h1 {
    margin-top: clamp(3rem, 8vw, 8rem);
    font-size: clamp(4rem, 11vw, 12rem);
    font-weight: 400;
    letter-spacing: -0.08em;
    line-height: 0.78;
  }

  & .case-hero__intro {
    display: grid;
    gap: 2rem;
    margin: clamp(3rem, 7vw, 7rem) 0 clamp(3rem, 6vw, 6rem);

    > p {
      max-width: 36rem;
      font-size: clamp(1.25rem, 2.2vw, 2rem);
      letter-spacing: -0.03em;
      line-height: 1.25;
    }

    dl {
      margin: 0;
    }

    dl > div {
      display: grid;
      grid-template-columns: minmax(7rem, 1fr) 2fr;
      padding-block: 0.7rem;
      border-block: 1px solid var(--color-line);
      font-family: var(--font-mono);
      font-size: clamp(0.54rem, 0.75vw, 0.68rem);
      text-transform: uppercase;

      & + div {
        border-top: 0;
      }
    }

    dd {
      margin: 0;
    }
  }

  & .case-hero__cover {
    position: relative;
    overflow: hidden;
    margin: 0;
    padding: clamp(1rem, 4vw, 5rem);
    background: var(--project-color);

    img {
      position: relative;
      z-index: 1;
      width: 100%;
      height: auto;
      max-height: 70rem;
      aspect-ratio: 16 / 9;
      object-fit: cover;
    }

    > span {
      position: absolute;
      right: -0.05em;
      bottom: -0.25em;
      color: rgb(242 240 235 / 16%);
      font-size: clamp(8rem, 20vw, 25rem);
      font-weight: 700;
      line-height: 1;
    }
  }
}

.case-story {
  padding: clamp(2rem, 4vw, 4rem) var(--page-x) var(--section-y);

  & .case-story__row {
    display: grid;
    gap: 2rem;
    padding-block: clamp(2.5rem, 6vw, 5rem);
    border-top: 1px solid var(--color-line);

    > div,
    > p {
      max-width: 34rem;
    }

    h2,
    > p {
      font-size: clamp(2.2rem, 4vw, 4rem);
      font-weight: 400;
      letter-spacing: -0.055em;
      line-height: 0.95;
    }

    div > p {
      max-width: 30rem;
      margin-top: 1.5rem;
      color: var(--color-muted);
      line-height: 1.5;
    }
  }
}

.case-gallery {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(0.75rem, 2vw, 2rem);
  padding: clamp(1.25rem, 3vw, 4rem);
  background: var(--color-ink);

  img {
    width: 100%;
    height: 100%;
    min-height: 16rem;
    object-fit: cover;
  }
}

.case-closing {
  display: grid;
  gap: 2rem;
  padding: var(--section-y) var(--page-x);

  > div {
    max-width: 35rem;
  }

  h2 {
    font-size: clamp(2.6rem, 5vw, 5rem);
    font-weight: 400;
    letter-spacing: -0.06em;
    line-height: 0.92;
  }

  p {
    max-width: 30rem;
    margin-top: 1.4rem;
    color: var(--color-muted);
    line-height: 1.5;
  }
}

.next-project {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem;
  align-items: end;
  min-height: clamp(18rem, 34vw, 32rem);
  padding: clamp(3rem, 7vw, 7rem) var(--page-x);
  background: var(--next-color);

  > .eyebrow {
    grid-column: 1 / -1;
  }

  & .next-project__title {
    font-size: clamp(3rem, 7vw, 7.5rem);
    letter-spacing: -0.07em;
    line-height: 0.9;
  }

  img {
    width: clamp(2.5rem, 5vw, 5rem);
  }
}

.not-found {
  min-height: calc(100vh - 6rem);
  padding: var(--section-y) var(--page-x);

  h1 {
    max-width: 10ch;
    margin-block: 2rem 4rem;
    font-size: clamp(3.5rem, 9vw, 9rem);
    font-weight: 400;
    letter-spacing: -0.07em;
    line-height: 0.9;
  }

  a {
    border-bottom: 1px solid;
  }
}

@media (min-width: 48rem) {
  .case-hero__intro,
  .case-story__row,
  .case-closing {
    grid-template-columns: 1fr 1.1fr;
  }

  .case-hero__intro > p,
  .case-hero__intro dl,
  .case-story__row > div,
  .case-story__row > p,
  .case-closing > div {
    grid-column: 2;
  }

  .case-story__row > .eyebrow,
  .case-closing > .eyebrow {
    grid-column: 1;
    grid-row: 1;
  }

  .case-gallery {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    & .case-gallery__image--wide {
      grid-column: 1 / -1;
      aspect-ratio: 2 / 1;
    }
  }
}
</style>
