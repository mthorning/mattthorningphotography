<script>
  import Checkout from './Checkout.svelte'
  import Spinner from './Spinner.svelte'
  export let printSizes, title, id

  let spinner = false

  $: selectedPrint = printSizes[0]
  function select(print) {
    selectedPrint = print
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
      <!--
      <th>Pixels</th>
      -->
      <th>Size (mm)</th>
      <th>Price</th>
      <!--
      <th>Img Ratio</th>
      <th>Print Ratio</th>
      <th>DPI</th>
      -->
    </thead>
    <tbody>
      {#each printSizes as print}
        <tr>
          <td>
            <input
              type="radio"
              checked={print === selectedPrint}
              on:change={() => select(print)} />
          </td>
          <td>{print.x} x {print.y}</td>
          <!--
          <td>{print.cropSize}</td>
           -->
          <td>{Math.round(print.x * 25.4)} x {Math.round(print.y * 25.4)}</td>
          <td>£{print.price}</td>
          <!--
          <td>{print.imgRatio}</td>
          <td>{print.paperRatio}</td>
          <td>{print.dpi}</td>
            -->
        </tr>
      {/each}
    </tbody>
  </table>
  <Checkout
    showSpinner={() => (spinner = true)}
    hideSpinner={() => (spinner = false)}
    selectedPrint={{ ...selectedPrint, title, id }} />
</div>
