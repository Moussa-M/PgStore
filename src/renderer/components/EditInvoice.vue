<template lang="lang">
<div class="wrapper">
    <div class="main-panel" :style="{'float':$i18n.locale=='ar' ? 'left':'right'}">
        <nav class="navbar navbar-default">
            <div class="nav-container">
                <div class="navbar-header" style="display: inline-flex;">
                    <a class="navbar-brand">{{$t("edit_invoice")}}</a>
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
            <div class="container-fluid" style=";width:100%">
                <div class="tab-content">
                    <div class="card">
                        <div class="content" style="padding: 0px">
                            <div class="row">
                                <h4 class="titleheader">{{$t("stocks")}}</h4>
                                <div class="col-md-12">
                                    <div class="content table-responsive table-full-width">
                                        <table class="table table-hover">
                                            <thead>
                                                <th width="2%">{{$t("n")}}</th>
                                                <th :class="$i18n.locale=='ar'?'text-right':'text-left'" width="20%">{{$t("name")}}</th>
                                                <th :class="$i18n.locale=='ar'?'text-right':'text-left'" width="20%">{{$t("qte")}}</th>

                                                <th :class="$i18n.locale=='ar'?'text-right':'text-left'" width="10%">{{$t("buy_price")}} ({{$t(currency.toLowerCase())}})</th>
                                                <th :class="$i18n.locale=='ar'?'text-right':'text-left'" width="10%">{{$t("sell_price")}} ({{$t(currency.toLowerCase())}})</th>

                                                <th :class="$i18n.locale=='ar'?'text-right':'text-left'" width="10%">{{$t("discount")}}</th>
                                                <th :class="$i18n.locale=='ar'?'text-right':'text-left'" width="10%">{{$t("store_credit_points")}}</th>

                                                <th :class="$i18n.locale=='ar'?'text-right':'text-left'" width="10%">{{$t("expiration_date")}}</th>
                                                <th :class="$i18n.locale=='ar'?'text-left':'text-right'" width="20%">{{ $t("actions") }}</th>
                                            </thead>
                                            <draggable @change="updateStocksOrder()" v-model="invoice.stocks" tag="tbody" v-if="invoice.stocks.length > 0">

                                                <tr style="cursor: pointer;" class="new-row" v-for="(stock,index) in invoice.stocks" :ref="stock.id" :key="stock.id">
                                                    <td>{{index+1}}</td>
                                                    <td>
                                                        <div v-if="!stock.edit" :class="$i18n.locale=='ar'?'text-right':'text-left'">{{stock.product.name}}</div>
                                                        <div v-else>
                                                            <div class="form-group">
                                                                <TypeAhead :disabled="stock.disabled" v-model="stock.product.name" classes="w100" @onHit="updateStockName(stock,$event)" @onDoubleClick="onDoubleClickStock(stock)" :placeholder="$t('product_name')" :objectArray="JSON.parse(JSON.stringify(products))" :highlighting="highlighting" :minChars="parseInt(1)" :selectFirst="false" :render="render"></TypeAhead>
                                                            </div>
                                                            <span v-show="errors['name']" class="error">{{errors["name"]}}</span>
                                                        </div>
                                                    </td>

                                                    <td :class="$i18n.locale=='ar'?'text-right':'text-left'">
                                                        <div v-if="!stock.edit">{{stock.total_qte}} {{stock.product.unit=='piece'?" ("+stock.pack+"x"+stock.packing+(stock.extra_units==0)?"":"+"+stock.extra_units +")":""}}</div>
                                                        <div v-else>
                                                            <div class="row">
                                                                <div class="col-md-6" style="padding:5px">
                                                                    <div class="form-group">
                                                                        <div class="input-group">
                                                                            <input v-tooltip="{content: $t('packs_bags_count'),delay: {show: 750,hide: 10,},}" type="number" :class="errors['pack']?'error_border':''" min="1" step="1" oninput="validity.valid||(value='1');" @change="stock.pack = parseFloat(stock.pack.toString())" @keyup.enter="addStockToInvoice()" class="form-control border-input animated" v-model="stock.pack" :placeholder="$t('pack_count')" value="1">

                                                                            <span style="padding: 3px;font-size: 12px;" class="input-group-addon">{{$t("packs")}}</span>
                                                                        </div>
                                                                        <span v-show="errors['pack']" class="error">{{errors["pack"]}}</span>
                                                                    </div>
                                                                </div>
                                                                <div class="col-md-6" style="padding:5px">
                                                                    <div class="form-group">
                                                                        <div class="input-group">
                                                                            <input v-tooltip="{content: stock.unit=='piece' ? $t('extra_units'):$t('extra_weight'),delay: {show: 750,hide: 10,},}" :class="errors['packing']?'error_border':''" @keyup.enter="addStockToInvoice()" v-model="stock.extra_units" type="number" dir="ltr" :max="stock.unit=='piece'?parseInt(stock.packing)-1:parseFloat(stock.packing)-0.01" :min="stock.unit=='piece'?1:0.01" :step="stock.unit=='piece'?1:0.01" :ref="'extra_units'+stock.id" @keyup="extraUnitChangedList(stock)" class="form-control border-input animated" :placeholder="stock.unit=='piece' ? $t('extra_units'):$t('extra_weight')">

                                                                            <span style="padding: 3px;font-size: 12px;" class="input-group-addon">{{stock.unit=='piece' ? $t('extra_units'):$t('extra_weight')}}</span>
                                                                        </div>
                                                                        <span v-show="errors['packing']" class="error">{{errors["packing"]}}</span>
                                                                        <span v-show="errors['weight']" class="error">{{errors["weight"]}}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </td>

                                                    <td :class="$i18n.locale=='ar'?'text-right':'text-left'">
                                                        <div v-if="!stock.edit">{{parseFloat(stock.buy_price).toFixed(2)}}</div>
                                                        <div v-else>
                                                            <div class="form-group">
                                                                <input type="number" min="0.00" :class="errors['buy_price']?'error_border':''" class="form-control border-input" @keyup.enter="updateStock(stock,$event)" v-model="stock.buy_price" :placeholder="$t('buy_price')" value>
                                                            </div>
                                                            <span v-show="errors['buy_price']" class="error">{{errors["buy_price"]}}</span>
                                                        </div>
                                                    </td>
                                                    <td :class="$i18n.locale=='ar'?'text-right':'text-left'">
                                                        <div v-if="!stock.edit">{{parseFloat(stock.sell_price).toFixed(2)}}</div>
                                                        <div v-else>
                                                            <div class="form-group">
                                                                <input type="number" min="0.00" :class="errors['sell_price']?'error_border':''" @keyup.enter="updateStock(stock,$event)" class="form-control border-input" v-model="stock.sell_price" :placeholder="$t('sell_price')">
                                                            </div>
                                                            <span v-show="errors['sell_price']" class="error">{{errors["sell_price"]}}</span>
                                                        </div>
                                                    </td>

                                                    <td :class="$i18n.locale=='ar'?'text-right':'text-left'">
                                                        <div v-if="!stock.edit">{{parseFloat(stock.discount).toFixed(2)}}</div>
                                                        <div v-else>
                                                            <div class="form-group">
                                                                <input type="number" max="100" min="0" step="0.1" @change="stock.discount = parseFloat(stock.discount).toFixed(2)" @keyup.enter="updateStock(stock,$event)" class="form-control border-input animated" v-model="stock.discount" :placeholder="$t('discount')" value="0">
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td :class="$i18n.locale=='ar'?'text-right':'text-left'">
                                                        <div v-if="!stock.edit">{{parseFloat(stock.store_credit_points).toFixed(2)}}</div>
                                                        <div v-else>
                                                            <div class="form-group">
                                                                <input type="number" min="0" step="1" oninput="validity.valid||(value='0');" @change="stock.store_credit_points = parseInt(stock.store_credit_points)" @keyup.enter="updateStock(stock,$event)" class="form-control border-input animated" v-model="stock.store_credit_points" :placeholder="$t('store_credit_points')" value="0">
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <div v-if="!stock.edit" :class="$i18n.locale=='ar'?'text-right':'text-left'">{{stock.exp_date ? stock.exp_date.substring(0,10).replace('T',' '):"None" }}</div>

                                                        <div v-else>
                                                            <div class="form-group">
                                                                <date-picker v-model="stock.exp_date" input-class="mx-input" :confirm="true" :not-before="new Date()" :shortcuts="shortcuts" :lang="lang"></date-picker>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td :class="$i18n.locale=='ar'?'text-left':'text-right'">
                                                        <button v-if="!stock.edit && (stock.available_qte == stock.total_qte)" @click="deleteStock(stock.id,$event)" class="btn btn-danger btn-icon">
                                                            <i class="ti-trash"></i>
                                                        </button>
                                                        <button v-if="!stock.edit" class="btn btn-success btn-icon" @click="editStock(stock.id,$event)">
                                                            <i class="ti-pencil"></i>
                                                        </button>
                                                        <button v-else class="btn btn-success btn-icon" @click="updateStock(stock,$event)">
                                                            <i style="font-size:20px" class="mdi mdi-content-save-outline"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            </draggable>
                                            <tr v-if="show_new_stock" class="new-row" :ref="new_stock.id" :key="new_stock.id">
                                                <td class="indexStyle">{{invoice.stocks.length+1}}</td>
                                                <td :class="$i18n.locale=='ar'?'text-right':'text-left'">
                                                    <div class="form-group">
                                                        <TypeAhead :disabled="new_item_selected" v-model="new_stock.product.name" classes="w100" @onHit="onHit(new_stock,$event)" @onDoubleClick="onDoubleClick(stock)" :placeholder="$t('product_name')" :objectArray="JSON.parse(JSON.stringify(products))" :highlighting="highlighting" :minChars="parseInt(1)" :selectFirst="false" :render="render"></TypeAhead>
                                                    </div>
                                                    <span v-show="new_errors['name']" class="error">{{new_errors["name"]}}</span>
                                                </td>
                                                <td :class="$i18n.locale=='ar'?'text-right':'text-left'">
                                                    <div class="row">
                                                        <div class="col-md-6" style="padding:5px">
                                                            <div class="form-group">
                                                                <div class="input-group">
                                                                    <input v-tooltip="{content: $t('packs_bags_count'),delay: {show: 750,hide: 10,},}" type="number" :class="new_errors['pack']?'error_border':''" min="1" step="1" oninput="validity.valid||(value='1');" @change="new_stock.pack = parseFloat(new_stock.pack.toString())" @keyup.enter="addStockToInvoice()" class="form-control border-input animated" v-model="new_stock.pack" :placeholder="$t('pack_count')" value="1">

                                                                    <span style="padding: 3px;font-size: 12px;" class="input-group-addon">{{$t("packs")}}</span>
                                                                </div>
                                                                <span v-show="new_errors['pack']" class="error">{{new_errors["pack"]}}</span>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6" style="padding:5px">
                                                            <div class="form-group">
                                                                <div class="input-group">
                                                                    <input v-tooltip="{content: new_stock.unit=='piece' ? $t('extra_units'):$t('extra_weight'),delay: {show: 750,hide: 10,},}" :class="new_errors['packing']?'error_border':''" @keyup.enter="addStockToInvoice()" v-model="new_stock.extra_units" type="number" dir="ltr" :max="new_stock.unit=='piece'?parseInt(new_stock.packing)-1:parseFloat(new_stock.packing)-0.01" :min="new_stock.unit=='piece'?1:0.01" :step="new_stock.unit=='piece'?1:0.01" ref="extra_unit" @keyup="extraUnitChanged()" class="form-control border-input animated" :placeholder="new_stock.unit=='piece' ? $t('extra_units'):$t('extra_weight')">

                                                                    <span style="padding: 3px;font-size: 12px;" class="input-group-addon">{{new_stock.unit=='piece' ? $t('extra_units'):$t('extra_weight')}}</span>
                                                                </div>
                                                                <span v-show="new_errors['packing']" class="error">{{new_errors["packing"]}}</span>
                                                                <span v-show="new_errors['weight']" class="error">{{new_errors["weight"]}}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td :class="$i18n.locale=='ar'?'text-right':'text-left'">
                                                    <div class="form-group">
                                                        <input type="number" min="0.00" :class="new_errors['buy_price']?'error_border':''" class="form-control border-input" @keyup.enter="addStockToInvoice()" v-model="new_stock.buy_price" :placeholder="$t('buy_price')" value>
                                                    </div>
                                                    <span v-show="new_errors['buy_price']" class="error">{{new_errors["buy_price"]}}</span>
                                                </td>
                                                <td :class="$i18n.locale=='ar'?'text-right':'text-left'">
                                                    <div class="form-group">
                                                        <input type="number" min="0.00" :class="new_errors['sell_price']?'error_border':''" class="form-control border-input" @keyup.enter="addStockToInvoice()" v-model="new_stock.sell_price" :placeholder="$t('sell_price')">
                                                    </div>
                                                    <span v-show="new_errors['sell_price']" class="error">{{new_errors["sell_price"]}}</span>
                                                </td>

                                                <td :class="$i18n.locale=='ar'?'text-right':'text-left'">
                                                    <div class="form-group">
                                                        <input type="number" max="100" min="0" step="0.1" @change="new_stock.discount = parseFloat(new_stock.discount).toFixed(2)" @keyup.enter="addStockToInvoice()" class="form-control border-input animated" v-model="new_stock.discount" :placeholder="$t('discount')" value="0">
                                                    </div>
                                                </td>

                                                <td :class="$i18n.locale=='ar'?'text-right':'text-left'">
                                                    <div class="form-group">
                                                        <input type="number" min="0" step="1" oninput="validity.valid||(value='0');" @change="new_stock.store_credit_points = parseInt(new_stock.store_credit_points)" @keyup.enter="updateStock(stock,$event)" class="form-control border-input animated" v-model="new_stock.store_credit_points" :placeholder="$t('store_credit_points')" value="0">
                                                    </div>
                                                </td>

                                                <td>
                                                    <div class="form-group">
                                                        <date-picker v-model="new_stock.exp_date" input-class="mx-input" :confirm="true" :not-before="new Date()" :shortcuts="shortcuts" :lang="lang"></date-picker>
                                                    </div>
                                                </td>
                                                <td :class="$i18n.locale=='ar'?'text-left':'text-right'">
                                                    <button class="btn btn-danger btn-icon" @click="hideNewStock()">
                                                        <i style="font-size:22px" class="ti-trash"></i>
                                                    </button>
                                                    <button class="btn btn-success btn-icon" @click="addStockToInvoice()">
                                                        <i style="font-size:22px" class="mdi mdi-content-save-outline"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        </table>

                                        <div v-if="!show_new_stock && invoice.stocks.length == 0" class="text-center center-block row">
                                            <div class="well" style="width:500px;border:none;border-shadow:none">
                                                <i style="font-size:90px;color:gray" class="mdi mdi-package-variant"></i>
                                                <h3>{{$t("to_add_stock_click_on_press")}}</h3>
                                                <button v-if="!show_new_stock" @click="showNewStock()" type="submit" class="btn btn-default btn-lg">{{$t('add_stock')}}</button>
                                            </div>
                                        </div>
                                        <div class="row" style="margin:0px">
                                            <div v-if="invoice.stocks.length > 0" class="col-md-3 total-well">
                                                <ul>
                                                    <li>
                                                        <h5 class="underline">
                                                            {{$t('qte')}} :
                                                            <span class="label">{{invoice.stocks.length}}</span>
                                                        </h5>
                                                    </li>
                                                    <li>
                                                        <h5 class="underline">
                                                            {{$t('total_net')}} :
                                                            <span class="label"><span dir="ltr"> {{total_net | currency}} </span> {{ $t(currency.toLowerCase()).toUpperCase()}}</span>
                                                        </h5>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div class="col-md-9" :class="invoice.stocks.length == 0?'col-md-offset-3':''">
                                                <div :class="$i18n.locale=='ar'?'text-left':'text-right'">
                                                    <button v-if="invoice.stocks.length > 0 && !show_new_stock" @click="showNewStock()" type="submit" class="btn btn-icon btn-success">
                                                        <i class="ti-plus"></i>
                                                    </button>
                                                </div>
                                                <!-- <div
                            style="margin-top:20px"
                            :class="$i18n.locale=='ar'?'text-left':'text-right'"
                          >
                            <button
                              v-if="invoice.stocks.length>0"
                              @click="saveInvoie()"
                              type="submit"
                              class="btn btn-lg"
                            >{{$t("save_invoice")}}</button>
                          </div> -->
                                                <div class="clearfix"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr>
                            <div class="row" style="margin-bottom:50px">
                                <div class="col-md-12">
                                    <div class="wrap-collabsible">
                                        <input id="collapsible" class="toggle" type="checkbox">
                                        <label for="collapsible" class="lbl-toggle">
                                            {{$t('supplier')}}
                                            <span style="text-transform:none" v-if="is_customer_selected">({{customer.id == 1 ?$t("anonymous"):customer.name}})</span>
                                        </label>
                                        <div class="collapsible-content">
                                            <div class="content-inner">
                                                <div class="col-md-12" style="padding:5px;">
                                                    <div style="width:40%" class="form-group">
                                                        <label>{{ $t("filter_by_name_or_phone") }}</label>
                                                        <input type="text" class="form-control border-input" v-model="customer_filter_input" :placeholder="$t('filter_by_name_or_phone')" value>
                                                    </div>
                                                </div>
                                                <ul @wheel="scrollHor" class="list-unstyled list-inline team-members flex-container">
                                                    <li v-for="customer in filtered_customers" class="card box" :key="customer.id">
                                                        <CustomerCard :customer="customer" :key="customer.id" v-on:selectCustomer="selectCustomer(customer.id)" :isSelected="customer.selected" />
                                                    </li>
                                                    <li class="card box vertical-center">
                                                        <div class="w-100">
                                                            <div class="col-xs-12 text-center">
                                                                <button @click="addCustomer" class="btn btn-success btn-icon">
                                                                    <i class="ti-plus"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row" :class="$i18n.locale=='ar'?'text-left':'text-right'" style="margin-bottom:50px">

                                <div style="margin-top:20px" :class="$i18n.locale=='ar'?'text-left':'text-right'">
                                    <button v-if="invoice.stocks.length>0" @click="saveInvoie()" type="submit" class="btn btn-lg">{{$t("update_invoice")}}</button>
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
    Invoice
} from "./models.js";
import Avatar from "./sub_components/Avatar.vue";
import DatePicker from "vue2-datepicker";
import draggable from "vuedraggable";
import TypeAhead from "./sub_components/TypeAhead.vue";
import CustomerCard from "./sub_components/CustomerCard.vue";
import {
    Module
} from "module";
export default {
    name: "new-invoice",
    props: {
        id: [Number, String]
    },
    components: {
        Quantity,
        Avatar,
        vPagination,
        DatePicker,
        CustomerCard,
        draggable,
        TypeAhead
        // VueBootstrapTypeahead
    },
    created: function () {
        this.products = JSON.parse(JSON.stringify(store.getters.products));
        this.customers = JSON.parse(JSON.stringify(store.getters.customers));
        this.currency = JSON.parse(JSON.stringify(store.getters.user.currency));
        this.products = JSON.parse(JSON.stringify(store.getters.products));
        this.stocks = JSON.parse(JSON.stringify(store.getters.stocks));

        this.invoice = store.getters.getInvoice(this.id);
        let invoice_stocks = JSON.parse(
            JSON.stringify(store.getters.getInvoiceStocks(this.id))
        );
        console.log(invoice_stocks);
        this.invoice.stocks = _.map(invoice_stocks, s => {
            s.disabled = true;
            s.edit = false;
            s.product = store.getters.getProduct(s.product_id);
            return s;
        });
        this.$set(this.invoice, "stocks", this.invoice.stocks);

        let temp_customer = store.getters.getCustomer(
            this.invoice.supplier_id,
            true
        );
        if (temp_customer.is_deleted) {
            this.customers.push(temp_customer);
        }
        this.selectCustomer(this.invoice.supplier_id);

        this.new_stock = {
            id: uuid(),
            product_id: null,
            supplier_id: this.invoice.supplier_id,
            invoice_id: this.invoice.id,
            product: {
                id: "",
                name: "",
                unit: "piece",
                category: "",
                barcode: ""
            },
            date: moment().format(),
            exp_date: null,
            unit: "piece",
            pack: "",
            packing: "",
            available_qte: 0,
            total_qte: "",
            buy_price: "",
            sell_price: "",
            edit: false,
            disabled: true,
            discount: ""
        };
    },
    data: function () {
        return {
            customer_filter_input: "",
            filtered_customers: [],
            isCustomerSelected: {},
            is_customer_selected: false,
            new_item_selected: false,
            invoice: {
                "stocks": []
            },
            order_list: [],
            order_list_dir: [],
            stocks: [],
            new_stock: {},
            show_new_stock: false,
            errors: [],
            new_errors: {},
            customer: {},
            products: [],
            customers: [],
            currency: null,
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

    activated() {
        let last_size = this.customers.length;
        this.customers = JSON.parse(JSON.stringify(store.getters.customers));
        var temp_customer = store.getters.getCustomer(
            this.invoice.supplier_id,
            true
        );
        if (temp_customer.is_deleted) {
            this.customers.unshift(temp_customer);
        }
        if (this.customers.length > last_size) {
            setTimeout(() => {
                this.selectCustomer(_.last(this.customers).id);
            }, 250);
        } else {
            this.selectCustomer(this.invoice.supplier_id);
        }
        this.refreshCustomers();
    },
    watch: {
        customer_filter_input(val) {
            this.refreshCustomers();
        }
    },
    computed: {
        total_net: function () {
            return _.reduce(
                this.invoice.stocks,
                function (sum, s) {
                    return sum + s.buy_price * s.total_qte;
                },
                0
            );
        }
    },
    methods: {
        extraUnitChanged() {
            console.log(this.$refs);
            _.debounce(() => {
                if (this.new_stock.unit == 'piece') {
                    if (!this.$refs['extra_unit'].validity.valid) {

                        this.$refs['extra_unit'].value = 0;
                        this.new_stock.extra_units = 0;

                    }
                } else {
                    if (!this.$refs['extra_unit'].validity.valid) {

                        this.$refs['extra_unit'].value = 0;
                        this.new_stock.extra_units = 0;

                    }

                }

            }, 500)();

        },
        extraUnitChangedList(stock) {
            console.log(this.$refs['extra_units' + stock.id]);
            _.debounce(() => {
                if (stock.unit == 'piece') {
                    if (!this.$refs['extra_units' + stock.id][0].validity.valid) {

                        this.$refs['extra_units' + stock.id][0].value = 0;
                        stock.extra_units = 0;

                    }
                } else {
                    if (!this.$refs['extra_units' + stock.id][0].validity.valid) {

                        this.$refs['extra_units' + stock.id][0].value = 0;
                        stock.extra_units = 0;

                    }

                }

            }, 500)();

        },
        refreshCustomers() {
            this.filtered_customers = _.filter(this.customers, c => {
                if (this.customer_filter_input == "") {
                    return true;
                } else {
                    if (
                        c.name
                        .toLowerCase()
                        .search(this.customer_filter_input.toLowerCase()) != -1 ||
                        c.phone
                        .toLowerCase()
                        .search(this.customer_filter_input.toLowerCase()) != -1
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                }
            });
        },
        addCustomer() {
            this.$router.push("/new-customer");
        },
        selectCustomer(id) {
            this.customers = _.map(this.customers, c => {
                if (c.id == id) {
                    c.selected = true;
                    this.customer = c;
                } else {
                    c.selected = false;
                }
                return c;
            });

            this.is_customer_selected = true;
        },
        scrollHor(event) {
            $(".flex-container").scrollLeft(
                event.deltaY + $(".flex-container").scrollLeft()
            );
        },
        onDoubleClick: function (item) {
            this.new_item_selected = false;
        },

        onHit: function (stock, data) {
            let item = data.item;
            this.new_errors = {};
            this.new_item_selected = true;
            let stocks = JSON.parse(JSON.stringify(store.getters.getStocks(item.id)));

            if (stocks.length > 0) {
                let stock = _.last(stocks);
                stock.exp_date = "";
                this.new_stock = stock;
                this.new_stock.product = item;
                this.new_stock["packing"] = item.packing;
                this.new_stock.total_qte = (this.new_stock.pack * this.new_stock.packing) + this.new_stock.extra_units;
                this.new_stock.available_qte = (this.new_stock.pack * this.new_stock.packing) + this.new_stock.extra_units;

                this.new_stock["unit"] = item.unit;
                this.new_stock["edit"] = false;
                this.new_stock["disabled"] = true;
            } else {
                this.new_stock = {
                    id: uuid(),
                    product_id: item.id,
                    product: item,
                    date: moment().format(),
                    exp_date: "",
                    unit: item.unit,
                    pack: "",
                    packing: item.packing,
                    available_qte: 0,
                    total_qte: "",
                    buy_price: "",
                    sell_price: "",
                    edit: false,
                    disabled: true,
                    discount: ""
                };
            }
        },
        highlighting: function (item, vue) {
            return `<div class="media">
  <div class="media-left">
    <a >
      <img class="media-object" width='40' height='40' src="${
        item.image != null && item.image != ""
          ? item.image
          : "static/assets/img/faces/product.png"
      }">
    </a>
  </div>
  <div class="media-body">
    <h5 class="media-heading">${item.name}</h5>
  </div>
</div>
        `;
        },

        render: function (items, vue) {
            let newItem = [...items];
            return newItem;
        },
        isNotEmpty(str) {
            if (str == null || str == "") {
                return true;
            }
            return false;
        },
        checkUpdateStock(stock) {
            return new Promise((resolve, reject) => {
                this.errors = {};
                if (!stock.disabled) {
                    this.errors["name"] = this.$t("name_required");
                }
                if (!stock.pack) {
                    this.errors["pack"] = this.$t("pack_required");
                }
                if (!stock.packing) {
                    this.errors["packing"] = this.$t("packing_required");
                }
                if (!stock.sell_price) {
                    this.errors["sell_price"] = this.$t("sell_price_required");
                } else {
                    if (!_.isNumber(parseFloat(stock.sell_price))) {
                        this.errors["sell_price"] = this.$t("sell_price_required_number");
                    }
                }
                if (!stock.buy_price) {
                    this.errors["buy_price"] = this.$t("buy_price_required");
                } else {
                    if (!_.isNumber(parseFloat(stock.buy_price))) {
                        this.errors["buy_price"] = this.$t("buy_price_required_number");
                    }
                }
                if (Object.entries(this.errors).length == 0) {
                    let new_total = (stock.pack * stock.packing) + stock.extra_units;

                    if (stock.total_qte < new_total) {
                        stock.available_qte =
                            stock.available_qte + (new_total - stock.total_qte);
                        stock.total_qte = new_total;

                        stock.disabled = true;
                        stock.edit = false;
                        stock.exp_date = stock.exp_date ?
                            moment(stock.exp_date).format() :
                            "";

                        let index = _.findIndex(this.invoice.stocks, {
                            id: stock.id
                        });
                        this.invoice.stocks.splice(index, 1, stock);
                        resolve(true);
                    } else {
                        if (
                            new_total <= stock.available_qte &&
                            stock.total_qte != stock.available_qte
                        ) {
                            this.errors["pack"] = this.$t("not_valid");
                            this.errors["packing"] = this.$t("not_valid");
                            reject(false);
                            return false;
                        } else {
                            stock.available_qte =
                                stock.available_qte - (stock.total_qte - new_total);
                            stock.total_qte = new_total;

                            stock.disabled = true;
                            stock.edit = false;

                            stock.exp_date = stock.exp_date ?
                                moment(stock.exp_date).format() :
                                "";
                            console.log("stock");
                            console.log(stock);
                            let index = _.findIndex(this.invoice.stocks, {
                                id: stock.id
                            });
                            this.invoice.stocks.splice(index, 1, stock);
                            resolve(true);
                        }
                    }
                } else {
                    reject(false);
                }
            });
        },
        addStockToInvoice() {
            this.new_errors = {};
            if (!this.new_item_selected) {
                this.new_errors["name"] = this.$t("name_required");
            }
            if (!this.new_stock.pack) {
                this.new_errors["pack"] = this.$t("pack_required");
            }
            if (!this.new_stock.packing) {
                this.new_errors["packing"] = this.$t("packing_required");
            }
            if (!this.new_stock.sell_price) {
                this.new_errors["sell_price"] = this.$t("sell_price_required");
            } else {
                if (!_.isNumber(parseFloat(this.new_stock.sell_price))) {
                    this.new_errors["sell_price"] = this.$t("sell_price_required_number");
                }
            }
            if (!this.new_stock.buy_price) {
                this.new_errors["buy_price"] = this.$t("buy_price_required");
            } else {
                if (!_.isNumber(parseFloat(this.new_stock.buy_price))) {
                    this.new_errors["buy_price"] = this.$t("buy_price_required_number");
                }
            }
            if (Object.entries(this.new_errors).length == 0) {
                this.new_stock.id = uuid();
                this.new_stock.total_qte = (this.new_stock.pack * this.new_stock.packing) + this.new_stock.extra_units;
                this.new_stock.available_qte = (this.new_stock.pack * this.new_stock.packing) + this.new_stock.extra_units;
                this.new_stock.exp_date = this.new_stock.exp_date ?
                    moment(this.new_stock.exp_date).format() :
                    "";

                console.log("this.new_stock");
                console.log(this.new_stock);
                this.invoice.stocks.push(this.new_stock);
                this.hideNewStock();
            }
        },
        showNewStock() {
            this.show_new_stock = true;
        },
        hideNewStock() {
            this.new_item_selected = false;
            this.show_new_stock = false;
            this.new_errors = {};
            this.new_stock = {
                id: uuid(),
                product_id: null,
                supplier_id: this.invoice.supplier_id,
                invoice_id: this.invoice.id,
                product: {
                    id: "",
                    name: "",
                    unit: "piece",
                    category: "",
                    barcode: ""
                },
                date: moment().format(),
                exp_date: null,
                unit: "piece",
                pack: "",
                packing: "",
                available_qte: 0,
                total_qte: "",
                buy_price: "",
                sell_price: "",
                discount: ""
            };
        },
        updateStock(stock, data) {
            this.errors = {};
            console.log(stock);
            if (!stock.disabled) {
                this.errors["name"] = this.$t("name_required");
            }
            if (!stock.pack && stock.pack != 0) {
                this.errors["pack"] = this.$t("pack_required");
            }
            if (!stock.packing) {
                this.errors["packing"] = this.$t("packing_required");
            }
            if (!stock.sell_price) {
                this.errors["sell_price"] = this.$t("sell_price_required");
            } else {
                if (!_.isNumber(parseFloat(stock.sell_price))) {
                    this.errors["sell_price"] = this.$t("sell_price_required_number");
                }
            }
            if (!stock.buy_price) {
                this.errors["buy_price"] = this.$t("buy_price_required");
            } else {
                if (!_.isNumber(parseFloat(stock.buy_price))) {
                    this.errors["buy_price"] = this.$t("buy_price_required_number");
                }
            }
            if (Object.entries(this.errors).length == 0) {
                let new_total = stock.pack * stock.packing + parseFloat(stock.extra_units);
                let sold_amount = stock.total_qte - stock.available_qte;
                console.log(new_total);
                console.log(sold_amount);
                if (sold_amount <= new_total) {
                    stock.available_qte =
                        stock.available_qte + (new_total - stock.total_qte);
                    stock.total_qte = new_total;

                    stock.disabled = true;
                    stock.edit = false;
                    stock.exp_date = stock.exp_date ?
                        moment(stock.exp_date).format() :
                        "";
                    console.log("stock");
                    console.log(stock);
                    let index = _.findIndex(this.invoice.stocks, {
                        id: stock.id
                    });
                    this.invoice.stocks.splice(index, 1, stock);
                } else {
                    // if (
                    //     new_total <= stock.available_qte &&
                    //     stock.total_qte != stock.available_qte
                    // ) {
                        swal(
                            this.$t("not_allowed"),
                            this.$t("you_cant_set_qte_under_sold_amount"),
                            "error"
                        );
                        if(sold_amount<stock.packing && (!stock.pack || stock.pack==0)){
                            this.errors["packing"] = this.$t("not_valid");
                        }
                        if(sold_amount<stock.pack*stock.packing){

                            this.errors["pack"] = this.$t("not_valid");
                        }
                        return false;
                    // } else {
                    //     stock.available_qte =
                    //         stock.available_qte - (stock.total_qte - new_total);
                    //     stock.total_qte = new_total;

                    //     stock.disabled = true;
                    //     stock.edit = false;

                    //     stock.exp_date = stock.exp_date ?
                    //         moment(stock.exp_date).format() :
                    //         "";
                    //     console.log("stock");
                    //     console.log(stock);
                    //     let index = _.findIndex(this.invoice.stocks, {
                    //         id: stock.id
                    //     });
                    //     this.invoice.stocks.splice(index, 1, stock);
                    // }
                }
            }
        },

        updateStockName(stock, data) {
            let item = data.item;
            this.invoice.stocks = _.map(this.invoice.stocks, s => {
                if (s.id == stock.id) {
                    s.disabled = true;
                    let stocks = JSON.parse(
                        JSON.stringify(store.getters.getStocks(item.id))
                    );

                    if (stocks.length > 0) {
                        let stock = _.last(stocks);
                        stock.exp_date = "";
                        s = stock;
                        s.product = item;
                        s.total_qte = s.pack * s.packing;
                        s.available_qte = s.pack * s.packing;

                        s["unit"] = item.unit;
                        s["edit"] = true;
                        s["disabled"] = true;
                    } else {
                        s["product_id"] = item.id;
                        s["unit"] = item.unit;
                        s["edit"] = true;
                        s["disabled"] = true;
                        s.product = item;
                    }
                }
                return s;
            });
        },
        onDoubleClickStock(stock, data) {
            if (stock.available_qte != stock.total_qte) {
                swal(
                    this.$t("not_allowed"),
                    this.$t("you_cant_edit_product_after_used"),
                    "error"
                );
            } else {
                this.invoice.stocks = _.map(this.invoice.stocks, s => {
                    if (s.id == stock.id) {
                        s.disabled = false;
                    }
                    return s;
                });
            }

            return false;
        },
        updateStocksOrder() {
            console.log("this.filteredStocks");
        },

        deleteStock(stock) {
            event.stopPropagation();
            let id = stock.id;
            if (stock.total_qte != stock.available_qte) {
                swal({
                    title: this.$t("not_allowed"),
                    text: this.$t("you_cant_delete_stock_after_used"),
                    icon: "error",
                    buttons: {
                        cancel: false,
                        confirm: true
                    }
                });
            } else {
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
                            //  store.dispatch("deleteStock", id);
                            _.map(this.invoice.stocks, function (s) {
                                if (s.id == id) {
                                    s.is_deleted = true;
                                }
                            });
                            this.invoice.stocks = JSON.parse(
                                JSON.stringify(this.invoice.stocks)
                            );
                            console.log(this.invoice.stocks);
                        }, 500);
                    } else {
                        // swal("Your imaginary file is safe!");
                    }
                });
            }
        },
        editStock(id, event) {
            // this.hideNewStock();
            this.errors = {};
            console.log(id);

            this.invoice.stocks = _.map(this.invoice.stocks, s => {
                if (s.id == id) {
                    s.edit = true;
                }
                return s;
            });
            this.invoice = JSON.parse(JSON.stringify(this.invoice));

        },

        saveInvoie() {
            _.forEach(this.invoice.stocks, s => {
                if (s.edit && !s.is_deleted) {
                    this.checkUpdateStock(s).then(
                        succuss => {
                            return true;
                        },
                        error => {
                            return false;
                        }
                    );
                }
            });
            if (this.new_item_selected) {
                this.addStockToInvoice();
            }
            console.log(this.errors);
            if (
                Object.entries(this.errors).length == 0 &&
                Object.entries(this.new_errors).length == 0
            ) {
                //remove some shit
                this.invoice.stocks = _.map(this.invoice.stocks, s => {
                    let stock = _.omit(s, ["product", "edit", "disabled"]);
                    stock.supplier_id = this.customer.id;
                    stock.invoice_id = this.invoice.id;
                    store.dispatch("updateOrAddStock", stock);
                    return stock;
                });
                delete this.invoice.stocks;
                this.invoice.supplier_id = this.customer.id;
                console.log(this.invoice);

                store.dispatch("updateInvoice", this.invoice);
                this.goBack();
                //saveing the invoice
                //adding all the stocks to there correspendant prodcts
            } else {
                swal({
                    title: this.$t("correct_the_errors"),
                    text: this.$t("there_some_stocks_with_wrong_data"),
                    icon: "error",
                    button: this.$t("ok"),
                });
            }
        },

        getSellingPrice() {
            return (
                this.stock.sell_price *
                (1 - parseFloat(this.stock.discount) / 100)
            ).toFixed(2);
        },

        goBack() {
            this.$router.go(-1);
            this.$destroy();
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
    overflow-y: auto !important;
    font-size: 15px;
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

.new-row {
    cursor: pointer;
    border: 1px solid #ece8e8;
    background-color: whitesmoke;

    td {
        vertical-align: middle !important;
        vertical-align: top;
        padding: 10px;
        padding-bottom: 20px !important;
        padding-top: 20px;
        padding-right: 15px;

        .form-control.border-input {
            border: none;
        }
    }
}

.indexStyle {
    vertical-align: middle !important;
    text-align: center !important;
    font-weight: 700;
}

.form-group {
    margin-bottom: 15px;
}

.input-group-addon {
    background-color: #eee !important;
}

.form-control:focus+.input-group-addon,
.form-control:focus~.input-group-addon {
    background-color: #ffe681 !important;
}

.w100 {
    width: 100%;
}

.input-group {
    margin: 0px;
}

.form-group {
    margin: 0px;
}

.error {
    color: #eb5e28;
    font-size: 13px;
    position: absolute;
}

.error_border {
    border: 1px solid red !important;
}

.underline {
    & {
        font-size: 22px;
        font-weight: 600;
    }

    span {
        font-weight: 600;
        font-size: 24px;
        color: gray;
    }
}

.total-well {
    background-color: whitesmoke;
}

table {
    margin-bottom: 5px;
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
    overflow-x: auto;

    /*flex-wrap:wrap;*/
}

.box {
    flex: 1;
    -webkit-flex: 1;
    min-width: 300px;
    max-width: 320px;
    height: 80px;
}

.vertical-center {
    display: flex;
    align-items: center;
}

.wrap-collabsible {
    margin-bottom: 1.2rem 0;
}

input[type="checkbox"] {
    display: none;
}

.lbl-toggle {
    font-weight: bold;
    font-size: 19px;
    text-transform: uppercase;
    text-align: center;
    color: #525252;
    cursor: pointer;
    border-radius: 7px;
    transition: all 0.25s ease-out;
}

.titleheader {
    font-weight: bold;
    font-size: 19px;
    text-transform: uppercase;

    color: #525252;
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
</style>
