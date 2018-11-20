import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import mutations from './mutations'

Vue.use(Vuex)

/*
state, getters, mutations 这三个拿到外面
*/
const store = new Vuex.Store({
  state: {
    userInfo: {},
    loginVueShow: false,
    registerVueShow: false
  },
  getters,
  mutations
})
export default store