import { API_ROUTES } from '../api/routes.js';

export async function getEstrofas(idCancion) {
    const response = await fetch(`${API_ROUTES.VERSES}?id_cancion=${idCancion}`);
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
    if (!response.ok) {
        throw new Error('Error al obtener estrofas');
    }
    const data = await response.json();
    return data.estrofas;
}

export async function crearEstrofa(estrofa) {
    const response = await fetch(`${API_ROUTES.VERSES}`, {
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(estrofa)
    });
    if (!response.ok) {
        throw new Error('Error al crear estrofa');
    }
    return await response.json();
}

export async function updateEstrofas(estrofas) {
    const response = await fetch(`${API_ROUTES.VERSES}`, {
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(estrofas)
    });
    if (!response.ok) {
        throw new Error('Error al actualizar estrofas');
    }
    return await response.json();
}
