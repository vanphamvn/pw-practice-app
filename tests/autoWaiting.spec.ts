import test, { expect } from "@playwright/test";

test.beforeEach( async ({page}, info) => {
    await page.goto(process.env.URL);
    await page.getByText('Button Triggering AJAX Request').click();
    info.setTimeout(info.timeout+ 2000)
})

test('auto waiting', async ({page})=> {
    const successButton = page.locator('.bg-success')

    //await successButton.click()

    // const text = await successButton.textContent()

    // await successButton.waitFor({state: 'attached'})
    // const text = await successButton.allTextContents()
    
    
    // expect(text).toContain('Data loaded with AJAX get request.')

    await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 30000})

})

test.skip('alternative wait', async ({page}) => {
    const successButton = page.locator('.bg-success')

    // wait for selector
    // await page.waitForSelector('.bg-success')

    // wait for particular response -- NOT RECOMMENDED
    await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    const text = await successButton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')
})

test.skip('timeout', async ({page}) => {
    //test.setTimeout(2000)
    //test.slow()
    
    const successButton = page.locator('.bg-success')
    await successButton.click({timeout:10000})
})
    