<template>
    <el-card shadow="always" style="width: 100%; margin: 10px 20px">
      <el-form :model="userInfo" ref="userInfo" label-width="100px" class="demo-ruleForm userInfoForm">
        <el-form-item class="header">
            <el-upload
                action=""
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :http-request="uploadImg">
            <div v-show="progressFlag" class="head-img">
                <el-progress type="circle" :percentage="progressPercent"></el-progress>
            </div>
            <el-avatar v-show="!progressFlag" :size="90" @error="errorHandler">
                <img :src="userInfo.avatar"/>
            </el-avatar>
                </el-upload>
            <div class="nickname">
                <span>{{ userInfo.nickname }}</span>
            </div>
        </el-form-item>
        <el-form-item class="balance">
            <i class="el-icon-coin"></i>
            <span>账户余额：{{ userInfo.user_money || 0 }}元</span>
            <el-button type="primary" round @click="alipay">去充值<i class="el-icon-arrow-right el-icon--right"></i></el-button>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item label="用户昵称">
            <el-input v-model="userInfo.nickname"></el-input>
        </el-form-item>
        <el-form-item label="用户ID">
            <el-input v-model="userInfo.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="账号">
            <el-input v-model="userInfo.identifier"></el-input>
        </el-form-item>
        <el-form-item label="性别">
            <el-select v-model="userInfo.gender" placeholder="请选择">
                <el-option label="男" :value=1 key='1'></el-option>
                <el-option label="女" :value=2 key='2'></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="所在地址" class="address">
            <el-cascader
                size="large"
                :options="options"
                v-model="selectedOptions"
                @change="handleChange">
            </el-cascader>
            <el-input v-model="userInfo.address" class="address-input"></el-input>
        </el-form-item>
        <el-form-item label="真实名字">
            <el-input v-model="userInfo.real_name"></el-input>
        </el-form-item>
        <el-form-item label="登录类型">
            <el-input v-model="userInfo.identity_type" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="证件类型">
            <el-select v-model="userInfo.identity_card_type" placeholder="请选择">
                <el-option label="身份证" :value=1 key='1'></el-option>
                <el-option label="护照" :value=2 key='2'></el-option>
            </el-select>
        </el-form-item>
         <el-form-item label="证件号">
            <el-input v-model="userInfo.identity_card_no"></el-input>
        </el-form-item>
        <el-form-item label="综合评分">
            <el-input v-model="userInfo.comprehensive_score" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item class="submitBtn">
            <el-button type="primary" @click="submitForm" >提交</el-button>
            <el-button @click="resetForm">重置</el-button>
        </el-form-item>
        <!-- <el-form-item label="活动区域" prop="region">
            <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="活动时间" required>
            <el-col :span="11">
            <el-form-item prop="date1">
                <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;"></el-date-picker>
            </el-form-item>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
            <el-form-item prop="date2">
                <el-time-picker placeholder="选择时间" v-model="ruleForm.date2" style="width: 100%;"></el-time-picker>
            </el-form-item>
            </el-col>
        </el-form-item>
        <el-form-item label="即时配送" prop="delivery">
            <el-switch v-model="ruleForm.delivery"></el-switch>
        </el-form-item>
        <el-form-item label="活动性质" prop="type">
            <el-checkbox-group v-model="ruleForm.type">
            <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
            <el-checkbox label="地推活动" name="type"></el-checkbox>
            <el-checkbox label="线下主题活动" name="type"></el-checkbox>
            <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="特殊资源" prop="resource">
            <el-radio-group v-model="ruleForm.resource">
            <el-radio label="线上品牌商赞助"></el-radio>
            <el-radio label="线下场地免费"></el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="活动形式" prop="desc">
            <el-input type="textarea" v-model="ruleForm.desc"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item> -->
    </el-form>
    </el-card>
</template>

