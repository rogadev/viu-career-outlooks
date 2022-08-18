<script>
  import H1 from '$lib/components/viu/H1.svelte'
  import Filter from '$lib/components/Filter.svelte'

  export let /** @type {string[]}*/ jobs
  export let /** @type {string}*/ title
  export let /** @type {string} */ credential
</script>

<H1>{title} {credential}</H1>

{#if !jobs.length}
  <p>
    No results found for this credential, at this time. Contact the Web Team to
    update the VIU program list.
  </p>
{:else}
  <Filter haystack={jobs} />
{/if}
