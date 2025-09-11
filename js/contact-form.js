// Contact Form Google Sheets Integration
// Replace this URL with your Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-us');
    const submitBtn = document.getElementById('secondaymit');
    const messageArea = document.querySelector('.mail-message');
    
    if (submitBtn && form) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            submitContactForm();
        });
    }
});

async function submitContactForm() {
    const form = document.getElementById('contact-us');
    const messageArea = document.querySelector('.mail-message');
    const submitBtn = document.getElementById('secondaymit');
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        message: document.getElementById('message').value.trim(),
        timestamp: new Date().toLocaleString()
    };
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
        showMessage('Please fill in all required fields.', 'error');
        return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
        // Submit to Google Sheets via Apps Script
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('Thank You! Your message has been sent successfully.', 'success');
            form.reset();
        } else {
            throw new Error(result.error || 'Failed to send message');
        }
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showMessage('Sorry, there was an error sending your message. Please try again later.', 'error');
    } finally {
        // Reset button state
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
    }
}

function showMessage(message, type) {
    const messageArea = document.querySelector('.mail-message');
    
    if (messageArea) {
        messageArea.innerHTML = `<strong>${type === 'success' ? 'Success!' : 'Error!'}</strong> ${message}`;
        messageArea.className = `alert ${type === 'success' ? 'gray-bg' : 'red-bg'} mail-message visible-message`;
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageArea.className = 'alert gray-bg mail-message not-visible-message';
        }, 5000);
    } else {
        // Fallback to alert if message area not found
        alert(message);
    }
}

// Alternative method using simple form submission to Google Forms
// Uncomment and modify if you prefer using Google Forms instead
/*
function submitToGoogleForm() {
    const GOOGLE_FORM_URL = 'YOUR_GOOGLE_FORM_SUBMIT_URL';
    
    const formData = new FormData();
    formData.append('entry.NAME_FIELD_ID', document.getElementById('name').value);
    formData.append('entry.EMAIL_FIELD_ID', document.getElementById('email').value);
    formData.append('entry.PHONE_FIELD_ID', document.getElementById('phone').value);
    formData.append('entry.MESSAGE_FIELD_ID', document.getElementById('message').value);
    
    fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
    }).then(() => {
        showMessage('Thank You! Your message has been sent successfully.', 'success');
        document.getElementById('contact-us').reset();
    }).catch(error => {
        console.error('Error:', error);
        showMessage('Sorry, there was an error sending your message. Please try again later.', 'error');
    });
}
*/
