import test from "@playwright/test";
import {PageManager} from "../page-objects/pageManager"
import {faker} from "@faker-js/faker"

test.beforeEach(async ({page}) => {
    await page.goto("/");
})

test('navigation from page', async ({page}) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage()
})

test('parameterized method', async({page}) => {
    const pm = new PageManager(page)
    pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGrigFormWithCredentialsAndSelectOption('test@test.com', 'test', 'Option 1')
    await page.screenshot({path: `screenshots/screenshot-${faker.number.int({min: 1, max: 1000})}.png`})
    await pm.onFormLayoutsPage().sumbitInlineFormWithNameEmailAndCheckbox('test', 'test@test.com', true)

    pm.navigateTo().datepickerPage()
    await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(2)
    await pm.onDatepickerPage().selectDatepickerWithRangeFromToday(3, 5)
})

test('random data', async({page}) => {
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int({min: 1, max: 1000})}@test.com`
    const pm = new PageManager(page)
    pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGrigFormWithCredentialsAndSelectOption(randomEmail, randomFullName, 'Option 1')
    await pm.onFormLayoutsPage().sumbitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)
})