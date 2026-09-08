/**
 * Lume - Módulo Funcional del Formulario de Contacto
 * Maneja validaciones en tiempo real, estados de carga (spinners),
 * retroalimentación amigable, envío a la API / almacenamiento y botón WhatsApp.
 * 
 * Emprendimiento: Lume
 * Fundadoras: María González & Ángeles Navas
 */

const LumeContact = {
    form: null,
    submitBtn: null,
    feedbackContainer: null,

    init() {
        this.form = document.getElementById('lume-contact-form');
        if (!this.form) return;

        this.submitBtn = this.form.querySelector('button[type="submit"]');
        this.feedbackContainer = document.getElementById('contact-form-feedback');

        this.bindEvents();
    },

    bindEvents() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit();
        });

        // Limpieza de error en tiempo real al escribir
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    },

    validate() {
        let isValid = true;
        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const phoneInput = document.getElementById('contact-phone');
        const subjectInput = document.getElementById('contact-subject');
        const messageInput = document.getElementById('contact-message');

        // Validar Nombre
        if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
            this.setFieldError(nameInput, 'Por favor ingresa tu nombre completo.');
            isValid = false;
        }

        // Validar Correo Electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
            this.setFieldError(emailInput, 'Ingresa un correo electrónico válido (ej. tu@correo.com).');
            isValid = false;
        }

        // Validar Asunto
        if (!subjectInput.value.trim()) {
            this.setFieldError(subjectInput, 'Por favor indica el motivo de tu consulta.');
            isValid = false;
        }

        // Validar Mensaje
        if (!messageInput.value.trim() || messageInput.value.trim().length < 8) {
            this.setFieldError(messageInput, 'Cuéntanos un poco más en tu mensaje (al menos 8 caracteres).');
            isValid = false;
        }

        return isValid;
    },

    setFieldError(input, message) {
        input.classList.add('is-invalid');
        let errorElem = input.nextElementSibling;
        if (!errorElem || !errorElem.classList.contains('field-error-msg')) {
            errorElem = document.createElement('span');
            errorElem.className = 'field-error-msg';
            input.parentNode.insertBefore(errorElem, input.nextSibling);
        }
        errorElem.textContent = message;
    },

    clearFieldError(input) {
        input.classList.remove('is-invalid');
        const errorElem = input.nextElementSibling;
        if (errorElem && errorElem.classList.contains('field-error-msg')) {
            errorElem.remove();
        }
    },

    async handleSubmit() {
        if (!this.validate()) {
            LumeUI.toast('Por favor completa todos los campos requeridos correctamente.', 'warning');
            return;
        }

        const formData = {
            name: document.getElementById('contact-name').value.trim(),
            email: document.getElementById('contact-email').value.trim(),
            phone: document.getElementById('contact-phone').value.trim(),
            subject: document.getElementById('contact-subject').value.trim(),
            message: document.getElementById('contact-message').value.trim()
        };

        // Estado de carga en el botón
        const originalBtnText = this.submitBtn.innerHTML;
        this.submitBtn.disabled = true;
        this.submitBtn.innerHTML = `
            <span class="btn-spinner"></span>
            <span>Enviando a Lume...</span>
        `;

        try {
            const response = await LumeAPI.sendContact(formData);
            
            // Éxito
            LumeUI.toast(response.message || '¡Mensaje recibido! Nos comunicaremos contigo en breve.', 'success');
            
            if (this.feedbackContainer) {
                this.feedbackContainer.innerHTML = `
                    <div class="lume-alert lume-alert-success">
                        <div class="alert-icon">✓</div>
                        <div class="alert-text">
                            <strong>¡Gracias por escribirnos a Lume!</strong>
                            <p>María González y Ángeles Navas han recibido tu consulta y te responderán pronto a <em>${formData.email}</em>.</p>
                        </div>
                    </div>
                `;
            }

            this.form.reset();
        } catch (error) {
            console.error("Error al enviar formulario:", error);
            LumeUI.toast('Hubo un inconveniente al enviar tu mensaje. Intenta nuevamente.', 'error');
            
            if (this.feedbackContainer) {
                this.feedbackContainer.innerHTML = `
                    <div class="lume-alert lume-alert-error">
                        <div class="alert-icon">✕</div>
                        <div class="alert-text">
                            <strong>No se pudo enviar el mensaje</strong>
                            <p>Por favor verifica tu conexión o escríbenos directamente a WhatsApp.</p>
                        </div>
                    </div>
                `;
            }
        } finally {
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = originalBtnText;
        }
    }
};
