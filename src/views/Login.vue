<template>
    <div class="login-bg">
        <div class="login-wrap">
            <div class="ms-title">登&nbsp;&nbsp;&nbsp;录</div>
            <div class="ms-login">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                    <!-- <div v-if="errorInfo">
                        <span>{{errInfo}}</span>
                    </div> -->
                    <el-form-item prop="identifier">
                        <el-input class="login-form-input" prefix-icon="el-icon-user" v-model="ruleForm.identifier" placeholder="账号" ></el-input>
                    </el-form-item>
                    <el-form-item prop="credential">
                        <el-input class="login-form-input" :type="type" prefix-icon="el-icon-lock" placeholder="密码" v-model="ruleForm.credential" @keyup.enter.native="submitForm('ruleForm')">
                            <i slot="suffix" class="icon-style" :class="elIcon" autocomplete="auto" @click="flag = !flag" />
                        </el-input>
                    </el-form-item>
                    <el-form-item  prop="validate">
                        <el-input v-model="ruleForm.validate" class="validate-code login-form-input" placeholder="验证码" ></el-input>
                        <div class="code" @click="refreshCode">
                            <s-identify :identifyCode="identifyCode"></s-identify>
                        </div>
                    </el-form-item>
                    <div class="login-btn">
                        <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                    </div>
                    <p class="register" @click="handleCommand">没有账号？去注册</p>
                </el-form>
            </div>
        </div>  
    </div>  
</template>

<script>
    export default {
        name: 'Login',
        data() {
            return {
                identifyCodes: "1234567890",
                identifyCode: '',
                errorInfo : false,
                validate: '',
                flag: false,
                ruleForm: {
                    identifier: this.$store.state.user.identifier ? this.$store.state.user.identifier : '',
                    credential: this.$store.state.user.credential ? this.$store.state.user.credential : '',
                    isvalidate: ''                   
                },
                rules: {
                    identifier: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    credential: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    validate: [
                        { required: true, message: '请输入验证码', trigger: 'blur' }
                    ]
                }
            }
        },
        mounted() {
            this.identifyCode = "";
            this.makeCode(this.identifyCodes, 4);
        },
        computed: {
            type() {
                return this.flag ? "text" : "password";
            },
            elIcon() {
                return this.flag ? "el-icon-minus" : "el-icon-view";
            }
        },
        methods: {
            submitForm(formName) {
                // debounceAjax(formName)
                const self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        self.ruleForm.isvalidate = self.ruleForm.validate == this.identifyCode ? 'true' : 'false';
                        self.request.post('/api/user/login', JSON.stringify(self.ruleForm))
                        .then((res) => {
                            // console.log(res);
                            if(res.code == -2) {
                                self.errorInfo = true;
                                self.errInfo = res.msg;
                                // console.log(res.msg)
                                self.$message.error({message: res.msg})
                            }else if (res.code == -1) {
                                self.$message({message: res.msg})
                            } else if (res.code == 0) {
                                self.$message.error({message: res.msg})
                            } else if (res.code == 200) {
                                // console.log(res.data)
                                self.$message.success({message: res.msg})
                                self.$store.commit('updateUser', res.data);
                                self.$router.push('/home');
                            }
                        }).catch((error) => {
                            console.log(error);
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            handleCommand() {
                this.$router.push('/register');
            },
            randomNum(min, max) {
                return Math.floor(Math.random() * (max - min) + min);
            },
            refreshCode() {
                this.identifyCode = "";
                this.makeCode(this.identifyCodes, 4);
            },
            makeCode(o, l) {
                for (let i = 0; i < l; i++) {
                    this.identifyCode += this.identifyCodes[
                    this.randomNum(0, this.identifyCodes.length)
                    ];
                }
                console.log(this.identifyCode);
            },
            debounce(func, delay) {
                return function(args) {
                    var _this = this
                    var _args = args
                    clearTimeout(func.id)
                    func.id = setTimeout(function() {
                    func.call(_this, _args)
                    }, delay)
                }
            },
            submitDebounce(formName) {
                const self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        localStorage.setItem('ms_username',self.ruleForm.identifier);
                        localStorage.setItem('ms_user',JSON.stringify(self.ruleForm));
                        // console.log(JSON.stringify(self.ruleForm));                        
                        self.$http.post('/api/user/login',JSON.stringify(self.ruleForm))
                        .then((response) => {
                            if (response.data == -1) {
                                self.errorInfo = true;
                                self.errInfo = '该用户不存在';
                                console.log('该用户不存在')
                            } else if (response.data == 0) {
                                console.log('密码错误')
                                self.errorInfo = true;
                                self.errInfo = '密码错误';
                            } else if (response.status == 200) {
                                self.$router.push('/readme');
                            }                            
                        }).then((error) => {
                            console.log(error);
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            debounceAjax () {
                debounce(submitDebounce,1000);
            }
        }
    }
</script>

<style scoped>
    .login-bg{
        width: 100vw;
        height: 100vh;
        background-color: #ecf0f3;
    }
    .login-wrap{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -60%);
        width:385px;
        height:370px;
        padding: 35px 35px 35px 35px;
        border-radius: 20px;
        box-shadow: 13px 13px 20px #cbced1, -13px -13px 20px #fff;
    }
    .ms-title{
        margin-bottom: 25px;
        text-align: center;
        font-size:30px;
        color: black;
        
    }
    .login-form-input /deep/ .el-input__inner{
        border: 0px;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:40px;
    }
    .code {
        width: 112px;
        height: 35px;
        border: 1px solid #fff;
        float: right;
        border-radius: 2px;
    }
    .validate-code {
        width: 170px;
        float: left;
    }
    .register {
        font-size:14px;
        line-height:40px;
        color:#999;
        cursor: pointer;
        float:right;
    }
    .register:hover{
        color: #66b1ff;
        font-weight: bolder;
    }
</style>