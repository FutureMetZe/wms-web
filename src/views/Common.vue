<template>
  <div class="layout">
    <el-row type="flex" class="row-bg" >
      <el-col :span="4" class="layout-menu-left">
        <div class="layout-logo-left">
          <img src="../assets/images/mylogo.png"></img>
          <strong>WMS-周报管理系统</strong>
        </div> 
        <el-menu
          background-color="#445566"
          text-color="#fff"
          active-text-color="#ffd04b"
          @select="select">
          <el-submenu v-for="pmenu in menuList" :name="pmenu.id" :key="pmenu.id"   :index = 'String(pmenu.id)'>
            <template slot="title">
              <i :class="pmenu.icon"></i>
              <span>{{pmenu.name}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item v-for="cmenu in pmenu.children" :name="cmenu.id" :key="cmenu.id"   :index = 'String(cmenu.id)' >
                <i :class="cmenu.icon"></i>
                <span>{{cmenu.name}}</span>
                </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-col>
      <el-col :span="20">
        <div class="layout-header">
          <strong>{{userName}}</strong>
          <el-dropdown trigger="click" style="margin-right: 50px" @command="m=>{dropdownSelect(m)}">
            <img src="../assets/images/guanliyuan.png"></img>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="layout-breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/common/welcome' }">Home</el-breadcrumb-item>
            <el-breadcrumb-item v-for="item in breadcrumbData" :to="item.url" :key="item.id">{{item.name}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="layout-content">
          <router-view></router-view>
        </div>
        <div class="layout-copy">
          2017-2018 &copy; wms
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default{
    data() {
      return{
        /*用户名*/
        userName: null,
        /*一级菜单*/
        menuList: [],
        /*二级菜单*/
        menuSub: [],
        /*面包屑data*/
        breadcrumbData: [],
      }
    },
    mounted() {
      this.axios({
        method: 'get',
        url: '/users/'+window.localStorage.getItem("currentUser_name")
      }).then(function(response){
        this.userName = response.data.name;
      }.bind(this)).catch(function(error){
        alert(error);
      });
      this.axios({
        method: 'get',
        url: '/menu/'+window.localStorage.getItem("currentUser_name"),
      }).then(function(response){
        this.menuList = response.data;
        for(var i in this.menuList){
            for(var j in this.menuList[i].children){
                this.menuSub.push(this.menuList[i].children[j]);
            }
        }
       // console.log('***************: ',this.menuList)
      }.bind(this)).catch(function(error){
        alert(error);
      });
    },
    methods:{
      /*菜单选择事件*/
      select(index, path){
        var filterMenus = this.menuSub.filter(function(menu){return (menu.url!=null && menu.url!='' && menu.id==index)});
        console.log(filterMenus[0].url);
        this.$router.push(filterMenus[0].url);
        this.breadcrumbData.splice(0,1,filterMenus[0]);
      },
      /*下拉菜单选择事件*/
      dropdownSelect(e){
        this.$store.dispatch('users/loginOUt',{"router":this.$router});
      }
    }
  }
</script>

<style >
  .layout{
    border: 1px solid #d7dde4;
    background: #e9eaec;
    /*position: relative;*/
    position:absolute;
    left:0;
    top:0;
    width:100%;
    height:100%;
    overflow:auto;
  }

  .layout-menu-left{
    background: #464c5b;
  }

  .layout-logo-left{
    width: 90%;
    height: 30px;
    /*background: #5b6270;*/
    border-radius: 3px;
    margin: 15px auto;
  }
  .layout-logo-left img{
    width: 20%;
    height: 100%;
  }
  .layout-logo-left strong{
    color: #00bcd4;
    font-size:10px;
  }

  .layout-header{
      height: 60px;
      background: #f8f8f9;
      box-shadow: 0 1px 1px rgba(0,0,0,.1);
      text-align: right;
  }
  .layout-header img{
      width: 40px;
      height: 40px;
      line-height: 40px; 
      border-radius: 20px;
      margin-top: 10px;
      /*margin-right: 50px;*/
  }
  .layout-header strong{
      color: #ff5722;
      font-size:10px;
  }

  .layout-breadcrumb{
    padding: 10px 15px 0;
  }

  .layout-content{
      /*height: 80%;*/
      /*min-height: 100%;*/
      min-height: 200px;
      margin: 15px;
      overflow: hidden;
      background: #f8f8f9;
      border-radius: 4px;
      box-shadow: 1px 1px 1px 1px  rgba(0,0,0,.1);
  }
  .layout-content-main{
      padding: 10px;
  }

  .layout-copy{
      height: 4%;
      text-align: center;
      padding: 10px 0 20px;
      color: #009688;
  }





  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    /* background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px; */
    background: #464c5b;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }


  
</style>