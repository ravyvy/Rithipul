const db = require("../database/db");

const getlist = async (req, res) => {
    try {
        const SQL = "SELECT * FROM team ORDER BY id DESC;";
        // Execute query
        const [rows] = await db.promise().query(SQL);
        // Send JSON response
        res.json({
            data: rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};
const create = async (req, res) => {
    try {
    const {full_name , full_name_kh , position_name , position_kh , image_url , facebook_link , linkedin_link , type} = req.body;
    const SQL =`INSERT INTO team (full_name , full_name_kh , position_name , position_kh , image_url , facebook_link , linkedin_link , type)
    VALUES (? , ? , ? , ? , ? , ? , ? , ?);
    ` ;
    await db.promise().query(SQL,[
        full_name,
        full_name_kh,
        position_name,
        position_kh,
        image_url,
        facebook_link,
        linkedin_link,
        type
    ]);
    res.status(201).json({
    message: "Created successfully"
    });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};
const update = async (req, res) => {
    try {
        const {full_name , full_name_kh , position_name , position_kh , image_url , facebook_link , linkedin_link , type} = req.body;
        const {id} = req.params;
        const SQL = `UPDATE team SET full_name = ? , full_name_kh =?  , position_name =? , position_kh = ?  , image_url =? , facebook_link =? , linkedin_link =?  , type =? 
        WHERE id = ?
        `;
        const params = [full_name , full_name_kh , position_name , position_kh , image_url , facebook_link , linkedin_link , type , id];
        await db.promise().query(SQL , params ,( err , data) => {
            if(data){
                res.json({
                    message:"Update successfully!"
                })
            }else{
                res.status(500).json({
                    err:err.message
                })
            }
        })
       
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};
const remove = async (req, res) => {
    try {
       const {id} = req.params;
       const SQL = `DELETE FROM team WHERE id = ?`;
       const params = [id];
       await db.promise().query(SQL , params , (err , data ) => {
            if(data){
                message:"Delete successfully!";
            }else{
                res.status(500).json({
                    err:err.message
                })
            }
       })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

const seacrhTeam = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const sql = `
    SELECT * FROM team
    WHERE type LIKE ?
  `;
    const value = `%${keyword}%`;
    db.query(sql, [value] , (err, result) => {
        if (err)
         return res.status(500).json(err);
        res.json(result);
      });
      
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
    getlist,
    create,
    update,
    remove,
    seacrhTeam
}