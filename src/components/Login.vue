<!-- 컴포넌트의 템플릿 섹션 -->
<template>
  <div>
    <h2>{{msg}}</h2>
    <!-- <form v-on:submit.prevent="login"> -->
    <form v-on:submit.prevent="loginForm">
      <div>
        <label for="email">email: </label>
        <input id="email" type="text" v-model="email">
      </div>
      <div>
        <label for="password">password: </label>
        <input id="password" type="password" v-model="password">
      </div>
      <br><button type="submit">login</button><br>
    </form>
    <!-- <br><br> -->
    <!-- <a href="/main">메인</a> -->
    <!-- 회원가입 화면으로 이동 -->
    <br><br>
    <a href="/signup">아직 회원이 아니신가요?</a>
    <br><br>
    <a href="/">이전</a>
  </div>
</template>

<script>
// 컴포넌트 오브젝트
import axios from 'axios';

export default {
  name: 'Login',
  data() {
    return {
      msg: 'Login Page',
      email: '',
      password: '',
      accessToken: ''
    }
  },
  methods: {
    log(msg) {
      console.log(msg)
    },
    prt() {
      console.log(this.email)
    },
    loginForm() {
      if (!this.checkInput()) return;  // 공백 체크
      console.log(this.email, this.password);
      var url = 'https://jssampletest.herokuapp.com/api/auth/login'
      var data = {
        email: this.email,
        password: this.password
      }
      var errorMessage

      axios.post(url, data)
        .then(res => {
          console.log(res)
          if (res.data.data.hasOwnProperty('accessToken')) { // 로그인 성공

            console.log("로그인 성공")
            this.accessToken = res.data.data.accessToken
            console.log(this.accessToken)

            // 토큰을 Localstorage에 저장
            localStorage.setItem('accessToken', this.accessToken)

            // 토큰을 store에 저장
            // this.$store.commit('saveToken', this.accessToken)
            // store의 로그인 여부 변수 true로 변경
            // this.$store.dispatch('loginSuccess')
            // this.$store.accessToken = this.accessToken

            window.location.href = '/main'  // 메인 페이지로 이동

          } else {  // 로그인 실패

            console.log("로그인 실패")

            alert(res.data.data)

          }

        }).catch(function (error) {
          console.log("로그인 실패")
          console.log(error);
          console.log('==========')
          if (error.response.status == 400) {
            errorMessage = "비밀번호는 " + error.response.data.password
          } else {
            errorMessage = error.message
          }

          console.log('errorMessage', errorMessage)
          alert(errorMessage)
          console.log('error.response.data', error.response.data)

        });
    },
    checkInput() {  // 입력 값 공백 체크
      if (this.email.trim() == '' || this.password.trim() == '') {
        alert("모든 값을 입력해주세요.")
        return false
      } else {
        return true
      }
    }
    // login() {
    //   var errorMessage

    //   this.$store
    //     .dispatch('login', {
    //       email: this.email,
    //       password: this.password
    //     })
    //     //   .then(()=>{
    //     //     this.$router.push({name:'dashboard'})
    //     //   })
    //     // }
    //     .then(res => {
    //       console.log("로그인 성공")
    //       console.log(res)
    //       this.accessToken = res.data.data.accessToken
    //       console.log(this.accessToken)
    //       // window.location.href = '/main'  // 메인 페이지로 이동
    //     }).catch(function (error) {
    //       console.log("로그인 실패")
    //       console.log(error);
    //       console.log('===========')
    //       if (error.response.status == 400) {
    //         errorMessage = "비밀번호는 " + error.response.data.password
    //       } else {
    //         errorMessage = error.message
    //       }
    //       console.log(errorMessage)
    //       alert(errorMessage)
    //       console.log(error.response.data)
    //     })
    // }
  }
}
</script>