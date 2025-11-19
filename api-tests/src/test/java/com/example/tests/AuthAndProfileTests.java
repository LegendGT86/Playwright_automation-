package com.example.tests;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import static io.restassured.RestAssured.given;
import io.restassured.path.json.JsonPath;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class AuthAndProfileTests {
    private final String baseUrl = "https://reqres.in/api";
    private static String token;

    @Test
    @Order(1)
    @DisplayName("Login with valid credentials")
    void loginShouldReturnToken(){
        String body = """
        {
        "email": "eve.holt@reqres.in",
        "password": "cityslicka"
        }
                """;
        
        String response = given()
                .baseUri(baseUrl)
                .contentType("application/json")
                .body(body)
                .log().all()
            .when()
                .post("/login")
            .then()
                .statusCode(200)
                .extract().asString();
        
        JsonPath json = new JsonPath(response);
        token = json.getString("token");

        assertNotNull(token);
        System.out.println("extracted token: " + token);
    }

    @Test
    @Order(2)
    @DisplayName ("Get the user credentials")
    void getUserDetails (){
        given()
            .baseUri(baseUrl)
            .contentType("application/json")

        .when()
            .get("/users/2")

        .then()
            .statusCode(200)
            .body("data.id", equalTo(2))
            .body("data.first_name", notNullValue());      
    }

    @Test
    @Order (3)
    @DisplayName("Update user info")
    void updateUserDetails (){
        String updatedUser = """
                {
                    "password": "updated123"
                }
                """;
        given()
            .baseUri(baseUrl)
            .contentType("application/json")
            .body(updatedUser)

        .when()
            .patch("/users/2")
            
        .then()
            .statusCode(200)
            .body("updatedAt",notNullValue());
    }

    @Test
    @Order (4)
    @DisplayName("Delete the selected user")
    void deleteUser(){
        given()
            .baseUri(baseUrl)
            .contentType("application/json")

        .when()
            .delete("/users/2")

        .then()
            .statusCode(204);
    }

    
}
