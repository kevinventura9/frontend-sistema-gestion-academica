import axios from 'axios'

const API_URL = 'http://localhost:8000/api/secciones'

export const crearSeccion = async (seccion) => {
  try {
    const response = await axios.post(API_URL, seccion)
    return response.data
  } catch (error) {
    throw error
  }
}

export const editarSeccion = async (id, seccion) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, seccion)
    return response.data
  } catch (error) {
    throw error
  }
}

export const obtenerSecciones = async () => {
  try {
    const response = await axios.get(API_URL)
    return response.data
  } catch (error) {
    throw error
  }
}

export const eliminarSeccion = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}
