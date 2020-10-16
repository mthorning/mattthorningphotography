<script context="module">
  export async function preload(page, session) {
    const { id } = page.params
    const res = await this.fetch(`photo/${id}.json`)
    if (res.status === 200) {
      const data = await res.json()
      return data
    }

    this.error(404, 'Not Found')
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte'
  import { goto } from '@sapper/app'
  import ImageWithMeta from '../../components/ImageWithMeta.svelte'
  import PurchasePanel from '../../components/PurchasePanel.svelte'
  export let photo, print

  let allowPurchases = true

  $: printSizes = print.printSizes
    ? print.printSizes.sort((a, b) => a.price - b.price)
    : []
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
</style>

<svelte:head>
  <title>{photo.title}</title>
</svelte:head>

<h1>{photo.title}</h1>
{#each [photo] as photo (photo.id)}
  <ImageWithMeta {photo} />
{/each}
<p class="description">{photo.description}</p>
{#if print.enabled && photo.sell && printSizes && printSizes.length}
  <h2>Prints</h2>
  <p>This image is available for purchase as a print in the following sizes:</p>
  <PurchasePanel id={photo.id} title={photo.title} {printSizes} />
  <div data-test="printInfo">
    {@html print.info}
  </div>
{/if}
