<template>
    <div class="shop-mg">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>店铺管理</span>
            </div>
            <div class="text item">
                <el-form :disabled="flage" :model="shopForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="商品名称" prop="name" style="width: 400px">
                        <el-input v-model="shopForm.shopname"></el-input>
                    </el-form-item>

                    <el-form-item label="详细地址" prop="name" style="width: 400px">
                        <el-input v-model="shopForm.address"></el-input>
                    </el-form-item>

                    <el-form-item label="联系电话" prop="name" style="width: 400px">
                        <el-input v-model="shopForm.phone"></el-input>
                    </el-form-item>

                    <el-form-item label="店铺介绍" prop="name" style="width: 400px">
                        <el-input v-model="shopForm.shopdesc"></el-input>
                    </el-form-item>

                    <el-form-item label="店铺标语" prop="name" style="width: 400px">
                        <el-input v-model="shopForm.slogan"></el-input>
                    </el-form-item>

                    <el-form-item label="店铺分类" prop="region">
                        <el-select v-model=" shopForm.category" placeholder="请选择商品分类">
                            <el-option label="蛋糕" value="蛋糕"></el-option>
                            <el-option label="咖啡" value="咖啡"></el-option>
                            <el-option label="火锅" value="火锅"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="店铺特点" prop="type">
                        <el-checkbox-group v-model="shopForm.feature">
                            <el-checkbox label="品牌保证" name="type"></el-checkbox>
                            <el-checkbox label="蜂鸟转送" name="type"></el-checkbox>
                            <el-checkbox label="准时达" name="type"></el-checkbox>
                            <el-checkbox label="新店开铺" name="type"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>

                    <el-form-item label="配送费" style="margin-top: 20px" prop="resource">
                        <el-input-number v-model="shopForm.packingexpense" :min="1" :max="10"
                                         label="描述文字"></el-input-number>
                    </el-form-item>

                    <el-form-item label="起送费" style="margin-top: 20px" prop="resource">
                        <el-input-number v-model="shopForm.minprice" :min="20" label="描述文字"></el-input-number>
                    </el-form-item>

                    <el-form-item label="选择时间" style="margin-top: 20px" prop="resource">
                        <el-date-picker
                                style="margin-right: 20px;"
                                v-model="shopForm.date"
                                type="datetimerange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="店铺头像" prop="type">
                        <el-upload
                                style="margin-top: 10px;"
                                class="avatar-uploader"
                                action="http://127.0.0.1:5000/shop/upload"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload">
                            <img v-if="shopForm.shopAvatar" :src="serveApi+shopForm.shopAvatar" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>

                    <el-form-item label="营业执照">
                        <el-upload
                                style="margin-top: 10px;"
                                class="avatar-uploader"
                                action="http://127.0.0.1:5000/shop/upload"
                                :show-file-list="false"
                                :on-success="handlebussinessSuccess"
                                :before-upload="beforeAvatarUpload">
                            <img v-if="shopForm.businessLicenseImg" :src="serveApi+shopForm.businessLicenseImg" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>

                    <el-form-item label="餐饮许可证">
                        <el-upload
                                style="margin-top: 10px;"
                                class="avatar-uploader"
                                action="http://127.0.0.1:5000/shop/upload"
                                :show-file-list="false"
                                :on-success="handleserveSuccess"
                                :before-upload="beforeAvatarUpload">
                            <img v-if="shopForm.cateringServiceLicenseImg" :src="serveApi+shopForm.cateringServiceLicenseImg" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>

                    <el-form-item label="优惠活动" prop="region">
                        <el-select v-model="shopForm.name" placeholder="请选择优惠" @change="changeoption">
                            <el-option label="满减优惠" value="满减优惠"></el-option>
                            <el-option label="优惠大酬宾" value="优惠大酬宾"></el-option>
                            <el-option label="新用户立减" value="新用户立减"></el-option>
                            <el-option label="进店领券" value="进店领券"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-table
                            :data="shopForm.tableData"
                            style="width: 60%">
                        <el-table-column
                                prop="title"
                                label="活动标题"
                                width="100">
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="活动名称"
                                width="200">
                        </el-table-column>
                        <el-table-column
                                prop="detail"
                                label="活动详情"
                                width="220">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button
                                        size="mini"
                                        type="danger"
                                        @click="delet(scope.$index)"
                                >删除
                                </el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                </el-form>
                <!--按钮-->
                <el-button style="margin-top: 20px;" :type="flage?'primary':'danger'" @click="edit">{{ text }}</el-button>
                <el-button type="success" @click="seva">保存</el-button>


                <!--模态框-->
                <el-dialog :visible.sync="dialogFormVisible">
                    <el-form :model="ActiveForm">
                        <el-form-item label="活动详情">
                            <el-input v-model="ActiveForm.detail" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                        <el-button type="primary" @click="sure">确 定</el-button>
                    </div>
                </el-dialog>

            </div>
        </el-card>
    </div>
