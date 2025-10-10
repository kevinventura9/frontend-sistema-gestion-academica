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

export const getUsuarioPorId = async (id) => {
  try {
    const response = await axios.get(`/usuarios/${id}`)
    return response.data
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error)
    throw error.response ? error.response.data : error
  }
}

export const registrarUsuario = async (datosUsuario) => {
  try {
    const response = await axios.post('/registrar', datosUsuario)
    return response.data
  } catch (error) {
    console.error('Error al registrar usuario:', error)
    throw error.response ? error.response.data : error
  }
}

export const actualizarUsuario = async (id, datosUsuario) => {
  try {
    const response = await axios.put(`/usuarios/${id}`, datosUsuario)
    return response.data
  } catch (error) {
    console.error('Error al actualizar usuario:', error)
    throw error.response ? error.response.data : error
  }
}

export const eliminarUsuario = async (id) => {
  try {
    const response = await axios.delete(`/usuarios/${id}`)
    return response.data
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    throw error.response ? error.response.data : error
  }
}

// APIs para Mi Perfil
export const getMiPerfil = async () => {
  try {
    const response = await axios.get('/perfil')
    return response.data
  } catch (error) {
    console.error('Error al obtener mi perfil:', error)
    throw error.response ? error.response.data : error
  }
}

export const actualizarMiPerfil = async (datosUsuario) => {
  try {
    const response = await axios.put('/perfil', datosUsuario)
    return response.data
  } catch (error) {
    console.error('Error al actualizar mi perfil:', error)
    throw error.response ? error.response.data : error
  }
}
