import axios from 'axios';
export default {
    namespaced: true,
    state:{
        currentUser:{
            get UserName(){
                return localStorage.getItem("currentUser_name");
            },
            get UserToken(){
                return localStorage.getItem("currentUser_token");
            },
            get RefreshToken(){
                return localStorage.getItem("currentUser_refresh_token");
            }
        }
    },
    mutations:{
        setUser(state,{user_name,user_token,refresh_token}){
            // 在这里把用户名和token保存起来
            localStorage.setItem("currentUser_name",user_name);
            localStorage.setItem("currentUser_token",user_token);
            localStorage.setItem("currentUser_refresh_token",refresh_token);
        },
        clearUser(state){
            localStorage.clear();
        }
    },
    actions:{
        userLogin(context,{user_name,user_password,router}){
            axios({
                method: 'post',
                url: '/login',
                data: {
                    "username": user_name,
                    "password": user_password,
                },
                // auth: {
                //     username: 'client',
                //     password: 'secret'
                // }
            }).then(function(response){
                context.commit('setUser',{"user_name":user_name,"user_token":response.data.Authorization,"refresh_token":response.data.refresh_token});
                console.log(localStorage.getItem("currentUser_token"));
                // /*router.push({path:"base"});*/
                axios.defaults.headers.common['Authorization'] = 'Bearer '+ localStorage.getItem("currentUser_token");
                router.push({ path: 'common/welcome' }) ;
                context.commit('setSignFalse',null,{root: true});
                // /*this.$route.router.push({ path: '/base' });*/
            }).catch(function(error){
                // router.push({ path: '/' }) ;
                context.commit('setSignTrue',null,{ root: true});
            });
        },
        loginOUt(context,{router}){
            router.push({ path: '/' }) ;
            context.commit('clearUser');
        }
    }
}