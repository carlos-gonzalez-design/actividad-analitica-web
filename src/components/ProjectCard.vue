<script setup>
// La prop permite reutilizar la misma tarjeta con cualquier entrada del JSON.
defineProps({
  project: { type: Object, required: true },
  index: { type: Number, required: true },
})
</script>

<template>
  <article class="project-card" :style="{ '--card-color': project.color }">
    <RouterLink class="project-card__link" :to="`/proyecto/${project.slug}`">
      <div class="project-card__media">
        <span class="project-card__number eyebrow">{{ String(index + 1).padStart(2, '0') }}</span>
        <img
          :src="project.image"
          :alt="`Portada del proyecto ${project.name}`"
          :loading="index > 1 ? 'lazy' : 'eager'"
          width="1200"
          height="900"
        />
      </div>
      <div class="project-card__info">
        <div>
          <h3>{{ project.name }}</h3>
          <p>{{ project.description }}</p>
        </div>
        <p class="project-card__meta eyebrow">
          <span>{{ project.category }}</span>
          <span>{{ project.year }}</span>
        </p>
      </div>
    </RouterLink>
  </article>
</template>

<style scoped>
.project-card {
  container-type: inline-size;

  & .project-card__link {
    display: block;
  }

  & .project-card__media {
    position: relative;
    overflow: hidden;
    padding: clamp(0.8rem, 3.2vw, 2.5rem);
    background: var(--card-color);

    img {
      width: 100%;
      height: auto;
      aspect-ratio: 4 / 3;
      object-fit: cover;
      transition: transform 600ms cubic-bezier(.2, .7, .2, 1);
    }
  }

  & .project-card__number {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    display: grid;
    width: 2rem;
    aspect-ratio: 1;
    place-items: center;
    background: var(--color-paper);
  }

  & .project-card__info {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding-top: 0.85rem;
    border-top: 1px solid var(--color-line);

    h3 {
      font-size: clamp(1.35rem, 3vw, 2rem);
      font-weight: 400;
      letter-spacing: -0.055em;
      line-height: 0.95;
    }

    p:not(.project-card__meta) {
      margin-top: 0.55rem;
      color: var(--color-muted);
      font-size: clamp(0.72rem, 1vw, 0.82rem);
      line-height: 1.4;
    }
  }

  & .project-card__meta {
    display: flex;
    flex: 0 0 auto;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.35rem;
    text-align: right;
  }

  &:hover img {
    transform: scale(1.018);
  }
}

@container (max-width: 24rem) {
  .project-card__info {
    display: block;
  }

  .project-card__meta {
    margin-top: 0.9rem;
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
