# Now Live!

See it live on (VIU's Website)[https://career-outlooks.viu.ca].

# About Career Outlooks

<h3 style="text-align:center;margin-top:20px;">Ryan Roga, Web Application Developer</h3>
<div style="width:50%;margin:0.5em auto">
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

This project was developed by [VIU](https://www.viu.ca) student web developer [Ryan Roga](https://github.com/rogadev) during his 2022 summer internship as part of the [ITAS Web and Mobile Development Diploma](https://www.viu.ca/programs/trades-applied-technology/information-technology-and-applied-systems-web-and-mobile) program.

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

## Deploying

Please note that during testing, this app was built on the `adapter-auto` SvelteKit adapter. Vercel requires the auto adapter to deploy and test. Docker will require that you change this to the `adapter-node` adapter. To do this, go into the svelte.config.js and change the top import to `adapter-node` from `adapter-auto`. If you wish, you can also remove adapter-auto from package.json to reduce docker container size. It is recommended that you develop and test in adapter-auto to avoid issues running the app locally, and if/when testing on Vercel.

## ENV Variables

There are no environment variables needed to run the SvelteKit app. All API keys and other variables are saved in [the backend API](https://github.com/rogadev/viu-eo-api) which uses a cors policy which restricts cross-origin access.

## Routes

### `/`

[Example 🔗](https://viu-career-outlook.vercel.app/)

The root of this app allows users to search through all VIU credentials available in the API's list of searchable VIU programs (`/api/v1/programs/searchable`).

Users can further filter search results, filter job results for keywords, and reset the search to find other programs career opportunities.

### `/program/[nid]`

[Example 🔗](https://viu-career-outlook.vercel.app/program/7222)

Program pages can use their VIU NID to link to this tool and display a list of career paths available. A search bar allows users to do a fuzzy search to sift through job results.

### `/outlook/[noc]`

[Example 🔗](https://viu-career-outlook.vercel.app/outlook/2175)

This route is used in the app itself, but also linked to in the Drupal view. This is the details view that highlights the requirements, duties, market trends and employment outlook for a given unit group.

## Components

In the components folder you'll find many components in the root of the directory and a `/viu` folder. VIU components are ones styled specifically to match the VIU brand guidelines. These components are used throughout the app. The rest are components used in the app, but not necessarily styled to match the VIU brand.

## Made With SvelteKit

This project was built with the beta version of [SvelteKit](https://kit.svelte.dev/). The SvelteKit docs can be found [here](https://kit.svelte.dev/docs/introduction).

The app uses shadow endpoints (also know as BFF or backend for frontend) to provide some server-side logic that can be processed on the backend quickly, then served up to the frontend.

> NOTE: shadow endpoints (now called API routes or endpoints) have changed significantly since the start of this project. Although the function is the same, the file naming convention and some functionality may break if updated. Find out more [here](https://kit.svelte.dev/docs/routing#server).

## The API

Previously, I used an external API that I wrote in Node + Express and deployed to Heroku, back when they had a free tier. You can find the old repo for it [here](https://github.com/rogadev/viu-eo-api). Later, I moved this logic into SvelteKit. The reasoning for this is because with all the logic in one app/repo, we don't need to containerize and deploy 2 separate apps.

## Containerizing

Note that there is 1 important env variable to add - the user key for the external GC LMI-EO API which needs to be added before deploying. If for any reason you should lose access to this key or it is revoked, you can register with the GC API service and request a new one from the [GC API website](https://api.canada.ca/en/homepage). Copy the .env.example file and rename it to .env. Then add the key to the file.
