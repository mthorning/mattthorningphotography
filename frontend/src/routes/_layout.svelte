<script lang="ts">
  import { afterUpdate } from 'svelte'
  import Nav from '../components/Nav.svelte'

  export let segment
  let pathname
  afterUpdate(() => {
    pathname = window.location.pathname
  })
</script>

<style>
  main {
    height: 100vh;
    padding-top: 57px;
    margin: 0 auto;
    box-sizing: border-box;
  }
  @media (min-width: 400px) {
    main {
      padding-top: 0;
    }
  }
  .background {
    padding-top: 0;
    background-image: url(/misty-truro.jpg);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
</style>

<main class:background={pathname === '/'}>
  <Nav home={pathname === '/'} {segment} />
  <slot />
</main>
