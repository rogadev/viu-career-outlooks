<script>
  import NavButton from './viu/NavButton.svelte'
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

  <!-- <nav aria-label="Main">
    <ul
      class="flex items-center justify-evenly mmd:gap-4 mmd:mx-4 mt-4 mmd:mt-0 text-center"
    >
      <li>
        <NavButton>
          <a href="/careers/by-program">Program Search</a>
        </NavButton>
      </li>
      <li>
        <NavButton>
          <a href="/careers/search">Credential Search</a>
        </NavButton>
      </li>
    </ul>
  </nav> -->
</header>
