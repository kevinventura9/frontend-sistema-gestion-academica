import axios from 'axios'

const handleApiError = (context, error) => {
	console.error(`Error en ${context}:`, error)
	throw error?.response?.data ?? error
}

export const getAlumnos = async () => {
	try {
		const response = await axios.get('/alumnos')
		return response.data
	} catch (error) {
		handleApiError('getAlumnos', error)
	}
}

export const getAlumnoPorId = async (id) => {
	try {
		const response = await axios.get(`/alumnos/${id}`)
		return response.data
	} catch (error) {
		handleApiError('getAlumnoPorId', error)
	}
}

export const crearAlumno = async (payload) => {
	try {
		const response = await axios.post('/alumnos', payload)
		return response.data
	} catch (error) {
		handleApiError('crearAlumno', error)
	}
}

export const actualizarAlumno = async (id, payload) => {
	try {
		const response = await axios.put(`/alumnos/${id}` , payload)
		return response.data
	} catch (error) {
		handleApiError('actualizarAlumno', error)
	}
}

export const eliminarAlumno = async (id) => {
	try {
		const response = await axios.delete(`/alumnos/${id}`)
		return response.data
	} catch (error) {
		handleApiError('eliminarAlumno', error)
	}
}
