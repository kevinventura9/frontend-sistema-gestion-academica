// Prueba de inicio de sesión con credenciales válidas en el sistema de gestión académica
// Ajusta los datos de usuario según los que existan en tu base de datos local/desarrollo

describe('Login - Sistema de Gestión Académica', () => {
  it('debe iniciar sesión correctamente con credenciales válidas', () => {
    cy.visit('http://localhost:5173/login')

    // Rellena el formulario
    cy.get('input[type=email]').type('vc20033@ues.edu.sv')
    cy.get('input[type=password]').type('300312!')

    // Envía el formulario
    cy.contains('Iniciar sesión').click()

    // Espera el redireccionamiento y verifica que está en el dashboard
    cy.url().should('include', '/dashboard')
    cy.contains('Panel de Gestión Académica').should('be.visible')
  })
})
