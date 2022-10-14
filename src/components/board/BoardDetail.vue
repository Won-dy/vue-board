<!-- 컴포넌트의 템플릿 섹션 -->
<template>
    <div>
        <h2>{{msg}}</h2>
        <button v-on:click="editBoard" v-if="isWriter">수정</button>
        <button v-on:click="deleteBoard" v-if="isWriter">삭제</button><br>
        <!-- <input type="button" value="삭제" onclick="location.href='/main'" /> -->

        <table id="boardTable" align="center">
            <!-- <tr>
                <th scope="col">글 번호</th>
                <th scope="col">작성일</th>
                <th scope="col">수정일</th>
                <th scope="col">조회수</th>
                <th scope="col">작성자</th>
                <th scope="col">제목</th>
                <th scope="col">내용</th>
            </tr>
            <tr>
                <td>{{boardSeq}}</td>
                <td>{{createDate}}</td>
                <td>{{updateDate}}</td>
                <td>{{viewCount}}</td>
                <td>{{memberEmail}}</td>
                <td>{{title}}</td>
                <td>{{content}}</td>
            </tr> -->
            <tr>
                <th scope="col">글 번호</th>
                <td>{{boardSeq}}</td>
            </tr>
            <tr>
                <th scope="col">작성일</th>
                <td>{{createDate}}</td>
            </tr>
            <tr>
                <th scope="col">수정일</th>
                <td>{{updateDate}}</td>
            </tr>
            <tr>
                <th scope="col">조회수</th>
                <td>{{viewCount}}</td>
            </tr>
            <tr>
                <th scope="col">작성자</th>
                <td>{{memberEmail}}</td>
            </tr>
            <tr>
                <th scope="col">제목</th>
                <td>{{title}}</td>
            </tr>
            <tr>
                <th scope="col">내용</th>
                <td>{{content}}</td>
            </tr>
        </table>
        <br>
        <p>{{replySize}}개의 댓글</p>
        <table id="replyTable" align="center">
            <tr>
                <th scope="col">댓글 번호</th>
                <th scope="col">작성자</th>
                <th scope="col">내용</th>
                <th scope="col">작성일</th>
                <th scope="col">수정일</th>
                <th scope="col">#</th>
            </tr>
            <tr v-for="reply in replyArray">
                <td>{{reply.seq}}</td>
                <td>{{reply.memberEmail}}</td>
                <td>{{reply.content}}</td>
                <td>{{reply.createDate}}</td>
                <td>{{reply.updateDate}}</td>
                <td>
                    <!-- 댓글 작성자이거나 어드민인 경우 수정, 삭제 버튼 노출 -->
                    <button v-if="reply.memberEmail == tokenPayload.email || tokenPayload.auth == 'ROLE_ADMIN'"
                        v-on:click="editReply(reply.seq, reply.content)">수정</button>
                    <button v-if="reply.memberEmail == tokenPayload.email || tokenPayload.auth == 'ROLE_ADMIN'"
                        v-on:click="deleteReply(reply.seq)">삭제</button>
                </td>
            </tr>
        </table>

        <br><br>

        <!-- 댓글 수정 -->
        <form v-if="isReplyEditMode" v-on:submit.prevent="updateReply">
            <label for="reply">내용: </label>
            <textarea id="reply" cols="100" rows="3" v-model="replyContent"></textarea>
            <button type="submit">수정</button><br>
        </form>
        <!-- 댓글 등록 -->
        <form v-else v-on:submit.prevent="createReply">
            <label for="reply">내용: </label>
            <textarea id="reply" cols="100" rows="3" v-model="replyContent"></textarea>
            <button type="submit">등록</button><br>
        </form>
        <br><br>

        <input type="button" value="홈으로" onclick="location.href='/main'" /><br><br>
    </div>
</template>

<script>
import axios from "axios";
import { setInterceptors } from '../../common/axiosInterceptors';

