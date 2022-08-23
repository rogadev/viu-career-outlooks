<script>
  import ProgramItem from './ProgramItem.svelte'
  /** @type {{nid:string,title:string}[]} */
  export let list
</script>

<div
  aria-live="polite"
  class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-4 gap-x-2"
>
  {#each list as program}
    <ProgramItem nid={program.nid} title={program.title} />
  {/each}
</div>
