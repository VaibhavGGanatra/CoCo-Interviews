import { expect, test } from '../fixture/pageFixture'
require('dotenv').config()

test.describe('Database Test', () => {

  test.beforeEach(async ({ basePage }) => {
    await basePage.loginToApp()
  })

  // prettier-ignore
  test('Add a new database with view only permission to organisation and Filter it', { tag: ['@aiSkills', '@regression'] }, async ({ basePage }) => {
    // Navigate to the database page
    await expect(basePage.page.getByTestId("matters-nav-item")).toBeVisible()
    await basePage.page.getByTestId("matters-nav-item").click()
    
    // Click on Add database button

    // Select the database type as Draft Discovery response

    // Select the organisation as view only

    // Click on Add database button

    // Navigate to the database page

    // Filter the database by name

    // Validate the database is displayed
  })

})
