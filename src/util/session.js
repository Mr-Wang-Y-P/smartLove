import instance from '@/util/request';

export const getSessionList = (userNo) => {
    return instance.get('/session/getSessionList', { params: { userNo: userNo } })
};

export const sendMessage = (messageInfo) => {
    return instance
        .post('/session/sendMessage', messageInfo)
        .then((response) => response) // 假设 instance.post() 返回的响应包含数据在 response.data 中
        .catch((error) => {
            // console.error({message:'Error updating user:', error: error.response});
            // 可选：如果需要将原始错误对象返回给调用者，保留下面一行
            // return error;
            // 或者返回一个自定义的错误对象，如：
            return { message: error.response.data.message, error: error.response.data };
        })
}

export const addSession = (sessionInfo) => {
    return instance
        .post('/session/addSession', sessionInfo)
        .then((response) => response) // 假设 instance.post() 返回的响应包含数据在 response.data 中
        .catch((error) => {
            // console.error({message:'Error updating user:', error: error.response});
            // 可选：如果需要将原始错误对象返回给调用者，保留下面一行
            // return error;
            // 或者返回一个自定义的错误对象，如：
            return { message: error.response.data.message, error: error.response.data };
        })
}

export const getSession = (sessionNo) => {
    return instance
        .get('/session/getSession', { params: { sessionNo: sessionNo } })
        .then((response) => response) // 假设 instance.post() 返回的响应包含数据在 response.data 中
        .catch((error) => {
            // console.error({message:'Error updating user:', error: error.response});
            // 可选：如果需要将原始错误对象返回给调用者，保留下面一行
            // return error;
            // 或者返回一个自定义的错误对象，如：
            return { message: error.response.data.message, error: error.response.data };
        })
}