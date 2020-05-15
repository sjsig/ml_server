export const createProperty =  (req, res) => {
    const data = req.body
        
    global.connection.query('INSERT INTO property SET ?',
    data,
    function (error, results, fields) {
        if (error) throw error;
        res.send({ 
        status: 201,
        propertyId: results.insertId }) 
    });
};

export const getProperty =  (req, res) => {
    const { propertyId } = req.params; 
    const data = { property_id: propertyId }

    global.connection.query(`SELECT * FROM property WHERE ?`, 
    data, 
    function (error, results, fields) {
    
        if (error) throw error;
    
        res.send({
            status: 200,
            property: results[0]
        })
    })
};

export const updateProperty =  (req, res) => {
    const data = req.body
    const { propertyId } = req.params 
        
    global.connection.query(`UPDATE property SET ? WHERE property_id=${propertyId}`,
    data,
    function (error, results, fields) {
        if (error) throw error;

        res.send({ 
            status: 200 }) 
        });
};



export const deleteProperty = (req, res) => {
    const { propertyId } = req.params; 
    const data = { property_id : propertyId}
    
    global.connection.query(`DELETE FROM property WHERE ?`,
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
          message: 'Invalid propertyId for DELETE'
        })
      }
    
  })
  };