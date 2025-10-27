// Prueba de actualización de teléfono en el perfil personal
// El usuario debe poder modificar su teléfono y ver el mensaje de éxito

describe('Actualizar teléfono en Mi Perfil', () => {
  beforeEach(() => {
    cy.login('vc20033@ues.edu.sv', '300312!')
    cy.visit('http://localhost:5173/perfil')
  })

  it('debe permitir modificar el teléfono y mostrar confirmación', () => {
    // Espera que el campo teléfono esté visible usando el atributo name
    cy.get('input[name="telefono"]').should('be.visible')

    // Cambia el valor del teléfono
    cy.get('input[name="telefono"]').clear().type('70030484')

    // Haz clic en guardar cambios
    cy.get('button[name="guardar"]').click()

    // Espera el mensaje de éxito
    cy.contains('Perfil actualizado exitosamente').should('be.visible')

    // Verifica que el campo se actualizó y tiene 8 dígitos
    cy.get('input[name="telefono"]').should(($input) => {
      expect($input.val()).to.match(/^\d{8}$/)
    })
  })
})
