<script lang="ts">
  import { onMount } from 'svelte'
  import FaBars from 'svelte-icons/fa/FaBars.svelte'
  import FaInstagram from 'svelte-icons/fa/FaInstagram.svelte'
  import FaTwitterSquare from 'svelte-icons/fa/FaTwitterSquare.svelte'

  interface Route {
    name: string
    href: string
    regex: RegExp
  }

  export let segment: string,
    style: string,
    homePageName: string = 'home'

  const routes: Route[] = [
    { name: 'gallery', href: '/photo', regex: new RegExp(/photo/) },
    { name: 'about', href: '/about', regex: new RegExp(/about/) },
    { name: 'contact', href: '/contact', regex: new RegExp(/contact/) },
  ]

  let open = false
  let nav: HTMLElement
  const toggleOpen = () => (open = open ? false : true)

  const handleDocClick = ({ target }) => {
    if (open && !nav.contains(target)) open = false
  }

  onMount(() => {
    document.addEventListener('click', handleDocClick)
  })

  const detectAnchorClick = (e: MouseEvent) => {
    const element = e.target as HTMLElement
    if (element.tagName === 'A') open = false
  }
</script>

<style>
  nav {
    font-weight: 300;
    padding: 0 1em;
    display: flex;
    box-sizing: border-box;
    width: 100%;
    height: 57px;
    justify-content: space-between;
    background: var(--nav-bg-color);
    position: fixed;
    top: 0;
    z-index: var(--nav-z-index, 1);
  }
  ul {
    margin: 0;
    padding: 0;
  }
  /* clearfix */
  ul::after {
    content: '';
    display: block;
    clear: both;
  }
  li {
    list-style-type: none;
  }
  .menu-items {
    z-index: 10;
    position: fixed;
    left: 0;
    top: 57px;
    width: 100vw;
    height: 0;
    overflow: hidden;
    transition: 0.5s ease-in-out height;
    background: var(--nav-dropdown-bg);
  }
  .open {
    height: 200px;
    border-bottom: 1px solid var(--nav-dropdown-border);
  }
  .menu-items li a {
    width: 100%;
    text-align: center;
  }
  a {
    text-decoration: none;
    padding: 0.7em 0.5em;
    font-size: 1.2em;
    display: inline-block;
  }
  button {
    width: 3em;
    height: 3em;
    padding: 12px;
    color: var(--mobile-button-color);
    background: var(--mobile-button-bg);
    align-self: center;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    display: flex;
    align-items: center;
  }
  button:focus {
    outline: none;
  }
  .social li {
    display: block;
    float: left;
  }
  .icon {
    text-decoration: none;
    padding: 1em 0.5em;
    display: inline-block;
    width: 1em;
    padding-top: 18px;
    padding-bottom: 10px;
  }
  @media (min-width: 400px) {
    nav {
      position: static;
    }
    button {
      display: none;
    }
    .menu-items {
      z-index: initial;
      position: initial;
      width: initial;
      border-bottom: 0;
      height: initial;
      background: rgba(0, 0, 0, 0);
    }
    .menu-items li {
      display: block;
      float: left;
    }
    .menu-items li a {
      width: initial;
    }
    [aria-current] {
      position: relative;
      display: inline-block;
    }

    [aria-current]::after {
      position: absolute;
      content: '';
      width: calc(100% - 10px);
      height: 1px;
      background-color: var(--nav-selected-underline-color);
      display: block;
      bottom: 2px;
      left: 5px;
    }
  }
</style>

<nav {style} bind:this={nav}>
  <button on:click={toggleOpen}>
    <FaBars />
  </button>
  <ul
    data-test="menu-items"
    class:open
    class="menu-items"
    on:click={detectAnchorClick}>
    <li>
      <a
        rel="prefetch"
        aria-current={segment === undefined ? 'page' : undefined}
        href="/">
        {homePageName}
      </a>
    </li>
    <li />
    {#each routes as route}
      <li>
        <a
          rel="prefetch"
          aria-current={route.regex.test(segment) ? 'page' : undefined}
          href={route.href}>
          {route.name}
        </a>
      </li>
    {/each}
  </ul>
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
</nav>
