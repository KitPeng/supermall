<template>
<div class="bottom-bar">
  <div class="check-content">
    <check-button
      class="check-button"
      :is-checked="isSelectAll"
      @click.native="checkClick"
    ></check-button><span>全选</span>
  </div>
  <div class="price">合计:{{totalPrice}}</div>
  <div class="calculate" @click="calcClick">
    去计算:{{checkLength}}
  </div>
</div>
</template>

<script>
  import checkButton from 'components/content/checkButton/CheckButton'
  import Tost from 'components/common/toast/Toast'

  import {mapGetters} from 'vuex'
  export default {
    name: "CartBottomBar",
    data(){
      return{}
    },
    components:{
      checkButton
    },
    computed:{
      ...mapGetters(['carList']),
      totalPrice(){

        const checkedCarList=this.carList.filter(item=>{
          return item.checked
        })

        var pre=checkedCarList.reduce((preValue,item)=>{
          return preValue+item.realPrice*item.count
        },0)

        return '￥'+pre.toFixed(2)
      },
      checkLength(){
        return this.carList.filter(item => item.checked).length
      },
      isSelectAll(){
       // return ! (this.carList.filter(item => !item.checked)).length
        if(this.carList.length === 0) return  false
        return !this.carList.find(item => !item.checked)
      }
    },
    methods:{
      checkClick(){
        if(this.isSelectAll){
          this.carList.forEach(item => item.checked=false)
        }else{
          this.carList.forEach(item => item.checked=true)
        }
      },
      calcClick(){
        if(!this.isSelectAll){
          this.$toast.show('请选择购买的商品',2000)
        }
      }
    }
  }
</script>

<style scoped>
  .bottom-bar{
    height: 40px;
    position: fixed;
    bottom:49px;
    left:0;
    width: 100%;
    line-height: 40px;
    background-color: #eee;
    display: flex;
  }
  .check-content{
    display: flex;
    width: 60px;
    align-items: center;
    line-height: 20px;
    margin-left: 10px;
    margin-right: 10px;
  }
  .check-button{
    width: 20px;
    height: 20px;
  }
  .price{
    margin-left: 30px;
  }
  .calculate{
    width: 80px;
    margin-left: auto;
    background-color: red;
    color: #fff;
    text-align: center;
  }
</style>
