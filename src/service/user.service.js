const connection = require('../app/database')
const passwordHandle = require('../units/password-handle')

class UserService {
    // 用户注册
    async create(user) {
        const { username, account, password } = user;
        // 对用户传进来的密码进行加密存储
        const md5password = passwordHandle(password);
        
        const statement = `INSERT INTO USERS(username, account, password) VALUES (?, ?, ?)`;
        const result = await connection.execute(statement, [username, account, md5password]);

        return result[0];
    }
    // 根据用户名获取用户信息
    async getUserByName (str, strValue) {
        try {
            const statement = `SELECT u.id AS 'id', u.username AS 'username', u.password AS 'password', a.avatar_path AS 'avatar'
                               FROM users u 
                               LEFT JOIN avatar a ON u.avatar_id = a.id 
                               WHERE u.${str} = ?`;
            const result = await connection.execute(statement, [strValue]);
            return result[0];
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new UserService();