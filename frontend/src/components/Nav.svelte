<script lang="ts">
    import { onMount } from "svelte";
    import FaBars from "svelte-icons/fa/FaBars.svelte";

    export let segment: string,
        style: string,
        homePageName: string = "home",
        routes: string[] = [];

    let open = false;
    let nav: HTMLElement;
    const toggleOpen = () => (open = open ? false : true);

    const handleDocClick = ({ target }) => {
        if (open && !nav.contains(target)) open = false;
    };

    onMount(() => {
        document.addEventListener("click", handleDocClick);
    });

    const detectAnchorClick = (e: MouseEvent) => {
        const element = e.target as HTMLElement;
        if (element.tagName === "A") open = false;
    };
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
        content: "";
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
        background: var(--nav-dropdown-bg);
    }
    .open {
        height: var(--nav-dropdown-height);
        border-bottom: 1px solid var(--nav-dropdown-border);
    }
    .menu-items li a {
        width: 100%;
        text-align: center;
    }
    a {
        text-decoration: none;
        padding: 1em 0.5em;
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
            content: "";
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
                    aria-current={segment === route ? 'page' : undefined}
                    href={`/${route}`}>
                    {route}
                </a>
            </li>
        {/each}
    </ul>
    <slot />
</nav>
