// Disable right-click, keyboard shortcuts, and browser inspection
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    alert('Right-click is disabled to protect the content.');
});

// Disable keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
    ) {
        e.preventDefault();
        alert('This action is disabled to protect the content.');
    }
});

// Prevent opening developer tools
(function() {
    // Prevent opening developer tools
    const devtools = /./;
    devtools.toString = function() {
        this.opened = true;
    }
    console.log('%c', devtools);
    devtools.opened = false;

    setInterval(function() {
        if (devtools.opened) {
            alert('Developer tools are disabled to protect the content.');
            window.location.reload();
        }
    }, 1000);
})();

// Prevent taking screenshots
document.addEventListener('keyup', (e) => {
    if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText('');
        alert('Screenshots are disabled to protect the content.');
    }
});


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
        
        // Mobile detection and handling
        this.isMobile = this.detectMobile();
        this.mobileFallbackEnabled = false;
        
        this.init();
    }

    detectMobile() {
        // Enhanced mobile detection
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
        const touchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const smallScreen = window.innerWidth <= 768;
        
        return mobileRegex.test(userAgent) || touchDevice || smallScreen;
    }

    init() {
        this.setupEventListeners();
        this.checkBrowserSupport();
        this.setupMobileOptimizations();
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

    setupMobileOptimizations() {
        if (this.isMobile) {
            console.log('Mobile device detected, applying optimizations');
            
            // Add mobile-specific classes
            document.body.classList.add('mobile-device');
            
            // Log mobile device information
            this.logMobileDeviceInfo();
            
            // Optimize form for mobile
            this.optimizeFormForMobile();
            
            // Setup mobile-specific event handling
            this.setupMobileEventHandling();
            
            // Add mobile-specific error handling
            this.setupMobileErrorHandling();
            
            // Setup mobile debugging
            this.setupMobileDebugging();
        }
    }

    logMobileDeviceInfo() {
        if (!this.isMobile) return;
        
        console.log('=== Mobile Device Information ===');
        console.log('User Agent:', navigator.userAgent);
        console.log('Platform:', navigator.platform);
        console.log('Language:', navigator.language);
        console.log('Cookie Enabled:', navigator.cookieEnabled);
        console.log('Online Status:', navigator.onLine);
        console.log('Connection Type:', navigator.connection ? navigator.connection.effectiveType : 'Unknown');
        console.log('Screen Resolution:', `${screen.width}x${screen.height}`);
        console.log('Viewport Size:', `${window.innerWidth}x${window.innerHeight}`);
        console.log('Touch Support:', 'ontouchstart' in window);
        console.log('Max Touch Points:', navigator.maxTouchPoints);
        console.log('================================');
    }

    setupMobileDebugging() {
        if (!this.isMobile) return;
        
        // Add mobile-specific console methods
        console.mobile = {
            log: (message, data) => {
                console.log(`[MOBILE] ${message}`, data || '');
            },
            error: (message, error) => {
                console.error(`[MOBILE ERROR] ${message}`, error || '');
            },
            warn: (message, data) => {
                console.warn(`[MOBILE WARN] ${message}`, data || '');
            },
            info: (message, data) => {
                console.info(`[MOBILE INFO] ${message}`, data || '');
            }
        };
        
        // Log mobile debugging setup
        console.mobile.log('Mobile debugging enabled');
        
        // Monitor form submission attempts
        this.form.addEventListener('submit', () => {
            console.mobile.log('Form submission initiated');
        });
        
        // Monitor network status changes
        window.addEventListener('online', () => {
            console.mobile.info('Network connection restored');
        });
        
        window.addEventListener('offline', () => {
            console.mobile.warn('Network connection lost');
        });
    }

    optimizeFormForMobile() {
        // Optimize input types for mobile
        const emailInput = this.form.querySelector('input[type="email"]');
        if (emailInput) {
            emailInput.setAttribute('inputmode', 'email');
            emailInput.setAttribute('autocapitalize', 'off');
        }
        
        const nameInput = this.form.querySelector('input[name="name"]');
        if (nameInput) {
            nameInput.setAttribute('inputmode', 'text');
            nameInput.setAttribute('autocapitalize', 'words');
        }
        
        const subjectInput = this.form.querySelector('input[name="subject"]');
        if (subjectInput) {
            subjectInput.setAttribute('inputmode', 'text');
            subjectInput.setAttribute('autocapitalize', 'sentences');
        }
        
        // Optimize textarea for mobile
        const messageTextarea = this.form.querySelector('textarea[name="message"]');
        if (messageTextarea) {
            messageTextarea.setAttribute('inputmode', 'text');
            messageTextarea.setAttribute('autocapitalize', 'sentences');
        }
    }

    setupMobileEventHandling() {
        if (!this.isMobile) return;
        
        // Add touch event support for mobile
        this.setupTouchEvents();
        
        // Add mobile-specific keyboard handling
        this.setupMobileKeyboardHandling();
        
        // Add mobile-specific form validation
        this.setupMobileFormValidation();
    }

    setupTouchEvents() {
        // Touch event handling for mobile devices
        const touchElements = this.form.querySelectorAll('.file-upload-area, .record-btn, .submit-btn');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', (e) => {
                e.preventDefault();
                element.classList.add('touch-active');
            }, { passive: false });
            
            element.addEventListener('touchend', (e) => {
                e.preventDefault();
                element.classList.remove('touch-active');
                element.click();
            }, { passive: false });
            
            element.addEventListener('touchcancel', () => {
                element.classList.remove('touch-active');
            });
        });
    }

    setupMobileKeyboardHandling() {
        // Handle mobile keyboard events
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                // Scroll to input on mobile to ensure visibility
                if (this.isMobile) {
                    setTimeout(() => {
                        input.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center',
                            inline: 'nearest'
                        });
                    }, 300);
                }
            });
            
            input.addEventListener('blur', () => {
                // Validate on blur for mobile
                if (this.isMobile) {
                    this.validateField(input);
                }
            });
        });
    }

    setupMobileFormValidation() {
        if (!this.isMobile) return;
        
        // Mobile-specific validation timing
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Immediate validation on mobile for better UX
            input.addEventListener('input', () => {
                // Debounce validation for mobile
                clearTimeout(input.validationTimeout);
                input.validationTimeout = setTimeout(() => {
                    this.validateField(input);
                }, 300);
            });
        });
    }

    setupMobileErrorHandling() {
        if (!this.isMobile) return;
        
        // Mobile-specific error handling
        window.addEventListener('online', () => {
            this.showMessage('Connection restored. You can now send messages.', 'success');
            this.updateNetworkStatus(true);
        });
        
        window.addEventListener('offline', () => {
            this.showMessage('No internet connection. Please check your network and try again.', 'error');
            this.updateNetworkStatus(false);
        });
        
        // Handle mobile-specific errors
        window.addEventListener('error', (e) => {
            if (this.isMobile) {
                console.error('Mobile error:', e.error);
                this.handleMobileError(e.error);
            }
        });
        
        // Initialize network status
        this.updateNetworkStatus(navigator.onLine);
    }

    updateNetworkStatus(isOnline) {
        if (!this.isMobile) return;
        
        const networkStatus = document.getElementById('networkStatus');
        if (!networkStatus) return;
        
        if (isOnline) {
            networkStatus.className = 'network-status online';
            networkStatus.innerHTML = '<i class="fas fa-wifi"></i><span>Online</span>';
            networkStatus.style.display = 'block';
            
            // Hide after 3 seconds
            setTimeout(() => {
                networkStatus.style.display = 'none';
            }, 3000);
        } else {
            networkStatus.className = 'network-status offline';
            networkStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>Offline</span>';
            networkStatus.style.display = 'block';
        }
    }

    showAutoSaveIndicator() {
        if (!this.isMobile) return;
        
        const indicator = document.getElementById('autoSaveIndicator');
        if (!indicator) return;
        
        indicator.classList.add('show');
        
        // Hide after 2 seconds
        setTimeout(() => {
            indicator.classList.remove('show');
        }, 2000);
    }

    handleMobileError(error) {
        let errorMessage = 'An unexpected error occurred.';
        
        if (error && error.message) {
            if (error.message.includes('network') || error.message.includes('fetch')) {
                errorMessage = 'Network error. Please check your connection and try again.';
            } else if (error.message.includes('timeout')) {
                errorMessage = 'Request timed out. Please try again.';
            } else if (error.message.includes('permission')) {
                errorMessage = 'Permission denied. Please check your browser settings.';
            }
        }
        
        this.showMessage(errorMessage, 'error');
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
            // Mobile-specific form handling
            if (this.isMobile) {
                await this.handleMobileSubmit();
            } else {
                await this.handleDesktopSubmit();
            }
        } catch (error) {
            console.error('Form submission error:', error);
            
            // Mobile-specific error messages
            if (this.isMobile) {
                this.handleMobileSubmissionError(error);
            } else {
                this.showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
            }
        } finally {
            this.setLoadingState(false);
        }
    }

    async handleMobileSubmit() {
        try {
            // Use native FormData to get all form fields
            const formData = new FormData(this.form);

            // Append files collected via custom uploader (since we clear the native input)
            if (Array.isArray(this.files) && this.files.length > 0) {
                this.files.forEach(file => {
                    formData.append('upload', file, file.name);
                });
            }

            // Add audio recording if available
            if (this.audioBlob && this.audioBlob.size > 0) {
                console.log('Adding voice recording, size:', this.audioBlob.size, 'bytes');
                formData.append('voice_recording', this.audioBlob, 'voice_message.wav');
            } else {
                console.log('No voice recording to attach');
            }

            // Mobile-specific form data optimization
            if (this.isMobile) {
                // Ensure proper encoding for mobile
                formData.append('_mobile', 'true');
                formData.append('_timestamp', Date.now().toString());
            }

            // Log all form data for debugging (after appending files/audio)
            console.log('Mobile FormData entries:');
            for (let pair of formData.entries()) {
                if (pair[1] instanceof File || pair[1] instanceof Blob) {
                    const name = pair[1].name || 'unnamed';
                    const size = pair[1].size;
                    const type = pair[1].type || 'unknown';
                    console.log(`${pair[0]}: [${pair[1].constructor.name}] ${name}, ${size} bytes, type: ${type}`);
                } else {
                    console.log(`${pair[0]}: ${pair[1]}`);
                }
            }

            // Mobile-specific fetch options
            const fetchOptions = {
                method: 'POST',
                body: formData,
                // Mobile-specific timeout and retry logic
                signal: this.createMobileAbortSignal()
            };

            // Submit the form with mobile-optimized settings
            const response = await fetch(this.form.action, fetchOptions);

            if (this.isMobile && console.mobile) {
                console.mobile.log('Response status:', response.status);
                const responseText = await response.text();
                console.mobile.log('Response text:', responseText);
            } else {
                console.log('Mobile response status:', response.status);
                const responseText = await response.text();
                console.log('Mobile response text:', responseText);
            }

            if (response.ok) {
                this.showMessage('Message sent successfully! We\'ll get back to you soon.', 'success');
                this.resetForm({ keepRecording: true });
            } else {
                throw new Error(`Server returned status ${response.status}`);
            }

        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timed out. Please check your connection and try again.');
            }
            throw error;
        }
    }

    async handleDesktopSubmit() {
        // Use native FormData to get all form fields
        const formData = new FormData(this.form);

        // Append files collected via custom uploader (since we clear the native input)
        if (Array.isArray(this.files) && this.files.length > 0) {
            this.files.forEach(file => {
                formData.append('upload', file, file.name);
            });
        }

        // Add audio recording if available
        if (this.audioBlob && this.audioBlob.size > 0) {
            console.log('Adding voice recording, size:', this.audioBlob.size, 'bytes');
            formData.append('voice_recording', this.audioBlob, 'voice_message.wav');
        } else {
            console.log('No voice recording to attach');
        }

        // Log all form data for debugging (after appending files/audio)
        console.log('Desktop FormData entries:');
        for (let pair of formData.entries()) {
            if (pair[1] instanceof File || pair[1] instanceof Blob) {
                const name = pair[1].name || 'unnamed';
                const size = pair[1].size;
                const type = pair[1].type || 'unknown';
                console.log(`${pair[0]}: [${pair[1].constructor.name}] ${name}, ${size} bytes, type: ${type}`);
            } else {
                console.log(`${pair[0]}: ${pair[1]}`);
            }
        }

        // Submit the form
        const response = await fetch(this.form.action, {
            method: 'POST',
            body: formData,
            // Don't set Content-Type header - let the browser set it with the correct boundary
        });

        console.log('Desktop response status:', response.status);
        const responseText = await response.text();
        console.log('Desktop response text:', responseText);

        if (response.ok) {
            this.showMessage('Message sent successfully! We\'ll get back to you soon.', 'success');
            this.resetForm({ keepRecording: true });
        } else {
            throw new Error('Failed to send message');
        }
    }

    createMobileAbortSignal() {
        // Create abort controller for mobile timeout handling
        const controller = new AbortController();
        
        // Set timeout for mobile devices (30 seconds)
        const timeoutId = setTimeout(() => {
            controller.abort();
        }, 30000);
        
        // Clean up timeout when signal is aborted
        controller.signal.addEventListener('abort', () => {
            clearTimeout(timeoutId);
        });
        
        return controller.signal;
    }

    handleMobileSubmissionError(error) {
        let errorMessage = 'Sorry, there was an error sending your message. Please try again.';
        let showRetryButton = false;
        
        if (error.message) {
            if (error.message.includes('timeout')) {
                errorMessage = 'Request timed out. Please check your connection and try again.';
                showRetryButton = true;
            } else if (error.message.includes('network')) {
                errorMessage = 'Network error. Please check your connection and try again.';
                showRetryButton = true;
            } else if (error.message.includes('fetch')) {
                errorMessage = 'Connection failed. Please check your internet and try again.';
                showRetryButton = true;
            } else if (error.message.includes('permission')) {
                errorMessage = 'Permission denied. Please check your browser settings.';
            } else if (error.message.includes('status')) {
                errorMessage = 'Server error. Please try again in a few minutes.';
                showRetryButton = true;
            }
        }
        
        this.showMessage(errorMessage, 'error');
        
        // Show retry button for retryable errors
        if (showRetryButton) {
            this.showRetryButton();
        }
        
        // Log detailed error for debugging
        console.error('Mobile submission error details:', {
            error: error.message,
            stack: error.stack,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        });
    }

    showRetryButton() {
        if (!this.isMobile) return;
        
        const retryButton = document.createElement('button');
        retryButton.type = 'button';
        retryButton.className = 'retry-btn';
        retryButton.innerHTML = '<i class="fas fa-redo"></i> Retry';
        retryButton.addEventListener('click', () => {
            this.retrySubmission();
        });
        
        // Add retry button to form messages
        const formMessages = document.getElementById('formMessages');
        if (formMessages) {
            const messageDiv = formMessages.querySelector('.message.error');
            if (messageDiv) {
                messageDiv.appendChild(retryButton);
            }
        }
    }

    async retrySubmission() {
        if (!this.isMobile) return;
        
        // Clear previous error message
        this.formMessages.innerHTML = '';
        
        // Show retry message
        this.showMessage('Retrying submission...', 'info');
        
        try {
            // Wait a moment before retrying
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Attempt submission again
            await this.handleMobileSubmit();
            
        } catch (error) {
            console.error('Retry failed:', error);
            this.handleMobileSubmissionError(error);
        }
    }

    async submitForm(formData) {
        try {
            // Get the form's action URL
            const formAction = this.form.getAttribute('action');
            
            // Add additional form data that FormSubmit expects
            formData.append('_captcha', 'false');  // Disable captcha for testing
            formData.append('_template', 'table');  // Use table template for better formatting
            
            // Log form data for debugging
            console.log('FormData entries:');
            for (let pair of formData.entries()) {
                if (pair[1] instanceof File || pair[1] instanceof Blob) {
                    console.log(`${pair[0]}: [${pair[1].constructor.name}] ${pair[1].name || 'unnamed'}, size: ${pair[1].size} bytes, type: ${pair[1].type || 'unknown'}`);
                } else {
                    console.log(pair[0] + ': ', pair[1]);
                }
            }
            
            const response = await fetch(formAction, {
                method: 'POST',
                body: formData,
                // Don't set Content-Type header - let the browser set it with the correct boundary
            });
            
            // Log response for debugging
            console.log('Response status:', response.status);
            const responseText = await response.text();
            console.log('Response text:', responseText);
            
            let result;
            try {
                result = responseText ? JSON.parse(responseText) : {};
            } catch (e) {
                console.error('Error parsing JSON response:', e);
                // If we can't parse the response but status is 200, consider it a success
                if (response.ok) {
                    return Promise.resolve();
                }
                throw new Error('Invalid response from server');
            }
            
            if (response.ok) {
                return Promise.resolve();
            } else {
                throw new Error(result.message || `Server returned status ${response.status}`);
            }
        } catch (error) {
            console.error('Form submission error:', error);
            throw new Error(error.message || 'Failed to submit form. Please try again later.');
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

    resetForm(options = {}) {
        const { keepRecording = false } = options;
        
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

        // Only clear audio recording if not explicitly told to keep it
        if (!keepRecording) {
            this.deleteRecording();
        }

        // Reset recording state
        if (!keepRecording) {
            this.isRecording = false;
            this.updateRecordingUI();
        }
    }

    // Enhanced mobile form validation with better error messages
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
        
        // Mobile-specific validation feedback
        if (this.isMobile && !isValid) {
            this.showMobileValidationFeedback(field, errorMessage);
        }
        
        return isValid;
    }

    showMobileValidationFeedback(field, message) {
        if (!this.isMobile) return;
        
        // Add mobile-specific validation styling
        field.style.borderColor = '#ff4757';
        field.style.boxShadow = '0 0 0 2px rgba(255, 71, 87, 0.2)';
        
        // Remove styling after 3 seconds
        setTimeout(() => {
            if (field.classList.contains('error')) {
                field.style.borderColor = '';
                field.style.boxShadow = '';
            }
        }, 3000);
        
        // Show mobile-specific error message
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.style.color = '#ff4757';
            errorElement.style.fontWeight = '500';
        }
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
            
            // Show auto-save indicator on mobile
            if (this.isMobile) {
                this.showAutoSaveIndicator();
            }
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
