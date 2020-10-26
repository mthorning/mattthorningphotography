<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import Img from './Img.svelte'
  import { fade } from 'svelte/transition'
  import FaCaretLeft from 'svelte-icons/fa/FaCaretLeft.svelte'
  import FaCaretRight from 'svelte-icons/fa/FaCaretRight.svelte'

  export let alt: string, url: string, close: () => void, click: boolean
  // to close, call handleClose no close
  export let previous = () => {}
  export let next = () => {}

  let touchstart = 0
  let controls = false
  const showControls = () => (controls = true)

  let main: HTMLElement
  onMount(() => {
    main = document.querySelector('main')
    const scrollY = stopAppScroll(main)

    window.onpopstate = (e: PopStateEvent) => {
      e.preventDefault()
      e.stopPropagation()
      close()
    }
    history.pushState({ id: 'modal' }, 'modal')
    document.addEventListener('keydown', onKeydown)
  })

  onDestroy(() => {
    restoreAppScroll(main, scrollY)
    document.removeEventListener('keydown', onKeydown)
  })

  function handleClose() {
    window.dispatchEvent(new Event('popstate'))
  }

  function stopAppScroll(main: HTMLElement) {
    const scrollY = window.scrollY
    main.style.position = 'fixed'
    main.style.top = -1 * scrollY + 'px'
    main.style.right = '0'
    main.style.left = '0'
    return scrollY
  }

  function restoreAppScroll(main: HTMLElement, scrollY: number) {
    main.style.position = 'static'
    main.style.top = ''
    main.style.right = ''
    main.style.left = ''
    window.scrollTo(0, scrollY)
  }

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
  function onKeydown(e: KeyboardEvent) {
    switch (e.key) {
      case 'Escape':
        handleClose()
        break
      case 'Left':
      case 'ArrowLeft':
        previous()
        break
      case 'Right':
      case 'ArrowRight':
        next()
        break
    }
  }
  function arrowClick(cb: () => void) {
    return function changeImage(e: MouseEvent) {
      e.stopPropagation()
      e.preventDefault()
      cb()
    }
  }
</script>

<style>
  .overlay {
    position: fixed;
    display: flex;
    justify-content: center;
    right: 0;
    left: 0;
    z-index: 9999;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.9);
  }
  .top {
    background-image: url('/spinner.gif') no-repeat center;
    background-size: 75px;
    top: 0;
    bottom: 50px;
    padding: 16px 16px 0 16px;
  }
  .bottom {
    top: calc(100% - 50px);
    align-items: flex-start;
    bottom: 0;
  }
  span {
    display: flex;
    justify-content: space-between;
  }
  .control {
    border-radius: 2px;
    cursor: pointer;
    margin: 0 4px;
    user-select: none;
  }
  .icon {
    height: 34px;
    width: 34px;
  }
  .details {
    padding: 3px 8px;
    line-height: 24px;
    white-space: nowrap;
  }
</style>

<!-- svelte-ignore a11y-autofocus -->
<div
  class="overlay top"
  data-test="lightbox"
  on:click={handleClose}
  on:touchstart={onTouchstart}
  on:touchend={onTouchend}>
  <Img
    on:click
    style={`
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
      ${click ? 'cursor: pointer;' : ''} 
    `}
    {alt}
    afterLoaded={showControls}
    src={url} />
</div>
<div on:click={handleClose} class="overlay bottom">
  {#if click}
    <span
      in:fade={{ delay: 300, duration: 1000 }}
      on:click={handleClose}
      class:controls>
      <div on:click={arrowClick(previous)} class="icon control">
        <FaCaretLeft />
      </div>
      <div on:click class="control details">Click For Details</div>
      <div on:click={arrowClick(next)} class="icon control">
        <FaCaretRight />
      </div>
    </span>
  {/if}
</div>
