<template>
  <div class="cart-list">
    <Scroll class="content" ref="scroll">
      <cart-list-item v-for="(item,index) in carList" :item-info="item" :key="index"/>
    </Scroll>
  </div>
</template>

<script>
  import Scroll from 'components/common/scroll/Scroll'
  import CartListItem from './CartListItem'

  import {mapGetters} from 'vuex'
  export default {
    name: "CarList",
    data(){
      return {}
    },
    components:{
      Scroll,
      CartListItem
    },
    computed:{
      ...mapGetters(['carList'])
    },
    activated(){
      this.$refs.scroll.refresh()
    }
  }
</script>

<style scoped>
  .cart-list{
    position: fixed;
    top: 44px;
    bottom: 89px;
    left: 0;
    width: 100%;
    overflow: hidden;
  }

</style>
