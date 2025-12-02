import { authService } from '../services/auth.js';

export function Register() {
    setTimeout(() => {
        const form = document.getElementById('register-form');
        if (form) {
            form.addEventListener('submit', handleRegister);
        }
    }, 0);

    return `
        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-header">
                    <h2 class="auth-title">Crea tu cuenta</h2>
                    <p class="auth-subtitle">Únete a ReChord y empieza a sincronizar</p>
                </div>

                <form id="register-form" class="auth-form">
                    <div class="form-group">
                        <label for="username" class="form-label">Nombre de usuario</label>
                        <input type="text" id="username" name="username" required 
                            class="form-input"
                            placeholder="Tu nombre">
                    </div>

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
                        Registrarse
                    </button>
                </form>

                <div class="auth-footer">
                    <p class="auth-footer-text">
                        ¿Ya tienes una cuenta? 
                        <a href="#/auth/login" onclick="window.navigate('/auth/login'); return false;" class="link-primary">
                            Inicia sesión aquí
                        </a>
                    </p>
                </div>
            </div>
        </div>
    `;
}

async function handleRegister(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('error-message');
    const submitBtn = e.target.querySelector('button[type="submit"]');

    try {
        // UI Loading state
        errorDiv.classList.add('hidden');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Creando cuenta...';

        await authService.register(username, email, password);

        // Redirect to login on success (or auto-login if API supports it)
        alert('Cuenta creada exitosamente. Por favor inicia sesión.');
        if (window.navigate) {
            window.navigate('/auth/login');
        } else {
            window.location.hash = '#/auth/login';
        }
    } catch (error) {
        errorDiv.textContent = error.message || 'Error al registrarse. Inténtalo de nuevo.';
        errorDiv.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Registrarse';
    }
}