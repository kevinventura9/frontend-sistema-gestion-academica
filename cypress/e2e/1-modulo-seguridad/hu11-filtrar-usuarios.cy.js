// Prueba para buscar usuarios por nombre o correo

describe('Buscar usuarios', () => {
  beforeEach(() => {
    cy.login('vc20033@ues.edu.sv', '300312!')
    cy.visit('http://localhost:5173/usuarios')
  })

  it('debe buscar usuarios por nombre', () => {
    // Esperar a que cargue la tabla de usuarios
    cy.get('.user-list-name').should('exist')
    
    // Contar el número inicial de usuarios en la tabla
    cy.get('.user-list-name').then(($usuarios) => {
      const totalInicial = $usuarios.length
      
      // Buscar un usuario específico por nombre
      cy.get('input[name="buscar-usuarios"]').type('Usuario')
      
      // Esperar a que se filtre la tabla
      cy.wait(500)
      
      // Verificar que hay resultados
      cy.get('.user-list-name').should('exist')
      
      // Verificar que el texto buscado aparece en los resultados
      cy.get('.user-list-name').first().should('contain', 'Usuario')
    })
  })



})
