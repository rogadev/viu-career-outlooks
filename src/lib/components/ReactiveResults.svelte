<script>
  import titleCase from '$lib/helpers/titleCase'

  export let /** @type {{title:string, noc:string}[]} */ list
</script>

<div
  aria-live="polite"
  class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-4 gap-x-2"
>
  {#if !list.length}
    <p>
      No results found for this credential, at this time. Contact the Web Team
      to update the VIU program list.
    </p>
  {:else}
    {#each list as job}
      <a
        href={'/outlook/' + job.noc}
        class="self-center justify-center drop-shadow h-full"
      >
        <div
          class="mb-2 px-4 py-2 bg-blue-50 border rounded-lg border-blue-100  hover:bg-blue-200 hover:border-blue-200 font-semibold h-full"
        >
          {titleCase(job.title)}
        </div>
      </a>
    {/each}
  {/if}
</div>
