<script context="module" lang="ts">
  export async function preload(page, session) {
    const res = await this.fetch(`about.json`)
    if (res.status === 200) {
      const data: Data = await res.json()
      return { data }
    }

    this.error(404, 'Not Found')
  }
</script>

<script lang="ts">
  import type { Data } from './_types'

  export let data: Data
  const {
    about: { title, body, image },
  } = data
</script>

<style>
  div {
    max-width: 56em;
    margin: auto;
  }
  .photo {
    width: 100%;
    border: 1px solid #f0f0f0;
    height: 300px;
    margin: 20px auto;
    background-image: var(--image-url);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
</style>

<svelte:head>
  <title>About</title>
</svelte:head>

<div>
  <h1>{title}</h1>

  {#if image.url}
    <div
      data-test="photo"
      style={`--image-url:url(${image.url})`}
      class="photo" />
  {/if}
  <div data-test="some-gibberish">
    {@html body}
  </div>
</div>
