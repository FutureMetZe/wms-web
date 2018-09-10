<template>
    <div style="margin: 20px;">
      <div>
        <el-row style="margin-bottom: 25px;">
          <el-col :span="8">菜单名称：
            <el-select v-model="menuId" filterable clearable placeholder="请选择" style="width: 200px">
              <el-option v-for="item in menuList" :value="item.value" :key="item.value" :label="item.label">{{ item.label }}</el-option>
            </el-select>
          </el-col>
          </el-col span="8"><el-button type="warning" icon="el-icon-search" @click="search()">搜索</el-button></el-col>
        </el-row>
      </div>
      <div>
        <ul>
          <li>
              <el-button type="primary" icon="el-icon-circle-plus"  @click="openNewModal()">新建</el-button>
              <el-button type="info" icon="el-icon-edit" @click="openModifyModal()">修改</el-button>
              <el-button type="danger" icon="el-icon-remove" @click="del()">删除</el-button>
          </li>
          <li>
              <div style="padding: 10px 0;">
                <!-- <el-table border :columns="columns1" :data="data1" :height="400" @on-selection-change="s=>{change(s)}" @on-row-dblclick="s=>{dblclick(s)}"></el-table> -->
                <el-table
                  ref="multipleTable"
                  :data="data1"
                  @selection-change="s=>{change(s)}"
                  tooltip-effect="dark"
                  style="width: 100%"
                  :height="300"
                  >
                  <el-table-column
                    type="selection"
                    width="55">
                  </el-table-column>
                  <el-table-column
                    prop="id"
                    label="菜单ID"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="菜单名称"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="url"
                    label="地址"
                    show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column
                    prop="parentId"
                    label="上级菜单id"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="sort"
                    label="排序"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="icon"
                    label="图标"
                    width="120">
                  </el-table-column>
                </el-table>
              </div> 
          </li>
          <li>
              <div style="text-align: right;">
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
          </li>
        </ul>
      </div>
      <el-dialog title="新增" width="45%" :visible.sync="newModal">
        <el-form ref="menuNew" :model="menuNew" :rules="ruleNew">
          <el-row>
            <el-col :span="12">
              <el-form-item label="菜单名称" prop="name" :label-width="formLabelWidth">
                <el-input v-model="menuNew.name" auto-complete="off" style="width: 204px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="路径" prop="url" :label-width="formLabelWidth">
                <el-input v-model="menuNew.url" auto-complete="off" style="width: 204px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="父类ID" prop="parentId" :label-width="formLabelWidth">
                <el-input v-model="menuNew.parentId" auto-complete="off" style="width: 204px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排序号" prop="sort" :label-width="formLabelWidth">
                <el-input v-model="menuNew.sort" auto-complete="off" style="width: 204px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="图标" prop="icon" :label-width="formLabelWidth">
                <el-input v-model="menuNew.icon" auto-complete="off" style="width: 204px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="描述" prop="remark" :label-width="formLabelWidth">
            <el-input
              type="textarea"
              label="描述"
              :label-width="formLabelWidth"
              :autosize="{ minRows: 2, maxRows: 5}"
              placeholder="请输入内容"
              auto-complete="off"
              v-model="menuNew.remark">
            </el-input>
          </el-form-item>
          
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel()">取 消</el-button>
          <el-button type="primary" @click="newOk('menuNew')">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="修改" width="45%" :visible.sync="modifyModal">
        <el-form ref="menuModify" :model="menuModify" :rules="ruleModify">
          <el-row>
            <el-col :span="12">
              <el-form-item label="菜单名称" prop="name" :label-width="formLabelWidth">
                <el-input v-model="menuModify.name" auto-complete="off" style="width: 204px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="路径" prop="url" :label-width="formLabelWidth">
                <el-input v-model="menuModify.url" auto-complete="off" style="width: 204px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="父类ID" prop="parentId" :label-width="formLabelWidth">
                <el-input v-model="menuModify.parentId" auto-complete="off" style="width: 204px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="排序号" prop="sort" :label-width="formLabelWidth">
                <el-input v-model="menuModify.sort" auto-complete="off" style="width: 204px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="图标" prop="icon" :label-width="formLabelWidth">
                <el-input v-model="menuModify.icon" auto-complete="off" style="width: 204px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="描述" prop="remark" :label-width="formLabelWidth">
            <el-input
              type="textarea"
              label="描述"
              :label-width="formLabelWidth"
              :autosize="{ minRows: 2, maxRows: 5}"
              placeholder="请输入内容"
              auto-complete="off"
              v-model="menuModify.remark">
            </el-input>
          </el-form-item>
          
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel()">取 消</el-button>
          <el-button type="primary" @click="modifyOk('menuModify')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  export default{
    data () {
      return {
        data1: [],
        /*选择的数量*/
        count:null,
        /*选中的组数据*/
          groupId:null,
        /*pageInfo实体*/
        pageInfo:{
          page:0,
          pageSize:5
        },
        /*用于查找的菜单id*/
        menuId:null,
        /*分页total属性绑定值*/
        total:0,
        //分页栏输入框显示的当前页码
        currentPage: 2,
        //新增的dialog默认为关闭状态
        newModal : false,
        /*修改modal的显示参数*/
        modifyModal: false,
        //新增的dialog中表单默认数据
        menuNew: {
          name: '',
          url: '',
          parentId: '',
          sort: '',
          icon: '',
          remark: ''
        },
        /*用于修改的menu实体*/
        menuModify:{
          id:null,
          name:null,
          url:null,
          parentId:null,
          sort:null,
          remark:null,
          icon:null
        },
        // 表单中文本长度，设置后能使后面的input框对齐
        formLabelWidth: '100px',
        /*新建验证*/
        ruleNew:{
            name: [
                { type:'string',required: true, message: '输入菜单名', trigger: 'blur' }
            ],
            url: [
                { type:'string',required: true, message: '输入路径', trigger: 'blur' }
            ],
            parentId: [
                { required: true, message: '输入父类ID', trigger: 'blur' },
                {validator(rule, value, callback) {
                    if (!Number.isInteger(+value)) {
                        callback(new Error('请输入数字'));
                    } else {
                        callback();
                    }
                  
                }, trigger: 'blur'}
            ],
            sort: [
                { required: true, message: '输入排序', trigger: 'blur' },
                {validator(rule, value, callback) {
                    if (!Number.isInteger(+value)) {
                        callback(new Error('请输入数字'));
                    } else {
                        callback();
                    }
                  
                }, trigger: 'blur'}
            ],
            icon: [
                { type:'string',required: true, message: '输入图标', trigger: 'blur' }
            ]
        },
        /*修改验证*/
        ruleModify:{
          name: [
              { type:'string',required: true, message: '输入菜单名', trigger: 'blur' }
          ],
          url: [
              { type:'string',required: true, message: '输入路径', trigger: 'blur' }
          ],
          parentId: [
              { required: true, message: '输入父类ID', trigger: 'blur' },
              {validator(rule, value, callback) {
                  if (!Number.isInteger(+value)) {
                      callback(new Error('请输入数字'));
                  } else {
                      callback();
                  }
                
              }, trigger: 'blur'}
          ],
          sort: [
              { required: true, message: '输入排序', trigger: 'blur' },
              {validator(rule, value, callback) {
                  if (!Number.isInteger(+value)) {
                      callback(new Error('请输入数字'));
                  } else {
                      callback();
                  }
                
              }, trigger: 'blur'}
          ],
          icon: [
              { type:'string',required: true, message: '输入图标', trigger: 'blur' }
          ]
        },
        /*menu实体*/
        menu:{                             
          id:null,
          name:null,
          url:null,
          parentId:null,
          sort:null,
          remark:null,
          icon:null
        },
        menuList:[]
      }
    },
    mounted() {
      this.getTable({
        "pageInfo":this.pageInfo,
        'menuId':this.menuId
      });
      this.axios({
        method: 'get',
        url: '/menus/parentId',
        params: {
          'parentId': 0 
        }
      }).then(function (response) {
          var listTemp = response.data;
          for (var i = 0; i < listTemp.length; i++) {
              this.menuList.push({
                  "value": listTemp[i].id,
                  "label": listTemp[i].name
              });
          }
          console.log(this.menuList);
      }.bind(this)).catch(function (error) {
        alert(error);
      });
    },
    methods: {
      /*pageInfo实体初始化*/
      initPageInfo(){
        this.pageInfo.page = 0;
        this.pageInfo.pageSize = 10;
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageInfo.pageSize = val;
        this.getTable({  
          "pageInfo":this.pageInfo,
          'menuId':this.menuId
        });
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.pageInfo.page = val-1;
        this.getTable({  
          "pageInfo":this.pageInfo,
          'menuId':this.menuId
        });
      },
      /*得到表数据*/
      getTable(e) {
        this.axios({
          method: 'get',
          url: '/menus',
          params: {
            'page':e.pageInfo.page,
            'pageSize':e.pageInfo.pageSize,
            'menuId':e.menuId
          }
        }).then(function (response) {
            this.data1=response.data.data;
            this.total=response.data.totalCount;
        }.bind(this)).catch(function (error) {
          alert(error);
        });
      },
      /*新建点击触发事件*/
      openNewModal(){
        this.newModal = true;
        this.initMenuNew();
        this.data1.sort();
        this.count = 0;
        this.groupId = null;
      },
      /*新建modal的newOk点击事件*/
      newOk (menuNew) { 
          this.$refs[menuNew].validate((valid) => {
              if (valid) {
                console.log("新建modal的newOk点击");
                this.initMenu();
                this.menuSet(this.menuNew);
                this.axios({
                    method: 'post',
                    url: '/menus/menu',
                    data: this.menu
                }).then(function (response) {
                    this.initMenuNew();
                    this.getTable({
                        "pageInfo":this.pageInfo,
                        'menuId':this.menuId
                    });
                    this.$message('新建成功');
                }.bind(this)).catch(function (error) {
                    alert(error);
                });  
                this.newModal = false;
              }else {
                  setTimeout(() => {
                      this.loading = false;
                      this.$nextTick(() => {
                          this.loading = true;
                      });
                  }, 1000);
              }
          })
      },
      /*修改modal的modifyOk点击事件*/
      modifyOk (menuModify) { 
        console.log("222");
        this.$refs[menuModify].validate((valid) => {
          if (valid) {
              this.initMenu();
              this.menuSet(this.menuModify);
              this.axios({
                method: 'put',
                url: '/menus/'+this.menu.id,
                data: this.menu
              }).then(function (response) {
                  this.initMenuNew();
                  this.getTable({
                      "pageInfo":this.pageInfo,
                      'menuId':this.menuId
                  });
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  });
              }.bind(this)).catch(function (error) {
                alert(error);
              });  
              this.modifyModal = false;
          }else {
              this.$message.error('表单验证失败!');
              setTimeout(() => {
                  this.loading = false;
                  this.$nextTick(() => {
                      this.loading = true;
                  });
              }, 1000);
          }
        })
      },
      /*点击修改时判断是否只选择一个*/
      openModifyModal(){
        if(this.count > 1 || this.count < 1){
            console.log(this.count);
            this.modifyModal= false; 
            this.$message({
              message: '请至少选择一项(且只能选择一项)',
              type: 'warning'
            });
        }else{
            this.modifyModal = true;
        }
      },
      /*删除table中选中的数据*/
      del(){
        if(this.groupId!=null && this.groupId!=""){
          this.axios({
            method: 'delete',
            url: '/menus',
            data: this.groupId
          }).then(function (response) {
              this.getTable({
                  "pageInfo":this.pageInfo,
                  'menuId':this.menuId
              });
              this.groupId=null;
              this.count=0;
              this.$message({
                message: '删除成功',
                type: 'success'
              });
          }.bind(this)).catch(function (error) {
              alert(error);
          });
        }
      },
      /*modal的cancel点击事件*/
      cancel () {
        this.modifyModal = false;
        this.newModal = false;
        this.$message('点击了取消');
      },
      /*搜索按钮点击事件*/
      search(){
        this.initPageInfo();
        this.getTable({
          "pageInfo":this.pageInfo,
          'menuId':this.menuId
        });   
      },
      /*table选择后触发事件*/
      change(e){
          if(e.length==1){
              this.menuModifySet(e['0']);
          }
          this.setGroupId(e);              
      },
      /*menuModify设置*/
      menuModifySet(e){
        this.menuModify.id = e.id;
        this.menuModify.name = e.name;
        this.menuModify.url = e.url;
        this.menuModify.parentId = e.parentId+'';
        this.menuModify.sort = e.sort+'';
        this.menuModify.remark = e.remark;
        this.menuModify.icon = e.icon;
      },
      /*通过选中的行设置groupId的值*/
      setGroupId(e){
        this.groupId=[];
        this.count=e.length;
        for (var i = 0; i <= e.length - 1; i++) {
            this.groupId.push(e[i].id);
        }
      },
      /*menu实体初始化*/
      initMenu(){
        this.menu.id = null;
        this.menu.name = null;
        this.menu.url = null;
        this.menu.parentId = null;
        this.menu.sort = null;
        this.menu.remark = null;
        this.menu.icon = null;
      },
      /*menuNew实体初始化*/
      initMenuNew(){
        this.menuNew.id = null;
        this.menuNew.name = null;
        this.menuNew.url = null;
        this.menuNew.parentId = null;
        this.menuNew.sort = null;
        this.menuNew.remark = null;
        this.menuNew.icon = null;
      },
      /*menuNew设置*/
      menuSet(e){
        this.menu.id = e.id;
        this.menu.name = e.name;
        this.menu.url = e.url;
        this.menu.parentId = e.parentId;
        this.menu.sort = e.sort;
        this.menu.remark = e.remark;
        this.menu.icon = e.icon;
      },
    }
  }
</script>
<style >
  
</style>