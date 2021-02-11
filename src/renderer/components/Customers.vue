<template>
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
                <a class="navbar-brand">{{ $t("customers") }}</a>
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
                    <a class="btn btn-circle" @click="addCustomer">
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
                                    <h4 class="title" >List of customers</h4>
                                </div>
                              
                            </div>
            </div>-->
                    <div class="content table-responsive table-full-width">
                        <table class="table table-hover">
                            <thead>
                                <th width="4%">{{ $t("id") }}</th>
                                <th :class="$i18n.locale=='ar'?'text-right':'text-left'" width="25%">{{ $t("name") }}</th>
                                <th class="text-center">{{ $t("discount") }} (%)</th>
                                <th class="text-center">{{ $t("joined_date") }}</th>
                                <th class="text-center">{{ $t("last_order") }}</th>
                                <th :class="$i18n.locale=='ar'?'text-left':'text-right'">{{ $t("actions") }}</th>
                            </thead>
                            <tbody v-if="filteredCustomers.length > 0">
                                <tr style="cursor: pointer;" v-for="(customer,index) in filteredCustomers" :ref="index" :key="customer.id" @click="selectRow(index)">
                                    <td>{{index+1+((currentPage-1)*pageMax)}}</td>
                                    <td>
                                        <div class="row center-all">
                                            <div :class="$i18n.locale=='ar'?'text-left':'text-right'" class="col-xs-3" style="width:65px;height:50px">
                                                <div class>
                                                    <Avatar :image="customer.image" :fullname="customer.name" :width="50" :height="50" :radius="50" :crop="true" :changeable="false" />
                                                </div>
                                            </div>
                                            <div :class="$i18n.locale=='ar'?'text-right':'text-left'" class="col-xs-9 trim-text">
                                                <span v-if="customer.id != 1">{{customer.name}}</span>
                                                <span v-else>{{$t("anonymous")}}</span>
                                                <br>
                                                <span class="text-info">
                                                    <small dir="ltr">{{customer.phone}}</small>
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td align="center">{{customer.discount}}</td>
                                    <td align="center">{{customer.date.substring(0, 10)}}</td>
                                    <td align="center">
                                        <div v-html="getCustomerLastOrderDate(customer.id)"></div>
                                    </td>
                                    <td :class="$i18n.locale=='ar'?'text-left':'text-right'">
                                        <button @click="editCustomer(customer.id,$event)" class="btn btn-default btn-icon">
                                            <i class="mdi mdi-pencil-outline"></i>
                                        </button>
                                        <button v-if="customer.id != 1" @click="deleteCustomer(index,customer.id)" class="btn btn-danger btn-icon">
                                            <i class="mdi mdi-trash-can-outline"></i>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-if="customers.length > pageMax && filteredCustomers.length > 0" class="row text-center">
                            <nav aria-label="Search results pages">
                                <v-pagination v-model="currentPage" :page-count="pageCount" :classes="bootstrapPaginationClasses" :labels="customLabels"></v-pagination>
                            </nav>
                        </div>
                    </div>
                    <div style="padding: 50px;" class="row text-center" v-if="filteredCustomers.length == 0">
                        <i style="font-size:80px;color:gray" class="ti-filter"></i>
                        <h3>{{$t("no_customers_found")}}</h3>
                        <p style="margin-bottom:50px" class="category" @click="searchText=''" v-if="customers.length > 0">{{$t("clear_to_see_customers")}}</p>
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
    Customer
} from "./models.js";
import {
    setImmediate,
    setTimeout
} from 'timers';

