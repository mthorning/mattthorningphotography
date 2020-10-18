<script lang="ts">
  import { onMount } from 'svelte'
  import FaInstagram from 'svelte-icons/fa/FaInstagram.svelte'
  import FaTwitterSquare from 'svelte-icons/fa/FaTwitterSquare.svelte'
  import FaBars from 'svelte-icons/fa/FaBars.svelte'
  export let segment: 'gallery' | 'about' | 'contact'
  export let home: boolean

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
    background: #19191c;
    position: fixed;
    top: 0;
    z-index: 1;
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
    transition: 0.3s ease-in-out height;
    background: rgba(25, 25, 28, 0.9);
  }
  .open {
    height: 196.2px;
    border-bottom: 1px solid #444;
  }
  .menu-items li a {
    width: 100%;
    text-align: center;
  }
  .social li {
    display: block;
    float: left;
  }
  a {
    text-decoration: none;
    padding: 1em 0.5em;
    display: block;
    display: inline-block;
  }
  .icon {
    width: 1em;
    padding-top: 18px;
    padding-bottom: 10px;
  }
  button {
    width: 3em;
    height: 3em;
    padding: 12px;
    color: #f0f0f0;
    background: rgba(255, 255, 255, 0.05);
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
  nav.home {
    background: rgba(0, 0, 0, 0);
  }
  ul.home {
    background: rgba(123, 93, 104, 0.9);
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
    ul.home {
      background: rgba(0, 0, 0, 0);
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
      background-color: #f0f0f0;
      display: block;
      bottom: 2px;
      left: 5px;
    }
  }
</style>

<nav bind:this={nav} class:home>
  <button on:click={toggleOpen}>
    <FaBars />
  </button>
  <ul
    data-test="menu-items"
    class:home
    class:open
    class="menu-items"
    on:click={detectAnchorClick}>
    <li>
      <a
        rel="prefetch"
        aria-current={segment === undefined ? 'page' : undefined}
        href="/">
        home
      </a>
    </li>
    <li />
    <li>
      <a
        rel="prefetch"
        aria-current={segment === 'gallery' ? 'page' : undefined}
        href="/gallery">
        gallery
      </a>
    </li>
    <li>
      <a
        rel="prefetch"
        aria-current={segment === 'about' ? 'page' : undefined}
        href="/about">
        about
      </a>
    </li>
    <li>
      <a
        rel="prefetch"
        aria-current={segment === 'contact' ? 'page' : undefined}
        href="/contact">
        contact
      </a>
    </li>
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
