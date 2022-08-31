<script>
  import Button from '$lib/components/viu/Button.svelte'
</script>

<div class="container sticky top-4" on:click={() => history.back()}>
  <Button>
    <div>Back</div>
  </Button>
</div>
