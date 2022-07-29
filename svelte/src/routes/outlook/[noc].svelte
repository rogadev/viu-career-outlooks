<script>
  // Properties returned from our shadow endpoint.
  export /** @type {string} */ let noc
  export /** @type {string} */ let title
  export /** @type {string} */ let jobs
  export /** @type {string} */ let requirements
  export /** @type {string} */ let duties
  export /** @type {string} */ let outlook
  export /** @type {string} */ let outlook_verbose
  export /** @type {string} */ let trends
  export /** @type {string} */ let province
</script>

<ul>
  <li>{noc}</li>
  <li>{title}</li>
  <li>{jobs}</li>
  <li>{requirements}</li>
  <li>{duties}</li>
  <li>{outlook}</li>
  <li>{outlook_verbose}</li>
  <li>{@html trends}</li>
  <li>{province}</li>
</ul>
