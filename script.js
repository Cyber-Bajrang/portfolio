<script type="text/javascript">
    // --- 1. EMAILJS SETUP ---
    // Paste your actual Public Key here
    emailjs.init("tKu9r3Fk_uwiuJBoe"); 

    let generatedOTP;

    function sendOTP() {
        const emailInput = document.getElementById("email").value;
        const otpBtn = document.getElementById("send-otp-btn");

        if (!emailInput || !emailInput.includes('@')) {
            alert("Please enter a valid email address first.");
            return;
        }

        // Generate 4-digit code
        generatedOTP = Math.floor(1000 + Math.random() * 9000);

        // Parameters to send to your EmailJS Template
        const templateParams = {
            to_email: emailInput,
            otp_code: generatedOTP
        };

        otpBtn.innerText = "Sending code...";
        otpBtn.disabled = true;

        // Paste your Service ID and Template ID here
        emailjs.send("service_36i0u2d", "template_hndyc2v", templateParams)
            .then(function() {
                otpBtn.innerText = "Code Sent!";
                document.getElementById("otp-section").style.display = "block";
            }, function(error) {
                console.log("EmailJS Error:", error);
                alert("Failed to send code. Check console for details.");
                otpBtn.innerText = "Send Verification Code";
                otpBtn.disabled = false;
            });
    }

    function verifyOTP() {
        const userOTP = document.getElementById("otp_input").value;
        const msgElement = document.getElementById("otp-message");
        const finalSubmitBtn = document.querySelector('#ajax-contact-form button[type="submit"]');

        if (userOTP == generatedOTP) {
            msgElement.style.color = "green";
            msgElement.innerText = "Email verified! You can now send your message.";
            
            // Unlock the form
            document.getElementById("is_verified").value = "true";
            document.getElementById("email").readOnly = true; // Lock email field so they can't change it now
            
            // Unlock final submit button
            finalSubmitBtn.disabled = false;
            finalSubmitBtn.style.opacity = "1";
            finalSubmitBtn.style.cursor = "pointer";
        } else {
            msgElement.style.color = "red";
            msgElement.innerText = "Incorrect code. Try again.";
        }
    }

    // --- 2. YOUR FORMSUBMIT AJAX LOGIC ---
    document.getElementById('ajax-contact-form').addEventListener('submit', async function(event) {
        event.preventDefault(); 

        // Final security check: Did they actually verify?
        if (document.getElementById("is_verified").value !== "true") {
            alert("Security Error: Please verify your email first.");
            return;
        }

        const form = event.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerText;

        // Terminal-style feedback
        submitBtn.innerText = 'Executing transmission...';
        submitBtn.disabled = true;

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            message: document.getElementById('message').value,
            _subject: "New Message from bajrang.xyz!", 
            _captcha: false 
        };

        try {
            // Send data silently to FormSubmit
            const response = await fetch('https://formsubmit.co/ajax/06e6d321ca2566c97353bb5ce05c14b3', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Assuming you have a thankyou.html page ready!
                window.location.href = "thankyou.html";
            } else {
                throw new Error('Server rejected the payload');
            }
        } catch (error) {
            // Error State
            submitBtn.innerText = 'ERR: Connection Timeout';
            submitBtn.style.backgroundColor = '#ff5555'; 
            submitBtn.style.borderColor = '#ff5555';
        } finally {
            // Reset button after 4 seconds if it didn't redirect
            setTimeout(() => {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                // Update these variables if they are defined in your CSS!
                submitBtn.style.backgroundColor = 'var(--accent-color, #fff)'; 
                submitBtn.style.color = '#000';
                submitBtn.style.borderColor = 'var(--accent-color, #fff)';
            }, 4000);
        }
    });
</script>
