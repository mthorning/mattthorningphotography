<script>
  import { createEventDispatcher } from 'svelte'
  import { onMount } from 'svelte'
  import { fade } from 'svelte/transition'
  import { quadIn, quadOut } from 'svelte/easing'
  import Img from '../components/Img.svelte'

  export let isPortrait, alt, url, close
  export let previous = () => {}
  export let next = () => {}
  let extraClasses
  export { extraClasses as class }

  let touchstart = 0

  onMount(() => {
    window.addEventListener('onpopstate', (e) => {
      e.preventDefault()
      e.stopPropagation()
    })
    document.addEventListener('keydown', onKeydown)
    return () => document.removeEventListener('keydown', onKeydown)
  })

  function onTouchstart({ changedTouches }) {
    touchstart = changedTouches[0].screenX
  }
  function onTouchend({ changedTouches }) {
    const touchend = changedTouches[0].screenX
    if (touchend + 100 < touchstart) {
      next()
    }
    if (touchend - 100 > touchstart) {
      previous()
    }
  }
  function onKeydown(e) {
    switch (e.which) {
      case 27:
        close()
        break
      case 37:
        previous()
        break
      case 39:
        next()
        break
    }
  }
</script>

<style>
  div {
    background: rgba(0, 0, 0, 0.9) url('/spinner.gif') no-repeat center;
    background-size: 75px;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9999;
    display: flex;
    padding: 16px;
    align-items: center;
    justify-content: center;
  }
  :global(.fullsize-img) {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
  }
</style>

<!-- svelte-ignore a11y-autofocus -->
<div
  data-test="lightbox"
  on:click={() => close()}
  on:touchstart={onTouchstart}
  on:touchend={onTouchend}>
  <Img
    on:click
    class={`fullsize-img ${extraClasses}`}
    alt={alt}
    {isPortrait}
    src={url} />
</div>
