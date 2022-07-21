<script setup>
defineProps({
  options: {
    type: Array,
    default: () => [],
    required: true,
  },
});
</script>

<template>
  <select
    class="
      bg-white
      relative
      w-full
      border border-gray-300
      rounded-md
      shadow-sm
      pl-3
      pr-10
      py-2
      text-left
      cursor-default
      focus:outline-none
      focus:ring-1
      focus:ring-indigo-500
      focus:border-indigo-500
      sm:text-sm
    "
    @change="$emit('selectedOption', $event.target.value)"
  >
    <option
      class="text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9"
      v-for="(option, index) of options.sort((a, b) =>
        a.title.localeCompare(b.title)
      )"
      :value="option.value"
      :id="`option-${index + 1}`"
      :key="index"
      role="option"
    >
      {{ option.title }}
    </option>
  </select>
</template>