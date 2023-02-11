<template>
  <div class="home">
    <el-row>
      <el-col :span="12">
        <el-row>
          <el-col :span="4" class="shop-icon">
            <i class="el-icon-s-shop"></i>
          </el-col>
          <el-col :span="20" class="shop-info">
            <el-row>
              <span class="shopName">{{ userInfo.nickname }}</span>
              <!-- <span class="small-font"> | </span>
              <router-link to="" class="small-font">店铺设置</router-link> -->
            </el-row>
            <el-row>
              <span :span="8" class="tag">
                <i class="el-icon-position"></i>
                <span class="small-font">个人认证</span>
              </span>
              <span :span="8" class="tag">
                <i class="el-icon-position"></i>
                <span class="small-font">授权交易</span>
              </span>
              <span :span="8" class="tag">
                <i class="el-icon-position"></i>
                <span class="small-font">线下门店</span>
              </span>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="12" class="right">
        <el-row>
          <el-col :span="3"><div class="title">个人信用</div></el-col>
          <el-col :span="3" class="vertical-align">
            <div class="font-highlight">{{ creditLevel }}</div>
            <div class="small-font">信用等级</div>
          </el-col>
          <el-col :span="3" class="vertical-align">
            <div class="font-highlight">{{ userInfo.comprehensive_score }}</div>
            <div class="small-font">综合评分</div>
          </el-col>
          <el-col :span="15">
            <ve-radar-chart :data="radarData" :legend="radarData.legend" :tooltip="radarData.tooltip" :settings="radarData.settings" :height="150"/>
            <!-- <div
              id="radar-chart"
              :style="{ width: '100%', height: '120px' }"
            ></div> -->
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="overview">
      <b class="title">经营概况</b>
      <PanelGroup></PanelGroup>
    </el-row>
  </div>
</template>

<script>
// @ is an alias to /src
import PanelGroup from '../components/PanelGroup.vue'
import CountTo from 'vue-count-to'
import Util from '../utils/utils.js';

export default {
  name: 'Home',
  components: {
    CountTo, PanelGroup
  },
  data () {
    return {
      userInfo: {
      id: '',
      nickname: '',
      avatar: '',
      role: '',
      status: '',
      identifier: '',
      credential: '',
      create_time: '',
      real_name: '',
      identity_card_type: '',
      identity_card_no: '',
      phone: '',
      email: '',
      gender: '',
      user_money: '',
      modified_time: '',
      credit_grade: '',
      comprehensive_score: '',
      zip: '',
      province: '',
      city: '',
      area: '',
      address: ''
      },
      shopName: 'liangliang',
      credit: {
        rank: '优秀',
        score: '459'
      },
      radarData: {
        dimensions: [
          { name: '经营能力', max: 100 },
          { name: '卖家资质', max: 100 },
          { name: '买家评价', max: 100 },
          { name: '稳定性', max: 100 },
          { name: '合规经营', max: 100 }
        ],
        measures: [{data: [40, 40, 35, 57, 96]}],
        tooltip: { position: 'right' },
        legend: { show: false },
        settings: {
          itemStyle: { normal: { areaStyle: { type: 'default' } } },   // 面积
          name: { textStyle: { padding: [-10, -12] } },
        }
      },
    }
  },
  created () {
    this.loading();
    // this.getUserInfoById()
    // this.userInfo = this.$store.state.user
  },
  computed: {
    creditLevel: function() {
      return Util.creditLevel(this.userInfo.credit_grade)
    }
  },
  methods: {
    loading() {
      this.request.post('/api/user/businessInfo', {
        id: this.$store.state.user.id
    })
    .then((res) => {
        this.$store.commit('updataBusiness', res.data)
        this.userInfo = this.$store.state.user
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

  }
  
}
</script>


<style lang="less" scoped>
.home{
  width: 100%;
  padding: 10px 20px;
  .shop-icon{
    width: 50px;
    height: 50px;
    color: #545c64;
    font-size: 30px;
    padding: 5px 10px;
    border-radius: 50%;
    background-color: rgb(191, 191, 191);
    margin-right: 20px;
    margin-top: 8px;
    i {
      font-size: 30px;
      color: #858180;
    }
  }
  .shop-info{
    .shopName{
      font-size: 25px;
      font-weight: bold;
    }
    a{
      text-decoration: none;
      color: #545c64;
    }
    .tag{
      color: #545c64;
      font-size: 16px;
      float: left;
      margin-right: 10px;
      margin-top: 5px;
      i{
        font-size: 14px;
        color: #fff;
        padding: 5px 5px;
        border-radius: 50%;
        background-color: #252a3d;
      }
    }
  }
  .right{
    text-align: center;
  }
  .font-highlight{
    color: #252a3d;
    font-weight: bold;
  }
  .title{
    font-weight: bold;
  }
  .title:before{
    content: '';
    display: inline-block;
    height: 18px;
    margin-right: 5px;
    vertical-align: middle;
    width: 5px;
    background-color: #252a3d;
  }
}
</style>