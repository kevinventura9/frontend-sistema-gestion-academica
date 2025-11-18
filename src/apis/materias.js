import axios from 'axios'

const API_URL = 'http://localhost:8000/api/materias'

/**
 * Obtener todas las materias disponibles
 * @param {Object} params - Parámetros opcionales { seccion_id?, grado? }
 * @returns {Promise<Array>} Array de materias
 */
export const obtenerMaterias = async (params = {}) => {
  try {
    const response = await axios.get(API_URL, {
      params,
      headers: { Accept: 'application/json' }
    })
    return response.data.materias || response.data.results || response.data
  } catch (error) {
    throw error
  }
}

/**
 * Obtener una materia específica
 * @param {number} id - ID de la materia
 * @returns {Promise<Object>} Detalles de la materia
 */
export const obtenerMateria = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: { Accept: 'application/json' }
    })
    return response.data
  } catch (error) {
    throw error
  }
}
