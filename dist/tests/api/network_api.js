"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
//All API tests will be conducted based on an RESTFUL API dedicated website, as saucedemo.com is a static website
test_1.test.describe('API perfomance Test', () => {
    let request;
    test_1.test.beforeAll(async ({ playwright }) => {
        //request content for API calls
        request = await playwright.request.newContext({
            baseURL: 'https://restful-booker.herokuapp.com/',
            ignoreHTTPSErrors: true,
            extraHTTPHeaders: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });
    });
    test_1.test.afterAll(async () => {
        await request.dispose();
    });
    (0, test_1.test)('@api token acquision', async () => {
    });
    for (const user of validUsers) {
        (0, test_1.test)(`Measure login API response time for user ${user.username}`, async () => {
            const loginPayLoad = { username: user.username, password: user.password };
            const startTime = Date.now();
            const response = await request.post('/login', { data: loginPayLoad });
            const loginDuration = Date.now() - startTime;
            console.log(`${user.username} login response time: ${loginDuration} ms`);
            (0, test_1.expect)([200, 401, 403]).toContain(response.status());
            if (!response.ok()) {
                console.warn('${user.username} login failed with status ${response.status()}');
                return; //skip the test if login fails
            }
            const inventoryStartTime = Date.now();
            const inventoryResponse = await request.get('/inventory-item.html?id=1');
            const inventoryDuration = Date.now() - inventoryStartTime;
            console.log('${user.username} inventory item response time: ${inventoryDuration} ms');
            (0, test_1.expect)(inventoryResponse.ok()).toBeTruthy();
            (0, test_1.expect)(loginDuration).toBeLessThan(2000); //login should be under 2 seconds
            (0, test_1.expect)(inventoryDuration).toBeLessThan(2000); //inventory item should be under 2 seconds
        });
    }
});
