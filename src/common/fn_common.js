export default {
    install(Vue) {
        // JWT DECODE 함수
        Vue.prototype.$decodeToken = function (token) {
            var payload = new Object()

            var decoded = require('jsonwebtoken').decode(token)

            payload.auth = decoded.auth
            payload.email = decoded.sub
            payload.exp = decoded.exp

            return payload
        };
        Vue.prototype.$setInterceptors = function (axiosService) {
            axiosService.interceptors.request.use(function (config) {
                    config.headers.Authorization = 'Bearer ' + localStorage.getItem('accessToken')
                    return config
                },
                function (error) {
                    return Promise.reject(error);
                }
            );
            
            return axiosService;
        };
        Vue.prototype.$whyNot = function (num) {
            return num
        };
        Vue.prototype.$removeTokenFromLocalStorage = function() {
            console.log("로컬스토리지에서 토큰 제거")
            localStorage.removeItem("accessToken")  // 로컬스토리지에서 토큰 제거
            window.location.href = '/login'  // 로그인 페이지로 이동
        };

        // 날짜, 시간 추출
        Vue.prototype.$getDateTime = function (str) {
            return str.split('T')[0] + ' ' + str.split('T')[1].split('.')[0]
        }
    }
}