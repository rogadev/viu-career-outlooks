<script>
  // @ts-nocheck
  import H1 from '$lib/components/viu/H1.svelte'
  import H3 from '$lib/components/viu/H3.svelte'
  import UL from '$lib/components/viu/UL.svelte'
  import LI from '$lib/components/viu/LI.svelte'
  import Button from '$lib/components/viu/Button.svelte'
  import StickyBackButton from '$lib/components/StickyBackButton.svelte'

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

<H1>{titleCase(title)}</H1>

<h2 class={`outlook-${outlook}`}>
  BC's 3-Year Market Outlook is <b>{outlook_verbose}</b>
</h2>
<StickyBackButton />

<ul>
  <li class="detail-section">
    <H3>Careers in this job market</H3>
    <UL>
      {#each jobList() as job}
        <LI>{job}</LI>
      {/each}
    </UL>
  </li>
  <li class="detail-section">
    <H3>Employment Requirements</H3>
    <UL>
      {#each requirements as requirement}
        <LI>{requirement}</LI>
      {/each}
    </UL>
  </li>
  <li class="detail-section">
    <!-- Duties is either an array of objects or an array of strings. -->
    <H3>List of Duties</H3>
    <UL>
      {#if typeof duties[0] === 'string'}
        {#each duties as duty}
          <LI>{duty}</LI>
        {/each}
      {:else}
        {#each duties as duty}
          <LI>
            {duty.title}
            <UL>
              {#each duty.items as item}
                <LI>{item}</LI>
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
    @apply px-4 py-3 rounded shadow text-white w-fit my-5;
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

  .trends :global(p) {
    font-weight: bold;
    margin-top: 1rem;
  }

  .trends :global(ul) {
    list-style-type: disc;
    padding: 0;
    margin-top: 0.5rem;
  }

  .trends :global(li) {
    margin-bottom: 0.5rem;
    margin-left: 1.5rem;
  }
</style>
