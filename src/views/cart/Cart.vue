<template>
  <div>
    <!--导航-->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{length}})</div>
    </nav-bar>

    <!--商品的列表-->
    <cart-list></cart-list>

    <!--底部汇总-->
    <cart-bottom-bar></cart-bottom-bar>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import CartList from './childComps/CarList'
  import CartBottomBar from './childComps/CartBottomBar'

  import {mapGetters} from 'vuex'

  export default {
    name: "Cart",
    components:{
      NavBar,
      CartList,
      CartBottomBar
    },
    data(){
      return {}
    },
    computed:{
    //  ...mapGetters(['carLength','carList'])
      ...mapGetters({
        length:'carLength',
      })
    }
  }
</script>

<style scoped>
  .nav-bar{
    background-color: var(--color-high-text);
    color: #fff;
    font-weight: 700;
  }
</style>
