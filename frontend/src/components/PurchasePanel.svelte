<script lang="ts">
  import Checkout from './Checkout.svelte'
  import Spinner from './Spinner.svelte'
  import type { PrintSize } from '../types'
  export let printSizes: PrintSize[], title: string, id: string

  let spinner = false

  $: selectedPrintSize = printSizes[0]
  function select(printSize: PrintSize) {
    selectedPrintSize = printSize
  }
</script>

<style>
  .container {
    margin: 50px auto;
    max-width: 450px;
    width: 100%;
    position: relative;
    overflow: hidden;
  }
  .spinner {
    position: absolute;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9998;
    top: 1;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .spinner > div {
    height: 25%;
    width: 25%;
  }
  table {
    width: 100%;
    text-align: center;
    border-collapse: collapse;
    margin-bottom: 50px;
  }
  td {
    padding: 8px;
    border-top: 1px solid #777;
  }
  input[type='radio'] {
    cursor: pointer;
  }
</style>

<div data-test="purchasePanel" class="container">
  {#if spinner}
    <div class="spinner">
      <div>
        <Spinner />
      </div>
    </div>
  {/if}
  <table>
    <thead>
      <th />
      <th>Size (in)</th>
      <th>Size (mm)</th>
      <th>Price</th>
    </thead>
    <tbody>
      {#each printSizes as printSize}
        <tr>
          <td>
            <input
              type="radio"
              checked={printSize === selectedPrintSize}
              on:change={() => select(printSize)} />
          </td>
          <td>{printSize.x} x {printSize.y}</td>
          <td>
            {Math.round(printSize.x * 25.4)}
            x
            {Math.round(printSize.y * 25.4)}
          </td>
          <td>£{printSize.price}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  <Checkout
    showSpinner={() => (spinner = true)}
    hideSpinner={() => (spinner = false)}
    purchasedPrint={{ ...selectedPrintSize, title, id }} />
</div>
