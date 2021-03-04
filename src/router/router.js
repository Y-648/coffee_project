// // 个人中心的二级路由
// const mySecondRoutes=[
   
// ];
// 二级路由配置
const secondRoutes=[
    {
        path:'home',
        name:'Home',
        alias:'/',
        component:()=>import('../views/Home.vue')
    },
    {
        path:'classify',
        name:'Classify',
        component:()=>import('../views/Classify.vue')
    },
    {
        path:'cart',
        name:'Cart',
        component:()=>import('../views/Cart.vue')
    },
    {
        path:'my',
        name:'My',
        component:()=>import('../views/My.vue'),
    }
];
export const routes = [
    {
        path: '/',
        name: 'Main',
        component: () => import('../views/Main.vue'),
        children:secondRoutes,
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue'),
    },
    {
        path: '/goodsinfo/:pid',
        props:true,
        name: 'GoodsInfo',
        component: () => import('../views/GoodsInfo.vue')
    },
    {
        path:'/address',
        name:'Address',
        component:()=>import('../views/Address.vue')
    },
    {
        path:'/editaddress',
        name:'EditAddress',
        component:()=>import('../views/EditAddress.vue')
    },
    {
        path:'/collect',
        name:'Collect',
        component:()=>import('../views/Collect.vue')
    },
    {
        path:'/pay',
        name:'Pay',
        component:()=>import('../views/Pay.vue')
    },
    {
        path:'/order',
        name:'Order',
        component:()=>import('../views/Order.vue')
    },
    {
        path:'/search',
        name:'Search',
        component:()=>import('../views/Search.vue')
    },
    {
        path:'/mydatum',
        name:'MyDatum',
        component:()=>import('../views/MyDatum.vue')
    },
    {
        path:'/setting',
        name:'Setting',
        component:()=>import('../views/Setting.vue')
    },
    {
        path:'/findpass',
        name:'FindPass',
        component:()=>import('../views/FindPass.vue')
    },
]