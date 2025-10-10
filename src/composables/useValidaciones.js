import { ref } from 'vue'

/**
 * Composable para manejar validaciones de formularios de usuario
 * Proporciona funciones de validación, formateo y manejo de errores reutilizables
 */
export function useValidaciones() {
  // Estado reactivo para errores
  const formErrors = ref({})

  // Función para limpiar todos los errores
  const limpiarErrores = () => {
    formErrors.value = {}
  }

  // Función para obtener el primer error de un campo
  const obtenerError = (campo) => {
    return formErrors.value[campo] ? formErrors.value[campo][0] : ''
  }

  // Función para limpiar error de un campo específico
  const limpiarErrorCampo = (campo) => {
    if (formErrors.value[campo]) {
      delete formErrors.value[campo]
    }
  }

  // Validación completa de todos los campos
  const validarCamposVacios = (datos, incluirPassword = false) => {
    const errores = {}
    
    // Validar nombre completo
    if (!datos.nombre_completo?.trim()) {
      errores.nombre_completo = ['El nombre completo es obligatorio']
    }
    
    // Validar email
    if (!datos.email?.trim()) {
      errores.email = ['El email es obligatorio']
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(datos.email)) {
        errores.email = ['El formato del email no es válido']
      }
    }
    
    // Validar contraseña (solo si se incluye)
    if (incluirPassword && !datos.password?.trim()) {
      errores.password = ['La contraseña es obligatoria']
    }
    
    // Validar DUI
    if (!datos.dui?.trim()) {
      errores.dui = ['El DUI es obligatorio']
    } else {
      const duiRegex = /^\d{8}-\d$/
      if (!duiRegex.test(datos.dui)) {
        errores.dui = ['El formato del DUI debe ser 12345678-9']
      }
    }
    
    // Validar teléfono
    if (!datos.telefono?.trim()) {
      errores.telefono = ['El teléfono es obligatorio']
    } else {
      const telefonoRegex = /^\d{8}$/
      if (!telefonoRegex.test(datos.telefono)) {
        errores.telefono = ['El teléfono debe tener exactamente 8 dígitos']
      }
    }
    
    // Validar fecha de nacimiento
    if (!datos.fecha_nacimiento) {
      errores.fecha_nacimiento = ['La fecha de nacimiento es obligatoria']
    } else {
      const fechaNacimiento = new Date(datos.fecha_nacimiento)
      const fechaActual = new Date()
      const fechaMinima = new Date()
      fechaMinima.setFullYear(fechaActual.getFullYear() - 100) // No más de 100 años
      
      if (fechaNacimiento > fechaActual) {
        errores.fecha_nacimiento = ['La fecha de nacimiento no puede ser futura']
      } else if (fechaNacimiento < fechaMinima) {
        errores.fecha_nacimiento = ['La fecha de nacimiento no puede ser mayor a 100 años']
      }
    }
    
    // Validar rol
    if (!datos.rol) {
      errores.rol = ['El rol es obligatorio']
    }
    
    // Validar estado
    if (!datos.estado) {
      errores.estado = ['El estado es obligatorio']
    }
    
    return errores
  }

  // Validaciones individuales en tiempo real
  const validarEmail = (email) => {
    if (email && formErrors.value.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (emailRegex.test(email)) {
        limpiarErrorCampo('email')
      }
    }
  }

  const validarDUI = (dui) => {
    if (dui && formErrors.value.dui) {
      const duiRegex = /^\d{8}-\d$/
      if (duiRegex.test(dui)) {
        limpiarErrorCampo('dui')
      }
    }
  }

  const validarTelefono = (telefono) => {
    if (telefono && formErrors.value.telefono) {
      const telefonoRegex = /^\d{8}$/
      if (telefonoRegex.test(telefono)) {
        limpiarErrorCampo('telefono')
      }
    }
  }

  const validarFechaNacimiento = (fechaNacimiento) => {
    if (fechaNacimiento && formErrors.value.fecha_nacimiento) {
      const fechaNac = new Date(fechaNacimiento)
      const fechaActual = new Date()
      const fechaMinima = new Date()
      fechaMinima.setFullYear(fechaActual.getFullYear() - 100)
      
      if (fechaNac <= fechaActual && fechaNac >= fechaMinima) {
        limpiarErrorCampo('fecha_nacimiento')
      }
    }
  }

  // Funciones de formateo automático
  const formatearDUI = (valor) => {
    let valorLimpio = valor.replace(/\D/g, '') // Solo números
    
    // Limitar a 9 dígitos máximo
    if (valorLimpio.length > 9) {
      valorLimpio = valorLimpio.substring(0, 9)
    }
    
    // Agregar guión antes del último dígito si tiene 9 dígitos
    if (valorLimpio.length === 9) {
      valorLimpio = valorLimpio.substring(0, 8) + '-' + valorLimpio.substring(8)
    }
    
    return valorLimpio
  }

  const formatearTelefono = (valor) => {
    let valorLimpio = valor.replace(/\D/g, '') // Solo números
    
    // Limitar a 8 dígitos máximo
    if (valorLimpio.length > 8) {
      valorLimpio = valorLimpio.substring(0, 8)
    }
    
    return valorLimpio
  }

  // Función para validar y mostrar errores
  const ejecutarValidacion = (datos, incluirPassword = false) => {
    limpiarErrores()
    const errores = validarCamposVacios(datos, incluirPassword)
    if (Object.keys(errores).length > 0) {
      formErrors.value = errores
      return false
    }
    return true
  }

  // Opciones para selects (pueden ser compartidas)
  const rolesOptions = [
    { value: 'director', title: 'Director' },
    { value: 'docente', title: 'Docente' },
    { value: 'administrador_academico', title: 'Administrador Académico' }
  ]

  const estadoOptions = [
    { value: 'activo', title: 'Activo' },
    { value: 'inactivo', title: 'Inactivo' }
  ]

  return {
    // Estado reactivo
    formErrors,
    
    // Funciones de manejo de errores
    limpiarErrores,
    obtenerError,
    limpiarErrorCampo,
    
    // Funciones de validación
    validarCamposVacios,
    ejecutarValidacion,
    
    // Validaciones en tiempo real
    validarEmail,
    validarDUI,
    validarTelefono,
    validarFechaNacimiento,
    
    // Funciones de formateo
    formatearDUI,
    formatearTelefono,
    
    // Opciones para selects
    rolesOptions,
    estadoOptions
  }
}
