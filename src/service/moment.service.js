const connection = require('../app/database')
const lableService = require('../service/lable.service')

class momentService {
    // 发表动态
    async create (userId, content) {
        const statement = `INSERT INTO moment(user_id, content) VALUES(?, ?)`;
        const result = await connection.execute(statement,[userId, content]);

        return result[0];
    }
    // 获取某一条动态详情
    async detail (momentId){
        const statement = `
            SELECT
                m.id id, m.content content, m.createAt createAt,
                JSON_OBJECT(
                        'id', u.id,
                        'name', u.username,
                        'avatar',(SELECT JSON_OBJECT('name', a.name, 'mimetype', a.mimetype) FROM avatar a WHERE a.user_id = u.id)
                ) user,
                (SELECT COUNT(c.id) FROM comment c WHERE c.moment_id = m.id) commentCount,
                (SELECT JSON_ARRAYAGG(l.lable_name)
                        FROM moment_lable ml 
                        LEFT JOIN lable l ON ml.lable_id = l.id
                        WHERE ml.moment_id = m.id
                ) lables, 
                (SELECT IF(COUNT(c.id),JSON_ARRAYAGG(
                    JSON_OBJECT(
                            'id', c.id, 'content', c.content, 'commentId', c.comment_id, 'createTime', c.createAt,
                            'user', JSON_OBJECT(
                                'id', cu.id, 'name', cu.username,
                                'avatar',(SELECT JSON_OBJECT('name', a.name, 'mimetype', a.mimetype) FROM avatar a WHERE a.user_id = u.id)
                            )
                    )),NULL) FROM comment c 
                    LEFT JOIN users cu ON c.user_id = cu.id
                    WHERE m.id = c.moment_id
                ) comments
            FROM moment m
            LEFT JOIN users u ON m.user_id = u.id
            WHERE m.id = ?
            GROUP BY m.id
        `
        const [result] = await connection.execute(statement, [momentId])
        return result[0];
    }
    // 获取动态列表
    async list(offset, size){
        const statement = `
            SELECT
                m.id id, m.content content,
                JSON_OBJECT(
                    'id', u.id, 'name', u.username,
                    'avatar', (SELECT JSON_OBJECT('name', a.name, 'mimetype', a.mimetype) FROM avatar a WHERE a.user_id = u.id)
                ) user,
                (SELECT 
                    JSON_ARRAYAGG(
                        JSON_OBJECT('name', p.name, 'mimetype', p.mimetype)
                    ) FROM picture p WHERE p.user_id = u.id AND p.moment_id = m.id
                ) 'picture',
                (SELECT JSON_ARRAYAGG(l.lable_name)
                    FROM moment_lable ml 
                    LEFT JOIN lable l ON ml.lable_id = l.id
                    WHERE ml.moment_id = m.id
                ) lables, 
                (SELECT COUNT(*) FROM moment_like mk WHERE mk.moment_id = m.id) likeCount,
                (SELECT COUNT(c.id) FROM comment c WHERE c.moment_id = m.id) commentCount,
                m.createAt createAt
            FROM moment m
            LEFT JOIN users u ON m.user_id = u.id
            limit ?, ?
        `
        const result = await connection.execute(statement, [offset, size]);
        return result;
    }
    // 修改动态
    async updated(momentId, content) {
        try {
            const statement = `UPDATE moment SET content = ? WHERE user_id = ?`;
            const [result] = await connection.execute(statement, [content, momentId]);
            return result;
        } catch (error) {
            console.log(error)
        }
        
    }
    // 删除动态
    async remove(momentId){
        try {
            const statement = `DELETE FROM moment WHERE id = ?`;
            const [result] = await connection.execute(statement, [momentId]);
            return result;
        } catch (error) {
            console.log(error)
        }
    }
    // 判断标签是否存在
    async lableHandle (momentId, lableId){
        const statement = `SELECT * FROM moment_lable WHERE lable_id = ? AND moment_id = ?`
        const [result] = await connection.execute(statement,[lableId, momentId])
        return result.length == 0 ? false : true
    }
    // 添加标签
    async addLable(momentId, lables){
        const statement = `INSERT INTO moment_lable(lable_id, moment_id) VALUES(?,?)`
        try {
            lables.forEach(async ele => {
                const result = await lableService.create(ele)
            });
            lables.forEach(async ele => {
                const [lable] = await lableService.getLableByName(ele)
                const lableId = lable.id;
                // 判断关系表中是否存在关系
                const lableIsExists = await this.lableHandle(momentId, lableId)
                // 如果不存在那么添加关系到到关系表
                if(!lableIsExists){
                    const result = connection.execute(statement, [lableId, momentId])
                }
            });
        } catch (error) {
            console.log(error)
            return "添加标签失败~"
        }
        return "添加标签成功~"
    }
}

module.exports = new momentService();