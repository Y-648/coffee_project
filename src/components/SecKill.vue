<template>
    <div class="seckill">
        <router-link tag='div' :to='to' class="item">
        <div class="img-box">
          <van-image :src="imgSrc" width="100%" height="100%">
  <template v-slot:loading>
    <van-loading type="spinner" size="20" />
  </template>
</van-image>
            <div class="time-box" v-if='!end &&  progress!=100'>
                <van-count-down :time="time" format="DD天 HH:mm:ss" @finish='finish' @change='change' ref='timeDown'/><span>结束</span>
            </div>
        </div>
        <div class="right-box">
            <div class="title van-multi-ellipsis--l2">{{name}}</div>
            <van-progress 
            :percentage="progress" 
            class="my-progress" 
            stroke-width="8" 
            :inactive='end || progress==100'
            :pivot-text="end?'已结束':progress==100?'已经抢完':`已抢${progress}%`"
            color='rgb(232, 76, 90)'
            />
            <div class="bottom">
                <div class="price">
                    <span class="new-price">￥{{newPrice}}</span>
                     <span class="old-price" v-if='oldPrice'>￥{{oldPrice}}</span>
                </div>
                <button v-if='!end && progress!=100'>立即秒杀</button>
            </div>
        </div>
        </router-link>
    </div>
</template>

<script>
export default {
  name: "SecKill",
  props:{
      time:Number,//秒杀倒计时
      imgSrc:String,//商品图
      name:String,//商品名称
      newPrice:Number,//商品最新价格
      oldPrice:Number,//商品旧价格
      totalNum:{
          type:Number,
          default:100
      },//商品总数量
      sellNum:{
          type:Number,
          default:0
      },  // 商品售卖数量
      to:{
          type:String || Object,
          default:''
      }
  },
  data() {
      return {
          end:false,//是否结束
      }
  },
  computed:{
      progress(){
         return (this.sellNum/this.totalNum*100).toFixed(1);
      }
  },
  methods: {
      finish(){
          this.end=true;
      },
      change(){
          if(this.progress==100){
              this.$refs.timeDown.pause();
          }
      }
  },
};
</script>
<style lang="less" scoped>
.seckill {
    .item{
      padding: 15px 15px 0;
    display: flex;
    .img-box {
      height: 120px;
      width: 120px;
      position: relative;
      margin-right: 10px;
      .time-box{
          position: absolute;
          width: 100%;
          background: rgba(201, 144, 101,0.5);
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
           font-size: 5px;
          .van-count-down{
              color: #fff;
              font-size: 5px;
          }
      }
    }
    .right-box{
        padding-bottom: 5px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border-bottom: 1px solid #cccbcb;
        .title{
            color: #444444;
            font-size: 14px;
        }
        .my-progress{
            width: 60%;
            margin: 30px 0 20px;
        }
        .bottom{
            display: flex;
            justify-content: space-between;
            .price{
                display: flex;
                align-items: center;
                
                .new-price{
                    color: rgba(243, 44, 54);
                    font-size: 16px;
                }
                 .old-price{
                     color: #444444;
                    font-size: 12px;
                    text-decoration: line-through;
                }
            }
            button{
                padding: 0 3px;
                line-height: 20px;
                color: #fff;
                border: none;
                outline: none;
                background: rgb(243, 44, 54);
                font-size: 12px;
            }
        }
    }
    }
  }
</style>
