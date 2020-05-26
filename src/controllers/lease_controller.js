/*
{
	"price_monthly" : "1600.79",
	"start_date" : "1999-05-04",
	"end_date" : "2020-05-04",

}
*/
export const createLease = (req, res) => {
  const data = {
    ...req.body,
    leasing_user_id: req.params.user.id,
    unit_id: req.params.unitId,
  };
  global.connection.query("INSERT INTO Lease SET ?", data, function (error, results, fields) {
    if (error) throw error;
    res.send({
      status: 201,
      leaseId: results.insertId,
    });
  });
};

export const getLease = (req, res) => {
  const { leaseId } = req.params;
  const data = { lease_id: leaseId };

  global.connection.query(`SELECT * FROM Lease WHERE ?`, data, function (error, results, fields) {
    if (error) throw error;

    res.send({
      status: 200,
      leases: results[0],
    });
  });
};

export const getSignedLease = (req, res) => {
  const data = { leasing_user_id: req.params.user.id };

  global.connection.query(`SELECT * FROM Lease WHERE ?`, data, function (error, results, fields) {
    if (error) throw error;

    res.send({
      status: 200,
      lease: results[0],
    });
  });
};

export const deleteLease = (req, res) => {
  const { leaseId } = req.params;
  const data = { lease_id: leaseId };

  global.connection.query(`DELETE FROM Lease WHERE ?`, data, function (error, results, fields) {
    if (error) throw error;

    if (results.affectedRows == 1) {
      res.send({
        status: 200,
        message: "Successful delete",
      });
    } else {
      res.send({
        status: 200,
        message: "Invalid uitId for DELETE",
      });
    }
  });
};

export const updateLease = (req, res) => {
  const data = req.body;
  const { leaseId } = req.params;

  global.connection.query(`UPDATE Lease SET ? WHERE lease_id=${leaseId}`, data, function (error, results, fields) {
    if (error) throw error;

    res.send({
      status: 200,
    });
  });
};