export default {
    name: "Customers",
    components: {
        vPagination,
        Avatar
    },
    created() {
        // this.customers = store.getters.customers;
        // console.log(this.customers)
        // this.pageCount = Math.ceil(this.customers.length / this.pageMax);
        // this.filterCustomers();
    },

    activated() {

        this.customers = store.getters.customers;
        this.pageCount = Math.ceil(this.customers.length / this.pageMax);

        this.filterCustomers();

        console.log(this.customers)

        this.customLabels = {
            first: this.$t("first"),
            prev: this.$t("previous"),
            next: this.$t("next"),
            last: this.$t("last")
        };
        this.turnListeners(true);
    },
    deactivated() {
        $("tr").removeClass("animated");
        $("tr").removeClass("pulse");
        $("tr").removeClass("fadeOutLeft");
        this.turnListeners(false);
    },
    data() {
        return {
            selected_id: -1,
            filteredC: [],
            currentPage: 1,
            pageMax: 7.0,
            currentCount: 0,
            customers: [],
            orders: [],
            filteredCustomers: [],
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
                    console.log("PAPPAPAPAPAAPAP")
                    if (this.getSelectedId() || this.getSelectedId() == 0) {

                        this.deleteCustomer(this.getSelectedId(), this.filteredCustomers[this.getSelectedId()].id);
                    }
                });
                this.$eventBus.$on("cmd_del", (arg) => {
                    if (this.getSelectedId() || this.getSelectedId() == 0) {
                        this.deleteCustomer(this.getSelectedId(), this.filteredCustomers[this.getSelectedId()].id, true);
                    }
                });

                this.$eventBus.$on("up", (arg) => {

                    this.selectBeforeRow(this.getSelectedId(), true);

                });
                this.$eventBus.$on("down", (arg) => {

                    this.selectAfterRow(this.getSelectedId());

                });
                this.$eventBus.$on("add", (arg) => {

                    this.addCustomer();

                });
                this.$eventBus.$on("edit", (arg) => {
                    if (this.getSelectedId()) {
                        this.editCustomer(this.filteredCustomers[this.getSelectedId()].id);
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
            console.log("fireddddddd" + id);
            console.log(this.$refs[id]);
            if (this.$refs[id]) {
                this.selected_id = id;
                $("tr").removeClass("selected");
                $(this.$refs[id]).addClass("selected");
            } else {
                this.selected_id = -1;
            }
        },
        selectAfterRow(id) {
            if (this.$refs[parseInt(id) + 1] && this.filteredCustomers.length > parseInt(id) + 1) {
                this.selected_id = parseInt(id) + 1;
                $("tr").removeClass("selected");
                $(this.$refs[this.selected_id]).addClass("selected");

            } else if (this.filteredCustomers.length > 0) {

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

            if (this.$refs[parseInt(id) - 1] && this.filteredCustomers.length > parseInt(id) - 1) {
                this.selected_id = parseInt(id) - 1;
                $("tr").removeClass("selected");
                $(this.$refs[this.selected_id]).addClass("selected");

            } else if (this.filteredCustomers.length > 0) {

                if (this.currentPage > 1) {
                    if (is_keyboard) {
                        this.currentPage--;
                    } else {
                        this.selected_id = this.filteredCustomers.length - 1;
                        this.selectRow(this.selected_id);
                    }

                }
            }

        },
        openCustomer(id) {
            console.log(store.getters.getCustomer(id));
        },
        addCustomer() {
            this.$router.push("/new-customer");
        },
        editCustomer(id, event) {
            event.stopPropagation();
                           this.$router.push({
                    name: "edit_customer",
                    params: {
                        id: id
                    }
                });
            // $("tr").removeClass("animated pulse");
            // setTimeout(() => {
            //     $(this.$refs[id]).addClass("animated pulse");
            //     this.$router.push({
            //         name: "edit_customer",
            //         params: {
            //             id: id
            //         }
            //     });
            // }, 250);
        },
        getCustomerLastOrderDate(id) {
            let lastorder = store.getters.getCustomerLastOrder(id);
            if (lastorder) {
                return lastorder.date.substring(0, 10);
            } else {
                return '<i class="material-icons">remove_shopping_cart</i>';
            }
        },
        filterCustomers(resetCurrentPage = false) {
            let filteredC = _.filter(this.customers, c => {
                if (this.searchText.trim() == "") {
                    return true;
                } else {
                    if (
                        c.name.toLowerCase().search(this.searchText.trim().toLowerCase()) !=
                        -1 ||
                        c.phone.search(this.searchText.trim()) != -1
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
            if (this.customers.length > 0) {
                this.filteredCustomers = JSON.parse(JSON.stringify(_.slice(
                    filteredC,
                    this.pageMax * (this.currentPage - 1),
                    this.pageMax * (this.currentPage - 1) + this.pageMax
                )));
            } else {
                this.filteredCustomers = [];
            }
            this.pageCount = Math.ceil(filteredC.length / this.pageMax);
        },
        deleteCustomer(index, id, force = false) {

            if (force) {
                $(this.$refs[index]).addClass("animated fadeOutLeft");
                _.remove(this.customers, {
                    id: id
                });

                store.dispatch("deleteCustomer", id);
                setTimeout(() => {
                    // to refrech Vue
                    if (this.filteredCustomers.length == 1) {
                        this.currentPage = this.currentPage != 0 ? this.currentPage - 1 : 1;
                    }
                    this.filterCustomers();
                    this.selectBeforeRow(this.getSelectedId())

                }, 350);
            } else {
                swal({
                    title: this.$t("delete_customer_confirm"),
                    text: "",

                    buttons: [this.$t("no"), this.$t("yes")],
                    icon: "warning",

                    dangerMode: true
                }).then(willDelete => {
                    if (willDelete) {
                        $(this.$refs[index]).addClass("animated fadeOutLeft");
                        _.remove(this.customers, {
                            id: id
                        });
                        store.dispatch("deleteCustomer", id);
                        setTimeout(() => {

                            console.log("this.customers");
                            console.log(this.customers);
                            // to refrech Vue
                            // this.customers = JSON.parse(
                            //     JSON.stringify(store.getters.customers)
                            // );
                            if (this.filteredCustomers.length == 1) {
                                this.currentPage =
                                    this.currentPage != 0 ? this.currentPage - 1 : 1;
                            }
                            this.filterCustomers();
                            this.selectBeforeRow(this.getSelectedId())
                        }, 350);

                    }
                });
            }

        }
    },
    watch: {
        currentPage: function (val, oldVal) {
            this.filterCustomers();

            if (parseInt(val) > parseInt(oldVal)) {
                console.log("next")
                setTimeout(() => {
                    this.selectRow(0);
                }, 10)
            } else {
                console.log("prev")
                setTimeout(() => {
                    this.selectRow(this.filteredCustomers.length - 1);
                }, 0)
            }

        },
        searchText() {
            setTimeout(() => {
                this.filterCustomers(true);
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
    /*   bcustomer: 10px solid white;
    bcustomer-radius: 25px;*/
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
    box-sizing: bcustomer-box;
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
    bcustomer: 1px solid #dee2e6;
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

.selected {
    background-color: rgb(236, 236, 236);
}
</style>
