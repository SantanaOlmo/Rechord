export function LoginForm() {
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

                    <div class="form-group relative">
                        <label for="password" class="form-label">Contraseña</label>
                        <div class="relative">
                            <input type="password" id="password" name="password" required 
                                class="form-input pr-10"
                                placeholder="••••••••">
                            <button type="button" id="toggle-password" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors focus:outline-none">
                                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </button>
                        </div>
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
