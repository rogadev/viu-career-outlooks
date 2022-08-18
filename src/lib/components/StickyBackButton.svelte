<script>
  import Button from '$lib/components/viu/Button.svelte'
</script>

<div class="container sticky top-4">
  <Button>
    <div on:click={() => history.back()}>Back</div>
  </Button>
</div>
