import { Page, Locator } from '@playwright/test';
import dotenv from "dotenv";
dotenv.config();

// Read baseURL from environment variables
const baseURL = process.env.BASE_URL;

export class BasePage {
    constructor(protected page:Page) {}

    async navigateTo(path: string){
        if (!baseURL) throw new Error("Base URL not defined in environment vars");
        const url = `${baseURL.replace(/\/$/,'')}`; // Ensure correct URL (no double slashes)
        await this.page.goto(url);
    }

    async click (locator: Locator){
        await locator.click();
    }
    
    async type(locator: Locator, text: string ){
        await locator.fill(text);
    }

    async getText(locator: Locator, text: string){
        const element =  locator.getByText(text);
        return element.textContent();
    }
}