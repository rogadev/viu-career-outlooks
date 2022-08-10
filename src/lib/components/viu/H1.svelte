<h1>
  <slot />
</h1>

<style>
  h1 {
    color: #003b5c;
    scroll-margin-top: 3ex;
    line-height: 1.1em;
    font-size: 24px;
    font-weight: bold;
    font-style: normal;
    letter-spacing: 0.02em;
    margin: 0 0 0.25em 0;
    font-family: inherit;
    display: block;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
  }
  @media (min-width: 768px) {
    h1 {
      scroll-margin-top: 3ex;
      font-size: 42px;
      line-height: 1.1em;
      font-weight: bold;
      font-style: normal;
      letter-spacing: 0.02em;
      margin: 0 0 0.25em 0;
      font-family: inherit;
      margin-block-start: 0.83em;
      margin-block-end: 0.83em;
      display: block;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
    }
  }
</style>
