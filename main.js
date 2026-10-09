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
async function renderPreview() {
  const code = document.querySelector('code');

  try {
    const response = await fetch('code.js');
    const text = await response.text();
    code.replaceChildren(text);
  } catch (error) {
    console.error('Error:', error);
  }

  hljs.highlightAll();
}

renderPreview();
