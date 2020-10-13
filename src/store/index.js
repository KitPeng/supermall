import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
import getters from './getter'

//1.安装插件
Vue.use(Vuex)

//2.创建Store对象
const state={
  carList:[]
}
const store=new Vuex.Store({
  state,
  //mutaions唯一的目的就是修改state中状态
  //mutaions中的每个方法尽可能完成的事件比较单一一点
  mutations,
  actions,
  getters
})

//3.挂载Vue实例上
export default store
