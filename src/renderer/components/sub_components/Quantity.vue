<template>
    <div class="quantity">
        <div class="input-group" style="margin-bottom: 0px">
            <div class="input-group-btn">
                <button :class="$i18n.locale=='ar'?'rtlB1':''" class="btn" variant="info" v-show="!disable_component" :disabled="quantity==0 || disable_component" @click="decrement()">-</button>
            </div>
    
            <input style="min-width:45px" class="form-control" type="number" :disabled="disable_component" :max="maxV" min="0.00" v-model="quantity" @input="inputChange()">
    
            <div class="input-group-btn">
                <button :class="$i18n.locale=='ar'?'rtlB2':''" class="btn" variant="info" v-show="!disable_component" :disabled="quantity==maxV || disable_component" @click="increment()">+</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Quantity',
    props: ['value', 'max', 'disabled', 'type'],

    created() {

        this.quantity = parseFloat(this.value)
        this.maxV = parseFloat(this.max)
        this.disable_component = this.disabled
        this.is_float = this.type ? (this.type == 'piece' ? false : true) : false;
    },
    data() {
        return {
            is_float: false,
            quantity: 0,
            maxV: Infinity
        }
    },
    methods: {
        increment() {
            if (this.quantity + 1 <= this.maxV) {
                this.quantity++
                    this.$emit('change', this.quantity);
            }
        },
        decrement() {
            if (this.quantity === 0) {
                // alert("Negative quantity not allowed");
            } else {
                this.quantity--;
                this.$emit('change', this.quantity);
            }
        },
        inputChange() {
            console.log(_.isNumber(this.quantity));
            if (_.isNumber(_.toNumber(this.quantity)) && new String(this.quantity).length>0) {
       
                if (!this.is_float) {
                    this.quantity = parseInt(this.quantity)
                } else {
                    this.quantity = parseFloat(this.quantity)
                }
                if (this.quantity > this.maxV) {
                    this.quantity = this.maxV
                    this.$emit('change', this.quantity);
                } else if (this.quantity < 0) {
                    this.quantity = 1;
                    this.$emit('change', 1);
                } else {
                    this.$emit('change', this.quantity);
                }
            } else {
                
            }

        }
    },
    watch: {

        value: function(val, oldVal) {
            console.log(val);
            this.quantity = val;
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

*[dir="rtl"] .form-control {
    padding: 9px;
    font-size: 18px;
    border-bottom: 1px solid #ffe681;
    border-top: 1px solid #ffe681
}

*[dir="ltr"] .form-control {
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

.rtlB1 {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    border-top-right-radius: 5px !important;
    border-bottom-right-radius: 5px !important;
}

.rtlB2 {
    border-top-left-radius: 5px !important;
    border-bottom-left-radius: 5px !important;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
}

.input-group-btn .btn {
    border-width: 1px;
    padding: 3px 18px;
    font-size: 30px;
}
</style>
