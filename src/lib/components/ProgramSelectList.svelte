<script>
  /** @type {{nid:string,title:string}[]} */
  export let list
  $: console.log(list)
</script>

{#each list as program}
  <p>{program.title}</p>
{/each}
