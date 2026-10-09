import { Octokit } from "https://esm.sh/@octokit/core";


// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})();


// Render preview
const ownerInput = document.getElementById('owner');
const repoInput = document.getElementById('repo');

async function renderPreview() {
  const code = document.querySelector('code');
  const owner = ownerInput.value;
  const repo = repoInput.value;

  try {
    const response = await fetch('code.js');
    let text = await response.text();

    if (owner !== '') {
      text = text.replace('{owner}', owner).replace('OWNER', owner);
    }

    if (repo !== '') {
      text = text.replace('{repo}', repo).replace('REPO', repo);
    };

    code.replaceChildren(text);
  } catch (error) {
    console.error('Error:', error);
  }

  delete code.dataset.highlighted;
  hljs.highlightAll();
}

ownerInput.addEventListener('input', renderPreview);
repoInput.addEventListener('input', renderPreview);
renderPreview();


// Import GitHub issues
const fileInput = document.getElementById('file');
const output = document.getElementById('output');

async function importIssues(event) {
  event.preventDefault();

  try {
    const owner = ownerInput.value;
    const repo = repoInput.value;
    const file = fileInput.files[0];
    const text = await file.text();
    const octokit = new Octokit(
      {
        auth: document.getElementById('token').value
      }
    );
    const outputAlert = document.createElement('div');
    outputAlert.classList.add('alert', 'alert-info', 'alert-dismissible', 'fade', 'show');

    for (const [rowNumber, row] of text.split('\n').entries()) {
      const logMessage = document.createElement('div');

      if (row.trim() === '') {
        logMessage.innerText = 'Done!';
        outputAlert.appendChild(logMessage);
        break;
      }

      const columns = Papa.parse(row).data[0];
      const [title, assignee, body] = columns;

      if (rowNumber === 0) {
        if (title    !== 'title')    throw new Error('CSV[0][0] !== "title"!');
        if (assignee !== 'assignee') throw new Error('CSV[0][1] !== "assignee"!');
        if (body     !== 'body')     throw new Error('CSV[0][2] !== "body"!');
      } else {
        if (rowNumber === 1) {
          output.replaceChildren(outputAlert);
        }

        const response = await octokit.request(
          `POST /repos/${owner}/${repo}/issues`,
          {
            owner: owner,
            repo: repo,
            title: title,
            body: body,
            assignees: [
              assignee
            ],
            labels: [],
            headers: {
              'X-GitHub-Api-Version': '2026-03-10'
            }
          }
        );

        logMessage.innerText = `${response.status} - title: ${response.data.title}, assignee: ${response.data.assignees[0].login}, body: ${response.data.body}\n\n`;
        outputAlert.appendChild(logMessage);
      }
    }
  } catch (error) {
    output.innerHTML = `<div class="alert alert-danger alert-dismissible fade show">${error}</div>`;
  }
}

document.querySelector('form').addEventListener('submit', importIssues);