<script>
import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'
// import { regionData } from 'element-china-area-data'
export default {
    name: 'UserInfo',
    data() {
        return {
            userInfo: {},
            fileList:[],
            progressFlag: false,
            progressPercent: 0,
            userInfoStorage: '',
            options: regionData,
            selectedOptions: [],
        }
    },
    mounted() {

    },
    created(){
        this.load()
    },
    methods: {
        load() {
            this.request.post('api/user/getUserById', {
                id: this.$store.state.user.id
            }).then((res) => {
                this.$store.commit('updateUser', res.data[0])
                this.userInfo = this.$store.state.user
                this.selectedOptions = [this.$store.state.user.province, this.$store.state.user.city, this.$store.state.user.area]
                this.searchUserAccount()
            }).catch(err => {
                console.log(err)
            })
        },
        getUserInfoById() {
            this.request.post('api/user/getUserById', {
                id: this.$store.state.user.id
            }).then((res) => {
                this.$store.commit('updateUser', res.data[0])
            }).catch(err => {
                console.log(err)
            })
        },
        searchUserAccount() {
            this.request.post('/api/user/selectUserAccount', {
                id: this.$store.state.user.id,
            }).then(res => {
                res.data.forEach(item => {
                    this.userInfo.user_money += parseFloat(item.amount.toFixed(2))
                });
                this.userInfo.user_money = parseFloat(this.userInfo.user_money).toFixed(2)
                this.$store.commit('updateUser', this.userInfo)
            }).catch(err => {
                console.log(err)
            })
        },
        errorHandler() {
            return true
        },
        uploadImg (f) {
            this.progressFlag = true
            let formData = new FormData()
            formData.append("file", f.file);
            // formData.append("userId", this.userInfo.id);
            this.request({
                url: 'api/user/upload/uploadAvatar',
                method: 'POST',
                Headers: {
                    "content-type": "multipart/form-data",
                },
                data: formData,
                onUploadProgress: (progressEvent) => {
                        let num = progressEvent.loaded / progressEvent.total * 100 | 0;  //百分比
                        // file.onProgress({})     //进度条
                        this.progressPercent = num
                    }
            }).then(res => {
                this.userInfo.avatar = res.url
                // this.$store.commit('updateUser', this.userInfo)
                if (this.progressPercent === 100) {
                    this.progressFlag = false
                    this.progressPercent = 0
                }
            }).catch(error => {
                console.log(error)
            })
        },
        // 上传图片前的过滤
        beforeAvatarUpload (file) {
            const isJPG = file.type === 'image/jpeg'
            const isLt2M = (file.size / 1024 / 1024) < 2

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!')
            }
            return isJPG && isLt2M
        },
        handleChange (value) {
            this.userInfo.province = value[0]
            this.userInfo.city = value[1]
            this.userInfo.area = value[2]
            // this.selectedOptions = value
        },
        submitForm() {
            this.request.post('/api/user/updateUserById',{
                ...this.userInfo
            }).then(async res => {
                // await this.getUserInfoById()
                await this.load()
                this.$message.success(res.msg)
            })
        },
        resetForm() {
            this.load()
        },
        alipay(){
            let outTradeNo = new Date().getTime()
            console.log(outTradeNo)
            this.request.post('/api/alipay/pcpay',{
                outTradeNo
            }).then((res) => {
                window.open(res.url, '_blank');
                this.request.post('/api/user/insertUserAccount', {
                    user_id: this.$store.state.user.id,
                    source: 1,
                    source_no: res.outTradeNo,
                    amount: 9.99,
                    create_time: res.timestamp,
                    title: res.subject,
                    body: res.body
                }).then(resq => {
                    // console.log(resq)
                })
                // this.request.post('/api/alipay/query', {

                // })
            })
        },
        
    }
}
</script>

<style lang="less">
.userInfoForm{
    .nickname{
        display: flex;
        align-items: center;
        flex-direction: column;
        margin-left: 20px;
        font-size: 20px;
    }
    .header{
        .el-form-item__content{
            display: flex;
            img{
                position: relative;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
            }
            
        }
    }
    .el-divider--horizontal{
        margin: 0px 0px 5px;
    }
    .balance{
        display: flex;
        align-items: center;
        i.el-icon-coin{
            width: 30px;
            height: 30px;
            color: white;
            background-color: #fc5531;
            border-radius: 50%;
            box-sizing: border-box;
            padding: 7px;
            margin-right: 10px;
        }
        span{
            color: #fc5531;
        }
        .el-button{
            background-color: #fc5531;
            border-color: #fc5531;
            margin-left: 85px;
            span{
                color: white;
            }
        }
    }
    .el-form-item{
        margin-bottom: 15px;
        width: 70%;
    }
    .head-img{
        .el-progress-circle{
            width: 90px !important;
            height: 90px !important;
        }
    }
    .address{
        .el-cascader.el-cascader--large{
            width: 250px;
            margin-right: 10px;
        }
        .address-input{
            width: calc(100% - 260px);
        }
    }
    .el-select{
        width: 100%;
    }
    .submitBtn{
        display: flex;
        justify-content: center;
    }
}

</style>