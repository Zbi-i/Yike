const connection = require('../app/database')

class fileService{
    async uploadAvatar(filename, originalname, mimetype, size, userId) {
        const statement = `INSERT INTO avatar(name, originalname, mimetype, size, user_id) VALUES(?, ?, ?, ?, ?)`
        const [result] = await connection.execute(statement, [filename, originalname, mimetype, size, userId])
        return result;
    }
    async getAvatarByUserId(userId){
        const statement = `SELECT * FROM avatar WHERE user_id = ?`
        const [result] = await connection.execute(statement, [userId])
        return result
    }
    async uploadPictrue(filename, mimetype, size, userId, momentId){
        const statement = `INSERT INTO picture(name, mimetype, size, user_id, moment_id) VALUES(?, ?, ?, ?, ?)`
        const [result] = await connection.execute(statement, [filename, mimetype, size, userId, momentId])
        return result;
    }
    async getPictureByMomentId(momentId, filename) {
        const statement = `SELECT * FROM picture WHERE moment_id = ? AND name = ?`
        const [result] = await connection.execute(statement, [momentId, filename])
        return result;
    }
}

module.exports = new fileService()