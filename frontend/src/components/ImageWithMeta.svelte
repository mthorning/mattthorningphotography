<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import Lightbox from './Lightbox.svelte'
  import Img from './Img.svelte'

  import type { Exif } from '../types'

  export let alt: string, exif: Exif, mediumURL: string, largeURL: string
  const { aperture, focalLength, iso, shutter, bracketed } = exif

  const dispatch = createEventDispatcher()
  let touchstart = 0
  let showLightbox = false

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
  <div class="photo-wrapper">
    <Img
      on:click={() => (showLightbox = true)}
      {alt}
      class="photo"
      src={mediumURL}
      afterLoaded={(photo) => {
        photo.style.width = 'auto'
        photo.style.height = 'auto'
      }} />
    {#if exif.show && aperture && shutter && iso && focalLength}
      <p>
        f{aperture}
        |
        {bracketed ? 'bracketed' : `${shutter}sec`}
        | ISO
        {iso}
        |
        {focalLength}mm
      </p>
    {/if}
  </div>
</div>
{#if showLightbox}
  <Lightbox
    url={largeURL}
    close={closeLightbox}
    on:click={closeLightbox} />
{/if}
