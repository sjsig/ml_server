import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

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

const getUserByID = (user_id) => {
  global.connection.query(`SELECT * FROM user WHERE ?`, { id: user_id }, function (error, results, fields) {
    if (error) throw error;
    return results[0];
  });
};

const getUserByUsername = (username) => {
  global.connection.query(`SELECT * FROM user WHERE ?`, { username }, function (error, results, fields) {
    if (error) throw error;
    return results[0];
  });
};

/*
Example postData:

{
  first_name: 'Teddy',
  last_name : 'Wahle',
  username: 'teddywahle',
  password: 'password',
  age: '21',
  gender : 'male',
  account_balance: 2000,
  is_tenant: false, 
  is_landlord: true
}
*/
export const signup = async (req, res, next) => {
  const postData = req.body;

  let hashedPassword = await bcrypt.hash(postData.password, 10);
  postData["password"] = hashedPassword;

  global.connection.query("INSERT INTO user SET ?", postData, function (error, results, fields) {
    if (error) throw error;
    res.send({
      status: 201,
      token: tokenForUser(results.insertId), //is this asynchronous?
      userId: results.insertId,
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
  let user_data = getUserByUsername(postData.username);
  let isMatch = await bcrypt.compare(postData.password, user_data.hashed_password);
  if (isMatch) {
    res.send({
      status: 201,
      token: tokenForUser(user_data.id),
      userId: user_data.id,
    });
  } else if (!user_data) {
    res.send({
      status: 200,
      message: "That username is incorrect",
    });
  } else {
    res.send({
      status: 200,
      message: "That password is incorrect",
    });
  }
};

// encodes a new token for a user object
function tokenForUser(id) {
  const timestamp = new Date().getTime();
  let userInfo = getUserByID(id);
  return jwt.sign({ ...userInfo, iat: timestamp }, process.env.AUTH_SECRET);
}
