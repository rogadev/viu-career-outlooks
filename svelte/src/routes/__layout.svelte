<script>
  import '../app.css'
  import Navbar from '$lib/components/Navbar.svelte'
  import { navigating } from '$app/stores'
  import { loading } from '$lib/stores/loading'
  $: $loading = !!$navigating
</script>

<svelte:head>
  <title>App Title</title>
</svelte:head>

<div class="app-wrapper">
  <Navbar />
  <div class="slot-wrapper">
    {#if $loading}
      <div>loading...</div>
    {:else}
      <slot />
    {/if}
  </div>
  <footer>
    <p><!-- -->></p>
  </footer>
</div>

<style>
  div.app-wrapper {
    color: #222;
    font-size: 18px;
    border: 1rem solid #003b5c;
    margin: 0;
    background-color: #fff;
    min-height: 100vh;
  }

  div.slot-wrapper {
    padding: 1.5rem;
  }

  footer {
    width: 100%;
    height: 2.5rem;
  }
</style>
