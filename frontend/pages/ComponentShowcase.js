switch (name) {
    case 'SongGrid':
        content = `<div class="w-full">${SongGrid()}</div>`;
        break;
    case 'SongCard':
        content = `<div class="w-64">${SongCard(mockSong, false)}</div>`;
        break;
    case 'NewSongModal':
        content = `<div class="relative w-full h-96">${NewSongModal()}</div><script>document.getElementById('new-song-modal').classList.remove('hidden'); document.getElementById('new-song-modal').classList.add('flex'); document.getElementById('modal-content').classList.remove('scale-95', 'opacity-0'); document.getElementById('modal-content').classList.add('scale-100', 'opacity-100');</script>`;
        // Note: Modal might need adjustments to show inline
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
