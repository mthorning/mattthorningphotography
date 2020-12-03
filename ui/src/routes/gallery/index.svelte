<script context="module" lang="ts">
  export async function preload(page, session) {
    const res = await this.fetch('gallery.json')
    if (res.status === 200) {
      const data = await res.json()
      return { data }
    }
    this.error(404, 'Not Found')
  }
</script>

<script lang="ts">
  import { goto } from '@sapper/app'
  import Thumbnail from '../../components/Thumbnail.svelte'
  import Lightbox from '../../components/Lightbox.svelte'

  import type { Data } from './index.json'

  export let data: Data
  const photos = data.photos

  let selectedIdx: number
  $: selectedImage = photos[selectedIdx]

  function onImageClick(e: MouseEvent) {
    e.stopPropagation()
    goto(`/photo/${selectedImage.id}`, { replaceState: true })
  }
</script>

<style>
  div {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, max-content));
    grid-gap: 16px;
    justify-content: center;
    padding: initial;
  }
  @media (min-width: 600px) {
    div {
      grid-template-columns: repeat(auto-fit, minmax(250px, max-content));
    }
  }
</style>

<svelte:head>
  <title>Gallery</title>
</svelte:head>

<div data-test="gallery">
  {#if !photos || !photos.length}
    <h5>I thought I had more photos than this...</h5>
  {:else}
    {#each photos as photo, index}
      <Thumbnail
        isPortrait={photo?.isPortrait}
        alt={photo?.image?.alternativeText}
        url={photo?.image?.formats?.small?.url}
        on:click={() => (selectedIdx = index)} />
    {/each}
  {/if}
  {#if selectedImage}
    <Lightbox
      click
      alt={selectedImage?.image?.alternativeText}
      url={selectedImage?.image?.url}
      on:click={onImageClick}
      close={() => (selectedIdx = -1)}
      next={() => (selectedIdx = selectedIdx === photos.length - 1 ? 0 : selectedIdx + 1)}
      previous={() => (selectedIdx = selectedIdx === 0 ? photos.length - 1 : selectedIdx - 1)} />
  {/if}
</div>
