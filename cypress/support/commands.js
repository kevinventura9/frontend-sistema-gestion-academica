// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// Comando personalizado para login en Cypress
Cypress.Commands.add('login', (email = 'vc20033@ues.edu.sv', password = '300312!') => {
  cy.visit('http://localhost:5173/login')
  cy.get('input[type=email]').type(email)
  cy.get('input[type=password]').type(password)
  cy.contains('Iniciar sesión').click()
  cy.url().should('include', '/dashboard')
})
// cypress/support/commands.js
Cypress.Commands.add('login2', () => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:8000/api/login',
    body: {
      email: 'vc20033@ues.edu.sv',
      password: '300312!',
    },
  }).then((response) => {
    window.localStorage.setItem('token', response.body.token)
  })
})

