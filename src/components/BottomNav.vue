<template>
<!-- <div >  -->
    <div class="footer" ref="footer" v-bind:style="{ position: footerposition }">
   
        <div class=" menuitem "  @click="navigate('About')">About
            <!-- <img src="../assets/home.png"  alt="About"  /><br> -->
        </div>
        <div class="menuitem "  @click="navigate('Contact')">Contact
            <!-- <img src="../assets/home.png"  alt="Contact"  /><br> -->
        </div>
  
    </div>
<!-- </div>   -->
</template>

<script>

export default {
  name: 'BottomNav',
data() {
    return {
      footerposition: 'relative' 
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
     background-color:rgb(75, 84, 88);
    left: 0;
    display:  flex;
    flex-direction:row; 
    justify-content: space-between;
    bottom:0;
    width:100%;
     height: 50px;
     position: absolute;
}

.menuitem{
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