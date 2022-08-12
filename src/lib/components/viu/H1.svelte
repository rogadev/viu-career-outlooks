<h1>
  <slot />
</h1>

<style>
  h1 {
    box-sizing: border-box;
    font-family: inherit;
    font-weight: bold;
    font-style: normal;
    letter-spacing: 0.02em;
    margin: 0 0 0.25em 0;
    line-height: 1.1em;
    font-size: 24px;
    scroll-margin-top: 3ex;
    margin-top: 0;
    color: #003b5c;
  }
  @media (min-width: 768px) {
    h1 {
      font-size: 42px;
    }
  }

  @media (min-width: 1024px) {
    h1 {
      font-size: 50px;
    }
  }
</style>
