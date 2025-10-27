// Prueba de renderizado y consumo del endpoint /perfil
// Asegúrate de que el usuario esté autenticado antes de acceder a /perfil

describe('Renderizado y consumo de /perfil', () => {
  beforeEach(() => {
    cy.login('vc20033@ues.edu.sv', '300312!')
  })

  it('debe renderizar la página de perfil y mostrar datos del endpoint y datos relevantes', () => {
    cy.visit('http://localhost:5173/perfil')

    // Espera que se muestre el nombre del usuario (ajusta el selector/texto según tu implementación)
    cy.contains('Mi Perfil').should('be.visible')

    // Verifica que se haya realizado la petición al endpoint /perfil
    cy.intercept('GET', '/perfil').as('getPerfil')
    cy.reload() // Para asegurar el consumo del endpoint
    cy.wait('@getPerfil').its('response.statusCode').should('eq', 200)

    // Verifica que se muestren datos relevantes del card de datos
    cy.get('input[label="Nombre Completo"], input[placeholder="Juan Pérez García"], input[label="Email"], input[placeholder="usuario@ejemplo.com"], input[label="DUI"], input[label="Teléfono"], input[label="Fecha de Nacimiento"], button:contains("Guardar cambios")').should('exist')

    // Verifica que se muestra el nombre completo y el rol
    cy.get('.text-h5').should('be.visible') // nombre completo

    // Verifica que el estado se muestra como chip
    cy.get('.v-chip').should('be.visible')
  })
})
