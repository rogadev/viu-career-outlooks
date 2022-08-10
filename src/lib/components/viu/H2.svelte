<h2>
  <slot />
</h2>

<style>
  h2 {
    box-sizing: border-box;
    font-family: inherit;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: 0.02em;
    margin: 0 0 0.25em 0;
    font-weight: bold;
    background-image: none;
    font-size: 20px;
    color: #003b5c;
    margin-top: 1em;
  }
  @media (max-width: 768px) {
    h2 {
      font-size: 30px;
    }
  }
  @media (max-width: 992px) {
    h2 {
      font-size: 36px;
    }
  }
</style>
