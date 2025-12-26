import { API_ROUTES } from '../api/routes.js';
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)

/**
 * Obtiene los acordes sincronizados de una canción
 * @param {number} idCancion 
 * @returns {Promise<Array>} Lista de acordes sincronizados
 */
export async function getAcordesSincronizados(idCancion) {
    const response = await fetch(`${API_ROUTES.CHORDS_SYNC}?id_cancion=${idCancion}`);
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
    if (!response.ok) {
        throw new Error('Error al obtener acordes sincronizados');
    }
    const data = await response.json();
    return data.acordes || [];
}

/**
 * Agrega un nuevo acorde sincronizado
 * @param {Object} acordeData { id_cancion, id_acorde, tiempo_inicio, tiempo_fin }
 * @returns {Promise<Object>} Resultado de la operación
 */
export async function agregarAcordeSincronizado(acordeData) {
    const response = await fetch(`${API_ROUTES.CHORDS_SYNC}`, {
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(acordeData)
    });
    if (!response.ok) {
        throw new Error('Error al agregar acorde sincronizado');
    }
    return await response.json();
}

/**
 * Actualiza un acorde sincronizado existente
 * @param {Object} acordeData { id_sincronia_acorde, ...campos_a_actualizar }
 * @returns {Promise<Object>} Resultado de la operación
 */
export async function actualizarAcordeSincronizado(acordeData) {
    const response = await fetch(`${API_ROUTES.CHORDS_SYNC}`, {
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(acordeData)
    });
    if (!response.ok) {
        throw new Error('Error al actualizar acorde sincronizado');
    }
    return await response.json();
}

/**
 * Elimina un acorde sincronizado
 * @param {number} idSincronia 
 * @returns {Promise<Object>} Resultado de la operación
 */
export async function eliminarAcordeSincronizado(idSincronia) {
    const response = await fetch(`${API_ROUTES.CHORDS_SYNC}?id=${idSincronia}`, {
<<<<<<< HEAD
=======

>>>>>>> 5e4f432 (subir a render)
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Error al eliminar acorde sincronizado');
    }
    return await response.json();
}
