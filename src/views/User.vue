<template>
    <div class="user">
        <el-form :inline="true" :model="formInline" class="demo-form-inline" @keyup.enter.native="searchBtn">
            <el-form-item label="用户ID">
                <el-input v-model="formInline.userId" placeholder="用户ID"></el-input>
            </el-form-item>
            <el-form-item label="用户昵称">
                <el-input v-model="formInline.nickname" placeholder="用户昵称"></el-input>
            </el-form-item>
            <el-form-item label="用户账号">
                <el-input v-model="formInline.identifier" placeholder="用户账号"></el-input>
            </el-form-item>
            <div style>
                <el-button type="primary" @click="searchBtn">查询</el-button>
                <el-button @click="clearUserBtn">重置</el-button>
            </div>
        </el-form>
        <el-table :data="tableData" style="width: 100%" v-loading="loading">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item label="手机号">
                        <span>{{ formatName(props.row.phone) }}</span>
                    </el-form-item>
                    <el-form-item label="邮箱">
                        <span>{{ formatName(props.row.email) }}</span>
                    </el-form-item>
                    <el-form-item label="性别">
                        <span>{{ sexJudeg(props.row.gender) }}</span>
                    </el-form-item>
                    <el-form-item label="地址">
                        <span>{{ formatCity(props.row) }}</span>
                    </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
                <el-table-column label="序号" type="index"></el-table-column>
                <el-table-column label="用户 ID" prop="id"></el-table-column>
                <el-table-column label="用户昵称" prop="nickname"></el-table-column>
                <el-table-column label="用户账号" prop="identifier" :formatter="formatIdentifier"></el-table-column>
                <el-table-column label="用户信用积分" prop="comprehensive_score"></el-table-column>
                <el-table-column label="信用等级" prop="credit_grade">
                    <template slot-scope="scope">
                        <el-tag>
                            {{ creditGrade(scope.row.credit_grade) }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" prop="create_time" :formatter="formatter"></el-table-column>
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
    </div>
</template>

<script>
import Util from '../utils/utils.js';
import { CodeToText, TextToCode } from 'element-china-area-data'
export default {
    name: 'User',
     data() {
      return {
        tableData: [],
        total: 20,
        pageNum: 1,
        pageSize: 10,
        currentPage: 1,
        loading: false,
        formInline: {
            userId: '',
            nickname: '',
            identifier: ''
        },
        creditGradeType: ''
      }
    },
    computed: {
        sexJudeg: function() {
            return (gender) => {
                return Util.sexJudge(gender)
            }
        },
        formatName: function() {
            return (val) => {
                if(null != val && val != undefined){
                    var pat=/(\d{3})\d*(\d{4})/;
                    return val.replace(pat,'$1****$2');
                } else {
                    return "";
                }
            }
        },
        creditGrade: function() {
            return (val) => {
                return Util.creditLevel(val)
            }
        },
        formatCity: function() {
            return (val) => {
                return CodeToText[val.province] + ' ' + CodeToText[val.city]
            }
        }
    },
    created() {
        this.load()
        this.getUserTotal()

    },
    methods: {
        formatter(row,column) {
            return row.create_time.replace("T", " ").slice(0,19)
        },
        formatIdentifier(row, column) {
            let val = row.identifier;
            if(null != val && val != undefined){
                var pat=/(\d{3})\d*(\d{4})/;
                return val.replace(pat,'$1****$2');
            } else {
                return "";
            }
        },
        currentChangePage(pageNum, pageSize) {

        },
        load() {
            this.loading = true;
            this.request.post('api/user/getUser', {
                pageNum: this.pageNum,
                pageSize: this.pageSize,
                id: this.$store.state.user.id,
								userId: this.formInline.userId,
                nickname: this.formInline.nickname,
                identifier: this.formInline.identifier
            }).then((res) => {
                this.tableData = res.data;
                
            }).catch(err => {
							console.log(err)

						}).finally(() => {
							this.loading = false;
						})
        },
        getUserTotal() {
            this.request.post('/api/user/userCount', {
                id: this.$store.state.user.id
            }).then((res) => {
                    this.total = res.data[0].num
                    // console.log(res)
                }).catch((err) => {
                    console.log(err);
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
        searchBtn() {
						this.load()
            this.getUserTotal()
        },
        clearUserBtn() {
					this.formInline = {
							userId: '',
							nickname: '',
							identifier: ''
						}
            this.load()
            this.getUserTotal()
        }
    }
}
</script>

<style lang="less" scoped>
  .user{
        width: 100%;
        padding: 10px 20px;
    }
  .demo-table-expand {
    font-size: 0;
    padding-left: 20px;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .el-table__expanded-cell{
      padding-left: 20px;
  }
  .demo-form-inline{
    background-color: #fff;
    margin-bottom: 5px;
    height: 60px;
    padding: 5px 10px;
    display: flex;
    align-items: center;
  }
  .demo-form-inline .el-form-item {
      margin-bottom: 0px;
  }
  .el-pagination{
      float: right;
  }
</style>
