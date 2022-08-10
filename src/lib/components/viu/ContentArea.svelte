<div class="content-area">
  <slot />
</div>

<style>
  .content-area {
    box-sizing: border-box;
    display: block;
    color: #3b3b3b;
    font-size: 14px;
    line-height: 1.42857;
  }
  @media (min-width: 768px) {
    .content-area {
      font-size: 16px;
    }
  }
  @media (min-width: 992px) {
    .content-area {
      font-size: 18px;
      line-height: 1.5em;
    }
  }
</style>
