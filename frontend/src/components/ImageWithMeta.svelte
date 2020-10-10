<script>
  import { createEventDispatcher } from 'svelte'
  import Lightbox from './Lightbox.svelte'
  import Img from './Img.svelte'

  export let meta, isPortrait, fileName, type

  $: apperture = meta.apperture
  $: focalLength = meta.focalLength
  $: iso = meta.iso
  $: shutter =
    meta.shutter >= 1
      ? Math.round(meta.shutter * 10) / 10
      : `1/${Math.round(1 / meta.shutter)}`

  const dispatch = createEventDispatcher()
  let touchstart = 0
  let showLightbox = false
  let imageLoaded = false
  let imageWrapper

  function closeLightbox() {
    showLightbox = false
  }

  function onTouchstart({ changedTouches }) {
    touchstart = changedTouches[0].screenX
  }

  function onTouchend({ changedTouches }) {
    const touchend = changedTouches[0].screenX
    if (touchend < touchstart) {
      dispatch('swipeleft')
    }
    if (touchend > touchstart) {
      dispatch('swiperight')
    }
  }
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  p {
    margin: 0;
    text-align: right;
  }
  .image-wrapper {
    background: url('/spinner.gif') no-repeat center;
    background-size: 75px;
    text-align: center;
  }
  :global(.image) {
    cursor: pointer;
    max-width: 100%;
    max-height: 50vh;
  }
</style>

<!-- svelte-ignore a11y-autofocus -->
<div
  class="container"
  on:click
  on:touchstart={onTouchstart}
  on:touchend={onTouchend}>
  <div bind:this={imageWrapper} class="image-wrapper">
    <Img
      on:click={() => (showLightbox = true)}
      alt={fileName}
      class="image"
      src={`images/fullsize/${fileName}.${type}`}
      afterLoaded={(image) => {
        imageLoaded = true
        image.style.width = 'auto'
        image.style.height = 'auto'
      }} />
    {#if apperture && shutter && iso && focalLength}
      <p>f{apperture} | {shutter}sec | ISO {iso} | {focalLength}mm</p>
    {/if}
  </div>
</div>
{#if showLightbox}
  <Lightbox
    {...{ fileName, type, isPortrait }}
    close={closeLightbox}
    on:click={closeLightbox} />
{/if}
