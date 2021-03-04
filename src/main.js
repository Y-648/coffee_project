import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'lib-flexible/flexible'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'
import { Button ,Overlay,NavBar,Icon,Field ,Popup ,Toast ,Tabbar, TabbarItem ,Search,Swipe, SwipeItem ,Lazyload,Grid, GridItem,NoticeBar,Image as VanImage,Loading,CountDown,Progress ,Stepper ,GoodsAction, GoodsActionIcon, GoodsActionButton,SwipeCell,Card,Checkbox, CheckboxGroup,SubmitBar,List,Empty,AddressList,AddressEdit,Cell, CellGroup,Sidebar, SidebarItem,Sku,Tab,Tabs,Dialog } from 'vant';
import Vuex from 'vuex'
import store from './store'
Vue.use(Vuex)
Vue.use(VueAxios, axios)
Vue.use(VueCookies)
Vue.use(Button)
   .use(Overlay)
   .use(NavBar)
   .use(Icon)
   .use(Field)
   .use(Popup)
   .use(Toast)
   .use(Tabbar)
   .use(TabbarItem)
   .use(Search)
   .use(Swipe)
   .use(SwipeItem)
   .use(Lazyload)
   .use(Grid)
   .use(GridItem)
   .use(NoticeBar)
   .use(VanImage)
   .use(Loading)
   .use(CountDown)
   .use(Progress)
   .use(Stepper)
   .use(GoodsAction)
   .use(GoodsActionIcon)
   .use(GoodsActionButton)
   .use(Card)
   .use(SwipeCell)
   .use(Checkbox)
   .use(CheckboxGroup)
   .use(SubmitBar)
   .use(List)
   .use(Empty)
   .use(AddressList)
   .use(AddressEdit)
   .use(Cell)
   .use(CellGroup)
   .use(Sidebar)
   .use(Sku)
   .use(SidebarItem)
   .use(Tab)
   .use(Tabs)
   .use(Dialog)
// 设置拦截，处理请求数据
axios.interceptors.request.use(config=>{
  if(config.method==='post'){
    let paramsString='';
    for(let key in config.data){
      paramsString+=`${key}=${config.data[key]}&`
    }
    config.data=paramsString.slice(0,-1);
  }
  return config;
})
// 在原型上添加属性
Vue.prototype.baseUrl = 'http://www.kangliuyong.com:10002';
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=';
//定义全局过滤器
Vue.filter('formatDate', (data, format) => {
  //data: 需要进行格式化的数据
  //format: 格式
  // console.log('data ==> ', data);
  // console.log('format ==> ', format);

  let date = new Date(data);
  // console.log('date ==> ', date);

  //获取年份
  let year = date.getFullYear().toString();
  // console.log('year ==> ', year);

  if (/(y+)/.test(format)) {
    // console.log('有年份');
    //获取匹配组的内容
    let yearContent = RegExp.$1;
    // console.log('yearContent ==> ', yearContent);

    format = format.replace(yearContent, year.slice(year.length - yearContent.length));
  }

  //替换月日时分秒
  let dateObject = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  };

  for (let key in dateObject) {
    //生成动态正则表达式
    let reg = new RegExp(`(${key}+)`);
    // console.log('reg ==> ', reg);
    if (reg.test(format)) {
      //获取匹配组的内容
      let content = RegExp.$1;
      // console.log('content ==> ', content);

      format = format.replace(content, dateObject[key] >= 10 ? dateObject[key] : content.length === 2 ? '0' + dateObject[key] : dateObject[key]);
    }
  }

  return format;
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
