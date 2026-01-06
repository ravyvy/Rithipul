const db = require("../database/db");

// ================== GET LIST ==================
const getlist = async (req, res) => {
    try {
        const SQL = "SELECT * FROM jobs ORDER BY id DESC "; // changed table name
        const [rows] = await db.promise().query(SQL);
        res.json({ data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

// ================== CREATE ==================
const create = async (req, res) => {
    try {
        const {
        titleheader_en,
        titleheader_kh,
        whychoose_en,
        whychoose_kh,
        careersds_en,
        careersds_kh,
        openposition_en,
        openposition_kh,
        title_en,
        title_kh,
        close_date,
        types,
        department,
        location,
        urgent,
        apply_link,
        image_url,
        created_at,
        updated_at,
        type
        } = req.body;

        const SQL = `
    INSERT INTO jobs (
        titleheader_en,
        titleheader_kh,
        whychoose_en,
        whychoose_kh,
        careersds_en,
        careersds_kh,
        openposition_en,
        openposition_kh,
        title_en,
        title_kh,
        close_date,
        types,
        department,
        location,
        urgent,
        apply_link,
        image_url,
        created_at,
        updated_at,
        type
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ? , ?)
        `;

        await db.promise().query(SQL, [
            titleheader_en,
        titleheader_kh,
        whychoose_en,
        whychoose_kh,
        careersds_en,
        careersds_kh,
        openposition_en,
        openposition_kh,
        title_en,
        title_kh,
        close_date,
        types,
        department,
        location,
        urgent,
        apply_link,
        image_url,
        created_at,
        updated_at,
        type
        ]);

        res.status(201).json({ message: "Created successfully" });
    } catch (err) {
        console.error("DB ERROR:", err.sqlMessage || err);
        res.status(500).json({ error: "Create error" });
    }
};

// ================== UPDATE ==================
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const {
        titleheader_en,
        titleheader_kh,
        whychoose_en,
        whychoose_kh,
        careersds_en,
        careersds_kh,
        openposition_en,
        openposition_kh,
        title_en,
        title_kh,
        close_date,
        types,
        department,
        location,
        urgent,
        apply_link,
        image_url,
        created_at,
        updated_at,
        type
        } = req.body;

          const SQL = `
                UPDATE jobs 
                SET  
                    titleheader_en = ?,
                    titleheader_kh = ?,
                    whychoose_en = ?,
                    whychoose_kh = ?,
                    careersds_en = ?,
                    careersds_kh = ?,
                    openposition_en = ?,
                    openposition_kh = ?,
                    title_en = ?, 
                    title_kh = ?,
                    close_date = ?,
                    types = ?,
                    department = ?,
                    location = ?,
                    urgent = ?,
                    apply_link = ?, 
                    image_url = ?,
                    created_at = ?,
                    updated_at = ?,
                    type = ?
                WHERE id = ?
                `;

        const [result] = await db.promise().query(SQL, [
             titleheader_en,
        titleheader_kh,
        whychoose_en,
        whychoose_kh,
        careersds_en,
        careersds_kh,
        openposition_en,
        openposition_kh,
        title_en,
        title_kh,
        close_date,
        types,
        department,
        location,
        urgent,
        apply_link,
        image_url,
        created_at,
        updated_at,
        type,
        id
        ]);

        if (result.affectedRows > 0) {
            res.json({ message: "Updated successfully!" });
        } else {
            res.status(404).json({ message: "Record not found!" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

// ================== DELETE ==================
const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const SQL = "DELETE FROM jobs WHERE id = ?"; // changed table name
        const [result] = await db.promise().query(SQL, [id]);

        if (result.affectedRows > 0) {
            res.json({ message: "Deleted successfully!" });
        } else {
            res.status(404).json({ message: "Record not found!" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};
const search = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        const sql = `
    SELECT * FROM jobs
    WHERE type LIKE ?
  `;
        const value = `%${keyword}%`;
        db.query(sql, [value], (err, result) => {
            if (err) return res.status(500).json(err);
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
    search,
};
