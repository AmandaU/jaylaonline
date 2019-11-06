<template>
  <div class="centralcontainer" >
    <h1>Success</h1>
    
  </div>
</template>

<script>
    
export default {
  name: 'success',

  data() {
      return {
         results: [],
        busy: false,
       
      }
    },

firebase () {
    return {
       
    }
},

created() {
    let cartref = 'jaylashop'
    if(localStorage.getItem(cartref))
    {
        this.shoppingcart = JSON.parse(localStorage.getItem(cartref));
    }
    let self = this
    const currentUser = firebase.auth().currentUser;

    let us = this.user
    this.$rtdbBind('users', userRef.orderByChild("uid").equalTo(currentUser.uid).limitToFirst(1)).then(users => {
      for(var key in users.val()){
         console.log("snapshot.val" + users.val()[key]);
        self.user = users.val()[key];
        self.key = key
        self.address = self.user.address
      }
     });
 },

}
</script>

<style lang="scss" scoped>
  @import "~@/styles/styles.scss";
 
  </style>

