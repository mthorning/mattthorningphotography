<script lang="ts">
  import { onMount } from 'svelte'

  let orderId: string, type: string

  onMount(() => {
    let params = new URLSearchParams(window.location.search)
    type = params.get('type')
    orderId = params.get('order_id')
  })
</script>

<style>
  div {
    margin-top: 24px;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  h1 {
    text-align: center;
  }
</style>

<div>
  <h1>
    Thank you
    {#if type}for your {type}{/if}
  </h1>
  {#if orderId}
    <p>Your order ID is {orderId}</p>
  {/if}
</div>
