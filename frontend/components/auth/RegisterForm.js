export function RegisterForm() {
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
