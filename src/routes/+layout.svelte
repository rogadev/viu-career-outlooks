<script>
  import '../app.css'
  import Navbar from '$lib/components/Navbar.svelte'
  import Loading from '$lib/components/Loading.svelte'

  // Navigating essentially comes from the app. If we are still navigating to the page and things are loading, we haven't "loaded" the page yet. Thus loading = true. Once we are done navigating, loading = false.
  import { navigating } from '$app/stores'
  import { loading } from '$lib/stores/loading'
  $: $loading = !!$navigating
</script>

<div class="app-wrapper">
  <Navbar />
  <div class="slot-wrapper">
    {#if $loading}
      <Loading />
    {:else}
      <slot />
    {/if}
  </div>
</div>

<style>
  div.app-wrapper {
    color: #222;
    font-size: 18px;
    border: 1rem solid #003b5c;
    margin: 0;
    background-color: #fff;
    min-height: 110vh;
  }

  div.slot-wrapper {
    padding: 1.5rem;
  }
</style>
