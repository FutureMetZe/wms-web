<template>
    <div class="table">
        <div class="">
            <el-button-group style="margin-bottom: 15px;margin-left: 12px;margin-top: 4px;">
                <el-button type="primary" icon="el-icon-circle-plus" @click="handleAddRole">添加</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="deleteMethod" style="margin-left: 20px;">删除选中</el-button>
            </el-button-group>
        </div>
        <div class="container">
            <el-table :data="tableData" stripe   style="width: 100%" @selection-change="checkBoxChange">
                <el-table-column type="selection"  @selection-change="checkBoxChange">
                </el-table-column>
                <el-table-column  label="角色名" >
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>角色: {{ scope.row.role }}</p>
                            <p>管理模块编号: {{ scope.row.modules }}</p>
                            <div slot="reference" class="name-wrapper">
                                <el-tag size="medium">{{ scope.row.name }}</el-tag>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="describe" label="描述" >
                </el-table-column>
                <el-table-column  label="操作" >
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary"
                                   @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger"
                                   @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        <el-button size="mini" type="info"
                                   @click="setting(scope.$index, scope.row)" icon="el-icon-setting"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination" style="text-align: right;">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :page-size="pageInfo.pageSize"
                        :page-sizes="[5, 10, 15, 20]"
                        :current-page="currentPage"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
        </div>
        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteMethod">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 新增弹出框 -->
        <el-dialog  :title="dialogTitle" :visible.sync="addVisible" width="40%" v-loading="addLoading">
            <el-form ref="form" :model="form" :rules="commonRules"  status-icon label-width="70px">
                <el-form-item label="角色名" prop="name" >
                    <el-input  v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="describe" >
                    <el-input v-model="form.describe"></el-input>
                </el-form-item>
                <input type="hidden" name="id" value="form.id"/>
                <input type="hidden" name="role" value="form.role"/>
                <input type="hidden" name="modules" value="form.modules"/>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button type="button" @click="resetForm('form')">取 消</el-button>
            <el-button type="primary" @click="dealRole('form')">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 新增弹出框 -->
        <el-dialog  title="配置权限" :visible.sync="settingVisible" width="40%" v-loading="addLoading">
            <el-table :data="settingsData" border    style="width: 100%" >
                <el-table-column prop="name" label="权限" >
                </el-table-column>
                <el-table-column  label="操作" >
                    <template slot-scope="scope">
                        <el-switch
                                v-model="scope.row.value"
                                active-color="#2d8cf0"
                                inactive-color="#ccc">
                        </el-switch>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
            <el-button type="button" @click="concleSetting">取 消</el-button>
            <el-button type="primary" @click="okSetting">确 定</el-button>
        </span>
        </el-dialog>

    </div>
