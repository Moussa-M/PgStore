<template lang="lang">
<div class="wrapper">
    <div class="main-panel" :style="{'float':$i18n.locale=='ar' ? 'left':'right'}">
        <nav class="navbar navbar-default">
            <div class="nav-container">
                <div class="navbar-header" style="display: inline-flex;">
                    <a class="navbar-brand">{{$t("new_stock",{product:product.name})}}</a>
                </div>
                <ul class="nav navbar-nav navbar-right" style="margin-right: 0px">
                    <li>
                        <a class="btn btn-danger btn-circle" @click="goBack">
                            <i class="ti-close"></i>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
        <div class="content" style="height:90vh;padding: 15px">
            <div class="container-fluid" style=";width:90%">
                <div class="tab-content">
                    <div class="card">
                        <ErrorPanel :errors="errors" />
                        <div class="content" style="padding: 0px">
                            <div class="row">
                                <div class="col-md-6">
                                    <form @submit="add">
                                        <div class="row">
                                            <div style="margin:20px;border-bottom: 1px solid lightgrey;">
                                                <p style="font-size:20px">{{$t("supplier")}}</p>
                                            </div>
                                            <div class="col-md-12">
                                                <div class="form-group">

                                                    <div @click="changeSupplier()" class="text-left center-all" style="cursor:pointer;padding-left: 0px;
                                                padding-right: 0px;">
                                                        <div :class="$i18n.locale=='ar'?'text-left':'text-right'" style="width:100px;float:left">
                                                            <div>
                                                                <Avatar :image="supplier.image" :fullname="supplier.name" :width="80" :height="80" :radius="50" :crop="true" :changeable="false" :showPointer="true" />
                                                            </div>
                                                        </div>
                                                        <div :class="$i18n.locale=='ar'?'text-right':'text-left'" class="col-md-6 trim-text;" style=" display: grid;
                                                align-items: center;
                                                height: 68px;
                                                font-size: 20px">
                                                            <div v-if="supplier.id!=1">{{supplier.name}}</div>
                                                            <div v-else>{{ $t('anonymous') }}</div>

                                                            <span class="text-info">
                                                                <small dir="ltr">{{supplier.phone}}</small>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <!-- <TypeAhead :disabled="is_supplier_selected" v-model="supplier_name" classes="w100" inputClasses="input_border" @onHit="updateSupplierName(null,$event)" @onDoubleClick="onDoubleClickSupplier()" :placeholder="$t('supplier_name')" :objectArray="JSON.parse(JSON.stringify(customers))" :highlighting="highlighting" :minChars="parseInt(1)" :selectFirst="false" :render="render"></TypeAhead> -->
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div style="margin:20px;border-bottom: 1px solid lightgrey;">
                                                <p style="font-size:20px">{{$t("qte")}}</p>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label v-if="stock.unit=='piece'">{{product.is_bulk_sell ? $t("packs_count"):$t('qte')}}</label>
                                                    <label v-else>{{product.is_bulk_sell ? $t("packs_bags_count"):$t('qte') }}</label>

                                                    <div class="input-group">
                                                        <input type="number" dir="ltr" min="1" step="1" @change="stock.pack = parseFloat(stock.pack.toString())" class="form-control border-input animated" v-model="stock.pack" :placeholder="product.is_bulk_sell ? $t('pack_count'):product.unit=='piece'?$t('qte'):$t('weight')" value="1">
                                                        <transition name="slide-fade-fast" mode="out-in">
                                                            <span v-if="stock.unit=='piece'" class="input-group-addon">{{product.is_bulk_sell?$t("pack"):""}}
                                                                <br v-if="product.is_bulk_sell"><b style="line-height:1.5">{{$t(product.unit.toLowerCase())}}</b>
                                                            </span>
                                                            <span v-else class="input-group-addon">{{product.is_bulk_sell?$t("pack"):$t("weight")}}
                                                                <br><b style="line-height:1.5">({{product.packing}} {{$t(product.unit.toLowerCase())}})</b>
                                                            </span>

                                                        </transition>
                                                    </div>
                                                </div>
                                            </div>
                                            <div v-if="product.is_bulk_sell" class="col-md-3">
                                                <div class="form-group">
                                                    <transition name="slide-fade-fast" mode="out-in">
                                                        <label v-if="stock.unit=='piece'">{{$t("extra_units")}}</label>
                                                        <label v-else>{{$t("extra_weight")}}</label>
                                                    </transition>
                                                    <div class="input-group">
                                                        <input type="number" dir="ltr" :max="stock.unit=='piece'?parseInt(product.packing)-1:parseFloat(product.packing)-0.01" :min="stock.unit=='piece'?1:0.01" :step="stock.unit=='piece'?1:0.01" ref="extra_unit" @keyup="extraUnitChanged()" @blur="extraUnitBlur()" class="form-control border-input animated" v-model="stock.extra_units" :placeholder="stock.unit=='piece' ? $t('extra_units'):$t('extra_weight')" value="1">

                                                        <transition name="slide-fade-fast" mode="out-in">
                                                            <span :key="unit" class="input-group-addon">{{$t(stock.unit.toLowerCase())}}</span>
                                                        </transition>
                                                    </div>
                                                </div>
                                            </div>

                                            <div v-if="product.is_bulk_sell" class="col-md-3">
                                                <div class="form-group">
                                                    <transition name="slide-fade-fast" mode="out-in">

                                                        <label>{{$t("total")}}</label>
                                                    </transition>
                                                    <div class="input-group">
                                                        <input type="number" dir="ltr" class="form-control border-input animated no-cursor" :placeholder="stock.unit=='piece' ? $t('extra_units'):$t('extra_weight')" disabled :value="(parseFloat(stock.pack*product.packing)+parseFloat(stock.extra_units))">

                                                        <transition name="slide-fade-fast" mode="out-in">
                                                            <span :key="unit" class="input-group-addon">{{$t(stock.unit.toLowerCase())}}</span>
                                                        </transition>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        <div class="row">
                                            <div style="margin:20px;border-bottom: 1px solid lightgrey;">
                                                <p style="font-size:20px">{{$t("expiration_date")}}</p>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label>{{$t("expiration_date")}}</label>
                                                    <date-picker v-model="stock.exp_date" input-class="mx-input" :confirm="false" :not-before="new Date()" :shortcuts="shortcuts" :lang="lang"></date-picker>
                                                </div>
                                            </div>
                                        </div>

                                    </form>
                                </div>
                                <div class="col-md-6">
                                    <form @submit="add">
                                        <div class="row">
                                            <div style="margin:20px;border-bottom: 1px solid lightgrey;">
                                                <p style="font-size:20px">{{$t("buy_and_sell")}}</p>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <transition>
                                                        <label style="margin-bottom: 1px;" :key="unit">{{$t("a_buy_price")}}

                                                            (<select v-model="buy_price_type" class="v-select">
                                                                <option value="unit">{{ stock.unit=='piece' ?$t("unit"):" 1 "+$t(stock.unit.toLowerCase())}}</option>
                                                                <option v-if="product.is_bulk_sell" value="pack">{{$t("a_pack")}}</option>
                                                                <option value="all">{{$t("ally")}}</option>
                                                            </select>)
                                                        </label>

                                                        </label>
                                                    </transition>
                                                    <div class="input-group" style="margin-bottom:1px">
                                                        <input type="number" dir="ltr" min="0.00" class="form-control border-input" v-model="stock.buy_price" :placeholder="$t('buy_price')" value>
                                                        <span class="input-group-addon" id="basic-addon1">{{$t(currency.toLowerCase())}}</span>

                                                    </div>

                                                    <transition name="slide-fade-fast" mode="out-in">
                                                        <div key="a" v-if="buy_price_type == 'unit'" class="input-group opacity-5">
                                                            <label style="margin-bottom: 1px;display: table-cell;vertical-align: middle;" :key="unit">{{$t("buy_price")}} ({{$t("ally")}})</label>
                                                            <input disabled type="number" dir="ltr" min="0.00" class="form-control border-input no-cursor" :value="(parseFloat(stock.buy_price)*((parseFloat(stock.pack)*parseFloat(product.packing))+parseFloat(stock.extra_units))).toFixed(2)" :placeholder="$t('buy_price')" value>
                                                            <span class="input-group-addon" id="basic-addon1">{{$t(currency.toLowerCase())}}</span>

                                                        </div>

                                                        <div key="b" v-if="buy_price_type == 'all'" class="input-group opacity-5">
                                                            <label style="margin-bottom: 1px;display: table-cell;vertical-align: middle;" :key="unit">{{$t("a_buy_price")}} ({{product.unit=='piece'? $t('piece'):$t(product.unit.toLowerCase())}})</label>
                                                            <input disabled type="number" dir="ltr" min="0.00" class="form-control border-input no-cursor" :value="(parseFloat(stock.buy_price)/((parseFloat(stock.pack)*parseFloat(product.packing))+parseFloat(stock.extra_units))).toFixed(2)" :placeholder="$t('buy_price')" value>
                                                            <span class="input-group-addon" id="basic-addon1">{{$t(currency.toLowerCase())}}</span>

                                                        </div>
                                                        <div key="c" v-if="buy_price_type == 'pack'" class="input-group opacity-5">
                                                            <label style="margin-bottom: 1px;display: table-cell;vertical-align: middle;" :key="unit">{{$t("a_buy_price")}} ({{product.unit=='piece'? $t('piece'):$t(product.unit.toLowerCase())}})</label>
                                                            <input disabled type="number" dir="ltr" min="0.00" class="form-control border-input no-cursor" :value="(parseFloat(stock.buy_price)/parseFloat(product.packing)).toFixed(2)" :placeholder="$t('buy_price')" value>
                                                            <span class="input-group-addon" id="basic-addon1">{{$t(currency.toLowerCase())}}</span>

                                                        </div>
                                                    </transition>

                                                    <!-- <label style="margin-bottom: 1px;" :key="unit">{{$t("buy_price")}}({{($t('piece'))}})</label>
                                                        <input type="number" dir="ltr" min="0.00" class="form-control border-input" v-model="stock.buy_price" :placeholder="$t('buy_price')" value>
                                                         <span class="input-group-addon" id="basic-addon1">{{$t(currency.toLowerCase())}}</span> -->
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <transition>
                                                        <label style="margin-bottom: 1px;" :key="unit">{{$t("a_sell_price")}}

                                                            (<select v-model="sell_price_type" class="v-select">
                                                                <option value="unit">{{ stock.unit=='piece' ?$t("unit"):" 1 "+$t(stock.unit.toLowerCase())}}</option>
                                                                <option v-if="product.is_bulk_sell" value="pack">{{$t("a_pack")}}</option>
                                                                <option value="all">{{$t("ally")}}</option>
                                                            </select>)
                                                        </label>
                                                    </transition>
                                                    <div class="input-group" style="margin-bottom: 1px;">
                                                        <input type="number" dir="ltr" min="0.00" class="form-control border-input" v-model="stock.sell_price" :placeholder="$t('a_sell_price')">
                                                        <span class="input-group-addon" id="basic-addon1">{{$t(currency.toLowerCase())}}</span>
                                                    </div>
                                                    <transition name="slide-fade-fast" mode="out-in">
                                                        <div key="a" v-if="sell_price_type == 'unit'" class="input-group opacity-5">
                                                            <label style="margin-bottom: 1px;display: table-cell;vertical-align: middle;" :key="unit">{{$t("sell_price")}} ({{$t("ally")}})</label>
                                                            <input disabled type="number" dir="ltr" min="0.00" class="form-control border-input no-cursor" :value="(parseFloat(stock.sell_price)*((parseFloat(stock.pack)*parseFloat(product.packing))+parseFloat(stock.extra_units))).toFixed(2)" :placeholder="$t('sell_price')" value>
                                                            <span class="input-group-addon" id="basic-addon1">{{$t(currency.toLowerCase())}}</span>

                                                        </div>

                                                        <div key="b" v-if="sell_price_type == 'all'" class="input-group opacity-5">
                                                            <label style="margin-bottom: 1px;display: table-cell;vertical-align: middle;" :key="unit">{{$t("a_sell_price")}} ({{product.unit=='piece'? $t('piece'):$t(product.unit.toLowerCase())}})</label>
                                                            <input disabled type="number" dir="ltr" min="0.00" class="form-control border-input no-cursor" :value="(parseFloat(stock.sell_price)/((parseFloat(stock.pack)*parseFloat(product.packing))+parseFloat(stock.extra_units))).toFixed(2)" :placeholder="$t('sell_price')" value>
                                                            <span class="input-group-addon" id="basic-addon1">{{$t(currency.toLowerCase())}}</span>

                                                        </div>
                                                        <div key="c" v-if="sell_price_type == 'pack'" class="input-group opacity-5">
                                                            <label style="margin-bottom: 1px;display: table-cell;vertical-align: middle;" :key="unit">{{$t("a_sell_price")}} ({{product.unit=='piece'? $t('piece'):$t(product.unit.toLowerCase())}})</label>
                                                            <input disabled type="number" dir="ltr" min="0.00" class="form-control border-input no-cursor" :value="(parseFloat(stock.sell_price)/parseFloat(product.packing)).toFixed(2)" :placeholder="$t('sell_price')" value>
                                                            <span class="input-group-addon" id="basic-addon1">{{$t(currency.toLowerCase())}}</span>

                                                        </div>
                                                    </transition>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- <div class="row">
                                            <div>
                                                <div class="col-md-12">
                                                    <label>{{ $t("pack_sale") }}</label>
                                                    <label class="switch">
                                                        <input type="checkbox" v-model="stock.is_bulk_sell" :checked="stock.is_bulk_sell" />
                                                        <span class="slider round"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div> -->
                                        <!-- <div class="row" v-if="stock.is_bulk_sell">
                                            <transition-group name="slide-fade-fast" mode="out-in" tag="div" class="col-md-12">
                                                <div  v-for="price in stock.sell_prices" class="col-md-12"  :key="price.id" style="margin-bottom:15px;background-color:#eee;padding:10px">
                                                    <div class="form-group">
                                                        <div class="input-group" style="    margin: 0px;width:100%">
                                                            <label style="width:10%;">{{ $t("a_sell_price") }}</label>
                                                            <input type="number" @keyup="bulkPriceQteChanged(price)" :ref="'ref_qte'+price.id" dir="ltr" :step="stock.unit=='piece'?1:(price.type=='unit'?0.01:1)" :min="stock.unit=='piece'?(price.type=='unit'?2:1):(price.type=='unit'?0.01:1)" class="form-control border-input " style="width:10%;float: inherit;" v-model="price.qte" :placeholder="stock.unit=='piece'?$t('qte'):(price.type=='unit'?$t('weight'):$t('qte'))">
                                                            <div style="border:1px solid #CCC5B9;background-color:#ffd700;width:10%;height: 50px!important;    display: -webkit-inline-box;">
                                                                <select @change="bulkPriceQteChanged(price)" v-model="price.type" class="v-select" style="width: calc(100% + 20px);outline: none;background-color:#ffd700;height: 100%!important;">
                                                                    <option v-if="stock.unit=='piece'" value="unit">{{$t("piece")}}</option>
                                                                    <option v-else value="unit">{{$t(stock.unit.toLowerCase())}}</option>

                                                                    <option value="pack">{{$t("pack")}}</option>
                                                                </select></div>

                                                            <div style="width:60%;display: -webkit-inline-box;">
                                                                <div class="input-group" style="width:50%">
                                                                    <input  @keyup="bulkPriceSellPriceChanged(price)" :ref="'ref_sell_price'+price.id" type="number" dir="ltr" min="0.00" class="form-control border-input" v-model="price.sell_price" :placeholder="$t('sell_price')">
                                                                    <span class="input-group-addon" id="basic-addon1">{{$t(currency.toLowerCase())}}</span>
                                                                </div>
                                                                <div class="" style="width:50%">
                                                                    <input type="text" dir="ltr" class="form-control border-input" style="border:1px solid #CCC5B9;width:100%;float: inherit;" v-model="price.barcode" :placeholder="$t('barcode')">
                                                                </div>
                                                            </div>
                                                            <div style="width:10%;display: -webkit-inline-box;">
                                                                <a class="btn btn-danger" style="border-radius:1px" @click="removeBulkPrice(price.id)">
                                                                    <i class="ti-trash "></i>
                                                                </a>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </transition-group>
                                        </div> -->

                                        <!-- <div class="row" v-if="stock.is_bulk_sell">
                                            <div class="col-md-12">
                                                <a class="btn" @click="addBulkPrice()">
                                                    <i class="ti-plus"></i>
                                                </a>
                                            </div>
                                        </div> -->
                                        <div class="row">
                                            <div style="margin:20px;border-bottom: 1px solid lightgrey;">
                                                <p style="font-size:20px">{{$t("discount_and_store_credit")}}</p>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label>{{ $t("discount") }}</label>
                                                    <div class="input-group">
                                                        <input oninput="validity.valid||(value='0');" type="number" dir="ltr" max="100" min="0" step="0.1" @change="stock.discount = parseFloat(stock.discount).toFixed(2)" class="form-control border-input animated" v-model="stock.discount" :placeholder="$t('discount')" value="0">
                                                        <span class="input-group-addon">%</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <transition>
                                                        <label v-if="stock.unit=='piece'" :key="unit">
                                                            {{$t("sell_price")}} (
                                                            <span :key="unit">{{ $t("piece") }})</span>
                                                        </label>

                                                        <label v-else :key="unit">
                                                            {{$t("sell_price")}} (
                                                            <span :key="unit">{{ $t(stock.unit.toLowerCase()) }})</span>
                                                        </label>
                                                    </transition>
                                                    <div class="input-group">
                                                        <input :disabled="true" type="number" dir="ltr" min="0.00" class="form-control border-input no-cursor" :value="getSellingPrice()" :placeholder="$t('sell_price')">
                                                        <span class="input-group-addon" id="basic-addon1">{{$t(currency.toLowerCase())}}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6 ">
                                                <div class="form-group">
                                                    <label>{{ $t("one_unit_store_credit_points") }} ( 100 {{$t("points")}} = 1 {{$t(currency.toLowerCase()).toUpperCase()}})</label>
                                                    <div class="input-group">
                                                        <input type="number" dir="ltr" max="100" min="0" step="0.1" class="form-control border-input animated" v-model="stock.store_credit_points" :placeholder="$t('store_credit_points')" value="0">
                                                        <span class="input-group-addon">{{$t("points")}}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </form>
                                </div>

                            </div>
                            <div class="row " style="margin-bottom:50px;margin-left: 0px;margin-right: 0px;">
                                <div :class="$i18n.locale=='ar'?'text-left':'text-right'">
                                    <button @click="add" type="submit" class="btn btn-lg">{{$t("add")}}</button>
                                </div>
                                <div class="clearfix"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import swal from "sweetalert";
