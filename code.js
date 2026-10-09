const octokit = new Octokit({
  auth: 'YOUR-TOKEN' // hidden
})

await octokit.request(
  'POST /repos/{owner}/{repo}/issues',
  {
    owner: 'OWNER',
    repo: 'REPO',
    title: '<title column>',
    body: '<body column>',
    assignees: [
      '<assignee column>'
    ],
    milestone: 1,
    labels: [],
    headers: {
      'X-GitHub-Api-Version': '2026-03-10'
    }
  }
)
