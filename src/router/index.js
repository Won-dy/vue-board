import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

import Index from '@/components/Index'
import Login from '@/components/Login'
import Signup from '@/components/Signup'
import Main from '@/components/Main'
import BoardCreate from '@/components/board/BoardCreate'
import BoardUpdate from '@/components/board/BoardUpdate'
import BoardDetail from '@/components/board/BoardDetail'
import MemberEdit from '@/components/member/MemberEdit'
import MemberInfo from '@/components/member/MemberInfo'

Vue.use(Router)

export default new Router({
  mode: 'history', // hash모드에서 history 모드로 변경
  routes: [
    // Index(첫 화면)
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    // 로그인
    {
      path: '/login',  // url path
      name: 'Login',  // route로 연결할 때 사용하는 이름(선택)
      component: Login  // route에서 불러와질 컴포넌트
    },
    // 회원가입
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    // 메인 화면
    {
      path: '/main',
      name: 'Main',
      component: Main
    },
    // 게시글 작성
    {
      path: '/board/create',
      name: 'BoardCreate',
      component: BoardCreate
    },
    // 게시글 수정
    {
      path: '/board/update/:seq',
      name: 'BoardUpdate',
      component: BoardUpdate
    },
    // 게시글 상세
    {
      path: '/board/detail/:seq',
      name: 'BoardDetail',
      component: BoardDetail
    },
    // 사용자 정보 수정
    {
      path: '/member/edit',
      name: 'MemberEdit',
      component: MemberEdit
    },
    // 사용자 검색
    {
      path: '/member/info',
      name: 'MemberInfo',
      component: MemberInfo
    }
  ]
})
