// Prueba para cerrar sesión

describe('Cerrar sesión', () => {
  beforeEach(() => {
    cy.login('vc20033@ues.edu.sv', '300312!')
    cy.visit('http://localhost:5173/dashboard')
  })

  it('debe cerrar sesión correctamente', () => {
    // Verificar que estamos en el dashboard
    cy.url().should('include', '/dashboard')
    
    // Hacer clic en el avatar del usuario para abrir el menú
    cy.get('.v-avatar').first().click()
    
    // Esperar a que aparezca el menú
    cy.contains('Cerrar sesión').should('be.visible')
    
    // Hacer clic en cerrar sesión
    cy.get('[name="cerrar-sesion"]').click()
    
    // Verificar que redirige a la página de login
    cy.url().should('include', '/login')
    
    // Verificar que el formulario de login está visible
    cy.contains('Bienvenido').should('be.visible')
  })
})
