<script context="module">
  export async function preload(page, session) {
    const res = await this.fetch(`about.json`)
    if (res.status === 200) {
      const about = await res.json()
      return about
    }

    this.error(404, 'Not Found')
  }
</script>

<script>
  export let title, body, image
</script>

<style>
  div {
    max-width: 56em;
    margin: auto;
  }
  .photo {
    width: 100%;
    border: 1px solid #f0f0f0;
    height: 300px;
    margin: 20px auto;
    background-image: var(--image-url);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
</style>

<svelte:head>
  <title>About</title>
</svelte:head>

<div style={`--image-url:url(${image.url})`}>
  <h1>{title}</h1>

  <div data-test="photo" class="photo" />
  <div data-test="some-gibberish">
    {@html body}
  </div>
</div>
