<script>
  import Navbar from '../components/Navbar.svelte'
</script>

<svelte:head>
  <title>App Title</title>
</svelte:head>

<div class="app-wrapper">
  <Navbar />
  <div class="slot-wrapper">
    <slot />
  </div>
  <footer>
    <p>footer will go here</p>
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
