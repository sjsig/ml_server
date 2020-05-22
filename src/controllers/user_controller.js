import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import util from 'util'

dotenv.config({ silent: true });

export const deleteUser = (req, res) => {
  const { userId } = req.params;

  global.connection.query(`DELETE FROM user WHERE ?`, { id: userId }, function (error, results, fields) {
    if (error) throw error;

    if (results.affectedRows == 1) {
      res.send({
        status: 200,
        message: "Successful delete",
      });
    } else {
      res.send({
        status: 200,
        message: "Invalid userId for DELETE",
      });
    }
  });
};

export const getUser = (req, res) => {
  const { userId } = req.params;

  global.connection.query(`SELECT * FROM user WHERE ?`, { id: userId }, function (error, results, fields) {
    if (error) throw error;

    res.send({
      status: 200,
      user: results[0],
    });
  });
};

/*
Example postData:

{
  "first_name": "Teddy",
  "last_name" : "Wahle",
  "username": "teddywahle",
  "password": "password",
  "age": "21",
  "gender" : "male",
  "account_balance": 2000,
  "is_tenant": false, 
  "is_landlord": true
}
*/
export const signup = async (req, res, next) => {
  const postData = req.body;

  let hashedPassword = await bcrypt.hash(postData.password, 10);
  postData["password"] = hashedPassword;

  global.connection.query("INSERT INTO user SET ?", postData, async function (error, results, fields) {
    if (error) throw error;
  
    const timestamp = new Date().getTime();
    global.connection.query(`SELECT * FROM user WHERE ?`, { id : results.insertId }, 
    function (error, users, fields) {
      if (error) throw error;
      const userInfo = { userId : users[0].id }
      const token = jwt.sign({ ...userInfo, iat: timestamp }, process.env.AUTH_SECRET);


      res.send({
        status: 201,
        userId: userInfo.userId,
        token,
      });
    });
    
  });
};

/* 
Example postData:
{
  username: 'teddywahle',
  password: 'password'
}
*/
export const signin = async (req, res, next) => {
  const postData = req.body;
  const username = postData.username
  global.connection.query(`SELECT * FROM user WHERE ?`, 
  { username }, 
  function (error, results, fields) {
    if (error) throw error;
    const user_data = results[0]
    const timestamp = new Date().getTime();

  bcrypt.compare(postData.password, user_data.password)
      .then((isMatch) => {
        if (isMatch) {
          res.send({
            status: 201,
            token:  jwt.sign({ ...user_data, iat: timestamp }, process.env.AUTH_SECRET),
            userId: user_data.id,
          });
        } else if (!user_data) {
          res.send({
            status: 400,
            message: "That username is incorrect",
          });
        } else {
          res.send({
            status: 400,
            message: "That password is incorrect",
          });
        }
        })
        .catch((error) => {
          console.log("Heres an error")
          console.log(error)
          res.send({
            status: 400,
            message:error,
          });
        })
      })
      
  
};