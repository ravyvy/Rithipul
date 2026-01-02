const db = require("../database/db");
const newplan = async (req, res) => {
    try {
        const SQL = "SELECT * FROM newplan";
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
    const { title, title_kh, datestart, text, text_kh } = req.body;

    const SQL = `
      INSERT INTO newplan (title, title_kh, datestart, \`text\`, text_kh)
      VALUES (?, ?, ?, ?, ?)
    `;

    await db.promise().query(SQL, [
      title,
      title_kh,
      datestart,
      text,
      text_kh
    ]);

    res.status(201).json({
      message: "Created successfully"
    });

  } catch (err) {
    console.error("DB ERROR:", err.sqlMessage || err);
    res.status(500).json({ error: "Create error" });
  }
};
const update = async (req, res) => {
    try {
        const { title, title_kh, datestart, text, text_kh } = req.body;
        const {id} = req.params;
        const SQL ="UPDATE newplan SET title = ? ,  title_kh = ? , datestart=? , \`text\` = ?, text_kh = ?  WHERE id = ? ";
        const params = [ title , title_kh , datestart , text , text_kh , id];
        db.query(SQL ,params , (err , data) => {
            if(data){
                res.json({
                    message:"Update successfully!"
                })
            }
            else{
                message:"Update Error!"
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
        const SQL = "DELETE FROM newplan WHERE id = ?";
        const params = [id];
        db.query(SQL , params , (err , data) => {
          if(data){
              res.json({
                message:"delete successfully !"
            })
          } else{
              res.json({
                message:"delete faild !"
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
      SELECT * FROM newplan
      WHERE title LIKE ?
         OR datestart LIKE ?
         OR title_kh LIKE ?
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
    newplan,
    create,
    update,
    remove,
    search,
}