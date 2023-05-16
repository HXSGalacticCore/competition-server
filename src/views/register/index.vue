<template>
  <div class="background">
    <div class="login-container">
      <article class="header">
        <header>
          <el-avatar icon="el-icon-user-solid" shape="circle" />
          <span class="login">
            <em class="bold">已有账号？</em>
            <a href="/login">
              <el-button type="primary" size="mini">登录</el-button>
            </a>
          </span>
        </header>
      </article>
      <br>
      <section>
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" class="login-form">
          <div class="title-container">
            <h3 class="title">注册</h3>
          </div>
          <el-divider></el-divider>

          <el-steps :active="active" finish-status="success" align-center>
            <el-step title="选择"></el-step>
            <el-step title="性别"></el-step>
            <el-step title="信息"></el-step>
            <el-step title="成功"></el-step>
          </el-steps>


          <div v-if="active == 0">
            <div style="height: 50px"></div>
            <div style="width: 100%;display: flex;justify-content: center;">
              <el-form-item prop="role" style="background-color: #fcfbfa;">
              <el-button @click="next3" style="height: 220px; width: 200px;" ref="type" v-model="ruleForm.role">
                <i class="el-icon-notebook-2" style="font-size: 100px;"></i>
                <p style="font-size: 25px;">我是学生</p>
              </el-button>

              <el-button @click="next4" style="height: 220px; width: 200px;"  ref="role" v-model="ruleForm.role">
                <i class="el-icon-water-cup " style="font-size: 100px;"></i>
                <p style="font-size: 25px;">我是评委</p>
              </el-button>
            </el-form-item>
            </div>
            <div style="height: 50px;"></div>
          </div>
          <div v-if="active == 1">
            <div style="height: 50px"></div>
            <div style="width: 100%;display: flex;justify-content: center;">

            <el-form-item prop="sex" style="background-color: #fcfbfa;">
              <el-button @click="next1" style="height: 220px; width: 210px;" ref="sex" v-model="ruleForm.sex">
                <i class="el-icon-male" style="font-size: 100px;"></i>
                <p style="font-size: 25px;">男</p>
              </el-button>

              <el-button @click="next2" style="height: 220px; width: 210px;" ref="sex" v-model="ruleForm.sex">
                <i class="el-icon-female" style="font-size: 100px;"></i>
                <p style="font-size: 25px;">女</p>
              </el-button>
            </el-form-item>
          </div>
          </div>
          <div v-if="active == 2">
            <!-- 邮箱 -->
            <el-form-item prop="email">
              <span class="svg-container">
                <i class="el-icon-eleme"></i>
              </span>
              <el-input ref="email" v-model="ruleForm.email" placeholder="请输入邮箱" name="email" type="text" tabindex="5" />
            </el-form-item>

            <el-form-item prop="userName">
              <span class="svg-container">
                <i class="el-icon-user"></i>
              </span>
              <el-input ref="username" v-model="ruleForm.userName" placeholder="用户名" type="text" tabindex="1"
                @blur="reload" />
            </el-form-item>

            <el-form-item prop="realName">
              <span class="svg-container">
                <i class="el-icon-user-solid"></i>
              </span>
              <el-input ref="realName" v-model="ruleForm.realName" placeholder="真实姓名" type="text" tabindex="1"
                @blur="reload" />
            </el-form-item>

            <el-form-item prop="userPwd">
              <span class="svg-container">
                <i class="el-icon-key"></i>
              </span>
              <el-input :key="passwordType" ref="password" v-model="ruleForm.userPwd" :type="passwordType"
                placeholder="密码" tabindex="2" autocomplete="on" @keyup.native="checkCapslock" @blur="capsTooltip = false"
                @keyup.enter.native="handleLogin" />

            </el-form-item>
            <el-form-item prop="repassword">
              <span class="svg-container">
                <i class="el-icon-key"></i>
              </span>
              <el-input :key="repasswordType" ref="repassword" v-model="ruleForm.repassword" :type="repasswordType"
                placeholder="确认密码" tabindex="3" autocomplete="on" @keyup.native="recheckCapslock"
                @blur="recapsTooltip = false" />
            </el-form-item>

            <!-- 手机 -->
            <el-form-item prop="phone">
              <span class="svg-container">
                <i class="el-icon-phone-outline"></i>
              </span>
              <el-input ref="phone" v-model="ruleForm.phone" placeholder="请输入手机号" name="phone" type="text" tabindex="4" />
            </el-form-item>
            <el-button type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="userRegister"
              v-loading.fullscreen.lock="fullscreenLoading">注册</el-button>

          </div>

        </el-form>
      </section>
    </div>
  </div>