</template>
<script>
    import {getshopinfo,editshopinfo} from "../api/shop"

    export default {
        data() {
            return {
                //表单数据
                shopForm: {
                    shopname: "好吃炸鸡店",
                    address: "天府新谷6号楼",
                    phone: "18080942025",
                    shopdesc: "用健康的鸡，做好吃的鸡",
                    slogan: "匠人品质",
                    category: "",
                    feature: ["品牌保证", "蜂鸟转送"],
                    packingexpense: 2,
                    minprice: 22,
                    date: ["2019-10-01 07:10:00", "2019-10-01 20:00:00"],
                    shopAvatar: "",
                    businessLicenseImg: "",
                    cateringServiceLicenseImg: "",
                    name:"",
                    tableData: [
                        // {title:"减",name:"满减优惠",detail:"满30减5，满60减10"},
                        // {title:"特",name:"优惠大酬宾",detail:"会员8折"},
                        // {title:"新",name:"新用户立减",detail:"新用户立减5元"},
                        // {title:"券",name:"进店领券",detail:"领满30-15元券"}
                    ],
                },
                //活动优惠弹框数据
                ActiveForm: {
                    detail: ""
                },
                //表单里面的标题
                title:"",
                //模态框是否显示
                dialogFormVisible: false,
                //表单禁用与否标杆
                flage:true,
                //服务器地址
                serveApi:"http://127.0.0.1:5000/upload/shop/",
            }
        },
        methods: {
            //当优惠选择改变时改变函数
            changeoption(e) {
                this.dialogFormVisible = !this.dialogFormVisible;
                this.shopForm.name=e
            },
            //模态框的确定按钮
            sure(){
                this.dialogFormVisible=!this.dialogFormVisible;
                //优惠表单
                //判断title是什么
                switch (this.shopForm.name) {
                    case "满减优惠":
                        this.title="减";
                        break;
                    case "优惠大酬宾":
                        this.title="惠";
                        break;
                    case "新用户立减":
                        this.title="新";
                        break;
                    case "进店领券":
                        this.title="券";
                        break;
                }
                this.shopForm.tableData.unshift({
                    title:this.title,
                    name:this.shopForm.name,
                    detail:this.ActiveForm.detail
                });
                //清除原先留下的数据
                this.ActiveForm={
                    detail: ""
                }
            },
            //表单里面的删除按钮
            delet(index){
                this.shopForm.tableData.splice(index,1)
            },
            //点击修改按钮，不禁用
            edit(){
                this.flage=!this.flage;
            },
            //获取店铺信息
            async getshopinfo(){
                let {data}=await getshopinfo();
                console.log(data)
                data.feature=JSON.parse(data.feature);
                data.date=JSON.parse(data.date);
                data.tableData=JSON.parse(data.tableData)
                this.shopForm=data
            },
            //店铺图片上传成功 handlebussinessSuccess
            handleAvatarSuccess(res) {
                let{code,imgUrl}=res;
                if(code===0){
                    this.shopForm.shopAvatar=imgUrl
                }
            },
            //营业执照图片上传成功
            handlebussinessSuccess(res) {
                let{code,imgUrl}=res;
                if(code===0){
                    this.shopForm.businessLicenseImg=imgUrl
                }
            },
            //餐饮许可图片上传成功 handlebussinessSuccess
            handleserveSuccess(res) {
                let{code,imgUrl}=res;
                if(code===0){
                    this.shopForm.cateringServiceLicenseImg=imgUrl
                }
            },
            //图片上传前
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            //点击保存发送请求保存
            async seva(){
                // console.log(this.shopForm)
                let data={
                    shopname:this.shopForm.shopname,
                    address:this.shopForm.address,
                    phone:this.shopForm.phone,
                    shopdesc:this.shopForm.shopdesc,
                    slogan:this.shopForm.slogan,
                    category:this.shopForm.category,
                    feature:JSON.stringify(this.shopForm.feature),
                    packingexpense:this.shopForm.packingexpense,
                    minprice:this.shopForm.minprice,
                    date:JSON.stringify(this.shopForm.date),
                    shopAvatar:this.shopForm.shopAvatar,
                    businessLicenseImg:this.shopForm.businessLicenseImg,
                    cateringServiceLicenseImg:this.shopForm.cateringServiceLicenseImg,
                    tableData: JSON.stringify(this.shopForm.tableData)
                }
                await editshopinfo(data);
                this.flage=!this.flage;
                this.getshopinfo()
            }
        },
        computed:{
            text(){
                return this.flage?"修改":"取消"
            }
        },
        created(){
            this.getshopinfo()
        }
    }
</script>

<style lang="less">
    .shop-mg {
        .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
            border-color: #409EFF;
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            line-height: 178px;
            text-align: center;
        }
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }
        .el-dialog {
            width: 30%;
        }
    }
</style>