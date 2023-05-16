<template>
  <div class="background">
    <div class="login-container"><el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form"
        auto-complete="on" label-position="left">
        <div>
              <el-select v-model="value" placeholder="请选择" style=" width: 100px;">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>     
        </div>

        <div class="title-container">
          <h3 class="title">账户登录</h3>
        </div>

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input ref="username" v-model="loginForm.username" placeholder="Username" name="username" type="text"
            tabindex="1" auto-complete="on" />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType"
            placeholder="Password" name="password" tabindex="2" auto-complete="on" @keyup.enter.native="handleLogin" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

        <el-form-item prop="isLock">
          <slider-verify-code v-model="loginForm.isLock" @change="handlerLock" />
        </el-form-item>

        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
          @click.native.prevent="handleLogin">登录</el-button>

        <div class="forgetword">
          <a style="margin: 0px;" type="primary" @click="$router.push('/forgetpwd')">忘记密码</a>
        </div>
        <div class="forgetword">
          <a style="margin: 0px;" type="primary" @click="$router.push('/register')">还没有帐号？立即注册</a>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import sliderVerifyCode from '@/components/slider-verify-code.vue'
import Vcode from "vue-puzzle-vcode";


export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位数'))
      } else {
        callback()
      }
    }
    const checkStatus = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请拖动滑块完成验证"));
      } else {
        if (this.form.name == '' || this.form.pass == ''
          || !this.form.name || !this.form.pass) {
          setTimeout(() => {
            this.form.isLock = false;
            this.$refs.form.validateField('name');
            this.$refs.form.validateField('pass');
            return callback(new Error("验证未通过"));
          }, 1);
        }
        callback();
      }
    }
    return {
      options: [{
        value: '1',
        label: '学生端'
      }, {
        value: '2',
        label: '评委端'
      }],
      value: '2',

      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      isLock: [
        { validator: checkStatus, trigger: 'blur' },
      ],
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  components: {
    'slider-verify-code': sliderVerifyCode,
    Vcode
  },
  methods: {

    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {

      
      this.$refs.loginForm.validate(valid => {

        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then((res) => {
            
            localStorage.setItem('login', JSON.stringify(res))
            if (res.code == 200) {
              
              if (res.data.type == this.value) {
                if (res.data.type == 1)//stud
                {
                  this.$router.push({ path: '/StudentHome/StudentHome' })
                  this.loading = false
                }
                else {//comit
                  this.$router.push({ path: '/dashboard/dashboard' })
                  this.loading = false
                }
                
              }
              else {
                this.$message.error("账号密码错误！")
                this.loading = false
                this.$router.push({ path: '/StudentHome/StudentHome' })
                  this.loading = false
              }
            }
            else {

              this.loading = false
              this.$message.error(res.msg)
            }
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handlerLock(data) {
      if (data) {
        this.$refs.form.validateField('isLock');
      }
    },
  }
}
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: black;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

@keyframes box {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.background {
  background: url(../../../public/bgi.jpg);
  width: 100%; //大小设置为100%
  height: 100%; //大小设置为100%
  position: fixed;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  /*背景不重复*/
  background-attachment: fixed;
  /*背景不滚动*/
  background-size: cover;
  /*结合上一句背景始终固定，且覆盖整个游览器*/
}

.select {
  border: 1px solid #e3e3e3;
  border-radius: 3px;
  color: #616263;
  overflow: hidden;
  height: 40px;
  width: 75px;
  position: relative;
  display: block;
}

select {
  height: 40px;
  padding: 5px;
  background-color: #ececec;
  border: 0;
  outline: none;
  font-size: 16px;
  width: 75px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.select:after {
  content: "▼";
  padding: 12px 8px;
  position: absolute;
  right: 10px;
  top: 0px;
  z-index: 1;
  text-align: center;
  width: 10%;
  height: 100%;
  pointer-events: none;
  box-sizing: border-box;
}

.login-container {
  width: 400px;
  padding: 30px;
  margin: 7rem auto;
  background: #fcfbfa;
  border-radius: 8px;
  animation-name: box;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-timing-function: linear;

  .forgetword {
    text-align: center;
    font-size: 17px;
    color: purple;
    margin-bottom: 10px;

    a:hover {
      text-decoration: underline;
    }

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      // color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
