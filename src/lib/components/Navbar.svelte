<script>
  import Button from './viu/Button.svelte'
  import NavBrand from './viu/NavBrand.svelte'
</script>

<header
  class="inline-block mmd:flex mmd:justify-between mmd:items-center w-full"
>
  <a id="brand-link" href="/" class="flex items-center">
    <a href="https://www.viu.ca">
      <!-- TODO Consider trying to pre-flight warn navigating away to VIU.ca -->
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
  </a>

  <nav aria-label="Main">
    <ul
      class="flex items-center justify-evenly mmd:gap-4 mmd:mx-4 mt-4 mmd:mt-0 text-center"
    >
      <!-- <li class="nav-item"><a href="/outlook/2175">X</a></li> -->
      <li>
        <Button>
          <a href="/careers/search">Search Credentials</a>
        </Button>
      </li>
      <li>
        <Button>
          <a href="/careers/by-program">Search Program</a>
        </Button>
      </li>
    </ul>
  </nav>
</header>
