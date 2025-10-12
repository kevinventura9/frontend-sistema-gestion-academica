// Prueba para crear un nuevo usuario y asignarle un rol como director

describe('Crear nuevo usuario y asignar rol', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('http://localhost:5173/usuarios')
  })

  it('debe abrir el modal, crear usuario y mostrarlo en la tabla', () => {
  // Abrir el modal de agregar usuario
  cy.contains('Agregar usuario').click()

  // Datos ficticios para el usuario de prueba
  const nombre = 'Usuario Cypress Prueba'
  const email = `cypress${Date.now()}@test.com`
  const dui = '12345678-9'
  const telefono = '88887777'
  const password = 'Test1234!'
  const fechaNacimiento = '1990-01-01'
  const rol = 'Docente'
  const estado = 'Activo'

  // Completa el formulario usando name
  cy.get('input[name="nombre_completo"]').type(nombre)
  cy.get('input[name="email"]').type(email)
  cy.get('input[name="dui"]').type(dui)
  cy.get('input[name="telefono"]').type(telefono)
  cy.get('input[name="password"]').type(password)
  cy.get('input[name="fecha_nacimiento"]').type(fechaNacimiento)

  // Seleccionar Rol
  cy.get('[name="rol"]').parents('.v-field').find('.v-field__input').click({force:true})
  cy.contains('.v-list-item', rol).click({force:true})

  // Seleccionar Estado
  // Envía el formulario usando name
  cy.get('button[name="guardar"]').click()

  // Espera el mensaje de éxito
  cy.contains('Usuario registrado con éxito').should('be.visible')

  })
})
