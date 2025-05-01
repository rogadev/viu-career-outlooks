# Repository Setup for Branch Protection

To fully enforce our development workflow, the repository needs specific branch protection rules configured in GitHub. These settings complement the GitHub Actions workflows.

## Required Branch Protection Rules

### For `main` branch:

1. Go to repository **Settings** > **Branches** > **Branch protection rules** > **Add rule**

2. For "Branch name pattern", enter: `main`

3. Enable the following settings:
   - ✅ Require a pull request before merging
     - ✅ Require approvals (set to 1 or more)
     - ✅ Dismiss stale pull request approvals when new commits are pushed
   - ✅ Require status checks to pass before merging
     - ✅ Search for and enable the status check "validate" from the main-protection workflow
     - ✅ Require branches to be up to date before merging
   - ✅ Require conversation resolution before merging
   - ✅ Do not allow bypassing the above settings

> **Note**: The GitHub Actions workflow no longer checks for PR approvals independently since this is enforced by these branch protection rules.

### For `dev` branch:

1. Go to repository **Settings** > **Branches** > **Branch protection rules** > **Add rule**

2. For "Branch name pattern", enter: `dev`

3. Enable the following settings:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
     - ✅ Search for and enable the status check "validate" from the pr-validation workflow
   - ✅ Require branches to be up to date before merging

## Default Branch Setup

1. Go to repository **Settings** > **General** > **Default branch**
2. Set the default branch to `dev`

## Additional Settings

For stricter control, consider also setting:

1. **Settings** > **Code and automation** > **Actions** > **General**:

   - Set "Workflow permissions" to "Read and write permissions"
   - Enable "Allow GitHub Actions to create and approve pull requests"

2. **Settings** > **Pull Requests**:
   - Enable "Always suggest updating pull request branches"
   - Enable "Automatically delete head branches"

These settings, combined with our GitHub Actions workflows, will enforce proper development practices and protect our production environment.
