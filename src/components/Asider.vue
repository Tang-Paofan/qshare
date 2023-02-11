<template>
    <el-menu :default-active="$route.path" class="el-menu-vertical-demo" background-color="rgb(190, 190, 190)" text-color="black" active-text-color="#fff" router>
      <el-menu-item index="/home">
        <i class="el-icon-menu"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/user">
        <i class="el-icon-menu"></i>
        <span slot="title">用户详情</span>
      </el-menu-item>
      <el-menu-item index="/dataDisplay">
        <i class="el-icon-menu"></i>
        <span slot="title">数据分析</span>
      </el-menu-item>
      <el-menu-item index="/order">
        <i class="el-icon-menu"></i>
        <span slot="title">订单详情</span>
      </el-menu-item>
      <el-menu-item index="/shop">
        <i class="el-icon-menu"></i>
        <span slot="title">产品管理</span>
      </el-menu-item>
      <el-menu-item index="/business">
        <i class="el-icon-menu"></i>
        <span slot="title">店铺管理</span>
      </el-menu-item>
      <el-menu-item index="/messageInfo">
        <i class="el-icon-menu"></i>
        <span slot="title">消息中心</span>
      </el-menu-item>
    </el-menu>
</template>

<script>

export default {
    name: 'Asider',
    computed: {
    }
}
</script>

<style scoped> 
.el-menu{
    border: 0px;
    height: 100%;
}

.is-active{
  background-color: #545c64 !important;
}

</style>
