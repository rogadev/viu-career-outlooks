<div class="content-area">
  <slot />
</div>

<style>
  .content-area {
    box-sizing: border-box;
    display: block;
    color: #3b3b3b;
    font-family: 'ProximaNova', Corbel, Arial, sans-serif;
    font-size: 14px;
    line-height: 1.42857;
    -webkit-tap-highlight-color: transparent;
    -webkit-text-size-adjust: 100%;
  }
  @media (min-width: 768px) {
    .content-area {
      font-size: 16px;
    }
  }
</style>
