import { Page, expect } from '@playwright/test'
require('dotenv').config()

export default class BasePage {

    public base: Record<string, any>
    constructor(public page: Page) {

        // base page
        this.base = {
            usernameInput: this.page.locator('input#Username'),
            passwordInput: this.page.locator('input#Password'),
            signInButton: this.page.locator('#SignIn:has-text("Sign in")'),
            tokenSelectionPanel: this.page.locator('#main.Main-wrap .Form-content'),
            regKeyInputByName: (name: string) => this.page.locator(`//label[contains(text(),"${name}")]`),
            regKeyContinueButton: this.page.locator('.ButtonBar button'),
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
     * @param {LoginAppType}
     * @returns {Promise<string>} - A promise that resolves to the value of the retrieved orchestration token.
     */
    async loginToApp(): Promise<any> {
        const url = 'https://cocounsel.thomsonreuters.com/work/new-chat'
        await this.page.goto(url)
        await expect(this.base.usernameInput).toBeVisible()
        await expect(this.base.passwordInput).toBeVisible()
        await this.base.usernameInput.fill("qa.emails@thoughttrace.dev")
        await expect(this.base.passwordInput).toBeEditable()
        await this.base.passwordInput.fill("CoCounsel@01")
        await this.base.signInButton.click()
        await expect(this.base.regKeyContinueButton).toBeVisible()
        await this.base.regKeyContinueButton.click()
        await this.page.waitForLoadState('domcontentloaded')
        await this.validateLoggedInUser("QT")
        await this.closeCookieBannerOrWelcomeToCoCounselIfVisible()
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
