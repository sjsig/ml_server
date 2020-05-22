export const getUserTransactionHistory =  (req, res) => {
    const data = { tenant_id : req.params.user.id }

    global.connection.query(`SELECT * FROM transaction WHERE ?`, 
    data, 
    function (error, results, fields) {
        if (error) throw error;
    
        res.send({
            status: 200,
            transactions: results
        })
    })
};