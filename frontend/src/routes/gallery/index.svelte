<script context="module">
  export async function preload(page, session) {
    const res = await this.fetch('gallery.json')
    if (res.status === 200) {
      const photos = await res.json()
      return { photos }
    }
    this.error(404, 'Not Found')
  }
</script>

<script>
  import { goto } from '@sapper/app'
  import Thumbnail from '../../components/Thumbnail.svelte'
  import Lightbox from '../../components/Lightbox.svelte'
  export let photos = []

  let selectedIdx
  $: selectedImage = photos[selectedIdx]

  function onImageClick(e) {
    e.stopPropagation()
    goto(`/photo/${selectedImage.id}`)
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
  :global(.pointer) {
    cursor: pointer;
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
    {#each photos as photos, index}
      <Thumbnail
        isPortrait={photos.isPortrait}
        alt={photos.alt}
        url={photos.formats.small.url}
        on:click={() => (selectedIdx = index)} />
    {/each}
  {/if}
  {#if selectedImage}
    <Lightbox
      isPortrait={selectedImage.isPortrait}
      alt={selectedImage.alt}
      url={selectedImage.formats.large.url}
      on:click={onImageClick}
      class="pointer"
      close={() => (selectedIdx = -1)}
      next={() => (selectedIdx = selectedIdx === photos.length - 1 ? 0 : selectedIdx + 1)}
      previous={() => (selectedIdx = selectedIdx === 0 ? photos.length - 1 : selectedIdx - 1)} />
  {/if}
</div>
