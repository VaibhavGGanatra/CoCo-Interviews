import { test as base } from '@playwright/test'

import BasePage from '../pages/BasePage'

const myFixtureTest = base.extend<{
    basePage: BasePage
}>({
    basePage: async ({ page }, use) => {
        await use(new BasePage(page))
    }
})

export const test = myFixtureTest
export { expect } from '@playwright/test'