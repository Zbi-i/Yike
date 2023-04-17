const connection = require('../app/database')

class likeService {
    async create (momentId, userId){
        const statement = `INSERT INTO moment_like(moment_id, user_id) VALUES(?, ?)`
        const result = await connection.execute(statement, [momentId, userId])
        return result[0];
    }
    async remove (momentId, userId) {
        const statement = `DELETE FROM moment_like WHERE moment_id = ? AND user_id = ?`
        const result = await connection.execute(statement, [momentId, userId])
        return result;
    }
    async userIsLiek (momentId, userId) {
        const statement = `SELECT COUNT(id) AS count FROM moment_like WHERE moment_id = ? AND user_id = ?`
        const [result] = await connection.execute(statement, [momentId, userId])
        return result[0]
    }
}

module.exports = new likeService()