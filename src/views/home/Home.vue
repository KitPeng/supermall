<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center" >购物街</div>
    </nav-bar>
    <tab-control
      @tabClick="tabClick"
      :titles="['流行','新款','精选']"
      ref="tabControl1"
      class="top-tab-control"
      v-show="isTabFixed">
    </tab-control>
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
      :pull-up-load="true"
      @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
        <feature-view></feature-view>
      <tab-control
        @tabClick="tabClick"
        class="tab-control2"
        :titles="['流行','新款','精选']"
        ref="tabContro2">
      </tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  import TabControl from 'components/content/tabControl/TabControl'
  import NavBar from 'components/common/navbar/NavBar'
  import GoodsList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'
  import {debounce} from "common/utils"
  import {backTopMixin} from "common/mixin";

  import {
    getHomeMultidata,
    getHomeGoods
  } from "network/home";



  // import Swiper from 'components/common/swiper/Swiper'
  // import Swiper from 'components/common/swiper/SwiperItem'


  export default {
    name: "Home",
    components:{
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      NavBar,
      GoodsList,
      Scroll,
    },
    mixins:[backTopMixin],
    data(){
      return {
        banners:[],
        recommends:[],
        goods:{
          'pop':{page:0,list:[]},
          'new':{page:0,list:[]},
          'sell':{page:0,list:[]},
        },
        currentType:'pop',
        tabOffsetTop:0,
        isTabFixed:false,
        saveY:0
      }
    },
    computed:{
      showGoods(){
        return this.goods[this.currentType].list;
      }
    },
    activated(){
      this.$refs.scroll.scrollTop(0,this.saveY,0);
      this.$refs.scroll.refresh();
    },
    deactivated(){
      this.saveY=this.$refs.scroll.getScrollY();
    },
    created() {
      //1.请求多个数据
     this.getHomeMultidata()

      //2.请求商品数据
     this.getHomeGoods('pop')
     this.getHomeGoods('new')
     this.getHomeGoods('sell')
    },
    mounted(){
      //1.监听item中图片加载完成
     const refresh = debounce(this.$refs.scroll.refresh,200);
      this.$bus.$on('homeItemImgLoad',()=>{
        refresh();
      })
    },
    methods:{
      /*
      * 事件监听相关方法
      * */
      tabClick(index){
        switch (index) {
          case 0:
            this.currentType='pop';
            break
          case 1:
            this.currentType='new';
            break
          case 2:
            this.currentType='sell';
            break
        }
        this.$refs.tabControl1.currentIendex=index;
        this.$refs.tabControl2.currentIendex=index;
      },
      contentScroll(position){
        //1.判断BackTop是否显示
       this.isShowBackTop = (-position.y) > 100
        //2.决定tabControl是否吸顶(position:fixed)
        this.isTabFixed=(-position.y)>this.tabOffsetTop
      },
      loadMore(){
        this.getHomeGoods(this.currentType);
      },
      swiperImageLoad(){
        //2.获取tabControl的offsetTop
        this.tabOffsetTop=this.$refs.tabContro2.$el.offsetTop
      },
      /*
      * 网络请求相关方法
      * */
      getHomeMultidata(){
        getHomeMultidata().then(res=>{
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list
        })
      },
      getHomeGoods(type){
        const page=this.goods[type].page+1
        getHomeGoods(type,page).then(res=>{
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page=page;

          //完成上拉加载更多
          this.$refs.scroll.finishPullUp()
        })
      }
    }
  }
</script>

<style scoped>
  #home{
    height: 100vh;
    position: relative;
    /*padding-top: 44px;*/
    /*height: 100vh;
    position: relative;*/
  }
  .home-nav{
   /* position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 1000;*/

    background-color: var(--color-tint);
    color: #fff;
  }
  .content{
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
    overflow: hidden;
  }
  .top-tab-control{
    position: relative;
    z-index: 999;
    background-color: #fff;
  }
</style>
