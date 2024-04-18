import instance from '@/util/request';

// 前端环境下获取用户信息的函数
export const getAction = () => {
    return instance.get('/action/getAction')
};
export const getUserAction = (userNo) => {
  return instance.get('/action/getUserAction',{ params: { userNo: userNo } })
};
export const getAreaAction = (userNo) => {
    return instance.get('/action/getAreaAction', { params: { userNo: userNo } })
};
export const getLoveAction = (userNo) => {
    return instance.get('/action/getLoveAction', { params: { userNo: userNo } })
};
export const getText = (actionNo) => {
    return instance.get('/action/getText', { params: { actionNo: actionNo } })
};


export const addAction =  (actionInfo) => {
    return instance
      .post('/action/addAction', actionInfo)
      .then((response) => response) // 假设 instance.post() 返回的响应包含数据在 response.data 中
      .catch((error) => {
        // console.error({message:'Error updating user:', error: error.response});
        // 可选：如果需要将原始错误对象返回给调用者，保留下面一行
        // return error;
        // 或者返回一个自定义的错误对象，如：
        return { message: error.response.data.message,error: error.response.data };
      });
  };

export const addText =  (textInfo) => {
    return instance
      .post('/action/addText', textInfo)
      .then((response) => response) // 假设 instance.post() 返回的响应包含数据在 response.data 中
      .catch((error) => {
        // console.error({message:'Error updating user:', error: error.response});
        // 可选：如果需要将原始错误对象返回给调用者，保留下面一行
        // return error;
        // 或者返回一个自定义的错误对象，如：
        return { message: error.response.data.message,error: error.response.data };
      });
  };

  export const updateLike =  (like) => {
    return instance
      .post('/action/updateLike', like)
      .then((response) => response) // 假设 instance.post() 返回的响应包含数据在 response.data 中
      .catch((error) => {
        // console.error({message:'Error updating user:', error: error.response});
        // 可选：如果需要将原始错误对象返回给调用者，保留下面一行
        // return error;
        // 或者返回一个自定义的错误对象，如：
        return { message: error.response.data.message,error: error.response.data };
      });
  };