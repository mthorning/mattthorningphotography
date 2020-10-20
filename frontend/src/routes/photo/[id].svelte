<script context="module" lang="ts">
  export async function preload(page) {
    const { id } = page.params
    const res = await this.fetch(`photo/${id}.json`)
    if (res.status === 200) {
      const data = await res.json()
      return { data }
    }

    this.error(404, 'Not Found')
  }
</script>

<script lang="ts">
  import { goto } from '@sapper/app'
  import ImageWithMeta from '../../components/ImageWithMeta.svelte'
  import PurchasePanel from '../../components/PurchasePanel.svelte'
  import Thumbnail from '../../components/Thumbnail.svelte'

  import type { Data } from './[id].json'

  export let data: Data
  $: photo = data?.photo
  $: print = data?.print
  $: thumbs = data.thumbs.filter((thumb) => thumb.id !== photo.id)

  $: printSizes = print.printSizes
    ? print.printSizes.sort((a, b) => a.price - b.price)
    : []

  function onImageClick(clickId: string) {
    goto(`/photo/${clickId}`)
  }
</script>

<style>
  h2 {
    border-top: 1px solid #777;
    padding-top: 20px;
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
</style>

<svelte:head>
  <title>{photo.title}</title>
</svelte:head>

<h1>{photo?.title ?? 'Image'}</h1>
{#key photo?.id}
  <ImageWithMeta
    alt={photo?.image?.alternativeText}
    exif={photo?.exif}
    mediumURL={photo?.formats?.medium.url}
    largeURL={photo?.formats?.large?.url} />
{/key}

<p class="description">{photo.description}</p>
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

<div id="test" class="footer">
  {#each thumbs as thumb, index}
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
      on:click={() => onImageClick(thumb?.id)} />
  {/each}
</div>
