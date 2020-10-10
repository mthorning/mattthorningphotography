<script>
  import { createEventDispatcher } from 'svelte'
  import Lightbox from './Lightbox.svelte'
  import Img from './Img.svelte'

  export let photo

  const {
    isPortrait,
    exif: { FNumber, FocalLength, ShutterSpeedValue, ISO },
  } = photo

  $: apperture = FNumber
  $: focalLength = FocalLength
  $: iso = ISO
  $: shutter =
    ShutterSpeedValue >= 1
      ? Math.round(ShutterSpeedValue * 10) / 10
      : `1/${Math.round(1 / ShutterSpeedValue)}`

  const dispatch = createEventDispatcher()
  let touchstart = 0
  let showLightbox = false
  let photoLoaded = false
  let photoWrapper

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
  .photo-wrapper {
    background: url('/spinner.gif') no-repeat center;
    background-size: 75px;
    text-align: center;
  }
  :global(.photo) {
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
  <div bind:this={photoWrapper} class="photo-wrapper">
    <Img
      on:click={() => (showLightbox = true)}
      alt={photo.alt}
      class="photo"
      src={photo.formats.medium.url}
      afterLoaded={(photo) => {
        photoLoaded = true
        photo.style.width = 'auto'
        photo.style.height = 'auto'
      }} />
    {#if photo.showExif && apperture && shutter && iso && focalLength}
      <p>f{apperture} | {shutter}sec | ISO {iso} | {focalLength}mm</p>
    {/if}
  </div>
</div>
{#if showLightbox}
  <Lightbox
    {isPortrait}
    url={photo.formats.large.url}
    close={closeLightbox}
    on:click={closeLightbox} />
{/if}
