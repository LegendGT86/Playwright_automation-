# QA Automation Test Plan – Swag Labs

**Project:** Playwright_automation_upskilling  
**Prepared by:** Dylan Matheson
**Plan template:** Standard Default   
**Date:** [2025-11-05]  

---

## Objective
Ensure that the provided website performs accordingly with multiple users:  

- Login functionality  
- Inventory page navigation   
- Cart navigation  
- Logout  
- Basic performance metrics (page load times)  

---

## Scope

**In scope:**  
- Automated browser tests for all flows using Playwright (TypeScript)  
- Functional UI tests for login, inventory, cart, and logout  
- Performance checks (timing of key page loads)  

**Out of scope:**  
- Backend API testing (site uses client-side session storage; no public API)  
- Database validation  

---

## Test Strategy
- **Framework:** Playwright (POM)  
- **Test Execution:** Sequential tests per user to avoid state conflicts  
- **Data-Driven:** Tests for multiple users with valid and invalid credentials  
- **Reporting:** HTML reports via Playwright; screenshots for failed steps  
- **Performance Measurement:** Login and inventory item navigation timing measured via `Date.now()`  

---

## Test Data

Username                   | Password      | Expected Result |
|------------|----------------------------|--------------|----------------
| Standard   | standard_user              | secret_sauce | Successful login
| Problem    | problem_user               | secret_sauce | Successful login ( UI issues on homepage and Checkout) |
| Performance| performance_glitch_user    | secret_sauce | Successful login (mixed performance metrics) |
| Visual     | visual_user                | secret_sauce | Successful login 
| Error      | error_user                 | secret_sauce | Successful login 
| Locked     | locked_out_user            | secret_sauce | Login fails (unable to sign in)

| Username                   | Password     | Expected Result 
|----------------------------|--------------|-----------------
| standard_user              | secret_sauce | Successful login
| problem_user               | secret_sauce | Successful login ( UI issues on homepage and Checkout)
| performance_glitch_user    | secret_sauce | Successful login (high load times,measure performance) 
| visual_user                | secret_sauce | Successful login 
| error_user                 | secret_sauce | Successful login 
| locked_out_user            | secret_sauce | Login fails (verify error message) 
| dangerous_individual       | secret_sauce | Unsuccessful login (Incorrect username,Checking for possible website key word triggers)
| standard_user              | known_sauce  | Unsuccessful login (Incorrect password)
| hacker                     | secret_sauce | Unsuccessful login (Incorrect username,Checking for possible website key word triggers)
---

## Test Cases

| ID   | Test Case                          | Steps                                                                 | Expected Result                                     | Notes                           |
|------|-----------------------------------|-----------------------------------------------------------------------|----------------------------------------------------|---------------------------------|
| TC01 | Verify login page elements         | Navigate to homepage, check username, password, login button          | All elements visible                               | Visual assertion only           |
| TC02 | Login as valid user                | Fill username/password, click login                                   | Inventory page loads, `.inventory_list` visible  | Measure login duration          |
| TC03 | Navigate to inventory item         | Click inventory item or go directly                                   | Item details visible                               | Measure navigation time, screenshot if >2s |
| TC04 | Add item to cart                   | Click `Add to Cart` button                                            | Cart count increments                              | Optional performance check      |
| TC05 | Navigate to cart                   | Click cart icon                                                       | Cart page loads, `.cart_list` visible             | Visual check                   |
| TC06 | Logout                             | Click burger menu → logout                                            | Login form visible                                 | Visual assertion, no URL check |
| TC07 | Performance check                  | Measure login and inventory navigation times                          | <2000ms per step                                   | Log results and warn if exceeded |
| TC08 | Negative login                      | Use invalid credentials                                               | Error message displayed                             | Visual assertion only           |

---

## Execution Approach
1. Run tests sequentially per user to maintain isolated sessions.  
2. Capture logs and screenshots on failures.  
3. Generate HTML report via `npx playwright show-report`.  
4. Include console logs for performance metrics.  

---

## Deliverables

- Playwright test scripts (POM structure)  
- Test data files (Object maps for users, .csv for users)  
- Test report (HTML)  
- Screenshots for failed steps  
- This test plan / test case table  
---

