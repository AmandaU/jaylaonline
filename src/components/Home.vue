<template>
  <!-- <div class="centralcontainer"> -->
   <div :style="getContainerStyle()">
    <div class="banner">
       <img  class="frontimage" v-bind:src="imageurl"  alt=""  /> 
    </div>
      
   </div>
  
</template>

<script>
  
export default {
  name: 'home',
  components: {
     // CubeSpin
    },
  data() {
      return {
        busy: false,
        position: 'relative',
        imageurl: require('../assets/logo.png') ,
      }
    },

firebase () {
        return {
         
          }
      },

created() {
  },

methods: {

  getContainerStyle: function () { 
        return  {
        'max-width': '100vw',
        'min-height':'80vh',
        'height': '100%',
        'width':'100%',
        'float':'right',
        'display': 'flex',
        'overflow-y':'scroll',
        'padding-bottom': '5rem',
        'align-self': 'center',
        'justify-content': 'center',
        'align-items': 'center'
      }
  },
}


}
</script>

<style lang="scss" scoped>
  @import "~@/styles/commonstyle.scss";
  </style>
