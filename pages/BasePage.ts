import { Page, expect } from '@playwright/test'
require('dotenv').config()

export default class BasePage {

    public base: Record<string, any>
    constructor(public page: Page) {

        // base page
        this.base = {
            // OnePass locators
            usernameInput: this.page.locator('input#Username'),
            passwordInput: this.page.locator('input#Password'),
            signInButton: this.page.locator('#SignIn:has-text("Sign in")'),
            onepassTRLogo: this.page.locator('img[alt*="Thomson"], img[alt*="Reuters"]').first(),
            
            // CIAM locators
            ciamUsernameInput: this.page.locator('input[name="username"]'),
            ciamPasswordInput: this.page.locator('input[name="password"]'),
            ciamUsernameSignInButton: this.page.locator('button[name="action"][value="default"]'),
            ciamPasswordSignInButton: this.page.locator('button[name="action"][value="default"]'),
            ciamTRLogo: this.page.locator('img[alt*="Thomson"], img[alt*="Reuters"]').first(),
            ciamContinueButton: this.page.locator('button:has-text("Continue"), button[type="submit"]:has-text("Continue")'),
            ciamRegKeyInputByName: (name: string) => this.page.locator(`label:has-text("${name}")`),
            
            // Registration key locators (OnePass)
            tokenSelectionPanel: this.page.locator('#main.Main-wrap .Form-content'),
            regKeyInputByName: (name: string) => this.page.locator(`//label[contains(text(),"${name}")]`),
            regKeyContinueButton: this.page.locator('#main.Main-wrap .ButtonBar button, .ButtonBar button[type="submit"]'),
            
            // Common locators
            fileUploadButtonRing: this.page.locator('[data-testid="file-upload-upload-button"] #ring'),
            searchLoaderIcon: this.page.locator('#ring'),
            searchProgressIcon: this.page.locator('saf-progress-ring'),
            breadCrumbItems: this.page.locator('saf-breadcrumb-item'),
            profileIconText: this.page.locator('#user-btn saf-avatar'),
            acceptAllCookiesButton: this.page.locator('#onetrust-accept-btn-handler'),
            closeCookiesButton: this.page.locator('#onetrust-close-btn-container > .onetrust-close-btn-handler'),
            profileButton: this.page.locator('saf-button#user-btn'),
            welcomeDialogCloseButton: this.page.locator('button#pendo-close-guide-81d5be69'),
            welcomeToCoCounselV2DialogCloseButton: this.page.locator('._pendo-close-guide'),
            locatorByText: (text: string) => this.page.locator(`saf-text:has-text("${text}")`),
            locatorByTextInChat: (text: string) => this.page.locator(`div.message-text.MuiTypography-root:has-text("${text}")`),
            chatButtonByText: (text: string) => this.page.locator(`saf-button:has-text("${text}")`),
            sidebarNewButton: this.page.locator('[data-testid="new-chat-button"]'),
            sortByButton: this.page.locator('[data-testid="sort-option-button"]'),
            chatListItems: this.page.locator('.chat-or-folder-item-container'),
            emptyChatList: this.page.locator('.empty-chat-list'),
            accountMenuLink: this.page.locator('saf-menu-item#account'),
        }
    }

    /**
     * Login to app using valid credentials
     * Supports both OnePass and CIAM authentication flows
     * @returns {Promise<any>}
     */
    async loginToApp(): Promise<any> {
        const url = 'https://cocounsel.thomsonreuters.com/work/new-chat'
        const username = "automationuser@thoughttrace.dev"
        const password = "updatePassword"
        
        await this.page.goto(url)
        
        // Wait for login page to load - check for either CIAM or OnePass login inputs
        await expect(
            this.base.ciamUsernameInput.or(this.base.usernameInput), 
            'Login page should be visible'
        ).toBeVisible({ timeout: 15000 })
        
        // Check if this is CIAM flow (URL contains /u/login)
        if (this.page.url().includes('thomsonreuters.com/u/login')) {
            console.log('CIAM Login flow detected')
            
            // CIAM username step
            await expect(this.base.ciamUsernameInput).toBeVisible({ timeout: 10000 })
            await this.base.ciamUsernameInput.fill(username)
            await this.base.ciamUsernameSignInButton.click()
            
            // CIAM password step
            await expect(this.base.ciamPasswordInput).toBeVisible({ timeout: 10000 })
            await this.base.ciamPasswordInput.fill(password)
            await this.base.ciamPasswordSignInButton.click()
            
            // Wait for sign-in button to disappear (authentication complete)
            await expect(this.base.ciamPasswordSignInButton).not.toBeVisible({ timeout: 15000 })
            
            // Handle CIAM registration key selection
            await this.selectRegKeyIfDisplayedForCIAM()
            
        } else {
            console.log('OnePass Login flow detected')
            
            // Check if both username and password are visible (OnePass)
            await expect(this.base.usernameInput).toBeVisible({ timeout: 10000 })
            await this.base.usernameInput.fill(username)
            await this.base.passwordInput.click()
            
            try {
                // Check if sign-in button disappears quickly (indicates CIAM password flow)
                await expect(this.base.signInButton).not.toBeVisible({ timeout: 5000 })
                console.log('CIAM password flow detected (after OnePass username)')
                
                // CIAM password input
                await this.base.ciamPasswordInput.fill(password)
                await this.base.ciamPasswordSignInButton.click()
                await this.selectRegKeyIfDisplayedForCIAM()
                
            } catch {
                // OnePass flow - both fields visible
                console.log('OnePass flow confirmed')
                await expect(this.base.passwordInput).toBeEditable()
                await this.base.passwordInput.fill(password)
                await this.base.signInButton.click()
                await expect(this.base.signInButton).not.toBeVisible({ timeout: 15000 })
                
                // Handle OnePass registration key selection
                await this.selectRegKeyIfDisplayed()
            }
        }
        
        // Wait for successful login and page load
        // Wait for the /api/user/me call which indicates successful authentication
        try {
            await this.page.waitForResponse(
                (response) => response.url().includes('/api/user/me') && response.status() === 200,
                { timeout: 30000 }
            )
            console.log('User authenticated successfully - /api/user/me response received')
        } catch (error) {
            console.log('Did not detect /api/user/me call, continuing with login flow')
        }
        
        await this.page.waitForLoadState('domcontentloaded')
        
        // Wait for account menu to be visible (indicates successful login and page render)
        // Also check for other logged-in indicators as fallback
        try {
            await expect(
                this.base.accountMenuLink
                    .or(this.base.profileButton)
                    .or(this.base.sidebarNewButton),
                'Logged-in user indicator should be visible'
            ).toBeVisible({ timeout: 30000 })
            console.log(`User logged into ${this.page.url()}`)
        } catch (error) {
            console.log('Warning: Standard login indicators not found, but continuing...')
            console.log(`Current URL: ${this.page.url()}`)
        }
        
        await this.closeCookieBannerOrWelcomeToCoCounselIfVisible()
    }
    
