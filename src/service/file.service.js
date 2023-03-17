const connection = require('../app/database')

class fileService{
    async uploadAvatar(filepath, originalname, mimetype, size, userId) {
        // 保存头像信息到数据库
        const savaStatement = `INSERT INTO avatar(avatar_path, originalname, mimetype, size, user_id) VALUES(?, ?, ?, ?, ?)`;
        const [savaResult] = await connection.execute(savaStatement, [filepath, originalname, mimetype, size, userId]);
        // 把当前的图片设为用户头像
        const updatedStatement = `UPDATE users SET avatar_id = ? WHERE id = ?`
        const avatarId = savaResult.insertId;
        console.log(avatarId)
        const updateRuslt = await connection.execute(updatedStatement, [avatarId, userId]);
        return updateRuslt;
    }
    async getAvatarByUserId(userId){
        const statement = `SELECT * FROM avatar WHERE user_id = ?`
        const [result] = await connection.execute(statement, [userId])
        return result
    }
    async uploadPictrue(filepath, mimetype, size, userId, momentId){
        const statement = `INSERT INTO picture(picture_path, mimetype, size, user_id, moment_id) VALUES(?, ?, ?, ?, ?)`
        const [result] = await connection.execute(statement, [filepath, mimetype, size, userId, momentId])
        return result;
    }
    async getPictureByMomentId(momentId) {
        const statement = `SELECT * FROM picture WHERE moment_id = ?`
        const [result] = await connection.execute(statement, [momentId])
        return result;
    }
}

module.exports = new fileService()