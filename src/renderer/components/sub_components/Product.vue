<template>
<div tabindex="0" style="outline:none">
    <div class="content" style="padding: 15px;
    padding-left: 10px;
    padding-right: 10px;">
        <div class="row">
            <div class="col-md-5">
                <Avatar :image="product_clone.image" :fullname="product_clone.name" :width="width" :height="height" :radius="radius" :usefallname="true" :crop="true" :changeable="false" />
            </div>
            <div class="col-md-7" style="    height: 120px;
    -webkit-padding-end: 10px;    padding-top: 5px;
    background-color: #eee;">
                <div class="overflowEllipsis"><label style="font-size:large">{{product_clone.name}}</label></div>
                <div class="overflowEllipsis" style="font-size:large">1{{ product_clone.unit == 'piece'? $t('piece'):$t(product_clone.unit.toLowerCase()) }} ~ {{product_clone.sell_price}} {{$t(currency.toLowerCase())}}</div>
                <div @click.self="(!product_clone.sell_price) ? ()=>{}:add($event)" :disabled="!product_clone.sell_price" class="form-group btn btn-sm " style="border: aliceblue;width:85%;padding:0px;position:absolute;bottom:5px;background-color: white;
    padding-top: 0px;
    padding-left: 0px;
    ">

                    <div @click="(!product_clone.sell_price) ? ()=>{}:add($event)" :disabled="!product_clone.sell_price" class="btn btn-default v-add-btn" >
                        <font-awesome-icon  style="outline:none" tabindex="0" icon="cart-plus" color="gray" size="lg" />

                    </div>

                    <select  :disabled="!product_clone.sell_price" v-model="selected_type" class="v-select" style="width: 50%;">
                        <option value="unit">{{$t(product_clone.unit.toLowerCase())}}</option>
                        <option v-show="is_bulk_sell" value="pack">{{$t('pack')}}</option>

                    </select>
                </div>

            </div>
        </div>
    </div>
</div>
</template>

<script>
import Quantity from "./Quantity.vue";
import Avatar from "./Avatar.vue";
export default {
    name: "Product",
    components: {
        Avatar,
        Quantity
    },
    data() {
        return {
            img: "",

            selected_type: 'unit',
            is_bulk_sell: false,
            product_clone: {}
        };
    },

    activated() {},
    created() {

        this.product_clone = this.product;
        this.selected_type = 'unit';
        if (this.product.is_bulk_sell) {
            this.is_bulk_sell = true;
        } else {

            this.is_bulk_sell = false;
        }

    },
    props: {
        product: {},
        width: {
            type: Number,
            default: 120
        },
        height: {
            type: Number,
            default: 120
        },

        radius: 7,
        currency: "",
        disable: false
    },

    computed: {},

    watch: {
        product() {
            this.product_clone = this.product;
        }

    },

    methods: {

        add(event) {

            this.$emit('plus', this.selected_type)
        }
    }
};
</script>

<style lang="scss" scoped>
.avatar {
    display: inline-block;
    background-color: transparent;
    color: white;
    width: 50px;
    height: 50px;
    font-size: 12px;
    font-style: normal;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-image: none;
}

.avatar #container {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

input[type="file"] {
    display: none;
}

.picture-preview {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 10001;
    box-sizing: border-box;

    background-color: #230000a8;
}

#close {
    display: none;
    position: absolute;
    cursor: pointer;
    top: 10px;
    right: 10px;
    width: 32px;
    height: 32px;
    background-image: url("data:image/png;base64,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");
    color: rgb(202, 83, 83);
}

.removeable:hover #close {
    display: block;
}

.stats {
    display: flex !important;
    justify-content: space-between !important;
}

.card:hover {
    .overlay {
        opacity: 1;
    }
}

.overlay {
    opacity: 0;
    -webkit-transition: all 0.4s ease-in-out;
    transition: all 0.4s ease-in-out;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10005;
    background: #eee;
    width: 100px;
    height: 100px;
    position: absolute;
    // top: 15px;
    // left: 15px;
}

.v-select {
    height: 37px !important;
    background-color: #ffd700;
    color: #797575;
    border-radius: 5px;
    padding: 5px;
    transition: all 0.5s ease;
    float: left;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
}
.v-select:hover{
  background-color: #ffd700 !important;
}
.v-add-btn{
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    padding:6px 10px;
    border:none;display: -webkit-inline-box;
    width: 50%;
    text-align: -webkit-center;
}
</style>
