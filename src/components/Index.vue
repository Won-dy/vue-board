<template>
    <!-- <div class="hello"> -->
    <div>
        <h2>{{ msg }}</h2>
        <!-- 로그인 화면으로 이동 -->
        <br>
        <a href="/login">
            LOGIN
        </a>
        <br><br>
        <a href="/signup">
            SignUp
        </a>
    </div>
</template>
  
<script>
export default {
    name: 'Index',
    data() {
        return {
            msg: 'Index Page'
        }
    }
}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
    color: #42b983;
}
</style>
  