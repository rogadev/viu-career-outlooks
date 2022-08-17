# About Career Outlooks

<h3 style="text-align:center;margin-top:20px;">Ryan Roga, Web Application Developer</h3>
<div style="width:50%;margin:0 auto;">
  <div style="display:flex;justify-content:space-evenly;margin-bottom:20px;">
    <a href="https://github.com/rogadev">
      <img src="readme_img/GitHub-Light-32px.png" height="25px" />
    </a>
    <a href="https://www.linkedin.com/in/ryanroga/">
      <img src="readme_img/LinkedIn.png" height="25px" />
    </a>
    <a href="https://twitter.com/roga_dev">
      <img src="readme_img/Twitter-Blue-Round.png" height="25px" />
    </a>
    <a href="https://roga.dev/">
      <img src="https://roga.dev/assets/thumbnail.2c8f42c8.jpg" height="25px" style="border-radius:999px;" />
    </a>
  </div>
</div>

This project was developed by student web developer [Ryan Roga](https://github.com/rogadev) during his 2022 summer internship at [VIU](https://www.viu.ca) as part of the [ITAS Web and Mobile Development Diploma](https://www.viu.ca/programs/trades-applied-technology/information-technology-and-applied-systems-web-and-mobile) program.

Your post-secondary education path is a big decision. Investing in your future should be something you put a lot of time, energy, and thought into. Surprisingly, many students embark on their educational journey without knowing what a given credential will afford them in the real world.

Career Outlooks is a tool to help connect VIU programs and credentials to career opportunities available to students upon graduation. It also connects to real-world market outlook data to provide detailed information about employment trends and outlook in that industry for all of British Columbia.

# Developer Docs

## Getting Started

### Install Dependencies

Install the dependencies for this project using the following command:

```bash
npm install
```

After install, do you have security vulnerabilities? If so, see below instructions for how to push updates to fix the issues. For now, the dev server will run fine if you'd like to test the app locally.

### Security Vulnerabilities

During install, if you run into security vulnerabilities, you can safely upgrade packages using the following command: 

```bash
npm audit fix
```

Afterward, if you have outstanding issues, you may need to add `--force` to the above command. **NOTE:** this will introduce breaking changes that you may have to fix manually before your dev server will run, and before you push to production.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
