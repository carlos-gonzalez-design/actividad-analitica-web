<template>
  <footer class="site-footer">
    <p class="eyebrow">¿Tienes una idea?</p>
    <div class="site-footer__main">
      <h2>Hagamos algo<br />que <span class="serif-accent">importe.</span></h2>
      <a href="mailto:hola@carlosgonzalez.design">hola@carlosgonzalez.design <span aria-hidden="true">↗</span></a>
    </div>
    <div class="site-footer__bottom eyebrow">
      <span>© 2026 Carlos González</span>
      <nav aria-label="Redes sociales">
        <a href="https://www.linkedin.com" rel="noreferrer">LinkedIn</a>
        <a href="https://www.behance.net" rel="noreferrer">Behance</a>
        <a href="https://www.instagram.com" rel="noreferrer">Instagram</a>
      </nav>
      <a href="#top">Volver arriba ↑</a>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  min-height: min(48rem, 90vh);
  padding: clamp(4rem, 8vw, 7rem) var(--page-x) 1.5rem;
  color: var(--color-paper);
  background: var(--color-ink);

  & .site-footer__main {
    display: grid;
    gap: 3rem;
    margin-top: clamp(3rem, 7vw, 6rem);

    h2 {
      max-width: 10ch;
      font-size: clamp(3.5rem, 9vw, 8.6rem);
      font-weight: 300;
      letter-spacing: -0.075em;
      line-height: 0.82;

      span {
        color: var(--color-accent);
      }
    }

    a {
      width: fit-content;
      align-self: end;
      padding-bottom: 0.45rem;
      border-bottom: 1px solid rgb(242 240 235 / 45%);
      font-family: var(--font-mono);
      font-size: clamp(0.65rem, 1vw, 0.82rem);
    }
  }

  & .site-footer__bottom {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 1rem;
    margin-top: clamp(6rem, 14vw, 12rem);
    color: rgb(242 240 235 / 58%);

    nav {
      display: flex;
      gap: 1rem;
    }
  }
}

@media (min-width: 48rem) {
  .site-footer__main {
    grid-template-columns: 1.15fr 0.85fr;
  }
}
</style>
