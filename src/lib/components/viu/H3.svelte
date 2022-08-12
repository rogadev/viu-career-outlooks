<h3 class="font-extrabold text-viu-primary text-2xl leading-4 my-4">
  <slot />
</h3>

<style>
  h3 {
    box-sizing: border-box;
    font-family: inherit;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: 0.02em;
    margin: 0 0 0.5em 0;
    font-weight: 800;
    font-size: 22px;
    color: #003b5c;
    margin-top: 0;
  }

  @media (max-width: 768px) {
    h3 {
      font-size: 20px;
    }
  }

  @media (max-width: 480px) {
    h3 {
      font-size: 18px;
    }
  }
</style>
