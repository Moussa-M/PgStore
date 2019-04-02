<template>

 <div class="row">
    <div class="col-xs-4">
        <div class="avatar">
            <Avatar
                              :image="customer.image"
                              :fullname="customer.name"
                              :width="50"
                              :height="50"
                              :radius="50"
                              :crop="true"
                              :changeable="false"
                            />

           
        </div>
    </div>
    <div class="col-xs-5" style="overflow:hidden;max-height:50px;height:50px;text-overflow: ellipsis;">
        {{customer.name}}
        <br>
        <span class="text-success"><small dir="ltr">{{customer.phone}}</small></span>
    </div>

    <div :class="$i18n.locale=='ar'?'text-left':'text-right'"  class="col-xs-3">
        <button @click="selectCustomer" :class="{selected_btn:isSelected}" class="btn btn-sm  btn-icon"><i class="ti-check"></i></button>
    </div>
</div>

</template>
<script>
import { Customer } from '../models'
import Avatar from './Avatar.vue'
export default {
  name: 'CustomerCard',
  components: {
    Avatar
  },
  props: {
    'customer': {},
    'isSelected': {
      type: Boolean,
      default: false
    }
  },

  //   created(){
  //       if(avatar == ""){
  //            avatar =
  //       }
  //   },
  data () {
    return {

    }
  },
  methods: {
    selectCustomer () {
      this.$emit('selectCustomer', this.id)
    }
  }
}
</script>
<style scoped>
.selected_btn {
    background-color: #ffe681 !important;
    color: white !important;
}

.quantity input {
  text-align: center;
}
.form-control{
    padding: 7px;
    font-size: 17px;
    border-bottom: 1px solid #ffe681;
    border-top: 1px solid #ffe681
}
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0; 
}

#profileImage {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: #512DA8;
  font-size: 35px;
  color: #fff;
  text-align: center;
  line-height: 150px;
  margin: 20px 0;
}
</style>
