<template>

    <div>
        <el-breadcrumb style="margin: 30px;">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :inline="true" :model="formInline" style="margin-top:40px;margin-bottom: 10px;margin-left: 35px;">
            <el-form-item label="姓名">
                <el-input v-model="formInline.searchName" placeholder="输入姓名查询"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSearch">查询</el-button>
            </el-form-item>
            <el-form-item style="float: right">
                <el-button style="position: relative; top: 30px;" type="primary" @click="addUser" size="small">新增</el-button>
            </el-form-item>


        </el-form>

        <el-table
                ref="multipleTable"
                @selection-change="s=>{change(s)}"
                :data="tableData"
                border
                style="width: 100%">
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <el-table-column
                    fixed
                    prop="name"
                    label="姓名"
                    width="120">
            </el-table-column>
            <el-table-column
                    :formatter="dateFormat"
                    prop="creatTime"
                    label="注册日期">
            </el-table-column>
            <el-table-column
                    prop="sex"
                    label="性别"
                    width="90">
            </el-table-column>
            <el-table-column
                    prop="phoneNum"
                    label="手机"
                    width="150">
            </el-table-column>

            <el-table-column
                    prop="username"
                    label="登录账号"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="email"
                    label="邮箱"
                    width="230">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="170">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="editUser(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click="editUserRole(scope.row)">角色配置</el-button>
                    <!--<el-button type="text" @click="deleteUser(scope.row,scope.$index)" size="small">删除</el-button>-->
                </template>
            </el-table-column>
        </el-table>
        <div style="margin: 20px;">

            <el-button type="danger" @click="del()">删除</el-button>

            <div style="text-align: right;">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[10, 20, 30, 40]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalCount">
                </el-pagination>
            </div>
        </div>
        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="姓名">
                    <el-input v-model="form.name" style="width:240px;" ></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-select v-model="form.sex" :formatter="formatRole" style="width:120px;">
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="注册时间">
                    <el-col :span="11">
                        <el-date-picker type="text" placeholder="未初始化" v-model="form.creatTime" style="width:240px" disabled="disabled"></el-date-picker>
                    </el-col>
                </el-form-item>

                <el-form-item label="登录账号">
                    <el-input v-model="form.username" style="width:240px;" ></el-input>
                </el-form-item>
                <el-form-item label="联系电话">
                    <el-input v-model="form.phoneNum" style="width:240px;" ></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="form.email" style="width:240px;" ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="角色配置" :visible.sync="userRoleDialog">
            <el-table
                    ref="multipleTable"
                    @selection-change="s=>{change(s)}"
                    :data="roleTable"
                    tooltip-effect="dark"
                    style="width: 100%">
                <el-table-column
                        type="selection"
                        prop="selected"
                        label="配置"
                        width="120">
                </el-table-column>

                <el-table-column
                        prop="name"
                        label="角色名称"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="describe"
                        label="描述"
                        show-overflow-tooltip>
                </el-table-column>
            </el-table>
            <div>
                <el-button type="primary" @click="editRole">修改</el-button>
                <el-button @click="userRoleDialog = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import moment from "moment";
    export default {
        data() {
            return {
                formInline: {
                    searchName: ''
                },
                userRole:{
                    userId:null
                },
                /*选中的组数据*/
                groupId:null,
                pageBean:'',
                totalCount:0,
                currentPage:1,
                pageSize:10,
                tableData: [{
                    id:null,
                    name: null,
                    username: null,
                    sex: null,
                    creatTime: null,
                    phoneNum: null,
                    email: null
                }],
                dialogFormVisible: false,//弹出框是否可见标识
                delType: 1, //弹出框类型：1新增 2编辑,
                dialogTitle: '新增',//弹出框标题
                form: {
                    id:null,
                    name: null,
                    username: null,
                    sex: null,
                    creatTime: null,
                    phoneNum: null,
                    email: null
                },
                userRoleDialog:false,
                roleTable: [{
                    selected:1,
                    id: 1,
                    role: "ROLE_ADMIN",
                    name: "管理员",
                    modules: "4;5;6;7;",
                    describe: "管理员"
                }],
                roleNames:null,
                multipleSelection: []
            }
        },

        mounted(){
            this.init();
        },
        methods: {
            //时间格式化
            dateFormat:function(row, column) {
                var date = row[column.property];
                if (date == undefined) {
                    return "";
                }
                return moment(date).format("YYYY-MM-DD HH:mm:ss");
            },

            /*编辑某个用户按钮*/
            editUser(row){
                this.form = row;
                this.dialogTitle = '编辑';
                this.dialogFormVisible= true;
                this.delType = 2;
            },
            /*新增*/
            addUser() {
                //先清空表单
                this.form.id='';
                this.form.name='';
                this.form.username='';
                this.form.sex='';
                this.form.creatTime='';
                this.form.phoneNum='';
                this.form.email='';
                //配置表单相关信息
                this.dialogTitle = '新增';
                this.dialogFormVisible = true;
                this.delType = 1;

            },
            /*删除单个用户*/
            // deleteUser(row,index) {
            //     this.$confirm('此操作将永久删除用户'+row.name+', 是否继续?', '提示', {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning'
            //     }).then(() => {
            //         this.axios.get('/users/delete?userId='+row.id).then(response => {
            //             this.$message({
            //                 type: response.data.success,
            //                 message: response.data.msg
            //             });
            //             console.log(index);
            //             this.tableData.splice(index, 1);
            //         }).catch(error => {
            //             this.$message({
            //                 type: error.data.success,
            //                 message: error.data.msg
            //             });
            //         });
            //     }).catch(() => {
            //         this.$message({
            //             type: 'info',
            //             message: '已取消删除'
            //         });
            //     });
            // },

            /*查询*/
            onSearch() {
                this.init();
            },

            /*提交编辑、新增*/
            onSubmit() {
                var str = this.delType == 1 ? "创建" : "修改";
                var url = '/users/' + (this.delType == 1 ? "add" : "update");
                console.log("新增窗口提交");
                this.$confirm('确定' + str + this.form.name + ', 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.axios({
                        method: 'put',
                        url: url,
                        data: this.form
                    }).then(response => {
                        this.$message({
                            type: response.data.success,
                            message: response.data.msg
                        });
                        this.dialogFormVisible = false;
                        this.init();
                    }).catch(error => {
                        this.$message({
                            type: error.data.success,
                            message: error.data.msg
                        });
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            },
            /*更换当前页尺寸*/
            handleSizeChange(val) {
                this.pageSize = val;
                this.init();
                console.log(`每页 ${val} 条`);
            },
            /*翻页*/
            handleCurrentChange(val) {
                this.currentPage = val;
                this.init();
                console.log(`当前页: ${val}`);
            },
            /*页面初始化*/
            init() {
                this.axios.get('/users/page',{
                    params:{
                        'name':this.formInline.searchName,
                        'pageSize':this.pageSize,
                        'currentPage':this.currentPage,
                    }
                }).then(response => {
                    this.tableData = response.data.beans;
                    this.currentPage = response.data.currentPage;
                    this.totalCount = response.data.totalCount;

                }).catch(error => {
                    console.log(error.message);
                })
            },
            /*table选择后触发事件*/
            change(e){
                this.setGroupId(e);
            },
            /*通过选中的行设置groupId的值*/
            setGroupId(e){
                this.groupId=[];
                this.count=e.length;
                for (var i = 0; i <= e.length - 1; i++) {
                    this.groupId.push(e[i].id);
                }
            },
            /*删除table中选中的数据*/
            del(){
                if(this.groupId!=null && this.groupId!=""){
                    this.axios({
                        method: 'delete',
                        url: '/users/deletes',
                        data: this.groupId
                    }).then(function (response) {
                        this.groupId=null;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.init();
                    }.bind(this)).catch(function (error) {
                        alert(error);
                    });
                }
            },

            /*角色配置*/
            editUserRole(row){
                this.userRoleDialog= true;
                this.userRole.userId= row.id;
                this.axios.get('/users/role?userId='+row.id).then(response => {
                    var roletables = this.roleTable = response.data.roles;
                    var roleNames = this.roleNames = response.data.roleNames;
                    this.$nextTick(function(){
                        for (let i = 0; i < roleNames.length ; i++) {
                            for (let j = 0; j <roletables.length ; j++) {
                                if(roleNames[i] == roletables[j].role){
                                    this.$refs.multipleTable.toggleRowSelection(this.roleTable[j]);
                                }
                            }
                        }
                    })
                }).catch(error => {
                    this.$message({
                        type: error.data.success,
                        message: error.data.msg
                    });
                });

            },
            editRole(){
                if(this.groupId!=null && this.groupId!=""){

                    this.axios({
                        method: 'put',
                        url: '/users/updateRole/'+this.userRole.userId,
                        data: this.groupId
                    }).then(response => {
                        this.$message({
                            type: response.data.success,
                            message: response.data.msg
                        });
                        this.userRoleDialog= false;
                        this.init();
                    }).catch(error => {
                        this.$message({
                            type: error.data.success,
                            message: error.data.msg
                        });
                    });

                }
            },
        }
    }
</script>