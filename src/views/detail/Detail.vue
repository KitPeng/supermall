<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
    <!--<tost message="message" :show="show"></tost>-->
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :topImages="topImages"></detail-swiper>
      <detail-baseinfo :goods="Goods"></detail-baseinfo>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detailInfo="detaiInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :paramInfo="paramInfo"></detail-param-info>
      <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
      <goodes-list ref="recommend" :goods="recommends"></goodes-list>
    </scroll>
    <detail-bottom-bar @addCart="addCart"></detail-bottom-bar>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavNar'
  import DetailSwiper from "./childComps/DetailSwiper"
  import DetailBaseinfo from './childComps/DetailBaseInfo'
  import DetailShopInfo from './childComps/DetailShopInfo'
  import DetailGoodsInfo from './childComps/DetailGoodsInfo'
  import DetailParamInfo from './childComps/DetailParamInfo'
  import DetailCommentInfo from './childComps/DetailCommentInfo'
  import {debounce} from "common/utils"
  import DetailBottomBar from './childComps/DetailBottomBar'

 import Tost from 'components/common/toast/Toast'

  import Scroll from 'components/common/scroll/Scroll'
  import GoodesList from 'components/content/goods/GoodsList'
  import {backTopMixin} from "../../common/mixin";

  import {getDetail,Goods,Shop,GoodsParam,getRecommend} from "../../network/detail"

  import { mapActions } from 'vuex'

  export default {
    name: "Detail",
    data(){
      return {
        iid:null,
        topImages:[],
        Goods:{},
        shop:{},
        detaiInfo:{},
        paramInfo:{},
        commentInfo:{},
        recommends:[],
        themeTopYs:[],
        getThemeTopY:null,
        currentIndex:0,
       /* message:'',
        show:false*/
      }
    },
    mixins:[backTopMixin],
    components:{
      DetailNavBar,
      DetailSwiper,
      DetailBaseinfo,
      DetailShopInfo,
      DetailGoodsInfo,
      Scroll,
      DetailParamInfo,
      DetailCommentInfo,
      GoodesList,
      DetailBottomBar,
      Tost
    },
    created() {
      //1.保存传入的iid
      this.iid=this.$route.query.iid

      //2.根据iid请求详情数据
      getDetail(this.iid).then(res=>{
        const data=res.result;

        //1.获取顶部的图片轮播数据
        this.topImages=data.itemInfo.topImages;

        //2.获取商品信息
        this.Goods=new Goods(data.itemInfo,data.columns,data.shopInfo.services)

        //3.创建店铺信息的对象
        this.shop=new Shop(data.shopInfo)

        //4.保存商品的详情数据
        this.detaiInfo = data.detailInfo;

        //5.获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)

        //7.去除评论信息
        if(data.rate.cRate !==0){
          this.commentInfo=data.rate.list[0]
        }

        this.$nextTick(()=>{
          //根据最新的数据，对应的DOM已经被渲染出来了
          //但是图片依然是没有加载完（目前获取到offsetTop不包含其中的图片）
          //offsetTop值不对的时候，都是因为图片的问题
        })
      })

      //3.请求推荐数据
      getRecommend().then(res=>{
        this.recommends = res.data.list
      })


      //4.给getThemeTopY复制
      this.getThemeTopY=debounce(()=>{
        this.themeTopYs=[]
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)
        //console.log(this.themeTopYs);
      },100)
    },
    mounted(){
      const refresh = debounce(this.$refs.scroll.refresh,200);
        this.$bus.$on('detailtemImgLoad',()=>{
          refresh();
        })
    },
    updated(){

    },
    methods:{
      ...mapActions(['addCart']),
      imageLoad(){
        this.$refs.scroll.refresh()
        this.getThemeTopY()
      },
      titleClick(index){
        this.$refs.scroll.scrollTop(0,-this.themeTopYs[index],150)
        //this.$refs.scroll.scrollTo(0,this.themeTopYs[index],100)
      },
      contentScroll(position){
        //1.获取y值
        const positoinY=-position.y

        var length=this.themeTopYs.length;
        //2.positoinY和主题中值进行对比
        for(let i =0; i<length-1; i++){
          if(this.currentIndex !==i && (positoinY>=this.themeTopYs[i])&&positoinY<this.themeTopYs[i+1]){
            this.currentIndex=i;
            this.$refs.nav.currentIndex=this.currentIndex;
          }
         /*  if(positoinY > this.themeTopYs[i] && positoinY<this.themeTopYs[i+1]){
             console.log(i);
           }*/
         /*if(this.currentIndex !== i && ((i<length-1 && positoinY >= this.themeTopYs[i] && positoinY<this.themeTopYs[i+1]) || (i===length-1&&positoinY>=this.themeTopYs[i]))){
            this.currentIndex=i;
            this.$refs.nav.currentIndex=this.currentIndex;
         }*/
         //3.是否显示回到顶部
          this.isShowBackTop = (-position.y) > 100
        }
      },
      addCart(){
        //1.获取购物车需要展示的信息
        const product={}
        product.img = this.topImages[0]
        product.title = this.Goods.title;
        product.desc = this.Goods.desc;
        product.realPrice = this.Goods.realPrice
        product.iid = this.iid

        //2.将商品天极爱到购物车里
        //this.$store.commit('addCart',product)
        this.$store.dispatch('addCart',product).then(res=>{
          /*this.show=true
          this.message=res;
          setTimeout(()=>{
            this.show=false
            this.message=''
          },1000)*/
          //console.log(this.$toast);
          this.$toast.show(res)
        })
      }
    }
  }
</script>

<style scoped>
  #detail{
    position: relative;
    z-index: 999;
    background-color: #fff;
    height: 100vh;
  }
  .detail-nav{
    position: relative;
    z-index: 999;
    background-color: #fff;
  }
  .content{
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    width: 100%;
    overflow: hidden;
  }
</style>
