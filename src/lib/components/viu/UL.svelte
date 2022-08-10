<ul>
  <slot />
</ul>

<style lang="postcss">
  ul {
    @apply list-disc pl-4 block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
  }
</style>
