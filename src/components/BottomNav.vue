<template>
    <div :class="isHome ? 'footerhome' : 'footer'"  ref="footer" >
   
        <div :class="isHome ? 'menuitem homecolor' : 'menuitem normalcolor'"  @click="navigate('About')" >ABOUT
         </div>
        <div :class="isHome ? 'menuitem homecolor' : 'menuitem normalcolor'"   @click="navigate('Contact')">CONTACT
        </div>
  
    </div>
</template>

<script>

export default {
  name: 'BottomNav',
data() {
    return {
   
       }
  },

 mounted() {
    
 },

 computed: {

   isHome: function() {
      return this.$route.name == "Home"
   },
 },

methods: {

     navigate (navPath) {
    
         let gotopath = '/' + navPath;
         this.$router.push({path: gotopath,})
     },
   
   },
}
</script>

<style lang="scss" scoped>
  // @import "~@/styles/commonstyle.scss";
  @import "~@/styles/bottomstyle.scss";
 </style>