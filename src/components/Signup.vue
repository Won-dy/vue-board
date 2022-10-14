<!-- 컴포넌트의 템플릿 섹션 -->
<template>
  <div>
    <h2>{{msg}}</h2>
    <form v-on:submit.prevent="signupForm">
      <div>
        <label for="email">email: </label>
        <input id="email" type="text" v-model="email">
      </div>
      <div>
        <label for="password">password: </label>
        <input id="password" type="password" v-model="password">
      </div>
      <div>
        <label for="name">name: </label>
        <input id="name" type="text" v-model="name">
      </div>
      <div>
        <label for="city">city: </label>
        <input id="city" type="city" v-model="city">
      </div>
      <div>
        <label for="street">street: </label>
        <input id="street" type="street" v-model="street">
      </div>
      <div>
        <label for="zipcode">zipcode: </label>
        <input id="zipcode" type="zipcode" v-model="zipcode">
      </div>
      <br><button type="submit">회원가입</button><br>
    </form>

    <br><br>
    <a href="/login">이미 회원이신가요?</a>
    <br><br>
    <a href="/">이전</a>
    <!-- <input type="button" value="회원가입" onclick="location.href='/login'"/> -->
  </div>
</template>

<script>
// 컴포넌트 오브젝트
import axios from 'axios';

export default {
  name: 'Signup',
  data() {
    return {
      msg: 'Signup Page',
      email: '',
      password: '',
      name: '',
      city: '',
      street: '',
      zipcode: ''
    }
  },
  methods: {
    signupForm() {
      if (!this.checkInput()) return;  // 공백 체크
      var url = 'https://jssampletest.herokuapp.com/api/auth/signup'
      var data = {
        email: this.email,
        password: this.password,
        name: this.name,
        city: this.city,
        street: this.street,
        zipcode: this.zipcode
      }
      var errorMessage

      axios.post(url, data)
        .then(res => {
          console.log(res)
          if (res.data == "") {
            console.log("회원가입 성공")
            alert("회원가입 성공")
            window.location.href = '/login'  // 로그인 페이지로 이동
          } else {
            console.log("회원가입 실패")
            alert(res.data.data)
          }
        }).catch(function (error) {
          console.log(error)
          if (error.response.status == 400) {
            errorMessage = "비밀번호는 " + error.response.data.password
          } else {
            errorMessage = error.message
          }
          console.log(errorMessage)
          alert(errorMessage)
          console.log(error.response.data)
        })
    },
    checkInput() {  // 입력 값 공백 체크
      if (this.email.trim() == '' || this.password.trim() == '' || this.name.trim() == '' || this.city.trim() == '' || this.street.trim() == '' || this.zipcode.trim() == '') {
        alert("모든 값을 입력해주세요.")
        return false
      } else {
        return true
      }
    },
  }
}
</script>