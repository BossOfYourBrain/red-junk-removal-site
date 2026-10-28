// Progressive enhancement for feedback form
(function () {
  const form = document.getElementById('feedback-form');
  const submitBtn = document.getElementById('submit-btn');
  const messageEl = document.getElementById('form-message');

  if (!form || !submitBtn || !messageEl) return;

  // Handle success redirect from fallback submission
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('sent') === '1') {
    showMessage('Thanks. We read every one of these.', 'success');
    window.history.replaceState({}, '', window.location.pathname);
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Collect form data
    const formData = new FormData(form);
    const gripes = formData.getAll('gripe');
    const story = formData.get('story');
    const email = formData.get('email');
    const postalCode = formData.get('postal_code');
    const website = formData.get('website');

    // Build payload
    const payload = {
      gripes,
      story: story || '',
      email: email || '',
      postal_code: postalCode,
      website
    };

    // Disable button and show loading state
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    hideMessage();

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        showMessage('Thanks. We read every one of these.', 'success');
        form.reset();
      } else {
        showMessage(result.error || 'That didn\'t send. Please try again in a minute.', 'error');
      }
    } catch (err) {
      showMessage('That didn\'t send. Please try again in a minute.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });

  function showMessage(text, type) {
    messageEl.textContent = text;
    messageEl.className = 'form-message form-message-' + type;
    messageEl.style.display = 'block';
  }

  function hideMessage() {
    messageEl.style.display = 'none';
  }
})();
