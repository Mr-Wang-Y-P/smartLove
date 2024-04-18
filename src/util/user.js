import instance from '@/util/request';

// 前端环境下获取用户信息的函数
export const getUser =(userNo) => {
  return instance.get('/user/getUser',{params: {userNo:userNo}})
};

export const getTalkUserInfo =(userNo) => {
  return instance.get('/user/getTalkUserInfo',{params: {userNo:userNo}})
};
export const getFilterUser =(filterParams) => {
  try {
    return instance.post('/user/getFilterUser', filterParams); // 返回更新后的用户数据（如果有）
  } catch (error) {
    // console.error('Error updating user:', error);
    // throw error; // 将错误向上抛出，以便调用者处理
    return  { message: error.response.data.message,error: error.response.data };
  }
};

// 前端环境下更新用户信息的函数
export const updateUser =  (userData) => {
  try {
    return instance.post('/user/updateUser', userData); // 返回更新后的用户数据（如果有）
  } catch (error) {
    // console.error('Error updating user:', error);
    // throw error; // 将错误向上抛出，以便调用者处理
    return  { message: error.response.data.message,error: error.response.data };
  }
};

// 前端环境下登录用户信息的函数
export const Login = (userInfo) => {
  return instance
    .post('/user/Login', userInfo)
    .then((response) => response) // 假设 instance.post() 返回的响应包含数据在 response.data 中
    .catch((error) => {
      // console.error({message:'Error updating user:', error: error.response});
      // 可选：如果需要将原始错误对象返回给调用者，保留下面一行
      // return error;
      // 或者返回一个自定义的错误对象，如：
      return { message: error.response.data.message,error: error.response.data };
    });
};

export const Register =  (userInfo) => {
  return instance
    .post('/user/Register', userInfo)
    .then((response) => response) // 假设 instance.post() 返回的响应包含数据在 response.data 中
    .catch((error) => {
      // console.error({message:'Error updating user:', error: error.response});
      // 可选：如果需要将原始错误对象返回给调用者，保留下面一行
      // return error;
      // 或者返回一个自定义的错误对象，如：
      return { message: error.response.data.message,error: error.response.data };
    });
};


export const updatePaw =  (userData) => {
  try {
    return instance.post('/user/updatePaw', userData); // 返回更新后的用户数据（如果有）
  } catch (error) {
    // console.error('Error updating user:', error);
    // throw error; // 将错误向上抛出，以便调用者处理
    return  { message: error.response.data.message,error: error.response.data };
  }
};

export const addLove =  (loveInfo) => {
  return instance
    .post('/user/addLove', loveInfo)
    .then((response) => response) // 假设 instance.post() 返回的响应包含数据在 response.data 中
    .catch((error) => {
      // console.error({message:'Error updating user:', error: error.response});
      // 可选：如果需要将原始错误对象返回给调用者，保留下面一行
      // return error;
      // 或者返回一个自定义的错误对象，如：
      return { message: error.response.data.message,error: error.response.data };
    });
};

export const getUserLoved =  (userNo) => {
  return instance
    .post('/user/getUserLoved', userNo)
    .then((response) => response) // 假设 instance.post() 返回的响应包含数据在 response.data 中
    .catch((error) => {
      // console.error({message:'Error updating user:', error: error.response});
      // 可选：如果需要将原始错误对象返回给调用者，保留下面一行
      // return error;
      // 或者返回一个自定义的错误对象，如：
      return { message: error.response.data.message,error: error.response.data };
    });
};

export const getUserLove =  (userNo) => {
  return instance
    .post('/user/getUserLove', userNo)
    .then((response) => response) // 假设 instance.post() 返回的响应包含数据在 response.data 中
    .catch((error) => {
      // console.error({message:'Error updating user:', error: error.response});
      // 可选：如果需要将原始错误对象返回给调用者，保留下面一行
      // return error;
      // 或者返回一个自定义的错误对象，如：
      return { message: error.response.data.message,error: error.response.data };
    });
};

export const getUserHistory =  (userData) => {
  return instance
    .post('/user/getUserHistory', userData)
    .then((response) => response) // 假设 instance.post() 返回的响应包含数据在 response.data 中
    .catch((error) => {
      // console.error({message:'Error updating user:', error: error.response});
      // 可选：如果需要将原始错误对象返回给调用者，保留下面一行
      // return error;
      // 或者返回一个自定义的错误对象，如：
      return { message: error.response.data.message,error: error.response.data };
    });
};
export const getUserLoveList =  (userData) => {
  return instance
    .post('/user/getUserLoveList', userData)
    .then((response) => response) // 假设 instance.post() 返回的响应包含数据在 response.data 中
    .catch((error) => {
      // console.error({message:'Error updating user:', error: error.response});
      // 可选：如果需要将原始错误对象返回给调用者，保留下面一行
      // return error;
      // 或者返回一个自定义的错误对象，如：
      return { message: error.response.data.message,error: error.response.data };
    });
};

export const getUserLovedList =  (userData) => {
  return instance
    .post('/user/getUserLovedList', userData)
    .then((response) => response) // 假设 instance.post() 返回的响应包含数据在 response.data 中
    .catch((error) => {
      // console.error({message:'Error updating user:', error: error.response});
      // 可选：如果需要将原始错误对象返回给调用者，保留下面一行
      // return error;
      // 或者返回一个自定义的错误对象，如：
      return { message: error.response.data.message,error: error.response.data };
    });
};

export const updateFilter =  (filterData) => {
  try {
    return instance.post('/user/updateFilter', filterData); // 返回更新后的用户数据（如果有）
  } catch (error) {
    // console.error('Error updating user:', error);
    // throw error; // 将错误向上抛出，以便调用者处理
    return  { message: error.response.data.message,error: error.response.data };
  }
};