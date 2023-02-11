<template>
    <div class="header">
        <div class="header-left">
            <img src="../assets/img/logo.png" alt="头像">
            <span>快享智能共享租赁平台-商家端</span>
        </div>
        <div class="header-right">
            
            <el-dropdown>
                <div style="display: flex; align-items: center">
                    <div style="display: inline-block; width: 40px; height: 40px;">
                        <img :src="avatar" alt="头像">
                    </div>
                    <span class="ml-10">{{ nickname }}</span>
                    <i class="el-icon-arrow-down el-icon--right"></i>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="UserInfo">个人中心</el-dropdown-item>
                    <el-dropdown-item @click="UserInfo">修改密码</el-dropdown-item>
                    <el-dropdown-item @click.native="loginOut">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            
        </div>
    </div>
</template>

<script>

export default {
    name: 'Header',
    data() {
        return {
            nickname: this.$store.state.user.nickname || '张三',
						avatar: this.$store.state.user.avatar || '../assets/img/avatar.png'
        }
    },
    methods: {
        loginOut() {
            this.$store.commit('clearUser', '');
            window.localStorage.clear();
            this.$router.push('/login')
            this.$message.success('退出成功！')
        },
        UserInfo() {
            this.$router.push('/userInfo')
        }
    }

}
</script>

<style scoped>
.header{
    height: 60px;
    color: #fff;
}

.header-left{
    display: flex;
    align-items: center;
    float: left;
}

.header-left img{
    width: 40px;
}

.header-left span{
    margin-left: 15px;
    font-size: 20px;
    font-weight: bold;
}

.header-right{
    float: right;
}

.header-right img{
    width: 40px;
    border-radius: 50%;
    /* margin-top: 10px;
    position: absolute;
    right: 60px; */
}

.el-dropdown{
    color: #fff;
}

.el-dropdown-selfdefine:hover {
    cursor: pointer;
  }

</style>
