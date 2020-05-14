import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs'

dotenv.config({ silent: true });

export const deleteUser = (req, res) => {
  const { userId } = req.params; 
  
  global.connection.query(`DELETE FROM user WHERE ?`, { id: userId }, 
    function (error, results, fields) {
  
    if (error) throw error;
    
    if (results.affectedRows == 1) {
      res.send({
        status: 200,
        message: 'Successful delete'
      })
    } else {
      res.send({
        status: 200,
        message: 'Invalid userId for DELETE'
      })
    }
  
})
};

export const getUser =  (req, res) => {
  const { userId } = req.params; 
  
  global.connection.query(`SELECT * FROM user WHERE ?`, { id: userId}, 
    function (error, results, fields) {
  
    if (error) throw error;
  
    res.send({
      status: 200,
      user: results[0]
    })
})
};

export const signin = (req, res, next) => {
  const { email } = req.body;

 
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
const postData = req.body


// Hash Password
const plaintextPassword = postData["password"]
const saltRounds = 10;
const salt = await bcrypt.genSalt(saltRounds)
  const hash = await bcrypt.hash(plaintextPassword, salt)
postData["password"] = hash;

global.connection.query('INSERT INTO user SET ?',
postData,
function (error, results, fields) {
  
  if (error) throw error;
  res.send({ 
    status: 201,
    token: tokenForUser(results),
    userId: results.insertId }) 
});

};

// encodes a new token for a user object
function tokenForUser({ insertId }) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: insertId, iat: timestamp }, 'sERoHpnjiCIkML0YYavhQ3Rn6QnZjvgaBUHm682r');
  //return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}
