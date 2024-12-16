import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
    testDir: './tests',
    snapshotDir: './fixture/snapshots',
    snapshotPathTemplate: '{snapshotDir}/{testFilePath}/{arg}{ext}',
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 1 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [
       
    ],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        trace: 'off',
        screenshot: 'only-on-failure'
    },
    timeout: 300 * 1000,
    expect: {
        timeout: 60 * 1000
    },

    /* Configure projects for major browsers */
    projects: [
       
        /* Test against branded browsers. */
        {
            name: 'Chrome',
            use: { ...devices['Desktop Chrome'], channel: 'chrome', viewport: { width: 1920, height: 1080 } }
            // dependencies: ['setup token']
        },
        {
          name: 'Safari',
          use: { ...devices['Desktop Safari'], viewport: { width: 1920, height: 1080 }},
        }
    ]
})
