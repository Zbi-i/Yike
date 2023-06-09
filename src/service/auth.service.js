const connection = require('../app/database')

class authService {
    async checkPermission (tableName, commentId, userId){
        try {
            const statement = `SELECT * FROM ${tableName} WHERE id = ? AND user_id = ?`
            const [result] = await connection.execute(statement, [commentId, userId])
            return result.length === 0 ? false : true
        } catch (error) {
            console.log(error)
        }
        
    }
}

module.exports = new authService()