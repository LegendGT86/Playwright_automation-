import { test, expect, APIRequestContext } from "@playwright/test";
import { loadTestData } from "../../utils/dataloader";

//All API tests will be conducted based on an RESTFUL API dedicated website, as saucedemo.com is a static website
const validUser = []
test.describe('API perfomance Test',() => {
    let request: APIRequestContext;


    pm