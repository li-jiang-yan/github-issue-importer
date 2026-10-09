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
