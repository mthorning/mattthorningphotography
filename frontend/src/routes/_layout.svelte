<script lang="ts">
  import { afterUpdate } from 'svelte'
  import Nav from '../components/Nav.svelte'
  import FaInstagram from 'svelte-icons/fa/FaInstagram.svelte'
  import FaTwitterSquare from 'svelte-icons/fa/FaTwitterSquare.svelte'

  import type { Route } from '../components/Nav.svelte'

  const routes: Route[] = [
    { name: 'gallery', href: '/gallery', regex: new RegExp(/(photo|gallery)/) },
    { name: 'about', href: '/about', regex: new RegExp(/about/) },
    { name: 'contact', href: '/contact', regex: new RegExp(/contact/) },
  ]
  export let segment: 'gallery' | 'about' | 'contact'
  let pathname: string
  afterUpdate(() => {
    pathname = window.location.pathname
  })
  $: home = pathname === '/'
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
  ul {
    margin: 0;
    padding: 0;
  }
  li {
    display: block;
    float: left;
  }
  a {
    text-decoration: none;
    padding: 1em 0.5em;
    display: inline-block;
    width: 1em;
    padding-top: 18px;
    padding-bottom: 10px;
  }
</style>

<main class:background={pathname === '/'}>
  <Nav
    style={`
      --nav-bg-color: ${home ? 'rgba(0, 0, 0, 0)' : '#19191c'};
      --nav-dropdown-bg: rgba(${home ? '123, 93, 104, 0.9' : '25, 25, 28, 0.9'});
      --nav-dropdown-border: #444; 
      --nav-dropdown-height: ${48.8 * 4};
      --mobile-button-bg: rgba(255, 255, 255, 0.05);
      --mobile-button-color: #f0f0f0;
      --nav-selected-underline-color: #f0f0f0;
      --nav-z-index: 110;
    `}
    {segment}
    {routes}>
    <ul class="social">
      <li>
        <a class="icon" href="https://www.instagram.com/matt.thorning/">
          <FaInstagram />
        </a>
      </li>
      <li>
        <a class="icon" href="https://twitter.com/MattThorning">
          <FaTwitterSquare />
        </a>
      </li>
    </ul>
  </Nav>
  <slot />
</main>
