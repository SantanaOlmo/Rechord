import { authService } from '../services/auth.js';

export function Login() {
    setTimeout(() => {
        const form = document.getElementById('login-form');
        if (form) {
            form.addEventListener('submit', handleLogin);
        }
    }, 0);

    return `
        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-header">
                    <h2 class="auth-title">Bienvenido de nuevo</h2>
                    <p class="auth-subtitle">Inicia sesión para continuar creando</p>
                </div>

                <form id="login-form" class="auth-form">
                    <div class="form-group">
                        <label for="email" class="form-label">Correo electrónico</label>
                        <input type="email" id="email" name="email" required 
                            class="form-input"
                            placeholder="tu@email.com">
                    </div>

                    <div class="form-group">
                        <label for="password" class="form-label">Contraseña</label>
                        <input type="password" id="password" name="password" required 
                            class="form-input"
                            placeholder="••••••••">
                    </div>

                    <div id="error-message" class="error-message hidden"></div>

                    <button type="submit" class="btn-primary">
                        Iniciar Sesión
                    </button>
                </form>

                <div class="auth-footer">
                    <p class="auth-footer-text">
                        ¿No tienes una cuenta? 
                        <a href="#/auth/register" onclick="window.navigate('/auth/register'); return false;" class="link-primary">
                            Regístrate aquí
                        </a>
                    </p>
                </div>
            </div>
        </div>
    `;
}

async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('error-message');
    const submitBtn = e.target.querySelector('button[type="submit"]');

    try {
        // UI Loading state
        errorDiv.classList.add('hidden');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Cargando...';

        await authService.login(email, password);

        // Redirect to home
        if (window.navigate) {
            window.navigate('/');
        } else {
            window.location.hash = '#/';
        }
    } catch (error) {
        errorDiv.textContent = error.message || 'Error al iniciar sesión. Verifica tus credenciales.';
        errorDiv.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Iniciar Sesión';
    }
}