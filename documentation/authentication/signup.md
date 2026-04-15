# Feature: Signup

As new user I want to be able to create an account with my details.

## Scenario 1: User signup successfully with valid data
    GIVEN the user provides their fullname, email and password
    WHEN the details is sent as a POST request to endpoint /api/v1/auth/signup
    THEN the endpoint should respond with status code 201
    AND a response body with success property set to true
    AND a message property with string value 'Check your email to verify your account'
    AND a data object property containing user id, fullname, email, timestamp for creation and update
    AND account verification email sent to user email address

## Scenario 2: User signup unsuccessful with missing data
    GIVEN the user provides incomplete data for signup
    WHEN the details is sent as a POST request to endpoint /api/v1/auth/signup
    THEN the endpoint should respond with status code 400
    AND a response object body with success property set to false
    AND a message property with string value "Error validating request body."
    AND an error property with an object containing type, status and cause properties 

## Scenario 3: User signup unsuccessful because user already exist
## Scenario 4: User verifies email after signup successful
