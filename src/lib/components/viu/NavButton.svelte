<script>
  export let disabled = false
</script>

<button
  class="hover:bg-viu-primary hover:border-viu-primary"
  on:click
  type="button"
  aria-label="button"
  {disabled}
>
  <slot />
</button>

<style>
  button {
    font-size: 14px;
    box-sizing: border-box;
    text-decoration: none;
    display: table;
    margin: 0;
    padding: 0.7em 1em;
    border-radius: 500px;
    border: 1px solid;
    line-height: 1.2em;
    text-align: center;
    color: white;
    background-color: #007dba;
    border-color: #007dba;
  }
  @media (min-width: 768px) {
    button {
      font-size: 1em;
      scroll-margin-top: 3ex;
    }
  }
</style>
