<template>
	<div class="business">
		<el-form :label-position="labelPosition" :inline="true" :model="formBusinessSearchData" class="demo-form-inline" @keyup.enter.native="handleSearch">
        <el-row>
            <el-col :span='6'>
                <el-form-item label="店铺名称">
                    <el-input v-model="formBusinessSearchData.business_name" placeholder="店铺名称"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span='12'>
                <el-form-item label="创建时间">
									<el-date-picker
										v-model="formBusinessSearchData.create_time"
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
        <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAddBusiness">新增产品</el-button>
            <el-table :data="tableData"  style="width: 100%" v-loading="loading">
                <el-table-column label="序号" type="index" width="50"></el-table-column>
                <el-table-column prop="id" label="店铺ID" width="80"></el-table-column>
                <el-table-column prop="business_name" label="店铺名称" width="150"></el-table-column>
                <el-table-column prop="business_describe" label="店铺描述" width="200" show-overflow-tooltip>
									
								</el-table-column>
                <el-table-column label="店铺地址" width="130">
									<template slot-scope="scope">
                        {{ formatAddress(scope.row) }}
									</template>
								</el-table-column>
                <el-table-column prop="create_time" label="创建时间" width="250"></el-table-column>
								<el-table-column label="审核进度" width="300">
									<template slot-scope="scope">
										{{ shopAuditStatus(scope.row.auditStatus) }}
										<el-steps :space="200" :active="1" finish-status="success">
											<el-step title="审核中"></el-step>
											<el-step title="审核失败"></el-step>
											<el-step title="审核通过"></el-step>
										</el-steps>
									</template>
								</el-table-column>
                <el-table-column
									fixed="right"
                    label="操作"
                    width="190">
                    <el-button @click.native.prevent="handleShow(scope.row)" type="text">
                        查看
                    </el-button>
                    <el-button @click="handleEdit(scope.row)" type="text" style="margin-left: 16px;">
                        编辑
                    </el-button>
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
            custom-class="addbusinessdialog">
            <el-form :model="formBusinessData" :label-position="labelPosition" label-width="80px">
                <el-form-item label="店铺名称">
                    <el-input v-model="formBusinessData.business_name" :disabled="disabled"></el-input>
                </el-form-item>
								<el-form-item label="店铺描述">
									<el-input :disabled="disabled" type="textarea" v-model="formBusinessData.business_describe" maxlength="100" show-word-limit></el-input>
								</el-form-item>
								<el-form-item label="店铺地址" class="address">
									<el-cascader
											size="large"
											:options="options"
											v-model="selectedOptions"
											@change="handleChange">
									</el-cascader>
									<el-input v-model="formBusinessData.address" class="address-input"></el-input>
								</el-form-item>
                <el-form-item label="店铺图片" prop="imgList">
                    <ImgUpload v-model="imgList" :disabled="disabled" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSure"  :disabled="disabled">确 定</el-button>
            </div>
        </el-dialog>
	</div>
</template>

<script>
import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'
import ImgUpload from '../components/ImgUpload.vue'
import Util from '../utils/utils.js';
export default {
	name: 'Business',
	components: { ImgUpload },
	data() {
		return {
			labelPosition: 'right',
			pageSize: 10,
			currentPage: 1,
			loading: false,
			drawerLoading: false,
			total: 20,
			loading: false,
			dialogTitle: '新增店铺',
			dialogFormVisible: false,
			options: regionData,
			disabled: false,
			formBusinessSearchData: {
				business_name: '',
				create_time: '',
			},
			tableData: [],
			formBusinessData: {
				business_name: '',
				business_describe: '',
				province: '',
				city: '',
				area: '',
				address: '',
				business_url: ''
			},
      selectedOptions: [],
			imgList: [],
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
	computed: {
		notification(msg) {
			this.$notify.error({
				title: '错误',
				message: msg
			});
		},
		formatAddress: function(){
			return (val) => {
				return val.province
			}
		},
		shopAuditStatus: function() {
			return (val) => {
				return val.province
			}
		}
	},
	mounted() {
		
	},
	created() {
		this.load()
	},
	methods: {
		load() {
			this.loading = true
			this.request.post('/api/business/getBusiness', {
				id: this.$store.state.user.id,
				pageNum: this.currentPage,
				pageSize: this.pageSize,
				...this.formBusinessSearchData
			}).then(res => {
				console.log(res)
				this.tableData = res.data
			}).catch(err => {
				this.notification(err)
			}).finally(() => {
				this.loading = false
			})
		},
		handleSearch() {

		},
		handleClear() {
			this.formBusinessData = {
				business_name: '',
				create_time: ''
			}
			this.load()
		},
		handleAddBusiness() {
			this.dialogTitle = '新增产品'
			this.dialogFormVisible = true
		},
		handleShow(val) {
			this.dialogTitle = '查看'
			this.dialogFormVisible = true

		},
		handleEdit(val) {
			this.dialogTitle = '编辑'
			this.dialogFormVisible = true

		},
		handleSure(){
			
		},
		handleSizeChange(val) {
			this.pageSize = val;
			this.load()
		},
		handleCurrentChange(val) {
			this.currentPage = val;
			this.load()
		},
		handleChange (value) {
			this.formBusinessData.province = value[0]
			this.formBusinessData.city = value[1]
			this.formBusinessData.area = value[2]
		},
	},
};
</script>

<style lang="less">
.business{
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
.addbusinessdialog{
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
		.el-input.el-input--large.el-input--suffix{
			width: calc(100% - 5px);
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
	.address{
		.el-cascader.el-cascader--large{
				width: 250px;
				margin-right: 10px;
		}
		.address-input{
				width: calc(100% - 290px);
		}
	}
    .el-select{
        width: 100%;
    }
		.business_describe{
			overflow: hidden !important;
		white-space: nowrap !important;
		text-overflow: ellipsis !important;
		}
}
</style>