</template>
<script>
	export default {
		name: "roleList",
		data() {
			return {
				tableData: [],
				//删除提示框
				settingVisible: false,
				delVisible: false,
				addVisible: false,
				form: { id:'', name:'', describe:'', role:'', modules:''},
				tempForm:[],
				total:0,
				pageInfo:{
					page:0,
					pageSize:10
				},
				currentPage: 2,
				addLoading:false,
				dialogTitle:'新增',
				delType:1, //1新增 2编辑,
				groupId:[],
				/*二级菜单列表*/
				submenusList:[],
               //存放权限管理的table数据
				settingsData:[],
				selectRole:null,
				commonRules: {
					name:[
						{ required: true, message: '名称不能为空'},
						{ min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}],
					describe:[
						{ required: false, message: '名称不能为空'},
						{ min: 0, max: 100, message: '字数在100 个字符以内', trigger: 'blur'}
					]
				}
			}
		},
		methods: {
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
				this.pageInfo.pageSize = val;
				this.getRoleList({
					"pageInfo":this.pageInfo
				});
			},
			resetForm(formName){
				this.$refs[formName].resetFields();
				this.initRoleNew();
				this.addVisible = false;
				this.dialogTitle = '新增';
				this.tempForm = [];
			},
			// 分页处理事件
			handleCurrentChange(val) {
                 this.pageInfo.page = val-1;
				let param = {
					"pageInfo":this.pageInfo
				}
				this.getRoleList(param);
			},
			getRoleList(e){
				this.axios({
					method: 'get',
					url: '/role/roles',
					params: {
						'page':e.pageInfo.page,
						'pageSize':e.pageInfo.pageSize
					}
				}).then((response)=>{
					this.tableData=response.data.data;
					this.total=response.data.totalCount;
				}).catch(function (error) {
					alert(error);
				});
			},
			handleAddRole(){
				this.initRoleNew();
				this.addVisible = true;
				this.dialogTitle = '新增';
				this.delType = 1;
			},
			handleEdit(index, row) {
				this.tempForm = this.tableData[index];
				this.formToForm();
				console.log(this.tempForm)
				this.addVisible = true;
				this.dialogTitle = '编辑';
				this.delType = 2;
				console.log(index, row);
			},
			// 保存编辑
			saveEdit(form,id) {
				this.$refs[form].validate((valid)=>{
					if(valid){
						this.axios({
							method: 'put',
							url: '/role/roles/' + this.form.id,
							data: this.form
						}).then(function (response) {
							this.addVisible = false;
							this.$message.info('修改成功');
							this.initRoleNew();
							this.getRoleList({
								"pageInfo":this.pageInfo
							});
							this.$refs[form].resetFields();
						}.bind(this)).catch(function (error) {
							alert('操作错误' + error);
						});
					}else{
						console.log('存在字段不符合要求，修改后重试!!');
						return false;
					}
				})

			},
			addRole(form){
				this.$refs[form].validate((valid)=>{
					if(valid){
						this.axios({
							method: 'post',
							url: '/role/roles/role',
							data: this.form
						}).then(function (response) {
							this.addVisible = false;
							this.$message.info('新建成功');
							this.initRoleNew();
							this.getRoleList({
								"pageInfo":this.pageInfo
							});
							this.$refs[form].resetFields();
						}.bind(this)).catch(function (error) {
							alert('操作错误' + error);
						});
					}else{
						console.log('存在字段不符合要求，修改后重试!!');
						return false;
					}

				})
			},
			//点击删除按钮
			handleDelete(index, row) {
				this.groupId.push( row.id);
				this.delVisible = true;
			},
			deleteRole(ids){
				//console.log(ids)
				this.axios({
					method: 'delete',
					url: '/role/roles',
					data: ids
				}).then(function (response) {
					this.groupId=null;
					this.delVisible = false;
					this.getRoleList({
						"pageInfo":this.pageInfo
					});
					this.$message.info('删除成功');
				}.bind(this)).catch(function (error) {
					alert(error);
				});
			},
			deleteMethod() {
				//console.log(this.groupId);
				let ids = [];
				for(let i = 0;i <this.groupId.length; i++){
					ids.push(this.groupId[i].id);
				}
				// console.log(ids);
				this.checkSelectIds(ids);
				return false;

			},
			checkSelectIds(ids){
				this.axios({
					method: 'post',
					url: '/role/check',
					data: ids
				}).then((data)=>{
					// console.log('data: ',data);
					if(data.data.status === 0) {
						this.deleteRole(ids);
					}else {
						//	console.log(data.data,typeof  data.data)
						this.$message.warning('选中的角色中有正在被使用的，删除失败')
					}
				})
			},
			dealRole(formName){
				if(this.delType === 1) {
					this.addRole(formName);
				}else if(this.delType === 2) {
					this.saveEdit(formName);
				}
			},
			formToForm(){
				this.form.name = this.tempForm.name;
				this.form.id = this.tempForm.id;
				this.form.role = this.tempForm.role;
				this.form.modules = this.tempForm.modules;
				this.form.describe = this.tempForm.describe;
			},
			initRoleNew(){
				this.form.describe = '';
				this.form.name = '';
				this.form.describe = '';
				this.form.id = '';
				this.form.role = '';
			},
			checkBoxChange(val){
				this.groupId = val;
			},
			okSetting(){
				var temp = "";
				for(var i in this.settingsData){
					if(this.settingsData[i].value == true){
						temp = temp + this.settingsData[i].id+";";
					}
				}
				this.selectRole.modules = temp;
				this.axios({
					method: 'put',
					url: '/role/roles/'+this.selectRole.id,
					data: this.selectRole
				}).then(function (response) {
					this.cleanSetting();
					this.getRoleList({
						"pageInfo":this.pageInfo
					});
					this.$message.info('配置成功');
				}.bind(this)).catch(function (error) {
					alert(error);
				});
			},
			setting(index,row){
				// this.roleModifySet(e);
				let e = row;
				this.selectRole = this.tableData[index];
				console.log('selectRole: ',this.selectRole);
                let moduleArr = e.modules.split(";");
				let data2Temp = [];
				for (var i = 0; i < this.submenusList.length; i++) {
					if(moduleArr.indexOf(this.submenusList[i].id+'') == -1){
						data2Temp.push({
							'id': this.submenusList[i].id,
							'name': this.submenusList[i].name,
							'value': false
						});
					}else{
						data2Temp.push({
							'id': this.submenusList[i].id,
							'name': this.submenusList[i].name,
							'value': true
						});
					}
				}
				this.settingsData = data2Temp;
				this.settingVisible = true;
			},
			concleSetting(){
				this.cleanSetting();
			},
			cleanSetting(){
				this.settingVisible = false;
				this.selectRole = null;
				this.settingsData = [];
			}
		},
		mounted() {
			/*页面初始化调用方法*/
			this.getRoleList({
				"pageInfo": this.pageInfo
			});
			this.axios({
				method: 'get',
				url: '/menus/submenus'
			}).then(function (response) {
				this.submenusList = response.data;
			}.bind(this)).catch(function (error) {
				alert(error);
			});
		}
	}
</script>
<style scoped>
</style>