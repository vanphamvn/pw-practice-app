
import { Page, expect } from "@playwright/test";
import { NavigationPage } from '../page-objects/navigationPage'
import { FormsLayoutPage } from '../page-objects/formLayoutsPage'
import { DatePickerPage } from '../page-objects/datePickerPage'
export class PageManager {
    private readonly page: Page
    private readonly navigationPage: NavigationPage
    private readonly formLayoutsPage: FormsLayoutPage
    private readonly datepickerPage: DatePickerPage
    constructor(page: Page) {
        this.page = page
        this.navigationPage = new NavigationPage(this.page)
        this.formLayoutsPage = new FormsLayoutPage(this.page)
        this.datepickerPage = new DatePickerPage(this.page)
    }

    navigateTo() {
        return this.navigationPage
    }
    onFormLayoutsPage() {
        return this.formLayoutsPage
    }
    onDatepickerPage() {
        return this.datepickerPage
    }

}