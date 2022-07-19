<script setup>
</script>

<template>
  <div>
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