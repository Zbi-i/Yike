const connection = require('../app/database')

class commentService {
    // 创建评论
    async create(userId, momentId, content) {
        const statement = `INSERT INTO  comment(user_id, moment_id, content) VALUES(?, ?, ?)`;
        const result = await connection.execute(statement,[userId, momentId, content]);
        return result[0];
    }
    // 删除评论
    async remove(commentId){
        const statement = "DELETE FROM comment WHERE id = ?";
        const result = connection.execute(statement, [commentId]);

        return result;
    }
    // 回复评论
    async reply(userId, momentId, commentId, content) {
        try {
            const statement = `INSERT INTO  comment(user_id, moment_id, comment_id, content) VALUES(?, ?, ?, ?)`;
            const result = await connection.execute(statement,[userId, momentId, commentId, content]);
            return result[0];
        } catch (error) {
            console.log(error)
        }
        
    }
}

module.exports = new commentService()