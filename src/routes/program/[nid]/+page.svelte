<script>
  throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

  import H1 from '$lib/components/viu/H1.svelte'
  import Filter from '$lib/components/Filter.svelte'

  export let /** @type {{noc:string,title:string}[]}*/ jobs
  export let /** @type {string}*/ title
  export let /** @type {string} */ credential
</script>

<svelte:head>
  <title>{title} | Career Opportunties</title>
</svelte:head>

<H1>{title} {credential}</H1>

{#if !jobs.length}
  <p>
    No results found for this credential, at this time. Contact the Web Team if
    you think there's been a mistake.
  </p>
{:else}
  <Filter haystack={jobs} />
{/if}
