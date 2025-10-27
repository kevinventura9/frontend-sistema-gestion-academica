// Prueba para modificar los datos de un usuario existente como director

describe('Modificar datos de usuario existente', () => {
  beforeEach(() => {
    cy.login('vc20033@ues.edu.sv', '300312!')
    cy.visit('http://localhost:5173/usuarios')
  })

  it('debe modificar los datos del segundo usuario de la lista', () => {
    // Esperar a que cargue la tabla de usuarios
    cy.get('.user-list-name').should('exist')
    
    // Hacer clic en el botón de editar del segundo usuario usando el atributo name
    cy.get('button[name="editar-usuario"]').eq(1).click()
    
    // Esperar a que el formulario esté visible
    cy.contains('Editar usuario').should('be.visible')
    
    // Modificar los datos del usuario
    const nombreModificado = `Usuario Modificado ${Date.now()}`
    const telefonoModificado = '77776666'
    const fechaNacimientoModificada = '1992-05-15'
    
    // Limpiar y modificar nombre completo
    cy.get('input[name="nombre_completo"]').clear().type(nombreModificado)
    
    // Limpiar y modificar teléfono
    cy.get('input[name="telefono"]').clear().type(telefonoModificado)
    
    // Modificar fecha de nacimiento
    cy.get('input[name="fecha_nacimiento"]').clear().type(fechaNacimientoModificada)
    
    // Modificar rol (seleccionar Docente)
    cy.get('[name="rol"]').parents('.v-field').find('.v-field__input').click({ force: true })
    cy.contains('.v-list-item', 'Docente').click({ force: true })
    
    // Modificar estado (seleccionar Activo)
    cy.get('[name="estado"]').parents('.v-field').find('.v-field__input').click({ force: true })
    cy.contains('.v-list-item', 'Activo').click({ force: true })
    
    // Hacer clic en el botón de guardar cambios
    cy.get('button[name="guardar"]').click()
    
    // Verificar que se muestre el mensaje de éxito
    cy.contains('Usuario actualizado exitosamente').should('be.visible')
  })
})
