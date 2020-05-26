/*
{
    "score" : 5,
    "rater_id" : 2,
    "text" : "She is awesome!!"
}
*/
export const createRating = (req, res) => {
    const data = {
        ...req.body,
        being_rated_id : req.params.user.id
    }
    global.connection.query('INSERT INTO Rating SET ?',
    data,
    function (error, results, fields) {
        if (error) throw error;
        res.send({ 
        status: 201,
        ratingId: results.insertId }) 
    });
}

export const getRatingByUser = (req, res) => {
    // get average rating of a user
}