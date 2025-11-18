import axios from 'axios'

const BASE_URL = 'http://localhost:8000/api'
const CALIFICACIONES_URL = `${BASE_URL}/calificaciones`
const MATRICULAS_URL = `${BASE_URL}/matriculas`
const TIPOS_ACTIVIDAD_URL = `${BASE_URL}/tipos-actividad`
const CONFIG_URL = `${BASE_URL}/configuracion-calificaciones`
const ACTIVIDADES_URL = `${BASE_URL}/actividades`
const CALIFICACIONES_ACTIVIDADES_URL = `${BASE_URL}/calificaciones-actividades`

// ==================== BÚSQUEDA DE ALUMNOS ====================

/**
 * Buscar alumnos matriculados en una sección específica (para autocomplete)
 * @param {number} seccionId - ID de la sección
 * @param {string} q - Texto de búsqueda (opcional)
 * @param {number} limit - Límite de resultados (default: 10, max: 100)
 * @returns {Promise<Array>} Array de alumnos matriculados
 */
export const buscarAlumnosMatriculados = async (seccionId, q = '', limit = 10) => {
  const params = { seccion_id: seccionId }
  if (q && q.trim().length > 0) {
    params.q = q.trim()
  }
  if (limit) {
    params.limit = Math.min(limit, 100)
  }
  
  const response = await axios.get(`${MATRICULAS_URL}/buscar-alumnos`, {
    params,
    headers: { Accept: 'application/json' }
  })
  
  return response.data.results || response.data.alumnos || response.data
}

// ==================== TIPOS DE ACTIVIDAD (CATÁLOGO) ====================

/**
 * Obtener todos los tipos de actividad disponibles
 * @returns {Promise<Array>} Array de tipos de actividad
 */
export const obtenerTiposActividad = async () => {
  const response = await axios.get(TIPOS_ACTIVIDAD_URL, {
    headers: { Accept: 'application/json' }
  })
  return response.data
}

// ==================== CONFIGURACIÓN DE PORCENTAJES ====================

/**
 * Obtener o crear configuración de porcentajes (con valores por defecto)
 * @param {number} materiaId - ID de la materia
 * @param {number} seccionId - ID de la sección
 * @param {number} trimestre - Trimestre (1, 2, o 3)
 * @returns {Promise<Object>} Configuración con { config, es_nueva }
 */
export const obtenerConfiguracion = async (materiaId, seccionId, trimestre) => {
  const response = await axios.get(CONFIG_URL, {
    params: { 
      materia_id: materiaId, 
      seccion_id: seccionId,
      trimestre: trimestre
    },
    headers: { Accept: 'application/json' }
  })
  return response.data
}

/**
 * Guardar/Actualizar configuración de porcentajes
 * @param {Object} payload - { materia_id, seccion_id, trimestre, porcentaje_actividad_integradora, porcentaje_examenes, porcentaje_tareas }
 * @returns {Promise<Object>} Respuesta del backend
 */
