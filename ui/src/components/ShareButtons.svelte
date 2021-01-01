<script lang="ts">
  import {
    Email,
    Reddit,
    LinkedIn,
    Pinterest,
    Tumblr,
    WhatsApp,
    Facebook,
    Twitter,
  } from 'svelte-share-buttons-component'
  import { stores } from '@sapper/app'
  export let title: string
  let url: string
  const { page } = stores()
  page.subscribe(({ host, path }) => {
    url = `https://${host}${path}`
  })
  const desc = `Matt Thorning Photography`
</script>

<style>
  div {
    display: flex;
    position: absolute;
    align-items: center;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--primary-bg-color);
    height: 40px;
    top: -20px;
    font-size: 18px;
  }
  :global(.ssbc-button--override) {
    margin: 0 4px;
  }
  :global(.ssbc-button--override),
  :global(.ssbc-button--override):hover {
    background-color: var(--primary-bg-color);
    padding: 0 !important;
  }

  :global(.ssbc-button--override div) {
    display: flex !important;
    height: 100%;
    align-items: baseline;
  }
  :global(.ssbc-button--override):hover {
    font-size: 26.4px;
    margin: 0;
  }
  @media (min-width: 400px) {
    div {
      height: 40px;
      top: -20px;
      font-size: 20px;
    }
    :global(.ssbc-button--override) {
      margin: 0 9px;
    }
    :global(.ssbc-button--override):hover {
      font-size: 38.3px;
    }
  }
</style>

<div class="share-buttons">
  <Email class="ssbc-button--override" subject={title} body="{desc} {url}" />
  <Reddit class="ssbc-button--override" {title} {url} />
  <LinkedIn class="ssbc-button--override" {url} />
  <Tumblr class="ssbc-button--override" {title} {url} caption={title} />
  <Pinterest class="ssbc-button--override" {url} description={title} />
  <WhatsApp class="ssbc-button--override" text="{title} {url}" />
  <Facebook class="ssbc-button--override" {url} />
  <Twitter class="ssbc-button--override" text={title} {url} />
</div>
