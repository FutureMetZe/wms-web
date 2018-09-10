// 路由器模块
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

export default new VueRouter({

    routes: [
        // 请求根路径时重定向到Login组件
        {
            path: '/',
            redirect: '/login',
        },
        {
            path: '/common',
            meta: {
                title: 'common',
                requiresAuth: true
            },
            component: (resolve) => require(['../views/Common.vue'], resolve),
            // component: Common,
            children: [
                {
                    path: 'welcome',
                    name: 'welcome',
                    component: (resolve) => require(['../views/Welcome.vue'], resolve),
                    meta: {
                        title:"welcome"
                    }
                },
                {
                    path: 'menulist',
                    name: 'menulist',
                    component: (resolve) => require(['../views/menu/MenuList.vue'], resolve),
                    meta: {
                        title:"menulist"
                    }
                },
                {
                    path: 'userList',
                    name: 'userList',
                    component: (resolve) => require(['../views/user/UserList.vue'], resolve),
                    meta: {
                        title:"userList"
                    }
                },{
                    path: 'rolelist',
                    name: 'rolelist',
                    component: (resolve) => require(['../views/role/RoleList.vue'], resolve),
                    meta: {
                        title:"rolelist"
                    }
                },
            ]
        },
        {
            path: '/login',
            component: Login
        }
    ]
})