</template>
  
<script>
import { register } from '@/api/user'
import axios from 'axios'
export default {
  name: 'Register',
  data() {
    return {
      values: {},
      error: '',
      active: 0,
      capsTooltip: false,
      passwordType: 'password',
      recapsTooltip: false,
      repasswordType: 'password',
      fullscreenLoading: false,
      ruleForm: {
        type:'',
        realName:'',
        userName: '',
        email: '',
        userPwd: '',
        sex: '',
        phone: ''
      },
      rules: {
        username: [{
          required: true,
          type: 'string',
          message: '请输入用户名',
          trigger: 'blur'
        }],
        email: [{
          required: true,
          type: 'email',
          message: '请输入邮箱',
          trigger: 'blur'
        }],
        // phone: [{
        //   required: true,
        //   type: 'number',
        //   message: '请输入手机号',
        //   trigger: 'blur'
        // }],
        password: [{
          required: true,
          message: '输入密码',
          trigger: 'blur'
        }, {}],
        repassword: [{
          required: true,
          message: '确认密码',
          trigger: 'blur'
        }, {
          // validator: (rule, value, callback) => {
          //   if (value === '') {
          //     callback(new Error('请再次输入密码'))
          //   } else if (value !== this.ruleForm.pwd) {
          //     callback(new Error('两次输入密码不一致'))
          //   } else {
          //     callback()
          //   }
          // },
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    next3() {
      this.ruleForm.type="1";
      if (this.active++ > 3) {
        this.active = 0;
      }
    },
    next4() {
      this.ruleForm.type="2";
      if (this.active++ > 3) {
        this.active = 0;
      }
    },

    next1() {
      this.ruleForm.sex="1";
      console.log(this.ruleForm.sex)
      if (this.active++ > 3) {
        this.active = 0;
      }
    },
    next2() {
      this.ruleForm.sex="2";
      if (this.active++ > 3) {
        this.active = 0;
      }
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
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    reshowPwd() {
      if (this.repasswordType === 'password') {
        this.repasswordType = ''
      } else {
        this.repasswordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.repassword.focus()
      })
    },
    recheckCapslock(e) {
      const { key } = e
      this.recapsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },

    async userRegister() {
      var that = this
      const { code, msg, data } = await register(this.ruleForm)

      if (code == 200) {
        // 跳转到登录
        this.$message.success(msg)
        this.active++;
        this.fullscreenLoading = true;
        setTimeout(() => {
          this.fullscreenLoading = false;
        }, 2000);
        this.$router.push('/')

      } else {
        this.$message.error(msg)

      }
    }

  }
}
</script>
  
<style lang="scss">
$bg: #e6eaef;
$light_gray: #fff;
$cursor: rgb(19, 19, 19);

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
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
      border-radius: 25px;
      padding: 12px 5px 12px 15px;
      color: rgb(97, 60, 60);
      height: 46px;
      caret-color: rgba(62, 119, 194, 0.8);

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    background: rgba(172, 172, 172, 0.1);
    border-radius: 5px;
    color: #886767;
  }
}
</style>
  
<style lang="scss" scoped>
$bg: #514d4d;
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

.login-container {

  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: center;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 110px 35px 0;
    margin: 0 auto;
    overflow: hidden;
    background: #fcfbfa;
    border-radius: 8px;
    animation-name: box;
    animation-duration: 1s;
    animation-fill-mode: forwards;
    animation-timing-function: linear;
  }

  .header {
    border-bottom: 2px solid rgb(235, 232, 232);
    min-width: 980px;
    color: #666;

    header {
      margin: 0 auto;
      padding: 10px 0;
      width: 980px;

      .login {
        float: right;
      }

      .bold {
        font-style: normal;
        color: $light_gray;
      }
    }
  }

  >section {
    margin: 0 auto 30px;
    padding-bottom: 100px;
    width: 980px;
    min-height: 300px;
    box-sizing: border-box;

    .status {
      font-size: 12px;
      margin-left: 20px;
      color: #e6a23c;
    }

    .error {
      color: red;
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    font-size: 23px;
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 50px;
      color: #3193e4;
      margin: -90px auto -20px auto;
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

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
  
  