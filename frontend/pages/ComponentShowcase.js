import { SongGrid } from '../components/SongGrid.js';
import { SongCard } from '../components/SongCard.js';
import { NewSongModal } from '../components/NewSongModal.js';
import { LoginForm } from '../components/LoginForm.js';
import { RegisterForm } from '../components/RegisterForm.js';
import { ProfileHeader } from '../components/ProfileHeader.js';
import { ProfileBio } from '../components/ProfileBio.js';
import { EditProfileModal } from '../components/EditProfileModal.js';
import { PlayerHeader } from '../components/PlayerHeader.js';
import { PlayerControls } from '../components/PlayerControls.js';
import { LyricsPanel } from '../components/LyricsPanel.js';
import { ChordsPanel } from '../components/ChordsPanel.js';
import { StrummingPanel } from '../components/StrummingPanel.js';

export function ComponentShowcase() {
    setTimeout(() => {
        setupShowcaseEvents();
    }, 0);

    return `
        <div class="flex h-screen bg-gray-900 text-white overflow-hidden">
            <!-- Sidebar -->
            <div class="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
                <div class="p-4 border-b border-gray-700">
                    <h2 class="text-xl font-bold text-indigo-400">Componentes</h2>
                    <p class="text-xs text-gray-400">ReChord UI Kit</p>
                </div>
                <div class="flex-1 overflow-y-auto p-2 space-y-1" id="component-list">
                    ${renderComponentButton('SongGrid')}
                    ${renderComponentButton('SongCard')}
                    ${renderComponentButton('NewSongModal')}
                    ${renderComponentButton('LoginForm')}
                    ${renderComponentButton('RegisterForm')}
                    ${renderComponentButton('ProfileHeader')}
                    ${renderComponentButton('ProfileBio')}
                    ${renderComponentButton('EditProfileModal')}
                    ${renderComponentButton('PlayerHeader')}
                    ${renderComponentButton('PlayerControls')}
                    ${renderComponentButton('LyricsPanel')}
                    ${renderComponentButton('ChordsPanel')}
                    ${renderComponentButton('StrummingPanel')}
                </div>
                <div class="p-4 border-t border-gray-700">
                    <a href="#/" class="text-sm text-gray-400 hover:text-white flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Volver a la App
                    </a>
                </div>
            </div>

            <!-- Main Stage -->
            <div class="flex-1 bg-[#1e1e1e] flex flex-col relative">
                <div class="absolute inset-0 flex items-center justify-center p-8 overflow-auto" id="stage-container">
                    <div class="text-center text-gray-500">
                        <p class="text-xl">Selecciona un componente para visualizarlo</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderComponentButton(name) {
    return `
        <button class="w-full text-left px-4 py-2 rounded hover:bg-gray-700 transition text-sm text-gray-300 hover:text-white component-btn" data-component="${name}">
            ${name}
        </button>
    `;
}

function setupShowcaseEvents() {
    const buttons = document.querySelectorAll('.component-btn');
    const stage = document.getElementById('stage-container');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            buttons.forEach(b => b.classList.remove('bg-indigo-600', 'text-white'));
            btn.classList.add('bg-indigo-600', 'text-white');
            btn.classList.remove('hover:bg-gray-700', 'text-gray-300');

            const componentName = btn.dataset.component;
            renderComponent(componentName, stage);
        });
    });
}

function renderComponent(name, container) {
    let content = '';
    // Mock data
    const mockUser = { nombre: 'Usuario Demo', email: 'demo@rechord.com', bio: 'Bio de prueba', foto_perfil: '', banner: '' };
    const mockSong = { id_cancion: 1, titulo: 'Wonderwall', artista: 'Oasis', ruta_imagen: '' };

    switch (name) {
        case 'SongGrid':
            content = `<div class="w-full">${SongGrid()}</div>`;
            break;
        case 'SongCard':
            content = `<div class="w-64">${SongCard(mockSong, false)}</div>`;
            break;
        case 'NewSongModal':
            content = `<div class="relative w-full h-96">${NewSongModal()}</div><script>document.getElementById('new-song-modal').classList.remove('hidden'); document.getElementById('new-song-modal').classList.add('flex'); document.getElementById('modal-content').classList.remove('scale-95', 'opacity-0'); document.getElementById('modal-content').classList.add('scale-100', 'opacity-100');</script>`;
            break;
        case 'LoginForm':
            content = `<div class="w-full max-w-md">${LoginForm()}</div>`;
            break;
        case 'RegisterForm':
            content = `<div class="w-full max-w-md">${RegisterForm()}</div>`;
            break;
        case 'ProfileHeader':
            content = `<div class="w-full max-w-4xl bg-gray-900">${ProfileHeader(mockUser, true)}</div>`;
            break;
        case 'ProfileBio':
            content = `<div class="w-full max-w-4xl bg-gray-900">${ProfileBio(mockUser)}</div>`;
            break;
        case 'EditProfileModal':
            content = `<div class="relative w-full h-96">${EditProfileModal(mockUser)}</div>`;
            break;
        case 'PlayerHeader':
            content = `<div class="w-full relative h-20 bg-gray-900">${PlayerHeader()}</div>`;
            break;
        case 'PlayerControls':
            content = `<div class="w-full">${PlayerControls(1, true)}</div>`;
            break;
        case 'LyricsPanel':
            content = `<div class="w-full bg-gray-900">${LyricsPanel()}</div>`;
            break;
        case 'ChordsPanel':
            content = `<div class="w-full bg-gray-900">${ChordsPanel(true)}</div>`;
            break;
        case 'StrummingPanel':
            content = `<div class="w-full bg-gray-900">${StrummingPanel()}</div>`;
            break;
        default:
            content = '<p class="text-red-500">Componente no encontrado</p>';
    }

    container.innerHTML = content;

    // Special handling for modals to make them visible in the showcase
    if (name.includes('Modal')) {
        const modal = container.querySelector('.modal-overlay') || container.querySelector('#edit-profile-modal');
        if (modal) {
            modal.classList.remove('hidden', 'fixed', 'inset-0');
            modal.classList.add('flex', 'relative', 'w-full', 'h-full');
            const content = modal.querySelector('.modal-content') || modal.querySelector('#edit-modal-content');
            if (content) {
                content.classList.remove('scale-95', 'opacity-0');
                content.classList.add('scale-100', 'opacity-100');
            }
        }
    }
}

