// // Disable right-click, keyboard shortcuts, and browser inspection
// document.addEventListener('contextmenu', (e) => {
//     e.preventDefault();
//     alert('Right-click is disabled to protect the content.');
// });

// // Disable keyboard shortcuts
// document.addEventListener('keydown', (e) => {
//     // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
//     if (
//         e.key === 'F12' ||
//         (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) ||
//         (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
//     ) {
//         e.preventDefault();
//         alert('This action is disabled to protect the content.');
//     }
// });

// // Prevent opening developer tools
// (function() {
//     // Prevent opening developer tools
//     const devtools = /./;
//     devtools.toString = function() {
//         this.opened = true;
//     }
//     console.log('%c', devtools);
//     devtools.opened = false;

//     setInterval(function() {
//         if (devtools.opened) {
//             alert('Developer tools are disabled to protect the content.');
//             window.location.reload();
//         }
//     }, 1000);
// })();

// // Prevent taking screenshots
// document.addEventListener('keyup', (e) => {
//     if (e.key === 'PrintScreen') {
//         navigator.clipboard.writeText('');
//         alert('Screenshots are disabled to protect the content.');
//     }
// });


// Contact Form Application
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.fileInput = document.getElementById('fileInput');
        this.fileUploadArea = document.getElementById('fileUploadArea');
        this.fileList = document.getElementById('fileList');
        this.recordBtn = document.getElementById('recordBtn');
        this.submitBtn = document.getElementById('submitBtn');
        this.formMessages = document.getElementById('formMessages');
        
        // State management
        this.files = [];
        this.audioBlob = null;
        this.mediaRecorder = null;
        this.isRecording = false;
        this.recordingChunks = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkBrowserSupport();
    }

    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        this.setupFormValidation();
        
        // File upload functionality
        this.setupFileUpload();
        
        // Voice recording functionality
        this.setupVoiceRecording();
        
        // Keyboard accessibility
        this.setupKeyboardNavigation();
    }

    checkBrowserSupport() {
        // Check for MediaRecorder API support
        if (!navigator.mediaDevices || !window.MediaRecorder) {
            this.showMessage('Voice recording is not supported in your browser.', 'error');
            this.recordBtn.disabled = true;
        }

        // Check for File API support
        if (!window.File || !window.FileReader) {
            this.showMessage('File upload is not supported in your browser.', 'error');
            this.fileInput.disabled = true;
        }
    }

    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Real-time validation on input
            input.addEventListener('input', () => this.validateField(input));
            input.addEventListener('blur', () => this.validateField(input));
            
            // Clear errors on focus
            input.addEventListener('focus', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Clear previous states
        field.classList.remove('error', 'success');

        switch (fieldName) {
            case 'name':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Name is required';
                } else if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long';
                } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Name can only contain letters and spaces';
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    isValid = false;
                    errorMessage = 'Email is required';
                } else if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;

            case 'message':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Message is required';
                } else if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters long';
                } else if (value.length > 1000) {
                    isValid = false;
                    errorMessage = 'Message must not exceed 1000 characters';
                }
                break;
        }

        // Update field appearance and error message
        if (isValid && value) {
            field.classList.add('success');
        } else if (!isValid) {
            field.classList.add('error');
        }

        this.showFieldError(field, errorMessage);
        return isValid;
    }

    showFieldError(field, message) {
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            if (message) {
                errorElement.classList.add('show');
            } else {
                errorElement.classList.remove('show');
            }
        }
    }

    clearFieldError(field) {
        this.showFieldError(field, '');
    }

    setupFileUpload() {
        // Click to browse files
        this.fileUploadArea.addEventListener('click', () => {
            this.fileInput.click();
        });

        // File input change
        this.fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });

        // Drag and drop functionality
        this.fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.fileUploadArea.classList.add('dragover');
        });

        this.fileUploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            this.fileUploadArea.classList.remove('dragover');
        });

        this.fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.fileUploadArea.classList.remove('dragover');
            this.handleFiles(e.dataTransfer.files);
        });
    }

    handleFiles(fileList) {
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/jpg',
            'image/png',
            'text/plain'
        ];
        const maxSize = 1024 * 1024 * 1024; // 1GB

        Array.from(fileList).forEach(file => {
            // Validate file type
            if (!allowedTypes.includes(file.type)) {
                this.showMessage(`File "${file.name}" has an unsupported format.`, 'error');
                return;
            }

            // Validate file size
            if (file.size > maxSize) {
                this.showMessage(`File "${file.name}" is too large. Maximum size is 1GB.`, 'error');
                return;
            }

            // Check for duplicates
            if (this.files.some(f => f.name === file.name && f.size === file.size)) {
                this.showMessage(`File "${file.name}" has already been added.`, 'error');
                return;
            }

            this.files.push(file);
            this.displayFile(file);
        });

        // Clear input
        this.fileInput.value = '';
    }

    displayFile(file) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-info">
                <i class="fas fa-file"></i>
                <div>
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${this.formatFileSize(file.size)}</div>
                </div>
            </div>
            <button type="button" class="file-remove" aria-label="Remove ${file.name}">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Remove file functionality
        fileItem.querySelector('.file-remove').addEventListener('click', () => {
            this.removeFile(file, fileItem);
        });

        this.fileList.appendChild(fileItem);
    }

    removeFile(file, fileItem) {
        this.files = this.files.filter(f => f !== file);
        fileItem.remove();
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    setupVoiceRecording() {
        this.recordBtn.addEventListener('click', () => {
            if (this.isRecording) {
                this.stopRecording();
            } else {
                this.startRecording();
            }
        });

        // Delete recording functionality
        const deleteBtn = document.getElementById('deleteRecording');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                this.deleteRecording();
            });
        }
    }

    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.recordingChunks = [];

            this.mediaRecorder.addEventListener('dataavailable', (e) => {
                if (e.data.size > 0) {
                    this.recordingChunks.push(e.data);
                }
            });

            this.mediaRecorder.addEventListener('stop', () => {
                this.audioBlob = new Blob(this.recordingChunks, { type: 'audio/wav' });
                
                // Check audio size limit (200MB)
                const maxAudioSize = 200 * 1024 * 1024; // 200MB
                if (this.audioBlob.size > maxAudioSize) {
                    this.showMessage('Voice recording is too large. Maximum size is 200MB. Please record a shorter message.', 'error');
                    this.audioBlob = null;
                    stream.getTracks().forEach(track => track.stop());
                    return;
                }
                
                this.displayAudioPlayback();
                stream.getTracks().forEach(track => track.stop());
            });

            this.mediaRecorder.start();
            this.isRecording = true;
            this.updateRecordingUI();

        } catch (error) {
            console.error('Error starting recording:', error);
            this.showMessage('Could not access microphone. Please check permissions.', 'error');
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            this.updateRecordingUI();
        }
    }

    updateRecordingUI() {
        const recordBtn = this.recordBtn;
        const statusElement = document.getElementById('recordingStatus');

        if (this.isRecording) {
            recordBtn.classList.add('recording');
            recordBtn.innerHTML = '<i class="fas fa-stop"></i><span>Stop Recording</span>';
            statusElement.textContent = 'Recording... Click to stop';
        } else {
            recordBtn.classList.remove('recording');
            recordBtn.innerHTML = '<i class="fas fa-microphone"></i><span>Click to Record</span>';
            statusElement.textContent = '';
        }
    }

    displayAudioPlayback() {
        const audioPlayback = document.getElementById('audioPlayback');
        const audio = audioPlayback.querySelector('audio');
        
        const audioUrl = URL.createObjectURL(this.audioBlob);
        audio.src = audioUrl;
        audioPlayback.style.display = 'flex';
    }

    deleteRecording() {
        this.audioBlob = null;
        const audioPlayback = document.getElementById('audioPlayback');
        const audio = audioPlayback.querySelector('audio');
        
        if (audio.src) {
            URL.revokeObjectURL(audio.src);
        }
        
        audio.src = '';
        audioPlayback.style.display = 'none';
        
        this.showMessage('Voice recording deleted.', 'success');
    }

    setupKeyboardNavigation() {
        // Enhanced keyboard navigation for custom elements
        const customElements = this.form.querySelectorAll('.file-upload-area, .record-btn');
        
        customElements.forEach(element => {
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });
    }

    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Validate form
        if (!this.validateForm()) {
            this.showMessage('Please correct the errors above and try again.', 'error');
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            // Prepare form data
            const formData = new FormData();
            
            // Add form fields
            const formInputs = this.form.querySelectorAll('input, textarea');
            formInputs.forEach(input => {
                if (input.type !== 'file' && input.value.trim()) {
                    formData.append(input.name, input.value.trim());
                }
            });

            // Add files
            this.files.forEach((file, index) => {
                formData.append(`file_${index}`, file);
            });

            // Add audio recording
            if (this.audioBlob) {
                formData.append('voice_recording', this.audioBlob, 'voice_message.wav');
            }

            // Simulate form submission (replace with actual endpoint)
            await this.submitForm(formData);

            // Success handling
            this.showMessage('Message sent successfully! We\'ll get back to you soon.', 'success');
            this.resetForm();

        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            this.setLoadingState(false);
        }
    }

    async submitForm(formData) {
        // Get the form's action URL
        const formAction = this.form.getAttribute('action');
        
        try {
            const response = await fetch(formAction, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const result = await response.json();
            
            if (result.success) {
                return Promise.resolve();
            } else {
                throw new Error(result.message || 'Form submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            throw new Error('Failed to submit form. Please try again later.');
        }
    }

    setLoadingState(isLoading) {
        const btnText = this.submitBtn.querySelector('.btn-text');
        const spinner = this.submitBtn.querySelector('.loading-spinner');

        this.submitBtn.disabled = isLoading;

        if (isLoading) {
            btnText.textContent = 'Sending...';
            spinner.style.display = 'inline-block';
        } else {
            btnText.textContent = 'Send Message';
            spinner.style.display = 'none';
        }
    }

    showMessage(message, type) {
        // Clear existing messages
        this.formMessages.innerHTML = '';

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle';
        messageDiv.innerHTML = `
            <i class="${icon}"></i>
            <span>${message}</span>
        `;

        this.formMessages.appendChild(messageDiv);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);

        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    resetForm() {
        // Reset form fields
        this.form.reset();
        
        // Clear validation states
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.classList.remove('error', 'success');
            this.clearFieldError(input);
        });

        // Clear files
        this.files = [];
        this.fileList.innerHTML = '';

        // Clear audio recording
        this.deleteRecording();

        // Reset recording state
        this.isRecording = false;
        this.updateRecordingUI();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
});