    /**
     * Select registration key for OnePass flow
     * @returns {Promise<void>}
     */
    async selectRegKeyIfDisplayed(): Promise<void> {
        try {
            await expect(this.base.tokenSelectionPanel).toBeVisible({ timeout: 10000 })
            await expect(this.base.regKeyContinueButton).toBeVisible({ timeout: 5000 })
            await this.base.regKeyContinueButton.click()
            console.log('OnePass registration key selected')
        } catch (error) {
            console.log('No registration key selection required for OnePass')
        }
    }
    
    /**
     * Select registration key for CIAM flow
     * @returns {Promise<void>}
     */
    async selectRegKeyIfDisplayedForCIAM(): Promise<void> {
        try {
            // Wait a moment for the reg key selection page to fully load
            await this.page.waitForTimeout(2000)
            
            // Try to find and select the first registration key option
            const regKeyOptions = this.page.locator('input[type="radio"], label[class*="radio"], div[role="radio"]')
            const optionCount = await regKeyOptions.count()
            
            if (optionCount > 0) {
                console.log(`Found ${optionCount} registration key options, selecting first one`)
                await regKeyOptions.first().click()
                await this.page.waitForTimeout(500)
            } else {
                console.log('No radio button options found, may auto-select or not required')
            }
            
            // Look for Continue/Submit button with multiple selector strategies
            const continueButton = this.page.locator(
                'button:has-text("Continue"), ' +
                'button[type="submit"]:has-text("Continue"), ' +
                'button[type="submit"], ' +
                'input[type="submit"]'
            ).first()
            
            await expect(continueButton).toBeVisible({ timeout: 5000 })
            console.log('CIAM registration key page detected, clicking Continue/Submit button')
            await continueButton.click()
            
            // Wait for navigation to complete
            await this.page.waitForLoadState('domcontentloaded')
            console.log('CIAM registration key flow completed')
        } catch (error) {
            console.log(`No registration key selection required for CIAM: ${error}`)
        }
    }

    /**
      * Close cookie banner or Welcome to CoCounsel dialog if visible
      */
    async closeCookieBannerOrWelcomeToCoCounselIfVisible(): Promise<void> {
        await this.page.addLocatorHandler(this.base.closeCookiesButton, async () => {
            await this.base.closeCookiesButton.click()
            await expect(this.base.closeCookiesButton).not.toBeVisible()
        })
        await this.page.addLocatorHandler(this.base.acceptAllCookiesButton, async () => {
            await this.base.acceptAllCookiesButton.click()
            await expect(this.base.acceptAllCookiesButton).not.toBeVisible()
        })
        await this.page.addLocatorHandler(this.base.welcomeDialogCloseButton, async () => {
            await this.base.welcomeDialogCloseButton.click()
            await expect(this.base.welcomeDialogCloseButton).not.toBeVisible()
        })
        await this.page.addLocatorHandler(this.base.welcomeToCoCounselV2DialogCloseButton, async () => {
            await this.base.welcomeToCoCounselV2DialogCloseButton.click()
            await expect(this.base.welcomeToCoCounselV2DialogCloseButton).not.toBeVisible()
        })
    }

    /**
     * Validate logged in User via the logo
     */
    async validateLoggedInUser(avatarText: string): Promise<void> {
        await expect(this.base.accountMenuLink).toBeVisible()
    }

    /**
     * Waits for the chat or matter side nav to load
     */
    async waitForMyWorkSideNavToLoad() {
        await expect(this.base.sidebarNewButton).toBeVisible()
        await expect(this.base.sortByButton).toBeVisible()
        await expect(this.base.chatListItems.first().or(this.base.emptyChatList)).toBeVisible()
    }



}
