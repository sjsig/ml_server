## Connect to Database

- DB_HOST=`landlordpub.co8jwtanpqk5.us-east-1.rds.amazonaws.com`
- DB_USER=`admin`
- DB_PASS=`password`
- DB_NAME=`innodb`

## Env Variables

The above variables need to be in your .env. Also, this one:
- AUTH_SECRET=`fzdxjfhkdkaslaLDSHD87893h`

## How To Run This App
- clone this repo
- `cd ml_server`
- `yarn install`
- `yarn start`


## File Structure

#### /src

The src folder has three main sections:    
1. `Controllers` folder. Holds controllers for the following tables:     
  1. `lease`.  
  2. `property`.  
  3. `rating`.  
  4. `unit`.  
  5. `transaction`.  
  6. `user`.  
2. `Middleware` folder. Contains JWT auth logic     
3. `Router.js` and `Server.js`. Contain server startup and routes for controllers.    


#### /static

The static folder contains `style.css`   

#### /Root

The root directory contains the following relevant loose files:    

1. `create_tables.sql`: SQL script with database engineering, triggers, scheduled events, and stored procedures.    
2. `package.json`, `yarn.lock`: Contain dependencies.    
