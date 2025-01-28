<script>
  import titleCase from '$lib/helpers/titleCase'

  import { selectedProgram } from '$lib/stores/programs'

  export let /** @type {{title:string, noc:string}[]} */ list
</script>

{#if !list.length}
  <p>
    No results found for this credential, at this time. <a
      class="text-blue-600 cursor-pointer font-semibold hover:text-blue-800"
      href={`mailto:web@viu.ca?subject=No%20career%20results%20for%20${$selectedProgram.title} (NID: ${$selectedProgram.nid})`}
      target="_blank">Contact the Web Team</a
    > to update the VIU program list.
  </p>
{:else}
  <div
    aria-live="polite"
    class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-4 gap-x-2"
  >
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
  </div>
{/if}
