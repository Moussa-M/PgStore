<template lang="lang">
<div>
    <div class="main-panel" :style="{'float':$i18n.locale=='ar' ? 'left':'right'}">
        <nav class="navbar navbar-default">
            <div class="nav-container">
                <div class="navbar-header" style="display: inline-flex;">
                    <button type="button" class="navbar-toggle">
                        <span class="sr-only">{{ $t('toggle_nav') }}</span>
                        <span class="icon-bar bar1"></span>
                        <span class="icon-bar bar2"></span>
                        <span class="icon-bar bar3"></span>
                    </button>

                    <a class="navbar-brand">{{ $t('dashboard') }}</a>
                </div>
                <v-badge style="margin-top:15px">
                    <template v-if="notifications.length>=1" v-slot:badge>{{notifications.length}}</template>
                    <v-menu :disabled="notifications.length<1" :close-on-content-click="false" :nudge-width="300" offset-x offset-y>
                        <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on">
                                <v-icon color="#b5b5b5" large>notifications</v-icon>
                            </v-btn>
                        </template>

                        <v-list>
                            <v-list-tile v-for="notification in notifications" :key="notification" @click.stop="goToNotificationSource(notification)">
                                <v-list-tile-action>
                                    <v-icon>{{notification.icon}}</v-icon>
                                </v-list-tile-action>

                                <v-list-tile-content>
                                    <v-list-tile-title>{{notification.msg}}</v-list-tile-title>
                                    <v-list-tile-sub-title>{{notification.date.slice(0,10)}}</v-list-tile-sub-title>
                                </v-list-tile-content>
                                <v-list-tile-action>
                                    <v-btn icon>
                                        <v-icon small @click.stop="hideNotification(notification.id)">close</v-icon>
                                    </v-btn>
                                </v-list-tile-action>
                            </v-list-tile>
                        </v-list>

                    </v-menu>

                </v-badge>

            </div>
        </nav>
        <div class="content">
            <div class="">
                <div class="row">
                    <div class="col-lg-3 col-sm-6">
                        <div class="card" style="height:160px">
                            <div class="content">
                                <div class="row">
                                    <div class="col-xs-3">
                                        <div class="icon-big icon-success text-xs-center">
                                            <Avatar image="static/assets/img/001-revenue.png" :width="50" :height="50" :radius="0" :crop="true" :changeable="false" />
                                        </div>
                                    </div>
                                    <div class="col-xs-9">
                                        <div class="numbers" style="font-size:1.2vw">
                                            <p>{{$t("income")}}</p>
                                            {{income}}
                                           <p> {{$t(currency.toLowerCase())}}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="footer">
                                    <hr>
                                    <div class="stats">
                                        <i class="ti-calendar"></i>
                                        <select @change="updateIncome()" v-model="preferences.income_span" class="custom-select mr-sm-2 form-control" style="display: inline;padding: 2px;width: inherit;">
                                            <option value="day">{{ $t("today") }}</option>
                                            <option value="month">{{ $t("this_month") }}</option>
                                            <option value="year">{{ $t("this_year") }}</option>
                                            <option value="all">{{ $t("all_over") }}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-sm-6">
                        <div class="card" style="height:160px">
                            <div class="content">
                                <div class="row">
                                    <div class="col-xs-3">
                                        <div class="icon-big icon-success text-xs-center">
                                            <Avatar image="static/assets/img/002-business-and-finance.png" :width="50" :height="50" :radius="0" :crop="true" :changeable="false" />
                                        </div>
                                    </div>
                                    <div class="col-xs-9">
                                        <div class="numbers" style="font-size:1.2vw">
                                            <p>{{$t("revenue")}}</p>
                                           {{revenue}}
                                           <p> {{$t(currency.toLowerCase())}}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="footer">
                                    <hr>
                                    <div class="stats">
                                        <i class="ti-calendar"></i>
                                        <select @change="updateRevenue()" v-model="preferences.revenue_span" class="custom-select mr-sm-2 form-control" style="display: inline;padding: 2px;width: inherit;">
                                            <option value="day">{{ $t("today") }}</option>
                                            <option value="month">{{ $t("this_month") }}</option>
                                            <option value="year">{{ $t("this_year") }}</option>
                                            <option value="all">{{ $t("all_over") }}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-sm-6">
                        <div class="card" style="height:160px">
                            <div class="content">
                                <div class="row">
                                    <div class="col-xs-3">
                                        <div class="icon-big icon-success text-xs-center">
                                            <Avatar image="static/assets/img/009-loss-1.png" :width="50" :height="50" :radius="0" :crop="true" :changeable="false" />
                                        </div>
                                    </div>
                                    <div class="col-xs-9">
                                        <div class="numbers" style="font-size:1.2vw">
                                            <p>{{$t("expenses")}}</p>
                                           {{expenses}}
                                            <p> {{$t(currency.toLowerCase())}}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="footer">
                                    <hr>
                                    <div class="stats">
                                        <i class="ti-calendar"></i>
                                        <select @change="updateExpenses()" v-model="preferences.expenses_span" class="custom-select mr-sm-2 form-control" style="display: inline;padding: 2px;width: inherit;">
                                            <option value="day">{{ $t("today") }}</option>
                                            <option value="month">{{ $t("this_month") }}</option>
                                            <option value="year">{{ $t("this_year") }}</option>
                                            <option value="all">{{ $t("all_over") }}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-sm-6">
                        <div class="card" style="height:160px">
                            <div class="content">
                                <div class="row">
                                    <div class="col-xs-3">
                                        <div class="icon-big icon-success text-xs-center">
                                            <Avatar image="static/assets/img/004-debt.png" :width="50" :height="50" :radius="0" :crop="true" :changeable="false" />
                                        </div>
                                    </div>
                                    <div class="col-xs-9">
                                        <div class="numbers" style="font-size:1.2vw">
                                            <p>{{$t("debt")}}</p>
                                             {{debt}}
                                            <p> {{$t(currency.toLowerCase())}}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="footer">
                                    <hr>
                                    <div class="stats">
                                        <i class="ti-calendar"></i>
                                        <select @change="updateDebt()" v-model="preferences.debt_span" class="custom-select mr-sm-2 form-control" style="display: inline;padding: 2px;width: inherit;">
                                            <option value="day">{{ $t("today") }}</option>
                                            <option value="month">{{ $t("this_month") }}</option>
                                            <option value="year">{{ $t("this_year") }}</option>
                                            <option value="all">{{ $t("all_over") }}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-sm-6">
                        <div class="card" style="height:160px">
                            <div class="content">
                                <div class="row">
                                    <div class="col-xs-3">
                                        <div class="icon-big icon-info text-xs-center">
                                            <i style="font-size: 45px;" class="ti-shopping-cart-full"></i>
                                        </div>
                                    </div>
                                    <div class="col-xs-9">
                                        <div class="numbers">
                                            <p>{{$t("orders")}}</p>
                                            {{sales}}
                                        </div>
                                    </div>
                                </div>
                                <div class="footer">
                                    <hr>
                                    <div class="stats">
                                        <i class="ti-calendar"></i>
                                        <select @change="updateSales()" v-model="preferences.sales_span" class="custom-select mr-sm-2 form-control" style="display: inline;padding: 2px;width: inherit;">
                                            <option value="today">{{ $t("today") }}</option>
                                            <option value="month">{{ $t("this_month") }}</option>
                                            <option value="year">{{ $t("this_year") }}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="monthCustomer != null" class="col-lg-3 col-sm-6">
                        <div class="card" style="height:160px">
                            <div class="content">
                                <div class="row">
                                    <div class="col-xs-3">
                                        <div class="icon-big icon-info text-xs-center">
                                            <i>
                                                <Avatar :image="monthCustomer.image" :fullname="monthCustomer.name" :width="50" :height="50" :radius="50" :crop="true" :changeable="false" />
                                            </i>
                                        </div>
                                    </div>
                                    <div class="col-xs-9">
                                        <div class="numbers">
                                            <p>{{$t("customer_of_the_month")}}</p>
                                            {{monthCustomer.name}}
                                        </div>
                                    </div>
                                </div>
                                <div class="footer">
                                    <hr>
                                    <div class="stats">
                                        <p>{{$t("orders_count")}} {{monthCustomer.count}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="monthEmployee != null" class="col-lg-3 col-sm-6">
                        <div class="card" style="height:160px">
                            <div class="content">
                                <div class="row">
                                    <div class="col-xs-3">
                                        <div class="icon-big icon-info text-xs-center">
                                            <i>
                                                <Avatar :image="monthEmployee.image" :fullname="monthEmployee.name" :width="50" :height="50" :radius="50" :crop="true" :changeable="false" />
                                            </i>
                                        </div>
                                    </div>
                                    <div class="col-xs-9">
                                        <div class="numbers">
                                            <p>{{$t("employee_of_the_month")}}</p>
                                            {{monthEmployee.name}}
                                        </div>
                                    </div>
                                </div>
                                <div class="footer">
                                    <hr>
                                    <div class="stats">
                                        <p>{{$t("sales_count")}} {{monthEmployee.count}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="monthProduct!=null" class="col-lg-3 col-sm-6">
                        <div class="card" style="height:160px">
                            <div class="content">
                                <div class="row">
                                    <div class="col-xs-3">
                                        <div class="icon-big icon-info text-xs-center">
                                            <i>
                                                <Avatar :image="isNotEmpty(monthProduct.image)?monthProduct.image:'static/assets/img/faces/product.png'" :width="50" :height="50" :radius="7" :crop="true" :changeable="false" />
                                            </i>
                                        </div>
                                    </div>
                                    <div class="col-xs-9">
                                        <div class="numbers">
                                            <p>{{$t("product_of_the_month")}}</p>
                                            {{monthProduct.name}}
                                        </div>
                                    </div>
                                </div>
                                <div class="footer">
                                    <hr>
                                    <div class="stats" style="width: 100%;">
                                        <p>{{$t("amount")}} {{monthProduct.amount}} / {{$t("orders")}} {{monthProduct.count}} </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="card">
                            <div class="header">
                                <h4 class="card_title">{{$t("chart")}}
                                    <v-combobox attach :menu-props="{ maxHeight: '400' }" solo flat box style="display:-webkit-inline-box" height="50px" v-model="selected_charts" @change="updateChart()" :items="chart_items" :placeholder="$t('select_chart')" multiple></v-combobox>
                                    <div style="display:-webkit-inline-box;">
                                        <date-picker @change="clearChart()" @confirm="updateChart()" v-model="chart_date_range" input-class="mx-input3" :confirm="true" :not-after="new Date()" :shortcuts="shortcuts" :lang="lang" range></date-picker>
                                    </div>

                                </h4>
                                <!-- <p class="category">
                                    {{$t("sales_of")}}

                                    <select @change="updateSalesChart()" class="custom-select mr-sm-2 form-control" v-model="preferences.sales_chart_span" style="display: inline;padding: 2px;width: inherit;">
                                        <option value="month">{{ $t("this_month") }}</option>
                                        <option value="year">{{ $t("this_year") }}</option>
                                    </select>
                                </p> -->
                            </div>
                            <div class="content">
                                <div id="salesChart"></div>
                                <!-- <div style="width:100%;height:300px!important">
                      <canvas id="linechart"></canvas>
                  </div>-->
                                <div class="footer">

                                    <transition-group name="slide-fade-fast" mode="out-in" tag="div" class="row chart-legend" style="justify-content: space-evenly;width:100%;display: flex;">
                                        <div key="1" v-if="selected_charts.find(p=>p.value=='revenue')">
                                            <span>
                                                <i class="fa fa-circle stroke-0"></i> {{$t("revenue")}}

                                            </span>
                                        </div>

                                        <div key="2" v-if="selected_charts.find(p=>p.value=='revenue_with_debt')">
                                            <span>
                                                <i class="fa fa-circle stroke-1"></i> {{$t("revenue_with_debt")}}
                                            </span>
                                        </div>

                                        <div key="3" v-if="selected_charts.find(p=>p.value=='debt')">
                                            <span>
                                                <i class="fa fa-circle stroke-2"></i> {{$t("debt")}}

                                            </span>
                                        </div>
                                        <div key="4" v-if="selected_charts.find(p=>p.value=='income')">
                                            <span>
                                                <i class="fa fa-circle stroke-3"></i> {{$t("income")}}

                                            </span>
                                        </div>

                                        <div key="5" v-if="selected_charts.find(p=>p.value=='income_with_debt')">
                                            <span>
                                                <i class="fa fa-circle stroke-4"></i> {{$t("income_with_debt")}}

                                            </span>
                                        </div>

                                        <div key="6" v-if="selected_charts.find(p=>p.value=='expenses')">
                                            <span>
                                                <i class="fa fa-circle stroke-5"></i> {{$t("expenses")}}
                                            </span>
                                        </div>
                                    </transition-group>

                                    <!-- <hr>
                                    <div class="stats">
                                        <i class="ti-calendar"></i>
                                        <span v-show="preferences.sales_chart_span=='month'">{{current_month+1}}/{{current_year}}</span>
                                        <span v-show="preferences.sales_chart_span=='year'">{{current_year}}</span>
                                    </div> -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row" style="margin-bottom:20px">
                    <div class="col-md-6" style="max-height:600px;height:600px">
                        <div class="card">
                            <div class="header">
                                <h4 class="card_title">{{$t("income_source_chart")}}</h4>
                                <p class="category">{{$t("top_5_product")}}</p>
                            </div>
                            <div class="content">
                                <div id="chartPreferences" class="ct-chart ct-perfect-fourth"></div>

                                <div class="footer">
                                    <div class="row chart-legend" style="display: flex;
    justify-content: space-evenly;width:100%">
                                        <div v-for="(revenue,index) in pieArray" :ref="revenue.name" :key="revenue.name">
                                            <font-awesome-icon icon="circle" :class="'stroke-'+index" />
                                            <span style="margin-right:10px">{{revenue.name}}</span>
                                        </div>
                                    </div>
                                    <hr>
                                    <div class="stats">
                                        <i class="ti-timer"></i> {{$t("this_month")}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6" style="max-height:600px;height:600px;">
                        <div class="card">
                            <div class="header">
                                <h4 class="card_title">{{$t("income_list")}}</h4>
                            </div>
                            <div class="content">
                                <div class="table-responsive table-full-width" style="height:100%">
                                    <table class="table table-hover">
                                        <thead>
                                            <th width="40%" :class="$i18n.locale=='ar'?'text-right':'text-left'">{{ $t("name") }}</th>
                                            <th width="20%" :class="$i18n.locale=='ar'?'text-right':'text-left'">{{$t("income")}} ({{$t(currency.toLowerCase())}})</th>
                                            <th width="20%" :class="$i18n.locale=='ar'?'text-right':'text-left'">{{$t("status")}} (%)</th>
                                            <th :class="$i18n.locale=='ar'?'onhoverRTL text-right':'onhoverLTR text-left'" width="20%">{{$t("income")}} (%)<i style="padding-left:10px;transition: all 0.3s ease-out;display:inline-block" ref="pie_table_reorder" @click="ReOrderRevenueTable()" class="mdi mdi-sort"></i>
                                            </th>
                                        </thead>
                                        <tbody name="fade" is="transition-group" style="display:block;height:431px;overflow:auto;">
                                            <tr v-for="revenue in revenue_pie" :key="revenue.name" :ref="revenue.name">
                                                <td style="width: 40%">{{revenue.name}}</td>
                                                <td style="direction: ltr;text-align: end;width: 20%">{{revenue.revenue.toFixed(2)}}</td>
                                                <td style="direction: ltr;text-align: end;width: 20%">
                                                    <i class="mdi green-arrow mdi-arrow-up" v-if="revenue.increased == 1"></i>
                                                    <i class="mdi red-arrow mdi-arrow-down" v-if="revenue.increased == -1"></i>
                                                    <i class="mdi mdi-equal" v-if="revenue.increased == 0"></i>
                                                    <span class="label label-info" v-if="revenue.increased == -2">{{$t("new")}}</span>
                                                    <span v-if="revenue.increased == 1 && revenue.increased == -1">{{revenue.revenue_arrow_perc}}</span>
                                                </td>
                                                <td style="direction: ltr;text-align: end;width: 20%">{{revenue.revenue_perc}}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <hr style="margin-top:5px;margin-bottom:5px;">
                                <div class="footer">
                                    <div class="stats">
                                        <i class="ti-timer"></i> {{$t("this_month")}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- modal start -->
    <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h3 class="modal-title" id="myModalLabel">Custom filter</h3>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-xs-6">
                            <h4>Filter by date</h4>
                            <date-picker @confirm="filterOrders(true)" v-model="daterange" input-class="mx-input" :confirm="true" :not-after="new Date()" :shortcuts="shortcuts" :lang="lang" range></date-picker>
                        </div>
                        <div class="col-xs-6">
                            <h4>Filter by customer</h4>
                            <input type="text" v-model="searchText" class="mx-input" name="search" placeholder="Filter by customer name or description...">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-default">Filter</button>
                </div>
            </div>
        </div>
    </div>
    <!-- modal end -->
</div>
</template>

<script>
import Chartist from 'chartist'
import {
    Product
} from './models.js'
import {
    daysInMonth,
    formatIsoDate,
    randomColor
} from './utils.js'
import DatePicker from 'vue2-datepicker'
import Avatar from './sub_components/Avatar.vue'

import {
    Notification
} from './models.js'
import { setImmediate } from 'timers';
export default {
    name: 'Home',
    components: {
        DatePicker,
        Avatar
    },
    created() {
        /// /console.log("dashboard created");

        this.preferences = store.getters.preferences
        this.selected_charts = this.preferences.dashboard.selected_charts.map(p => {
            return {
                "text": this.$t(p),
                "value": p
            }
        });
        this.currency = store.getters.user.currency
        // this.initNotifications();

        // this.initDashboard();

    },
    activated() {
        this.initNotifications();
        this.initDashboard();
        this.$eventBus.$on("notifications_changed", (arg) => {
            console.log("recieved")
            this.initNotifications();
        });

    },
    
    deactivated() {
        this.$eventBus.$off("notifications_changed");
    },
    data: function () {
        return {
            notifications: [],
            chart_date_range: null,
            selected_charts: [{
                text: this.$t("revenue"),
                value: "revenue"
            }],
            chart_items: [{
                text: this.$t("revenue"),
                value: "revenue"
            }, {
                text: this.$t("revenue_with_debt"),
                value: "revenue_with_debt"
            }, {
                text: this.$t("debt"),
                value: "debt"
            }, {
                text: this.$t("income"),
                value: "income"
            }, {
                text: this.$t("income_with_debt"),
                value: "income_with_debt"
            }, {
                text: this.$t("expenses"),
                value: "expenses"
            }],
            word: null,
            orders: [],
            labels: [],
            series: [],
            products: [],
            daterange: '',
            searchText: '',
            monthProduct: null,
            monthCustomer: null,
            monthEmployee: null,
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
                    "next 7 days",
                    "next 30 days",
                    "previous 7 days",
                    "previous 30 days"
                ],
                placeholder: {
                    date: this.$t("select_range"),
                    dateRange: this.$t("filter_by_range")
                }
            },
            shortcuts: [{
                    text: this.$t("today"),
                    onClick: () => {
                        this.chart_date_range = [moment().startOf('day').toDate(), moment().toDate()];

                    }
                },
                {
                    text: this.$t("this_month"),
                    onClick: () => {
                        this.chart_date_range = [moment().startOf('month').toDate(), moment().toDate()];
                    }
                }, {
                    text: this.$t("last_month"),
                    onClick: () => {
                        this.chart_date_range = [moment().subtract(1, 'months').startOf('month').toDate(), moment().subtract(1, 'months').endOf('month').toDate()];
                    }
                },
                {
                    text: this.$t("this_year"),
                    onClick: () => {
                        this.chart_date_range = [moment().startOf('year').toDate(), moment().toDate()];
                    }
                }
            ],
            current_year_range: [moment().startOf('year'), moment()],
            current_day_range: [moment().startOf('day'), moment()],
            current_month_range: [moment().startOf('month'), moment()],
            showChart: false,
            preferences: {
                sales_chart_span: '',
                revenue_span: '',
                sales_span: ''
            },
            current_year: '',
            current_month: '',
            current_day: '',
            revenue: 0,
            income: 0,
            debt: 0,
            expenses: 0,
            sales: 0,
            chart: null,
            ctx: null,
            revenue_pie: [],
            pieArray: [],
            currency: ''
        }
    },
    methods: {
        initNotifications() {
            this.notifications = []
            let _notifications = this.getNotifications()
            _.forEach(_notifications, (notification) => {
                if (notification.status == "new") {
                    let icon = (notification.type == "expired" || notification.type == "almost_expired") ? "mdi-calendar-alert" : "mdi-package-variant";
                    let msg = "";
                    if (notification.type == "expired") {
                        msg = this.$t("stock_expired") + " " + notification.product_name;
                    } else if (notification.type == "almost_expired") {
                        msg = this.$t("stock_almost_expired") + " " + notification.product_name;
                    } else if (notification.type == "stock_end") {
                        msg = this.$t("the_stock_of_this_product_ended") + " " + notification.product_name;
                    } else if (notification.type == "stock_almost_end") {
                        msg = this.$t("stock_almost_end") + " " + notification.product_name;
                    }
                    this.notifications.push({
                        id: notification.id,
                        product_id: notification.product_id,
                        msg: msg,
                        icon: icon,
                        date: notification.date,
                    });
                }
            })
        },
        goToNotificationSource(notification) {

            this.hideNotification(notification.id);
            this.$router.push({
                name: "product_stock",
                params: {
                    id: notification.product_id
                }
            });

        },
        getNotifications() {

            let notifications = JSON.parse(JSON.stringify(store.getters.notifications))
            let products = JSON.parse(JSON.stringify(store.getters.products))
            _.forEach(products, (product) => {
                let nots = this.getStockAndExpireNotifications(product);

                if (nots) {
                    _.forEach(nots, (not) => {
                        let prev_noti = _.find(notifications, not)

                        if (!prev_noti) {
                            let new_not = new Notification(product.id, not.stock_id, product.name, not.type)
                            notifications.unshift(new_not)
                        }
                    })

                }
            })
            console.log("notifications");
            console.log(notifications);

            store.dispatch("notifications", notifications);
            //notifications = JSON.parse(JSON.stringify(store.getters.notifications))
            return notifications;
        },
        getStockAndExpireNotifications(product) {

            let stocks = store.getters.getStocks(product.id);
            let exp_date_alert = false;
            let almost_exp_date_alert = false;
            let stock_end_alert = false;
            let almost_stock_end_alert = false;
            let nots = [];
            let qte = _.reduce(
                stocks,
                function (sum, s) {
                    return sum + s.available_qte;
                },
                0
            );

            if (stocks.length>0) {
                _.forEach(stocks, (stock) => {
                    if (moment(stock.exp_date).isValid()) {

                        if ((moment(stock.exp_date)).isSameOrBefore(moment(), 'day')) {

                            exp_date_alert = true
                        } else if ((moment(stock.exp_date).subtract(parseInt(product.exp_date_pre_alert), "days")).isSameOrBefore(moment(), 'day')) {

                            almost_exp_date_alert = true
                        }

                    }
                    if (stock.available_qte <= 0) {

                        stock_end_alert = true
                    } else if (stock.available_qte - parseInt(product.stock_pre_alert) <= 0) {
                        almost_stock_end_alert = true
                    }

                    if (exp_date_alert) {
                        nots.push({
                            "type": "expired",
                            "product_id": product.id,
                            "stock_id": stock.id
                        })
                        exp_date_alert = false;
                    } else if (almost_exp_date_alert) {
                        nots.push({
                            "type": "almost_expired",
                            "product_id": product.id,
                            "stock_id": stock.id
                        })
                        almost_exp_date_alert = false;
                    }

                })


            if (qte <= 0) {
             
                nots.push({
                    "type": "stock_end",
                    "product_id": product.id
                })
                stock_end_alert = false;
            } else if (qte - parseInt(product.stock_pre_alert) <=0) {
                nots.push({
                    "type": "stock_almost_ended",
                    "product_id": product.id
                })
                almost_stock_end_alert = false;
            }
            
            }
        
            
            return nots;

        },
        hasExpired(product) {

            let stocks = store.getters.getStocks(product.id);
            let exp_date_alert = false;
            if (stocks) {
                _.forEach(stocks, (stock) => {
                    if (moment(stock.exp_date).isValid()) {

                        if ((moment(stock.exp_date)).isSameOrBefore(moment(), 'day')) {

                            exp_date_alert = true
                        }

                    }

                })
            }

            return exp_date_alert;

        },
        hideNotification(id) {
            console.log(id)
            _.remove(this.notifications, {
                id: id
            });
            this.notifications = JSON.parse(JSON.stringify(this.notifications))
            store.dispatch("hideNotification", id)
        },
        initDashboard() {
            this.orders = JSON.parse(JSON.stringify(store.getters.orders));
            this.stocks = JSON.parse(JSON.stringify(store.getters.stocks));
            this.products = JSON.parse(JSON.stringify(store.getters.products));
            this.current_year = new Date().getFullYear()
            this.current_month = new Date().getMonth()
            this.current_day = new Date().getDate()

            this.updateChart()
            this.initPieCharts()
            this.initIncome()
            this.initRevenue()
            this.initDebt()
            this.initExpenses()
            this.initSales()
            console.log("this.orders ddddddddddddddddddddddd");
            console.log(this.orders);

            this.initCustomerAndEmployeeOfMonth()
            this.initProductOfMonth()

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
                    date: this.$t("select_range"),
                    dateRange: this.$t("filter_by_range")
                }
            };
        },
        clearChart() {
            if (this.chart_date_range[0] == null) {
                this.chart_date_range = null;
            };
            this.updateChart();
        },
        updateChart() {
            _.debounce(() => {
                let labels = [];
                let income_series = [];
                let income_with_debt_series = [];
                let revenue_series = [];
                let revenue_with_debt_series = [];
                let expenses_series = [];
                let debt_series = [];

                //revnue العائدات
                if (_.find(this.selected_charts, {
                        "value": "revenue_with_debt"
                    })) {
                    labels = []
                                   let orders_of_chart = this.getOrdersByDate(this.chart_date_range)
                    console.log("orders_of_chart");
                    console.log(orders_of_chart);
                    let steps = (moment(orders_of_chart.range[0]).twix(moment(orders_of_chart.range[1])).iterate(orders_of_chart.range_type))

                    while (steps.hasNext()) {
                        let mom = steps.next();
                        revenue_with_debt_series.push(this.getRevenueWithDebtOfDate(mom, orders_of_chart))

                        if (orders_of_chart.range_type == "hour") {
                            labels.push(mom.format("HH:mm"))
                        } else if (orders_of_chart.range_type == "day") {
                            labels.push(mom.format("DD/MM"))
                        } else if (orders_of_chart.range_type == "month") {
                            labels.push(mom.format("MM/YYYY"))
                        } else {
                            labels.push(mom.format("YYYY"))
                        }
                    }
                }
                //the revenue without debt as if ther eis not debt
                if (_.find(this.selected_charts, {
                        "value": "revenue"
                    })) {
                    labels = []
                    let orders_of_chart = this.getOrdersByDate(this.chart_date_range)
                    console.log("orders_of_chart");
                    console.log(orders_of_chart);
                    let steps = (moment(orders_of_chart.range[0]).twix(moment(orders_of_chart.range[1])).iterate(orders_of_chart.range_type))

                    while (steps.hasNext()) {
                        let mom = steps.next();
                        revenue_series.push(this.getRevenueOfDate(mom, orders_of_chart))

                        if (orders_of_chart.range_type == "hour") {
                            labels.push(mom.format("HH:mm"))
                        } else if (orders_of_chart.range_type == "day") {
                            labels.push(mom.format("DD/MM"))
                        } else if (orders_of_chart.range_type == "month") {
                            labels.push(mom.format("MM/YYYY"))
                        } else {
                            labels.push(mom.format("YYYY"))
                        }
                    }
                }

                if (_.find(this.selected_charts, {
                        "value": "income"
                    })) {
                    labels = []
                    let orders_of_chart = this.getOrdersByDate(this.chart_date_range)

                    let steps = (moment(orders_of_chart.range[0]).twix(moment(orders_of_chart.range[1])).iterate(orders_of_chart.range_type))

                    while (steps.hasNext()) {
                        let mom = steps.next();
                        income_series.push(this.getIncomeOfDate(mom, orders_of_chart))

                        if (orders_of_chart.range_type == "hour") {
                            labels.push(mom.format("HH:mm"))
                        } else if (orders_of_chart.range_type == "day") {
                            labels.push(mom.format("DD/MM"))
                        } else if (orders_of_chart.range_type == "month") {
                            labels.push(mom.format("MM/YYYY"))
                        } else {
                            labels.push(mom.format("YYYY"))
                        }
                    }
                }

                if (_.find(this.selected_charts, {
                        "value": "income_with_debt"
                    })) {
                    labels = []
                    let orders_of_chart = this.getOrdersByDate(this.chart_date_range)

                    let steps = (moment(orders_of_chart.range[0]).twix(moment(orders_of_chart.range[1])).iterate(orders_of_chart.range_type))

                    while (steps.hasNext()) {
                        let mom = steps.next();
                        income_with_debt_series.push(this.getIncomeWithDebtOfDate(mom, orders_of_chart))

                        if (orders_of_chart.range_type == "hour") {
                            labels.push(mom.format("HH:mm"))
                        } else if (orders_of_chart.range_type == "day") {
                            labels.push(mom.format("DD/MM"))
                        } else if (orders_of_chart.range_type == "month") {
                            labels.push(mom.format("MM/YYYY"))
                        } else {
                            labels.push(mom.format("YYYY"))
                        }
                    }
                }

                if (_.find(this.selected_charts, {
                        "value": "expenses"
                    })) {
                    labels = []
                    let stocks_of_chart = this.getStocksByDate(this.chart_date_range)
                    let steps = (moment(stocks_of_chart.range[0]).twix(moment(stocks_of_chart.range[1])).iterate(stocks_of_chart.range_type))
                    while (steps.hasNext()) {
                        let mom = steps.next();
                        expenses_series.push(this.getExpensesOfDate(mom, stocks_of_chart))
                        if (stocks_of_chart.range_type == "hour") {
                            labels.push(mom.format("HH:mm"))
                        } else if (stocks_of_chart.range_type == "day") {
                            labels.push(mom.format("DD/MM"))
                        } else if (stocks_of_chart.range_type == "month") {
                            labels.push(mom.format("MM/YYYY"))
                        } else {
                            labels.push(mom.format("YYYY"))
                        }
                    }
                }

                if (_.find(this.selected_charts, {
                        "value": "debt"
                    })) {
                    labels = []
                    let orders_of_chart = this.getOrdersByDate(this.chart_date_range)
                    let steps = (moment(orders_of_chart.range[0]).twix(moment(orders_of_chart.range[1])).iterate(orders_of_chart.range_type))

                    while (steps.hasNext()) {
                        let mom = steps.next();
                        debt_series.push(this.getDebtOfDate(mom, orders_of_chart))

                        if (orders_of_chart.range_type == "hour") {
                            labels.push(mom.format("HH:mm"))
                        } else if (orders_of_chart.range_type == "day") {
                            labels.push(mom.format("DD/MM"))
                        } else if (orders_of_chart.range_type == "month") {
                            labels.push(mom.format("MM/YYYY"))
                        } else {
                            labels.push(mom.format("YYYY"))
                        }
                    }
                }

                console.log("income_with_debt_series");
                console.log(income_with_debt_series);
                this.initLineChart(labels, [{
                        name: this.$t("revenue"),
                        data: revenue_series
                    },
                    {
                        name: this.$t("revenue_with_debt"),
                        data: revenue_with_debt_series
                    },
                    {
                        name: this.$t("debt"),
                        data: debt_series
                    },
                    {
                        name: this.$t("income"),
                        data: income_series
                    },
                    {
                        name: this.$t("income_with_debt"),
                        data: income_with_debt_series
                    },

                    {
                        name: this.$t("expenses"),
                        data: expenses_series
                    }
                ]);

            }, 0)()
            return true;

        },

        getPaymentsByDateRange(range) {
            let in_range_payments = [];
            if (!range) {
                range = [moment().startOf('month'), moment()]
            }
            if (!(moment(range[0]).isValid() && moment(range[1]).isValid())) {
                range = [moment().startOf('month'), moment()]

            }
            if (!moment(range[0]).isSameOrBefore(moment(range[1]))) {
                range = [moment().startOf('month'), moment()]
            }
            let range_type = "hour";
            if ((moment(range[0]).twix(moment(range[1]))).count('days') == 1) {

            } else if ((moment(range[0]).twix(moment(range[1]))).count('days') < 31) {
                range_type = "day";
            } else if ((moment(range[0]).twix(moment(range[1]))).count('months') < 20) {
                range_type = "month";
            } else {
                range_type = "year";
            }

            _.forEach(this.orders, o => {
                let payments = _.filter(o.payments, p => {
                    return (
                        moment(p.date).isSameOrAfter(moment(range[0]), range_type) && moment(p.date).isSameOrBefore(moment(range[1]), range_type)
                    )
                });
                in_range_payments = in_range_payments.concat(payments);
            })

            return {
                "in_range_payments": in_range_payments,
                "range_type": range_type,
                "range": range
            };
        },
        getOrdersByDate(range) {
            let in_range_orders = null;

            if (!range) {
                range = [moment().startOf('month'), moment()]
            }
            if (!(moment(range[0]).isValid() && moment(range[1]).isValid())) {
                range = [moment().startOf('month'), moment()]

            }
            if (!moment(range[0]).isSameOrBefore(moment(range[1]))) {
                range = [moment().startOf('month'), moment()]
            }
            let range_type = "hour";
            if ((moment(range[0]).twix(moment(range[1]))).count('days') == 1) {

            } else if ((moment(range[0]).twix(moment(range[1]))).count('days') < 31) {
                range_type = "day";
            } else if ((moment(range[0]).twix(moment(range[1]))).count('months') < 20) {
                range_type = "month";
            } else {
                range_type = "year";
            }

            in_range_orders = _.filter(this.orders, o => {
                return (
                    moment(o.date).isSameOrAfter(moment(range[0]), range_type) && moment(o.date).isSameOrBefore(moment(range[1]), range_type)
                )
            })

            return {
                "in_range_orders": in_range_orders,
                "range_type": range_type,
                "range": range
            };
        },
        getStocksByDate(range) {
            let in_range_stocks = null;
            if (!range) {
                range = [moment().startOf('month'), moment()]
            }
            if (!(moment(range[0]).isValid() && moment(range[1]).isValid())) {
                range = [moment().startOf('month'), moment()]

            }
            if (!moment(range[0]).isSameOrBefore(moment(range[1]))) {
                range = [moment().startOf('month'), moment()]
            }
            let range_type = "hour";
            if ((moment(range[0]).twix(moment(range[1]))).count('days') == 1) {

            } else if ((moment(range[0]).twix(moment(range[1]))).count('days') < 31) {
                range_type = "day";
            } else if ((moment(range[0]).twix(moment(range[1]))).count('months') < 20) {
                range_type = "month";
            } else {
                range_type = "year";
            }

            in_range_stocks = _.filter(this.stocks, o => {
                return (
                    moment(o.date).isSameOrAfter(moment(range[0]), range_type) && moment(o.date).isSameOrBefore(moment(range[1]), range_type)
                )
            })

            return {
                "in_range_stocks": in_range_stocks,
                "range_type": range_type,
                "range": range
            };
        },

        getPaymentsOfDate(date, payments_list) {

            let list = _.filter(payments_list.in_range_payments, o => {
                if (payments_list.range_type == "all") return true;
                return moment(o.date).isSame(date, payments_list.range_type)
            })
            return _.reduce(list, (sum, p) => {
                return sum + parseFloat(p.amount);
            }, 0)

        },
        getIncomePaymentsOfDate(date, payments_list) {

            let list = _.filter(payments_list.in_range_payments, p => {
                if (payments_list.range_type == "all") return true;
                return moment(p.date).isSame(date, payments_list.range_type)
            })
            return _.reduce(list, (sum, p) => {
                return sum + (parseFloat(p.amount) - this.getPaymentOrder(p.id).buy_total);
            }, 0)

        },

        getIncomeOfDate(date, orders_list) {

            let list = _.filter(orders_list.in_range_orders, o => {
                if (orders_list.range_type == "all") return true;
                return moment(o.date).isSame(date, orders_list.range_type)
            })
            return _.reduce(list, (sum, order) => {
                return sum + (parseFloat(order.total_net) - parseFloat(order.buy_total));
            }, 0)
        },

        getIncomeWithDebtOfDate(date, orders_list) {
            let list = _.filter(orders_list.in_range_orders, o => {
                if (orders_list.range_type == "all") return true;
                return moment(o.date).isSame(date, orders_list.range_type)
            })
            let sum_payments = 0;
            let orders_sum = _.reduce(list, (sum, order) => {
                sum_payments = 0;
                let payments = _.filter(order.payments, p => {
                    if (orders_list.range_type == "all") return true;
                    return moment(p.date).isSame(date, orders_list.range_type)
                })
                sum_payments = _.reduce(payments, (sum, p) => {
                    return sum + parseFloat(p.amount);
                }, 0)
                console.log("sum_payments");
                console.log(sum_payments);
                return sum + ((parseFloat(order.total_net) - parseFloat(order.buy_total)) - ((parseFloat(order.total_net) - parseFloat(sum_payments))));
            }, 0)
       //     let payments_of_chart = this.getPaymentsByDateRange(this.chart_date_range)
            //let payments_sum = this.getIncomePaymentsOfDate(date, payments_of_chart);

            return orders_sum ;
        },

        getRevenueOfDate(date, orders_list) {
            let list = _.filter(orders_list.in_range_orders, o => {
                if (orders_list.range_type == "all") return true;
                return moment(o.date).isSame(date, orders_list.range_type)
            })
            return _.reduce(list, (sum, order) => {
                return sum + parseFloat(order.total_net)
            }, 0)
        },
        getRevenueWithDebtOfDate(date, orders_list) {
            let list = _.filter(orders_list.in_range_orders, o => {
                if (orders_list.range_type == "all") return true;
                return moment(o.date).isSame(date, orders_list.range_type)
            })
            let sum_payments = 0;
            let orders_sum = _.reduce(list, (sum, order) => {
                sum_payments = 0;
                let payments = _.filter(order.payments, p => {
                    if (orders_list.range_type == "all") return true;
                    return moment(p.date).isSame(date, orders_list.range_type)
                })
                sum_payments = _.reduce(payments, (s, p) => {
                    return s + parseFloat(p.amount);
                }, 0)
                console.log("sum_payments");
                console.log(sum_payments);

              //   return sum + ((parseFloat(order.total_net) - parseFloat(order.buy_total)) - ((parseFloat(order.total_net) - parseFloat(sum_payments))));
                return sum + sum_payments
            }, 0)
       //     let payments_of_chart = this.getPaymentsByDateRange(this.chart_date_range)
       //     let payments_sum = this.getPaymentsOfDate(date, payments_of_chart);
        console.log("orders_sum");
        console.log(orders_sum);
            return orders_sum;
        },
        getDebtOfDate(date, orders_list) {
            let list = _.filter(orders_list.in_range_orders, o => {
                if (orders_list.range_type == "all") return true;
                return moment(o.date).isSame(date, orders_list.range_type)
            })
            let sum_payments = 0;
            return _.reduce(list, (sum, order) => {
                sum_payments = 0;
                let payments = _.filter(order.payments, p => {
                    if (orders_list.range_type == "all") return true;
                    return moment(p.date).isSame(date, orders_list.range_type)
                })
                sum_payments = _.reduce(payments, (sum, p) => {
                    return sum + parseFloat(p.amount);
                }, 0)

                return sum + (parseFloat(order.total_net) - sum_payments)
            }, 0)
        },
        getExpensesOfDate(date, stocks_list) {
            let list = _.filter(stocks_list.in_range_stocks, o => {
                if (stocks_list.range_type == "all") return true;
                return moment(o.date).isSame(date, stocks_list.range_type)
            })
            return _.reduce(list, (sum, stock) => {
                return sum + (parseFloat(stock.total_qte) * parseFloat(stock.buy_price))
            }, 0)

        },
        getPaymentOrder(id) {
            return _.find(this.orders, (o) => {
                if (_.find(o.payments, {
                        id: id
                    })) {
                    return true;
                }
                return false;
            })
        },
        // getDebtOfDate(date, orders_list) {
        //     let list = _.filter(orders_list.in_range_orders, o => {
        //         return moment(o.date).isSame(date, orders_list.range_type)
        //     })
        //     return _.reduce(list, (sum, order) => {
        //         return sum + (parseFloat(order.total_net) - parseFloat(order.buy_total))
        //     }, 0)

        // },
        initLineChart(labels, series) {
            var data = {
                labels: labels,
                series: series
            }
            console.log("data");
            console.log(data);

            var options = {
                seriesBarDistance: 5,
                onlyInteger: true,
                //low: 0,
                showLabels: true,
                showArea: true,
                showPoint: false,
                fullWidth: true,
                axisX: {
                    onlyInteger: true,

                },

                axisY: {
                    onlyInteger: true,
                    offset: 80,
                    labelInterpolationFnc: (value) => {
                        // Will return Mon, Tue, Wed etc. on medium screens
                        return value + " " + this.$t(this.currency.toLowerCase());
                    }
                },
                //  axisX: {
                //              showGrid: true
                //          },
                //           axisY: {
                //              showGrid: false
                //}, 
                height: '350px'

                // lineSmooth: Chartist.Interpolation.cardinal({
                //   tension: 0.5
                //  })
            }

            var responsiveOptions = [
                ['screen and (min-width: 641px) and (max-width: 1024px)', {
                    showPoint: true,
                    axisX: {
                        labelInterpolationFnc: function (value) {
                            // Will return Mon, Tue, Wed etc. on medium screens
                            return value + "dzd";
                        }
                    }
                }],
                ['screen and (max-width: 640px)', {
                    showLine: true,
                    axisX: {
                        labelInterpolationFnc: function (value) {
                            // Will return M, T, W etc. on small screens
                            return value + "dzd"
                        }
                    }
                }]
            ];

            let chart = new Chartist.Line(
                '#salesChart',
                data,
                options, responsiveOptions
            )
        },
        initCustomerAndEmployeeOfMonth() {
            let month_orders = _.filter(this.orders, o => {
                return (
                    new Date(o.date).getFullYear() == this.current_year &&
                    new Date(o.date).getMonth() == this.current_month
                )
            })

            let customers = JSON.parse(JSON.stringify(store.getters.customers))
            _.forEach(customers, c => {
                c['count'] = 0
            })
            _.forEach(month_orders, o => {
                _.map(customers, c => {
                    if (c.id == o.customer_id) {
                        c['count'] = c['count'] + 1
                    }
                    return c;
                })
            })

            this.monthCustomer = _.orderBy(customers, ['count'], ['desc'])[0]
            if (parseInt(this.monthCustomer.id) == 1 && customers.length > 1) {
                this.monthCustomer = _.orderBy(customers, ['count'], ['desc'])[1]
                if (this.monthCustomer.count == 0) {
                    this.monthCustomer = null
                }
            } else {
                this.monthCustomer = null
            }

            let employees = JSON.parse(JSON.stringify(store.getters.employees))
            _.forEach(employees, c => {
                c['count'] = 0
            })
            _.forEach(month_orders, o => {
                _.map(employees, e => {
                    if (e.id == o.issuer_employee_id) {
                        e['count'] = e['count'] + 1
                    }
                    return e;
                })
            })

            this.monthEmployee = _.orderBy(employees, ['count'], ['desc'])[0]
            this.monthEmployee = _.orderBy(employees, ['count'], ['desc'])[0]
            if (parseInt(this.monthEmployee.id) == 1 && employees.length > 1) {
                this.monthEmployee = _.orderBy(employees, ['count'], ['desc'])[1]
                if (this.monthEmployee.count == 0) {
                    this.monthEmployee = null
                }
            } else {
                this.monthEmployee = null
            }

        },

        initProductOfMonth() {
            let month_orders = _.filter(this.orders, o => {
                return (
                    new Date(o.date).getFullYear() == this.current_year &&
                    new Date(o.date).getMonth() == this.current_month
                )
            })

            let m_products = []
            _.forEach(month_orders, o => {
                m_products = m_products.concat(o.products)
            })

            let p_count = []
            _.forEach(m_products, p => {
                if (_.find(p_count, {
                        id: p.id
                    })) {
                    let index = _.findIndex(p_count, {
                        id: p.id
                    })

                    p_count[index]["amount"] = p_count[index]["amount"] + parseFloat(p.amount)
                    p_count[index]["count"] = p_count[index]["count"] + 1
                } else {
                    p_count.push({
                        id: p.id,
                        name: p.name,
                        image: p.image,
                        is_bulk_sell: p.is_bulk_sell,
                        packing: p.packing,
                        unit: p.unit.toUpperCase(),
                        amount: parseFloat(p.amount),
                        count: 1
                    })
                }
            })

            console.log("sdsqdqsdsqd");
            console.log(p_count);

            if (p_count.length > 0) {
                this.monthProduct = {};
                let first = _.orderBy(p_count, ['count'], ['desc'])[0]
                this.monthProduct = {}

                this.monthProduct['count'] = first.count
                this.monthProduct['amount'] = first.amount
                //     first = store.getters.getProduct(first.id, true);
                this.monthProduct['name'] = first.name
                this.monthProduct['image'] = first.image
                this.monthProduct['unit'] = first.unit

                console.log("first");
                console.log(first);
                if (first.is_bulk_sell && parseFloat(first.packing) > 1) {
                    let eu = parseFloat(first.amount) % parseFloat(first.packing)
                    let bx = (parseFloat(first.amount) - eu) / parseFloat(first.packing)
                        console.log(eu);
                        console.log(bx > 0 ? this.$t("packs") : this.$t("pack"));
                    this.monthProduct['amount'] = _.join(["(", bx > 0 ? bx + " ":"", bx > 0 ? this.$t("packs")+" + " : "", eu ? eu + " " + (first.unit == 'piece' ? this.$t("pieces") : this.$t(first.unit.toLowerCase())) : "", ") "], '')
                } else {
                    this.monthProduct['amount'] = first.amount + " " + this.$t(first.unit.toLowerCase())
                }

            }
        },
        isNotEmpty(str) {
            if (str != null && str != "") {
                return true;
            }
            return false;
        },
        filterOrders() {},

        toggleFilter() {
            $('#myModal').modal('toggle')
        },

        updateSalesChart() {
            store.dispatch('preferences', this.preferences)
            this.initPieCharts()
        },
        updateSales() {
            store.dispatch('preferences', this.preferences)
            this.initSales()
        },
        updateDebt() {
            store.dispatch('preferences', this.preferences)
            this.initDebt()
        },
        updateExpenses() {
            store.dispatch('preferences', this.preferences)
            this.initExpenses()
        },
        updateRevenue() {
            store.dispatch('preferences', this.preferences)
            this.initRevenue()
        },
        updateIncome() {
            store.dispatch('preferences', this.preferences)
            this.initIncome()
        },
        initIncome() {

            this.income = 0;
            if (this.preferences.income_span == 'day') {
                let orders_of_chart = this.getOrdersByDate(this.current_day_range)
                orders_of_chart.range_type = 'day';
                console.log("orders_of_chart mereeeeeeeeeeeeeeeeeeeeeee");
                console.log(orders_of_chart);
                this.income = this.getIncomeOfDate(this.current_day_range[0], orders_of_chart)
            } else if (this.preferences.income_span == 'month') {
                let orders_of_chart = this.getOrdersByDate(this.current_month_range)
                orders_of_chart.range_type = 'month';
                this.income = this.getIncomeOfDate(this.current_month_range[0], orders_of_chart)

            } else if (this.preferences.revenue_span == 'year') {
                let orders_of_chart = this.getOrdersByDate(this.current_year_range)
                orders_of_chart.range_type = 'year';
                this.income = this.getIncomeOfDate(this.current_year_range[0], orders_of_chart)

            } else {
                let start_app = [moment(store.getters.user.created_date), moment()]
                let orders_of_chart = this.getOrdersByDate(start_app)
                orders_of_chart.range_type = 'all';
                this.income = this.getIncomeOfDate(start_app[0], orders_of_chart)
            }

        },
        initRevenue() {

            this.revenue = 0;
            if (this.preferences.revenue_span == 'day') {
                let orders_of_chart = this.getOrdersByDate(this.current_day_range)
                orders_of_chart.range_type = 'day';
                this.revenue = this.getRevenueOfDate(this.current_day_range[0], orders_of_chart)
            } else if (this.preferences.revenue_span == 'month') {
                let orders_of_chart = this.getOrdersByDate(this.current_month_range)
                orders_of_chart.range_type = 'month';
                this.revenue = this.getRevenueOfDate(this.current_month_range[0], orders_of_chart)
                console.log("this.revenue fdfdgfdgfdgfdgfdgfdgfd");
                console.log(this.revenue);
                console.log(orders_of_chart);

            } else if (this.preferences.revenue_span == 'year') {
                let orders_of_chart = this.getOrdersByDate(this.current_year_range)
                orders_of_chart.range_type = 'year';
                this.revenue = this.getRevenueOfDate(this.current_year_range[0], orders_of_chart)

            } else {

                let start_app = [moment(store.getters.user.created_date), moment()]
                let orders_of_chart = this.getOrdersByDate(start_app)
                orders_of_chart.range_type = 'all';
                this.revenue = this.getRevenueOfDate(start_app[0], orders_of_chart)
            }

        },

        initExpenses() {

            this.expenses = 0;
            if (this.preferences.expenses_span == 'day') {
                let orders_of_chart = this.getStocksByDate(this.current_day_range)
                orders_of_chart.range_type = 'day';
                this.expenses = this.getExpensesOfDate(this.current_day_range[0], orders_of_chart)
            } else if (this.preferences.expenses_span == 'month') {
                let orders_of_chart = this.getStocksByDate(this.current_month_range)
                orders_of_chart.range_type = 'month';
                this.expenses = this.getExpensesOfDate(this.current_month_range[0], orders_of_chart)

            } else if (this.preferences.expenses_span == 'year') {
                let orders_of_chart = this.getStocksByDate(this.current_year_range)
                orders_of_chart.range_type = 'year';
                this.expenses = this.getExpensesOfDate(this.current_year_range[0], orders_of_chart)

            } else {
                let start_app = [moment(store.getters.user.created_date), moment()]
                let orders_of_chart = this.getStocksByDate(start_app)
                orders_of_chart.range_type = 'all';
                this.expenses = this.getExpensesOfDate(start_app[0], orders_of_chart)
            }

        },

        initDebt() {

            this.debt = 0;
            if (this.preferences.debt_span == 'day') {
                let orders_of_chart = this.getOrdersByDate(this.current_day_range)
                orders_of_chart.range_type = 'day';
                this.debt = this.getDebtOfDate(this.current_day_range[0], orders_of_chart)
            } else if (this.preferences.debt_span == 'month') {
                let orders_of_chart = this.getOrdersByDate(this.current_month_range)
                orders_of_chart.range_type = 'month';
                this.debt = this.getDebtOfDate(this.current_month_range[0], orders_of_chart)

            } else if (this.preferences.revenue_span == 'year') {
                let orders_of_chart = this.getOrdersByDate(this.current_year_range)
                orders_of_chart.range_type = 'year';
                this.debt = this.getDebtOfDate(this.current_year_range[0], orders_of_chart)

            } else {
                let start_app = [moment(store.getters.user.created_date), moment()]
                let orders_of_chart = this.getOrdersByDate(start_app)
                orders_of_chart.range_type = 'all';
                this.debt = this.getDebtOfDate(start_app[0], orders_of_chart)
            }

        },
        initSales() {
            /// ///console.log(Date.now())
            this.sales = 0;
            if (this.preferences.sales_span == 'month') {
                var temp_orders = _.filter(this.orders, o => {
                    return (
                        new Date(o.date).getFullYear() == this.current_year &&
                        new Date(o.date).getMonth() == this.current_month
                    )
                })
                this.sales = temp_orders.length
            } else if (this.preferences.sales_span == 'year') {
                var temp_orders = _.filter(this.orders, o => {
                    return new Date(o.date).getFullYear() == this.current_year
                })
                this.sales = temp_orders.length
            } else {
                var temp_orders = _.filter(this.orders, o => {
                    return (
                        new Date(o.date).getFullYear() == this.current_year &&
                        new Date(o.date).getMonth() == this.current_month &&
                        new Date(o.date).getDate() == this.current_day
                    )
                })
                this.sales = temp_orders.length
            }
            /// ///console.log(Date.now())
            console.log(temp_orders);
            console.log(this.revenue);
        },

        ReOrderRevenueTable() {
            this.revenue_pie = this.revenue_pie.reverse()

            $(this.$refs['pie_table_reorder']).toggleClass('rotate180')
        },
        getThisMonthRevenueByProduct() {
            let month_orders = this.getOrdersByDate([moment().startOf('month').toDate(), moment().toDate()]).in_range_orders

            // month products
            let m_products = []

            _.forEach(month_orders, o => {
                let prs = _.map(o.products, p => {
                    p['customer_discount'] = (o.discount * 100) / o.total_net
                    if(p.sell_price>=p.buy_price){
                        return p
                    }
                })
                
                    m_products = m_products.concat(prs)
                
            })
            console.log("m_products");
            console.log(m_products);
             m_products= _.filter(m_products,p=>{
                 return p != undefined;
            })
            // month revenue

            let p_revenue = []

            _.forEach(m_products, p => {
                if (_.find(p_revenue, {
                        id: p.id
                    })) {
                    let index = _.findIndex(p_revenue, {
                        id: p.id
                    })
                    let amount = p.amount;

                    let revenue = amount * (p.sell_price - p.buy_price)
                    revenue = revenue - (p.discount / 100) * (amount * p.sell_price) // substracting product discount
                    revenue = revenue - (p.customer_discount / 100) * revenue // substracting >{{$t("customer_discount")}}
                    p_revenue[index].revenue = p_revenue[index].revenue + revenue
                    /// /console.log(p.name + " " + p_revenue[index].revenue);
                } else {
                    let amount = p.amount;
                    let revenue = amount * (p.sell_price - p.buy_price)
                    revenue = revenue - (p.discount / 100) * (amount * p.sell_price) // substracting product discount
                    revenue = revenue - (p.customer_discount / 100) * revenue // substracting >{{$t("customer_discount")}}
                    let pr = store.getters.getProduct(p.id)
                    let name
                    if (!pr) {
                        name = p.name
                    } else {
                        name = pr.name
                    }
                    p_revenue.push({
                        id: p.id,
                        color: randomColor(),
                        name: name,
                        unit: p.unit.toUpperCase(),
                        revenue: revenue
                    })
                }
            })
            p_revenue = p_revenue.map(x => {
                x.revenue = Math.round(x.revenue)
                return x
            })
            let total_month_revenue = 0
            total_month_revenue = _.sumBy(p_revenue, 'revenue')
          
            let revenue_pie = _.orderBy(p_revenue, ['revenue'], ['desc'])
            _.map(revenue_pie, p => {
                if(total_month_revenue == 0){
                    p.revenue_perc =0

                }else{
                    p.revenue_perc = parseFloat(((p.revenue * 100) / total_month_revenue).toFixed(2))

                }
                // if(total_month_revenue <= 0){
                //         p.revenue_perc = 0
                        
                // }else{
                //     if(p.revenue<=0){
                //     p.revenue_perc =0

                //     }else{
                //         p.revenue_perc = parseFloat(((p.revenue * 100) / total_month_revenue).toFixed(2))

                //     }

                // }
                return p;
            })

            return revenue_pie;
        },
        getLastMonthRevenueByProduct() {

            let last_month_orders = this.getOrdersByDate([moment().subtract(1, 'months').startOf('month'), moment().subtract(1, 'months').endOf('month')]).in_range_orders

            // month products

            let l_m_products = []

            _.forEach(last_month_orders, o => {
                let prs = _.map(o.products, p => {
                    p['customer_discount'] = (o.discount * 100) / o.total_net
                    return p
                })
                l_m_products = l_m_products.concat(prs)
            })

            // month revenue

            let p_revenue = []

            _.forEach(l_m_products, p => {
                if (_.find(p_revenue, {
                        id: p.id
                    })) {
                    let index = _.findIndex(p_revenue, {
                        id: p.id
                    })
                    let amount = p.amount;

                    let revenue = amount * (p.sell_price - p.buy_price)
                    revenue = revenue - (p.discount / 100) * (amount * p.sell_price) // substracting product discount
                    revenue = revenue - (p.customer_discount / 100) * revenue // substracting >{{$t("customer_discount")}}
                    p_revenue[index].revenue = p_revenue[index].revenue + revenue
                    /// /console.log(p.name + " " + p_revenue[index].revenue);
                } else {
                    let amount = p.amount;
                    let revenue = amount * (p.sell_price - p.buy_price)
                    revenue = revenue - (p.discount / 100) * (amount * p.sell_price) // substracting product discount
                    revenue = revenue - (p.customer_discount / 100) * revenue // substracting >{{$t("customer_discount")}}
                    let pr = store.getters.getProduct(p.id)
                    let name
                    if (!pr) {
                        name = p.name
                    } else {
                        name = pr.name
                    }
                    p_revenue.push({
                        id: p.id,
                        color: randomColor(),
                        name: name,
                        unit: p.unit.toUpperCase(),
                        revenue: revenue
                    })
                }
            })
            p_revenue = p_revenue.map(x => {
                x.revenue = Math.round(x.revenue)
                return x
            })
            let total_month_revenue = 0
            total_month_revenue = _.sumBy(p_revenue, 'revenue')
            let revenue_pie = _.orderBy(p_revenue, ['revenue'], ['desc'])

            _.forEach(revenue_pie, p => {
                p.revenue_perc = ((p.revenue * 100) / total_month_revenue).toFixed(2)
            })

            return revenue_pie;
        },
        initPieCharts() {
            // init line chart

            this.revenue_pie = this.getThisMonthRevenueByProduct()
            let last_month_revenue_pie = this.getLastMonthRevenueByProduct()

            setImmediate(()=>{
            console.log("this.revenue_pie");
                console.log(this.revenue_pie);

            })
            _.map(this.revenue_pie, r => {
                let last_m_r = _.find(last_month_revenue_pie, {
                    id: r.id
                });
                if (last_m_r) {
                    if (r.revenue_perc > last_m_r.revenue_perc) {
                        r["increased"] = 1
                        r["revenue_arrow"] = r.revenue - last_m_r.revenue
                        r["revenue_arrow_perc"] = (last_m_r.revenue * 100) / r.revenue
                    } else {
                        r["increased"] = -1
                        r["revenue_arrow"] = last_m_r.revenue - r.revenue
                        r["revenue_arrow_perc"] = (r.revenue * 100) / last_m_r.revenue
                    }
                } else {
                    let p_stock = store.getters.getStocks(r.id);
                    let is_newly_bought = false;
                    if (p_stock) {
                        is_newly_bought = moment(p_stock[0].date).isSame(moment(), 'month')
                    }

                    if (is_newly_bought) {
                        r["increased"] = -2
                    } else {
                        r["increased"] = -1
                        r["revenue_arrow"] = 0
                        r["revenue_arrow_perc"] = 100
                    }
                }
                return r;
            })

            let top5Products = this.revenue_pie.slice(0, 5)
            let otherProducts = this.revenue_pie.slice(5)
            let other_product_revenue = 0
            other_product_revenue = _.sumBy(otherProducts, 'revenue')

            let pielabels = []
            let pieseries = []

            pielabels = []
            pieseries = []

            let total_month_revenue = 0
            total_month_revenue = _.sumBy(this.revenue_pie, 'revenue')

            console.log("total_month_revenue");
            console.log(top5Products);
            let cpt = 0
            _.forEach(top5Products, p => {
                // console.log(parseFloat(p.revenue_perc));
                if (parseInt(p.revenue_perc) >= 1) {
                    let perc = Math.round((p.revenue * 100) / total_month_revenue)
                    pielabels.push(perc + '%')
                    pieseries.push(perc)
                    cpt++
                }
            })
            top5Products.length = cpt

            this.pieArray = this.revenue_pie.slice(0, 5)
            this.pieArray = _.filter(this.pieArray, p => {
                return parseInt(p.revenue_perc) >= 1
            })

            if (top5Products.length >= 5 && otherProducts.length > 0) {
                pielabels.push(
                    ((other_product_revenue * 100) / total_month_revenue).toFixed(2) + '%'
                )
                pieseries.push(
                    Math.round((other_product_revenue * 100) / total_month_revenue)
                )
                this.pieArray.push({
                    name: 'Other',
                    revenue: other_product_revenue,
                    revenue_perc: Math.round(
                        (other_product_revenue * 100) / total_month_revenue
                    )
                })
            }

            var dataPreferences = {
                labels: pielabels,
                series: pieseries
            }
            console.log("dataPreferences");
            console.log(dataPreferences);

            var optionsPreferences = {
                total: 100,
                startAngle: 270,
                // showLabel: false,
                labelInterpolationFnc: function (value) {
                    return value
                },
                height: '350px'
            }
            var responsiveOptions = [
                // ['screen and (min-width: 640px)', {
                //   chartPadding: 30,
                //   labelOffset: Math.random()*1000,
                //   labelDirection: 'explode',
                //   labelInterpolationFnc: function(value) {
                //     return value;
                //   }
                // }],
                // ['screen and (min-width: 1024px)', {
                //   labelOffset: 150,
                //   chartPadding: 20
                // }
            ]

            let charty = Chartist.Pie(
                '#chartPreferences',
                dataPreferences,
                optionsPreferences,
                responsiveOptions
            )

            let span = 100
            charty.on('draw', (data) => {
                if (data.type === 'label') {
                    data.x = data.x + span
                    data.group.x = data.group.x + span
                    // data.element.y = data.element.y+span;
                    // data.group
                    //   .elem(
                    //     "text",
                    //     {
                    //       x: data.x+span,
                    //       y: data.y + span,
                    //       style: ""
                    //     },
                    //     ""
                    //   )
                    //   .text(data.value + "Hellow");
                    span = span + 100
                    // console.log(data);
                    // console.log(span);
                }
            })
        }
    },
    watch: {
        selected_charts(newValue, oldValue) {
            let sc = JSON.parse(JSON.stringify(this.selected_charts))
            let preferences = Object.assign({}, this.preferences);
            sc = _.map(sc, (p) => {
                return p.value
            });
            preferences.dashboard.selected_charts = sc;
            store.dispatch("preferences", preferences)
        }
    },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" scoped>
list-item {
    display: inline-block;
    margin-right: 10px;
}

.main-panel {
    /*   border: 10px solid white;
    border-radius: 25px;*/
  //  padding: 9px;
}

.card {
    padding: 10px;
}

.card .content {
    padding: 0px;
}

.card .header {
    padding: 0px;
}

.wrapper::-webkit-scrollbar {
    width: 0em;
}

@keyframes width-pulse {
    0% {
        stroke-width: 6px;
    }

    50% {
        stroke-width: 14px;
    }

    100% {
        stroke-width: 6px;
    }
}

@keyframes dashoffset-seven {
    0% {
        stroke-dashoffset: 7px;
    }

    100% {
        stroke-dashoffset: 0px;
    }
}

@keyframes dasharray-craziness {
    0% {
        stroke-dasharray: 7px 2px;
    }

    80% {
        stroke-dasharray: 7px 100px;
        stroke-width: 10px;
    }

    100% {
        stroke-dasharray: 7px 2px;
    }
}

.ct-chart .ct-series.ct-series-a .ct-line {
    stroke: #b0e0e6;
    stroke-width: 2px;
    stroke-dasharray: 5px 2px;
    animation: dashoffset-seven 200ms infinite linear;
}

.modal-dialog {
    position: absolute;
    top: 50%;
    left: calc(45% - 300px);
    transform: translate(0, -50%) !important;
    -ms-transform: translate(0, -50%) !important;
    -webkit-transform: translate(0, -50%) !important;
    width: 900px;
    height: 600px;
}

.modal-content {
    min-height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}

.modal-body {
    position: absolute;
    top: 45px;
    bottom: 45px;
    left: 0;
    right: 0;
    overflow-y: auto;
}

.modal-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
}

