/*
{
    "score" : 5,
    "text" : "She is awesome!!"
}
*/
export const createRating = (req, res) => {
  const data = {
    ...req.body,
    being_rated_id: req.params.landlord_id,
    rater_id: req.params.user.id,
  };
  global.connection.query("INSERT INTO Rating SET ?", data, function (error, results, fields) {
    if (error) throw error;
    res.send({
      status: 201,
      ratingId: results.insertId,
    });
  });
};

export const getRatingByUser = (req, res) => {
  // get average rating of a user
  globabl.connection.query(
    "SELECT AVG(score) AS avg_score FROM Rating WHERE being_rated_id = ?",
    [req.params.landlord_id],
    function (error, results, fields) {
      if (error) throw error;
      res.send({
        status: 200,
        avg_score: results[0].avg_score,
      });
    }
  );
};

export const getRating = (req, res) => {
  const data = {
    being_rated_id: req.params.landlord_id,
    rater_id: req.params.userId,
  };
  global.connection.query(
    "SELECT * FROM Rating WHERE being_rated_id = ? AND rater_id = ?",
    [data.being_rated_id, data.rater_id],
    function (error, results, fields) {
      if (error) throw error;
      res.send({
        status: 200,
        rating: results[0],
      });
    }
  );
};

export const editRating = (req, res) => {
  const newInfo = { ...req.body };
  const ratingInfo = {
    being_rated_id: req.params.landlord_id,
    rater_id: req.params.userId,
  };
  global.connection.query("UPDATE Rating SET ? WHERE ?", [newInfo, ratingInfo], function (error, results, fields) {
    if (error) throw error;
    res.send({
      status: 200,
      rating: results,
    });
  });
};

export const deleteRating = (req, res) => {
  const data = {
    being_rated_id: req.params.landlord_id,
    rater_id: req.params.userId,
  };
  global.connection.query(
    "DELETE FROM Rating WHERE being_rated_id = ? AND rater_id = ?",
    [data.being_rated_id, data.rater_id],
    function (error, results, fields) {
      if (error) throw error;
      res.send({
        status: 200,
        rating: results,
      });
    }
  );
};
