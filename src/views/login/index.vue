<template>
  <div class="main">
    <div class="login-container">
    <div class="login">
      <div class="title">
        <span>{{ $t("login.title") }}</span>
      </div>
      <div class="list">
        <p class="name">用户名</p>
        <el-input
          prefix-icon="el-icon-user"
          :placeholder="$t('login.acctTip')"
          class="custom-input"
          v-model="loginForm.acc"
        >
        </el-input>
      </div>
      <div class="list">
        <p class="name">密码</p>
        <el-input
          prefix-icon="el-icon-unlock"
          :placeholder="$t('login.passwordTip')"
          class="custom-input"
          show-password
          v-model="loginForm.password"
        ></el-input>
      </div>
      <div class="list">
        <p class="name">验证码</p>
        <el-input
          prefix-icon="el-icon-document-checked"
          :placeholder="$t('login.veriCode')"
          class="custom-input"
          v-model="loginForm.verifyCode"
        ></el-input>
        <div  class="getCode">
          <img  @click="queryCode" ref="code_img" src="" style="width: 150px; height: 30px;" />
        </div>
      </div>
      <el-input type="hidden" ref="captchaKey_input"
                v-model="loginForm.captchaKey"
      ></el-input>
      <div class="btn">
        <button @click="handleLogin">{{$t('login.loginButton')}}</button>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import { getToken, setToken, removeToken,setUserInfo,getUserInfo } from "@/utils/persistence";

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        acc: '',
        password: '',
        captchaKey:"",
        verifyCode:""
      }
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created(){
    this.queryCode()
  },
  methods: {
    handleCommand(command){
      console.log(this.$i18n)
      this.$i18n.locale = command;
      localStorage.setItem("lang", command);
    },
    handleLogin() {
        let valid = true;
        let  data = this.loginForm;
        if (valid) {
          $http.http({
            type: "post",
            url: "login",
            data:data,
            header: {}
          }).then(data => {
              setToken(data.body.token);
              setUserInfo(data.body.userInfo)
              this.$store.dispatch("user/loadMenu")
              this.$router.push({ path: "/" });
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log('error submit!!')
          return false
        }
    },
    queryCode(){
      $http.http({
        type: "post",
        url: "getCode",
        data:{}
      }).then(d => {
        this.$refs.code_img.src=d.body.imageContent;
        this.loginForm.captchaKey= d.body.captchaKey;
      }).catch(() => {
      });
    }
  }
}
</script>

<style scoped>
    .main{
        width: 100%;
        height: 100%;
        background: url(../../assets/login1.jpg) no-repeat center center;
    background-size: 100% 100%;
    }
  .el-button--primary {
    background-color: #1f2d3d;
    border-color:#1f2d3d;
  }
  .login-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .login {
    width: 100%;
    margin: 0px auto;
    padding: 40px;
    background-color: #FFFFFF;
    opacity: 1;
    z-index: 999;
    border-radius: 15px;
  }
  .login .title {
    text-align: center;
    padding-bottom: 10px;
  }
  .login .title span {
    font-family: Arial, sans-serif; /* 设置字体 */
    font-size: 30px;
    color: #333333;
    font-weight: 600;
  }

  .login .list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 8px 0;
    position: relative;
  }
  .login .list .name {
    font-size: 14px;
    color: #999999;
    font-weight: 500;
  }
  .login .list input {
    border-radius: 3px;
    border: none;
    outline: none;
    color: #999;
    border: 1px solid #bdbdbd;
    font-size: 14px;
    line-height: 35px;
    padding: 0 10px;
    display: block;
    box-sizing: border-box;
    flex: 7;
  }

  .login .list .getCode {
      position: absolute;
      right: 0;
      bottom: 10px;
  }
  .login .list .getCode img {
    font-size: 20px;
    background: #f5f7fa;
    color: #777;
    border-radius: 4px;
    line-height: 38px;
    border: 1px solid #ccc;
    display: inline-block;
    margin-left: 20px;
    height: 40px;
    width: 80px;
    text-align: center;
    user-select: none;
    cursor: pointer;
  }

  .btn {
    display: flex;
    justify-content: flex-end;
    padding-top: 5px;
  }
  .btn button {
    font-size: 13px;
    color: #fff;
    background: #f6646b;
    border-radius: 50px;
    outline: none;
    border: none;
    line-height: 50px;
    padding: 0 30px;
    display: inline-block;
    flex: 1;
    cursor: pointer;
  }

</style>
<style>
.custom-input input {
  border: none;
  border-bottom: 1px solid #ccc;
  font-weight: bold;
  font-size: 14px;
  border-radius: 0;
}
</style>