export const guardarConfiguracion = async (payload) => {
  const response = await axios.post(CONFIG_URL, payload, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  return response.data
}

// ==================== ACTIVIDADES ====================

/**
 * Listar actividades con filtros opcionales
 * @param {Object} params - { materia_id?, seccion_id?, tipo_actividad_id?, trimestre? }
 * @returns {Promise<Array>} Array de actividades
 */
export const obtenerActividades = async (params = {}) => {
  const response = await axios.get(ACTIVIDADES_URL, {
    params,
    headers: { Accept: 'application/json' }
  })
  return response.data
}

/**
 * Obtener detalles de una actividad específica
 * @param {number} id - ID de la actividad
 * @returns {Promise<Object>} Detalles de la actividad
 */
export const obtenerActividad = async (id) => {
  const response = await axios.get(`${ACTIVIDADES_URL}/${id}`, {
    headers: { Accept: 'application/json' }
  })
  return response.data
}

/**
 * Crear una nueva actividad
 * @param {Object} payload - { materia_id, seccion_id, tipo_actividad_id, nombre, descripcion?, fecha_asignacion?, fecha_entrega?, valor_maximo }
 * @returns {Promise<Object>} Respuesta del backend
 */
export const crearActividad = async (payload) => {
  const response = await axios.post(ACTIVIDADES_URL, payload, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  return response.data
}

/**
 * Actualizar una actividad existente
 * @param {number} id - ID de la actividad
 * @param {Object} payload - Datos a actualizar
 * @returns {Promise<Object>} Respuesta del backend
 */
export const actualizarActividad = async (id, payload) => {
  const response = await axios.put(`${ACTIVIDADES_URL}/${id}`, payload, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  return response.data
}

/**
 * Eliminar una actividad
 * @param {number} id - ID de la actividad
 * @returns {Promise<Object>} Respuesta del backend
 */
export const eliminarActividad = async (id) => {
  const response = await axios.delete(`${ACTIVIDADES_URL}/${id}`, {
    headers: { Accept: 'application/json' }
  })
  return response.data
}

// ==================== CALIFICACIONES POR ACTIVIDAD ====================

/**
 * Asignar/Actualizar calificación de una actividad
 * @param {Object} payload - { actividad_id, alumno_id, nota_obtenida, fecha_calificacion?, observaciones? }
 * @returns {Promise<Object>} Respuesta del backend
 */
export const asignarCalificacionActividad = async (payload) => {
  const response = await axios.post(CALIFICACIONES_ACTIVIDADES_URL, payload, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  return response.data
}

/**
 * Listar calificaciones de actividades con filtros
 * @param {Object} params - { alumno_id?, actividad_id? }
 * @returns {Promise<Array>} Array de calificaciones
 */
export const obtenerCalificacionesActividades = async (params = {}) => {
  const response = await axios.get(CALIFICACIONES_ACTIVIDADES_URL, {
    params,
    headers: { Accept: 'application/json' }
  })
  return response.data
}

/**
 * Ver todas las calificaciones de un alumno (agrupadas por materia)
 * @param {number} alumnoId - ID del alumno
 * @returns {Promise<Object>} Calificaciones agrupadas por materia
 */
export const obtenerCalificacionesAlumno = async (alumnoId) => {
  const response = await axios.get(`${CALIFICACIONES_ACTIVIDADES_URL}/alumno/${alumnoId}`, {
    headers: { Accept: 'application/json' }
  })
  return response.data
}

/**
 * Actualizar calificación de una actividad
 * @param {number} id - ID de la calificación
 * @param {Object} payload - { nota_obtenida?, observaciones? }
 * @returns {Promise<Object>} Respuesta del backend
 */
export const actualizarCalificacionActividad = async (id, payload) => {
  const response = await axios.put(`${CALIFICACIONES_ACTIVIDADES_URL}/${id}`, payload, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  return response.data
}

/**
 * Eliminar calificación de una actividad
 * @param {number} id - ID de la calificación
 * @returns {Promise<Object>} Respuesta del backend
 */
export const eliminarCalificacionActividad = async (id) => {
  const response = await axios.delete(`${CALIFICACIONES_ACTIVIDADES_URL}/${id}`, {
    headers: { Accept: 'application/json' }
  })
  return response.data
}

// ==================== CALIFICACIONES FINALES ====================

/**
 * Calcular nota final de un alumno en una materia
 * @param {Object} payload - { alumno_id, materia_id, seccion_id, fecha_inicio?, fecha_fin? }
 * @returns {Promise<Object>} Calificación final con desglose
 */
export const calcularNotaFinal = async (payload) => {
  const response = await axios.post(`${CALIFICACIONES_URL}/calcular-final`, payload, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  return response.data
}

/**
 * Calcular notas finales de TODA LA SECCIÓN para un trimestre específico
 * @param {Object} payload - { materia_id, seccion_id, trimestre, fecha_inicio?, fecha_fin? }
 * @returns {Promise<Object>} { mensaje, total_alumnos, calculados_exitosamente, con_errores, resultados, errores }
 */
export const calcularNotaFinalSeccion = async (payload) => {
  const response = await axios.post(`${CALIFICACIONES_URL}/calcular-final-seccion`, payload, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  return response.data
}

/**
 * Calcular nota anual de TODA LA SECCIÓN (promedio de trimestres 1, 2, 3)
 * @param {Object} payload - { materia_id, seccion_id }
 * @returns {Promise<Object>} { mensaje, total_alumnos, calculados_exitosamente, con_errores, resultados, errores }
 */
export const calcularNotaAnualSeccion = async (payload) => {
  const response = await axios.post(`${CALIFICACIONES_URL}/calcular-anual-seccion`, payload, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  return response.data
}

/**
 * Obtener todas las calificaciones finales
 * @param {Object} params - Filtros opcionales
 * @returns {Promise<Array>} Array de calificaciones finales
 */
export const obtenerCalificaciones = async (params = {}) => {
  const response = await axios.get(CALIFICACIONES_URL, {
    params,
    headers: { Accept: 'application/json' }
  })
  return response.data
}

/**
 * Obtener calificaciones de una sección específica
 * @param {number} seccionId - ID de la sección
 * @returns {Promise<Array>} Array de calificaciones de la sección
 */
export const obtenerCalificacionesPorSeccion = async (seccionId) => {
  const response = await axios.get(`${CALIFICACIONES_URL}/seccion/${seccionId}`, {
    headers: { Accept: 'application/json' }
  })
  return response.data.results || response.data.calificaciones || response.data
}

/**
 * Crear una nueva calificación (sistema antiguo - mantener por compatibilidad)
 * @param {Object} payload - Datos de la calificación { matricula_id, asignatura_id, parcial, nota }
 * @returns {Promise<Object>} Respuesta del backend
 */
export const crearCalificacion = async (payload) => {
  const response = await axios.post(CALIFICACIONES_URL, payload, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  return response.data
}

/**
 * Actualizar una calificación existente (sistema antiguo - mantener por compatibilidad)
 * @param {number} id - ID de la calificación
 * @param {Object} payload - Datos a actualizar { nota?, parcial? }
 * @returns {Promise<Object>} Respuesta del backend
 */
export const actualizarCalificacion = async (id, payload) => {
  const response = await axios.put(`${CALIFICACIONES_URL}/${id}`, payload, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  return response.data
}

/**
 * Eliminar una calificación (sistema antiguo - mantener por compatibilidad)
 * @param {number} id - ID de la calificación a eliminar
 * @returns {Promise<Object>} Respuesta del backend
 */
export const eliminarCalificacion = async (id) => {
  const response = await axios.delete(`${CALIFICACIONES_URL}/${id}`, {
    headers: { Accept: 'application/json' }
  })
  return response.data
}
