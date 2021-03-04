import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cartNum:0,//购物车商品数量
    isLoadingCartNum:true,//是否获取购物车商品总数量
  },
  mutations: {
    changeCartNum(state,data){
      state.cartNum=data;
    },
    changeIsLoading(state,data){
      state.cartNum=data;
    }
  },
})
