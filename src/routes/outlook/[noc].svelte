<script>
  import titleCase from '$lib/helpers/titleCase.js'
  // Properties returned from our shadow endpoint.
  export let /** @type {string} */ noc
  export let /** @type {string} */ title
  export let /** @type {string} */ jobs
  export let /** @type {string} */ requirements
  export let /** @type {string} */ duties
  export let /** @type {string} */ outlook
  export let /** @type {string} */ outlook_verbose
  export let /** @type {string} */ trends
  export let /** @type {string} */ province

  $: jobList = () => {
    const list = String(jobs).split(',')
    return list.map((job) => titleCase(job))
  }
</script>

<svelte:head>
  <title>
    {titleCase(title)} | 3-Year Market Outlook | {province} (NOC {noc})
  </title>
</svelte:head>

<h1>{titleCase(title)}</h1>
<h2 class={`outlook-${outlook}`}>
  BC's 3-Year Market Outlook: <b>{outlook_verbose}</b>
</h2>

<ul>
  <li class="detail-section">
    <b>Job titles in this group:</b>
    <ul>
      {#each jobList() as job}
        <li>{job}</li>
      {/each}
    </ul>
  </li>
  <li class="detail-section">
    <b>Employment Requirements:</b>
    <ul>
      <li>{requirements}</li>
    </ul>
  </li>
  <li class="detail-section">
    <!-- Duties is either an array of objects or an array of strings. -->
    <b>List of Duties:</b>
    <ul class="list-disc ml-5">
      {#if typeof duties[0] === 'string'}
        {#each duties as duty}
          <li>{duty}</li>
        {/each}
      {:else}
        {#each duties as duty}
          <li class="font-semibold">
            {duty.title}
            <ul class="list-disc ml-4 mb-4">
              {#each duty.items as item}
                <li class="font-normal">{item}</li>
              {/each}
            </ul>
          </li>
        {/each}
      {/if}
    </ul>
  </li>
  <li class="detail-section">
    <b>Trends in {province}:</b>
    {@html trends}
  </li>
</ul>

<style>
  .outlook-0 {
    color: white;
    background-color: #000;
  }

  .outlook-1 {
    color: white;
    background-color: red;
  }

  .outlook-2 {
    color: white;
    background-color: yellow;
  }

  .outlook-3 {
    color: white;
    background-color: green;
  }

  .outlook-0,
  .outlook-1,
  .outlook-2,
  .outlook-3 {
    padding: 0.5rem;
    border-radius: 0.5rem;
  }

  .detail-section {
    margin-top: 1rem;
  }

  ul {
    margin-top: 1rem;
  }
</style>
