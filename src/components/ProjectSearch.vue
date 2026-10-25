<script setup>
// defineModel crea el contrato v-model entre este campo y HomeView.
const model = defineModel({ type: String, default: '' })
</script>

<template>
  <label class="project-search">
    <img src="/images/icons/search.svg" alt="" aria-hidden="true" />
    <input
      v-model="model"
      type="search"
      name="project-search"
      placeholder="Buscar por nombre"
      autocomplete="off"
      aria-label="Buscar proyectos por nombre"
    />
  </label>
</template>

<style scoped>
.project-search {
  position: relative;
  display: grid;
  min-height: clamp(3.75rem, 6vw, 5rem);
  grid-template-columns: 1.2rem 1fr;
  gap: 0.75rem;
  align-items: center;
  border-block: 1px solid var(--color-line);
  cursor: text;

  img {
    width: 1rem;
  }

  input {
    width: 100%;
    min-width: 0;
    border: 0;
    outline: 0;
    background: transparent;
    font-size: 0.95rem;

    &::placeholder {
      color: var(--color-muted);
      font-family: var(--font-mono);
      font-size: 0.61rem;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      opacity: 1;
    }
  }
}
</style>
