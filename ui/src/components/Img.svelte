<script lang="ts">
  export let src: string, alt: string
  export let afterLoaded: (image: HTMLElement) => void = () => {}
  export let style: string

  let image: HTMLImageElement
  let loaded = false

  function setUp(image: HTMLImageElement) {
    if (image.complete) {
      loaded = true
      afterLoaded(image)
    } else {
      image.onload = () => {
        loaded = true
        afterLoaded(image)
      }
    }
  }
</script>

<style>
  img {
    opacity: 0;
    transition: all 1s ease;
  }
  .loaded {
    opacity: 1;
  }
</style>

<img
  {src}
  {style}
  bind:this={image}
  use:setUp
  on:click
  class:loaded
  alt={alt || 'photograph'} />
