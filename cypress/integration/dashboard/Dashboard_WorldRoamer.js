// Hook
before(() => {
  cy.NavigateWorldRoamer()
})

describe('Menu of Dashboard', () => {
  it('Verify the "Find Rooms" is active when navigating to WorldRoamer page', () => {
    cy.get('ul').find('a').contains('Find Rooms').should('have.class', 'active')
  })

  it('Verify the other menus is active when clicking on them', () => {
    cy.get('ul').find('a').contains('Find Activities').click({force: true}).as('ActivitiesLink')
    //Assertion: The actived link has active class and url have the correpsonding value
    cy.get('@ActivitiesLink').should('have.class', 'active')
    cy.location('pathname').should('eq', '/activities/')
  })

  it('Verify the "USD" is default value when navigating to WorldRoamer page and its value change when selecting another value', () => {
    cy.get('#currency').should('have.value', 'USD').as('Currency')
    cy.get('@Currency').parent().click({force: true})
    cy.get('.dropdown-list li').contains('IDR').click()
    //Assertion: The selected value is displayed
    cy.get('#currency').should('have.value', 'IDR')
  })
})

describe('Find Rooms page', () => {
  beforeEach(() => {
    // Navigate to Find Rooms page
    cy.get('ul').find('a').contains('Find Rooms').click({force: true})
  })

  it('Verify that error message displays when clicking on Search without destination or hotel name', () => {
    // Assertion: Placeholder
    cy.get('#enter-destination').should('have.attr', 'placeholder', 'Enter destination or hotel name')
    cy.get('span').contains('Search').click({force: true})
    // Assertion: The Where would you like to go? error message displays
    cy.get('div').should('contain', 'Where would you like to go?')
    cy.get('div').contains('Where would you like to go?').should('be.visible')
  })

  it('Room type', () => {
    cy.get('#occupancy').should('have.value', '1 room, 2 adults').as('Occupancy')
    cy.get('@Occupancy').siblings().click({force: true})
    // Assertion: At Rooms then decrease button is disabled and increase button is enabled
    cy.get('p').contains('Rooms').as('Rooms')
    cy.get('@Rooms').siblings().find('button').eq(0).should('have.attr', 'disabled')
    cy.get('@Rooms').siblings().find('button').eq(1).should('not.have.attr', 'disabled')
    // Assertion: The room's value is 1
    cy.get('@Rooms').siblings().find('button').eq(0).siblings('p').should('contain', '1')

    cy.get('p').contains('Adults').as('Adults')
    cy.get('@Adults').siblings().find('button').eq(0).should('not.have.attr', 'disabled')
    cy.get('@Adults').siblings().find('button').eq(1).should('not.have.attr', 'disabled')
    // Assertion: The adult's value is 2
    cy.get('@Adults').siblings().find('button').eq(0).siblings('p').should('contain', '2')

    cy.get('p').contains('Children').as('Children')
    cy.get('@Children').siblings().find('button').eq(0).should('have.attr', 'disabled')
    cy.get('@Children').siblings().find('button').eq(1).should('not.have.attr', 'disabled')
    // Assertion: The chidlren's value is 0
    cy.get('@Children').siblings().find('button').eq(0).siblings('p').should('contain', '0')

    cy.get('@Rooms').siblings().find('button').eq(1).click({force: true})
    cy.get('@Children').siblings().find('button').eq(1).click({force: true})
    // Assertion: The value display correctly when increasing 1 room and 1 child
    cy.get('#occupancy').should('have.value', '2 rooms, 2 adults, 1 child')

    // Verify that user can only add maximum is 30 rooms
    for(let i = 1; i <= 28; i++) {
      cy.get('@Rooms').siblings().find('button').eq(1).click({force: true})
    }
    // Assertion: The value of room is 30
    cy.get('@Rooms').siblings().find('button').eq(0).siblings('p').should('contain', '30')
    cy.get('@Rooms').siblings().find('button').eq(1).should('have.attr', 'disabled')

    // Verify that user can only add maximum is 30 adults
    for(let i = 1; i <= 28; i++) {
      cy.get('@Adults').siblings().find('button').eq(1).click({force: true})
    }
    // Assertion: The value of room is 30
    cy.get('@Adults').siblings().find('button').eq(0).siblings('p').should('contain', '30')
    cy.get('@Adults').siblings().find('button').eq(1).should('have.attr', 'disabled')

    // Verify that childrenAge is added 10 times
    for(let i = 1; i <= 9; i++) {
      cy.get('@Children').siblings().find('button').eq(1).click({force: true})
    }
    cy.get('p').contains('Child’s Age').as('ChildAge')
    // Assertion: The length is 10
    cy.get('@ChildAge').siblings().children().should('have.length', '10')

    // Clean test case
    // Set room to default value
    for(let i = 1; i <= 29; i++) {
      cy.get('@Rooms').siblings().find('button').eq(0).click({force: true})
    }
    // Set Adults to default value
    for(let i = 1; i <= 28; i++) {
      cy.get('@Adults').siblings().find('button').eq(0).click({force: true})
    }
    // Set Children to default value
    for(let i = 1; i <= 9; i++) {
      cy.get('@Children').siblings().find('button').eq(0).click({force: true})
    }
  })

  it('Verify that checkin and checkout should display', () => {
    // Assertion: The check in displays
    cy.get('input[name=startDate]').click()
      .should('have.attr', 'placeholder', 'Check-in')
      .and('have.value', '')
    let month = new Date().toLocaleString("en-us", { month: "long" })
    let year = new Date().getFullYear();
    // Assertion: The start date is current month and year
    cy.get('strong').should('contain', `${month}, ${year}`)

    // Assertion: The check out displays
    cy.get('input[name=endDate]').click()
      .should('have.attr', 'placeholder', 'Check-out')
      .and('have.value', '')
  })

  it('Verify that the result display when searching', () => {
    cy.get('#enter-destination').clear().type('Singapore')
    cy.wait(2000)
    cy.get('span').contains('Search').click({force: true})
    // Assertion: The url has include the destination and has result for search input
    cy.location('href').should('include', 'Singapore')
    cy.get('p').should('contain', 'Hotels in Singapore')
    cy.get('p').should('contain', 'We’ve found')
    // Assertion: The default tab (We Recommend, Lowest Price First, Stars) displays
    cy.get('p').should('contain', 'We Recommend')
    cy.get('p').should('contain', 'Lowest Price First')
    cy.get('p').should('contain', 'Stars')

    // Assertion: The Compare popup displays
    cy.get('p').should('contain', 'Click on "COMPARE" to compare hotels side by side!')

    cy.get('p').contains('We’ve found').as('ResultTitle')
    // Assertion: The result list displays
    cy.get('@ResultTitle').parent().siblings().children().should('have.length', '5').and('be.above', '0')

    // Assertion: The price is not display when searching without startDate and endDate
    cy.get('p').should('contain', 'Price not Available')
    cy.get('p').should('contain', 'To view prices, please specify the dates you plan to stay')
    cy.get('span').contains('SEE PRICES').click({force: true})
    // Assertion: The error message display when clicking see prices button without date
    cy.get('div').should('contain', 'Please select check-in and check-out dates to see the price')

    cy.get('@ResultTitle').parent().siblings().children().find('div > div > div > button').eq(0).click()
    // Assertion: The Sign In popup display when clicking on favorite icon without signin
    cy.get('h4').should('contain', 'Sign In')

    // clean test case after displaying signin popup
    cy.get('#___gatsby').find('img').siblings('div').eq(1).click()

    cy.get('#free_cancellation').click({force: true})
    cy.get('#hotels').click({force: true})
    cy.get('#twin_beds').click({force: true})
    cy.get('#double_beds').click({force: true})
    cy.get('#meeting_facilities').click({force: true})

    // Assertion:
    cy.wait(1000)
    cy.get('span').should('contain', 'Clear All Filter')
    cy.get('p').should('contain', 'Free Cancellation')
    cy.get('p').should('contain', 'Hotels')
    cy.get('p').should('contain', 'Twin Bed')
    cy.get('p').should('contain', 'Double Bed')
    cy.get('p').should('contain', 'Meeting Facilities')

    // Clean filter:
    cy.get('span').contains('Clear All Filter').click({force: true})

    // Sign in after clicking on favorite icon
    cy.wait(1000)
    cy.get('@ResultTitle').parent().siblings().children().find('button').eq(0).click()
    cy.readFile('cypress/fixtures/users/user.json').as('userData').then((userData) => {
      cy.get('input[name=email]').clear().type(userData.userEmail)
      cy.get('input[name=password]').clear().type(userData.userPassword)
      cy.get('span').contains('Sign in').as('SignInBtn')
      cy.get('@SignInBtn').click({force: true})
    })
    cy.wait(2000)
    cy.get('@ResultTitle').parent().siblings().children().find('button').eq(0).click()
    // Assertion:
    cy.get('div').should('contain', 'saved to your Saved Items!')

    // clean test
    cy.get('ul').find('a').contains('Find Rooms').click({force: true})
    // Assertion: Stay up to date section displays
    cy.get('h4').should('contain', 'STAY UP-TO-DATE')
    cy.get('span').contains('Joy sent to your inbox').click({force:true})
    cy.get('input[name=subscription-email]').siblings().should('contain', 'Please enter your email address')

    cy.get('h4').should('contain','WHAT WE OFFER')
    cy.get('h4').should('contain', 'EXPLORE IDEAS')

    cy.get('.country-select__value-container').click()
    cy.get('.country-select__option').contains('Danang, Vietnam').click()
    cy.wait(1000)
    cy.get('figure').should('be.above', '0')

    // clean test case:
    cy.get('.country-select__value-container').click()
    cy.get('.country-select__option').contains('All Destinations').click()
    cy.get('a > p').contains('See All').click()
    // Assertion:
    cy.wait(1000)
    cy.get('h4').should('contain', 'Culture & Heritage')
    cy.get('h4').should('contain', 'Food & Drink')
    cy.get('h4').should('contain', 'Lifestyle')
    cy.get('h4').should('contain', 'Nature')
    cy.get('h4').should('contain', 'Night Life')
    cy.get('h4').should('contain', 'Places of Interest')
    cy.get('h4').should('contain', 'General')
    cy.get('h4').should('contain', 'Featured Articles')
    cy.get('h4').should('contain', 'Recent Articles')
  })
})
