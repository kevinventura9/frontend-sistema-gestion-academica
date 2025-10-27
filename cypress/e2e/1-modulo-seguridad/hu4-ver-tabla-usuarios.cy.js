// Prueba de renderizado de la tabla de usuarios y consumo del endpoint /usuarios

describe('Renderizado de tabla de usuarios y consumo de /usuarios', () => {
  beforeEach(() => {
    cy.login('vc20033@ues.edu.sv', '300312!')
    cy.visit('http://localhost:5173/usuarios')
  })

  it('debe mostrar la tabla de usuarios y consumir el endpoint', () => {
    // Verifica que el título de la página y la tabla estén visibles
    cy.contains('Gestión de usuarios').should('be.visible')
    cy.contains('Lista de Usuarios').should('be.visible')

    // Intercepta la petición al endpoint /usuarios
    cy.intercept('GET', '/usuarios').as('getUsuarios')
    cy.reload() // Para asegurar el consumo del endpoint
    cy.wait('@getUsuarios').its('response.statusCode').should('eq', 200)

    // Verifica que se renderiza al menos un usuario en la tabla
    cy.get('.user-list-name').should('exist')
  })
})
