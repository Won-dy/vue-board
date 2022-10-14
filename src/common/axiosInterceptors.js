import axios from "axios";

export function setInterceptors(axiosService) {

    // 요청을 보내기 전 Header의 Authorization에 accessToken 추가
    axiosService.interceptors.request.use(function (config) {
        console.log("setInterceptors")
        // 요청을 보내기 전에 처리
        const token = localStorage.getItem('accessToken');  //api 요청시 토큰키 값 넣어서 요청
        config.headers.Authorization = "Bearer " + token;  // 헤더에 토큰 추가

        // 토큰 검증
        var url = 'https://jssampletest.herokuapp.com/api/auth/check'

        axios.post(url, token)
            .then(res => {
                console.log('res', res)
                if (res.data.data.hasOwnProperty('accessToken')) {
                    console.log("토큰 체크 성공")
                    // alert("토큰 체크 성공")
                } else {
                    console.log("토큰 체크 실패")
                    alert("유효하지 않은 토큰입니다. 재로그인이 필요합니다.")
                    localStorage.removeItem("accessToken")  // 로컬스토리지에서 토큰 제거
                    window.location.href = '/login';
                }
            }).catch(function (error) {
                console.log("토큰 체크 실패")
                console.log(error);
                alert("유효하지 않은 토큰입니다. 재로그인이 필요합니다.\n" + error.message)
                localStorage.removeItem("accessToken")  // 로컬스토리지에서 토큰 제거
                window.location.href = '/login';
            })


        return config;
    }, function (error) {
        // 요청이 잘못되었을 때 에러가 컴포넌트 단으로 오기 전에 처리
        return Promise.reject(error);
    });

    // 서버에 요청을 보내고 나서 응답을 받기 전 토큰 유효성 검사
    axiosService.interceptors.response.use(function (response) {
        // 서버에 요청을 보내고 나서 응답을 받기 전 처리
        if (401 === response.status) {
            console.log("유효하지 않은 토큰")
            alert("유효하지 않은 토큰입니다. 재로그인이 필요합니다.")
            localStorage.removeItem("accessToken")  // 로컬스토리지에서 토큰 제거
            window.location.href = '/login';
        }

        return response;
    }, function (error) {
        if (error.hasOwnProperty('response')) {
            const response = error.response;
            if (401 === response.status) {
                console.log("유효하지 않은 토큰")
                alert("유효하지 않은 토큰입니다. 재로그인이 필요합니다.")
                localStorage.removeItem("accessToken")  // 로컬스토리지에서 토큰 제거
                window.location.href = '/login';
            }
        }
        // 응답이 에러인 경우에 미리 전처리
        return Promise.reject(error);
    });

    return axiosService;
}


// export function authToken(axiosService) {
// }
