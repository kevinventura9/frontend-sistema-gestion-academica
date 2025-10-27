// Prueba para eliminar un usuario como director

describe('Eliminar usuario', () => {
  beforeEach(() => {
    cy.login('vc20033@ues.edu.sv', '300312!')
    cy.visit('http://localhost:5173/usuarios')
  })

  it('debe eliminar el quinto usuario de la lista', () => {
    // Esperar a que cargue la tabla de usuarios
    cy.get('.user-list-name').should('exist')
    
    // Hacer clic en el botón de eliminar del quinto usuario
    cy.get('button[name="eliminar-usuario"]').eq(4).click()
    
    // Esperar a que aparezca el modal de confirmación
    cy.contains('Confirmar Eliminación').should('be.visible')
    
    // Confirmar la eliminación
    cy.get('button[name="confirmar-accion"]').click()
    
    // Verificar que se muestre el mensaje de éxito
    cy.contains('eliminado').should('be.visible')
  })
})
