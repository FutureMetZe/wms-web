<style>

    .index {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        overflow: hidden;
        background-image: url(../assets/images/login.jpg);
        background-position: center center;
        box-shadow: 0 0px 10px rgba(0, 0, 0, .3);
        text-align: center;
    }

    .name-password-error {
        padding-bottom: 2px;
        text-align: left;
        line-height: 1;
        color: #ed3f14;
    }

    .login-container {
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        /*padding: 35px 35px 15px 35px;*/
        /*background: #fff;*/
        box-shadow: 0 0px 5px rgba(0, 0, 0, .5);
    }

    .title {
        margin-top: 20px;
        text-align: center;
        color: #FFFFFF;
    }

    .wrap_conter {
        width: 80%;
        height: 80%;
        margin: 80px auto;

    }

</style>
<template>
    <div class="index">
        <el-form :model="loginForm" :rules="rules" ref="loginForm" label-position="left" label-width="0px"
                 class="demo-ruleForm login-container" id="loginForm">
            <div class="wrap_conter">

                <h2 class="title">系统登录</h2>
                <el-alert v-if="this.$store.state.ifSign" title="帐号密码错误，请重新输入" type="error" show-icon/>
                <!--<div class="name-password-error" v-if="this.$store.state.ifSign">用户名或密码错误</div>-->
                <el-form-item prop="account">
                    <el-input type="text" v-model.trim="loginForm.account" auto-complete="off"
                              @keyup.enter.native="change()" id="account"  placeholder="账号"></el-input>
                </el-form-item>
                <el-form-item prop="checkPass">
                    <!--回车登录-->
                    <!--@keyup.enter="alert(dddd)" -->
                    <el-input type="password" v-model.trim="loginForm.checkPass" auto-complete="off"
                              @keyup.enter.native="handleSubmit()" id="password"  placeholder="密码" ></el-input>
                </el-form-item>
                <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
                <el-form-item style="width:100%;">
                    <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit()"
                               :loading="logining">
                        登录
                    </el-button>
                    <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
                </el-form-item>
            </div>
        </el-form>
    </div>

</template>

<script>

    export default {
        data() {

            return {
                logining: false,
                loginForm: {
                    account: '',
                    checkPass: '',
                },
                show: false,
                rules: {
                    account: [
                        {required: true, message: '请输入账号', trigger: 'blur'},
                        //{ validator: validaePass }
                    ],
                    checkPass: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        //{ validator: validaePass2 }
                    ]
                },
                checked: true
            };
        },
        methods: {
            change() {
                document.getElementById("account").blur();
                document.getElementById("password").focus();
            },
            // handleReset2() {
            //   this.$refs.loginForm.resetFields();
            // },
            handleSubmit: function () {
                this.$refs.loginForm.validate((valid) => {
                    //这里做一下回车登录
                    if (valid) {
                        this.$store.dispatch('users/userLogin',{"user_name":this.loginForm.account,"user_password":this.loginForm.checkPass,"router":this.$router});
                        //不与服务器连接时
                        // var user = "admin";
                        // var psd = "admin";
                        // if (user == this.loginForm.account & psd == this.loginForm.checkPass) {
                        //     this.$router.push({path: 'common/welcome'});
                        // } else {
                        //     // this.loginForm.account="";
                        //     this.loginForm.checkPass="";
                        //     this.$message.error({
                        //         message:'帐号密码错误，请重新输入。',
                        //         center:true,
                        //         duration:1000,
                        //     });
                        // }

                        //动态登录
                        // axios({
                        //     method: 'post',
                        //     //远程服务器地址
                        //     // url: 'http://132.126.2.185:8080/user/login',
                        //     url: 'http://127.0.0.1:8080/user/login',
                        //     params: {
                        //         "username": this.loginForm.account,
                        //         "password": this.loginForm.checkPass,
                        //         "grant_type": "password",
                        //         "scope": "all"
                        //     }
                        // }).then(response => {
                        //     // 请求成功，显示对应权限主页
                        //     this.$router.push({path: 'common/welcome'});
                        // }).catch(error => {
                        //     // 请求失败
                        //     this.loginForm.checkPass = "";
                        //     this.$message.error({
                        //         message: '帐号密码错误，请重新输入。',
                        //         center: true,
                        //         duration: 1000,
                        //     });
                        // })
                    }
                });
            }
        }
    }

</script>

