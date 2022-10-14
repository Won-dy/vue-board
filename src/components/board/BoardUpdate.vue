<!-- 컴포넌트의 템플릿 섹션 -->
<template>
  <div>
    <h2>{{msg}}</h2>
    <form v-on:submit.prevent="boardUpdateForm">
      <div>
        <label for="title">제목: </label>
        <input id="title" type="text" v-model="title">
      </div><br>
      <div>
        <label for="content">내용: </label>
        <textarea id="content" cols="50" rows="10" v-model="content"></textarea>
      </div>
      <br>
      <button type="submit">수정</button>
      <br>
    </form>
    <br><br>
    <router-link v-bind:to="'/board/detail/' + boardSeq">이전</router-link>
  </div>
</template>

<script>
// 컴포넌트 오브젝트
import axios from 'axios';
import { setInterceptors } from '../../common/axiosInterceptors';

export default {
  name: 'BoardUpdate',
  data() {
    return {
      msg: 'Board Update Page',
      title: '',
      content: '',
      boardSeq: 0  // 수정할 게시글 번호
    }
  },
  methods: {
    boardUpdateForm() {
      if (!this.checkInput()) return;  // 공백 체크
      var url = 'https://jssampletest.herokuapp.com/api/board/'
      var data = {
        title: this.title,
        content: this.content,
        seq: this.boardSeq
      }
      this.addHeader().put(url, data)
        .then(res => {
          console.log("게시글 수정 성공")
          console.log(res)
          alert("게시글이 수정되었습니다.")
          window.location.href = '/board/detail/' + this.boardSeq  // 글 상세 페이지로 이동
        }).catch(function (error) {
          console.log("게시글 수정 실패")
          console.log(error);
        })
    },
    getBoard() {
      var url = 'https://jssampletest.herokuapp.com/api/board/' + this.boardSeq

      this.addHeader().get(url)
        .then(res => {
          console.log("수정을 위한 게시글 조회 성공")
          var boardData = res.data.data;
          this.title = boardData.title
          this.content = boardData.content
        }).catch(function (error) {
          console.log("수정을 위한 게시글 조회 실패")
          console.log(error);
        })

    },
    checkInput() {  // 입력 값 공백 체크
      if (this.title.trim() == '' || this.content.trim() == '') {
        alert("모든 값을 입력해주세요.")
        return false
      } else {
        return true
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
    // 수정할 글 정보 조회
    this.boardSeq = this.$route.params.seq
    this.getBoard();
  }
}
</script>