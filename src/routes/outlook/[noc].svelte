<script>
  // @ts-nocheck
  import H1 from '$lib/components/viu/H1.svelte'
  import H3 from '$lib/components/viu/H3.svelte'
  import UL from '$lib/components/viu/UL.svelte'
  import LI from '$lib/components/viu/LI.svelte'
  import Button from '$lib/components/viu/Button.svelte'

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

<H1 class="text-3xl mb-5 font-bold">{titleCase(title)}</H1>
<h2 class={`outlook-${outlook}`}>
  BC's 3-Year Market Outlook is <b>{outlook_verbose}</b>
</h2>

<Button on:click={() => history.back()}>Back</Button>

<ul>
  <li class="detail-section">
    <H3>Careers in this job market</H3>
    <UL class="list-disc ml-5">
      {#each jobList() as job}
        <LI>{job}</LI>
      {/each}
    </UL>
  </li>
  <li class="detail-section">
    <H3>Employment Requirements</H3>
    <UL class="list-disc ml-5">
      {#each requirements as requirement}
        <LI>{requirement}</LI>
      {/each}
    </UL>
  </li>
  <li class="detail-section">
    <!-- Duties is either an array of objects or an array of strings. -->
    <H3>List of Duties</H3>
    <UL class="list-disc ml-5">
      {#if typeof duties[0] === 'string'}
        {#each duties as duty}
          <LI>{duty}</LI>
        {/each}
      {:else}
        {#each duties as duty}
          <LI class="font-semibold">
            {duty.title}
            <UL class="list-disc ml-4 mb-4">
              {#each duty.items as item}
                <LI class="font-normal">{item}</LI>
              {/each}
            </UL>
          </LI>
        {/each}
      {/if}
    </UL>
  </li>
  <li class="detail-section">
    <H3>Trends in {province}</H3>
    <!-- TODO Need to find a way to style this section. -->
    <div class="trends">
      {@html trends}
    </div>
  </li>
</ul>

<style lang="postcss">
  .outlook-0,
  .outlook-1,
  .outlook-2,
  .outlook-3 {
    @apply px-4 py-2 rounded-full text-white w-fit my-5;
  }

  .outlook-0 {
    background-color: #000;
  }
  .outlook-1 {
    background-color: red;
  }
  .outlook-2 {
    color: black;
    background-color: yellow;
  }
  .outlook-3 {
    background-color: green;
  }

  .detail-section {
    margin-top: 1rem;
  }

  .trends > p {
    font-weight: bold;
  }
</style>
