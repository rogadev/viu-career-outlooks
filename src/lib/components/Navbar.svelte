<script>
  import NavBrand from './viu/NavBrand.svelte'
  import { clearSelectedProgram } from '$lib/stores/programs'
</script>

<header
  class="inline-block mmd:flex mmd:justify-between mmd:items-center w-full"
>
  <button
    id="brand-link"
    on:click={() => {
      clearSelectedProgram()
      if (window.location.href !== '/') {
        window.location.href = '/'
      }
    }}
    class="flex items-center"
  >
    <a href="https://www.viu.ca">
      <img
        id="brand-logo"
        src="/img/viu_logo.svg"
        alt="VIU Logo"
        class="h-[70px]"
      />
    </a>
    <div class="ml-6">
      <NavBrand>Career Outlooks</NavBrand>
    </div>
  </button>
</header>
