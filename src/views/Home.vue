<template>
    <div class="home">
        <el-container class="wrap">
           <!--左侧导航-->
            <leftNav/>
            <rightContent/>
        </el-container>
    </div>
</template>

<script>
    //引入自定义组件
    import leftNav from "../components/Layout/LeftNav.vue"
    import rightContent from "../components/Layout/RightContent.vue"

    export default {
        //注册
        components:{
            leftNav,
            rightContent
        }

    }
</script>

<style lang="less" scoped>
.home{
    height: 100%;
    .wrap{
        height: 100%;
        display: flex;
    }
}
</style>