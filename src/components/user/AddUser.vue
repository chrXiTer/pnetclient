<template>
  <el-form :rules="rules" class="login-container" label-position="left" label-width="0px" v-loading="loading">
    <h3 class="login_title">用户注册</h3>
    <el-form-item prop="username">
      <el-input type="text" v-model="fromDataInfo.username" placeholder="账户名"></el-input>
    </el-form-item>    
    <el-form-item prop="password">
      <el-input type="password" v-model="fromDataInfo.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item prop="confirmPassword">
      <el-input type="password" v-model="fromDataInfo.confirmPassword" auto-complete="off" placeholder="确认密码"></el-input>
    </el-form-item>
    <el-checkbox class="login_remember" v-model="checked" label-position="left">记住密码</el-checkbox>
    <el-form-item style="width: 100%">
      <el-button type="primary" @click.native.prevent="submitClick" style="width: 74%">完成注册</el-button>
      <el-button type="info" @click.native.prevent="toLogin" style="width: 22%">登录》</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  export default{
    data(){
      return {
        rules: {
          username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'}],
          confirmPassword: [{required: true, message: '请输入确认密码', trigger: 'blur'}]
        },
        checked: true,
        fromDataInfo: {
          username: '',
          password: '',
          confirmPassword:''
        },
        loading: false
      }
    },
    methods: {
      submitClick: function () {
        var self = this;
        this.loading = true;
        this.postRequest('/addUser', {
          username: this.fromDataInfo.username,
          password: this.fromDataInfo.password
        }).then(resp=> {
          self.loading = false;
          if (resp && resp.status == 200) {
            var data = resp.data;
            // TODO
          }
        });
      }
    }
  }
</script>
<style>
  .login-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }

  .login_remember {
    margin: 0px 0px 35px 0px;
    text-align: left;
  }
</style>
