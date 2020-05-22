/*
{
	"address" : "123 Main Street",
	"city" : "Duxbury, MA, 02332"
}
// must be logged in
*/
export const createProperty =  (req, res) => {
    const data = req.body
    data.owner_id = req.params.user.id
    console.log("here is the createProperty")
    console.log(data)

    global.connection.query('INSERT INTO property SET ?',
    data,
    function (error, results, fields) {
        if (error) throw error;
        res.send({ 
        status: 201,
        propertyId: results.insertId }) 
    });
};

/*
RES:

{
    "status": 200,
    "property": {
        "property_id": 1,
        "address": "123 Main Street",
        "city": "Duxbury, MA, 02332",
        "owner_id": 1
    }
}
*/
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

export const getAllProperties =  (req, res) => {

  const data = { owner_id : req.params.user.id}
  global.connection.query(`SELECT * FROM property WHERE ?`, 
  data, 
  function (error, results, fields) {
  
      if (error) throw error;
  
      res.send({
          status: 200,
          property: results
      })
  })
}

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


export const getVacantUnits = (req, res) => {
  
    global.connection.query(`SELECT *
    FROM unit
    LEFT JOIN property
    ON unit.property_id = property.property_id
    where unit.is_occupied = false;`, 
    {}, 
    function (error, results, fields) {
        if (error) throw error;
    
        res.send({
            status: 200,
            units: results
        })
    })
}


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