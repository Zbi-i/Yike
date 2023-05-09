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
                    'avatar',(SELECT JSON_OBJECT('name', a.avatar_path, 'mimetype', a.mimetype) FROM avatar a WHERE a.user_id = u.id AND a.id = u.avatar_id)
                ) user,
                (SELECT COUNT(c.id) FROM comment c WHERE c.moment_id = m.id) commentCount,
                (SELECT COUNT(ml.id) FROM moment_like ml LEFT JOIN users mlu ON ml.user_id = mlu.id WHERE ml.moment_id = m.id) likeCount,
                (SELECT JSON_ARRAYAGG(l.lable_name)
                FROM moment_lable ml 
                LEFT JOIN lable l ON ml.lable_id = l.id
                WHERE ml.moment_id = m.id
                ) lables, 
                (SELECT IF(COUNT(c.id),JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', c.id, 'content', c.content, 'commentId', c.comment_id, 'createTime', c.createAt,
                        'user', JSON_OBJECT(
                            'id', cu.id, 'avatarPath', cu.username,
                            'avatar',(SELECT JSON_OBJECT('avatarPath', a.avatar_path, 'mimetype', a.mimetype) FROM avatar a WHERE a.user_id = u.id)
                    )
                    )),JSON_ARRAY()) FROM comment c 
                LEFT JOIN users cu ON c.user_id = cu.id
                WHERE m.id = c.moment_id
                ) comments,
                (SELECT 
                    IF(mlu.id,
                        JSON_OBJECTAGG(mlu.id, JSON_OBJECT('username', mlu.username, 'id', mlu.id)),
                        JSON_OBJECT()
                    )
                FROM moment_like ml 
                LEFT JOIN users mlu ON ml.user_id = mlu.id 
                WHERE ml.moment_id = m.id
                ) likeUsers,
                (SELECT 
                    JSON_ARRAYAGG(
                            JSON_OBJECT('picturePath', p.picture_path, 'mimetype', p.mimetype)
                    ) FROM picture p WHERE p.user_id = u.id AND p.moment_id = m.id
                ) 'picture'
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
                (SELECT 
                    JSON_ARRAYAGG(
                            JSON_OBJECT('id', p.id, 'picturePath', p.picture_path, 'mimetype', p.mimetype)
                    ) FROM picture p WHERE p.user_id = u.id AND p.moment_id = m.id
                ) 'picture',
                (SELECT COUNT(*) FROM moment_like mk WHERE mk.moment_id = m.id) likeCount,
                (SELECT COUNT(c.id) FROM comment c WHERE c.moment_id = m.id) commentCount,
                JSON_OBJECT(
                    'id', u.id, 'name', u.username,
                    'avatar', (SELECT JSON_OBJECT('avatarPath', a.avatar_path, 'mimetype', a.mimetype) 
                FROM avatar a
                WHERE a.user_id = u.id AND a.id = u.avatar_id)
                ) user,
                (SELECT 
                    IF(mlu.id,
                        JSON_OBJECTAGG(mlu.id, JSON_OBJECT('username', mlu.username, 'id', mlu.id)),
                        JSON_OBJECT()
                    )
                FROM moment_like ml 
                LEFT JOIN users mlu ON ml.user_id = mlu.id 
                WHERE ml.moment_id = m.id
                ) likeUsers,
                (SELECT IF(COUNT(c.id),
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                        'content', c.content,
                        'commentId', c.id,
                            'replyComment', IF((c.comment_id),
                                JSON_OBJECT( 
                                    'id', c.comment_id,
                                    'userid', cu.id,
                                    'username', cu.username
                        ),NULL),
                        'user', JSON_OBJECT(
                            'id', cu.id, 
                            'username', cu.username)
                        )),JSON_ARRAY()) FROM comment c 
                    LEFT JOIN users cu ON c.user_id = cu.id
                    WHERE m.id = c.moment_id
                ) comments,
                (SELECT JSON_ARRAYAGG(l.lable_name)
                        FROM moment_lable ml 
                        LEFT JOIN lable l ON ml.lable_id = l.id
                        WHERE ml.moment_id = m.id
                ) lables,
                m.createAt createAt
            FROM moment m
            LEFT JOIN users u ON m.user_id = u.id
            WHERE m.is_private = 0
            ORDER BY m.createAt DESC
            limit ?, ?
        `
        const result = await connection.execute(statement, [offset, size]);
        return result;
    }
     // 获取某个用户的动态
     async userListOfClassify(userId, offset, size, Classify) {
        let whereStatement = `WHERE m.user_id = ?`
        let values = [userId, offset, size];
        if(Classify ===  'like'){
            whereStatement = `LEFT JOIN moment_like ml0 ON ml0.user_id = ?
            WHERE m.user_id = ? AND m.id = ml0.moment_id`
            values = [userId, userId, offset, size];
        } else if(Classify === 'isPrivate'){
            whereStatement = `WHERE m.user_id = ? AND m.is_private = 1`
        }
        const statement = `
            SELECT
                m.id id, m.content content,
                (SELECT 
                    JSON_ARRAYAGG(
                            JSON_OBJECT('id', p.id, 'picturePath', p.picture_path, 'mimetype', p.mimetype)
                    ) FROM picture p WHERE p.user_id = u.id AND p.moment_id = m.id
                ) 'picture',
                (SELECT COUNT(*) FROM moment_like mk WHERE mk.moment_id = m.id) likeCount,
                (SELECT COUNT(c.id) FROM comment c WHERE c.moment_id = m.id) commentCount,
                (SELECT 
                        IF(mlu.id,
                                JSON_OBJECTAGG(mlu.id, JSON_OBJECT('username', mlu.username, 'id', mlu.id)),
                                JSON_OBJECT()
                        )
                FROM moment_like ml 
                LEFT JOIN users mlu ON ml.user_id = mlu.id 
                WHERE ml.moment_id = m.id
                ) likeUsers,
                (SELECT IF(COUNT(c.id),
                    JSON_ARRAYAGG(
                            JSON_OBJECT('content', c.content,'commentId', c.id,'replyComment', IF((c.comment_id),
                                    JSON_OBJECT( 
                                            'id', c.comment_id,
                                            'userid', cu.id,
                                            'username', cu.username
                                    ),JSON_ARRAY()),'user', JSON_OBJECT(
                                        'id', cu.id, 
                                        'username', cu.username)
                    )),JSON_ARRAY()) FROM comment c 
                        LEFT JOIN users cu ON c.user_id = cu.id
                        WHERE m.id = c.moment_id
                ) comments,
                m.createAt createAt
        FROM moment m
        LEFT JOIN users u ON m.user_id = u.id
        ${whereStatement}
        ORDER BY m.createAt DESC
        limit ?, ?`
        const result = await connection.execute(statement, values);
        return result;
    }
    // 获取某个用户喜欢的动态
    async userLikeMomentList(userId, offset, size) {
        const statement = `
            SELECT
                m.id id, m.content content, u.id userId, u.username username,
                (SELECT 
                    JSON_OBJECT('id', p.id, 'picturePath', p.picture_path, 'mimetype', p.mimetype)
                FROM picture p 
                WHERE p.user_id = u.id AND p.moment_id = m.id
                LIMIT 0,1) 'picture',
                (SELECT a.avatar_path FROM avatar a WHERE u.avatar_id = a.id AND u.id = a.user_id) AS avatar,
                (SELECT COUNT(*) FROM moment_like mk WHERE mk.moment_id = m.id) likeCount
            FROM moment m
            LEFT JOIN users u ON m.user_id = u.id
            WHERE m.user_id = ?
            ORDER BY m.createAt DESC
            limit ?, ?`
        console.log(userId, offset, size)
        const result = await connection.execute(statement, [userId, offset, size]);
        return result;
    }
    // 获取一组时刻
    async yikeList(offset, size) {
        const statement = `
            SELECT
                m.id AS id,
                m.content AS content,
                u.id AS userId,
                u.username AS username,
                JSON_OBJECT(
                        'id', p.id,
                        'picturePath', p.picture_path,
                        'mimetype', p.mimetype
                ) AS picture,
                a.avatar_path AS avatar,
                COUNT(ml.moment_id) AS likeCount
            FROM moment m
            LEFT JOIN users u ON m.user_id = u.id
            LEFT JOIN picture p ON p.user_id = u.id AND p.moment_id = m.id
            LEFT JOIN avatar a ON u.avatar_id = a.id AND u.id = a.user_id
            LEFT JOIN moment_like ml ON ml.moment_id = m.id
            WHERE p.id IS NOT NULL
            GROUP BY m.id
            ORDER BY m.createAt DESC
            limit ?, ?`
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