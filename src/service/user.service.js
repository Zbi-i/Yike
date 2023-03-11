const connection = require('../app/database')
const passwordHandle = require('../units/password-handle')

class UserService {
    // 用户注册
    async create(user) {
        const { username, password } = user;

        // 对用户传进来的密码进行加密存储
        const md5password = passwordHandle(password);
        
        const statement = `INSERT INTO USERS(username, password) VALUES (?, ?)`;
        const result = await connection.execute(statement, [username, md5password]);

        return result[0];
    }
    // 根据用户名获取用户信息
    async getUserByName (username) {
        const statement = `SELECT * FROM users WHERE username = ?`;
        const result = await connection.execute(statement, [username]);
        return result[0];
    }
}

module.exports = new UserService();