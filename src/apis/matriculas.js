import axios from 'axios'

const API_URL = '/matriculas'
const ALUMNOS_URL = '/alumnos'

export const obtenerMatriculas = async (params = {}) => {
  const response = await axios.get(API_URL, {
    params,
    headers: { Accept: 'application/json' }
  })
  // Backend devuelve { message, results: [...] }
  return response.data.results || response.data.matriculas || response.data
}

export const crearMatricula = async (payload) => {
  const response = await axios.post(API_URL, payload, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  return response.data
}

/**
 * Búsqueda de alumnos con typeahead (para autocomplete)
 * @param {string} q - Texto a buscar (requerido)
 * @param {number} limit - Límite de resultados (opcional, default 10)
 * @returns {Promise<Array>} Array de alumnos { id, nombre, apellido, nombre_completo }
 */
export const buscarAlumnos = async (q, limit = 10) => {
  if (!q || q.trim().length === 0) {
    console.log('⚠️ buscarAlumnos: query vacío, retornando array vacío')
    return []
  }

  console.log(`📡 Llamando a GET ${ALUMNOS_URL} con search="${q}", limit=${limit}`)

  const response = await axios.get(ALUMNOS_URL, {
    params: { search: q, limit, simple: true },
    headers: { Accept: 'application/json' }
  })

  console.log('📦 Respuesta del backend:', response.data)

  // Backend devuelve { message, data: [...] }
  return response.data.data || []
}

/**
 * Obtener lista completa de alumnos para dropdown simple
 * @returns {Promise<Array>} Array de alumnos { id, nombre_completo }
 */
export const obtenerAlumnos = async (limit = 50) => {
  const response = await axios.get(ALUMNOS_URL, {
    params: { simple: true, limit },
    headers: { Accept: 'application/json' }
  })
  return response.data.data || []
}

/**
 * Actualizar una matrícula existente
 * @param {number} id - ID de la matrícula
 * @param {Object} payload - Datos a actualizar { seccion_id?, anio_lectivo? }
 * @returns {Promise<Object>} Respuesta del backend
 */
export const actualizarMatricula = async (id, payload) => {
  const response = await axios.put(`${API_URL}/${id}`, payload, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  return response.data
}

/**
 * Eliminar una matrícula
 * @param {number} id - ID de la matrícula a eliminar
 * @returns {Promise<Object>} Respuesta del backend
 */
export const eliminarMatricula = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Accept: 'application/json' }
  })
  return response.data
}
