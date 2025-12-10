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
