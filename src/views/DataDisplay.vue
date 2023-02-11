<template>
  <div class="rent">
    <el-menu default-active="0" class="el-menu-demo" mode="horizontal" @select="handleSelect">
			<!-- <label v-for="(item,index) in arrayBusinessList" :key="index">
          <el-menu-item :index="index.toString()">
            <span slot="title">{{item }}</span>
          </el-menu-item>
			</label> -->
			<el-menu-item v-for="(item, index) in arrayBusinessList" :key="index" :index="index.toString()" @click="businessContent(item, index)">
				{{ item }}
			</el-menu-item>
    </el-menu>
    <div class="dataShow">
      <b class="title">数据概览</b>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>日租赁额</span>
              <span class="amount">{{ dayAmount }}单</span>
            </div>
            <div class="text item">
              <count-to
                    :startVal="0"
                    :endVal="dayRent"
                    :prefix="dayRent > 0 ? '￥' : ''"
                    :duration="2600"
                  ></count-to>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>周租赁额</span>
              <span class="amount">{{ weekAmount }}单</span>
            </div>
            <div class="text item">
              <count-to
                    :startVal="0"
                    :endVal="weekRent"
                    :prefix="weekRent > 0 ? '￥' : ''"
                    :duration="2600"
                  ></count-to>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>月租赁额</span>
              <span class="amount">{{ mouthAmount }}单</span>
            </div>
            <div class="text item">
              <count-to
                    :startVal="0"
                    :endVal="mouthRent"
                    :prefix="mouthRent > 0 ? '￥' : ''"
                    :duration="2600"
                  ></count-to>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>年租赁额</span>
              <span class="amount">{{ yearAmount }}单</span>
            </div>
            <div class="text item">
              <count-to
                    :startVal="0"
                    :endVal="yearRent"
                    :prefix="yearRent > 0 ? '￥' : ''"
                    :duration="2600"
                  ></count-to>
            </div>
          </el-card>
        </el-col>
      </el-row>
        
    </div>
    <div class="dataCount">
      <b class="title">数据统计</b>
      <el-date-picker
        v-model="count_time"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"
        >
      </el-date-picker>
      <el-row :gutter="20">
        <el-col :span="16">
          <ve-line-chart :data="linechartData" :settings="linechartSettings" v-bind="lineoptions" :title="linetitle" style="margin: 10px 0px"/>
        </el-col>
        <el-col :span="8">
          <ve-pie-chart :data="piechartData" :settings="piechartSettings" />
        </el-col>
      </el-row>
      <ve-scatter-chart :data="scatterchartData" :settings="scatterchartSettings" :tooltip="scattertooltip" :title="scattertitle" />
    </div>
    
  </div>
</template>

<script>
import CountTo from "vue-count-to";
export default {
  name: 'DataDisplay',
  components: {
    CountTo
  },
  data() {
    return {
      dayRent: 100,
      weekRent: 300,
      mouthRent: 2000,
      yearRent: 13000,
			dayAmount: 4,
			weekAmount: 20,
			mouthAmount: 100,
			yearAmount: 1000,
			arrayBusinessList: [],
      count_time: '',
      pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        linechartData: {
        dimensions: {
          name: 'Week',
          data: ['Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fir.', 'Sat.', 'Sun.']
        },
        measures: [{
          name: '充电宝',
          data: [1000, 300, 200, 300, 200, 100, 200, 300, 250, 300, 300, 300]
        },
        {
          name: '共享单车',
          data: [200, 200, 260, 230, 230, 200, 200, 200, 250, 280, 250, 220]
        },
        {
          name: '游戏卡',
          data: [231, 356, 140, 100, 456, 911, 983, 673, 925, 566, 345, 930]
        },
        {
          name: '服装',
          data: [234, 453, 234, 433, 222, 444, 323, 344, 432, 343, 234, 232]
        },{
          name: '游戏机',
          data: [244, 342, 233, 233, 333, 1111, 233, 30, 10, 354, 589, 930]
        },
        {
          name: '数码',
          data: [500, 233, 444, 344, 133, 344, 522, 111, 333, 222, 232, 121]
        },
        {
          name: '办公用品',
          data: [321, 123, 213, 133, 421, 134, 422, 678, 908, 1100, 789, 456]
        }],
        
      },
      linechartSettings: {
        areaStyle: {},
        smooth: true,
      },
      linetitle: {
        text: '一周产品租赁额',
        // subtext: 'GitHub新增Star数量'
      },
      lineoptions: {
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} 元'
          },
          axisPointer: {
            snap: true
          }
        },
      },
      piechartData: {
        dimensions: {
          name: '产品',
          data: ['充电宝', '共享单车', '游戏卡', '服装', '游戏机', '数码','办公用品']
        },
        measures: [{
          name: '租赁额',
          data: [40000, 27800, 22000, 20200, 15600, 13600]
        }]
      },
    piechartSettings: {
        roseType: 'radius',
        radius: [30, 110]
      },
      scatterchartData: {
        dimensions: {
          data: ['身高', '体重']
        },
        measures: [{
          name: '女性',
          data: []
        },{
          name: '男性',
          data: []
        },]
      },
      scatterchartSettings: {

      },
      scattertooltip: {

      },
      scattertitle: {
        text: '一天用户使用频率',
      }
    }
  },

  mounted() {
    
  },

  created() {
    this.fillscatterdata()
		this.arrayBusiness()
  },

  methods: {
		arrayBusiness() {
			let bus = this.$store.state.business
			bus.forEach(item => {
				this.arrayBusinessList.push(item.business_name)
			})
		},
		businessContent(val, index) {
			console.log(val, index)
		},
    handleSelect(key, keyPath) {
      // console.log(key, keyPath);
    },
    rangeRandom(min, max, precision) {
        return (Math.random() * (max - min) + min).toFixed(precision)
      },
      fillscatterdata() {
        for (let i = 0; i < 200; i++) {
          this.scatterchartData.measures[0].data.push([this.rangeRandom(0, 24, 2), this.rangeRandom(10, 100, 2)])
          this.scatterchartData.measures[1].data.push([this.rangeRandom(0, 24, 2), this.rangeRandom(10, 100, 2)])
        }
      }
  },
};
</script>

<style lang="less">
.rent{
    width: 100%;
    padding: 10px 20px;
    .title{
    font-weight: bold;
  }
  .el-menu{
    margin-bottom: 10px;
  }
  .title:before{
    content: '';
    display: inline-block;
    height: 25px;
    margin-right: 5px;
    vertical-align: middle;
    width: 5px;
    background-color: #252a3d;
  }
  b.title{
    font-size: 25px;
    display: block;
    margin-bottom: 5px;
  }
  .dataShow{
    .el-card__body{
      font-size: 35px;
      text-align: center;
      font-style: italic;
    }
    .amount{
      float: right;
    }
  }
}

</style>