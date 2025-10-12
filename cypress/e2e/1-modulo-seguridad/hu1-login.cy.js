// Prueba de inicio de sesión con credenciales válidas en el sistema de gestión académica

describe('Login - Sistema de Gestión Académica', () => {
  it('debe iniciar sesión correctamente con credenciales válidas', () => {
    cy.visit('http://localhost:5173/login')

    // Rellena el formulario
    cy.get('input[id=campo-email]').type('vc20033@ues.edu.sv')
    cy.get('input[id=campo-password]').type('300312!')

    // Envía el formulario
    cy.contains('Iniciar sesión').click()

    // Espera el redireccionamiento y verifica que está en el dashboard
    cy.url().should('include', '/dashboard')
    cy.contains('Panel de Gestión Académica').should('be.visible')
  })
})
