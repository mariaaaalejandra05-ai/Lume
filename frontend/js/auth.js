/**
 * Lume - Módulo de Autenticación y Control de Sesión
 * Protege vistas administrativas, valida credenciales y gestiona tokens de acceso.
 * 
 * Emprendimiento: Lume
 * Fundadoras: María González & Ángeles Navas
 */

const LumeAuth = {
    init() {
        const path = window.location.pathname.toLowerCase();

        // Si estamos en la página de administración, verificar autenticación
        if (path.includes('admin.html')) {
            this.requireAuth();
        }

        // Si estamos en la página de login, vincular eventos
        if (path.includes('login.html')) {
            this.initLoginPage();
        }

        // Vincular botón de cerrar sesión en cualquier vista que lo tenga
        const logoutBtns = document.querySelectorAll('.btn-lume-logout');
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        });
    },

    requireAuth() {
        const user = LumeAPI.getCurrentUser();
        if (!user) {
            window.location.replace('login.html?msg=unauthorized');
            return false;
        }

        // Mostrar nombre del usuario en el panel
        const userNameDisplays = document.querySelectorAll('.admin-user-name');
        userNameDisplays.forEach(el => {
            el.textContent = user.name || 'Administrador Lume';
        });

        return true;
    },

    initLoginPage() {
        // Si ya está autenticado, redirigir directo al admin
        const currentUser = LumeAPI.getCurrentUser();
        if (currentUser) {
            window.location.replace('admin.html');
            return;
        }

        const loginForm = document.getElementById('lume-login-form');
        if (!loginForm) return;

        const errorMsg = document.getElementById('login-error-alert');
        const submitBtn = loginForm.querySelector('button[type="submit"]');

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (errorMsg) errorMsg.style.display = 'none';

            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            const remember = document.getElementById('login-remember')?.checked || false;

            if (!email || !password) {
                this.showLoginError('Por favor ingresa tu correo y contraseña.');
                return;
            }

            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="btn-spinner"></span> <span>Iniciando sesión...</span>`;

            try {
                const session = await LumeAPI.login(email, password, remember);
                LumeUI.toast(`¡Bienvenida ${session.user.name}!`, 'success');
                setTimeout(() => {
                    window.location.replace('admin.html');
                }, 600);
            } catch (err) {
                console.error("Fallo de login:", err);
                this.showLoginError(err.message || 'Credenciales incorrectas. Verifique correo o contraseña.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    },

    showLoginError(msg) {
        const errorMsg = document.getElementById('login-error-alert');
        if (errorMsg) {
            errorMsg.textContent = msg;
            errorMsg.style.display = 'block';
        } else {
            LumeUI.toast(msg, 'error');
        }
    },

    logout() {
        LumeAPI.logout();
        LumeUI.toast('Sesión cerrada correctamente.', 'info');
        setTimeout(() => {
            window.location.replace('login.html');
        }, 400);
    }
};

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', () => {
    LumeAuth.init();
});
