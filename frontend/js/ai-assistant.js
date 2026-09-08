/**
 * Lume - Asistente Virtual Inteligente ("Lumi")
 * Asistente personalizado con conocimiento profundo sobre Lume,
 * catálogo de pulseras, personalización, materiales y cuidados.
 * 
 * Emprendimiento: Lume
 * Fundadoras: María González & Ángeles Navas
 */

const LumeAiAssistant = {
    isOpen: false,
    history: [],

    init() {
        this.renderWidget();
        this.bindEvents();
    },

    renderWidget() {
        if (document.getElementById('lume-ai-widget')) return;

        const widget = document.createElement('div');
        widget.id = 'lume-ai-widget';
        widget.className = 'lume-ai-widget';
        widget.innerHTML = `
            <!-- Botón lanzador flotante -->
            <button id="lumi-toggle-btn" class="lumi-toggle-btn" aria-label="Abrir asistente Lumi">
                <span class="lumi-avatar-icon">✨</span>
                <span class="lumi-badge">Asistente Lume</span>
            </button>

            <!-- Ventana del chat -->
            <div id="lumi-chat-window" class="lumi-chat-window">
                <div class="lumi-chat-header">
                    <div class="lumi-header-info">
                        <div class="lumi-header-avatar">✨</div>
                        <div>
                            <h4>Lumi • Asesora Lume</h4>
                            <span class="lumi-status-indicator">En línea • Especialista en pulseras</span>
                        </div>
                    </div>
                    <button id="lumi-close-btn" class="lumi-close-btn" aria-label="Cerrar chat">✕</button>
                </div>

                <div id="lumi-chat-body" class="lumi-chat-body">
                    <!-- Mensaje inicial de bienvenida -->
                    <div class="lumi-msg lumi-msg-bot">
                        <div class="lumi-msg-content">
                            ¡Hola! Bienvenida a <strong>Lume</strong> ✨. Soy Lumi, tu asesora virtual.
                            ¿Deseas conocer nuestras pulseras hechas a mano, aprender a personalizarlas o saber sobre envíos?
                        </div>
                    </div>

                    <!-- Sugerencias rápidas -->
                    <div class="lumi-suggestions-container" id="lumi-initial-suggestions">
                        <button class="lumi-chip" onclick="LumeAiAssistant.sendQuick('¿Qué pulseras para parejas tienen?')">❤️ Pulseras de Pareja</button>
                        <button class="lumi-chip" onclick="LumeAiAssistant.sendQuick('¿Cómo puedo personalizar una pulsera?')">🔤 ¿Cómo personalizar?</button>
                        <button class="lumi-chip" onclick="LumeAiAssistant.sendQuick('¿Quiénes crearon Lume?')">👩‍🦰 Sobre María y Ángeles</button>
                        <button class="lumi-chip" onclick="LumeAiAssistant.sendQuick('¿Cómo cuidar mis accesorios?')">✨ Cuidados de las joyas</button>
                    </div>
                </div>

                <div class="lumi-chat-footer">
                    <form id="lumi-form" class="lumi-input-form">
                        <input type="text" id="lumi-input" placeholder="Pregúntale a Lumi sobre pulseras..." autocomplete="off">
                        <button type="submit" id="lumi-send-btn" aria-label="Enviar pregunta">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(widget);
    },

    bindEvents() {
        const toggleBtn = document.getElementById('lumi-toggle-btn');
        const closeBtn = document.getElementById('lumi-close-btn');
        const chatWindow = document.getElementById('lumi-chat-window');
        const form = document.getElementById('lumi-form');
        const input = document.getElementById('lumi-input');

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.toggleChat();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeChat();
            });
        }

        if (form && input) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const text = input.value.trim();
                if (!text) return;
                input.value = '';
                await this.sendMessage(text);
            });
        }
    },

    toggleChat() {
        this.isOpen = !this.isOpen;
        const chatWindow = document.getElementById('lumi-chat-window');
        if (chatWindow) {
            chatWindow.classList.toggle('active', this.isOpen);
            if (this.isOpen) {
                const input = document.getElementById('lumi-input');
                if (input) setTimeout(() => input.focus(), 250);
            }
        }
    },

    closeChat() {
        this.isOpen = false;
        const chatWindow = document.getElementById('lumi-chat-window');
        if (chatWindow) chatWindow.classList.remove('active');
    },

    openChat() {
        this.isOpen = true;
        const chatWindow = document.getElementById('lumi-chat-window');
        if (chatWindow) chatWindow.classList.add('active');
    },

    sendQuick(text) {
        this.sendMessage(text);
    },

    async sendMessage(text) {
        const chatBody = document.getElementById('lumi-chat-body');
        if (!chatBody) return;

        // Ocultar sugerencias iniciales si aún están
        const initialSug = document.getElementById('lumi-initial-suggestions');
        if (initialSug) initialSug.style.display = 'none';

        // 1. Renderizar mensaje del usuario
        const userMsg = document.createElement('div');
        userMsg.className = 'lumi-msg lumi-msg-user';
        userMsg.innerHTML = `<div class="lumi-msg-content">${this.escapeHtml(text)}</div>`;
        chatBody.appendChild(userMsg);
        this.scrollToBottom();

        // 2. Indicador de Lumi escribiendo...
        const typingElem = document.createElement('div');
        typingElem.className = 'lumi-msg lumi-msg-bot lumi-typing';
        typingElem.id = 'lumi-typing-indicator';
        typingElem.innerHTML = `
            <div class="lumi-msg-content">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;
        chatBody.appendChild(typingElem);
        this.scrollToBottom();

        try {
            const data = await LumeAPI.askAi(text);
            
            // Remover indicador de escritura
            typingElem.remove();

            // 3. Renderizar respuesta de Lumi
            const botMsg = document.createElement('div');
            botMsg.className = 'lumi-msg lumi-msg-bot';
            
            let recommendedHtml = '';
            if (data.recommendedProducts && data.recommendedProducts.length > 0) {
                recommendedHtml = `
                    <div class="lumi-product-chips">
                        <small>Piezas sugeridas de Lume:</small>
                        <div class="chips-row">
                            ${data.recommendedProducts.map(p => `
                                <div class="lumi-product-chip" onclick="LumeCatalog.openModal(${p.id})">
                                    <img src="${p.image}" alt="${p.name}">
                                    <span>${p.name} - ${LumeUI.formatCurrency(p.price)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            let suggestionsHtml = '';
            if (data.suggestions && data.suggestions.length > 0) {
                suggestionsHtml = `
                    <div class="lumi-suggestions-container">
                        ${data.suggestions.map(s => `
                            <button class="lumi-chip" onclick="LumeAiAssistant.sendQuick('${s.replace(/'/g, "\\'")}')">${s}</button>
                        `).join('')}
                    </div>
                `;
            }

            botMsg.innerHTML = `
                <div class="lumi-msg-content">
                    ${data.reply}
                    ${recommendedHtml}
                    ${suggestionsHtml}
                </div>
            `;
            chatBody.appendChild(botMsg);
            this.scrollToBottom();

        } catch (error) {
            console.error("Error en asistente Lumi:", error);
            typingElem.remove();
            const errorMsg = document.createElement('div');
            errorMsg.className = 'lumi-msg lumi-msg-bot';
            errorMsg.innerHTML = `
                <div class="lumi-msg-content">
                    Disculpa, tuve un momento de distracción artesanal ✨. ¿Podrías preguntarme de nuevo o escribirnos directamente a WhatsApp?
                </div>
            `;
            chatBody.appendChild(errorMsg);
            this.scrollToBottom();
        }
    },

    scrollToBottom() {
        const chatBody = document.getElementById('lumi-chat-body');
        if (chatBody) {
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    },

    escapeHtml(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }
};
