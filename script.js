document.getElementById('ajax-contact-form').addEventListener('submit', async function(event) {
    // 1. This is the magic command that blocks the redirect
    event.preventDefault(); 

    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerText;

    // 2. Give the user some terminal-style feedback
    submitBtn.innerText = 'Executing transmission...';
    submitBtn.disabled = true;

    // 3. Gather the form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value,
        _subject: "New Message from bajrang.xyz!", // Custom email subject
        _captcha: false // Disables the visual captcha so it sends silently
    };

    try {
        // 4. Send the data silently to FormSubmit's AJAX endpoint
        // NOTE: Replace the email below with your actual Gmail address
        const response = await fetch('https://formsubmit.co/ajax/06e6d321ca2566c97353bb5ce05c14b3', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            window.location.href = "thankyou.html";
        } else {
            throw new Error('Server rejected the payload');
        }
    } catch (error) {
        // 6. Error State
        submitBtn.innerText = 'ERR: Connection Timeout';
        submitBtn.style.backgroundColor = '#ff5555'; // Red for error
        submitBtn.style.borderColor = '#ff5555';
    } finally {
        // 7. Reset the button back to normal after 4 seconds
        setTimeout(() => {
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
            submitBtn.style.backgroundColor = 'var(--accent-color)';
            submitBtn.style.color = '#000';
            submitBtn.style.borderColor = 'var(--accent-color)';
        }, 4000);
    }
});