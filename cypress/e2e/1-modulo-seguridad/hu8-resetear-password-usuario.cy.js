// Prueba para resetear la contraseña de un usuario como director

describe('Resetear contraseña de usuario', () => {
  beforeEach(() => {
    cy.login('vc20033@ues.edu.sv', '300312!')
    cy.visit('http://localhost:5173/usuarios')
  })

  it('debe resetear la contraseña del tercer usuario de la lista', () => {
    // Esperar a que cargue la tabla de usuarios
    cy.get('.user-list-name').should('exist')
    
    // Hacer clic en el botón de editar del tercer usuario
    cy.get('button[name="editar-usuario"]').eq(2).click()
    
    // Esperar a que el formulario esté visible
    cy.contains('Editar usuario').should('be.visible')
    
    // Ir a la pestaña de Seguridad
    cy.contains('.v-tab', 'Seguridad').click()
    
    // Esperar a que se cargue la sección de seguridad
    cy.contains('Cambiar Contraseña').should('be.visible')
    
    // Ingresar la nueva contraseña
    const nuevaPassword = 'NuevaPass123!'
    cy.get('input[name="nueva_password"]').type(nuevaPassword)
    
    // Hacer clic en el botón de cambiar contraseña
    cy.get('button[name="cambiar-password"]').click()
    
    // Verificar que se muestre el mensaje de éxito
    cy.contains('Usuario actualizado').should('be.visible')
  })
})
