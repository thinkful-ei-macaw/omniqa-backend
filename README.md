# Omni-Server
* Back-end framework providing data to the Omni app
* Link to live server: https://murmuring-ridge-04034.herokuapp.com

# Screenshots
**insert later
**

# Endpoints

## User Endpoint

### POST /api/users
Creates new user accounts in the database. This requires a JSON Object with `name`, `username`, and `password` **(must contain minimum 8 characters with at least 1 uppercase, 1 lowercase, and 1 number)**

**Response: 201 CREATED**

``` 
    {

	"name": "Username",
	"username": "Testuser",
	"password": "ASDFasdf12!@" 

    } 
```
### GET /api/users/:user_id
Gets a users name from the database.

Response: **200 OK**

``` 
    {

	"name": "Username"

    } 
```

## Login endpoint 

### POST /api/auth/login
Facilitates logging in by the client. This requires a JSON object with `username` and `password` in the request body.

**Response: 200 OK**

```
    {

    "username": "Testuser",
	"password": "ASDFasdf12!@" 

    }
```

```
 { 

 "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJpYXQiOjE1OTA3NzY1MDUsInN1YiI6ImZpcnN0dHJ5In0.pH3KEein7GZWotxhHK-1gq4GlID7EGY9o3301uhEL2k" 

 }

```

## Question Endpoint
### GET /api/questions
Returns an array of all questions from the database. 

**Response: 200 OK**

```
[
    {
        "id": 1,
        "author": 1,
        "question_body": "test question 1",
        "department": 1,
        "created_date": "2020-05-29T18:39:07.526Z",
        "answered": false
    },
    {
        "id": 2,
        "author": 1,
        "question_body": "test question 2",
        "department": 2,
        "created_date": "2020-05-29T18:39:07.526Z",
        "answered": false
    },
]
```

### POST /api/questions
Creates a question in the database. This requires an `Authorization` header with a Bearer token (received from `POST /api/auth/login`), as well as a JSON object with `question_body`(string) and `department_id`(int) in the request body.

**Response: 201 Created**

```
    {
	
	    "question_body": "test question 10",
	    "department_id": 1
    }

```

Example response body from POST

```
    {
        
        "id": 1,
        "author": 1,
        "question_body": "test question 10",
        "department": 1,
        "created_date": "2020-05-29T18:39:07.526Z",
        "answered": false

    }
```

### DELETE /api/questions/:question_id
Deletes a question by the user matched using the token. This requires an `Authorization` header with a Bearer Token (received from `POST /api/auth/login`)

**Response: 204 NO CONTENT**

### PATCH /api/questions/:question_id
Updates a question by the user matched using the token. This requires an `Authorization` header with a Bearer Token (received from `POST /api/auth/login`)

**Response: 204 NO CONTENT**
## Answer Endpoint

GET /api/answers
* View Array of answers

```
[
    {
        "id": 1,
        "author": 2,
        "question": 1,
        "answer_body": "test answer 10",
        "created_date": "2020-05-29T20:16:12.670Z"
    },

    {
        "id": 2,
        "author": 2,
        "question": 2,
        "answer_body": "test answer 11",
        "created_date": "2020-05-29T20:16:12.670Z"

    }
]
```

* POST /api/answers
* Include Token in Authorization header, use Type Bearer Token
* Example request body

```
    { 
    
    "answer_body": "test answer 3",
    "question_id": 5
    
    }

```

* Example response body from POST

```
    {

    "id": 3, 
    "author": 2, 
    "question": 5, 
    "answer_body": "test answer 3",
    "created_date": "2020-05-29T19:38:06.924Z" 
    
    }
```
