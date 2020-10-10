<script>
  export let src, alt
  export let afterLoaded = () => {}

  let extraClasses
  export { extraClasses as class }

  let image
  let loaded = false

  function setUp(image) {
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

{#each [src] as src (src)}
  <img
    key={src}
    use:setUp
    on:click
    class={extraClasses}
    class:loaded
    loading="lazy"
    decoding="async"
    alt={alt || 'photograph'}
    {src} />
{/each}
