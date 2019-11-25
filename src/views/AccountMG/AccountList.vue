<template>
    <div class="account-list">
        <!--列表渲染区域-->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>账号列表</span>
            </div>
            <div  class="text item">
                <!--表单-->
                <el-table
                        @selection-change="checkChange"
                        :data="accountList"
                        ref="multipleTable"
                        tooltip-effect="dark"
                        style="width: 100%"
                >
                    <el-table-column
                            type="selection"
                            width="80">
                    </el-table-column>
                    <!--prop在table里面是与data里面的数组字段对象，表单自己渲染数据-->
                    <el-table-column
                            prop="account"
                            label="账号"
                            width="160">
                    </el-table-column>
                    <el-table-column
                            prop="userGroup"
                            label="用户组"
                            width="160">
                    </el-table-column>
                    <!--时间用的插槽，scope.row.data内对应字段-->
                    <el-table-column
                            label="创建时间"
                            width="240">
                        <template slot-scope="scope">{{ scope.row.ctime }}</template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    type="primary"
                                    @click="editAccountData(scope.row)"
                            >编辑</el-button>
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="delRowAccount(scope.row)"
                            >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!--分页-->
                <div class="block">
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :page-sizes="[3, 5, 10, 15, 20]"
                            :page-size="3"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
                    </el-pagination>
                </div>
                <!--批量删除和取消选择-->
                <el-button size="mini" type="danger" @click="batchDel">批量删除</el-button>
                <el-button size="mini" type="primary" @click="unselect">取消选择</el-button>
            </div>
        </el-card>
        <!--编辑模态框-->
        <el-dialog width="35%" title="账户修改" :visible.sync="dialogFormVisible">
            <el-form :model="editFrom">
                <el-form-item label="账户名" >
                    <el-input v-model="editFrom.account"  autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户组" v-model="editFrom.userGroup">
                    <el-select v-model="editFrom.userGroup"  placeholder="请选择用户组">
                        <el-option label="超级管理员" value="超级管理员"></el-option>
                        <el-option label="普通管理员" value="普通管理员"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAccount">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    //把axios封装成一个函数，因为在这个页面不止一次调用请求
    //1.先把请求封装函数
    //2.在挂载生命周期钩子函数上调用这个方法
    //3.当点击当前页和改变每页条数时(这两个在element组件上有两个对应的事件)，
    // 页面渲染应该发生变化，所以应该再次发送请求然后渲染，所以应该再次调用请求函数


    //引入api层的请求方法
    import { accountlist , accountdel , batchdelaccount , saveAccountData}from"../../api/account"
    //引入时间格式处理模块
    import moment from "moment"

    export default {
        data(){
            return{
                accountList:[],
                total: 0, // 数据总条数
                currentPage: 1, // 当前页-默认值
                pageSize: 3, // 每页条数-默认值
                checkedData:[],//批量选中数据的id  通过点击选择数据项，这个变量内的值已经是ids了
                dialogFormVisible:false,//模态框显示状态
                editFrom:{//回填数据 和row的整个数据绑定后是一整个数据，只是当前表单只绑定了其中的两个数据

                }
            }
        },
        created(){
            this.usersList();
        },
        methods:{
            //取消选中
            unselect(){
                this.$refs.multipleTable.clearSelection();
            },
            //封装请求函数--获取用户列表
            async usersList(){
                let {data,total}= await accountlist({//传参 返回的数据是当前页对应条数的数据和总条数
                    currentPage: this.currentPage,//当前页
                    pageSize: this.pageSize//每页条数
                });
                //在渲染页面之前判断传回的data数据是否为空，为空就当前页-1(这时候就触发了当前页改变的函数，返回有数据的当前页，就不会走if判断)，然后要排除第一页的情况
                if(!data.length && this.currentPage!==1){
                    this.currentPage-=1;
                    //再次调用刷新页面
                    this.usersList()
                }
                //在获取数据渲染之前，先把时间格式处理了
                data.forEach(v=>v.ctime=moment(v.ctime).format("lll"));
                //将数据和总条数赋值 这样页面才会动态渲染
                this.accountList=data;
                this.total=total;
            },
            //当前页发生变化时
            handleCurrentChange(val){//val是改变后当前页的值自己就传入进去了
                this.currentPage=val;//先把当前的页数
                //然后再次条用请求函数
                this.usersList()
            },
            //当前每页显示条数发生变化时
            handleSizeChange(val){//val是改变后当前页显示条数的值自己就传入进去了
                this.pageSize=val;
                //console.log(this.pageSize)
                //然后再次调用请求函数
                this.usersList()
            },
            //删除单条数据
            async delRowAccount({id}){//row用到了插槽，传过来的就是当前点击的完整数据。然后解构对象，拿到id字段
                let {code,msg}=await accountdel({id});//这里的变量也可以解构
                //做判断
                if(code===0){
                    //然后调用获取获取用户列表
                    this.usersList();
                }else {//失败提示
                    this.$message.error(msg);
                }
            },

            //批量删除数据,在批量删除前，有一个element组件定义的事件，监听选择改变项。
            // 用map循环监听改变到的数据项获取到id 然后返回一个新数组给定义的checkedData变量，变量内就是ids
            checkChange(id){
                this.checkedData=id.map(v=>v.id);//用map是因为，他有返回值且返回一个新的数组。然后赋值给定义好的数组
            },
            //点击批量删除的时候发送请求,优化处理，在没有选择数据项时不发送请求。
            //点击批量删除的时候给用户一点提示信息，弹出模态框确认
            batchDel(){
                if(this.checkedData.length===0){//如果没有选择数据
                    this.$message({
                        type:"warning",
                        message:"请先选择要删除的数据项！"
                    })
                }else {//有选择项
                    //模态框代码
                    this.$confirm('点击确定会永久删除选中数据，是否删除？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(async () => {//点击确定后执行的操作
                        let {code,msg}=await  batchdelaccount({ids:JSON.stringify(this.checkedData)});
                        if(code===0){
                            this.usersList()
                        }
                    }).catch(() => {//点击取消后执行的操作
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }

            },
            //编辑账户数据
            editAccountData(row){//有插槽的作用，传入当前点击的数据,是一整个对象
                this.dialogFormVisible=!this.dialogFormVisible;//模态框显示
                //数据回填，表单一定会有一个：model才能双向绑定数据。然后让row的值等于这个双向绑定的对象，表单内只绑定了账户和用户组
                //注意，这里因为当前行和模态框内的数据是一样的，会造成相互影响，应该使用浅拷贝，拷贝一份新数据用来模态框修改。（数据回填就需要浅拷贝）
                this.editFrom=Object.assign({},row);
            },
            //保存编辑后账户数据
            async saveAccount(){
                this.dialogFormVisible=false;
                let{id,account,userGroup}=this.editFrom;
                let {code,msg}=await saveAccountData({id,account,userGroup});
                if(code===0){
                    this.$message({
                        type:"success",
                        message:msg
                    });
                    this.usersList()
                }else {
                    this.$message.error(msg)
                }
            }

        }
    }
</script>

<style lang="less" scoped>
.account-list{
    .block{
        margin:20px 0;
    }
    .el-input{
        width: 217px;
    }
}
</style>