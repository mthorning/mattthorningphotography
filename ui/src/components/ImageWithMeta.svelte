<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import Lightbox from './Lightbox.svelte'
  import Img from './Img.svelte'
  import Spinner from './Spinner.svelte'

  import type { Exif } from '../types'

  export let alt: string, exif: Exif, mediumURL: string, largeURL: string
  let imageLoaded = false

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
  .wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .container {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  p {
    margin: 0;
    text-align: right;
    align-self: flex-end;
  }
  .min-dimensions {
    height: 396px;
    width: 300px;
  }
</style>

<!-- svelte-ignore a11y-autofocus -->
<div class="wrapper">
  <div
    class="container"
    class:min-dimensions={!imageLoaded}
    on:click
    on:touchstart={onTouchstart}
    on:touchend={onTouchend}>
    {#if !imageLoaded}
      <Spinner
        style={`
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    `} />
    {/if}
    <Img
      on:click={() => (showLightbox = true)}
      {alt}
      style={`
        cursor: pointer;
        max-width: 100%;
        max-height: 50vh;
        height: 396px;
       `}
      src={mediumURL}
      afterLoaded={(img) => {
        img.style.width = 'auto'
        img.style.height = 'auto'
        imageLoaded = true
      }} />
    {#if exif?.show && imageLoaded}
      <p>
        f{exif?.aperture ?? '-'}
        |
        {exif?.bracketed ? 'bracketed' : `${exif?.shutter ?? '-'}sec`}
        | ISO
        {exif?.iso ?? '-'}
        |
        {exif?.focalLength ?? '-'}mm
      </p>
    {/if}
  </div>
</div>
{#if showLightbox}
  <Lightbox url={largeURL} close={closeLightbox} on:click={closeLightbox} />
{/if}
