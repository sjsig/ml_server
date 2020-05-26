/*
{
	"market_price" : "1600.79",
	"unit_number" : "3F"
}
*/

export const createUnit = (req, res) => {
    const data = {
        ...req.body,
        property_id: req.params.propertyId
    }
    global.connection.query('INSERT INTO Unit SET ?',
    data,
    function (error, results, fields) {
        if (error) throw error;
        res.send({ 
        status: 201,
        unitId: results.insertId }) 
    });
}

export const getAllUnitsByProperty = (req, res) => {
    const { propertyId } = req.params; 
    const data = { property_id: propertyId }

    global.connection.query(`SELECT * FROM Unit WHERE ?`, 
    data, 
    function (error, results, fields) {
        if (error) throw error;
    
        res.send({
            status: 200,
            units: results
        })
    })
}


export const getUnit =  (req, res) => {
    const { unitId } = req.params; 
    const data = { unit_id: unitId }

    global.connection.query(`SELECT * FROM Unit WHERE ?`, 
    data, 
    function (error, results, fields) {
        if (error) throw error;
    
        res.send({
            status: 200,
            units: results[0]
        })
    })
};

export const deleteUnit  = (req, res) => {
    const { unitId } = req.params; 
    const data = { unit_id : unitId }
    
    global.connection.query(`DELETE FROM Unit WHERE ?`,
    data, 
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
          message: 'Invalid uitId for DELETE'
        })
      }
    
  })
}

export const updateUnit =  (req, res) => {
    const data = req.body
    const { unitId } = req.params 
        
    global.connection.query(`UPDATE Unit SET ? WHERE unit_id=${unitId}`,
    data,
    function (error, results, fields) {
        if (error) throw error;

        res.send({ 
            status: 200 }) 
        });
};