// Service Worker Registration (for enhanced performance)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Enhanced error handling for unhandled promises
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
});

// Performance monitoring
window.addEventListener('load', () => {
    // Log performance metrics
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
    }
});

// Accessibility enhancements
document.addEventListener('keydown', (e) => {
    // Skip to main content with Alt+M
    if (e.altKey && e.key === 'm') {
        e.preventDefault();
        document.querySelector('main').focus();
    }
});

// Auto-save form data to localStorage (optional enhancement)
class FormAutoSave {
    constructor(formId, prefix = 'contactForm') {
        this.form = document.getElementById(formId);
        this.prefix = prefix;
        this.init();
    }

    init() {
        if (!this.form) return;

        // Load saved data on page load
        this.loadFormData();

        // Save form data on input
        this.form.addEventListener('input', (e) => {
            if (e.target.matches('input, textarea')) {
                this.saveField(e.target);
            }
        });

        // Clear saved data on successful submission
        this.form.addEventListener('submit', () => {
            setTimeout(() => this.clearSavedData(), 100);
        });
    }

    saveField(field) {
        if (field.type !== 'file' && field.value) {
            localStorage.setItem(`${this.prefix}_${field.name}`, field.value);
        }
    }

    loadFormData() {
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            if (input.type !== 'file') {
                const savedValue = localStorage.getItem(`${this.prefix}_${input.name}`);
                if (savedValue) {
                    input.value = savedValue;
                }
            }
        });
    }

    clearSavedData() {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(this.prefix)) {
                localStorage.removeItem(key);
            }
        });
    }
}

// Initialize auto-save functionality
document.addEventListener('DOMContentLoaded', () => {
    new FormAutoSave('contactForm');
});
