
**Technologies Used**
- **Backend**: Node.js, Express.js  
- **Database**: MySQL (using `mysql2` package)  
- **Authentication**: JWT(JsonWebToken), Bcrypt(Bcryptjs),Validator(email)

## ⚙️ Installation & Setup

### 1. Clone the repository

```git clone https://github.com/thaheerhussain18/User-Management-System.git```
```cd User-Management-System```

## Install dependencies
```npm install```

## Run Server
```node index.js or nodemon index.js(with nodemon)```

## Server will start at

http://localhost:5000

## Authentication
JWT token is used for autentication which will be received after logged in successfully

All user routes needs to have Jwt token

## End points
**1.Register User**
POST /register
registers a new user 

password gets hashed with bcryptjs with saltrounds of 12 , then get stored in database i.e i used MYSQL here 

example body should be
```{
    "lastName":"Joy",
    "firstName":"Boy",
    "email":"thaheer@any.com",
    "password":"any"
}```


**2.Login user**
POST /login

if user  Logged in successfully it returns JWT token singed with secretKey , after comparing the hashed password from database and req.body using bcryptjs 

example body should be 
```{
    "email":"thaheer@any.com",
    "password":"any"
}```

**3.Get all Users**

GET /users 

takes jwt token and returns all users list drom data


**4.Update User by id**

PUT /users/:id 

takes jwt token and user can update firstName ,lastName with id params

example body should be 

```{
     "lastName":"Joy",
    "firstName:"Boy"
}```

**5.Delete User by id**

DELETE /users/:id

only logged in user can delete their account using jwt token

**Configure MYSQL**

```CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL
);```

**update the required details like host,databasename,username,password in db.js module**
**secret key can be changed in jwt module**
**Tested all endpoints in POSTMAN**





