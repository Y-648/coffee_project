<template>
    <div class="pay-box">
        <div>
         <slot name='title'>
         <div class="title">订单信息</div>
         </slot>
         </div>
        <div class="content">
            <slot name='item'>
            </slot>
        </div>
        <div class="line"></div>
        <div class="order-count">
            <div class="time">{{proInfo.date|formatDate('yyyy-MM-dd hh:mm:ss')}}</div>
            <div class="content">
                <div class="num">共<span>{{proInfo.count}}</span>件商品</div>
                <div class="price-box">合计<span class="mark">￥</span><span class="price">{{proInfo.total}}</span></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'payBox',
    props: {
      proInfo: {
        type: Object,
        default() {
          return {
            count: 0,
            total: 0,
            date: ''
          };
        }
      },
    }
};
</script>

<style lang="less" scoped>
.pay-box {
  background: #fff;
  border-radius: 5px;
  padding: 10px;
  .title {
    font-size: 14px;
    margin-bottom: 10px;
  }
  .content {
    max-height: 50vh;
    overflow-y: auto;
  }
  .line {
    height: 1px;
    background: #f7f4f8;
    margin: 15px 0;
  }
  .order-count {
    .time {
      font-size: 14px;
      margin-bottom: 10px;
    }
    .content {
      font-size: 14px;
      color: #000;
      display: flex;
      justify-content: space-between;
      .num {
      }
      .price-box {
        .mark {
          font-size: 14px;
          color: #6d411e;
        }
        .price {
          font-size: 20px;
          color: #6d411e;
        }
      }
    }
  }
}
</style>