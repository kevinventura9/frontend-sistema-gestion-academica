import axios from 'axios';

export const getUsuarios = async () => {
  try {
    const response = await axios.get('/usuarios')
    return response.data
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    throw error.response ? error.response.data : error
  }
}
