<script lang="ts">
  import Img from './Img.svelte'
  import IntersectionObserver from './IntersectionObserver.svelte'

  export let isPortrait: boolean,
    alt: string,
    url: string,
    style: string,
    linkHref: string
</script>

<style>
  div {
    cursor: pointer;
    position: relative;
    width: 140px;
    height: 140px;
    overflow: hidden;
    border: 1px solid var(--primary-color);
    user-select: none;
  }
  @media (min-width: 600px) {
    div {
      width: 250px;
      height: 250px;
    }
  }
</style>

<div data-test="thumbnail" class={`thumbnail `} {style}>
  <IntersectionObserver once let:intersecting>
    <a on:click href={linkHref}>
      {#if intersecting}
        <!-- anchor tag for SEO purposes -->
        <Img
            style={`
              ${isPortrait ? `
                  width: 105%;
                  height: auto;
                ` : `
                  width: auto;
                  height: 120%;
              `}
                  position: absolute;
                  left: 50%;
                  top: 50%;
                  transform: translate(-50%, -50%);
              `}
            {alt}
            src={url} />
      {/if}
    </a>
  </IntersectionObserver>
</div>
