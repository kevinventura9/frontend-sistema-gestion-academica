import axios from 'axios'

export const login = async (email, password) => {
  try {
    const response = await axios.post('/login', {
      email,
      password
    })
    return response.data
  } catch (error) {
    // Lanzar el error completo para que el store pueda procesarlo
    throw error
  }
}

export const logout = async () => {
  try {
    const response = await axios.post('/logout')
    return response.data
  } catch (error) {
    // Si la API no está disponible, aún así limpiamos el estado local
    console.warn('Error al hacer logout en la API:', error)
    throw error.response ? error.response.data : error
  }
}
