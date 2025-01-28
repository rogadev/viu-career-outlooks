<script>
  import titleCase from '$lib/helpers/titleCase'

  /** @type {string}  */
  export let title
  /** @type {string}  */
  export let noc
</script>

<a
  href={'/outlook/' + noc}
  class="self-center justify-center drop-shadow h-full"
>
  <div
    class="mb-2 px-4 py-2 bg-blue-50 border rounded-lg border-blue-100  hover:bg-blue-200 hover:border-blue-200 font-semibold h-full"
  >
    {titleCase(title)}
  </div>
</a>
