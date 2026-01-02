const db = require("../database/db");
const homepage = async (req, res) => {
    try {
        const SQL = "SELECT * FROM homepage ORDER BY id DESC;";
        const [rows] = await db.promise().query(SQL);

        res.json({
            message:"Get successully!",
            data: rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};
const create = async (req, res) => {
    try {
    const {category_en , category_kh , description_en , description_kh ,icon_path , img ,
            logo , year ,type
     } = req.body;
    const SQL =`INSERT INTO homepage (category_en , category_kh , description_en , description_kh ,icon_path , img ,logo , year ,type )
    VALUES (? , ? , ? , ? , ? , ? , ? , ? , ?  );
    ` ;
     await db.promise().query(SQL , [
      category_en,
      category_kh,
      description_en,
      description_kh,
      icon_path,
      img,
      logo,
      year,
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
    const { category_en, category_kh, description_en, description_kh,
            icon_path, img, logo, year, type } = req.body;
    const { id } = req.params;

    const SQL = `
      UPDATE homepage SET
      category_en=?, category_kh=?, description_en=?, description_kh=?,
      icon_path=?, img=?, logo=?, year=?, type=?
      WHERE id=?
    `;

    const [result] = await db.promise().query(SQL, [
      category_en, category_kh, description_en, description_kh,
      icon_path, img, logo, year, type, id
    ]);

    res.json({ message: "Update successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const SQL = "DELETE FROM homepage WHERE id=?";

    await db.promise().query(SQL, [id]);

    res.json({ message: "Delete successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const seacrh = async (req, res) => {
  try {
     const keyword = req.query.keyword;
    const sql = `
    SELECT * FROM homepage
    WHERE type LIKE ?
  `;
    const value = `%${keyword}%`;
    db.query(sql, [value] , (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
    homepage,
    create,
    update,
    remove,
    seacrh
};
