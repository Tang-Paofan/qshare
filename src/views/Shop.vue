<template>
    <div class="shop">
      <el-form :label-position="labelPosition" :inline="true" :model="shopSearch" class="demo-form-inline" @keyup.enter.native="handleSearch">
        <el-row>
            <el-col :span='6'>
                <el-form-item label="产品名称">
                    <el-input v-model="shopSearch.shop_name" placeholder="产品名称"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span='6'>
                <el-form-item label="品牌名称">
                    <el-input v-model="shopSearch.brand_name" placeholder="品牌名称"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span='6'>
            <el-form-item label="产品状态">
                <el-select v-model="shopSearch.status" placeholder="请选择">
                    <el-option
                    v-for="item in shopStatusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            </el-col>
            <el-col :span='6'>
                <el-form-item label="产品编号">
                    <el-input v-model="shopSearch.shop_code" placeholder="产品编号"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span='6'>
                <el-form-item label="审核状态">
                    <el-select v-model="shopSearch.audit_status" placeholder="请选择">
                        <el-option
                        v-for="item in shopAuditStatusList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span='12'>
            <el-form-item label="生产时间">
                <el-date-picker
                v-model="shopSearch.production_date"
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
      <el-card class="box-card">
        <el-button type="primary" size="small"  @click="handleAddShop">新增产品</el-button>
        <el-popconfirm
					confirm-button-text='确定'
					cancel-button-text='取消'
					icon="el-icon-info"
					icon-color="red"
					title="此操作不可逆，您想好了吗？"
					@confirm="handleDelete"
				>
					<el-button type="primary" slot="reference" size="small" icon="el-icon-minus">批量删除</el-button>
				</el-popconfirm>
        <el-button type="primary" size="small" icon="el-icon-edit" @click="handleHeaderEdit">修改</el-button>
            <el-table :data="tableData"  style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange">
							<el-table-column type="selection" width="55"></el-table-column>
                <el-table-column label="序号" type="index" width="50"></el-table-column>
                <el-table-column prop="shop_name" label="产品名称" width="150"></el-table-column>
                <el-table-column prop="brand_name" label="品牌名称" width="130"></el-table-column>
                <el-table-column prop="shop_code" label="产品编号" width="250"></el-table-column>
                <el-table-column prop="production_date" label="生产日期" width="200">
                    <template slot-scope="scope">
                        {{ timeFormat(scope.row.production_date) }}
                    </template>
                </el-table-column>
                <el-table-column label="产品类别" width="120">
                    <template slot-scope="scope">
                        <el-tag type="success">
                            {{ categoryType(scope.row.category) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="产品状态" width="">
									<template slot-scope="scope">
										{{ shopStatus(scope.row.status) }}
									</template>
								</el-table-column>
								<el-table-column label="审核状态" width="">
									<template slot-scope="scope">
										{{ shopAuditStatus(scope.row.audit_status) }}
									</template>
								</el-table-column>
                <el-table-column
								fixed="right"
                    label="操作"
                    width="190">
                    <template slot-scope="scope">
                    <el-button @click.native.prevent="handleShow(scope.row)" type="text">
                        查看
                    </el-button>
                    <el-button @click="handleEdit(scope.row)" type="text" style="margin-left: 16px;">
                        编辑
                    </el-button>
                    <el-button @click="handleHistory(scope.row)" type="text" style="margin-left: 16px;">
                        修改历史
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
        </el-card>
        

        <el-dialog :title="dialogTitle" 
            :visible.sync="dialogFormVisible" 
            :modal="true"
            append-to-body
            :close-on-click-modal="false"
            :lock-scroll="true"
            custom-class="addshopdialog">
            <el-form :model="formShopData" :label-position="labelPosition" label-width="80px">
                <el-form-item label="产品名称">
                    <el-input v-model="formShopData.shop_name" :disabled="disabled"></el-input>
                </el-form-item>
								<el-form-item label="产品编号">
                    <el-input :disabled="disabled" v-model="formShopData.shop_code" style="width: calc(100% - 140px);margin-right: 10px;" placeholder="产品编号唯一，请谨慎输入"></el-input>
										<el-button @click="selectCode"  :disabled="disabled">一键生成</el-button>
                </el-form-item>
								<el-form-item label="产品类别">
									<el-select :disabled="disabled" v-model="formShopData.category" placeholder="请选择" filterable class="addShopBusiness">
                        <el-option
													v-for="item in categoryList"
													:key="item.value"
													:label="item.label"
													:value="item.value">
                        </el-option>
                    </el-select>
								</el-form-item>
								<el-form-item label="品牌名称">
									<el-input v-model="formShopData.brand_name" :disabled="disabled"></el-input>
								</el-form-item>
								<el-form-item label="所属店铺">
									<el-select :disabled="disabled" v-model="formShopData.business_id" placeholder="请选择" filterable class="addShopBusiness">
                        <el-option
													v-for="item in businessIdList"
													:key="item.value"
													:label="item.label"
													:value="item.value">
                        </el-option>
                    </el-select>
								</el-form-item>
								<el-form-item label="产品描述">
									<el-input :disabled="disabled" type="textarea" v-model="formShopData.shop_describe" maxlength="100" show-word-limit></el-input>
								</el-form-item>
								<el-form-item label="租赁价格" class="addShopPrice">
									<el-input :disabled="disabled" v-model="formShopData.rent_price" type="number" placeholder="价格"></el-input>
									<span>/</span>
									<el-input :disabled="disabled" v-model="formShopData.rent_type" placeholder="单位（时、天、半月、月）"></el-input>
								</el-form-item>
								<el-form-item label="生产日期">
									<el-date-picker :disabled="disabled" v-model="formShopData.production_date" type="datetime" placeholder="选择生产日期"></el-date-picker>
								</el-form-item>
                <el-form-item label="产品图片" prop="imgList">
                    <ImgUpload v-model="imgList" :disabled="disabled" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSure"  :disabled="disabled">确 定</el-button>
            </div>
        </el-dialog>

				<el-drawer
					title="历史版本"
					:size="700"
					:visible.sync="drawer"
					:modal="true"
					:append-to-body="true"
					:before-close="handleClose">
					<el-table :data="drawerTableData"  style="width: 100%" v-loading="drawerLoading">
						<el-table-column label="产品名称" prop="shop_name">

						</el-table-column>
						<el-table-column label="修改时间" prop="modified_time">

						</el-table-column>
						<el-table-column label="修改人" prop="nickname">

						</el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
                    <el-button @click="handleShow(scope.row)" type="text">
                        查看
                    </el-button>
                    <el-button @click="handleRecover(scope.row)" type="text" style="margin-left: 16px;">
                        恢复
                    </el-button>
                    </template>
						</el-table-column>
					</el-table>
				</el-drawer>
    </div>
</template>

<script>
import ImgUpload from '../components/ImgUpload.vue'
import Util from '../utils/utils.js';
export default {
    name: 'Shop',
    components: { ImgUpload },
    data() {
        return {
						dialogTitle: '新增产品',
            dialogFormVisible: false,
						disabled: false,
						drawer: false,
            formLabelWidth: '120px',
						multipleSelection: [],
            pageSize: 10,
            currentPage: 1,
            loading: false,
						drawerLoading: false,
            total: 20,
						labelPosition: 'right',
						imgList: [],
            shopSearch: {
                shop_name: '',
                brand_name: '',
                status: '',
                shop_code: '',
                production_date: '',
								audit_status: ''
            },
            formShopData: {
							id: '',
							user_id:'',
							shop_name: '',
							brand_name: '',
							business_id: '',
							shop_describe: '',
							shop_code: '',
							production_date: '',
							shop_url: '',
							rent_price: '',
							rent_type: '',
							category: '',
							status: '',
							audit_status: '',
							modified_time: '',
            },
            tableData: [],
						drawerTableData: [],
            shopStatusList: [
                {
                    label: '下架',
                    value: '1'
                },
                {
                    label: '上架',
                    value: '2'
                },
                {
                    label: '售出',
                    value: '3'
                },
                {
                    label: '租赁中',
                    value: '4'
                }
            ],
            shopAuditStatusList: [
                {
                    label: '审核中',
                    value: '1'
                },
                {
                    label: '审核失败',
                    value: '2'
                },
                {
                    label: '审核成功',
                    value: '3'
                }
            ],
						categoryList: [
							{
								label: '充电宝',
								value: 1
							},
							{
								label: '共享单车',
								value: 2
							},
							{
								label: '游戏卡',
								value: 3
							},
							{
								label: '服装',
								value: 4
							},
							{
								label: '游戏机',
								value: 5
							},
							{
								label: '数码',
								value: 6
							},
							{
								label: '办公用品',
								value: 7
							}
						],
						businessIdList: [],
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
        };
    },
    mounted() {
     
    },
    created() {
			this.load()
			this.getShopTotal()
			this.formatBusiness()
    },
    computed:{
			timeFormat(val) {
				return (val) => {
					return val.replace("T", " ").slice(0,19)
				}
			},
			categoryType: function() {
				return (val) => {
					return Util.category(val)
				}
			},
			shopStatus: function() {
				return (val) =>{
					return Util.shopStatus(val)
				}
			},
			shopAuditStatus: function() {
				return (val) => {
					return Util.shopAuditStatus(val)
				}
			}
    },
    methods: {
        load () {
					this.loading = true
					this.request.post('/api/shop/getShop', {
						id: this.$store.state.user.id,
						pageNum: this.currentPage,
						pageSize: this.pageSize,
						...this.shopSearch
					}).then(res => {
						if (res.code != '200') {
							this.$message.warning(res.msg)
						}
						this.tableData = res.data
					}).catch(err => {
						this.notification(err)
					}).finally(() => {
						this.loading = false
					})
        },
				getShopTotal() {
					this.request.post('/api/shop/getShopTotal', {
						id: this.$store.state.user.id
					}).then(res => {
						if (res.code != '200') this.$message.warning(res.msg)
						this.total = res.data[0].num
					}).catch(err => {
						this.notification(err)
					})
				},
        handleSearch () {
					this.load()
					this.getShopTotal()

        },
        handleClear () {
					this.shopSearch= {
						shop_name: '',
						brand_name: '',
						status: '',
						shop_code: '',
						production_date: '',
						audit_status: ''
					}
					this.load()
					this.getShopTotal()

        },
				handleSure() {
					this.formShopData.shop_url = this.imgList.join(';')
					this.formShopData.user_id = this.$store.state.user.id
					this.formShopData.modified_time = this.formatTime('yyyy-MM-dd hh:mm:ss')
					this.request.post('/api/shop/addShop', {
						...this.formShopData
					}).then(res => {
						this.load()
						if (res.code == '200') this.$message.success(res.msg)
						else this.$message.warning(res.msg)
					}).catch(err => {
						this.notification(err)
					}).finally(() => {
						this.dialogFormVisible = false
					})
				},
				handleAddShop() {
					this.dialogTitle = '新增产品'
					this.dialogFormVisible = true
					this.disabled = false
					this.formShopData = JSON.parse(JSON.stringify(this.formShopData))
				},
				handleHeaderEdit() {
					if (this.multipleSelection.length === 0){
						this.$message('请至少选择一项！')
						return
					} else if(this.multipleSelection.length > 1) {
						this.$message('最多选择一项，请重试！')
						return
					}
					this.dialogTitle = '编辑'
					this.disabled = false
					this.dialogFormVisible = true
					this.formShopData = this.multipleSelection[0]
					if (this.multipleSelection[0].shop_url) this.imgList = this.multipleSelection[0].shop_url.split(';')
				},
        handleShow (val) {
					this.dialogTitle = '查看'
					this.disabled = true
					this.dialogFormVisible = true
					this.formShopData = val
					if (val.shop_url) this.imgList = val.shop_url.split(';')
        },
        handleEdit (val){
					this.dialogTitle = '编辑'
					this.disabled = false
					this.dialogFormVisible = true
					this.formShopData = val
					if (val.shop_url) this.imgList = val.shop_url.split(';')
        },
				handleDelete() {
					if (this.multipleSelection.length === 0){
						this.$message('请至少选择一项！')
						return
					}
					let deleteList = []
					this.multipleSelection.forEach(item => {
						deleteList.push(item.id)
					})
					this.request.post('/api/shop/deleteShopById', {
						deleteList
					}).then(res => {
						this.load()
						if (res.code == '200') this.$message.success(res.msg)
						else this.$message.warning(res.msg)
					}).catch(err => {
						this.notification(err)
					})
				},
        handleHistory (val) {
					this.drawer = true
					this.drawerLoading = true
					this.request.post('/api/shop/getShopHistory', {
						shop_code: val.shop_code
					}).then(res => {
						this.drawerTableData = res.data
					}).catch(err => {
						this.notification(err)
					}).finally(() => {
						this.drawerLoading = false
					})
        },
				handleRecover(val) {
					this.loading = true
					val.modified_time = this.formatTime('yyyy-MM-dd hh:mm:ss')
					let deleteList = []
					deleteList.push(val.id)
					this.request.post('/api/shop/deleteShopById', {
						deleteList
					}).then(res => {
						if (res.code == '200') {
							this.request.post('/api/shop/addShop', {
								...val
							}).then(resq => {
								this.load()
								if (resq.code == '200') this.$message.success("数据恢复成功！")
								else this.$message.warning(resq.msg)
							}).catch(error => {
								this.notification(error)
							})
						}}).catch(err => {
						this.notification(err)
					}).finally(() => {
						this.drawer = false
						this.loading = false
					})
				},
        handleSizeChange(val) {
            this.pageSize = val;
            this.load()
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.load()
        },
				handleSelectionChange(val) {
					this.multipleSelection = val;
				},
				selectCode() {
					let str = 'KFR-35-BP' + new Date().getTime()
					this.formShopData.shop_code = str
				},
				dialogOpen(val) {
					this.dialogFormVisible = true
				},
				handleClose(done) {
					this.drawer = false
				},
				formatBusiness() {
					let businessList = this.$store.state.business
					businessList.forEach((item) => {
						this.businessIdList.push({
							label: item.business_name,
							value: item.id
						})
					})
				},
				notification(msg) {
					this.$notify.error({
						title: '错误',
						message: msg
					});
				},
				formatTime (fmt) { // author: meizz
				var myDate = new Date();
					var o = {
						"M+": myDate.getMonth() + 1, // 月份
						"d+": myDate.getDate(), // 日
						"h+": myDate.getHours(), // 小时
						"m+": myDate.getMinutes(), // 分
						"s+": myDate.getSeconds(), // 秒
						"q+": Math.floor((myDate.getMonth() + 3) / 3), // 季度
						"S": myDate.getMilliseconds() // 毫秒
					};
					if (/(y+)/.test(fmt))
						fmt = fmt.replace(RegExp.$1, (myDate.getFullYear() + "").substr(4 - RegExp.$1.length));
					for (var k in o)
						if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
							return fmt;
				}
    },
    watch: {
    
  },
};
</script>

<style lang="less">
.shop{
    padding: 10px 20px;
    width: calc(100% - 40px);
    .demo-form-inline{
        background-color: #fff;
        margin-bottom: 5px;
        padding: 5px 10px;
    }
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
	.el-card{
		.el-button.el-button--small{
			margin-right: 10px;
		}
	}
}
.addshopdialog{
	border-radius: 10px;
	.el-dialog__header {
		background: #f2f9fd !important;
		border-radius: 10px;
		border-bottom: none;
}
.el-dialog__title {
		font-weight: 500;
		}
	.el-dialog__footer {
			text-align: center;
	}
	.el-dialog__body{
		.el-input{
			width: calc(100% - 30px);
		}
		.el-textarea{
			width: calc(100% - 30px);
		}
	}
	.el-select{
		width: 100%;
	}
	.addShopPrice{
		.el-input{
			display: inline-block;
			width: calc(50% - 22px);
		}
		span{
			display: inline-block;
			margin: 0 5px;
		}
	}
}
.addShopBusiness{
	.el-select-dropdown{
		max-width: 609.6px !important;
	}
}
.el-drawer__body{
	padding: 0 20px;
}


</style>