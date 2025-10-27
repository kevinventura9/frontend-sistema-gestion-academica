// Prueba para visualizar fechas de creación y última actualización de usuarios

describe('Visualizar fechas de creación y actualización de usuarios', () => {
  beforeEach(() => {
    cy.login('vc20033@ues.edu.sv', '300312!')
    cy.visit('http://localhost:5173/usuarios')
  })

  it('debe visualizar la fecha de creación y última actualización del primer usuario', () => {
    // Esperar a que cargue la tabla de usuarios
    cy.get('.user-list-name').should('exist')
    
    // Hacer clic en el botón de editar del primer usuario
    cy.get('button[name="editar-usuario"]').first().click()
    
    // Esperar a que el formulario esté visible
    cy.contains('Editar usuario').should('be.visible')
    
    // Ir a la pestaña de Historial
    cy.contains('.v-tab', 'Historial').click()
    
    // Esperar a que se cargue la sección de historial
    cy.contains('Historial y Auditoría de Usuario').should('be.visible')
    
    // Verificar que existe la sección de "Registro de Usuario"
    cy.contains('Registro de Usuario').should('be.visible')
    
    // Verificar que se muestra la fecha de creación
    cy.contains('Fecha de Creación').should('be.visible')
    cy.get('[name="fecha-creacion"]').should('exist').and('not.be.empty')
    
    // Verificar que se muestra la antigüedad del usuario
    cy.contains('Antigüedad en el Sistema').should('be.visible')
    cy.get('[name="antiguedad-usuario"]').should('exist').and('not.be.empty')
    
    // Verificar que existe la sección de "Última Modificación"
    cy.contains('Última Modificación').should('be.visible')
    
    // Verificar que se muestra la fecha de actualización
    cy.contains('Fecha de Actualización').should('be.visible')
    cy.get('[name="fecha-actualizacion"]').should('exist').and('not.be.empty')
    
    // Verificar que se muestra el estado actual
    cy.contains('Estado Actual').should('be.visible')
    
    // Verificar que se muestra el rol actual
    cy.contains('Rol Actual').should('be.visible')
  })
})
