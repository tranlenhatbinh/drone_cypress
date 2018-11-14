// Hook
before(() => {
  cy.NavigateWorldRoamer()
})

describe('Navigate to WorlRoamer site and Login', () => {
  beforeEach(() => {
    cy.get('span').contains('Login').should('have.text', 'Login').as('LogInBtn')
    cy.get('@LogInBtn').click({force: true})
    //Assertion: The Sign In popup displays
    cy.get('h4').should('contain', 'Sign In')
  })

  it('Login WorlRoamer site with invalid account', () => {
    cy.readFile('cypress/fixtures/users/user.json').as('userData').then((userData) => {
      cy.get('input[name=email]').clear().type(userData.userEmailInvalid)
      cy.get('input[name=password]').clear().type(userData.userPasswordInvalid)
    })
    cy.get('span').contains('Sign in').as('SignInBtn')
    cy.get('@SignInBtn').click({force: true})
    // Assertion: The Your Account text display after login successfully
    cy.get('h4').should('contain', 'Can’t sign in to WorldRoamer')
  })

  it('Login WorlRoamer site', () => {
    cy.readFile('cypress/fixtures/users/user.json').as('userData').then((userData) => {
      cy.get('input[name=email]').clear().type(userData.userEmail)
      cy.get('input[name=password]').clear().type(userData.userPassword)
      cy.get('span').contains('Sign in').as('SignInBtn')
      cy.get('@SignInBtn').click({force: true})
      // Assertion: The Your Account text display after login successfully
      cy.get('section').children().contains('Your Account').as('Profile')
    })
    // Clean test case: Logout
    cy.get('@Profile').click({force: true})
    cy.get('section').children().contains('Sign Out').click({force: true})
  })
})

describe('Navigate to WorlRoamer site and Sign Up WorlRoamer site', () => {
  beforeEach(() => {
    cy.wait(2000)
    cy.get('span').contains('Sign Up').should('have.text', 'Sign Up').as('SignUpBtn')
    cy.get('@SignUpBtn').click({force: true})
  })

  it('Verify that the error message display when singup with empty value', () => {
    cy.get('input[name=username]').clear()
    cy.get('input[name=password]').clear()
    cy.get('span').contains('Create account').as('CreateAccountBtn')
    cy.get('@CreateAccountBtn').click({force: true})
    //Assertion: The error message: Please enter your email and Please enter your password display
    cy.get('div').children().contains('Please enter your email')
    cy.get('div').children().contains('Please enter your password')
  })

  it('User cannot signup with already registered account', () => {
    cy.readFile('cypress/fixtures/users/user.json').as('userData').then((userData) => {
      cy.get('input[name=username]').clear().type(userData.userEmail)
      cy.get('input[name=password]').clear().type(userData.userPassword)
    })
    cy.get('span').contains('Create account').as('CreateAccountBtn')
    cy.get('@CreateAccountBtn').click({force: true})
    //Assertion: The error message: This email has already been used displays
    cy.get('div').children().contains('This email has already been used.')
  })

  it('User cannot signup with invalid account', () => {
    cy.readFile('cypress/fixtures/users/user.json').as('userData').then((userData) => {
      cy.get('#emailAddress').clear().type(userData.userEmailInvalid)
      cy.get('#password').clear().type(userData.userPassword)
    })
    //Assertion: The error message: This email has already been used displays
    cy.get('div').children().contains('Opps, this doesn’t look like a valid email address')
    cy.readFile('cypress/fixtures/users/user.json').as('userData').then((userData) => {
      cy.get('#emailAddress').clear().type(userData.userEmail)
      cy.get('#password').clear().type(userData.userPasswordInvalid)
    })
    //Assertion: The error message: This email has already been used displays
    cy.get('div').children().contains('Your password must have at least 6 characters')
  })
  // Clean test case
  afterEach(() => {
    cy.get('#___gatsby').find('img').siblings('div').eq(1).click()
  })
})

describe('Forgot password', () => {
  const userEmailInvalid = 'abc'
  beforeEach(() => {
    cy.get('span').contains('Login').should('have.text', 'Login').as('LogInBtn')
    cy.get('@LogInBtn').click({force: true})
    //Assertion: The Sign In popup displays
    cy.get('h4').should('contain', 'Sign In')
    cy.get('span').contains('Forgot password?').click({force: true})
  })

  it('User cannot reset password with invalid password', () => {
    cy.readFile('cypress/fixtures/users/user.json').as('userData').then((userData) => {
      cy.get('#email').clear().type(userData.userEmailInvalid)
    })
    cy.get('span').contains('Submit').click({force: true})
    //Assertion
    cy.get('div').children().contains('Unable to send reset link')
  })
  // Clean test case
  afterEach(() => {
    cy.get('#___gatsby').find('img').siblings('div').eq(1).click({force: true})
  })
})