<script lang="ts">
  import Img from '../components/Img.svelte'
  export let isPortrait: boolean, alt: string, url: string
</script>

<style>
  div {
    cursor: pointer;
    position: relative;
    width: 140px;
    height: 140px;
    overflow: hidden;
    border: 1px solid #f0f0f0;
    float: left;
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

<div data-test="thumbnail" class="thumbnail">
  <Img
    on:click
    class={`img ${isPortrait ? 'isPortrait' : ''}`}
    {alt}
    src={url} />
</div>
