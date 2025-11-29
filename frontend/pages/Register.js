import { authService } from '../services/auth.js';

export function Register() {
    setTimeout(() => {
        const form = document.getElementById('register-form');
        if (form) {
            form.addEventListener('submit', handleRegister);
        }
    }, 0);

    return `
        <div class="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-900 px-4">
            <div class="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-extrabold text-white">Crea tu cuenta</h2>
                    <p class="mt-2 text-sm text-gray-400">Únete a ReChord y empieza a sincronizar</p>
                </div>

                <form id="register-form" class="space-y-6">
                    <div>
                        <label for="username" class="block text-sm font-medium text-gray-300">Nombre de usuario</label>
                        <input type="text" id="username" name="username" required 
                            class="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            placeholder="Tu nombre">
                    </div>

                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-300">Correo electrónico</label>
                        <input type="email" id="email" name="email" required 
                            class="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            placeholder="tu@email.com">
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-300">Contraseña</label>
                        <input type="password" id="password" name="password" required 
                            class="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            placeholder="••••••••">
                    </div>

                    <div id="error-message" class="text-red-500 text-sm text-center hidden"></div>

                    <button type="submit" 
                        class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition transform hover:scale-[1.02]">
                        Registrarse
                    </button>
                </form>

                <div class="mt-6 text-center">
                    <p class="text-sm text-gray-400">
                        ¿Ya tienes una cuenta? 
                        <a href="#/auth/login" onclick="window.navigate('/auth/login'); return false;" class="font-medium text-indigo-400 hover:text-indigo-300 transition">
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