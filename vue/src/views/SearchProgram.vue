
<script setup>
import { ref } from "vue";

import SelectOptions from "@components/SelectOptions.vue";
import Results from "@components/Results.vue";
import MyButton from "@components/MyButton.vue";

import { useRoute } from "vue-router";
const route = useRoute();

/**
 * Imported list of programs from VIU.
 */
const programs =
  import.meta.env.MODE === "PROD"
    ? await fetch("https://api.viu.ca/v1/programs")
    : (await import("@assets/temp_programs.json")).default;
const options = programs
  .map((program) => ({
    value: program.nid,
    title: program.title,
  }))
  .sort((a, b) => a.title.localeCompare(b.title));

const selectedProgramNID = ref("");
const results = ref([]);
const loading = ref(false);
const error = ref(false);
const noResults = ref(false);
const showResults = ref(false);
const nid = ref(null);
const showSearch = ref(true);
const resultKey = ref(0);

// Initial NID, if provided to route params.
const initialNID = ref(route.params.nid || false);

if (initialNID !== false) {
  nid.value = initialNID;
  showSearch.value = false;
} else {
  showSearch.value = true;
}

async function runSearch() {
  nid.value = selectedProgramNID.value;
  loading.value = true;

  const response = await fetch(
    `https://viu-career-outlook.herokuapp.com/api/v1/jobs/program/${selectedProgramNID.value}`
  );
  results.value = await response.json();

  loading.value = false;

  if (results.value.length < 1) {
    noResults.value = true;
  } else {
    noResults.value = false;
    resultKey.value++;
  }

  showResults.value = true;
}
</script>

<template>
  <div>
    <h1>Search by Program</h1>
    <SelectOptions
      :options="options"
      @selectedOption="selectedProgramNID = $event"
      @keypress.enter="runSearch"
    />
    <div class="my-4">
      <MyButton @click="runSearch">Search</MyButton>
    </div>
    <p>Selected NID: {{ selectedProgramNID || "''" }}</p>
    <p>Results: {{ results }}</p>
    <div id="results-area" v-if="showResults">
      <div id="no-results" v-if="noResults">
        <p>No results were found for that program.</p>
      </div>
      <div id="results-found" v-else>
        <Results :results="results" key="resultKey" />
      </div>
    </div>
  </div>
</template>