# Omni-Server
An Express app


#  API DOCUMENTATION

* http://localhost:8000/api

# CREATE USER

* POST /api/users
* "password" must contain minimum 8 characters with at least one of each of the following.
*  Upper and lowercase letters, numbers, and symbols. 
*  Example request body
``` 
    {
	"name": "Username",
	"username": "Testuser",
	"password": "ASDFasdf12!@" 
    } 
```

# LOGIN USER 

* POST /api/auth/login
* Example request body
```
    {
        "username": "Testuser",
	    "password": "ASDFasdf12!@" 
    }
```
* Client will receive token
```
 { 
     "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJpYXQiOjE1OTA3NzY1MDUsInN1YiI6ImZpcnN0dHJ5In0.pH3KEein7GZWotxhHK-1gq4GlID7EGY9o3301uhEL2k" 
 }

```
