<script lang="ts">
  import { onMount } from 'svelte'
  import Img from 'svelte-components/Img.svelte'

  export let alt: string, url: string, close: () => void, pointer: boolean
  export let previous = () => {}
  export let next = () => {}

  let touchstart = 0

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
</style>

<!-- svelte-ignore a11y-autofocus -->
<div
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
      ${pointer ? 'cursor: pointer;' : ''} 
    `}
    {alt}
    src={url} />
</div>
