const db = require("../database/db");
const getlist = async (req, res) => {
    try {
        const SQL = "SELECT * FROM newcareers";
        // Execute query
        const [rows] = await db.promise().query(SQL);
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
        const { ntitle_en, ntitle_kh, jointeam_en, jointeam_kh, post_img, ntitledescription_en, ntitledescription_kh, description_en, description_kh, hr_description_en,
            hr_description_kh, link_video
        } = req.body;

        const SQL = `
      INSERT INTO newcareers (ntitle_en , ntitle_kh , jointeam_en, jointeam_kh, post_img , ntitledescription_en ,ntitledescription_kh, description_en ,  description_kh,  hr_description_en,
    hr_description_kh, link_video)
      VALUES (?, ?, ?, ?, ?, ? ,? ,? , ? , ? ,? ,?)
    `;

        await db.promise().query(SQL, [
            ntitle_en,
            ntitle_kh,
            jointeam_en,
            jointeam_kh,
            post_img,
            ntitledescription_en,
            ntitledescription_kh,
            description_en,
            description_kh,
            hr_description_en,
            hr_description_kh,
            link_video
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
        const { id } = req.params;
        const SQL = "UPDATE newplan SET title = ? ,  title_kh = ? , datestart=? , \`text\` = ?, text_kh = ?  WHERE id = ? ";
        const params = [title, title_kh, datestart, text, text_kh, id];
        db.query(SQL, params, (err, data) => {
            if (data) {
                res.json({
                    message: "Update successfully!"
                })
            }
            else {
                message: "Update Error!"
            }
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};
const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const SQL = "DELETE FROM newplan WHERE id = ?";
        const params = [id];
        db.query(SQL, params, (err, data) => {
            if (data) {
                res.json({
                    message: "delete successfully !"
                })
            } else {
                res.json({
                    message: "delete faild !"
                })
            }
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

module.exports = {
    getlist,
    create,
    update,
    remove,

}