<script>
  import H1 from '$lib/components/viu/H1.svelte'
  import Filter from '$lib/components/Filter.svelte'

  export let /** @type {{noc:string, title:string}[]}*/ jobs
  export let /** @type {string}*/ title
</script>

<H1>{title}</H1>

<Filter haystack={jobs} />
