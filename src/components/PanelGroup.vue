<template>
  <div class="panel-group" id="main">
    <el-row>
      <el-col :span="6">
        <div class="card-panel">
          <div class="title">昨日租赁额</div>
          <el-row class="small-font">
            <el-col :span="12">租赁金额</el-col>
            <el-col :span="6" class="number">
              <count-to
                class="card-panel-num"
                :startVal="0"
                :endVal="yesterdayRent.amount"
                :duration="2600"
              ></count-to>
            </el-col>
          </el-row>
          <el-row class="tiny-font">
            <el-col :span="12">日环比</el-col>
            <el-col
              :span="6"
              :class="yesterdayRent.dailyRadio > 0 ? 'positive' : 'negative'"
            >
              <count-to
                :startVal="0"
                :endVal="yesterdayRent.dailyRadio"
                :decimals="2"
                :prefix="yesterdayRent.dailyRadio > 0 ? '+' : ''"
                :suffix="'%'"
                :duration="2600"
              ></count-to>
            </el-col>
          </el-row>
          <el-row class="tiny-font">
            <el-col :span="12">周同比</el-col>
            <el-col
              :span="6"
              :class="yesterdayRent.weeklyRadio > 0 ? 'positive' : 'negative'"
            >
              <count-to
                :startVal="0"
                :endVal="yesterdayRent.weeklyRadio"
                :decimals="2"
                :prefix="yesterdayRent.weeklyRadio > 0 ? '+' : ''"
                :suffix="'%'"
                :duration="2600"
              ></count-to></el-col
          ></el-row>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="card-panel">
          <div class="title">本周租赁额</div>
          <el-row class="small-font">
            <el-col :span="12">租赁金额</el-col>
            <el-col :span="6" class="number">
              <count-to
                class="card-panel-num"
                :startVal="0"
                :endVal="weeklyRent.amount"
                :duration="2600"
              ></count-to>
            </el-col>
          </el-row>
          <el-row class="tiny-font">
            <el-col :span="12">周同比</el-col>
            <el-col
              :span="6"
              :class="weeklyRent.weeklyRadio > 0 ? 'positive' : 'negative'"
            >
              <count-to
                :startVal="0"
                :endVal="weeklyRent.weeklyRadio"
                :decimals="2"
                :prefix="weeklyRent.weeklyRadio > 0 ? '+' : ''"
                :suffix="'%'"
                :duration="2600"
              ></count-to></el-col
          ></el-row>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="card-panel">
          <div class="title">昨日客单价</div>
          <el-row class="small-font">
            <el-col :span="12">客单价</el-col>
            <el-col :span="6" class="number">
              <count-to
                class="card-panel-num"
                :startVal="0"
                :endVal="yesterdayCustomerRent.amount"
                :duration="2600"
              ></count-to>
            </el-col>
          </el-row>
          <el-row class="tiny-font">
            <el-col :span="12">日环比</el-col>
            <el-col
              :span="6"
              :class="
                yesterdayCustomerRent.dailyRadio > 0 ? 'positive' : 'negative'
              "
            >
              <count-to
                :startVal="0"
                :endVal="yesterdayCustomerRent.dailyRadio"
                :decimals="2"
                :prefix="yesterdayCustomerRent.dailyRadio > 0 ? '+' : ''"
                :suffix="'%'"
                :duration="2600"
              ></count-to>
            </el-col>
          </el-row>
          <el-row class="tiny-font">
            <el-col :span="12">周同比</el-col>
            <el-col
              :span="6"
              :class="
                yesterdayCustomerRent.weeklyRadio > 0 ? 'positive' : 'negative'
              "
            >
              <count-to
                :startVal="0"
                :endVal="yesterdayCustomerRent.weeklyRadio"
                :decimals="2"
                :prefix="yesterdayCustomerRent.weeklyRadio > 0 ? '+' : ''"
                :suffix="'%'"
                :duration="2600"
              ></count-to></el-col
          ></el-row>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="card-panel">
          <div class="title">本周客单价</div>
          <el-row class="small-font">
            <el-col :span="12">客单价</el-col>
            <el-col :span="6" class="number">
              <count-to
                class="card-panel-num"
                :startVal="0"
                :endVal="weeklyCustomerRent.amount"
                :duration="2600"
              ></count-to>
            </el-col>
          </el-row>
          <el-row class="tiny-font">
            <el-col :span="12">周同比</el-col>
            <el-col
              :span="6"
              :class="
                weeklyCustomerRent.weeklyRadio > 0 ? 'positive' : 'negative'
              "
            >
              <count-to
                :startVal="0"
                :endVal="weeklyCustomerRent.weeklyRadio"
                :decimals="2"
                :prefix="weeklyCustomerRent.weeklyRadio > 0 ? '+' : ''"
                :suffix="'%'"
                :duration="2600"
              ></count-to></el-col
          ></el-row>
        </div>
      </el-col>
    </el-row>
    <el-row class="mg-top">
      <el-col :span="24">
        <div class="card-panel card-panel-xl">
          <div class="title">订单统计</div>
          <el-row>
            <div id="line-chart" :style="{ width: '100%', height: '300px' }" ></div>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CountTo from "vue-count-to";
