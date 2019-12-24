<template>
    <div class="footer" ref="footer" >
   
        <div class=" menuitem "  @click="navigate('About')">ABOUT
         </div>
        <div class="menuitem "  @click="navigate('Contact')">CONTACT
        </div>
  
    </div>
</template>

<script>

export default {
  name: 'BottomNav',
data() {
    return {
     // footerposition: 'relative' 
       }
  },

 mounted() {
    
 },

methods: {

     navigate (navPath) {
    
         let gotopath = '/' + navPath;
         this.$router.push({path: gotopath,})
     },
   
   },
}
</script>

<style> 

.footer{
    left: 0;
    display:  flex;
    flex-direction:row; 
    justify-content: space-between;
    bottom:0;
    width:100%;
     height: 50px;
     position: absolute;
     background-color: transparent;
      font-weight: 6;
    font-size: 12px;
   
}

.menuitem{
    color: rgb(209, 232, 248);
   text-align: center;
    justify-content:center;
    align-content:center;
    align-self: center;
    display: flex;
    margin: 0% auto;
  
}
  
  .menuitem:hover {
    text-decoration:underline;
    cursor: pointer;
    }
</style>