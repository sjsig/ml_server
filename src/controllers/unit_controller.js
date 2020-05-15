export const createUnit = (req, res) => {

}

export const getAllUnitsByProperty = (req, res) => {
    const { propertyId } = req.params; 
    const data = { property_id: propertyId }

    global.connection.query(`SELECT * FROM unit WHERE ?`, 
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

    global.connection.query(`SELECT * FROM unit WHERE ?`, 
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


}