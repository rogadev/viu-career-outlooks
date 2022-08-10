<script>
  import Button from '$lib/components/viu/Button.svelte'
  import H1 from '$lib/components/viu/H1.svelte'
  import H2 from '$lib/components/viu/H2.svelte'
  import P from '$lib/components/viu/P.svelte'
  import ContentArea from '$lib/components/viu/ContentArea.svelte'
</script>

<svelte:head>
  <title>VIU | Graduate Career Outlooks</title>
</svelte:head>

<div>
  <div class="w-4/5 mx-auto">
    <H1>Career Finder &amp; Market Outlooks</H1>
    <H2>Plan your future, prepare for success.</H2>
    <ContentArea>
      <P>
        Your education is a big investment in your future. It's important to
        know that you're making the right choice.
      </P>
      <P>
        This tool can help you connect VIU programs and credentials with real
        world career opportunities. Click a career to further explore a deeper
        description of the industry, educational requirements, and the perhaps
        most importantly, the market outlook. Outlook data is provided by the
        Government of Canada Labour Market Information API and reflects a 3-year
        employment outlook by occupation.
      </P>
    </ContentArea>
  </div>

  <div class="flex w-2/5 mx-auto items-center justify-center mt-6">
    <Button>
      <a href="/careers/search">Get Started</a>
    </Button>
  </div>
</div>
