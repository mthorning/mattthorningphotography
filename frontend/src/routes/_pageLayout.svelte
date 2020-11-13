<style>
  div {
    background: var(--primary-bg-color);
    max-width: 800px;
    margin: 32px auto;
    padding: 32px;
  }
  @media screen and (max-width: 900px) {
    div {
      margin: 0 auto;
    }
  }
</style>

<div>
  <slot />
</div>
