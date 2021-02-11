<template lang="lang">
<div class="main-panel" :style="{'float':$i18n.locale=='ar' ? 'left':'right'}">
    <nav class="navbar navbar-default">
        <div class="nav-container">
            <div class="navbar-header" style="width:20%;display: inline-flex;">
                <button type="button" class="navbar-toggle">
                    <span class="sr-only">{{ $t("toggle_nav") }}</span>
                    <span class="icon-bar bar1"></span>
                    <span class="icon-bar bar2"></span>
                    <span class="icon-bar bar3"></span>
                </button>
                <a class="navbar-brand">{{$t("orders")}}</a>
            </div>
            <ul :class="$i18n.locale=='ar'?'text-left':'text-right'" class="nav navbar-nav" style="width:100%">
                <li style="width:100%">
                    <div class="form-group">
                        <input type="text" v-model="searchText" class="text-center search" name="search" ref="search" id="search" :placeholder="$t('filter_by_customer_name_or_phone')">
                        <span :class="$i18n.locale=='ar'?'icon-left':'icon-right'">
                            <font-awesome-icon @click="$refs.search.focus()" class="inlineFilter" color="gray" icon="search" />
                        </span>
                    </div>
                </li>
            </ul>
            <ul class="nav navbar-nav navbar-right" style="margin-right: 0px">
                <li>
                    <a class="btn btn-circle" @click="addOrder">
                        <i class="ti-plus"></i>
                    </a>
                </li>
            </ul>
        </div>
    </nav>
    <div class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="card">
                    <div class="header">
                        <div class="row">
                            <div class="col-md-6">
                                <!-- <h4 class="title">Orders of</h4> -->
                            </div>
                            <!-- <div :class="$i18n.locale=='ar'?'text-left':'text-right'" class="col-md-6">
                  <date-picker
                    @change="rangeCleared()"
                    @confirm="filterOrders(true)"
                    v-model="daterange"
                    input-class="mx-input"
                    :confirm="true"
                    :not-after="new Date()"
                    :shortcuts="shortcuts"
                    :lang="lang"
                    range
                  ></date-picker>
                </div>-->
                        </div>
                    </div>
                    <div class="content table-responsive table-full-width">
                        <table class="table table-hover">
                            <thead>
                                <th width="4%">{{$t('n')}}</th>
                                <th width="15%" :class="$i18n.locale=='ar'?'text-right':'text-left'">{{$t("employee")}}</th>
                                <th width="15%" :class="$i18n.locale=='ar'?'text-right':'text-left'">{{$t("customer")}}</th>
                                <th width="20%" class="text-center">
                                    <date-picker @change="rangeCleared()" @confirm="filterOrders(true)" v-model="daterange" input-class="mx-input2" :confirm="true" :not-after="new Date()" :shortcuts="shortcuts" :lang="lang" range></date-picker>
                                </th>
                                <th width="20%" class="text-center">{{$t("desc")}}</th>
                                <th :class="$i18n.locale=='ar'?'text-left':'text-right'">{{$t("total")}} ({{$t(currency.toLowerCase())}})</th>
                                <th width="15%" :class="$i18n.locale=='ar'?'text-left':'text-right'">{{ $t("actions") }}</th>
                            </thead>
                            <tbody v-if="filteredOrders.length > 0">
                                <tr @click="selectRow(index)" style="cursor: pointer;" v-for="(order, index) in filteredOrders" :key="order.id" :ref="index">
                                    <td>{{index+1+((currentPage-1)*pageMax)}}</td>
                                    <td>
                                        <div class="row center-all">
                                            <div :class="$i18n.locale=='ar'?'text-left':'text-right'" class="col-xs-4 col-md-4 col-lg-3" style="height:50px">
                                                <div class>
                                                    <Avatar :image="getEmployee(order.issuer_employee_id).image" :fullname="getEmployee(order.issuer_employee_id).name" :width="50" :height="50" :radius="50" :crop="true" :changeable="false" />
                                                </div>
                                            </div>
                                            <div :class="$i18n.locale=='ar'?'text-right':'text-left'" class="col-xs-8 col-md-8 col-lg-9 trim-text">
                                                <span v-if="order.issuer_employee_id != 1">{{getEmployee(order.issuer_employee_id).name}}</span>
                                                <span v-else>{{$t("a_admin")}}</span>
                                                <br>
                                                <span v-if="order.issuer_employee_id != 1" class="text-info">
                                                    <small dir="ltr">{{getEmployee(order.issuer_employee_id).phone}}</small>
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="row center-all">
                                            <div :class="$i18n.locale=='ar'?'text-left':'text-right'" class="col-xs-4 col-md-4 col-lg-3" style="height:50px">
                                                <div class>
                                                    <Avatar :image="getCustomer(order.customer_id).image" :fullname="getCustomer(order.customer_id).name" :width="50" :height="50" :radius="50" :crop="true" :changeable="false" />
                                                </div>
                                            </div>
                                            <div :class="$i18n.locale=='ar'?'text-right':'text-left'" class="col-xs-8 col-md-8 col-lg-9 trim-text">
                                                <span v-if="order.customer_id != 1">{{getCustomer(order.customer_id).name}}</span>
                                                <span v-else>{{$t("anonymous")}}</span>
                                                <br>
                                                <span class="text-info">
                                                    <small dir="ltr">{{getCustomer(order.customer_id).phone}}</small>
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td style="width:15%" dir="ltr" class="text-center">{{order.date.substring(0,16).replace('T',' ')}}</td>
                                    <td class="text-center">
                                        <div style="max-height: 80px;overflow-y: auto;direction:initial">{{getOrderDesc(order.products)}}</div>
                                    </td>

                                    <td dir="ltr" :class="$i18n.locale=='ar'?'text-left':'text-right'">{{order.total_net | currency}}
                                        <span v-if="getOrderDebt(order) > 0" class="label label-danger" style="font-size: 15px;" dir="ltr">{{$t("debt")}} {{getOrderDebt(order)}}</span> </td>

                                    <td :class="$i18n.locale=='ar'?'text-left':'text-right'">
                                        <button @click="openInvoice(order.id)" class="btn btn-info btn-icon">
                        <i class="mdi mdi-receipt" style="font-size:22px;"></i>
                      </button>
                      <button @click="editOrder(order.id)" class="btn btn-success btn-icon">
                        <i class="mdi mdi-pencil-outline"></i>
                      </button>
                      <button @click="deleteOrder(index,order.id)" class="btn btn-danger btn-icon">
                        <i class="mdi mdi-trash-can-outline"></i>
                      </button>
                                        <!-- <v-menu attach solo @click.prevent.stop="()=>{}" offset-y>
                                            <template v-slot:activator="{ on }">
                                                <v-btn icon class="icon-44" v-on="on">
                                                    <v-icon>more_vert</v-icon>
                                                </v-btn>
                                            </template>
                                            <v-list>

                                                <v-list-tile @click.stop="editOrder(order.id,$event)">
                                                    <v-list-tile-action>
                                                        <v-icon>mdi-pencil-outline</v-icon>
                                                    </v-list-tile-action>

                                                    <v-list-tile-content>
                                                        <v-list-tile-title>{{$t("edit_order")}}</v-list-tile-title>
                                                        <v-list-tile-sub-title>(Ctrl+E)</v-list-tile-sub-title>
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                                <v-list-tile @click.stop="openInvoice(order.id)">
                                                    <v-list-tile-action>
                                                        <v-icon>mdi-receipt</v-icon>
                                                    </v-list-tile-action>

                                                    <v-list-tile-content>
                                                        <v-list-tile-title>{{$t("order_reciept")}}</v-list-tile-title>
                                                     <v-list-tile-sub-title>(Ctrl+R)</v-list-tile-sub-title>
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                                <v-list-tile @click.stop="deleteOrder(index,order.id)">
                                                    <v-list-tile-action>
                                                        <v-icon color="error">mdi-trash-can-outline</v-icon>
                                                    </v-list-tile-action>

                                                    <v-list-tile-content>
                                                        <v-list-tile-title>{{$t("delete_order")}}</v-list-tile-title>
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                            </v-list>
                                        </v-menu> -->
                                    </td>

                                </tr>
                            </tbody>
                        </table>
                        <div v-if="orders.length > pageMax && filteredOrders.length > 0" class="row text-center">
                            <nav aria-label="Search results pages">
                                <v-pagination v-model="currentPage" :page-count="pageCount" :classes="bootstrapPaginationClasses" :labels="customLabels"></v-pagination>
                            </nav>
                        </div>
                    </div>
                    <div style="padding: 50px;" class="row text-center" v-if="filteredOrders.length == 0">
                        <i style="font-size:80px;color:gray" class="ti-filter"></i>
                        <h3>{{$t("no_orders_found")}}</h3>
                        <p style="margin-bottom:50px" class="category" v-if="orders.length > 0">{{$t("change_search_to_see_orders")}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import vPagination from "vue-plain-pagination";
import {
    Notification
} from "electron";
import {
    Product
} from "./models.js";
import DatePicker from "vue2-datepicker";
import Avatar from "./sub_components/Avatar.vue";

import {
    getStartYearDate,
    getStartMonthDate
} from "./utils.js";
var {
    ipcRenderer,
    remote
} = require("electron");
const {
    dialog
} = require("electron").remote;

export default {
    name: "orders",
    components: {
        vPagination,
        DatePicker,
        Avatar
    },
    created() {
        console.log("orders created");
        this.orders = store.getters.orders;

        console.log("this.orders");
        console.log(this.orders);
        this.currency = store.getters.user.currency ?
            store.getters.user.currency :
            "DZD";

        this.pageCount = Math.ceil(this.orders.length / this.pageMax);
        this.filterOrders();

    },
    deactivated() {
        $("tr").removeClass("animated");
        $("tr").removeClass("pulse");
        $("tr").removeClass("fadeOutLeft");
        this.turnListeners(false);
    },
    activated() {
        console.log("activated");
        this.orders = store.getters.orders;
        // console.log(this.orders);

        this.filterOrders();
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
                dateRange: this.$t("date")
            }
        };
        this.customLabels = {
            first: this.$t("first"),
            prev: this.$t("previous"),
            next: this.$t("next"),
            last: this.$t("last")
        };
        this.turnListeners(true);
    },

    data() {
        return {
            daterange: "",
            selected_id: -1,
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
                        let sdate = new Date();
                        sdate.setHours(0);
                        sdate.setMinutes(0);
                        sdate.setSeconds(0);
                        sdate.setMilliseconds(0);
                        let edate = new Date();
                        edate.setHours(23);
                        edate.setMinutes(59);
                        edate.setSeconds(59);
                        edate.setMilliseconds(99);
                        this.daterange = [sdate, edate];
                    }
                },
                {
                    text: this.$t("this_month"),
                    onClick: () => {
                        this.daterange = [getStartMonthDate(new Date()), new Date()];
                    }
                }, {
                    text: this.$t("last_month"),
                    onClick: () => {
                        this.daterange = [moment().subtract(1, 'months').startOf('month'), moment().subtract(1, 'months').endOf('month')];
                    }
                },
                {
                    text: this.$t("this_year"),
                    onClick: () => {
                        this.daterange = [getStartYearDate(new Date()), new Date()];
                    }
                }
            ],

            currentPage: 1,
            pageMax: 7.0,
            currentCount: 0,
            orders: [],
            filteredOrders: [],
            currency: null,
            searchText: "",
            bootstrapPaginationClasses: {
                // http://getbootstrap.com/docs/4.1/components/pagination/
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
    methods: {
        turnListeners(on) {
            if (on) {
                this.$eventBus.$on("del", (arg) => {
                    console.log(this.getSelectedId());
                    if (this.getSelectedId() || this.getSelectedId()==0) {
                        this.deleteOrder(this.getSelectedId(),this.filteredOrders[this.getSelectedId()]);
                    }
                });
                this.$eventBus.$on("cmd_del", (arg) => {
                    if (this.getSelectedId() || this.getSelectedId()==0) {
                        this.deleteOrder(this.getSelectedId(),this.filteredOrders[this.getSelectedId()], true);
                    }
                });
                
                this.$eventBus.$on("up", (arg) => {
             
                        this.selectBeforeRow(this.getSelectedId());
                    
                });
                this.$eventBus.$on("down", (arg) => {
               
                        this.selectAfterRow(this.getSelectedId());
                    
                });
                this.$eventBus.$on("add", (arg) => {
                
                        this.addOrder();
                    
                });
                 this.$eventBus.$on("edit", (arg) => {
                        if(this.getSelectedId()){
                          this.editOrder(this.filteredOrders[this.getSelectedId()].id);
                        }
                });
                      this.$eventBus.$on("r", (arg) => {
                        if(this.getSelectedId()){
                          this.openInvoice(this.filteredOrders[this.getSelectedId()].id);
                        }
                });
            } else {
                this.$eventBus.$off("del");
                this.$eventBus.$off("cmd_del");
                this.$eventBus.$off("up");
                this.$eventBus.$off("down");
                this.$eventBus.$off("add");
                this.$eventBus.$off("edit");
            }
        },
        getSelectedId() {
            return this.selected_id;
        },
        selectRow(id) {
            if (this.$refs[id]) {
                this.selected_id = id;
                $("tr").removeClass("selected");
                $(this.$refs[id]).addClass("selected");
            } else {
                this.selected_id = null;
            }
        },
        selectAfterRow(id) {
            if (this.$refs[parseInt(id) + 1] && this.filteredOrders.length > parseInt(id) + 1) {
                this.selected_id = parseInt(id) + 1;
                $("tr").removeClass("selected");
                $(this.$refs[this.selected_id]).addClass("selected");
                
            }else if(this.filteredOrders.length>0){
                this.selected_id = 0;
                this.selectRow(this.selected_id);
            }
           
            

        },
        selectBeforeRow(id) {
            if (this.$refs[parseInt(id) - 1] && this.filteredOrders.length > parseInt(id) -1) {
                this.selected_id = parseInt(id) - 1;
                $("tr").removeClass("selected");
                $(this.$refs[this.selected_id]).addClass("selected");
               
            }else if(this.filteredOrders.length>0){
                this.selected_id = this.filteredOrders.length-1;
                this.selectRow(this.selected_id);
            }
          

        },
        getOrderDebt(order) {
            let total_payed = _.reduce(order.payments, (result, p) => {
                return result + p.amount;
            }, 0);
            return parseFloat((order.total_net - total_payed).toFixed(2));
        },
        getCustomer(id) {
            return store.getters.getCustomer(id, true);
        },
        getEmployee(id) {
            return store.getters.getEmployee(id, true);
        },
        openInvoice(id) {
          
            $("tr").removeClass("animated pulse");
            setTimeout(() => {
                $(this.$refs[id]).addClass("animated pulse");
                this.$router.push({
                    name: "open_invoice",
                    params: {
                        id: id
                    }
                });
            }, 250);
        },
        getOrderDesc(products) {
            var desc = [];
            _.forEach(products, p => {
                desc.push("(" + this.$t(p.unit.toLowerCase()) + " " + p.amount + ") x " + p.name);
            });
            return _.join(desc, "\n");
        },
        addOrder() {
            this.$router.push("/fast-sell");
        },
        editOrder(id) {
            
            $("tr").removeClass("animated pulse");
            setTimeout(() => {
                $(this.$refs[id]).addClass("animated pulse");
                this.$router.push({
                    name: "fast_sell_edit",
                    params: {
                        id: id
                    }
                });
            }, 250);
        },

        filterOrders(resetCurrentPage = false) {
            let filteredO1 = _.filter(this.orders, o => {
                if (this.daterange[0] == null && this.daterange[1] == null) {
                    return true;
                } else {
                    let sdate = this.daterange[0];
                    let edate = this.daterange[1];
                    edate.setHours(23);
                    edate.setMinutes(59);
                    edate.setSeconds(59);
                    edate.setMilliseconds(99);

                    if (
                        new Date(o.date).getTime() >= sdate.getTime() &&
                        new Date(o.date).getTime() <= edate.getTime()
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                }
            });

            let filteredO = _.filter(filteredO1, o => {
                if (this.searchText.trim() == "") {
                    return true;
                } else {
                    if (
                        this.getCustomer(o.customer_id)
                        .name.toLowerCase()
                        .search(this.searchText.toLowerCase()) != -1 ||
                        this.getCustomer(o.customer_id).phone.search(this.searchText) != -1
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                }
            });

            if (resetCurrentPage) {
                this.currentPage = 1;
            }
            if (this.orders.length > 0) {
                this.filteredOrders = _.slice(
                    filteredO,
                    this.pageMax * (this.currentPage - 1),
                    this.pageMax * (this.currentPage - 1) + this.pageMax
                );
            } else {
                this.filteredOrders = [];
            }
            this.pageCount = Math.ceil(filteredO.length / this.pageMax);
        },
        deleteOrder(index,id, force = false) {
            //event.stopPropagation();
            // animate the order row

            if (force) {
                $(this.$refs[index][0]).addClass("animated fadeOutLeft");
                setTimeout(() => {
                    _.remove(this.orders, {
                        id: id
                    });
                    store.dispatch("orders", this.orders);
                    if (this.filteredOrders.length == 1) {
                        this.currentPage =
                            this.currentPage != 0 ? this.currentPage - 1 : 1;
                    }
                    this.filterOrders();
                }, 500);
            } else {
                swal({
                    title: this.$t("delete_order_confirm"),
                    text: "",
                    icon: "warning",
                    buttons: [this.$t("no"), this.$t("yes")],
                    dangerMode: true
                }).then(willDelete => {
                    if (willDelete) {
                        $(this.$refs[index][0]).addClass("animated fadeOutLeft");
                        setTimeout(() => {
                            _.remove(this.orders, {
                                id: id
                            });
                            store.dispatch("orders", this.orders);
                            if (this.filteredOrders.length == 1) {
                                this.currentPage =
                                    this.currentPage != 0 ? this.currentPage - 1 : 1;
                            }
                            this.filterOrders();
                        }, 500);
                    }
                });
            }

        },
        rangeCleared() {
            this.filterOrders(true);
        }
    },
    watch: {
        currentPage: function (val, oldVal) {
            this.filterOrders();
        },
        searchText() {
            setTimeout(() => {
                this.filterOrders(true);
            }, 250);
        },
        daterange() {
            if (this.daterange[0] != null && this.daterange[1] != null) {
                setTimeout(() => {
                    this.filterOrders(true);
                }, 400);
            }
        }
    }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" scoped>
.pagination>li>a {
    cursor: pointer;
}

list-item {
    display: inline-block;
    margin-right: 10px;
}

.list-enter-active,
.list-leave-active {
    transition: all 1s;
}

.list-enter,
.list-leave-to

/* .list-leave-active below version 2.1.8 */
    {
    opacity: 0;
    transform: translateX(30px);
}

.main-panel {
    /*   border: 10px solid white;
    border-radius: 25px;*/
  //  padding: 9px;
}

.wrapper::-webkit-scrollbar {
    width: 0em;
}

.search[type="text"] {
    width: calc((100% - 20%) / 1.5);
    -webkit-transition: width 0.4s ease-in-out;
    transition: width 0.4s ease-in-out;
}

.search[type="text"]:focus {
    width: calc(100% - 50px);
    margin-right: 20px;

}

.search {
    text-overflow: ellipsis;
    height: 50px;
    font-size: 20px;
    font-family: inherit;
    padding-left: 50px;
    padding-right: 50px;
    margin-top: 1px;
    margin-right: 20px;

}

.inlineFilter {
    display: inline;
    color: #b7b7b7;
    font-size: 25px;
    z-index: 2;
    cursor: pointer;
}

.trim-text {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/*.page-item::after,.page-item::before {
    box-sizing: border-box;
}
.page-item{
        display: list-item;
    text-align: -webkit-match-parent;
}
.page-link {
    position: relative;
    display: block;
    padding: .5rem .75rem;
    margin-left: -1px;
    line-height: 1.25;
    color: #007bff;
    background-color: #fff;
    border: 1px solid #dee2e6;
}*/
th {
    font-family: "Montserrat", "Cairo";
    font-size: 18px;
    font-weight: 700;
    padding: 10px;
    line-height: 38px;
}

thead {
    background: #f5f5f5;
}

.card .content {
    padding: 0px 15px 10px 15px;
}

.card .header {
    padding: 0px;
}

.mx-datepicker {
    display: inline-block !important;
    width: 230px !important;
}

.cell {
    border-top: 0px !important;
}

.selected {
    background-color: rgb(236, 236, 236);
}
</style>
