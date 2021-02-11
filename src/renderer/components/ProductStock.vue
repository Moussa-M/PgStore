<template>
<div class="wrapper">
    <div class="main-panel" :style="{'float':$i18n.locale=='ar' ? 'left':'right'}">
        <nav class="navbar navbar-default">
            <div class="nav-container">
                <div class="navbar-header" style="display: inline-flex;">
                    <a class="navbar-brand">{{$t("product_stock",{product:product.name})}}</a>
                </div>
                <ul class="nav navbar-nav navbar-right" style="margin-right: 0px">
                    <li>
                        <a class="btn btn-danger btn-circle" @click="backMeUp">
                            <i class="ti-close"></i>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
        <div class="content" style="height:90vh;padding: 15px">
            <div class="container-fluid" style=";width:100%">
                <div class="tab-content">
                    <div class="card">
                        <div class="content" style="padding: 0px">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="wrap-collabsible" style="display: flex;justify-content: space-between;align-items: flex-end;">
                                        <div style="display:inline-block">
                                            <v-menu v-if="initial_stocks.length>0" offset-y>
                                            <template v-slot:activator="{ on }">
                                                <v-btn icon v-on="on">
                                                    <v-icon>more_vert</v-icon>
                                                </v-btn>
                                            </template>
                                            <v-list>
                                                <v-list-tile @click.stop="pref.value = !pref.value" v-for="pref in preferences.stock_table.filter(p=>p.name.indexOf('show_') != -1)" :key="pref.name">
                                                    <v-list-tile-action>
                                                        <v-checkbox @click.stop="pref.value = !pref.value" v-model="pref.value"></v-checkbox>
                                                    </v-list-tile-action>

                                                    <v-list-tile-content>
                                                        <v-list-tile-title>{{$t(pref.name)}}</v-list-tile-title>
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                            </v-list>
                                        </v-menu>
                                        </div>
                                        

                                        <div style="display:inline-block" :style="{'float':$i18n.locale=='ar' ? 'left':'right'}" v-if="(total_available_qte-parseInt(product.stock_pre_alert) <= 0)&&initial_stocks.length>0 ">
                                                            <v-badge v-tooltip="{
                                                                            content: total_available_qte > 1 ?$t('stock_almost_end'):$t('stock_ended'),
                                            
                                                                            delay: {
                                                                                show: 250,
                                                                                hide: 10,
                                                                            },
                                                                            }" color="error lighten-2" left>
                                                                <template v-slot:badge>
                                                                    <v-icon color="error">
                                                                        mdi-circle-small
                                                                    </v-icon>
                                                                </template>
                                                                <v-icon large :color="total_available_qte > 1 ?'gray':'red'">
                                                                    mdi-package-variant
                                                                </v-icon>
                                                            </v-badge>
                                                        </div>
                                    </div>
                                    <div v-if="stocks.length>0" class="content table-responsive table-full-width">
                                        <table class="table table-hover">
                                            <thead>

                                                <th v-if="preferences.stock_table.find(p=>p.name == 'show_n').value" :class="$i18n.locale=='ar'?'onhoverRTL text-right':'onhoverLTR text-left'" width="5%">{{$t("n")}}</th>
                                                <th v-if="preferences.stock_table.find(p=>p.name == 'show_supplier').value" :class="$i18n.locale=='ar'?'onhoverRTL text-right':'onhoverLTR text-left'" width="10%">{{ $t("supplier") }}<i @click="orderTable('supplier',$event)" class="mdi mdi-sort"></i>
                                                </th>
                                                <th v-if="preferences.stock_table.find(p=>p.name == 'show_buy_date').value" :class="$i18n.locale=='ar'?'onhoverRTL text-right':'onhoverLTR text-left'" width="10%">{{ $t("buy_date") }}<i @click="orderTable('date',$event)" class="mdi mdi-sort"></i>
                                                </th>
                                                <th v-if="preferences.stock_table.find(p=>p.name == 'show_expiration_date').value" :class="$i18n.locale=='ar'?'onhoverRTL text-right':'onhoverLTR text-left'" width="15%">{{$t("expiration_date")}}<i @click="orderTable('exp_date',$event)" class="mdi mdi-sort"></i>
                                                </th>
                                                <th v-if="preferences.stock_table.find(p=>p.name == 'show_buy_price').value" :class="$i18n.locale=='ar'?'onhoverRTL text-right':'onhoverLTR text-left'" width="10%">{{$t("buy_price")}} ({{$t(currency.toLowerCase())}})<i @click="orderTable('buy_price',$event)" class="mdi mdi-sort"></i>
                                                </th>
                                                <th v-if="preferences.stock_table.find(p=>p.name == 'show_sell_price').value" :class="$i18n.locale=='ar'?'onhoverRTL text-right':'onhoverLTR text-left'" width="10%">{{$t("sell_price")}} ({{$t(currency.toLowerCase())}})<i @click="orderTable('sell_price',$event)" class="mdi mdi-sort"></i>
                                                </th>
                                                <th v-if="preferences.stock_table.find(p=>p.name == 'show_qte').value" :class="$i18n.locale=='ar'?'onhoverRTL text-right':'onhoverLTR text-left'" width="14%">{{$t("qte")}} ({{product.unit=='piece'? $t('piece'):($t(product.unit.toLowerCase())).toUpperCase()}})<i @click="orderTable('total_qte',$event)" class="mdi mdi-sort"></i>
                                                </th>
                                                <th v-if="preferences.stock_table.find(p=>p.name == 'show_available_qte').value" :class="$i18n.locale=='ar'?'onhoverRTL text-right':'onhoverLTR text-left'" width="15%">{{$t("available_qte")}} ({{product.unit=='piece'? $t('piece'):($t(product.unit.toLowerCase())).toUpperCase()}})<i @click="orderTable('available_qte',$event)" class="mdi mdi-sort"></i>
                                                </th>
                                                <th :class="$i18n.locale=='ar'?'text-left':'text-right'" width="15%">{{ $t("actions") }}</th>
                                                <th :class="$i18n.locale=='ar'?'text-left':'text-right'" v-if="hasExpireNotifications()" width="5%">{{ $t("notifications") }}</th>

                                            </thead>
                                            <draggable @change="updateStocksOrder()" v-model="filteredStocks" tag="tbody">
                                                <tr style="cursor: pointer;" v-for="(stock,index) in filteredStocks" :ref="stock.id" :key="stock.id" :class="stock.id==selected_id?'selected':'none'" @click="selectRow(stock.id)">
                                                    <td v-if="preferences.stock_table.find(p=>p.name == 'show_n').value">{{(currentPage-1)*pageMax + index+1}}
                                                    </td>
                                                    <td v-if="preferences.stock_table.find(p=>p.name == 'show_supplier').value">
                                                        <div class="row center-all">
                                                            <div :class="$i18n.locale=='ar'?'text-left':'text-right'" class="col-xs-3" style="width:65px;height:50px">
                                                                <div>
                                                                    <Avatar :image="isNotEmpty(getCustomer(stock.supplier_id).image) ? getCustomer(stock.supplier_id).image:'static/assets/img/faces/avatar.png'" :fullname="getCustomer(stock.supplier_id).name" :width="50" :height="50" :radius="50" :crop="true" :changeable="false" />
                                                                </div>
                                                            </div>
                                                            <div :class="$i18n.locale=='ar'?'text-right':'text-left'" class="col-xs-9 trim-text"> <span v-if="stock.supplier_id != 1">{{getCustomer(stock.supplier_id).name}}</span>
                                                                <span v-else>{{$t("anonymous")}}</span>
                                                                <br><span class="text-info">
                                                                    <small dir="ltr">{{getCustomer(stock.supplier_id).phone}}</small>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td v-if="preferences.stock_table.find(p=>p.name == 'show_buy_date').value">
                                                        <div :class="$i18n.locale=='ar'?'text-right':'text-left'">{{stock.date.substring(0,16).replace('T',' ')}}</div>
                                                    </td>
                                                    <td v-if="preferences.stock_table.find(p=>p.name == 'show_expiration_date').value">
                                                        <div :class="$i18n.locale=='ar'?'text-right':'text-left'">{{stock.exp_date ? stock.exp_date.substring(0,10).replace('T',' '):"None" }}</div>
                                                    </td>
                                                    <td v-if="preferences.stock_table.find(p=>p.name == 'show_buy_price').value" :class="$i18n.locale=='ar'?'text-right':'text-left'">{{parseFloat(stock.buy_price).toFixed(2)}}</td>
                                                    <td v-if="preferences.stock_table.find(p=>p.name == 'show_sell_price').value" :class="$i18n.locale=='ar'?'text-right':'text-left'">{{parseFloat(stock.sell_price).toFixed(2)}}</td>
                                                    <td v-if="preferences.stock_table.find(p=>p.name == 'show_qte').value" :class="$i18n.locale=='ar'?'text-right':'text-left'">{{stock.total_qte}} {{getStockQteDesc(stock)}} <span dir="rtl" class="label label-default">{{stock.total_qte - stock.available_qte}} {{$t('sold')}}</span></td>
                                                    <td v-if="preferences.stock_table.find(p=>p.name == 'show_available_qte').value" :class="$i18n.locale=='ar'?'text-right':'text-left'"> <span v-if="stock.available_qte == 0" class="label label-danger"> {{$t('sold_out')}}</span> <span v-else>{{stock.available_qte}}</span></td>

                                                    <td :class="$i18n.locale=='ar'?'text-left':'text-right'">
                                                        <!-- <button class="btn btn-success btn-icon" @click="editStock(stock.id,$event)">
                                                            <i class="ti-pencil"></i>
                                                        </button>
                                                        <button v-if="stock.available_qte == stock.total_qte" @click="deleteStock(stock.id,$event)" class="btn btn-danger btn-icon">
                                                            <i class="ti-trash"></i>
                                                        </button> -->
                                                        <v-btn icon class="icon-44" @click.stop="editStock(stock.id,$event)">
                                                            <i style="color:#ffd700" class="fs28 mdi mdi-pencil-outline"></i>
                                                        </v-btn>
                                                        <v-btn icon class="icon-44" @click.stop="deleteStock(stock.id,$event)">
                                                            <i style="color:red" class="fs28 mdi mdi-trash-can-outline"></i>
                                                        </v-btn>
                                                    </td>
                                                    <td v-if="hasExpireNotifications()" :class="$i18n.locale=='ar'?'text-left':'text-right'">
                                                        <div style="    margin: 5px;display:inline-block" v-if="hasExpired(stock)">
                                                            <v-badge v-tooltip="{
                                                                            content: hasExpiredFinally(stock) ?$t('stock_expired'):$t('stock_almost_expired'),
                                                                            delay: {
                                                                                show: 250,
                                                                                hide: 10,
                                                                            },
                                                                            }" color="error lighten-2" left>
                                                                <template v-slot:badge>
                                                                    <v-icon color="error">
                                                                        mdi-circle-small
                                                                    </v-icon>
                                                                </template>
                                                                <v-icon large :color="hasExpiredFinally(stock) ?'red':'gray'">
                                                                    mdi-calendar-alert
                                                                </v-icon>
                                                            </v-badge>
                                                        </div>
                                                        <!-- <div style="margin: 5px;display:inline-block" v-if="stock.available_qte-parseInt(getProduct(stock).stock_pre_alert) <= 0 ">
                                                            <v-badge v-tooltip="{
                                                                            content: stock.available_qte > 1 ?$t('stock_almost_end'):$t('stock_ended'),
                                            
                                                                            delay: {
                                                                                show: 250,
                                                                                hide: 10,
                                                                            },
                                                                            }" color="error lighten-2" left>
                                                                <template v-slot:badge>
                                                                    <v-icon color="error">
                                                                        mdi-circle-small
                                                                    </v-icon>
                                                                </template>
                                                                <v-icon large :color="stock.available_qte > 1 ?'gray':'red'">
                                                                    mdi-package-variant
                                                                </v-icon>
                                                            </v-badge>
                                                        </div> -->

                                                    </td>
                                                </tr>
                                            </draggable>
                                        </table>
                                        <div v-if="stocks.length > 0" class="row">
                                            <div class="col-md-12">
                                                <ul>
                                                    <li>
                                                        <h5 class="underline">
                                                            {{$t("total_qte")}}
                                                            <span class="label label-default" style="font-size: 17px;">{{total_qte}} {{($t(product.unit.toLowerCase())).toUpperCase()}}</span>
                                                        </h5>
                                                    </li>
                                                    <li>
                                                        <h5 class="underline">
                                                            {{$t("total_available_qte")}} :
                                                            <span class="label label-default" style="font-size: 17px;">{{total_available_qte}} {{($t(product.unit.toLowerCase())).toUpperCase()}}</span>
                                                        </h5>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div v-if="stocks.length > pageMax" class="row text-center">
                                            <nav aria-label="Search results pages">
                                                <v-pagination v-model="currentPage" :page-count="pageCount" :classes="bootstrapPaginationClasses" :labels="customLabels"></v-pagination>
                                            </nav>
                                        </div>
                                    </div>
                                    <div style="padding: 50px;" class="row text-center center-block" v-else>
                                        <div class="well" style="width:500px;border:none;border-shadow:none">
                                            <i style="font-size:90px;color:gray" class="mdi mdi-package-variant"></i>
                                            <h3>{{$t("no_stocks_found")}}</h3>
                                            <h5>{{$t("to_add_stock_click_on_press")}}</h5>

                                            <button @click="addStock" type="submit" class="btn btn-lg">{{$t("add_stock")}}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="stocks.length>0" class="row" style="margin-left: 0px;margin-right: 0px;">
                                <div :class="$i18n.locale=='ar'?'text-left':'text-right'">
                                    <button @click="addStock" type="submit" class="btn btn-lg">{{$t("add_stock")}}</button>
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
import Quantity from "./sub_components/Quantity.vue";
import vPagination from "vue-plain-pagination";
import {
    Product,
    Stock
} from "./models.js";
import Avatar from "./sub_components/Avatar.vue";
import AddStock from "./AddStock.vue";
import Vue from "vue";
const {
    dialog
} = require("electron").remote;
const nativeImage = require("electron").nativeImage;
const {
    app
} = require("electron").remote;
const fs = require("fs-extra");
import draggable from "vuedraggable";
export default {
    name: "ProductStock",
    props: {
        id: [Number, String]
    },
    components: {
        Quantity,
        Avatar,
        vPagination,
        draggable,
        AddStock
    },
    created: function () {
        console.log("CREATED " + this.$options.name);
        this.products = JSON.parse(JSON.stringify(store.getters.products));
        this.currency = JSON.parse(JSON.stringify(store.getters.user.currency));
        this.categories = JSON.parse(JSON.stringify(store.getters.categories));
        this.preferences = JSON.parse(JSON.stringify(store.getters.preferences));
        this.units = JSON.parse(JSON.stringify(store.getters.units));
        this.products = store.getters.products;
        this.currency = store.getters.user.currency;
        this.product = JSON.parse(JSON.stringify(store.getters.getProduct(this.id)));
        this.stocks = JSON.parse(JSON.stringify(store.getters.getStocks(this.product.id)));
        this.initial_stocks = JSON.parse(JSON.stringify(this.stocks));
        let index = 1;
        _.map(this.stocks, s => {
            s["buy_price"] = parseFloat(s["buy_price"]);
            s["sell_price"] = parseFloat(s["sell_price"]);
        });

        //init stocks
        if (!this.preferences.stock_table.find(p => p.name == "show_empty_qte")) {
            this.stocks = this.stocks.filter(stock => stock.available_qte > 0);
        }

        this.filterStocks();
    },
    data: function () {
        return {
            initial_stocks: [],
            selected_id: null,
            order_list: [],
            order_list_dir: [],
            hover: false,
            preferences: {},

            units: [],
            stocks: [],
            stock: {},
            unit: "pack",

            errors: [],
            products: [],
            filteredStocks: [],
            product: {},
            currency: null,
            currentPage: 1,
            pageMax: 7.0,
            pageCount: 0,
            currentCount: 0,
            searchText: "",
            bootstrapPaginationClasses: {
                ul: "pagination",
                li: "page-item",
                liActive: "active",
                liDisable: "disabled",
                button: "page-link"
            },
            customLabels: {
                first: this.$t("first"),
                prev: this.$t("previous"),
                next: this.$t("next"),
                last: this.$t("last")
            }
        };
    },
    mounted() {
        // this.$refs["name"].focus();
        $("tr").removeClass("animated pulse");
    },
    destroyed() {
        console.log("DESTROPYED " + this.$options.name);
    },
    deactivated() {
        console.log("dectivated " + this.$options.name);
    },
    activated() {
        this.products = JSON.parse(JSON.stringify(store.getters.products));
        this.stocks = JSON.parse(JSON.stringify(store.getters.getStocks(this.product.id)));
        this.currency = JSON.parse(JSON.stringify(store.getters.user.currency));
        this.initial_stocks = JSON.parse(JSON.stringify(this.stocks));
        //this.product = this.products.find(p =>  p.id === this.id );
        console.log(this.products[0]);
        console.log(this.id);
        let p = store.getters.getProduct(this.id);
        console.log(p);
        this.product = JSON.parse(
            JSON.stringify(store.getters.getProduct(this.id))
        );

        console.log("Activated " + this.$options.name);
        this.stocks = JSON.parse(
            JSON.stringify(store.getters.getStocks(this.product.id))
        );
        _.map(this.stocks, s => {
            s["buy_price"] = parseFloat(s["buy_price"]);
            s["sell_price"] = parseFloat(s["sell_price"]);
        });
        console.log(this.stocks);
        if (!this.preferences.stock_table.find(p => p.name == "show_empty_qte")) {
            this.stocks = this.stocks.filter(stock => stock.available_qte > 0);
        }
        this.filterStocks();
        this.orderTable();
        setTimeout(() => {
            $("tr").removeClass("animated pulse");
        }, 1000);
    },
    watch: {
        preferences: {
            handler(val) {
                console.log("pref update");
                store.dispatch("preferences", this.preferences);

                if (!this.preferences.stock_table.find(p => p.name == "show_empty_qte").value) {
                    this.stocks = this.stocks.filter(stock => stock.available_qte > 0);
                } else {
                    this.stocks = JSON.parse(
                        JSON.stringify(store.getters.getStocks(this.product.id))
                    );
                    _.map(this.stocks, s => {
                        s["buy_price"] = parseFloat(s["buy_price"]);
                        s["sell_price"] = parseFloat(s["sell_price"]);
                    });
                }
                this.filterStocks();
                this.orderTable();
            },
            deep: true
        },
        currentPage: function (val, oldVal) {
            console.log(this.currentPage);
            this.filterStocks();
        },
        // "preferences.stock_table": function() {
        //     console.log("bahiùùùùùùù");
        //     // this.preferences.stock_table.find(p=>p.name == "show_empty_qte") = this.preferences.stock_table.find(p=>p.name == "show_empty_qte");
        //     if (!this.preferences.stock_table.find(p=>p.name == "show_empty_qte").value) {
        //         this.stocks = this.stocks.filter(stock => stock.available_qte > 0);
        //     } else {
        //         this.stocks = JSON.parse(
        //             JSON.stringify(store.getters.getStocks(this.product.id))
        //         );
        //         _.map(this.stocks, s => {
        //             s["buy_price"] = parseFloat(s["buy_price"]);
        //             s["sell_price"] = parseFloat(s["sell_price"]);
        //         });
        //     }
        //     this.filterStocks();
        //     this.orderTable();
        // }
    },
    computed: {
        total_available_qte: function () {
            return _.reduce(
                this.stocks,
                function (sum, s) {
                    return sum + s.available_qte;
                },
                0
            );
        },

        total_qte: function () {
            return _.reduce(
                this.stocks,
                function (sum, s) {
                    return sum + s.total_qte;
                },
                0
            );
        }
    },
    methods: {
          hasExpireNotifications(){
          
           let exp_date_alert = false;

              _.forEach(this.stocks,(stock)=>{
                  if(moment(stock.exp_date).isValid()){
                 
                          if ((moment(stock.exp_date).subtract(parseInt(this.product.exp_date_pre_alert), "days")).isSameOrBefore(moment(), 'day')) {
                              
                                exp_date_alert = true
                          }
                        
                  }
             
              })
              return exp_date_alert;
 
           
      },
        hasExpired(stock) {
            console.log("parseInt(this.getProduct(stock).exp_date_pre_alert)");
            console.log((moment(stock.exp_date).subtract(parseInt(this.getProduct(stock).exp_date_pre_alert), "days")).isSameOrBefore(moment(), 'day'));
            if (moment(stock.exp_date).isValid()) {
                if ((moment(stock.exp_date).subtract(parseInt(this.getProduct(stock).exp_date_pre_alert), "days")).isSameOrBefore(moment(), 'day')) {
                    return true
                }
            }
            return false;
        },
        hasExpiredFinally(stock) {
            console.log("moment(stock.exp_date).isSameOrBefore(moment(),'day')");
            console.log(moment(stock.exp_date).isSameOrBefore(moment(),'day'));
            return moment(stock.exp_date).isSameOrBefore(moment(),'day')
        },
        getProduct(stock){
            return store.getters.getProduct(stock.product_id,true)
        },
        getStockQteDesc(stock) {

            return this.product.is_bulk_sell ? _.join(["(", stock.pack, "x", stock.packing, stock.extra_units ? '+' + stock.extra_units : "", ") "], '') : ""
        },
        changePref(pref) {
            console.log("dsqdkqsldksqlmdksqlmdkqs")
        },
        getCustomer(id) {
            return store.getters.getCustomer(id, true);
        },
        isNotEmpty(str) {
            if (str != null && str != "") {
                return true;
            }
            return false;
        },
        updateStocksOrder() {
            console.log("this.filteredStocks");
            console.log(this.filteredStocks);
        },
        selectRow(id) {
            if (id != null) {
                console.log(id);
                this.selected_id = id;
            }
        },
        orderTable(order_by = null, event = null) {
            if (order_by != null) {
                _.remove(this.order_list, o => {
                    return o == order_by;
                });
                this.order_list.unshift(order_by);
                this.order_list_dir = [];
                _.forEach(this.order_list, o => {
                    switch (o) {
                        case "date":
                            this.stock_date_asc = !this.stock_date_asc;
                            this.order_list_dir.push(this.stock_date_asc ? "asc" : "desc");
                            break;
                        case "exp_date":
                            this.stock_exp_date_asc = !this.stock_exp_date_asc;
                            this.order_list_dir.push(
                                this.stock_exp_date_asc ? "asc" : "desc"
                            );
                            break;
                        case "buy_price":
                            this.stock_buy_price_asc = !this.stock_buy_price_asc;
                            this.order_list_dir.push(
                                this.stock_buy_price_asc ? "asc" : "desc"
                            );
                            break;
                        case "sell_price":
                            this.stock_sell_price_asc = !this.stock_sell_price_asc;
                            this.order_list_dir.push(
                                this.stock_sell_price_asc ? "asc" : "desc"
                            );
                            break;
                        case "total_qte":
                            this.stock_total_qte_asc = !this.stock_total_qte_asc;
                            this.order_list_dir.push(
                                this.stock_total_qte_asc ? "asc" : "desc"
                            );
                            break;
                        case "available_qte":
                            this.stock_available_qte_asc = !this.stock_available_qte_asc;
                            this.order_list_dir.push(
                                this.stock_available_qte_asc ? "asc" : "desc"
                            );
                            break;
                    }
                });
            }

            this.stocks = _.orderBy(
                this.stocks,
                this.order_list,
                this.order_list_dir
            );
            this.filterStocks();
            if (event) {
                $(event.target).toggleClass("rotate180");
            }
        },
        filterStocks() {
            if (this.stocks.length > 0) {
                this.filteredStocks = _.slice(
                    this.stocks,
                    this.pageMax * (this.currentPage - 1),
                    this.pageMax * (this.currentPage - 1) + this.pageMax
                );
            }
            this.pageCount = Math.ceil(this.stocks.length / this.pageMax);
            console.log(this.pageCount);
        },
        deleteStock(id) {
            event.stopPropagation();
            swal({
                title: this.$t("delete_stock_confirm"),
                text: "",
                icon: "warning",
                buttons: [this.$t("no"), this.$t("yes")],
                dangerMode: true
            }).then(willDelete => {
                if (willDelete) {
                    $(this.$refs[id]).addClass("animated fadeOutLeft");

                    setTimeout(() => {
                        store.dispatch("deleteStock", id);
                        _.remove(this.stocks, function (o) {
                            return o.id == id;
                        });
                        this.stocks = JSON.parse(
                            JSON.stringify(store.getters.getStocks(this.product.id))
                        );
                        if (this.filteredStocks.length == 1) {
                            this.currentPage =
                                this.currentPage > 1 ? this.currentPage - 1 : 1;
                        }

                        this.filterStocks();
                        this.orderTable();
                    }, 500);
                } else {
                    // swal("Your imaginary file is safe!");
                }
            });
        },
        editStock(id, event) {
            event.stopPropagation();
            $("tr").removeClass("animated pulse");
            setTimeout(() => {
                $(this.$refs[id]).addClass("animated pulse");
                this.$router.push({
                    name: "edit_stock",
                    params: {
                        id: id
                    }
                });
            }, 250);
        },
        addStock() {
            this.$router.push({
                name: "add_stock",
                params: {
                    product_id: this.product.id
                }
            });
        },

        getSellingPrice() {
            return (
                this.stock.sell_price *
                (1 - parseFloat(this.stock.discount) / 100)
            ).toFixed(2);
        },

        backMeUp() {
            this.$router.go(-1);
            //this.$destroy();
        },
        validEmail: function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
        getNextIndex: products => {
            let dat = new Date();
            let index = dat.getYear();
        }
    }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" scoped>
$color: red;

.w-100 {
    width: 100%;
}

.h-100 {
    height: 100% !important;
}

.h-96 {
    height: 96% !important;
}

.w-96 {
    width: 96% !important;
}

.p-10 {
    padding: 10px;
}

/* 
.wrapper::-webkit-scrollbar {
  width: 0em;
} */

.wrapper {
    position: relative;
    top: 30px !important;
    height: 100vh;
    font-size: 15px;
    overflow-y: auto !important;
}

.main-panel {
    /*   border: 10px solid white;
    border-radius: 25px;*/
    // padding: 9px;
    height: 100%;
    width: 100% !important;
}

.btnC {
    display: block;
    height: 30px;
    width: 30px;
    border-radius: 50%;
    border: 0px solid red !important;
    border-width: 0px !important;
}

.card {
    background-color: inherit;
    box-shadow: none;
}

.pagination {
    margin: 0px;
}

.list-unstyled>li {
    margin: 10px !important;
    padding: 10px !important;
    background-color: white;
    width: 200px;
}

.flex-container {
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    flex-flow: row;
    width: 100%;
    overflow-x: scroll;

    /*flex-wrap:wrap;*/
}

.box {
    flex: 1;
    -webkit-flex: 1;
    min-width: 200px;
    height: 80px;
}

.vertical-center {
    display: flex;
    align-items: center;
}

.selected_btn {
    background-color: #ffe681 !important;
    color: white !important;
}

th {
    padding: 10px;
}

thead {
    background: #f5f5f5;
}

th {
    padding: 10px;
    line-height: 38px;
}

thead {
    background: #f5f5f5;
}

.table>tbody>tr>td,
.table>tbody>tr>th,
.table>tfoot>tr>td,
.table>tfoot>tr>th,
.table>thead>tr>td,
.table>thead>tr>th {
    border-top: 1px solid #ddd !important;
}

.rotate180 {
    transform: scaleY(-1);
}

.onhover {
    i {
        display: none;
        float: right;
        font-size: 20px;
        transition: all 0.4s ease;
    }
}

.onhover:hover {
    i {
        display: inline-block;
    }
}

.ti-exchange-vertical {
    padding-left: 10px;
    transition: all 0.3s ease-out;
}

.selected {
    background-color: rgb(236, 236, 236);
}

.underline {
    border-bottom: 1px solid rgb(207, 207, 207);
    display: inline-block;
    line-height: 40px;
    margin-bottom: 0px;
}

.wrap-collabsible {
    margin-bottom: 1.2rem 0;
}

input[type="checkbox"] {
    display: none;
}

.lbl-toggle {
    //display: block;

    font-weight: bold;
    //font-family: monospace;
    //font-size: 1.2rem;
    text-transform: uppercase;
    text-align: center;

    //padding: 1rem;

    color: #a77b0e;
    //background: #FAE042;

    cursor: pointer;

    border-radius: 7px;
    transition: all 0.25s ease-out;
}

.lbl-toggle:hover {
    color: #7c5a0b;
}

.lbl-toggle::before {
    //content: ' ';
    font-family: "FontAwesome";
    content: "\f105";
    display: inline-block;

    // border-top: 5px solid transparent;
    // border-bottom: 5px solid transparent;
    // border-left: 5px solid currentColor;
    vertical-align: middle;
    margin-right: 0.7rem;
    margin-left: 0.7rem;
    font-size: 20px;
    transform: translateY(-2px);

    transition: transform 0.2s ease-out;
}

.toggle:checked+.lbl-toggle::before {
    transform: rotate(90deg) translateX(-3px);
}

.collapsible-content {
    max-height: 0px;
    overflow: hidden;
    transition: max-height 0.25s ease-in-out;
}

.toggle:checked+.lbl-toggle+.collapsible-content {
    max-height: 350px;
}

.toggle:checked+.lbl-toggle {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
}

.collapsible-content .content-inner {
    // background: rgba(250, 224, 66, .2);
    // border-bottom: 1px solid rgba(250, 224, 66, .45);
    border-bottom-left-radius: 7px;
    border-bottom-right-radius: 7px;
    padding: 0.5rem 1rem;
}

.fancy-checkbox {
    margin-left: 15px;
}

.fancy-checkbox input[type="checkbox"] {
    display: none;
}

.fancy-checkbox span {
    font-size: 18px;
}

.fancy-checkbox span:before {
    font-family: "FontAwesome";
    font-style: normal;
    width: 1em;
    height: 1em;
    content: "\f0c8";
    margin-right: 0.3em;
    font-size: 20px;
    color: #ffe681;
}

.fancy-checkbox input[type="checkbox"]:checked~span:before {
    content: "\f14a";
}

.onhoverLTR {
    i {
        opacity: 0;
        float: right;
        font-size: 20px;
        transition: all 0.4s ease;
    }
}

.onhoverLTR:hover {
    i {
        opacity: 1;
    }
}

.onhoverRTL {
    i {
        opacity: 0;
        float: left;
        font-size: 20px;
        transition: all 0.4s ease;
    }
}

.onhoverRTL:hover {
    i {
        opacity: 1;
    }
}

.red-v {
    &.popover {
        color: #eee;

        .popover-inner {
            background: red;
            color: black;
            padding: 24px;
            border-radius: 5px;
            box-shadow: 0 5px 30px rgba(black, .1);
        }
    }
}
</style>