.search {
    width: 100%;
    height: 30px;
    font-size: 15px;
    font-family: inherit;
    padding-left: 10px;
    margin-top: 7px;
}

.stroke-0 {
    color: #68b3c8;
}

.stroke-1 {
    color: #ffd700;
}

.stroke-2 {
    color: #eb5e28;
}

.stroke-3 {
    color: #7ac29a;
}

.stroke-4 {
    color: #5c5b43;
}

.stroke-5 {
    color: rgba(138, 138, 138, 0.8);
}

.rotate180 {
    transform: scaleY(-1);
}

.flip-list-move {
    transition: transform 0.1s;
}

thead,
tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
}

.ct-chart-pie {
    display: flex !important;
    justify-content: center !important;
}

th {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-size: 17px;
    font-weight: 500;
}

.sidebar-wrapper[dir='ltr'] {
    box-shadow: inset -1px 0px 0px 0px #DDDDDD !important;
}

.sidebar-wrapper[dir='rtl'] {
    box-shadow: inset 1px 0px 0px 0px #DDDDDD !important;
}

th {
    font-family: "Montserrat", "Cairo";
    font-size: 18px;
    font-weight: 700;
    padding: 5px;
    line-height: 38px;
}

.red-arrow {
    font-size: 24px;
    color: #eb5e28;
}

.green-arrow {
    font-size: 24px;
    color: #7ac29a;
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
.numbers{
    direction: ltr;
    p:nth-child(2){
        font-size: 22px;
        display: inline;
    }
}
</style>
