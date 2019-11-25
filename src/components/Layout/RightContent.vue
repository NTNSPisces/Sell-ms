<template>
    <el-container class="right-content">
       <right-header/>
        <el-main class="r-c-main">
            <!--路由出口-->
            <router-view/>
        </el-main>
    </el-container>
</template>
<script>
    import RightHeader from "./RightHeader.vue"

    export default {
        components:{
            RightHeader
        }
    }
</script>

<style lang="less" scoped>
    .right-content{
        flex: 1;
        display: flex;
        flex-direction: column;
        .r-c-main{
            flex: 1;
            background-color: #F0F2F5;
        }
    }
</style>