<script lang="ts">
  export let style = ''
</script>

<style>
  div {
    background-image: url('/spinner.gif');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    height: 40px;
    width: 40px;
  }
</style>

<div data-test="spinner" {style} />
