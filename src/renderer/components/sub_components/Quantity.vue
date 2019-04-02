<template>
  <div class="quantity">
    <div class="input-group" style="margin-bottom: 0px">
      <div class="input-group-btn" >
        <button :class="$i18n.locale=='ar'?'rtlB1':''" class="btn" variant="info" v-show="!disable_component" :disabled="quantity==0 || disable_component" @click="decrement()">-</button>
      </div>

      <input class="form-control" type="number" :disabled="disable_component" :max="maxV" min="0.00" v-model="quantity" @input="inputChange()" >

      <div class="input-group-btn">
        <button :class="$i18n.locale=='ar'?'rtlB2':''"  class="btn" variant="info" v-show="!disable_component" :disabled="quantity==maxV || disable_component" @click="increment()">+</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Quantity',
  props: ['value', 'max', 'disabled'],

  created () {
    this.quantity = parseFloat(this.value)
    this.maxV = parseFloat(this.max)
    this.disable_component = this.disabled
  },
  data () {
    return {
      quantity: 0,
      maxV: Infinity
    }
  },
  methods: {
    increment () {
      if (this.quantity + 1 <= this.maxV) {
        this.quantity++
      }
    },
    decrement () {
      if (this.quantity === 0) {
        // alert("Negative quantity not allowed");
      } else {
        this.quantity--
      }
    },
    inputChange () {
      console.log(this.quantity, this.maxV)

      if (this.quantity > this.maxV) {
        this.quantity = this.maxV
      } else if (this.quantity < 0) {
        this.quantity = 0
      }
    }
  },
  watch: {
    quantity: function (val, oldVal) {
      this.$emit('change', val)
    }
  }
}
</script>
<style scoped>
.quantity {
  max-width: 150px;
  /* width: 100%; */
}

.quantity input {
  text-align: center;
}

*[dir="rtl"] .form-control{
    padding: 9px;
    font-size: 18px;
    border-bottom: 1px solid #ffe681;
    border-top: 1px solid #ffe681
}
*[dir="ltr"] .form-control{
    padding: 7px !important;
    font-size: 17px !important;
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

.rtlB1{
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    border-top-right-radius: 5px !important;
    border-bottom-right-radius: 5px !important;
}
.rtlB2{
    border-top-left-radius: 5px !important;
    border-bottom-left-radius: 5px !important;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
}


</style>
