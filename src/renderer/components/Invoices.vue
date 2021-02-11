<template lang="lang">
<div class="main-panel" :style="{'float':$i18n.locale=='ar' ? 'left':'right'}">
    <nav class="navbar navbar-default">
        <div class="nav-container">
            <div class="navbar-header" style="width: 20%;display: inline-flex;">
                <button type="button" class="navbar-toggle">
                    <span class="sr-only">{{ $t("toggle_nav") }}</span>
                    <span class="icon-bar bar1"></span>
                    <span class="icon-bar bar2"></span>
                    <span class="icon-bar bar3"></span>
                </button>
                <a class="navbar-brand">{{ $t("buy_invoices") }}</a>
            </div>
            <ul :class="$i18n.locale=='ar'?'text-left':'text-right'" class="nav navbar-nav " style="width:100%">
                <li style="width:100%">
                    <input type="text" v-model="searchText" class="text-center search" name="search" ref="search" id="search" :placeholder="$t('filter_by_name_or_phone')">
                    <span :class="$i18n.locale=='ar'?'icon-left':'icon-right'">
                        <font-awesome-icon @click="$refs.search.focus()" class="inlineFilter" color="gray" icon="search" />
                    </span>
                </li>
            </ul>
            <ul class="nav navbar-nav navbar-right" style="margin-right: 0px">
                <li>
                    <a class="btn btn-circle" @click="addInvoice">
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
                    <!-- <div class="header">
                            <div class="row">
                                <div class="col-md-6">
                                    <h4 class="title" >List of invoices</h4>
                                </div>
                              
                            </div>
            </div>-->
                    <div class="content table-responsive table-full-width">
                        <table class="table table-hover">
                            <thead>
                                <th width="4%">{{ $t("id") }}</th>
                                <th width="15%" :class="$i18n.locale=='ar'?'text-right':'text-left'">{{$t("employee")}}</th>
                                <th :class="$i18n.locale=='ar'?'text-right':'text-left'" width="15%">{{ $t("supplier") }}</th>
                                <th width="30%" class="text-center">{{$t("date")}}
                                    <date-picker @change="rangeCleared()" @confirm="filterInvoices(true)" v-model="daterange" input-class="mx-input2" :confirm="true" :not-after="new Date()" :shortcuts="shortcuts" :lang="lang" range></date-picker>
                                </th>
                                <th width="10%" class="text-center">{{ $t("items_count") }}</th>
                                <th class="text-center">{{ $t("total") }} ({{$t(currency.toLowerCase())}})</th>
                                <th :class="$i18n.locale=='ar'?'text-left':'text-right'">{{ $t("actions") }}</th>
                            </thead>
                            <tbody v-if="filteredInvoices.length > 0">
                                <tr style="cursor: pointer;" v-for="(invoice,index) in filteredInvoices" :key="invoice.id" :ref="index" @click="selectRow(index)">
                                    <td>{{(currentPage-1)*pageMax + index+1}}</td>
                                    <td>
                                        <div class="row center-all">
                                            <div :class="$i18n.locale=='ar'?'text-left':'text-right'" class="col-xs-4 col-md-4 col-lg-3" style="height:50px">
                                                <div class>
                                                    <Avatar :image="getEmployee(invoice.issuer_employee_id).image" :fullname="getEmployee(invoice.issuer_employee_id).name" :width="50" :height="50" :radius="50" :crop="true" :changeable="false" />
                                                </div>
                                            </div>
                                            <div :class="$i18n.locale=='ar'?'text-right':'text-left'" class="col-xs-8 col-md-8 col-lg-9 trim-text">
                                                <span v-if="invoice.issuer_employee_id != 1">{{getEmployee(invoice.issuer_employee_id).name}}</span>
                                                <span v-else>{{$t("a_admin")}}</span>
                                                <br>
                                                <span v-if="invoice.issuer_employee_id != 1" class="text-info">
                                                    <small dir="ltr">{{getEmployee(invoice.issuer_employee_id).phone}}</small>
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="row center-all">
                                            <div :class="$i18n.locale=='ar'?'text-left':'text-right'" class="col-xs-3" style="width:65px;height:50px">
                                                <div class>
                                                    <Avatar :image="getCustomer(invoice.supplier_id).image" :fullname="getCustomer(invoice.supplier_id).name" :width="50" :height="50" :radius="50" :crop="true" :changeable="false" />
                                                </div>
                                            </div>
                                            <div :class="$i18n.locale=='ar'?'text-right':'text-left'" class="col-xs-9 trim-text">
                                                <span v-if="invoice.supplier_id != 1">{{getCustomer(invoice.supplier_id).name}}</span>
                                                <span v-else>{{$t("anonymous")}}</span>
                                                <br>
                                                <span class="text-info">
                                                    <small dir="ltr">{{getCustomer(invoice.supplier_id).phone}}</small>
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td align="center">{{invoice.date.substring(0, 10)}}</td>
                                    <td align="center">{{getInvoiceQte(invoice)}}</td>
                                    <td dir="ltr" align="center">{{getInvoiceTotal(invoice) | currency}}</td>
                                    <td :class="$i18n.locale=='ar'?'text-left':'text-right'">
                                        <button @click="editInvoice(invoice.id)" class="btn btn-default btn-icon">
                                            <i class="mdi mdi-pencil-outline"></i>
                                        </button>
                                        <button v-if="invoice.id != 1 && invoiceStocksModified(invoice)" @click="deleteInvoice(index,invoice.id)" class="btn btn-danger btn-icon">
                                            <i class="mdi mdi-trash-can-outline"></i>
                                        </button>
                                        <!-- <v-menu attach solo @click.prevent.stop="()=>{}" offset-y>
                                            <template v-slot:activator="{ on }">
                                                <v-btn icon class="icon-44" v-on="on">
                                                    <v-icon>more_vert</v-icon>
                                                </v-btn>
                                            </template>
                                            <v-list>

                                                <v-list-tile @click.stop="editInvoice(invoice.id)">
                                                    <v-list-tile-action>
                                                        <v-icon>mdi-pencil-outline</v-icon>
                                                    </v-list-tile-action>

                                                    <v-list-tile-content>
                                                        <v-list-tile-title>{{$t("edit_invoice")}}</v-list-tile-title>
                                                        <v-list-tile-sub-title>(Ctrl+E)</v-list-tile-sub-title>
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                                <v-list-tile v-if="invoice.id != 1 && invoiceStocksModified(invoice)" @click.stop="deleteInvoice(index,invoice.id)">
                                                    <v-list-tile-action>
                                                        <v-icon color="error">mdi-trash-can-outline</v-icon>
                                                    </v-list-tile-action>

                                                    <v-list-tile-content>
                                                        <v-list-tile-title>{{$t("delete_invoice")}}</v-list-tile-title>
                                                    </v-list-tile-content>
                                                </v-list-tile>
                                            </v-list>
                                        </v-menu> -->
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-if="invoices.length > pageMax && filteredInvoices.length > 0" class="row text-center">
                            <nav aria-label="Search results pages">
                                <v-pagination v-model="currentPage" :page-count="pageCount" :classes="bootstrapPaginationClasses" :labels="customLabels"></v-pagination>
                            </nav>
                        </div>
                    </div>
                    <div style="padding: 50px;" class="row text-center" v-if="filteredInvoices.length == 0">
                        <i style="font-size:80px;color:gray" class="ti-filter"></i>
                        <h3>{{$t("no_invoices_found")}}</h3>
                        <p style="margin-bottom:50px" class="category" @click="searchText=''" v-if="invoices.length > 0">{{$t("clear_to_see_invoices")}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import vPagination from "vue-plain-pagination";
import Avatar from "./sub_components/Avatar.vue";
import {
    Notification
} from "electron";
import {
    Invoice
} from "./models.js";
const {
    dialog
} = require("electron").remote;
import DatePicker from "vue2-datepicker";
import {
    getStartYearDate,
    getStartMonthDate
} from "./utils.js";
export default {
    name: "Invoices",
    components: {
        vPagination,
        DatePicker,
        Avatar
    },
    created() {
        this.invoices = JSON.parse(JSON.stringify(store.getters.invoices));
        let stocks = JSON.parse(JSON.stringify(store.getters.allStocks));
        this.currency = JSON.parse(JSON.stringify(store.getters.user.currency));
        console.log(this.invoices);
        console.log("stocks");
        console.log(stocks);
        this.pageCount = Math.ceil(this.invoices.length / this.pageMax);
        this.filterInvoices();
    },

    mounted() {
        /* let myNotification = new Notification('Title', {
                      body: 'Lorem Ipsum Dolor Sit Amet'
                    }) */
    },
    activated() {
        this.customLabels = {
            first: this.$t("first"),
            prev: this.$t("previous"),
            next: this.$t("next"),
            last: this.$t("last")
        };
        this.invoices = JSON.parse(JSON.stringify(store.getters.invoices));
        this.pageCount = Math.ceil(this.invoices.length / this.pageMax);
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
        this.customLabels = {
            first: this.$t("first"),
            prev: this.$t("previous"),
            next: this.$t("next"),
            last: this.$t("last")
        };
        this.turnListeners(true);
        this.filterInvoices();
    },
    deactivated() {
        $("tr").removeClass("animated");
        $("tr").removeClass("pulse");
        $("tr").removeClass("fadeOutLeft");
        this.turnListeners(false);
    },
    data() {
        return {
            currentPage: 1,
            currency: "",
            pageMax: 7.0,
            currentCount: 0,
            invoices: [],
            filteredInvoices: [],
            searchText: "",
            selected_id: -1,
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
            },

            daterange: "",
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
                },
                {
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
            ]
        };
    },
    methods: {
        getStock(id) {
            return store.getters.getStock(id);
        },
        getEmployee(id) {
            return store.getters.getEmployee(id, true);
        },
        getCustomer(id) {
            return store.getters.getCustomer(id, true);
        },
        getInvoiceTotal(invoice) {
            let invoice_stocks = store.getters.getInvoiceStocks(invoice.id);
            console.log("invoice_stocks");
            console.log(invoice_stocks);
            return _.reduce(
                invoice_stocks,
                (sum, item) => {
                    return sum + item.buy_price * item.total_qte;
                },
                0
            );
        },
        getInvoiceQte(invoice) {
            return store.getters.getInvoiceStocks(invoice.id).length;
        },
        openInvoice(id) {
            console.log(store.getters.getInvoice(id));
        },
        addInvoice() {
            this.$router.push("/add-invoice");
        },
        editInvoice(id) {

            $("tr").removeClass("animated pulse");
            setTimeout(() => {
                $(this.$refs[id]).addClass("animated pulse");
                this.$router.push({
                    name: "edit_invoice",
                    params: {
                        id: id
                    }
                });
            }, 250);
        },
        getInvoiceLastOrderDate(id) {
            let lastorder = store.getters.getInvoiceLastOrder(id);
            if (lastorder) {
                return lastorder.date.substring(0, 10);
            } else {
                return '<i class="material-icons">remove_shopping_cart</i>';
            }
        },
        rangeCleared() {
            this.filterInvoices(true);
        },
        filterInvoices(resetCurrentPage = false) {
            let filtered_by_date = _.filter(this.invoices, invoice => {
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
                        new Date(invoice.date).getTime() >= sdate.getTime() &&
                        new Date(invoice.date).getTime() <= edate.getTime()
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                }
            });
            let filteredC = _.filter(filtered_by_date, c => {
                if (this.searchText.trim() == "") {
                    return true;
                } else {
                    if (
                        this.getCustomer(c.supplier_id).name
                        .toLowerCase()
                        .search(this.searchText.trim().toLowerCase()) != -1 ||
                        this.getCustomer(c.supplier_id).phone.search(this.searchText.trim()) != -1
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
            if (this.invoices.length > 0) {
                this.filteredInvoices = _.slice(
                    filteredC,
                    this.pageMax * (this.currentPage - 1),
                    this.pageMax * (this.currentPage - 1) + this.pageMax
                );
            } else {
                this.filteredInvoices = [];
            }
            this.pageCount = Math.ceil(filteredC.length / this.pageMax);
            console.log("this.filteredInvoices")
            console.log(this.filteredInvoices)
        },
        invoiceStocksModified(invoice) {
            let invoice_stocks = store.getters.getInvoiceStocks(invoice.id);
            return _.every(invoice_stocks, (stock) => {
                if (stock.available_qte != stock.total_qte) {
                    return false;
                } else {
                    return true;
                }
            });
        },
        turnListeners(on) {
            if (on) {
                this.$eventBus.$on("barcode", bcode => {
                    let product = this.getProductFromBarCode(bcode);
                    if (product) {
                        this.searchText = product.barcode;
                    } else {
                        swal({
                            title: this.$t("Product not found!"),
                            text: this.$t("do_you_wanna_create_product"),
                            icon: "question",
                            buttons: [this.$t("no"), this.$t("yes")],
                            dangerMode: false
                        }).then(create => {
                            if (create) {
                                this.$router.push({
                                    path: "/new-product",
                                    query: {
                                        barcode: bcode
                                    }
                                });
                            }
                        });
                    }
                });

                this.$eventBus.$on("del", (arg) => {
                    if (this.getSelectedId() || this.getSelectedId() == 0) {

                        this.deleteInvoice(this.getSelectedId(), this.filteredInvoices[this.getSelectedId()].id);
                    }
                });
                this.$eventBus.$on("cmd_del", (arg) => {
                    if (this.getSelectedId() || this.getSelectedId() == 0) {
                        this.deleteInvoice(this.getSelectedId(), this.filteredInvoices[this.getSelectedId()].id, true);
                    }
                });

                this.$eventBus.$on("up", (arg) => {

                    this.selectBeforeRow(this.getSelectedId(), true);

                });
                this.$eventBus.$on("down", (arg) => {

                    this.selectAfterRow(this.getSelectedId(), true);

                });
                this.$eventBus.$on("add", (arg) => {

                    this.addInvoice();

                });
                this.$eventBus.$on("edit", (arg) => {
                    if (this.getSelectedId() || this.getSelectedId() == 0) {
                        this.editInvoice(this.filteredInvoices[this.getSelectedId()].id);
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
                this.selected_id = -1;
            }
        },
        selectAfterRow(id) {
            if (this.$refs[parseInt(id) + 1] && this.filteredInvoices.length > parseInt(id) + 1) {
                this.selected_id = parseInt(id) + 1;
                $("tr").removeClass("selected");
                $(this.$refs[this.selected_id]).addClass("selected");

            } else if (this.filteredInvoices.length > 0) {
                if (this.selected_id != -1) {
                    if (this.currentPage < this.pageCount) {
                        this.currentPage++;
                    } else {
                        this.selected_id = 0;
                        this.selectRow(this.selected_id);
                    }
                } else {
                    console.log("this.selected_id");
                    console.log(this.selected_id);
                    this.selected_id = 0;
                    this.selectRow(this.selected_id);
                }

            }

        },
        selectBeforeRow(id, is_keyboard = false) {
            if (this.$refs[parseInt(id) - 1] && this.filteredInvoices.length > parseInt(id) - 1) {
                this.selected_id = parseInt(id) - 1;
                $("tr").removeClass("selected");
                $(this.$refs[this.selected_id]).addClass("selected");

            } else if (this.filteredInvoices.length > 0) {
                if (this.currentPage > 1) {
                    if (is_keyboard) {
                        this.currentPage--;
                    } else {
                        this.selected_id = this.filteredInvoices.length - 1;
                        this.selectRow(this.selected_id);
                    }
                }
                //this.currentPage--;
                //    } else {

            }

        },
        deleteInvoice(index, id, force = false) {
            let invoice_stocks = store.getters.getInvoiceStocks(id);
            let not_modified = _.every(invoice_stocks, (stock) => {
                if (stock.available_qte != stock.total_qte) {
                    return false;
                } else {
                    return true;
                }
            });
            if (force) {
                if (not_modified) {
                    $(this.$refs[id]).addClass("animated fadeOutLeft");
                    setTimeout(() => {
                        store.dispatch("deleteInvoice", id);
                        _.forEach(invoice_stocks, (stock) => {
                            store.dispatch("deleteStock", stock.id);
                        });
                        // to refrech Vue
                        this.invoices = JSON.parse(JSON.stringify(store.getters.invoices));
                        if (this.filteredInvoices.length == 1) {
                            this.currentPage =
                                this.currentPage != 0 ? this.currentPage - 1 : 1;
                        }
                        this.filterInvoices();

                    }, 350);
                } else {
                    swal({
                        title: this.$t("not_allowed"),
                        text: this.$t("you_cant_delete_invoice_after_used"),
                        icon: "error",
                        buttons: {
                            cancel: false,
                            confirm: true
                        }
                    });
                }
            } else {
                if (not_modified) {
                    swal({
                        title: this.$t("delete_invoice_confirm"),
                        text: this.$t("all_invoice_stocks_will_removed"),
                        buttons: [this.$t("no"), this.$t("yes")],
                        icon: "warning",

                        dangerMode: true
                    }).then(willDelete => {
                        if (willDelete) {
                            $(this.$refs[id]).addClass("animated fadeOutLeft");

                            setTimeout(() => {
                                store.dispatch("deleteInvoice", id);
                                _.forEach(invoice_stocks, (stock) => {
                                    store.dispatch("deleteStock", stock.id);
                                });
                                // to refrech Vue
                                this.invoices = JSON.parse(JSON.stringify(store.getters.invoices));
                                if (this.filteredInvoices.length == 1) {
                                    this.currentPage =
                                        this.currentPage != 0 ? this.currentPage - 1 : 1;
                                }
                                this.filterInvoices();

                            }, 500);
                        } else {
                            //swal("Your imaginary file is safe!");
                        }
                    });
                } else {
                    swal({
                        title: this.$t("not_allowed"),
                        text: this.$t("you_cant_delete_invoice_after_used"),
                        icon: "error",
                        buttons: {
                            cancel: false,
                            confirm: true
                        }
                    });
                }
            }

        },
        isNotEmpty(str) {
            if (str != null && str != "") {
                return true;
            }
            return false;
        }
    },
    watch: {
        currentPage: function (val, oldVal) {
            this.filterInvoices();
            if (parseInt(val) > parseInt(oldVal)) {
                console.log("next")
                setTimeout(() => {
                    this.selectRow(0);
                }, 10)
            } else {
                console.log("prev")
                setTimeout(() => {
                    this.selectRow(this.filteredProducts.length - 1);
                }, 0)
            }
        },
        searchText() {
            setTimeout(() => {
                this.filterInvoices(true);
            }, 250);
        }
    }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.pagination>li>a {
    cursor: pointer;
}

th {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-size: 16px;
    font-weight: 400;
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
    /*   binvoice: 10px solid white;
    binvoice-radius: 25px;*/
    /* padding: 9px; */
}

.trim-text {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
    height: 50px;
    font-size: 20px;
    font-family: inherit;
    padding-left: 50px;
    text-overflow: ellipsis;
    padding-right: 50px;
    margin-top: 1px;
    margin-right: 20px;

}

.inlineFilter {
    display: inline;
    color: #b7b7b7;
    ;
    font-size: 25px;
    cursor: pointer;
    z-index: 2;
}

.wrapper::-webkit-scrollbar {
    width: 0em;
}

th {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-size: 17px;
    font-weight: 500;
}

/*.page-item::after,.page-item::before {
    box-sizing: binvoice-box;
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
    binvoice: 1px solid #dee2e6;
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
