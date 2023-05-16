<style>
@keyframes box {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}
</style>

<template>
    <div class="background">
        <div>
            <section>
                <el-form ref="forgetpwdForm" :model="ruleForm" style="position: relative;
        width: 520px;
        max-width: 100%;
        padding: 15px 35px 0;
        margin: 80px auto;
        overflow: hidden;
        background: #fcfbfa;
        border-radius: 8px;
        animation-name: box;
        animation-duration: 1s;
        animation-fill-mode: forwards;
        animation-timing-function: linear;">
                    <el-steps :active="active" finish-status="success" align-center>
                        <el-step title="身份验证"></el-step>
                        <el-step title="密码重置"></el-step>
                        <el-step title="重置完成"></el-step>
                    </el-steps>
                    <el-divider></el-divider>
                    <div v-if="active == 0">
                        <el-form-item prop="email">
                            <span class="svg-container">
                                <i class="el-icon-eleme" style="font-size: 20px;"></i>
                            </span>
                            <el-input ref="email" v-model="ruleForm.email" placeholder="输入邮箱并点击发送验证码" name="email"
                                type="text" tabindex="2" clearable />
                            <el-button :loading="codeLoading" :disabled="isDisable" size="small" style="display: inline;"
                                round @click="sendMsg">{{ statusMsg }}</el-button>
                            <!-- <span class="status">{{ statusMsg }}</span> -->
                        </el-form-item>
                        <el-form-item prop="code">
                            <span class="svg-container">
                                <i class="el-icon-s-help" style="font-size: 20px;"></i>
                            </span>
                            <el-input v-model="ruleForm.code" maxlength="6" placeholder="请登录邮箱接收验证码" tabindex="3"
                                clearable />
                        </el-form-item>
                        <el-button style="margin-bottom:30px;margin-left: 130px;" @click="next">下一步</el-button>
                        <el-button style="margin-bottom:30px;" @click="back">返回</el-button>
                    </div>

                    <div v-if="active == 1">
                        <el-form-item prop="userPwd">
                            <span class="svg-container">
                                <i class="el-icon-key" style="font-size: 18px;"></i>
                            </span>
                            <el-input :key="passwordType" ref="password" v-model="ruleForm.userPwd" :type="passwordType"
                                placeholder="密码" tabindex="2" autocomplete="on" @keyup.native="checkCapslock"
                                @blur="capsTooltip = false" @keyup.enter.native="handleLogin" clearable
                                style=" width: 95%;" />

                        </el-form-item>
                        <el-form-item prop="repassword">
                            <span class="svg-container">
                                <i class="el-icon-key" style="font-size: 18px;"></i>
                            </span>
                            <el-input :key="repasswordType" ref="repassword" v-model="ruleForm.repassword"
                                :type="repasswordType" placeholder="确认密码" tabindex="3" autocomplete="on"
                                @keyup.native="recheckCapslock" @blur="recapsTooltip = false" clearable
                                style="width: 95%" />
                        </el-form-item>
                        <el-button style="margin-bottom:30px;margin-left: 130px;" @click="next">下一步</el-button>
                        <el-button style="margin-bottom:30px;" @click="back">返回</el-button>
                    </div>

                    <div v-if="active == 2">
                        <p style="text-align: center;">新密码设置成功，请重新登录！</p>
                        <el-button style="margin-bottom:30px;margin-left: 170px;" @click="login">重新登陆</el-button>
                    </div>
                </el-form>
            </section>
        </div>
    </div>
</template>
  
<script>
import { getEmailCode, register, validCode } from '@/api/user'
import { Button } from 'element-ui';
export default {
    name: 'Forgetpwd',
    data() {
        return {
            statusMsg: '发送验证码',
            error: '',
            isDisable: false,
            capsTooltip: false,
            passwordType: 'password',
            recapsTooltip: false,
            repasswordType: 'password',
            codeLoading: false,
            active: 0,
            ruleForm: {
                email: '',
                code: '',//验证码
                userPwd: '',
                repassword: ''
            },
            rules:{
                email: [{
          required: true,
          type: 'email',
          message: '请输入邮箱',
          trigger: 'blur'
        }],
        }
        };
       
    },

    methods: {
        sendMsg:function(){
            const self=this
            let email
            let timerid
            console.log(timerid)
      if (timerid) {
        return false
      }
      self.statusMsg = ''
      this.$refs['forgetpwdForm'].validateField('email', (valid) => {
        email = valid
      })
      // 向后台API验证码发送
      if (!email) {
        self.codeLoading = true
        self.statusMsg = '验证码发送中...'
        getEmailCode(self.ruleForm.email).then(res => {
          this.$message({
            showClose: true,
            message: '发送成功，验证码有效期5分钟',
            type: 'success'
          })
          let count = 60
          self.ruleForm.code = ''
          self.codeLoading = false
          self.isDisable = true
          self.statusMsg = `${count--}秒后重新发送`
          timerid = window.setInterval(function() {
            self.statusMsg = `${count--}秒后重新发送`
            if (count <= 0) {
              console.log('clear' + timerid)
              window.clearInterval(timerid)
              self.isDisable = false
              self.statusMsg = '发送验证码'
            }
          }, 1000)
        }).catch(err => {
          this.isDisable = false
          this.statusMsg = ''
          this.codeLoading = false
          console.log(err.response.data.message)
        })
      }

        },
        next() {
            
            const self=this
            let email
            let code
            if(this.active==0)
            {
      if(!email&&!code)
      {
        
        validCode(self.ruleForm.email,self.ruleForm.code).then(res => {
          if(res.data){
            
            this.active++;
            this.ruleForm.code='';
          }
          else{
            
            this.$message({
            showClose: true,
            message: '验证码错误',
            type: 'error'
          })
          }
        })
      }
            }
            else if(this.active==1)
            {
                register(self.ruleForm.userPwd,self.ruleForm.repassword).then(res => {
                    if(res)
                    {

                    }
                })
            }
            
        },
        back() {
            if (this.active > 0) {
                this.active--;
            }
            else {
                this.$router.push({ path: '/' });
            }
        },
        login() {
            this.active++;
            this.$router.push({ path: '/' });
        }
    }
}
</script>
<style lang="scss">
$bg: #e6eaef;
$light_gray: #fff;
$cursor: rgb(19, 19, 19);

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .forgetpwd-container .el-input input {
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


.el-input {
    display: inline-block;
    height: 47px;
    width: 69%;

    input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: #454545;
        ;
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
</style>

<style lang="scss" scoped>
$bg: #514d4d;
$dark_gray: #889aa4;
$light_gray: #eee;

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

.svg-container {
    font-size: 200px;
    padding: 6px 5px 6px 15px;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
}
