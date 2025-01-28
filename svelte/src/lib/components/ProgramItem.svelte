<script>
  import { selectProgram } from '$lib/stores/programs'
  /** @type {string} */
  export let nid
  /** @type {string} */
  export let title

  function setProgram() {
    selectProgram({ nid, title })
  }
</script>

<div
  on:click={setProgram}
  class=" cursor-pointer mb-2 px-4 py-2 bg-blue-50 border rounded-lg border-blue-100  hover:bg-blue-200 hover:border-blue-200 font-semibold h-full"
>
  {title}
</div>
