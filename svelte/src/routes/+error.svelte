<script>
  import { page } from '$app/stores'
  import H1 from '$lib/components/viu/H1.svelte'
  import H2 from '$lib/components/viu/H2.svelte'
</script>

<H1>Error {$page.status}</H1>
<H2>{$page?.error?.message ?? 'Oops... Something went wrong!'}</H2>