import * as echarts from "echarts";
import elementResizeDetector from "element-resize-detector";
export default {
  name: "PanelGroup",
  data() {
    return {
      yesterdayRent: {
        amount: 53147,
        dailyRadio: -14,
        weeklyRadio: 9.34,
        order: 194
      },
      weeklyRent: {
        amount: 210576,
        weeklyRadio: 26.5
      },
      yesterdayCustomerRent: {
        amount: 253,
        dailyRadio: -10.01,
        weeklyRadio: 3.14
      },
      weeklyCustomerRent: {
        amount: 265,
        weeklyRadio: 265.04
      },
      lineChartData: {
        dateList: [
          "2021/7/23",
          "2021/7/24",
          "2021/7/25",
          "2021/7/26",
          "2021/7/27",
          "2021/7/28",
          "2021/7/29"
        ],
        seriesList: [
          {
            name: "日订单量",
            data: [42, 32, 21, 34, 57, 69, 64]
          },
          {
            name: "日租赁额",
            data: [2210, 1822, 1941, 2324, 2950, 3340, 3101]
          }
        ]
      },
      pieChartData: [
        { value: 72, name: "场地问题" },
        { value: 14, name: "服务问题" },
        { value: 14, name: "其它问题" }
      ],
      barChartData: {
        xAxisData: ["西湖区球场", "昆山区球场", "余杭区球场", "顺城区球场"],
        seriesData: [2181, 795, 1391, 1001]
      },
      pieChart: {},
      barChart: {},
      lineChart: {}
    };
  },
  components: {
    CountTo
  },
  methods: {
    initLineChart() {
      var list = this.lineChartData.seriesList;
      for (var i = 0; i < list.length; ++i) {
        list[i].type = "line";
        list[i].areaStyle = {};
        list[i].emphasis = {};
        list[i].emphasis.focus = "series";
        list[i].yAxisIndex = i;
      }
    },
    drawLineChart() {
      var chartDom = document.getElementById("line-chart");
      this.lineChart = echarts.init(chartDom);
      var option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
          data: ["日订单量", "日租赁额"]
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
          x: 40,
          y: 40,
          x2: 10,
          y2: 10
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: this.lineChartData.dateList
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "日订单量"
          },
          {
            type: "value",
            name: "日租赁额"
          }
        ],
        series: this.lineChartData.seriesList
      };
      option && this.lineChart.setOption(option);
    },
    // drawPieChart() {
    //   var chartDom = document.getElementById("pie-chart");
    //   this.pieChart = echarts.init(chartDom);
    //   var option = {
    //     tooltip: {
    //       trigger: "item"
    //     },
    //     legend: {
    //       bottom: "5%",
    //       left: "center"
    //     },
    //     series: [
    //       {
    //         center: ["50%", "35%"],
    //         type: "pie",
    //         radius: ["30%", "60%"],
    //         avoidLabelOverlap: false,
    //         label: {
    //           show: false
    //         },
    //         labelLine: {
    //           show: false
    //         },
    //         data: this.pieChartData
    //       }
    //     ]
    //   };
    //   option && this.pieChart.setOption(option);
    // },
    // drawBarChart() {
    //   var chartDom = document.getElementById("bar-chart");
    //   this.barChart = echarts.init(chartDom);
    //   var option = {
    //     tooltip: {
    //       trigger: "axis"
    //     },
    //     xAxis: {
    //       type: "category",
    //       data: this.barChartData.xAxisData,
    //       axisLabel: {
    //         rotate: 45
    //       }
    //     },
    //     yAxis: {
    //       type: "value"
    //     },
    //     series: [
    //       {
    //         data: this.barChartData.seriesData,
    //         type: "bar"
    //       }
    //     ],
    //     grid: {
    //       x: 40,
    //       x2: 10,
    //       y: 20
    //     }
    //   };
    //   option && this.barChart.setOption(option);
    // },
    drawCharts() {
      this.drawLineChart();
      // this.drawPieChart();
      // this.drawBarChart();
    }
  },
  mounted() {
    this.initLineChart();
    this.drawCharts();
    // let erd = elementResizeDetector();
    // let _this = this;
    // erd.listenTo(document.getElementById("main"), function() {
    //   _this.pieChart.resize();
    //   _this.barChart.resize();
    //   _this.lineChart.resize();
    // });
  }
};
</script>

<style lang="less" scoped>
.panel-group {
  margin: 10px 0;
}
.card-panel {
  padding: 15px 50px;
  margin-right: 40px;
  border-radius: 20px;
  box-shadow: 0px 0px 15px #fff;
  height: 150px;
  .title {
    font-weight: bold;
    padding: 10px 0;
  }
  .small-font {
    font-size: 15px;
    line-height: 2;
    color: #828495;
    .number {
      color: #4066a2;
      font-size: 20px;
      margin-top: -5px;
    }
  }
  .tiny-font {
    font-size: 10px;
    color: #bbbcc5;
    line-height: 1.5;
    .negative {
      color: #cf0e3a;
    }
    .positive {
      color: #5a901d;
    }
  }
}
.card-panel-s {
  height: 100px;
}
.card-panel-l {
  height: 270px;
}
.card-panel-xl {
  height: 370px;
  padding: 20px;
}
.panel-group > .el-row {
  margin-top: 10px;
}
</style>