import {
    Product,
    Stock,
    Invoice
} from "./models.js";
import DatePicker from "vue2-datepicker";
import TypeAhead from "./sub_components/TypeAhead.vue";
import Avatar from "./sub_components/Avatar.vue";
import {
    getStartYearDate,
    getStartMonthDate
} from "./utils.js";
export default {
    name: "add-stock",
    components: {
        DatePicker,
        TypeAhead,
        Avatar
    },
    props: {
        product_id: [Number, String]
    },
    created() {
        this.currency = store.getters.user.currency;
        this.customers = JSON.parse(JSON.stringify(store.getters.customers));
        this.product = JSON.parse(
            JSON.stringify(store.getters.getProduct(this.product_id))
        );
        this.stocks = JSON.parse(
            JSON.stringify(store.getters.getStocks(this.product.id))
        );
        console.log("this.stocks");
        console.log(this.stocks);
        this.supplier = this.customers[0];
        this.invoice = new Invoice(this.supplier.id);
        this.stock = new Stock(
            this.product.id,
            this.supplier.id,
            this.invoice.id,
            "",
            this.product.unit,
            1,
            this.product.packing,
            1,
            1,
            0,
            0,
            0,
            0,
            0
        );
        if (this.stocks.length > 0) {
            this.stock.pack = _.last(this.stocks).pack;
            this.stock.supplier_id = _.last(this.stocks).supplier_id;
            this.stock.extra_units = _.last(this.stocks).extra_units;
            this.supplier = store.getters.getCustomer(this.stock.supplier_id, true);
            this.stock.sell_price = _.last(this.stocks).sell_price;
            this.stock.buy_price = _.last(this.stocks).buy_price;
            this.stock.store_credit_points = _.last(this.stocks).store_credit_points ? _.last(this.stocks).store_credit_points : 0;
            this.stock.discount = _.last(this.stocks).discount;
        }

    },
    activated() {
        this.product = JSON.parse(
            JSON.stringify(store.getters.getProduct(this.product_id))
        );
        this.stocks = JSON.parse(
            JSON.stringify(store.getters.getStocks(this.product.id))
        );

        //this.supplier = this.customers[0];
        //this.invoice = new Invoice(this.supplier.id);
        // this.stock = new Stock(
        //     this.product.id,
        //     this.supplier.id,
        //     this.invoice.id,
        //     "",
        //    this.product.unit,
        //     1,
        //     this.product.packing,
        //     1,
        //     1,
        //     0,
        //     0,
        //     0,
        //     0,
        //     0
        // );
        // if (this.stocks.length > 0) {
        //     this.stock.pack = _.last(this.stocks).pack;
        //     this.stock.packing = _.last(this.stocks).packing;
        //     this.stock.extra_units = _.last(this.stocks).extra_units;
        //     this.stock.supplier_id = _.last(this.stocks).supplier_id;
        //     this.supplier = store.getters.getCustomer(this.stock.supplier_id, true);
        //     this.stock.sell_price = _.last(this.stocks).sell_price;
        //     this.stock.buy_price = _.last(this.stocks).buy_price;
        //     this.stock.discount = _.last(this.stocks).discount;
        //     this.stock.store_credit_points = _.last(this.stocks).store_credit_points ? _.last(this.stocks).store_credit_points : 0;
        // }

        this.lang = {
            days: [
                this.$t("Sun"),
                this.$t("Mon"),
                this.$t("Tue"),
                this.$t("Wed"),
                this.$t("Thu"),
                this.$t("Fri"),
                this.$t("Sat")
            ],
            months: [
                this.$t("Jan"),
                this.$t("Feb"),
                this.$t("Mar"),
                this.$t("Apr"),
                this.$t("May"),
                this.$t("Jun"),
                this.$t("Jul"),
                this.$t("Aug"),
                this.$t("Sep"),
                this.$t("Oct"),
                this.$t("Nov"),
                this.$t("Dec")
            ],
            pickers: [
                "next 7 days",
                "next 30 days",
                "previous 7 days",
                "previous 30 days"
            ],
            placeholder: {
                date: this.$t("select_date")
            }
        };
        this.customLabels = {
            first: this.$t("first"),
            prev: this.$t("previous"),
            next: this.$t("next"),
            last: this.$t("last")
        };
        let cus = store.getters.panel_choosed_customer;
        if (cus) {
            this.supplier = cus;
            store.commit('panel_choosed_customer', null)
        } else {
            if (!this.supplier) {
                this.supplier = this.customers[0];
            }
        }
        this.stock.supplier_id = this.supplier.id
    },
    data() {
        return {
            buy_price_type: "unit",
            sell_price_type: "unit",
            is_supplier_selected: false,
            stock: {},
            exp_date: "",
            errors: [],
            customers: [],
            supplier_name: "",
            supplier: {},
            currency: null,
            unit: null,
            product: {},
            lang: {
                days: [
                    this.$t("Sun"),
                    this.$t("Mon"),
                    this.$t("Tue"),
                    this.$t("Wed"),
                    this.$t("Thu"),
                    this.$t("Fri"),
                    this.$t("Sat")
                ],
                months: [
                    this.$t("Jan"),
                    this.$t("Feb"),
                    this.$t("Mar"),
                    this.$t("Apr"),
                    this.$t("May"),
                    this.$t("Jun"),
                    this.$t("Jul"),
                    this.$t("Aug"),
                    this.$t("Sep"),
                    this.$t("Oct"),
                    this.$t("Nov"),
                    this.$t("Dec")
                ],
                pickers: [
                    this.$t("after_month"),
                    this.$t("after_6_months"),
                    this.$t("after_year")
                ],
                placeholder: {
                    date: this.$t("select_date")
                }
            },
            shortcuts: [{
                    text: this.$t("after_month"),
                    onClick: () => {
                        this.exp_date = getStartMonthDate(new Date());
                    }
                },
                {
                    text: this.$t("after_6_months"),
                    onClick: () => {
                        this.exp_date = getStartMonthDate(new Date());
                    }
                },
                {
                    text: this.$t("after_year"),
                    onClick: () => {
                        this.exp_date = getStartYearDate(new Date());
                    }
                }
            ]
        };
    },
    methods: {
  changeSupplier() {

            this.$router.push({path:"/choose-customer-panel",query:{is_supplier:true}});

        },
      extraUnitBlur() {
            if (!this.stock.extra_units) {
                this.$refs['extra_unit'].value = 0;
                this.stock.extra_units = 0;
            }
        },
        extraUnitChanged() {
            console.log(this.$refs);

            _.debounce(() => {

                if (!this.$refs['extra_unit'].validity.valid) {

                    this.$refs['extra_unit'].value = 0;
                    this.stock.extra_units = 0;

                }

            }, 500)();

        },
        bulkPriceSellPriceChanged(price) {
            this.$refs['ref_sell_price' + price.id][0].classList.remove("error")
        },
        removeBulkPrice(id) {
            _.remove(this.stock.sell_prices, {
                id: id
            });
            this.stock.sell_prices = JSON.parse(
                JSON.stringify(this.stock.sell_prices))
        },
        addBulkPrice() {
            let err = false;
            _.forEach(this.stock.sell_prices, p => {
                if (p.qte == '') {
                    err = true;
                    this.$refs['ref_qte' + p.id][0].classList.add("error")

                }
                if (p.sell_price == '') {
                    this.$refs['ref_sell_price' + p.id][0].classList.add("error")
                    err = true;
                }
            })
            if (!err) {
                this.stock.sell_prices.push({
                    id: this.stock.sell_prices.length + 1,
                    type: "unit",
                    qte: '',
                    sell_price: ''
                })
            }

        },
        onDoubleClickSupplier() {
            this.is_supplier_selected = false;
        },
        updateSupplierName(d, data) {
            this.supplier = data.item;
            this.stock.supplier_id = this.supplier.id;
            this.invoice.supplier_id = this.supplier.id;
            this.is_supplier_selected = true;
        },
        highlighting: function (item, vue) {
            return `<div class="media">
              <div class="media-left">
                <a >
                  <img class="avatar media-object"  src="${
                    item.image != null && item.image != ""
                      ? item.image
                      : "static/assets/img/faces/avatar.png"
                  }">
                </a>
              </div>
              <div class="media-body">
                <h5 class="media-heading">${item.name}</h5>
                <h6 class="media-heading">${item.phone}</h6>
              </div>
            </div>
        `;
        },

        render: function (items, vue) {
            let newItem = [...items];
            return newItem;
        },
        getSellingPrice() {
            let sell_p = 0;
            if (this.sell_price_type == 'all') {

                sell_p = parseFloat(this.stock.sell_price) / ((parseFloat(this.stock.pack) * parseFloat(this.product.packing)) + parseFloat(this.stock.extra_units))

            } else if (this.sell_price_type == 'pack') {
                sell_p = this.stock.sell_price / this.product.packing
            } else {
                sell_p = this.stock.sell_price;
            }
            return (
                sell_p *
                (1 - parseFloat(this.stock.discount) / 100)
            ).toFixed(2);
        },
        goBack() {
            this.$router.go(-1);
        },
        add: function (e) {
            e.preventDefault();
            this.errors = [];

            if (!this.stock.pack && this.stock.pack != 0) {
                this.errors.push(this.$t("pack_required"));
            }
            if (!this.stock.sell_price) {
                this.errors.push(this.$t("sell_price_required"));
            } else {
                if (!_.isNumber(parseFloat(this.stock.sell_price))) {
                    this.errors.push(this.$t("sell_price_required_number"));
                }
            }
            if (!this.stock.buy_price) {
                this.errors.push(this.$t("buy_price_required"));
            } else {
                if (!_.isNumber(parseFloat(this.stock.buy_price))) {
                    this.errors.push(this.$t("buy_price_required_number"));
                }
            }

            if (!this.stock.extra_units && this.stock.extra_units != 0) {
                this.stock.extra_units = 0;
            }

            if (this.stock.extra_units == 0 && this.stock.pack == 0) {
                this.errors.push(this.$t("you_didnt_set_qte"));
            }

            let stock_clone = Object.assign({}, this.stock);
            if (this.errors.length == 0) {
                if (this.buy_price_type == 'all') {
                    stock_clone.buy_price = stock_clone.buy_price / ((stock_clone.pack * this.product.packing) + stock_clone.extra_units)
                } else if (this.buy_price_type == 'pack') {
                    stock_clone.buy_price = stock_clone.buy_price / this.product.packing
                }
                if (this.sell_price_type == 'all') {
                    stock_clone.sell_price = stock_clone.sell_price / ((stock_clone.pack * this.product.packing) + stock_clone.extra_units)
                } else if (this.sell_price_type == 'pack') {
                    stock_clone.sell_price = stock_clone.sell_price / this.product.packing
                }
                stock_clone.packing = this.product.packing;
                stock_clone.total_qte = stock_clone.pack * stock_clone.packing + stock_clone.extra_units;
                stock_clone.available_qte = stock_clone.pack * stock_clone.packing + stock_clone.extra_units;
                stock_clone.exp_date = stock_clone.exp_date ?
                    moment(stock_clone.exp_date).format() :
                    "";

                if (parseFloat(stock_clone.sell_price) < parseFloat(stock_clone.buy_price)) {
                    swal({
                        title: this.$t("pricing_recommendations"),
                        text: this.$t("sell_price_lower_then_buy_price"),
                        icon: "warning",
                        buttons: [this.$t("cancel"), this.$t("continue")],
                        dangerMode: true
                    }).then(add => {
                        if (add) {
                            if ((parseFloat(stock_clone.sell_price) * (1 - parseFloat(stock_clone.discount) / 100)) < parseFloat(stock_clone.buy_price)) {
                                swal({
                                    title: this.$t("discount_recommendations"),
                                    text: this.$t("discount_cause_lose_in_revenue"),
                                    icon: "warning",
                                    buttons: [this.$t("cancel"), this.$t("continue")],
                                    dangerMode: true
                                }).then(add => {
                                    if (add) {

                                        this.saveStock()

                                    }
                                });
                            } else {
                                this.saveStock()
                            }

                        }
                    });
                } else {
                    if ((parseFloat(stock_clone.sell_price) * (1 - parseFloat(stock_clone.discount) / 100)) < parseFloat(stock_clone.buy_price)) {
                        swal({
                            title: this.$t("discount_recommendations"),
                            text: this.$t("discount_cause_lose_in_revenue"),
                            icon: "warning",
                            buttons: [this.$t("cancel"), this.$t("continue")],
                            dangerMode: true
                        }).then(add => {
                            if (add) {

                                this.saveStock()

                            }
                        });
                    } else {
                        this.saveStock()
                    }
                }

                return true;
            } else {
                return true;
            }
        },
        saveStock() {
            if (this.buy_price_type == 'all') {
                this.stock.buy_price = this.stock.buy_price / ((this.stock.pack * this.product.packing) + this.stock.extra_units)
            } else if (this.buy_price_type == 'pack') {
                this.stock.buy_price = this.stock.buy_price / this.product.packing
            }
            if (this.sell_price_type == 'all') {
                this.stock.sell_price = this.stock.sell_price / ((this.stock.pack * this.product.packing) + this.stock.extra_units)
            } else if (this.sell_price_type == 'pack') {
                this.stock.sell_price = this.stock.sell_price / this.product.packing
            }
            this.stock.packing = parseFloat(this.product.packing);
            this.stock.total_qte = parseFloat(this.stock.pack) * parseFloat(this.stock.packing) + parseFloat(this.stock.extra_units);
            this.stock.available_qte = parseFloat(this.stock.pack) * parseFloat(this.stock.packing) + parseFloat(this.stock.extra_units);
            this.stock.exp_date = this.stock.exp_date ?
                moment(this.stock.exp_date).format() :
                "";
            store.dispatch("addStock", this.stock);
            store.dispatch("addInvoice", this.invoice);
            this.goBack();
            this.$destroy();

        }

    },
    watch: {
        buy_price_type(newVal, oldVal) {
            switch (this.buy_price_type) {
                case "unit":
                    if (oldVal == 'pack') {
                        this.stock.buy_price = this.stock.buy_price / this.product.packing
                    } else {
                        this.stock.buy_price = this.stock.buy_price / ((this.stock.pack * this.product.packing) + parseFloat(this.stock.extra_units))
                    }
                    break;
                case "pack":
                    if (oldVal == 'unit') {
                        this.stock.buy_price = this.stock.buy_price * this.product.packing
                    } else {
                        this.stock.buy_price = (this.stock.buy_price / ((this.stock.pack * this.product.packing) + parseFloat(this.stock.extra_units))) * this.stock.packing
                    }
                    break;
                case "all":
                    if (oldVal == 'pack') {
                        this.stock.buy_price = (this.stock.buy_price / this.product.packing) * ((this.stock.pack * this.product.packing) + parseFloat(this.stock.extra_units))
                    } else {
                        this.stock.buy_price = this.stock.buy_price * ((this.stock.pack * this.product.packing) + parseFloat(this.stock.extra_units))
                    }
                    break;
            }
        },
        sell_price_type(newVal, oldVal) {
            switch (this.sell_price_type) {
                case "unit":
                    if (oldVal == 'pack') {
                        this.stock.sell_price = this.stock.sell_price / this.product.packing
                    } else {
                        this.stock.sell_price = this.stock.sell_price / ((this.stock.pack * this.product.packing) + parseFloat(this.stock.extra_units))
                    }
                    break;
                case "pack":
                    if (oldVal == 'unit') {
                        this.stock.sell_price = this.stock.sell_price * this.product.packing
                    } else {
                        this.stock.sell_price = (this.stock.sell_price / ((this.stock.pack * this.product.packing) + parseFloat(this.stock.extra_units))) * this.stock.packing
                    }
                    break;
                case "all":
                    if (oldVal == 'pack') {
                        this.stock.sell_price = (this.stock.sell_price / this.product.packing) * ((this.stock.pack * this.product.packing) + parseFloat(this.stock.extra_units))
                    } else {
                        this.stock.sell_price = this.stock.sell_price * ((this.stock.pack * this.product.packing) + parseFloat(this.stock.extra_units))
                    }
                    break;
            }
        }
    },
};
</script>

<style lang="scss" scoped>
.main-panel {
    /*   border: 10px solid white;
    border-radius: 25px;*/
    // padding: 9px;
    height: 100%;
    width: 100% !important;
}

.card {
    box-shadow: none;
}

.mx-datepicker-popup {
    left: 0px !important;
}

.mx-datepicker {
    display: inline-block !important;
}

.w100 {
    width: 100%;
}

.v-input__control {
    min-height: 32px !important;
}

.v-select {
    height: 33px !important;
    background-color: #ffd700;
    color: #797575;
    border-radius: 3px;
    padding: 5px;
}

.error {
    color: white;
}

.opacity-5 {
    opacity: 0.5;
}

.no-cursor {
    cursor: default;
}
</style>
