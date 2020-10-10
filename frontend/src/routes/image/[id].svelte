<script context="module">
  export async function preload(page, session) {
    const { id } = page.params
    const res = await this.fetch(`image/${id}.json`)
    if (res.status === 200) {
      const image = await res.json()
      return { image }
    }

    this.error(404, 'Not Found')
  }
</script>

<script>
  import { onMount } from 'svelte'
  import { goto } from '@sapper/app'
  import ImageWithMeta from '../../components/ImageWithMeta.svelte'
  import PurchasePanel from '../../components/PurchasePanel.svelte'
  export let image

  let allowPurchases = true

  $: printSizes = image.printSizes
    ? image.printSizes.sort((a, b) => a.price - b.price)
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
  a {
    text-decoration: none;
  }
</style>

<svelte:head>
  <title>{image.title}</title>
</svelte:head>

<h1>{image.title}</h1>
{#each [image] as image (image.fileName)}
  <ImageWithMeta {...image} />
{/each}
<p class="description">{image.description}</p>
{#if allowPurchases && printSizes && printSizes.length}
  <h2>Prints</h2>
  <p>This image is available for purchase as a print in the following sizes:</p>
  <PurchasePanel id={image.id} title={image.title} {printSizes} />
  <div data-test="printInfo">
    <p>
      Images are printed to order on Hahnemühle Fine Art Pearl paper using high
      quality inks. It is expected that they will arrive from the printing lab
      within three days but I want to check the quality personally before
      sending them so please allow extra time for this.
    </p>
    <p>
      The prices listed are for UK delivery only, please contact me if you
      require international delivery.
    </p>
    <p>
      If you have any questions or would like to discuss different sizes or
      aspect ratios then please
      <a href="/contact">contact me.</a>
    </p>
  </div>
{/if}
