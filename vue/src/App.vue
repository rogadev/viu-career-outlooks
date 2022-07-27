<script setup>
//
</script>

<template>
  <div class="app-area">
    <Suspense>
      <router-view></router-view>
    </Suspense>
  </div>
</template>

<style>
#app {
  font-family: "ProximaNova", Corbel, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #222;
  font-size: 18px;
  border: 1rem solid #003b5c;
  margin: 0;
  padding: 1.5rem;
  background-color: #fff;
  min-height: 100vh;
}

h1 {
  margin: 0 0 1rem !important;
}

h2 {
  margin: 0 0 0.5rem !important;
}

p {
  margin: 0 0 10px !important;
}

a,
a:visited,
a:active {
  color: #007dba;
  text-decoration: none;
  cursor: pointer;
}

a:hover {
  text-decoration: underline;
}

h1 {
  @apply text-3xl md:text-4xl lg:text-5xl font-bold !important;
}

h2 {
  @apply text-2xl md:text-3xl lg:text-4xl font-semibold !important;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  color: #003b5c;
}

.app-area {
  margin: 1rem 0 0 0;
  width: full;
}
</style>
