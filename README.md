This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Testing

This project uses Jest and React Testing Library for testing. Tests are written in JavaScript rather than TypeScript to avoid additional dependencies in CI/CD pipelines.

Run tests locally with:

```bash
pnpm test
```

For more details on writing and running tests, see our [Testing Guidelines](./docs/testing.md).

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details on:

- Development workflow
- Branch strategy
- Testing requirements
- Code review process

### Quick Start for Contributors

1. Fork the repository
2. Clone your fork
3. Switch to dev branch: `git checkout dev`
4. Create your feature branch: `git checkout -b feature/amazing-feature`
5. Follow our [Contributing Guide](./CONTRIBUTING.md) for next steps

### Workflow Enforcement

This project uses GitHub Actions to enforce our development workflow:

- PRs to `dev` require passing tests and linting
- PRs to `main` require at least one approval and passing tests
- Merging to `main` automatically triggers deployment to production

Always develop in `dev` first and only merge to `main` when ready for production deployment.
