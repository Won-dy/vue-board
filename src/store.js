import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
    // 프로젝트에서 공통으로 사용할 변수를 정의
    // 각 컴포넌트에서 동일한 값을 사용 가능
    state: {
        user: null,
        // ,accessToken: jwt.getToken(),
        accessToken: 'jwt',
        loggedIn: false,
        cnt: 0
    },
    // state를 변경시키는 역할, 동기처리
    // commit('함수명', '전달인자')
    mutations: {
        SET_USER_DATA(state, userData) {
            state.user = userData;
            localStorage.setItem('user', JSON.stringify(userData));
            axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`
        },
        loginSuccess: function (state, payload) {
            state.loggedIn = true
        },
        changeCnt: function (state, payload) {
            state.cnt = state.cnt + 2;
        },
        saveToken: function (state, payload) {
            state.accessToken = payload
        }
    },
    // Mutations를 실행시키는 역할, 비동기처리
    // 실행: dispatch('함수명', '전달인자') ex) dispatch('함수명', '전달인자', {root:true})
    actions: {
        changeCnt: function (context) {
            return context.commit('changeCnt');
        },
        loginSuccess: function (context) {
            return context.commit('loginSuccess');
        },


        register({ commit }, credentials) {
            return axios.post('https://jssampletest.herokuapp.com/api/auth/login', credentials).then(
                ({ data }) => {
                    commit('SET_USER_DATA', data);
                })
        }
    },
    getters: {
        getLoggedIn: function (state) {
            return state.loggedIn
        }
    }
})