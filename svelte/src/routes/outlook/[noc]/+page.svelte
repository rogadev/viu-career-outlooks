<script>
  // @ts-nocheck

  // HELPERS
  import titleCase from '$lib/helpers/titleCase.js'

  // COMPONENTS
  import H1 from '$lib/components/viu/H1.svelte'
  import H3 from '$lib/components/viu/H3.svelte'
  import UL from '$lib/components/viu/UL.svelte'
  import LI from '$lib/components/viu/LI.svelte'
  import StickyBackButton from '$lib/components/StickyBackButton.svelte'

  /** @type {any} */ export let errors // Complains if unused.
  export let data // Backend data props.
  let noc = data.noc
  let title = data.title
  let jobs = data.jobs
  let requirements = data.requirements
  let duties = data.duties
  let outlook = data.outlook
  let outlook_verbose = titleCase(data.outlook_verbose)
  let trends = data.trends
  let province = data.province

  // Stringifies the job list if comma separated list.
  $: jobList = () => {
    const list = String(jobs).split(',')
    return list.map((job) => titleCase(job))
  }

  // Ensures reactive updating if not immediately mate available on load.
  $: titleCaseTitle = titleCase(title)

  // Logs errors to console if any exist. Svelte may complain if error prop not set and handled.
  $: if (errors) console.error(errors)
</script>

<svelte:head>
  <title>
    {titleCase(title)} | 3-Year Market Outlook | {province} (NOC {noc})
  </title>
</svelte:head>

<H1>{titleCaseTitle}</H1>
<StickyBackButton />

<div class="flex flex-col justify-center">
  <h2 class={`outlook-${outlook} mb-1 mx-auto`}>
    BC's 3-Year Market Outlook is <b>{outlook_verbose}</b>
  </h2>

  <div class="flex flex-row gap-1 text-center justify-center">
    <div class="outlook-0 h-[55px] min-w-[55px] mr-4">0</div>
    <div class="outlook-1 h-[55px] min-w-[55px]">1</div>
    <div class="outlook-2 h-[55px] min-w-[55px]">2</div>
    <div class="outlook-3 h-[55px] min-w-[55px]">3</div>
    <div class="outlook-4 h-[55px] min-w-[55px]">4</div>
    <div class="outlook-5 h-[55px] min-w-[55px]">5</div>
  </div>

  <div class="flex flex-row gap-1 text-center mb-10 justify-center">
    <div class="h-4 min-w-[55px] mr-4">{outlook === 0 ? '⬆️' : ''}</div>
    <div class="h-4 min-w-[55px]">{outlook === 1 ? '⬆️' : ''}</div>
    <div class="h-4 min-w-[55px]">{outlook === 2 ? '⬆️' : ''}</div>
    <div class="h-4 min-w-[55px]">{outlook === 3 ? '⬆️' : ''}</div>
    <div class="h-4 min-w-[55px]">{outlook === 4 ? '⬆️' : ''}</div>
    <div class="h-4 min-w-[55px]">{outlook === 5 ? '⬆️' : ''}</div>
  </div>
</div>

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
    <H3>List of Duties</H3>
    <UL>
      <!-- NOTE: Duties is either an array of objects or an array of strings. Handle both -->
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
      <!--  -->
    </UL>
  </li>
  <li class="detail-section">
    <H3>Trends in {province}</H3>
    <div class="trends">
      {@html trends}
    </div>
  </li>
</ul>

<style lang="postcss">
  /* Requires postcss for @apply directive. */
  .outlook-0,
  .outlook-1,
  .outlook-2,
  .outlook-3,
  .outlook-4,
  .outlook-5 {
    @apply px-4 py-3 rounded-lg shadow-lg text-white w-fit;
  }

  .outlook-0 {
    background-color: #333333;
    color: #cccccc;
  }
  .outlook-1 {
    background-color: #b30000;
    color: #ffffff;
  }
  .outlook-2 {
    background-color: #ff6600;
    color: #ffffff;
  }
  .outlook-3 {
    background-color: #007bff;
    color: #ffffff;
  }
  .outlook-4 {
    background-color: #007a33;
    color: #ffffff;
  }

  .outlook-5 {
    background-color: #00cc33;
    color: #ffffff;
  }

  .detail-section {
    margin-top: 1rem;
  }

  /* Globals required for 'trends' html string. */

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
