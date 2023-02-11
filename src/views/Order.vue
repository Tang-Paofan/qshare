<template>
  <div class="goods-container" style="width:calc(100% - 40px)">
    <el-form :inline="true" :model="orderInput" class="demo-form-inline" @keyup.enter.native="handleSearch">
      <el-row>
        <el-col :span='6'>
          <el-form-item label="顾客昵称">
          <el-input v-model="orderInput.customer_name" placeholder="顾客昵称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span='6'>
          <el-form-item label="订单编号">
          <el-input v-model="orderInput.order_sn" placeholder="订单编号"></el-input>
      </el-form-item>
        </el-col>
        <el-col :span='6'>
          <el-form-item label="支付方式">
            <el-select v-model="orderInput.payment_method" placeholder="请选择">
                <el-option
                  v-for="item in rentTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
      </el-form-item>
        </el-col>
        <el-col :span='6'>
          <el-form-item label="顾客ID">
            <el-input v-model="orderInput.customer_id" placeholder="顾客ID"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='12'>
          <el-form-item label="支付时间">
            <el-date-picker
              v-model="orderInput.pay_time"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <div style="display: inline-block;float: right;margin-right: 12px;">
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleClear">重置</el-button>
        </div>
      </el-row>
    </el-form>
    <el-table :data="tableData"  style="width: 100%" v-loading="loading">
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column prop="customer_id" label="顾客ID" width="100"></el-table-column>
      <el-table-column prop="customer_name" label="顾客昵称" width="200"></el-table-column>
      <el-table-column prop="shop_code" label="产品编号" width="200"></el-table-column>
      <el-table-column prop="shop_name" label="产品名称" width="150"></el-table-column>
      <el-table-column prop="category" label="产品类别" width="150">
        <template slot-scope="scope">
          <el-tag type="success">
          {{ category(scope.row.category) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="order_sn" label="订单编号" width="200"></el-table-column>
      <!-- <el-table-column label="订单地址" width="200">
        <template slot-scope="scope">
         {{ scope.row.province + scope.row.city }}
        </template>
      </el-table-column> -->
      <el-table-column prop="order_money" label="订单金额" width=""></el-table-column>
      <el-table-column prop="district_money" label="优惠金额" width="100"></el-table-column>
      <el-table-column prop="payment_money" label="支付金额" width="100"></el-table-column>
      <el-table-column prop="pay_time" label="支付时间" width="250" :formatter="formatter"></el-table-column>
      <el-table-column prop="payment_method" label="支付方式" width="100">
        <template slot-scope="scope">
          <el-tag effect="dark" type="warning">
          {{ paymentFormat(scope.row.payment_method) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <!-- <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text" size="small">
            查看
          </el-button> -->
          <el-button @click="handleOpen(scope.row)" type="text" style="margin-left: 16px;">
            订单跟踪
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-drawer
      title="订单详情"
      :size="1000"
      :visible.sync="drawer"
      :modal="true"
      :append-to-body="true"
      :before-close="handleClose">
    <el-skeleton :rows="6" animated :loading="loadingDrawer">
    <el-descriptions class="margin-top" :column="2" border style="padding: 0px 20px">
      <el-descriptions-item label="顾客ID">{{ drawerData.customer_id }}</el-descriptions-item>
      <el-descriptions-item label="顾客名称">{{ drawerData.customer_name }}</el-descriptions-item>
      <el-descriptions-item label="产品名">{{ drawerData.shop_name }}</el-descriptions-item>
      <el-descriptions-item label="产品编号">{{ drawerData.shop_code }}</el-descriptions-item>
      <el-descriptions-item label="产品描述" :span="2">{{ drawerData.shop_describe }}</el-descriptions-item>
      <el-descriptions-item label="品牌名称">{{ drawerData.brand_name }}</el-descriptions-item>
      <el-descriptions-item label="产品生产日期">{{ timeFormat(drawerData.production_date) }}</el-descriptions-item>
      <el-descriptions-item label="店铺名">{{ drawerData.business_name }}</el-descriptions-item>
      <el-descriptions-item label="店铺地址">{{ formatCity(drawerData.business_address) }}</el-descriptions-item>
      <el-descriptions-item label="租赁价格">{{ drawerData.rent_price }}</el-descriptions-item>
      <el-descriptions-item label="订单金额">{{ drawerData.order_money }}</el-descriptions-item>
      <el-descriptions-item label="优惠金额">{{ drawerData.district_money }}</el-descriptions-item>
      <el-descriptions-item label="支付金额">{{ drawerData.payment_money }}</el-descriptions-item>
      <el-descriptions-item label="支付方式">{{ paymentFormat(drawerData.payment_method) }}</el-descriptions-item>
      <el-descriptions-item label="支付时间">{{ timeFormat(drawerData.pay_time) }}</el-descriptions-item>

      <!-- <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-mobile-phone"></i>
          手机号
        </template>
        18100000000
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline"></i>
          居住地
        </template>
        苏州市
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-tickets"></i>
          备注
        </template>
        <el-tag size="small">学校</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-office-building"></i>
          联系地址
        </template>
        江苏省苏州
      </el-descriptions-item>
      <el-descriptions-item :span="2">
        <template slot="label">
          <i class="el-icon-office-building"></i>
          联系地址
        </template>
        江苏省苏州
      </el-descriptions-item> -->
    </el-descriptions>
    </el-skeleton>
    </el-drawer>
  </div>
</template>

<script>
import Util from '../utils/utils.js';
import { CodeToText, TextToCode } from 'element-china-area-data'
export default {
  name: 'Order',
  data() {
    return {
      orderInput: {
        order_sn: '',
        customer_id: '',
        customer_name: '',
        payment_method: '',
        pay_time: ''
      },
      rentTypeList: [
          {
            value: 1,
            label: '现金',
          },
          {
            value: 2,
            label: '账户余额',
          },
          {
            value: 3,
            label: '网银',
          },
          {
            value: 4,
            label: '支付宝',
          },
          {
            value: 5,
            label: '微信',
          },
        ],
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
      total: 20,
      pageNum: 1,
      pageSize: 10,
      currentPage: 1,
      drawer: false,
      direction: 'rtl',
      loading: false,
      loadingDrawer: false,
      tableData: [],
      drawerData: {
        // 顾客ID
        customer_id: '',
        customer_name: '',
        shop_name: '',
        // 商品名称
        shop_core: '',
        shop_describe: '',
        brand_name: '',
        production_date: '',
        // 店铺名
        business_name: '',
        business_address: {
          province: '',
          city: '',
          area: '',
          address: ''
        },
        // 租赁价格
        rent_price: '',
        pay_time: '',
        payment_method: '',
        // 订单金额
        order_money: '',
        // 优惠金额
        district_money: '',
        // 支付金额
        payment_money: ''
      }
    }
  },
  created() {
    this.load()
    this.getLeaseTotal()
  },
  computed: {
    category: function() {
      return (val) => {
        return Util.category(val)
      }
    },
    paymentFormat: function() {
      return (val) => {
        return Util.paymentFormat(val)
      }
    },
    timeFormat(val) {
        return (val) => {
          return val.replace("T", " ").slice(0,19)
        }
    },
    formatCity: function() {
      return (val) => {
        return CodeToText[val.province] + ' ' + CodeToText[val.city] + ' ' + CodeToText[val.area] + ' ' + val.address
      }
    }
  },
  methods: {
    load() {
      this.request.post('/api/user/lease', {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        id: this.$store.state.user.id,
        ...this.orderInput
      }).then((res) => {
        this.tableData = res.data
      }).catch((err) => {
        console.log(err)
      })
    },
    getLeaseTotal() {
      this.request.post('/api/user/leaseTotal', {
        id: this.$store.state.user.id,
        ...this.orderInput
      }).then((res) => {
        this.total = res.data[0].num
      }).catch((err) => {
        console.log(err)
      })
    },
    handleSearch() {
      this.load()
      this.getLeaseTotal()
    },
    handleClear() {
      this.orderInput = {
        order_sn: '',
        customer_id: '',
        customer_name: '',
        payment_method: '',
        pay_time: ''
      }
      this.load()
      this.getLeaseTotal()
    },
    handleSizeChange(val) {
        this.pageSize = val;
        this.load()
    },
    handleCurrentChange(val) {
        this.currentPage = val;
        this.load()
    },
    formatter(row,column) {
        return row.pay_time.replace("T", " ").slice(0,19)
    },
    handleOpen(row) {
      this.drawer = true
      this.loadingDrawer = true
       this.request.post('/api/user/leaseInfo', {
        id: row.id
      }).then((res) => {
        if (+res.code === 200) {
          this.drawerData = res.data[0]
          this.drawerData.rent_price = res.data[0].rent_price + '￥/' + res.data[0].rent_type
          let address = {
            province: res.data[0].province,
            city: res.data[0].city,
            area: res.data[0].area,
            address: res.data[0].address
          }
          this.drawerData.business_address = address
          return
        }
        return Promise.reject(res.msg)
      }).catch((err) => {
        console.log(err)
        // this.drawer = false
      }).finally((res) => {
        this.loadingDrawer = false
      })
    },
    handleClose(done) {
      this.drawer = false
    //   this.$confirm('确认关闭？')
    //     .then(_ => {
    //       done();
    //     })
    //     .catch(_ => {});
    }
  }
}
</script>

<style lang="less">
.goods-container {
  padding: 10px 20px;
  width: 100%;
  .el-form-item{
    width: 100%;
    .el-form-item__label{
      width: 70px;
    }
    .el-form-item__content{
      width: calc(100% - 80px);
    }
    .el-select{
      width: 100%;
    }
  }
  .el-pagination{
      float: right;
  }
  .demo-form-inline{
    background-color: #fff;
    margin-bottom: 5px;
    padding: 5px 10px;
  }
}

</style>