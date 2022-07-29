<!-- 
  What I should have...
  {
        noc,
        title: results[1].title,
        jobs: results[1].jobs,
        requirements: results[1].requirements,
        duties: results[1].duties,
        outlook: results[0].outlook,
        outlook_verbose: results[0].outlook_verbose,
        trends: results[0].trends,
        province: 'British Columbia',
        eruid: 5900,
      }
 -->
<script>
  export /** @type {any} */ let noc

  $: console.log(noc)
</script>

<ul>
  <li>{noc}</li>
</ul>
