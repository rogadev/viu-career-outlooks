<script>
  import Fuse from 'fuse.js'

  export let /** @type {{nid:number, title:string}[]} */ programs

  const fuseOptions = {
    keys: ['title'],
    shouldSort: true,
    findAllMatches: true,
  }

  $: haystack = new Fuse(programs, fuseOptions)

  $: options = haystack.search(input).map((v) => v.item)

  let input = ''
  let selectedOption = ''
</script>

<input name="input" bind:value={input} id="input" list="selected-option" />
<datalist id="selected-option">
  {#each options as option}
    <option value={option.nid}>{option.title}</option>/>
  {/each}
</datalist>
