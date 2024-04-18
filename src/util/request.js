import axios from 'axios';

// 创建一个 Axios 实例
const instance = axios.create({
  baseURL: 'http://47.99.134.195:8800', // 替换为您的实际 API 基础 URL
  timeout: 5000, // 设置请求超时时间（可选）
});
// axios.defaults.headers.common['Accept-Charset'] = 'utf-8';
// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在这里添加通用请求头或进行其他请求预处理
    // config.headers.common['Content-Type'] = 'application/json'; // 添加 Content-Type 头

    // 示例：如果存在用户 token，则添加到 Authorization 头
    // const userToken = localStorage.getItem('userToken');
    // if (userToken) {
    //   config.headers.Authorization = `Bearer ${userToken}`;
    // }

    return config;
  },
  (error) => {
    // 对请求错误进行处理（如提示、日志记录等）
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error);
  },
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 在这里对响应数据进行统一处理（如解析、转换等）
    const { data } = response;
    console.log(data);
    // 示例：假设服务器返回的数据结构为 { status: 'success', data: {} }，则提取实际数据
    if (data.status === 'success') {
      return data.data;
    }

    return data;
  },
  (error) => {
  // 对响应错误进行处理（如提示、重试、跳转登录等）
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      // console.error('Response Error:', error.response.data);
      // console.error('Response Status:', error.response.status);
      // console.error('Response Headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.error('No Response Received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error Occurred:', error.message);
    }

    return Promise.reject(error);
  },
);

export default instance;