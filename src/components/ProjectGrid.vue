<script setup>
import ProjectCard from './ProjectCard.vue'

defineProps({ projects: { type: Array, required: true } })
</script>

<template>
  <div v-if="projects.length" class="project-grid">
    <ProjectCard v-for="(project, index) in projects" :key="project.id" :project="project" :index="index" />
  </div>
  <section v-else class="project-empty" role="status" aria-live="polite">
    <h3>No encontramos ese <span class="serif-accent">proyecto.</span></h3>
  </section>
</template>

<style scoped>
.project-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(4rem, 9vw, 8rem) clamp(1.5rem, 4vw, 4rem);
  padding-top: clamp(3.5rem, 8vw, 7rem);

}

.project-empty {
  padding-block: clamp(5rem, 10vw, 9rem);

  h3 {
    max-width: 100%;
    font-size: clamp(1.05rem, 5vw, 5rem);
    font-weight: 400;
    letter-spacing: -0.07em;
    line-height: 1;
    white-space: nowrap;

    span {
      color: var(--color-accent);
    }
  }
}

@media (min-width: 48rem) {
  .project-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;

    > :nth-child(even) {
      margin-top: clamp(4rem, 9vw, 9rem);
    }
  }
}
</style>
