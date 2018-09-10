import Vuex from 'vuex'
import Vue from 'vue'
import UsersModule from './modules/UsersModule';

Vue.use(Vuex);
export default new Vuex.Store({
    // module其实只是解决了当state中很复杂臃肿的时候，
    // module可以将store分割成模块，每个模块中拥有自己的state、mutation、action和getter。
    modules: {
        users:UsersModule
    },
    // state为单一状态树，在state中需要定义我们所需要管理的数组、对象、字符串等等
    // 只有在这里定义了，在vue.js的组件中才能获取你定义的这个对象的状态。
    state: {
        todos: [
          { id: 1, text: '...', done: true },
          { id: 2, text: '...', done: false }
        ],
        count: 0,
        /*登录界面判断是否显示错误提示*/
        ifSign: false
    },
    // 类似vue.js的计算属性,当我们需要从store的state中派生出一些状态，那么我们就需要使用getter，
    // getter会接收state作为第一个参数，而且getter的返回值会根据它的依赖被缓存起来，
    // 只有getter中的依赖值（state中的某个需要派生状态的值）发生改变的时候才会被重新计算。
    getters: {
        doneTodos: state =>{
            return state;
        },
        doneTodosCount: (state, getters) => {
            return getters;
        },
        getTodoById: (state) => (id) => {
            return state.todos.find(todo => todo.id === id)
        },
        getSign:state =>{
            return state.ifSign;
        }
    },
    // 更改store中state状态的唯一方法就是提交mutation，就很类似事件。
    // 每个mutation都有一个字符串类型的事件类型和一个回调函数，我们需要改变state的值就要在回调函数中改变。
    // 我们要执行这个回调函数，那么我们需要执行一个相应的调用方法：store.commit。
    mutations: {
        add(state){
            state.count++;
        },
        increment(state,number){
            state.count+=number;
        },
        setSignTrue(state){
            state.ifSign = true;
        },
        setSignFalse(state){
            state.ifSign = false;
        }
    },
    // action可以提交mutation，在action中可以执行store.commit，而且action中可以有任何的异步操作。
    // 在页面中如果我们要调用这个action，则需要执行store.dispatch
    // Actions接受一个context对象参数，该参数具有和store实例相同的属性和方法，
    // 所以我们可以通过context.commit()提交mutations中的方法，或者可以通过context.state和context.getters去获取state和getters。
    actions: {
        increment(context){
            context.commit('add');
        }
    }
})