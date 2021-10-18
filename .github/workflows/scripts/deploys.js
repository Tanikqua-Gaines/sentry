/* eslint-env node */

/**
 * GHA Workflow helpers for deploys
 *
 */

module.exports = {
  /**
   * Checks what files were changed in a commit and adds a GH check
   * corresponding with changes. This can be used by our deploy system to
   * determine what Freight deploy we can use.
   */
  updateChangeType: async ({github, context, fileChanges}) => {
    const {frontend, backend} = fileChanges;
    const frontendOnly = frontend && !backend;
    const backendOnly = backend && !frontend;

    const name = frontendOnly
      ? 'only frontend changes'
      : backendOnly
      ? 'only backend changes'
      : 'fullstack changes';

    if (!name) {
      return;
    }

    github.checks.create({
      owner: 'getsentry',
      repo: 'sentry',
      name,
      head_sha: context.sha,
      status: 'completed',
      conclusion: 'success',
    });
  },
};
