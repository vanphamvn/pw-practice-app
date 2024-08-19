import test, { expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:4200/");
});

test.describe("Form Layouts page", () => {
    // test.describe.configure({ mode: "parallel" });
    // test.describe.configure({ mode: "serial" });
    test.describe.configure({retries: 1})
    test.beforeEach(async ({ page }) => {
        await page.getByText("Forms").click();
        await page.getByText("Form Layouts").click();
    });

    test("Input fields", async ({ page }, testInfo) => {
        if (testInfo.retry) {
            //cleanup last run
        }
        const usingTheGridEmailInput = page
            .locator("nb-card", { hasText: "Using the Grid" })
            .getByRole("textbox", { name: "Email" });

        await usingTheGridEmailInput.fill("test@test.com");
        expect(await usingTheGridEmailInput.inputValue()).toEqual("test@test.com");
        await usingTheGridEmailInput.clear();
        await usingTheGridEmailInput.pressSequentially("t@t2.com", { delay: 100 });

        //locator assertions
        await expect(usingTheGridEmailInput).toHaveValue("t@t2.com", {
            timeout: 5000,
        });
    });

    test("Radio buttons", async ({ page }) => {
        const usingTheGridForm = page.locator("nb-card", {
            hasText: "Using the Grid",
        });
        // await usingTheGridForm.getByLabel('Option 1').check({force: true})
        await usingTheGridForm
            .getByRole("radio", { name: "Option 1" })
            .check({ force: true });

        const radioStatus = await usingTheGridForm
            .getByRole("radio", { name: "Option 1" })
            .isChecked();
        expect(radioStatus).toBeTruthy();
        await expect(
            usingTheGridForm.getByRole("radio", { name: "Option 1" })
        ).toBeChecked();

        await usingTheGridForm
            .getByRole("radio", { name: "Option 2" })
            .check({ force: true });
        await expect(
            usingTheGridForm.getByRole("radio", { name: "Option 2" })
        ).toBeChecked();
        //verify option 1 not checked
        await expect(
            usingTheGridForm.getByRole("radio", { name: "Option 1" })
        ).not.toBeChecked();
        expect(
            await usingTheGridForm
                .getByRole("radio", { name: "Option 1" })
                .isChecked()
        ).toBeFalsy();
    });
});

test.only("Checkbox", async ({ page }) => {
    await page.getByText("Modal & Overlays").click();
    await page.getByText("Toastr").click();

    await page
        .getByRole("checkbox", { name: "Hide on click" })
        .uncheck({ force: true });
    await page
        .getByRole("checkbox", { name: "Prevent arising of duplicate toast" })
        .check({ force: true });

    const allBoxes = page.getByRole("checkbox");
    for (const box of await allBoxes.all()) {
        if (await box.isChecked()) {
            await box.uncheck({ force: true });
        } else {
            await box.check({ force: true });
        }
    }
});

test("Select", async ({ page }) => {
    const dropDownMenu = page.locator("ngx-header nb-select");
    await dropDownMenu.click();
    //const optionList = page.getByRole('list'). locator('nb-option')
    const optionList = page.locator("nb-option-list nb-option");
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]);
    await optionList.filter({ hasText: "Cosmic" }).click();
    const header = page.locator("nb-layout-header");
    await expect(header).toHaveCSS("background-color", "rgb(50, 50, 89)");
    const colors = {
        Light: "rgb(255, 255, 255)",
        Dark: "rgb(34, 43, 69)",
        Cosmic: "rgb(50, 50, 89)",
        Corporate: "rgb(255, 255, 255)",
    };
    await dropDownMenu.click();
    for (const color in colors) {
        await optionList.filter({ hasText: color }).click();
        await expect(header).toHaveCSS("background-color", colors[color]);
        if (color != "Corporate") await dropDownMenu.click();
    }
});

test("Tooltip", async ({ page }) => {
    await page.getByText("Modal & Overlays").click();
    await page.getByText("Tooltip").click();

    const tooltipCard = page.locator("nb-card, nb-card", {
        hasText: "Tooltip Placements",
    });
    await tooltipCard.getByRole("button", { name: "Top" }).hover();
    //nb-tooltip div span

    const tooltip = await page.locator("nb-tooltip").textContent();
    expect(tooltip).toEqual("This is a tooltip");
});

test("dialog box", async ({ page }) => {
    await page.getByText("Tables & Data").click();
    await page.getByText("Smart Table").click();

    page.on("dialog", (dialog) => {
        expect(dialog.message()).toEqual("Are you sure you want to delete?");
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.accept();
    });

    await page
        .getByRole("table")
        .locator("tr", { hasText: "mdo@gmail.com" })
        .locator(".nb-trash")
        .click();
    await expect(page.locator("table tr").first()).not.toHaveText(
        "mdo@gmail.com"
    );
});

test("web table edit age", async ({ page }) => {
    await page.getByText("Tables & Data").click();
    await page.getByText("Smart Table").click();

    const targetRow = page.getByRole("row", { name: "mdo@gmail.com" });
    await targetRow.locator(".nb-edit").click();

    await page.locator("input-editor").getByPlaceholder("Age").clear();
    await page.locator("input-editor").getByPlaceholder("Age").fill("40");
    await page.locator(".nb-checkmark").click();

    //3 test filter of the table
    const ages = ["20", "30", "40", "200"];
    for (let age of ages) {
        await page.locator("input-filter").getByPlaceholder("Age").clear();
        await page.locator("input-filter").getByPlaceholder("Age").fill(age);
        await page.waitForTimeout(500);

        const ageRows = page.locator("tbody tr");
        for (let row of await ageRows.all()) {
            const cellValue = await row.locator("td").last().textContent();
            if (age == "200") {
                expect(await page.getByRole("table").textContent()).toContain(
                    "No data found"
                );
            } else {
                expect(cellValue).toEqual(age);
            }
        }
    }
});

test("datepicker", async ({ page }) => {
    await page.getByText("Forms").click();
    await page.getByText("Datepicker").click();
    const calendarInputField = page.getByPlaceholder("Form Picker");
    await calendarInputField.click();
    await page
        .locator('[class="day-cell ng-star-inserted"]')
        .getByText("1", { exact: true })
        .click();
    await expect(calendarInputField).toHaveValue("Aug 1, 2024");
});

test("sliders", async ({ page }) => {
    // method 1: Update attribute
    const tempGauge = page.locator(
        '[tabtitle="Temperature"] ngx-temperature-dragger circle'
    );
    await tempGauge.evaluate((node) => {
        node.setAttribute("cx", "232.630");
        node.setAttribute("cy", "232.630");
    });
    await tempGauge.click();


    //Method 2: Mouse move
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded()
    const box = await tempBox.boundingBox()
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2
    await page.mouse.move(x, y)
    await page.mouse.down()
    await page.mouse.move(x + 100, y)
    await page.mouse.move(x + 100, y + 100)
    await page.mouse.up()
    await expect(tempBox).toContainText("30")

});
