<template>
    <div class="goods-list">
        <el-table
                :data="goodsListData"
                style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="商品名称">
                            <span>{{ props.row.goodsname }}</span>
                        </el-form-item>

                        <el-form-item label="商品 ID">
                            <span>{{ props.row.id }}</span>
                        </el-form-item>

                        <el-form-item label="商品特色">
                            <span>{{ props.row.goodsfeature | fifeature }}</span>
                        </el-form-item>
                        <el-form-item label="是否促销">
                            <span>{{ props.row.isPromotion }}</span>
                        </el-form-item>

                        <el-form-item label="商品规格">
                            <span>{{ props.row.standard | fistandard }}</span>
                        </el-form-item>

                        <el-form-item label="商品分类">
                            <span>{{ props.row.goodscategory }}</span>
                        </el-form-item>

                        <el-form-item label="商品描述">
                            <span>{{ props.row.goodsdesc }}</span>
                        </el-form-item>
                        <el-form-item label="商品图片">
                            <img class="shopImg" :src="serveUrl+props.row.imgUrl "/>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column
                    label="商品 ID"
                    prop="id">
            </el-table-column>
            <el-table-column
                    label="商品名称"
                    prop="goodsname">
            </el-table-column>
            <el-table-column
                    label="描述"
                    prop="goodsdesc">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                            @click="editgoods(scope.row)"
                            size="mini"
                    >编辑</el-button>
                    <el-button
                            @click="delbtn(scope.row)"
                            size="mini"
                            type="danger"
                    >删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <div class="block">
            <el-pagination
                    @current-change="currentPageChange"
                    :page-size="pageSize"
                    :current-page="currentPage"
                    layout="total, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import {getgoodslist,goodsdel} from "../../api/goods"


    export default {
        data(){
            return{
                //服务器地址
                serveUrl: "http://127.0.0.1:5000/upload/goods/",
                //table数据
                goodsListData:[],
                total:0,
                currentPage:1,
                pageSize:3
            }
        },
        created(){
            this.getgooodslist()
        },
        methods:{
            //发送请求
            async getgooodslist(){
                let {data,total}=await getgoodslist({
                    currentPage: this.currentPage,
                    pageSize:this.pageSize
                });
                console.log(data.goodsfeature);
                //回来之前判断data，为空就当前页-1在调用
                if(!data.length && this.currentPage!==1){
                    this.currentPage-=1;
                    this.getgooodslist()
                }

                this.goodsListData=data;
                this.total=total

            },
            //当前页改变
            currentPageChange(page){
                this.currentPage=page;
                this.getgooodslist()
            },
            //删除当前数据
            async delbtn(row){
                //根据Id删
                let {code}=await goodsdel({id:row.id})
                if(code===0){
                    this.getgooodslist()
                }
            },
            //编辑当前信息
            editgoods(row){
                //将信息保存到本地存储
                window.sessionStorage.setItem("editgoodmsg",JSON.stringify(row));
                //跳转到编辑页面
                this.$router.push("/home/goodsedit")
            }
        },
        filters:{
            fifeature(msg){
                return JSON.parse(msg).join(" - ")
            },
            fistandard(msg){
                let arr=JSON.parse(msg)
                //我只要每一项的值
                let newarr=arr.map(v=>`${v.standard}/${v.packagePrice}/${v.price}`)
                //然后用/分隔
                return newarr.join(" - ")
            }
        }
    }
</script>

<style lang="less" scoped>
.goods-list{
    height: 100%;
    background-color: #fff;
    .demo-table-expand {
        font-size: 0;
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
    .block{
        margin-top: 30px;
        margin-left: 10px;
    }
    .shopImg{
        display: inline-block;
        width: 80px;
        height: 80px;
    }
}
</style>