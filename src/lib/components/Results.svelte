<script>
  // @ts-nocheck

  import { filteredResults } from '$lib/stores/searching.js'

  $: jobs = $filteredResults
</script>

<div
  aria-live="polite"
  class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-4 gap-x-2"
>
  {#each jobs as job}
    <a
      target="_blank"
      href={'/outlook/' + job.noc}
      class="self-center justify-center drop-shadow h-full"
    >
      <div
        class="mb-2 px-4 py-2 bg-blue-50 border rounded-lg border-blue-100  hover:bg-blue-200 hover:border-blue-200 font-semibold h-full"
      >
        {job.title}
      </div>
    </a>
  {/each}
</div>
