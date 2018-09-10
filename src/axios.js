import axios from 'axios'
import store from './store/store'
import router from './router'

// axios 配置
axios.defaults.timeout = 5000;
// 全局设置自定义headers
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("currentUser_token");

axios.defaults.baseURL = 'http://localhost:8080/';

// http request 拦截器
/*axios.interceptors.request.use(
    config => {
        if (store.state.token) {
            config.headers.Authorization = `token ${store.state.token}`;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    });*/

// http response 拦截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        // if (error.response) {
        //     switch (error.response.status) {
        //         case 401:
        //             // 401 清除token信息并跳转到登录页面
        //             store.commit('users/clearUser');
        //             router.replace({
        //                 path: '/',
        //                 query: {redirect: router.currentRoute.fullPath}
        //             });
        //             break;
        //         case 403:
        //             // 403 无权限，跳转到首页
        //             router.replace({
        //                 path: '/base/welcome',
        //                 query: {redirect: router.currentRoute.fullPath}
        //             });
        //             break;
        //     }
        // }
        // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
        /*return Promise.reject(error.response.data)*/
        return Promise.reject('');
    });

export default axios;