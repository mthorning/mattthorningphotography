<script context="module" lang="ts">
  export async function preload(page, session) {
    const res = await this.fetch(`about.json`)
    if (res.status === 200) {
      const data: Data = await res.json()
      return { data }
    }

    this.error(404, 'Not Found')
  }
</script>

<script lang="ts">
  import type { Data } from './index.json'

  export let data: Data
  const {
    about: { title, body, image, showGearList } = {},
    equipmentItems,
  } = data
</script>

<style>
  .content {
    max-width: 56em;
    margin: auto;
  }
  .photo {
    width: 100%;
    border: 1px solid var(--primary-color);
    height: 300px;
    margin: 20px auto;
    background-image: var(--image-url);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
  .gear-list {
    margin-top: 32px;
    padding-top: 32px;
    border-top: 1px solid var(--primary-color);
  }
</style>

<svelte:head>
  <title>About Matt Thorning</title>
  <meta
    name="description"
    content="Cornish landscape and fine art photographer." />
</svelte:head>

<div>
  <h1>{title}</h1>

  {#if image?.url}
    <div
      data-test="photo"
      style={`--image-url:url(${image.url})`}
      class="photo" />
  {/if}
  <div class="content" data-test="about-text">
    {@html body}
  </div>

  <p>
    If you want to get in touch for any reason then please contact me either
    through my
    <a href="/contact">contact page </a>or the social media links above.
  </p>
  {#if showGearList}
    <div class="gear-list">
      <h2>Gear List</h2>
      {#each Object.keys(equipmentItems) as category}
        <div data-test={category}>
          <h3>
            {category
              .split('_')
              .map((l) => `${l.charAt(0).toUpperCase()}${l.substr(1)}`)
              .join(' ')}
          </h3>
          <ul>
            {#each equipmentItems[category] as item}
              <li>{item}</li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>
  {/if}
</div>
