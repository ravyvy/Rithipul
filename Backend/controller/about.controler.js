const db = require("../database/db");
const about = async (req, res) => {
    try {
        const SQL = "SELECT * FROM about";
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
    const {category_en , category_kh , description_en , description_kh , type , img_brand} = req.body;
    const SQL =`INSERT INTO about (category_en , category_kh , description_en , description_kh , type , img_brand)
    VALUES (? , ? , ? , ? , ? , ? );
    ` ;
    await db.promise().query(SQL,[
       category_en ,
       category_kh,
       description_en,
       description_kh,
       type,
       img_brand
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
        const {category_en , category_kh , description_en , description_kh , type , img_brand} = req.body;
        const {id} = req.params;
        const SQL = `UPDATE about SET category_en=? , category_kh=? , description_en=? , description_kh=? , type=? , img_brand=?
        WHERE id = ?
        `;
        const params = [category_en , category_kh , description_en , description_kh , type , img_brand, id];
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
       const SQL = `DELETE FROM about WHERE id = ?`;
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
const search = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const sql = `
      SELECT * FROM about
      WHERE category_en LIKE ?
         OR category_kh LIKE ?
         OR type LIKE ?
    `;

    const value = `%${keyword}%`;

    db.query(sql, [value, value, value], (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
    about,
    create,
    update,
    remove,
    search
}