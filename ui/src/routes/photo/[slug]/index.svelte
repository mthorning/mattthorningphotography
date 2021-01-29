<script context="module" lang="ts">
  export async function preload(page) {
    const { slug } = page.params
    const res = await this.fetch(`photo/${slug}.json`)
    if (res.status === 200) {
      const data = await res.json()
      return { data }
    }

    this.error(404, 'Not Found')
  }
</script>

<script lang="ts">
  import ImageWithMeta from '../../../components/ImageWithMeta.svelte'
  import PurchasePanel from '../../../components/PurchasePanel.svelte'
  import Thumbnail from '../../../components/Thumbnail.svelte'
  import ShareButtons from '../../../components/ShareButtons.svelte'

  import type { Data } from './index.json'

  export let data: Data
  $: photo = data?.photo
  $: print = data?.print
  $: thumbs = data.thumbs.filter((thumb) => thumb.slug !== photo.slug)

  $: printSizes = print.printSizes
    ? print.printSizes
        .filter(
          (a) => a.price && typeof a.price === 'number' && !isNaN(a.price)
        )
        .sort((a, b) => a.price - b.price)
    : []
</script>

<style>
  h2 {
    border-top: 1px solid #777;
    padding-top: 50px;
  }
  h1 {
    border-bottom: 1px solid #777;
    padding-bottom: 20px;
    margin-bottom: 60px;
  }
  .description {
    padding: 50px 0;
  }
  .footer {
    margin: 50px 0;
    padding-top: 50px;
    border-top: 1px solid #777;
    height: 115px;
    width: 100%;
    overflow-y: hidden;
    overflow-x: auto;
    white-space: nowrap;
  }
  .share {
    width: 100%;
    position: relative;
  }
</style>

<svelte:head>
  <title>{photo.title}</title>
  <meta name="description" content={photo.description} />
</svelte:head>

<h1>{photo?.title ?? 'Image'}</h1>
{#key photo?.id}
  <ImageWithMeta
    alt={photo?.image?.alternativeText}
    exif={photo?.exif}
    mediumURL={photo?.formats?.medium.url}
    largeURL={photo?.image?.url} />
{/key}

<p class="description">{photo.description}</p>

<div class="share">
  <ShareButtons title={photo?.title ?? 'Image'} />
</div>

{#if print?.enabled && photo?.sell && photo?.id && printSizes?.length}
  <h2>Prints</h2>
  <p>This image is available for purchase as a print in the following sizes:</p>

  <PurchasePanel id={photo?.id} title={photo?.title} {printSizes} />
  <div data-test="printInfo">
    {#if print?.info}
      {@html print.info}
    {/if}
  </div>
{/if}

<div data-test="hzGallery" class="footer">
  {#each thumbs as thumb}
    <Thumbnail
      style={`
          width: 100px;
          height: 100px;
          display: inline-block;
          margin: 0 4px;
        `}
      isPortrait={thumb?.isPortrait}
      alt={thumb?.image?.alternativeText}
      url={thumb?.image?.formats?.thumbnail?.url}
      linkHref={`/photo/${thumb.slug}`} />
  {/each}
</div>
