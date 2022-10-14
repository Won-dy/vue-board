<!-- 컴포넌트의 템플릿 섹션 -->
<template>
  <div>
    <h2>{{msg}}</h2>

    <!-- 사용자 검색 -->
    <form v-on:submit.prevent="getMemberInfo">
      <label for="searchEmail">검색할 사용자의 email: </label>
      <input id="searchEmail" type="text" v-model="search_email">

      <button type="submit">검색</button><br>
    </form><br>


    <!-- 사용자 수정 -->
    <div>
      <label for="seq">seq: </label>
      <input id="seq" type="text" v-model="seq" disabled>
    </div>
    <div>
      <label for="edit_email">email: </label>
      <input id="edit_email" type="text" v-model="email" disabled>
    </div>
    <div>
      <label for="edit_name">name: </label>
      <input id="edit_name" type="text" v-if="isAdmin && isExistMember" v-model="name">
      <input id="edit_name" type="text" v-else v-model="name" disabled>
      <button @click="editMemberInfo" v-if="isAdmin && isExistMember" style='background-color: turquoise'>수정</button>
    </div>
    <div>
      <label for="city">city: </label>
      <input id="city" type="text" v-model=address.city disabled>
    </div>
    <div>
      <label for="street">street: </label>
      <input id="street" type="text" v-model=address.street disabled>
    </div>
    <div>
      <label for="zipcode">zipcode: </label>
      <input id="zipcode" type="text" v-model=address.zipcode disabled>
    </div>
    <!-- <div>
      <label for="authority">authority: </label>
      <input id="authority" type="text" v-model=authority>
    </div> -->
    <!-- <input id="authority" type="text" v-model="edit_authority"> -->

    <label for="authority">authority:</label>
    <select v-model="selected" id="authority" v-if="isAdmin && isExistMember">
      <option v-for="authority in authorities" v-bind:value="authority.value">
        {{ authority.text }}
      </option>
    </select>
    <select v-model="selected" id="authority" v-else disabled>
      <option v-for="authority in authorities" v-bind:value="authority.value">
        {{ authority.text }}
      </option>
    </select>
    <button v-on:click="editMemberAuth" v-if="isAdmin && isExistMember" style='background-color: turquoise'>권한
      수정</button><br><br>
    <button @click="deleteMember()" v-if="isAdmin && isExistMember" style='background-color: turquoise'>사용자
      삭제</button><br>

    <!-- <button @click="editMemberInfo" v-if="isAdmin && isExistMember" style='background-color: turquoise'>사용자 정보 수정</button> -->
    <!-- <button @click="editMemberAuth" style='background-color: burlywood'>권한 수정</button><br> -->
    <br>

    <hr>

    <!-- 사용자 전체 검색 -->
    <form v-on:submit.prevent="getMemberAll(true)">

      <!-- <label for="page">Page: </label>
      <input id="page" type="number" v-model="page"> -->

      <label for="size">Size: </label>
      <input id="size" type="number" v-model="size">

      <button type="submit">조회</button><br>
    </form><br>

    <p>{{totalSize}}건 조회</p>
    <table align="center">
      <tr>
        <th scope="col">index</th>
        <th scope="col">email</th>
        <th scope="col">name</th>
        <th scope="col">city</th>
        <th scope="col">street</th>
        <th scope="col">zipcode</th>
        <th scope="col">authority</th>
        <th scope="col" v-if="tokenPayload.auth == 'ROLE_ADMIN'">#</th>
      </tr>
      <tr v-for="member in memberArray">
        <td>{{member.seq}}</td>
        <td>{{member.email}}</td>
        <td>{{member.name}}</td>
        <!-- <td>{{member.city}}</td>
        <td>{{member.street}}</td>
        <td>{{member.zipcode}}</td> -->

        <td v-if="member.address != null">{{member.address.city}}</td>
        <td v-else>null</td>
        <td v-if="member.address != null">{{member.address.street}}</td>
        <td v-else>null</td>
        <td v-if="member.address != null">{{member.address.zipcode}}</td>
        <td v-else>null</td>
        <td>{{member.authority}}</td>
        <td v-if="tokenPayload.auth == 'ROLE_ADMIN'"><button v-on:click="deleteMember(member.email)">삭제</button></td>
      </tr>
    </table><br>

    <button v-on:click="prePaging" v-if="!isFirst">이전</button>
    <button v-on:click="prePaging" v-else disabled>이전</button>
    {{page}}
    <button v-on:click="nextPaging" v-if="!isLast">다음</button>
    <button v-on:click="nextPaging" v-else disabled>다음</button>
    <br><br><br>
    <input type="button" value="홈으로" onclick="location.href='/main'" />
  </div>
