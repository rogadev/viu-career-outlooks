<script setup>
</script>

<template>
  <div>
    <div class="w-4/5 mx-auto">
      <h1>Career Finder &amp; Market Outlook Tool</h1>
      <h2>Plan your future, prepare for success.</h2>
      <p>
        This tool can help you connect VIU programs and credentials with real
        world career opportunities. Click a career to further explore a deeper
        description of the industry, educational requirements, and the perhaps
        most importantly, the market outlook. Outlook data is provided by the
        Government of Canada Labour Market Information API and reflects a 3-year
        employment outlook by occupation.
      </p>
    </div>
    <h2 class="text-center">Search by...</h2>
    <div class="flex justify-evenly">
      <router-link to="/search-by-program">VIU Program</router-link>
      <router-link to="/search-by-keywords">Credential Keywords</router-link>
    </div>
  </div>
</template>

<style scoped>
a {
  color: #333;
  text-decoration: none;
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 5px;
  margin: 5px;
}

a:hover {
  background-color: #ccc;
  box-shadow: #333 0px 0px 5px;
}
</style>