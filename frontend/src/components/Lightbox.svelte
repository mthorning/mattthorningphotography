<script lang="ts">
  import { onMount } from 'svelte'
  import Img from './Img.svelte'
  import FaCaretLeft from 'svelte-icons/fa/FaCaretLeft.svelte'
  import FaCaretRight from 'svelte-icons/fa/FaCaretRight.svelte'

  export let alt: string, url: string, close: () => void, click: boolean
  export let previous = () => {}
  export let next = () => {}

  let touchstart = 0
  let controls = false
  const showControls = () => (controls = true)

  onMount(() => {
    const main = document.querySelector('main')
    const scrollY = stopAppScroll(main)
    window.onpopstate = (e: PopStateEvent) => {
      e.preventDefault()
      e.stopPropagation()
      close()
    }
    history.pushState({ id: 'modal' }, 'modal')
    document.addEventListener('keydown', onKeydown)

    return () => {
      if (history.state.id === 'modal') history.back()
      restoreAppScroll(main, scrollY)
      document.removeEventListener('keydown', onKeydown)
    }
  })

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
        close()
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
  span {
    position: absolute;
    left: 50%;
    top: 90%;
    transform: translate(-50%, -90%);
    opacity: 0;
    transition: 2s opacity ease-in-out;
    display: flex;
    justify-content: space-between;
  }
  .control {
    background: rgba(0, 0, 0, 0.5);
    border-radius: 2px;
    cursor: pointer;
    margin: 0 4px;
    user-select: none;
  }
  .controls {
    opacity: 1;
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
  class="overlay"
  data-test="lightbox"
  on:click={() => close()}
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
  <span class:controls>
    <div on:click={arrowClick(previous)} class="icon control">
      <FaCaretLeft />
    </div>
    <div on:click class="control details">Click For Details</div>
    <div on:click={arrowClick(next)} class="icon control">
      <FaCaretRight />
    </div>
  </span>
</div>
