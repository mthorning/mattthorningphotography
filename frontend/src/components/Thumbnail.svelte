<script lang="ts">
  import Img from '../components/Img.svelte'
  import IntersectionObserver from '../components/IntersectionObserver.svelte'

  export let isPortrait: boolean, alt: string, url: string, style: string
</script>

<style>
  div {
    cursor: pointer;
    position: relative;
    width: 140px;
    height: 140px;
    overflow: hidden;
    border: 1px solid #f0f0f0;
  }
  @media (min-width: 600px) {
    div {
      width: 250px;
      height: 250px;
    }
  }
  :global(.img) {
    position: absolute;
    left: 50%;
    top: 50%;
    height: 120%;
    width: auto;
    transform: translate(-50%, -50%);
  }
  :global(.isPortrait) {
    width: 105%;
    height: auto;
  }
</style>

<div data-test="thumbnail" class={`thumbnail `} {style}>
  <IntersectionObserver once let:intersecting>
    {#if intersecting}
      <Img
        on:click
        class={`img ${isPortrait ? 'isPortrait' : ''}`}
        {alt}
        src={url} />
    {/if}
  </IntersectionObserver>
</div>
