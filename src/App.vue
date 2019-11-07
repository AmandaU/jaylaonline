<template>
  <div id="app">
    
    <Navigation ></Navigation>
      <div class="fullpage" >
         <router-view/>
        <!-- <keep-alive include="Product">
          <router-view></router-view>
        </keep-alive> -->
        <BottomNav></BottomNav>
      </div>
      
  </div>
</template>

<script>
import BottomNav from './components/BottomNav'
import Navigation from './components/Navigation'

export default {
  name: 'app',
  components: {
    'Navigation': Navigation,
    'BottomNav': BottomNav
  },

  data: function () {
  return {
    // imageCount: 3,
    //    imageurl: require('./assets/logo.png') ,
   }
  },

  

beforeDestroy: function() {
    // Clean up
    // this.$eventHub.$off('eventimageurl', '');
    
  },
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
  </style>