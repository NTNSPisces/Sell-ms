<template>
    <div class="edit-pwd">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>修改密码</span>
            </div>
            <div class="text item">
                <el-form  :model="editpwdData" :rules="rules" status-icon  ref="editPwdFrom" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="原密码" prop="oldPwd">
                        <el-input v-model="editpwdData.oldPwd"  autocomplete="off" ></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="newPwd">
                        <el-input
                                @click.native="changNewType"
                                :suffix-icon="newPwdisOpen?'iconfont icon-xianshimima':'iconfont icon-buxianshimima'"
                                v-model="editpwdData.newPwd" :type="newPwdisOpen?'text':'password'"  autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="confirmPwd">
                        <el-input
                                @click.native="changconfirmPwdType"
                                :suffix-icon="confirmPwdisOpen?'iconfont icon-xianshimima':'iconfont icon-buxianshimima'"
                                v-model="editpwdData.confirmPwd" :type="confirmPwdisOpen?'text':'password'" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click.native="determineForm" @click="sureEditPwd">确定</el-button>
                        <el-button @click="resetForm">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>
<script>
    //引入正则
    import {reg} from "../../utils/reg"
    //引入请求函数
    import {oldPwd,editPwd} from "../../api/account"
    //引入本地存储函数
    import local from "../../utils/local"

    export default {
        data(){
            //自定义规则
            const vailoldpwd=async (rule,value,callback)=>{
                if(value===""){
                    callback(new Error("原密码不能为空"));
                }else {
                    //发送原密码验证请求
                    let {code,msg}=await oldPwd({oldPwd:this.editpwdData.oldPwd});
                    if(code==="11"){
                        callback(new Error("原密码不正确"))
                    }
                    callback()
                }
            };
            const vailnewpwd=(rule,value,callback)=>{
               if(value===""){
                   callback(new Error("新密码不能为空"));
               }else if(!rule.params.test(value)){
                   callback(new Error("密码只能输入6-20个字母、数字、下划线"))
               }else if(value===this.editpwdData.oldPwd){
                   callback(new Error("新密码不能与旧密码相同"));
               } else {
                   if(this.editpwdData.confirmPwd!==""){//如果再次输入密码不为空
                       this.$refs.editPwdFrom.validateField('confirmPwd');//失焦再次触发某个字段的验证
                   }
                   callback()
               }
            };
            const vailconfirmPwd=(rule,value,callback)=>{
                if(value===""){
                    callback(new Error("确认密码不能为空"));
                }else if(!(value===this.editpwdData.newPwd)){
                    callback(new Error("两次密码不一致"))
                } else {
                    callback()
                }
            };

            return{
                editpwdData:{
                    oldPwd:"",
                    newPwd:"",
                    confirmPwd:""
                },
                newPwdisOpen:false,
                confirmPwdisOpen:false,
                rules: {
                    oldPwd: [
                        {required: true,validator:vailoldpwd,trigger:"blur"}
                    ],
                    newPwd: [
                        {required: true,validator:vailnewpwd,trigger:"blur",params:reg()}
                    ],
                    confirmPwd: [
                        {required: true,validator:vailconfirmPwd,trigger:"blur"}
                    ]
                }
            }
        },
        methods:{
            changNewType(e){
                if(e.target.className.includes("el-input__icon")){
                    this.newPwdisOpen=!this.newPwdisOpen;
                }
            },
            changconfirmPwdType(e){
                if(e.target.className.includes("el-input__icon")){
                    this.confirmPwdisOpen=!this.confirmPwdisOpen;
                }
            },
            resetForm(){
                this.$refs.editPwdFrom.resetFields();
            },
            determineForm(){
                this.$refs.editPwdFrom.validate(vali=>{
                    if(vali){
                        console.log("修改密码成功")
                        console.log(this.editpwdData)
                    }else {
                        return false;
                    }
                })
            },
            //修改密码
            async sureEditPwd(){
                let {code}=await editPwd(this.editpwdData);
                //修改成功后，消除本地存储然后跳转到登录页面
                if(code===0){
                    local.clear();
                    this.$router.push("/login")
                }
            }
        }
    }
</script>

<style lang="less" scoped>
.edit-pwd{
    .item{
        width: 40%;
    }
}
</style>