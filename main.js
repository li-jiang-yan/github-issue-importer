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
    const file = fileInput.files[0];
    const text = await file.text();

    for (const [rowNumber, row] of text.split('\n').entries()) {
      const [title, assignee, body] = row.split(',').map(col => col.trim());

      if (rowNumber === 0) {
        if (title    !== 'title')    throw new Error('CSV[0][0] !== "title"!');
        if (assignee !== 'assignee') throw new Error('CSV[0][1] !== "assignee"!');
        if (body     !== 'body')     throw new Error('CSV[0][2] !== "body"!');
      } else {
        console.log(`${title}, ${assignee}, ${body}`);
      }
    }
  } catch (error) {
    output.innerHTML = `<div class="alert alert-danger alert-dismissible fade show">${error}</div>`;
  }
}

document.querySelector('form').addEventListener('submit', importIssues);
