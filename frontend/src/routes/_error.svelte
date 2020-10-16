<script lang="ts">
  export let status = 'Error'
  export let error

  const dev = process.env.NODE_ENV === 'development'
</script>

<style>
  div {
    margin: 32px;
  }
  h1,
  p {
    margin: 0 auto;
  }

  h1 {
    font-size: 2.8em;
    font-weight: 700;
    margin: 0 0 0.5em 0;
  }

  p {
    margin: 1em auto;
  }

  @media (min-width: 480px) {
    h1 {
      font-size: 4em;
    }
  }
</style>

<svelte:head>
  <title>{status}</title>
</svelte:head>

<div>
  <h1>{status}</h1>

  {#if error && error.message}
    <p>{error.message}</p>
  {/if}

  <slot />

  {#if dev && error && error.stack}
    <pre>{error.stack}</pre>
  {/if}
</div>
