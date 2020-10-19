<script lang="ts">
  import { afterUpdate } from 'svelte'
  import Nav from '../components/Nav.svelte'

  export let segment: 'gallery' | 'about' | 'contact'
  let pathname: string
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

  :root {
    --text-color-to-rgb: 69, 85, 101;
  }

  :global(*::-webkit-scrollbar) {
    width: 6px;
    height: 6px;
  }

  :global(*) {
    scrollbar-width: thin;
    scrollbar-color: rgba(var(--text-color-to-rgb), 0.2)
      rgba(var(--text-color-to-rgb), 0);
  }
  :global(*:hover) {
    scrollbar-color: rgba(var(--text-color-to-rgb), 0.4)
      rgba(var(--text-color-to-rgb), 0);
  }
  :global(*::-webkit-scrollbar-track) {
    background: rgba(var(--text-color-to-rgb), 0);
    border: none;
  }
  :global(*::-webkit-scrollbar-corner) {
    background: rgba(var(--text-color-to-rgb), 0);
  }
  :global(*::-webkit-scrollbar-thumb) {
    background-color: rgba(var(--text-color-to-rgb), 0.2);
    border-radius: 3px;
    border: none;
  }
  :global(*:hover::-webkit-scrollbar-track) {
    background-color: rgba(var(--text-color-to-rgb), 0);
  }
  :global(*:hover::-webkit-scrollbar-thumb) {
    background-color: rgba(var(--text-color-to-rgb), 0.4);
  }
</style>

<main class:background={pathname === '/'}>
  <Nav home={pathname === '/'} {segment} />
  <slot />
</main>
