// Prueba para activar o desactivar un usuario como director

describe('Activar o desactivar usuario', () => {
  beforeEach(() => {
    cy.login('vc20033@ues.edu.sv', '300312!')
    cy.visit('http://localhost:5173/usuarios')
  })

  it('debe cambiar el estado del tercer usuario de la lista', () => {
    // Esperar a que cargue la tabla de usuarios
    cy.get('.user-list-name').should('exist')
    
    // Hacer clic en el botón de editar del tercer usuario
    cy.get('button[name="editar-usuario"]').eq(2).click()
    
    // Esperar a que el formulario esté visible
    cy.contains('Editar usuario').should('be.visible')
    
    // Cambiar el estado del usuario (alternar entre Activo e Inactivo)
    cy.get('[name="estado"]').parents('.v-field').find('.v-field__input').click({ force: true })
    cy.contains('.v-list-item', 'Inactivo').click({ force: true })
    
    // Guardar cambios
    cy.get('button[name="guardar"]').click()
    
    // Verificar que se muestre el mensaje de éxito
    cy.contains('Usuario actualizado').should('be.visible')
  })
})
