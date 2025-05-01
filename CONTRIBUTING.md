# Contributing to Our Project

## Development Workflow

1. **Branch Strategy**

   - Always develop in the `dev` branch
   - Create feature branches from `dev` using format: `feature/your-feature-name`
   - Never commit directly to `main` - this branch is for production only

2. **Before You Start**

   - Ensure you're working from the latest `dev` branch:
     ```bash
     git checkout dev
     git pull origin dev
     ```
   - Create your feature branch:
     ```bash
     git checkout -b feature/your-feature-name
     ```

3. **Making Changes**

   - Write tests for your code
   - Follow our [coding standards](./docs/coding-standards.md)
   - Commit your changes with clear, descriptive messages

4. **Testing**

   - Run tests locally before pushing:
     ```bash
     pnpm test
     ```
   - Ensure all existing tests pass
   - Add new tests for new features

5. **Code Review Process**

   - Create a Pull Request (PR) to merge into `dev`
   - Request review from at least one team member
   - Address any feedback or comments
   - Tests will run automatically on PR creation

6. **Merging to Production**
   - Once features are ready in `dev`, create a PR to `main`
   - Requires approval from at least one reviewer
   - All tests must pass before merging
   - Merging to `main` will automatically deploy to production

## Important Notes

- ⚠️ Never push directly to `main`
- Write meaningful commit messages
- Keep PRs focused and reasonably sized
- Document any new features or API changes
