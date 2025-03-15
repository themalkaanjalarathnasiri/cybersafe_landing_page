/**
 * CyberSafe Insurance - Form Validation and Submission
 * Handles form validation and AJAX submission of the demo request form
 */

document.addEventListener('DOMContentLoaded', function() {
    const demoForm = document.getElementById('demo-form');
    const flashMessages = document.getElementById('flash-messages');
    
    if (demoForm) {
        initFormValidation(demoForm);
    }
    
    /**
     * Initialize form validation
     * @param {HTMLFormElement} form - The form element to validate
     */
    function initFormValidation(form) {
        const nameInput = form.querySelector('#name');
        const companyInput = form.querySelector('#company');
        const emailInput = form.querySelector('#email');
        const reasonSelect = form.querySelector('#reason');
        const contactMethodSelect = form.querySelector('#contact_preference');
        
        const nameError = form.querySelector('#name-error');
        const companyError = form.querySelector('#company-error');
        const emailError = form.querySelector('#email-error');
        const reasonError = form.querySelector('#reason-error');
        const contactError = form.querySelector('#contact-error');
        
        // Add event listeners for real-time validation
        nameInput.addEventListener('blur', () => {
            validateName(nameInput.value) ? hideError(nameError) : showError(nameError, 'Please enter your full name');
        });
        
        companyInput.addEventListener('blur', () => {
            validateCompany(companyInput.value) ? hideError(companyError) : showError(companyError, 'Please enter your company name');
        });
        
        emailInput.addEventListener('blur', () => {
            validateEmail(emailInput.value) ? hideError(emailError) : showError(emailError, 'Please enter a valid email address');
        });
        
        reasonSelect.addEventListener('change', () => {
            validateReason(reasonSelect.value) ? hideError(reasonError) : showError(reasonError, 'Please select your primary interest');
        });
        
        contactMethodSelect.addEventListener('change', () => {
            validateContactMethod(contactMethodSelect.value) ? hideError(contactError) : showError(contactError, 'Please select your preferred contact method');
        });
        
        // Form submission handler
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all fields
            let isValid = true;
            
            if (!validateName(nameInput.value)) {
                showError(nameError, 'Please enter your full name');
                isValid = false;
            }
            
            if (!validateCompany(companyInput.value)) {
                showError(companyError, 'Please enter your company name');
                isValid = false;
            }
            
            if (!validateEmail(emailInput.value)) {
                showError(emailError, 'Please enter a valid email address');
                isValid = false;
            }
            
            if (!validateReason(reasonSelect.value)) {
                showError(reasonError, 'Please select your primary interest');
                isValid = false;
            }
            
            if (!validateContactMethod(contactMethodSelect.value)) {
                showError(contactError, 'Please select your preferred contact method');
                isValid = false;
            }
            
            // If all validations pass, submit the form via AJAX
            if (isValid) {
                submitForm(form);
            }
        });
        
        /**
         * Validate name field
         * @param {string} value - The input value to validate
         * @returns {boolean} - Whether the validation passed
         */
        function validateName(value) {
            return value.trim().length >= 2;
        }
        
        /**
         * Validate company name field
         * @param {string} value - The input value to validate
         * @returns {boolean} - Whether the validation passed
         */
        function validateCompany(value) {
            return value.trim().length >= 2;
        }
        
        /**
         * Validate email field
         * @param {string} value - The input value to validate
         * @returns {boolean} - Whether the validation passed
         */
        function validateEmail(value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value);
        }
        
        /**
         * Validate reason select field
         * @param {string} value - The selected value to validate
         * @returns {boolean} - Whether the validation passed
         */
        function validateReason(value) {
            return value !== '';
        }
        
        /**
         * Validate contact method select field
         * @param {string} value - The selected value to validate
         * @returns {boolean} - Whether the validation passed
         */
        function validateContactMethod(value) {
            return value !== '';
        }
        
        /**
         * Show error message
         * @param {HTMLElement} errorElement - The error message element
         * @param {string} message - The error message to display
         */
        function showError(errorElement, message) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        
        /**
         * Hide error message
         * @param {HTMLElement} errorElement - The error message element
         */
        function hideError(errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        
        /**
         * Submit the form via AJAX
         * @param {HTMLFormElement} form - The form to submit
         */
        function submitForm(form) {
            const formData = new FormData(form);
            const submitButton = form.querySelector('button[type="submit"]');
            
            // Disable the submit button to prevent multiple submissions
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
            
            // Convert FormData to URL-encoded string
            const urlEncodedData = new URLSearchParams(formData).toString();
            
            // Send AJAX request
            fetch('/submit-demo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: urlEncodedData,
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Show success message
                    showFlashMessage(data.message, 'success');
                    
                    // Reset the form
                    form.reset();
                } else {
                    // Show error message
                    showFlashMessage(data.message || 'An error occurred. Please try again.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showFlashMessage('An error occurred. Please try again.', 'error');
            })
            .finally(() => {
                // Re-enable the submit button
                submitButton.disabled = false;
                submitButton.textContent = 'Request Demo';
            });
        }
        
        /**
         * Display a flash message
         * @param {string} message - The message to display
         * @param {string} type - The type of message (success or error)
         */
        function showFlashMessage(message, type) {
            const flashDiv = document.createElement('div');
            flashDiv.className = `flash-message ${type}`;
            flashDiv.innerHTML = `
                <div class="flash-icon">
                    <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                </div>
                <div class="flash-content">
                    <p>${message}</p>
                </div>
                <button class="flash-close" aria-label="Close">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            // Add the flash message to the container
            flashMessages.appendChild(flashDiv);
            
            // Add event listener to close button
            const closeButton = flashDiv.querySelector('.flash-close');
            closeButton.addEventListener('click', () => {
                flashDiv.remove();
            });
            
            // Auto-remove the message after 5 seconds
            setTimeout(() => {
                if (flashDiv.parentNode) {
                    flashDiv.remove();
                }
            }, 5000);
            
            // Scroll to the flash message
            flashMessages.scrollIntoView({ behavior: 'smooth' });
        }
    }
});