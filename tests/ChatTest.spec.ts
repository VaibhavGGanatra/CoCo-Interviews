import { expect, test } from '../fixture/pageFixture'
require('dotenv').config()

test.describe('Basic test for login', () => {

  test.beforeEach(async ({ basePage }) => {
    await basePage.loginToApp()
  })

  // prettier-ignore
  test('Click on Search an entire database and select a database', { tag: ['@aiSkills', '@regression'] }, async ({ basePage }) => {
    await expect(await basePage.page.locator('.chat-input-upload-button:not(.disabled)')).toBeVisible()
    await basePage.page.locator('.chat-input-upload-button:not(.disabled)').click()

    // Click on Search and entire database and validate user displayed with dialog
    

    // Search for a database and validate the searched database is displayed

    // Select the radio button for db and click on select database button and validate selected database is staged

  })

  // prettier-ignore
  test('Rename chat', { tag: ['@aiSkills', '@regression'] }, async ({ basePage }) => {

    // Click on 3 dots for first chat

    // Rename chat and save
    
  })

  // prettier-ignore
  test('Start a new chat', { tag: ['@aiSkills', '@regression'] }, async ({ basePage }) => {

    // Type below message in chat input
    const prompt = "What can you do when upload a file"

    // Validate the response received from the bot
    
  })

})