</template>

<script>
import axios from 'axios'
import { setInterceptors } from '../../common/axiosInterceptors';

// 컴포넌트 오브젝트
export default {
  name: 'MemberInfo',
  data() {
    return {
      msg: 'MemberInfo Page',
      tokenPayload: {},
      accessToken: "",
      search_email: "",

      seq: 0,
      email: "",
      name: "",
      address: {},
      city: "",
      street: "",
      zipcode: "",
      authority: "",

      page: 0,
      size: 5,
      totalSize: 0,
      memberArray: [],
      isFirst: true,  // 처음 페이지 여부
      isLast: false,  // 마지막 페이지 여부

      isExistMember: false,  // email로 검색한 사용자 존재 여부

      selected: '',
      authorities: [
        { text: '사용자', value: 'ROLE_USER' },
        { text: '관리자', value: 'ROLE_ADMIN' }
      ],
      isAdmin: false  // 관리자인지 여부

      //     seq: 2,
      //     email: "admin@email.com",
      //     name: "admin",
      //     address: {
      //         city: "제주",
      //         street: "한라",
      //         zipcode: "1234"
      //     },
      //     authority: "ROLE_ADMIN"
    }
  },
  methods: {
    prePaging() {
      // 첫 페이지가 아니면
      if (!this.isFirst) {
        this.page -= 1
        this.getMemberAll()
      }
    },
    nextPaging() {
      // 마지막 페이지가 아니면
      if (!this.isLast) {
        this.page += 1
        this.getMemberAll()
      }

    },
    managePaging() {
      // 첫 페이지 여부 관리
      if (this.page == 0) {
        this.isFirst = true
      } else {
        this.isFirst = false
      }

      // 마지막 페이지 여부 관리
      console.log('ml', this.memberArray.length)
      console.log('size' ,this.size)
      if(this.memberArray.length != this.size) {
        this.isLast = true
      } else {
        this.isLast = false
      }

    },
    search() {
      console.log(this.search_email)
    },
    getMemberInfo() {
      var url = 'https://jssampletest.herokuapp.com/api/member/?email=' + this.search_email

      this.addHeader().get(url)
        .then(res => {

          console.log(res)
          if (res.data.data == null && res.data.status == 200) {
            console.log("사용자 검색 실패")
            alert("존재하지 않는 사용자 입니다.")
            this.isExistMember = false
          }
          else {

            console.log("사용자 검색 성공")

            this.isExistMember = true

            var memberInfo = res.data.data

            console.log('memberInfo', memberInfo)

            this.seq = memberInfo.seq
            this.email = memberInfo.email
            this.name = memberInfo.name
            // this.authority = memberInfo.authority
            this.selected = memberInfo.authority

            if (memberInfo.address != null) {

              var address = new Object()
              address.city = memberInfo.address.city
              address.street = memberInfo.address.street
              address.zipcode = memberInfo.address.zipcode

              this.address = address

            }

            console.log('this.address', this.address)
          }

        }).catch(function (error) {
          console.log("사용자 검색 실패")
          console.log(error);
          console.log(error.response.data.error);
        })
    },
    getMemberAll(isSearch) {
      if (this.size == '' || this.size < 1) {
        alert("Size 값은 1 이상 입력하세요.")
        this.size = 1
      }

      if(isSearch) {
        this.page = 0
      }
      console.log('paging', "size: " + this.size + ", page:" +this.page)
      var url = 'https://jssampletest.herokuapp.com/api/member/all?page=' + this.page + '&size=' + this.size

      var member
      var memberArray = new Array()

      this.addHeader().get(url)
        .then(res => {
          console.log("사용자 전체 검색 성공")
          console.log(res)

          var memberList = res.data.data.list
          this.totalSize = memberList.length

          // url의 파라미터에서 추출한 size
          for (var i = 0; i < memberList.length; i++) {
            member = new Object()
            member.seq = memberList[i].seq
            member.email = memberList[i].email
            member.name = memberList[i].name
            member.authority = memberList[i].authority
            // console.log('member address', memberList[i].address)

            if (memberList[i].address != null) {

              var address = new Object()
              address.city = memberList[i].address.city
              address.street = memberList[i].address.street
              address.zipcode = memberList[i].address.zipcode

              member.address = address
            }

            memberArray.push(member)
          }
          this.memberArray = memberArray
          
          this.managePaging()  // 페이징 관리

        }).catch(function (error) {
          console.log("사용자 전체 검색 실패")
          console.log(error);
          // console.log(error.response.data.error);
        })

    },
    editMemberInfo() {
      var url = 'https://jssampletest.herokuapp.com/api/member/'
      var data = {
        email: this.email,
        name: this.name
      }
      
      this.addHeader().put(url, data)
        .then(res => {
          console.log(res)
          if (res.data.data == null && res.data.status == 200) {
            console.log("사용자 정보 수정 실패")
            alert("존재하지 않는 사용자입니다.")
          }
          else {
            // 성공 시 응답객체가 없음
            console.log("사용자 정보 수정 성공")
            alert("사용자 정보 수정 성공")
            this.getMemberInfo() // 정보 갱신
          }
        }).catch(function (error) {
          console.log("사용자 정보 수정 실패")
          console.log(error);
        })
    },
    editMemberAuth() {
      var url = 'https://jssampletest.herokuapp.com/api/member/auth'
      var data = {
        email: this.email,
        authority: this.selected
      }
      this.addHeader().put(url, data)
        .then(res => {
          console.log("권한 수정 성공")
          console.log(res)
          alert("권한이 수정되었습니다.")
          this.getMemberInfo() // 정보 갱신
        }).catch(function (error) {
          console.log("권한 수정 실패")
          console.log(error);
        })

    },
    deleteMember(deleteType ,email) {  // 종류 구분(지정 삭제, 리스트에서 삭제), 삭제할 email

      console.log('deleteType', deleteType)
      console.log('email', email)

      var url = 'https://jssampletest.herokuapp.com/api/member/' + this.email

      // this.addHeader().delete(url)
      //   .then(res => {

      //     if (res.data.status == 200) {
      //       console.log("사용자 삭제 실패")
      //       alert("사용자 삭제 실패\n" + res.data.data)
      //     } else {
      //       // 성공 시 응답객체가 없음
      //       console.log("사용자 삭제 성공")
      //       alert("사용자 삭제 성공")
      //       this.search_email = ""

      //       this.seq = 0
      //       this.email = ""
      //       this.name = ""
      //       this.address = {}
      //       this.selected = ''

      //     }
      //   }).catch(function (error) {
      //     console.log("사용자 삭제 실패")
      //     console.log(error);
      //     alert(error.message)
      //   })

    },
    getLoginUserInfo() {
      // 로컬스토리지에서 엑세스 토큰 얻어오기
      this.accessToken = localStorage.getItem('accessToken')
      this.tokenPayload = this.$decodeToken(this.accessToken)  // Token Decode
      console.log('tokenPayload', this.tokenPayload)
    },
    checkLoginUser() {
      // 관리자인지 확인
      if (this.tokenPayload.auth == 'ROLE_ADMIN') {
        this.isAdmin = true
        console.log("관리자입니다.")
      } else {
        this.isAdmin = false
        console.log("관리자가 아닙니다.")
      }
    },
    addHeader() {
      // Header의 Authorization에 토큰 추가
      function createAxiosService() {
        const axiosService = axios.create();
        return setInterceptors(axiosService);
      }

      return createAxiosService();
    }
  },
  created() {
    this.getMemberAll();
    this.getLoginUserInfo();
    this.checkLoginUser();
  }
}
</script>

<style>
th,
td {
  width: 100px;
  height: 50px;
  text-align: center;
  border: 1px solid #000;

  vertical-align: top;
  vertical-align: bottom;
  vertical-align: middle;
}
</style>