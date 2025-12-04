import { authService } from '../services/authService.js';
import { RegisterForm } from '../components/RegisterForm.js';

export function Register() {
    setTimeout(() => {
        const form = document.getElementById('register-form');
        if (form) {
            form.addEventListener('submit', handleRegister);
        }
    }, 0);

    return RegisterForm();
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