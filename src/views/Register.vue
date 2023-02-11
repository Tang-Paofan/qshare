<template>
	<div class="register">
		<!-- <div class="crumbs crumbs-register">
			<el-breadcrumb separator="/" class="register-title">
                <el-breadcrumb-item><i class="el-icon-setting"></i>注册</el-breadcrumb-item>
            </el-breadcrumb>
		</div> -->
		<div class="userContent">
			<el-form ref="form" :model="form" :rules="rules" label-width="80px">
				<el-form-item prop="nickname" label="用户名">
					<el-input class="register-form-input" v-model="form.nickname" placeholder="请输入用户名"></el-input>
				</el-form-item>
				<el-form-item prop="identifier" label="账号">
					<el-input class="register-form-input" v-model="form.identifier" placeholder="请输入账号"></el-input>
				</el-form-item>
				<el-form-item prop="credential" label="密码">
					<el-input class="register-form-input" v-model="form.credential" type="password" placeholder="请输入密码"></el-input>
				</el-form-item>
				<el-form-item prop="checkCredential" label="确认密码">
					<el-input class="register-form-input" v-model="form.checkCredential" type="password" placeholder="请再次输入密码"></el-input>
				</el-form-item>
				<!-- <el-form-item prop="email" label="邮箱">
					<el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
				</el-form-item>
				<el-form-item prop="phone" label="手机">
					<el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
				</el-form-item>
				<el-form-item prop="card" label="身份证">
					<el-input v-model="form.card" placeholder="请输入身份证号"></el-input>
				</el-form-item>
				<el-form-item prop="birth" label="出生日期">
					<el-col :span="24">
						<el-date-picker type="date" placeholder="选择日期" v-model="form.birth" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
					</el-col>
				</el-form-item>
				<el-form-item prop="sex" label="性别">
					<el-select class="select-sex" v-model="form.sex" placeholder="请选择性别">
						<el-option label="男" value="man"></el-option>
						<el-option label="女" value="woman"></el-option>
					</el-select>
				</el-form-item> -->
				<el-form-item class="register-btn">
					<el-button type="primary" @click="onSubmit('form')">注册</el-button>
					<el-button @click="onCancle()">返回</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import Util from '../utils/utils.js';
	export default {
		data() {
			var validatePass = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请输入密码'));
				} else if(!Util.RegExp.credentialReg.test(this.form.credential)) {
                    callback(new Error('密码长度8~12位，必须包含数字、字母、特殊字符中的两种'))
                } else {
					if(this.form.checkCredential !== '') {
						this.$refs.form.validateField('checkCredential');
					}
					callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if(value === '') {
					callback(new Error('请再次输入密码'));
				} else if(!Util.credentialReg.test(this.form.checkCredential)) {
                    callback(new Error('密码长度8~12位，必须包含数字、字母、特殊字符中的两种'))
                } else if (value !== this.form.credential) {
					callback(new Error('两次输入的密码不一致'));
				} else {
					callback();
				}
			};
			// var validateEmail = (rule, value, callback) => {
			// 	if (value === '') {
			// 		callback(new Error('请输入邮箱'));
			// 	} else if (!Util.emailReg.test(this.form.email)){
			// 		callback(new Error('请输入正确的邮箱'));
			// 	} else {
			// 		callback();
			// 	}
			// };
			// var validatePhone = (rule, value, callback) => {
			// 	if (value === '') {
			// 		callback(new Error('请输入手机号'));
			// 	} else if (!Util.phoneReg.test(this.form.phone)){
			// 		callback(new Error('请输入正确的手机号'));
			// 	} else {
			// 		callback();
			// 	}
			// };
			// var validateCard = (rule, value, callback) => {
			// 	if (value === '') {
			// 		callback(new Error('请输入身份证号'));
			// 	} else if (!Util.idCardReg.test(this.form.card)){
			// 		callback(new Error('请输入正确的身份证号'));
			// 	} else {
			// 		callback();
			// 	}
			// };
            return {
				form: {
					nickname: '',
					identifier: '',					
					credential: '',
					checkCredential: '',
					email: '',
					phone: '',
					card: '',
					birth: '',
					sex: ''
                },
                rules: {
                    nickname: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    identifier: [
                        { required: true, message: '请输入账号', trigger: 'blur' }
                    ],
                    credential: [
                        { required: true, validator: validatePass, trigger: 'blur' }
                    ],
                    checkCredential: [
                        { required: true, validator: validatePass2, trigger: 'blur' }
                    ],
                    // email: [
                    //     { validator: validateEmail, trigger: 'blur' }
                    // ],
                    // phone: [
                    //     { validator: validatePhone, trigger: 'blur' }
                    // ],
                    // card: [
                    //     { validator: validateCard, trigger: 'blur' }
                    // ],
                    // birth: [
                    //     { required: true, message: '请输入出生日期',type: 'date', trigger: 'blur' }
                    // ],
                    // sex: [
                    //     { required: true, message: '请输入性别', trigger: 'blur' }
                    // ]
                }
			}
        },
        methods:{
        	onSubmit(formName) {
				const self = this;			
				self.$refs[formName].validate((valid) => {
                    if (valid) {
                        self.request.post('api/user/register', JSON.stringify(self.form))
                        // self.$http.post('/api/user/addUser',self.form)
                        .then(function(res) {
							console.log(res);
							self.$message.success(res.msg + '3秒后跳转至登录页')
                            self.$store.commit('updateUser', res.data)
                            setTimeout(() => {
                                self.$router.push('/login');
                            }, 3000)
						}).then(function(error) {
							console.log(error);
						})
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
				
        	},
        	onCancle() {
        		this.$router.push('/login');
			},
			getDateTimes(str) {
				var str = new Date(str);
        		return str;
			}       	
        }
	}
</script>

<style scoped>
	.register{
		width: 100vw;
		height: 100vh;
		background-color: #ecf0f3;
	}
	.crumbs-register {
		background-color: #324157;
		height: 50px;
		line-height: 50px;
	}
	.register-title {
		line-height: 50px;
		margin: 0 auto;
    	width: 50px;
    	font-size: 16px;
	}	
	.userContent {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -60%);
		width: 480px;
		margin: 0 auto;
		padding: 35px 35px 10px 35px;
        border-radius: 20px;
        box-shadow: 13px 13px 20px #cbced1, -13px -13px 20px #fff;
	}
	.register-form-input /deep/ .el-input__inner{
		border: 0px;
	}
	.register-btn{
		display: flex;
		justify-content: center;
	}
	.register-btn /deep/ .el-form-item__content{
		margin-left: 0px !important;
	}
	.register-btn button{
		margin-top: 20px;
		width: 200px;
		flex: 1;
	}
</style>