// 컴포넌트 오브젝트
export default {
    name: 'BoardDetail',
    data() {
        return {
            msg: 'Board Detail Page',
            tokenPayload: {},
            boardData: null,
            message: '',
            boardSeq: 0,
            // seq: 0,
            title: "",
            content: "",
            viewCount: 0,
            memberEmail: "",
            createDate: "",
            updateDate: "",
            replySize: 0,
            replyArray: [],
            replyContent: "",
            editReplySeq: 0,
            isReplyEditMode: false,  // 댓글 수정인지 작성인지 여부
            isWriter: false  // 글 작성자인지 여부
        }
    },
    methods: {
        getBoard() {
            var url = 'https://jssampletest.herokuapp.com/api/board/' + this.boardSeq

            var reply
            var replyArray = new Array()

            this.addHeader().get(url)
                .then(res => {
                    var boardData = res.data.data;
                    this.boardData = boardData
                    this.message = res.data.message;
                    console.log(res);
                    console.log(res.data.message);
                    this.viewCount = boardData.viewCount
                    this.memberEmail = boardData.memberEmail
                    this.title = boardData.title
                    this.content = boardData.content
                    this.createDate = this.$getDateTime(boardData.createDate)
                    this.updateDate = this.$getDateTime(boardData.updateDate)

                    // 댓글 정보 저장
                    var replyList = boardData.replies
                    for (var i = 0; i < replyList.length; i++) {
                        if (!replyList[i].deleted) {
                            reply = new Object()
                            reply.seq = replyList[i].seq
                            reply.memberEmail = replyList[i].memberEmail
                            reply.content = replyList[i].content
                            reply.createDate = this.$getDateTime(replyList[i].createDate)
                            reply.updateDate = this.$getDateTime(replyList[i].updateDate)

                            replyArray.push(reply)
                        }
                    }
                    this.replyArray = replyArray

                    this.replySize = replyArray.length  // 댓글 개수

                    this.checkLoginUser();
                }).catch(function (error) {
                    console.log(error);
                })
        },
        editBoard() {
            window.location.href = '/board/update/' + this.boardSeq
        },
        deleteBoard() {
            var url = 'https://jssampletest.herokuapp.com/api/board/' + this.boardSeq
            this.addHeader().delete(url)
                .then(res => {
                    console.log(res)
                    if (res.data.data == null && res.data.status == 200) {
                        console.log("게시글 삭제 성공")
                        alert("게시글 삭제 성공")
                        window.location.href = '/main'  // 메인 페이지로 이동
                    } else {
                        console.log("게시글 삭제 실패")
                        alert("존재하지 않는 게시글\n" + res.data.data)
                    }
                }).catch(function (error) {
                    console.log("게시글 삭제 실패")
                    console.log(error);
                    console.log('===========')
                    console.log(error.message)
                    alert(error.message)
                })
        },
        editReply(seq, content) {
            this.editReplySeq = seq
            this.replyContent = content
            this.isReplyEditMode = true
        },
        updateReply() {
            if (!this.checkInput()) return;  // 공백 체크
            var url = 'https://jssampletest.herokuapp.com/api/board/reply'
            var data = {
                seq: this.editReplySeq,
                content: this.replyContent
            }

            this.addHeader().put(url, data)
                .then(res => {
                    console.log(res)
                    if (res.data.data == null && res.data.status == 200) {
                        console.log("댓글 수정 성공")
                        alert("댓글 수정 성공")
                        // window.location.href = '/board/detail/' + this.boardSeq  // 글 상세 페이지로 이동
                        this.isReplyEditMode = false  // 댓글 수정모드 해제
                        this.replyContent = ''  // 작성칸 지우기
                        this.getBoard();  // 갱신
                    } else {
                        console.log("댓글 수정 실패")
                        alert("존재하지 않는 댓글\n" + res.data.data)
                    }
                }).catch(function (error) {
                    console.log("댓글 수정 실패")
                    console.log(error);
                    alert(error.message)
                })

        },
        deleteReply(seq) {
            var url = 'https://jssampletest.herokuapp.com/api/board/reply/' + seq
            this.addHeader().delete(url)
                .then(res => {
                    console.log(res)
                    if (res.data.data == null && res.data.status == 200) {
                        console.log("댓글 삭제 성공")
                        alert("댓글 삭제 성공")
                        // window.location.href = '/board/detail/' + this.boardSeq  // 글 상세 페이지로 이동
                        this.getBoard();  // 갱신
                    } else {
                        console.log("댓글 삭제 실패")
                        alert("존재하지 않는 댓글\n" + res.data.data)
                    }
                }).catch(function (error) {
                    console.log("댓글 삭제 실패")
                    console.log(error);
                    alert(error.message)
                })
        },
        createReply() {
            if (!this.checkInput()) return;  // 공백 체크
            var url = 'https://jssampletest.herokuapp.com/api/board/reply'
            var data = {
                boardSeq: this.boardSeq,
                content: this.replyContent
            }

            console.log('data', data)

            this.addHeader().post(url, data)
                .then(res => {
                    console.log("댓글 등록 성공")
                    console.log(res)
                    alert("댓글이 등록되었습니다.")

                    this.replyContent = ''
                    this.getBoard();  // 댓글 갱신
                    // window.location.href = '/main'  // 메인 페이지로 이동
                }).catch(function (error) {
                    console.log("댓글 등록 실패")
                    console.log(error);
                    alert(error.message)
                })
            console.log("createReply")
        },
        getLoginUserInfo() {
            // 로컬스토리지에서 엑세스 토큰 얻어오기
            this.accessToken = localStorage.getItem('accessToken')
            this.tokenPayload = this.$decodeToken(this.accessToken)  // Token Decode
            console.log('tokenPayload', this.tokenPayload)

        },
        checkLoginUser() {
            // 글 작성자인지 확인
            if (this.tokenPayload.email == this.memberEmail) {
                this.isWriter = true
                console.log("작성자입니다.")
            } else {
                console.log("작성자가 아닙니다.")
            }

            console.log(this.tokenPayload.email)
            console.log(this.memberEmail)
        },
        checkInput() {  // 입력 값 공백 체크
            if (this.replyContent.trim() == '') {
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
        this.boardSeq = this.$route.params.seq  // 게시글 번호 얻어오기
        this.getBoard();  // 게시글 조회
        this.getLoginUserInfo();  // 토큰으로부터 로그인한 사용자 정보 얻어오기
        // this.checkLoginUser();    // 로그인한 사용자가 글, 댓글 작성자인지 확인
    }
}
</script>

<style>
th,
td {
    height: 50px;
    text-align: center;
    border: 1px solid #000;
}

#boardTable td {
    width: 630px;
}

/* #boardTable tr {
    display: block;
    float: left;
}

#boardTable th,
#boardTable td {
    display: block;
} */
</style>