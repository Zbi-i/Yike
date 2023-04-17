const connection = require('../app/database')

class lableService  {
    async create (name){
        const result = await this.getLableByName(name)
        const lableIsExists = result.length == 0 ? true : false
        if(lableIsExists){
            const statement = `INSERT INTO lable(lable_name) VALUES(?)`
            const [result] = await connection.execute(statement, [name])
            return result
        } else {
            return result
        }
    }
    async getLableByName (name){
        const statement = `SELECT * FROM lable WHERE lable_name = ?`
        const [result] = await connection.execute(statement, [name])
        return result
    }

    async getLables(offset, limit){
        const statement = `SELECT * FROM lable LIMIT ?,?`
        const [result] = await connection.execute(statement, [offset, limit])
        return result
    }
}

module.exports = new lableService();