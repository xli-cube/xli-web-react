import {extend, RequestInterceptor} from 'umi-request';
import {notification} from 'antd';


const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 请求拦截器：统一处理请求参数中值为空的字段
 */
const requestInterceptor: RequestInterceptor = (url, options) => {
  if (options.method === 'post' || options.method === 'put') {
    const contentTypeHeader = options.headers ? options.headers['Content-Type'] : undefined;
    if (contentTypeHeader) {
      if (contentTypeHeader.includes('multipart/form-data')) {
        // 跳过附件上传
        return {url, options};
      }
    }


    if (options.data && Array.isArray(options.data)) {
      return {url, options};
    }
    if (options.data && typeof options.data === 'object') {
      const requestData = Object.keys(options.data).reduce((acc, key) => {
        const value = options.data[key];
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {});

      options.data = requestData;
    }
  }
  return {url, options};
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const {response} = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const {status, url} = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      message: `您的网络发生异常，无法连接到服务器`,
      description: '网络异常',
    });
  }
  return response;
};

const request = extend({
  errorHandler,
  credentials: 'include'
});

// 应用请求拦截器
request.interceptors.request.use(requestInterceptor);


export default request;

