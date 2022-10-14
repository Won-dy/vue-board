<!-- 컴포넌트의 템플릿 섹션 -->
<template>
  <div>
    <h2>{{msg}}</h2>

    <!-- 사용자 수정 -->
    <form v-on:submit.prevent="editMemberInfo">
      <label for="email">email: </label>
      <input id="email" type="text" v-model="editEmail">
      <label for="name">name: </label>
      <input id="name" type="name" v-model="editName">
      <button type="submit">사용자 수정</button>
    </form><br>

    <!-- 사용자 권한 수정 -->
    <form v-on:submit.prevent="editMemberAuth">
      <label for="email">email: </label>
      <input id="email" type="text" v-model="editAuthEmail">
      <label for="authority">authority:</label>
      <select v-model="selected" id="authority">
        <option v-for="authority in authorities" v-bind:value="authority.value">
          {{ authority.text }}
        </option>
      </select>
      <button type="submit">권한 수정</button>
    </form><br>

    <!-- 사용자 삭제 -->
    <form v-on:submit.prevent="deleteMember">
      <label for="email">email: </label>
      <input id="email" type="text" v-model="deleteEmail">
      <button type="submit">삭제</button>
    </form><br>

  </div>
</template>

<script>
import axios from "axios";
import { setInterceptors } from '../../common/axiosInterceptors';

// 컴포넌트 오브젝트
export default {
  name: 'MemberEdit',
  data() {
    return {
      msg: 'MemberEdit Page',

      editEmail: '',
      editName: '',
      editAuthEmail: '',
      deleteEmail: '',

      selected: '',
      authorities: [
        { text: '사용자', value: 'ROLE_USER' },
        { text: '관리자', value: 'ROLE_ADMIN' }
      ]
    }
  },
  methods: {
    editMemberInfo() {
      var url = 'https://jssampletest.herokuapp.com/api/member/'
      var data = {
        email: this.editEmail,
        name: this.editName
      }
      this.addHeader().put(url, data)
        .then(res => {
          console.log("사용자 정보 수정 성공")
          console.log(res)
          alert("사용자 정보가 수정되었습니다.")
        }).catch(function (error) {
          console.log(data)
          console.log("사용자 정보 수정 실패")
          console.log(error);
        })
    },
    editMemberAuth() {
      var url = 'https://jssampletest.herokuapp.com/api/member/auth'
      var data = {
        email: this.editAuthEmail,
        authority: this.selected
      }
      this.addHeader().put(url, data)
        .then(res => {
          console.log("사용자 권한 수정 성공")
          console.log(res)
          alert("사용자 권한이 수정되었습니다.")
        }).catch(function (error) {
          console.log(data)
          console.log("사용자 권한 수정 실패")
          console.log(error);
        })

    },
    deleteMember() {
      var url = 'https://jssampletest.herokuapp.com/api/member/' + this.editAuthEmail

      this.addHeader().delete(url)
        .then(res => {
          console.log(res)

          if (res.data.data == null && res.data.status == 200) {
            console.log("사용자 삭제 성공")
            alert("사용자 삭제 성공")
            
          } else {
            console.log("사용자 삭제 실패")
            alert("사용자 삭제 실패")
          }
        }).catch(function (error) {
          console.log("사용자 삭제 실패")
          console.log(error);
          alert(error.message)
        })

    },
    addHeader() {
      // Header의 Authorization에 토큰 추가
      function createAxiosService() {
        const axiosService = axios.create();
        return setInterceptors(axiosService);
      }

      return createAxiosService();
    }
  }
}
</script>