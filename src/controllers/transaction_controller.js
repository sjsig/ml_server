export const getUserTransactionHistory = (req, res) => {
  const data = { user_id: req.params.user.id };

  global.connection.query(`SELECT * FROM Transaction WHERE ?`, data, function (error, results, fields) {
    if (error) throw error;

    res.send({
      status: 200,
      transactions: results,
    });
  });
};

export const getUserBalance = (req, res) => {
  const data = { user_id: req.params.user.id };

  global.connection.query(`SELECT SUM(delta) AS balance FROM Transaction WHERE ?`, data, function (
    error,
    results,
    fields
  ) {
    if (error) throw error;
    res.send({
      status: 200,
      balance: results[0].balance,
    });
  });
};

export const addToBalance = (req, res) => {
  const data = { ...req.body, user_id: req.params.user.id };

  global.connection.query(`INSERT INTO Transaction SET ?`, data, function (error, results, fields) {
    if (error) throw error;
    res.send({
      status: 200,
      transaction_id: results.insertId,
    });
  });
};
