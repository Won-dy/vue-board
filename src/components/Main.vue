<!-- 컴포넌트의 템플릿 섹션 -->
<template>
  <div>
    <h2>{{ msg }}</h2>

    <!-- <p>a. {{$store.state.cnt}}</p>
    <p>store.state {{$store.state.accessToken}}</p>
    <p>localStorage. {{accessToken}}</p> -->

    로그인: {{ tokenPayload.email }}

    <button v-on:click="logout">로그아웃</button><br /><br />
    <input
      type="button"
      value="글 작성"
      onclick="location.href='/board/create'"
    />
    <input
      type="button"
      value="사용자 검색"
      onclick="location.href='/member/info'"
    /><br /><br />
    <hr />

    <!-- 게시글 전체 검색 -->
    <form v-on:submit.prevent="getBoardAll(true)">
      <!-- <label for="page">Page: </label> -->
      <!-- <input id="page" type="number" v-model="page" disabled> -->

      <label for="size">Size: </label>
      <input id="size" type="number" v-model="size" />

      <label for="title">제목: </label>
      <input id="title" type="text" v-model="title" />

      <label for="content">내용: </label>
      <input id="content" type="text" v-model="content" />

      <button type="submit">검색</button><br />
    </form>
    <br />

    <p>{{ totalSize }}개의 게시물</p>
    <table align="center">
      <tr>
        <th scope="col">#</th>
        <th scope="col">제목</th>
        <th scope="col">작성자</th>
        <th scope="col">작성일시</th>
        <th scope="col">조회수</th>
      </tr>
      <tr v-for="board in boardArray">
        <td>{{ board.seq }}</td>
        <!-- <td><a href="/board/detail">{{board.title}}</a></td> -->
        <td>
          <router-link v-bind:to="'/board/detail/' + board.seq">{{
            board.title
          }}</router-link>
        </td>
        <td>{{ board.memberEmail }}</td>
        <td>{{ board.createDate }}</td>
        <td>{{ board.viewCount }}</td>
      </tr>
    </table>
    <br />

    <button v-on:click="prePaging" v-if="!isFirst">이전</button>
    <button v-on:click="prePaging" v-else disabled>이전</button>
    {{ page }}
    <button v-on:click="nextPaging" v-if="!isLast">다음</button>
    <button v-on:click="nextPaging" v-else disabled>다음</button>
    <br />
  </div>
</template>

<script>
import axios from "axios";
import { setInterceptors } from "../common/axiosInterceptors";

// 컴포넌트 오브젝트
export default {
  name: 'Main',
  data() {
    return {
      msg: 'Main Page',
      tokenPayload: {},
      accessToken: '',
      totalSize: 0, // 검색 결과 건 수
      boardArray: [],
      page: 0,
      size: 10,
      title: "",
      content: "",
      isFirst: true, // 처음 페이지 여부
      isLast: false, // 마지막 페이지 여부
    };
  },
  methods: {
    prePaging() {
      // 첫 페이지가 아니면
      if (!this.isFirst) {
        this.page -= 1;
        this.getBoardAll();
      }
    },
    nextPaging() {
      // 마지막 페이지가 아니면
      if (!this.isLast) {
        this.page += 1;
        this.getBoardAll();
      }
    },
    managePaging() {
      // 첫 페이지 여부 관리
      if (this.page == 0) {
        this.isFirst = true;
      } else {
        this.isFirst = false;
      }

      // 마지막 페이지 여부 관리
      // console.log('bl', this.boardArray.length)
      // console.log('size' ,this.size)
      if (this.boardArray.length != this.size) {
        this.isLast = true;
      } else {
        this.isLast = false;
      }
    },
    getBoardAll(isSearch) {
      if (this.size == "" || this.size < 1) {
        alert("Size 값은 1 이상 입력하세요.");
        this.size = 1;
      }

      if (isSearch) {
        this.page = 0;
      }

      var url =
        "https://jssampletest.herokuapp.com/api/board/all?page=" +
        this.page +
        "&size=" +
        this.size +
        "&title=" +
        this.title +
        "&content=" +
        this.content;

      console.log("url", url);

      var board;
      var boardArray = new Array();

      this.addHeader()
        .get(url)
        .then((res) => {
          console.log(res);
          var boardList = res.data.data.list;
          this.totalSize = boardList.length; // 게시물 개수

          var date;
          var time;

          // 게시물 정보 저장
          for (var i = 0; i < this.totalSize; i++) {
            board = new Object();
            board.seq = boardList[i].seq;
            board.title = boardList[i].title;
            board.memberEmail = boardList[i].memberEmail;
            board.createDate = boardList[i].createDate;
            board.viewCount = boardList[i].viewCount;

            board.createDate = this.$getDateTime(boardList[i].createDate);

            boardArray.push(board);
          }

          this.boardArray = boardArray;

          this.managePaging(); // 페이징 관리
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    getLoginUserInfo() {
      // 로그인 여부 store에서 가져오기
      // console.log(this.isLoggedIn)
      // console.log(this.$store.getters.getLoggedIn)

      // 로컬스토리지에서 엑세스 토큰 얻어오기
      this.accessToken = localStorage.getItem("accessToken");
      this.tokenPayload = this.$decodeToken(this.accessToken); // Token Decode
      console.log("3", this.$whyNot(3));
    },
    changeCnt() {
      // this.$store.commit('changeCnt');  // mutation
      this.$store.dispatch("changeCnt"); // action
    },
    logout() {
      console.log("logout");
      this.$removeTokenFromLocalStorage(); // 토큰 로컬스토리지에서 제거
    },
    addHeader() {
      // Header의 Authorization에 토큰 추가
      function createAxiosService() {
        const axiosService = axios.create();
        return setInterceptors(axiosService);
      }
      return createAxiosService();
    },
  },
  created() {
    this.getLoginUserInfo();
    this.getBoardAll();
    this.changeCnt();
  },
};
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