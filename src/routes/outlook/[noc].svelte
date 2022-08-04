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
    <b>List of Duties:</b>
    <ul>
      {#each duties as duty}
        <li>{duty}</li>
      {/each}
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
