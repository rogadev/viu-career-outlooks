<header class="block md:flex md:justify-between md:items-center">
  <a
    id="brand-link"
    href="/"
    class="flex items-center justify-between md:justify-start"
  >
    <a href="https://www.viu.ca">
      <!-- TODO Consider trying to pre-flight warn navigating away to VIU.ca -->
      <img
        id="brand-logo"
        src="/img/viu_logo.svg"
        alt="VIU Logo"
        class="h-[70px]"
      />
    </a>
    <h1
      id="brand-title"
      class="font-extrabold text-3xl text-center mx-auto md:text-left md:ml-4"
    >
      Career Outlooks
    </h1>
  </a>

  <nav aria-label="Main" class="text-xl md:text-2xl">
    <ul
      class="flex gap-4 items-center mr-4 justify-evenly md:justify-start mt-4 md:mt-0 text-center"
    >
      <!-- <li class="nav-item"><a href="/outlook/2175">X</a></li> -->
      <li class="nav-item"><a href="/careers/search">Search Credentials</a></li>
      <li class="nav-item">
        <a href="/careers/by-program">Search Program</a>
      </li>
    </ul>
  </nav>
</header>

<style lang="postcss">
  .nav-item {
    @apply bg-gray-50 px-6 py-2 my-4 mx-auto border rounded drop-shadow hover:bg-gray-100 font-bold;
  }
</style>
