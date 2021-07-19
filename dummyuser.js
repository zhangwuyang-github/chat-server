const c_users = [];

/**
 * 添加新聊天用户
 */
const join_user = (id, username, room) => {
    const p_user = { id, username, room }

    c_users.push(p_user)
    console.log(c_users, 'users')

    return p_user
}
/**
 * 获取当前用户索引
 */
const get_current_user = (id) => {
    return c_users.find((p_user) => p_user.id === id)
}
/**
 * 用户离线后剔除离线用户
 */
const user_disconnect = (id) => {
    const index = c_users.findIndex((p_user) => p_user.id === id)

    if (index !== -1) {
        return c_users.splice(index, 1)[0]
    }
}

module.exports = {  join_user, get_current_user, user_disconnect }
