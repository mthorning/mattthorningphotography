<script context="module" lang="ts">
  export async function preload(page, session) {
    const res = await this.fetch('articles.json')
    if (res.status === 200) {
      const data = await res.json()
      return { data }
    }
    this.error(404, 'Not Found')
  }
</script>

<script lang="ts">
  import { goto } from '@sapper/app'

  import type { Data } from './index.json'

  export let data: Data
  const articles = data.articles
  console.log(articles)

  let selectedIdx: number
  $: selectedArticle = articles[selectedIdx]

  function onArticleClick(e: MouseEvent) {
    e.stopPropagation()
    goto(`/articles/${selectedArticle.id}`, { replaceState: true })
  }
</script>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, max-content));
    grid-gap: 16px;
    justify-content: center;
    padding: initial;
  }
  .article-card {
    cursor: pointer;
    position: relative;
    width: 400px;
    height: 150px;
    overflow: hidden;
    border: 1px solid #f0f0f0;
    user-select: none;
    padding: 12px;
  }
</style>

<svelte:head>
  <title>Articles</title>
</svelte:head>

<div class="grid">
  {#each articles as article, index}
    <div class="article-card">
      <h3>{article.title}</h3>
    </div>
  {/each}
</div>
