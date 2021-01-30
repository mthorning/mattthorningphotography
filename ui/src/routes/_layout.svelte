<script lang="ts">
  import { afterUpdate } from 'svelte'
  import Nav from '../components/Nav.svelte'

  export let segment: string
  let pathname: string

  afterUpdate(() => {
    pathname = window.location.pathname
  })
  $: home = pathname === '/'
</script>

<style>
  main {
    min-height: 100vh;
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
  <Nav
    style={`
      --nav-bg-color: ${home ? 'rgba(0, 0, 0, 0)' : 'var(--primary-bg-color)'};
      --nav-dropdown-bg: rgba(${home ? '123, 93, 104, 0.9' : '25, 25, 28, 0.9'});
      --nav-dropdown-border: #444; 
      --mobile-button-bg: rgba(255, 255, 255, 0.05);
      --mobile-button-color: var(--primary-color);
      --nav-selected-underline-color: var(--primary-color);
      --nav-z-index: 110;
    `}
    {segment} />
  <slot />
</main>
