<script>
  import { page } from '$app/stores'
  import H1 from '$lib/components/viu/H1.svelte'
  import P from '$lib/components/viu/P.svelte'
</script>

{#if $page.status === 404}
  <H1>Program not found</H1>

  <P>
    A page with that NID was not found. Please check your NID number and try
    again.
  </P>
{:else}
  <H1>Something went wrong</H1>

  <P>An unexpected error occurred. Please try again later.</P>
{/if}
