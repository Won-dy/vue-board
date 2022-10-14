<!-- 컴포넌트의 템플릿 섹션 -->
<template>
  <div>
    <h2>{{msg}}</h2>
    <!-- 제목 <input type="text"/><br>
      내용 <textarea width="100px">게시글 내용을 작성해 주세요</textarea><br>
      <input type="button" value="글 등록" onclick="location.href='/main'"/> -->

    <form v-on:submit.prevent="boardCreateForm">
      <div>
        <label for="title">제목: </label>
        <input id="title" type="text" v-model="title">
      </div><br>
      <div>
        <label for="content">내용: </label>
        <textarea id="content" cols="50" rows="10" v-model="content">게시글 내용을 작성해 주세요</textarea>
      </div>
      <br>
      <button type="submit">등록</button>
      <br>
    </form>
    <br><br>
    <a href="/main">이전</a>
  </div>
</template>

<script>
// 컴포넌트 오브젝트
import axios from 'axios';
import { setInterceptors } from '../../common/axiosInterceptors';

export default {
  name: 'BoardCreate',
  data() {
    return {
      msg: 'Board Create Page',
      title: '',
      content: '',
      isForCreate: true,  // 글 작성이면 true, 글 수정이면 false
      boardSeq: 0  // 수정할 게시글 번호
    }
  },
  methods: {
    boardCreateForm() {
      if (!this.checkInput()) return;  // 공백 체크
      var url = 'https://jssampletest.herokuapp.com/api/board/'
      var data = {
        title: this.title,
        content: this.content
      }

      this.addHeader().post(url, data)
        .then(res => {
          console.log("게시글 등록 성공")
          console.log(res)
          alert("게시글이 등록되었습니다.")
          window.location.href = '/main'  // 메인 페이지로 이동
        }).catch(function (error) {
          console.log("게시글 등록 실패")
          console.log(error);
          alert(error.message)
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
    // var createOrEdit = this.$route.params.createoredit

    // 게시글 작성을 위해 접근
    // if (createOrEdit != "create") {
    //   console.log(createOrEdit.split('/')[1])
    //   this.boardSeq = createOrEdit.split('/')[1]  // 수정할 글 번호 저장
    //   this.isForCreate = false
    // }

    // 게시글 수정을 위해 접근
    // if (this.$route.params.createoredit == "edit") {
    //   this.isForCreate = false
    //   this.boardSeq = this.$route.params.boardseq
    // }
    // console.log(this.isForCreate)
    // console.log(this.boardSeq)
  }
}
</script>