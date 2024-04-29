function previewImage(event) {
    const input = event.target;
    const preview = document.getElementById('imagePreview');

    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e) {
        preview.src = e.target.result;
        preview.style.display = 'block';
      };

      reader.readAsDataURL(input.files[0]);
    } else {
      preview.src = '#';
      preview.style.display = 'none';
    }
  }

  document.getElementById('productForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    fetch(this.action, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            console.log('Form submitted successfully!');
        } else {
            throw new Error('Form submission failed.');
        }
    })
    .catch(error => {
        console.error('Error submitting form:', error);
    });
});

