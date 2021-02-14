<script lang="ts">
  import { onMount } from 'svelte'
  import { fade } from 'svelte/transition'
  import FaCaretLeft from 'svelte-icons/fa/FaCaretLeft.svelte'
  import FaCaretRight from 'svelte-icons/fa/FaCaretRight.svelte'
  import Img from './Img.svelte'
  import Spinner from './Spinner.svelte'

  export let alt: string,
    url: string,
    close: () => void,
    click: boolean,
    radial: boolean
  // to close, call handleClose() not close()
  export let previous = () => {}
  export let next = () => {}

  let touchstart = 0
  let controls = false
  let scrollY: number

  let showSpinner = true

  const onImageLoad = () => {
    controls = true
    showSpinner = false
  }

  onMount(() => {
    const main = document.querySelector('main')
    const currentScroll = stopAppScroll(main)
    history.pushState({ id: 'modal' }, 'modal')
    return () => {
      restoreAppScroll(main, currentScroll)
    }
  })

  function onPopstate(e: PopStateEvent) {
    e.preventDefault()
    e.stopPropagation()
    close()
  }

  function handleClose() {
    window.dispatchEvent(new Event('popstate'))
  }

  function stopAppScroll(main: HTMLElement) {
    main.style.position = 'fixed'
    main.style.top = -1 * scrollY + 'px'
    main.style.right = '0'
    main.style.left = '0'
    return scrollY
  }

  function restoreAppScroll(main: HTMLElement, currentScroll: number) {
    main.style.position = 'static'
    main.style.top = ''
    main.style.right = ''
    main.style.left = ''
    window.scrollTo(0, currentScroll)
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
  @media (min-width: 400px) and (min-height: 400px) {
    .radial {
      background: no-repeat center center
        radial-gradient(#9fa0ae -74%, rgba(0, 0, 0, 0.9) 67%);
      background-size: cover !important;
    }
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
    align-items: center;
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
<svelte:window on:keydown={onKeydown} on:popstate={onPopstate} bind:scrollY />
<div
  class="overlay top"
  class:radial
  data-test="lightbox"
  on:click={handleClose}
  on:touchstart={onTouchstart}
  on:touchend={onTouchend}>
  {#if showSpinner}
    <Spinner
      style={`
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
  `} />
  {/if}
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
    afterLoaded={onImageLoad}
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
