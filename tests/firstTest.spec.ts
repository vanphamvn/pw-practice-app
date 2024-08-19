import test, { expect } from "@playwright/test";

test.afterEach( async ({page}) => {

})


test.beforeEach( async ({page}) => {
    await page.goto('http://localhost:4200/');
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
})

test('locator syntax', async ({page}) => {
    //tag
    page.locator('input').first().click()
    //id
    await page.locator('#inputEmail').click()
    //class value
    page.locator('.shape-rectangle')
    //attribute
    page.locator('[placeholder="Email"]')
    //class value and attribute
    page.locator('.shape-rectangle[placeholder="Email"]')
    //combination
    page.locator('input.[placeholder="Email"].shape-rectangle')
    //xpath
    page.locator('//input[@placeholder="Email"]')
    //css
    page.locator('input[placeholder="Email"]')
    //regex
    page.locator('input[placeholder~="Email"]')
    //partial text match
    page.locator(':text("Email")')
    //exact text match
    page.locator(':text-is("Email")')
})

test('user facing locator', async ({page})=> {
    await page.getByTestId('SignIn').click()
})

test('locating child element', async ({page})=>{
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator('nb-radio :text-is("Option 2")').click()

    await page.locator('nb-card').getByRole('button', {name: 'Sign in'}).nth(1).click()
})

test('locating parent element', async ({page}) => {
    await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: 'Email'}).click()
    await page.locator('nb-card', {has: page.locator('#inputEmail')}).getByRole('textbox', {name: 'Email'}).click()

    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: 'Password'}).click()

    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: 'Email'}).click()
})

test('reuse element', async ({page}) => {

    const basicForm = page.locator('nb-card', {hasText: "Basic form"})
    const emailField = basicForm.getByRole('textbox', {name: 'Email'})

    await emailField.fill('Email@exmaple.com')
    await basicForm.getByRole('textbox', {name: 'Password'}).fill('Pass123')
    await basicForm.getByRole('button').click()

    await expect(emailField).toHaveValue('Email@exmaple.com')
    await expect(basicForm.getByRole('textbox', {name: 'Password'})).toHaveValue('Pass123')

})

test('extracting value', async ({page})=> {

    const basicForm = page.locator('nb-card', {hasText: "Basic form"})
    const buttonText = await basicForm.locator('button').textContent()

    expect(buttonText).toEqual('Submit')

    //all text values
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonsLabels).toContain('Option 1')

    //input value
    const emailField = basicForm.getByRole('textbox', {name: 'Email'})
    await emailField.fill('Email@exmaple.com')
    const emailFieldValue = await emailField.inputValue()
    expect(emailFieldValue).toEqual('Email@exmaple.com')

    //attribute value
    const emailFieldPlaceholder = await emailField.getAttribute('placeholder')
    expect(emailFieldPlaceholder).toEqual('Email')

})

test('assertion', async ({page})=> {
    const basicFormButton = page.locator('nb-card', {hasText: "Basic form"}).locator('button')

    //General assertions //not wait
    const value = 6
    expect(value).toEqual(6)
    expect(value).not.toEqual(5)
    expect(value).toBeGreaterThan(5)

    //Specific assertions
    const text = await basicFormButton.textContent()
    expect(text).toEqual('Submit')
    expect(text).not.toEqual('Submit!')
    expect(text).toMatch(/Submit/)
    expect(text).toMatch(/Sub/)
    expect(text).not.toMatch(/subm/)

    //locator assertion //wait up to 5 seconds
    expect(basicFormButton).toHaveText('Submit')
    expect(basicFormButton).toHaveText(/Sub/)
    expect(basicFormButton).not.toHaveText(/subm/)

    //wait for up to 3 seconds
    //await expect(basicFormButton).toHaveText('Submit1', {timeout: 3000})

    //soft assertion
    await expect.soft(basicFormButton).toHaveText('Submi1')

    //soft assertion wait for 5 seconds
    await expect.soft(basicFormButton).toHaveText('Submit1', {timeout: 5000})

    //click
    await basicFormButton.click()
})


