<template>
<div ref="mainPanel" class="main-panel" :style="{'float':$i18n.locale=='ar' ? 'left':'right'}">
    <nav class="navbar navbar-default">
        <div class="nav-container">
            <div class="navbar-header" style="width:20%;display: inline-flex;">
                <button type="button" class="navbar-toggle">
                    <span class="sr-only">{{ $t("toggle_nav") }}</span>
                    <span class="icon-bar bar1"></span>
                    <span class="icon-bar bar2"></span>
                    <span class="icon-bar bar3"></span>
                </button>
                <a class="navbar-brand">{{$t("products")}}</a>
            </div>

            <ul class="nav navbar-nav " :class="$i18n.locale=='ar'?'text-left':'text-right'" style="width:100%">
                <li style="width:100%">

                    <input type="text" v-model="searchText" class="text-center search" name="search" ref="search" id="search" :placeholder="$t('filter_by_name_codebar')">
                    <span :class="$i18n.locale=='ar'?'icon-left':'icon-right'">
                        <font-awesome-icon @click="$refs.search.focus()" class="inlineFilter" color="gray" icon="search" />
                    </span>
                </li>
            </ul>

            <ul class="nav navbar-nav navbar-right" style="margin-right: 0px">
                <li v-tooltip="{
                      content: 'Add product',
                      delay: {
                        show: 750,
                        hide: 10,
                      },
                    }">
                    <a class="btn btn-circle" @click="addProduct">
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
                    <!--  <div class="header">
                                <div class="row">
                                    <div class="col-md-6">
                                        <h4 class="title" >List of products</h4>
                                    </div>
                                  
                                </div>
                            
            </div>-->
                    <div class="content table-responsive table-full-width">
                        <table class="table table-hover">
                            <thead>
                                <th :class="$i18n.locale=='ar'?'onhoverRTL text-right':'onhoverLTR text-left'" width="4%">{{$t("n")}}</th>
                                <th :class="$i18n.locale=='ar'?'onhoverRTL text-right':'onhoverLTR text-left'" width="20%">{{ $t("name") }}<i @click="orderTable('name',$event)" class="mdi mdi-sort"></i>
                                </th>
                                <th class="text-center " :class="$i18n.locale=='ar'?'onhoverRTL':'onhoverLTR'" width="10%">{{$t("category")}}<i @click="orderTable('category',$event)" class="mdi mdi-sort"></i>
                                </th>
                                <th class="text-center " :class="$i18n.locale=='ar'?'onhoverRTL':'onhoverLTR'" width="15%">{{$t("buy_price")}}<i @click="orderTable('buy_price',$event)" class="mdi mdi-sort"></i>
                                </th>
                                <th class="text-center " :class="$i18n.locale=='ar'?'onhoverRTL':'onhoverLTR'" width="15%">{{$t("sell_price")}}<i @click="orderTable('sell_price',$event)" class="mdi mdi-sort"></i>
                                </th>
                                <th class="text-center " :class="$i18n.locale=='ar'?'onhoverRTL':'onhoverLTR'" width="13%">{{$t("available")}}<i @click="orderTable('available',$event)" class="mdi mdi-sort"></i>
                                </th>
                                <th :class="$i18n.locale=='ar'?'text-left':'text-right'" width="15%">{{ $t("actions") }}</th>
                            </thead>
                            <tbody v-if="filteredProducts.length > 0">
                                <tr style="cursor: pointer;" v-for="(product,index) in filteredProducts" :ref="index" :key="product.id" @click="selectRow(index,$event)">
                                    <td>{{(currentPage-1)*pageMax + index+1}}</td>
                                    <td>
                                        <div class="row center-all" style="min-width:13vw">
                                            <div :class="$i18n.locale=='ar'?'text-left':'text-right'" class="col-xs-3" style="width:65px">
                                                <div class>
                                                    <Avatar :image="product.image" :fullname="product.name" :width="50" :height="50" :radius="7" :crop="true" :changeable="false" />
                                                </div>
                                            </div>
                                            <div :class="$i18n.locale=='ar'?'text-right':'text-left'" class="col-xs-6 trim-text">{{product.name}}</div>
                                        </div>
                                    </td>
                                    <td class="text-center">
                                        <div style="max-height: 80px;overflow-y: auto;">{{$t(product.category)}}</div>
                                    </td>
                                    <td class="text-center">{{product.buy_price}} {{$t(currency.toLowerCase())}}</td>
                                    <td class="text-center">{{product.sell_price}} {{$t(currency.toLowerCase())}}</td>
                                    <td class="text-center">{{product.available}} {{$t(product.unit.toLowerCase()).toUpperCase()}} <span class="" style="display: -webkit-inline-box;background-color:#eee; font-size:16px">{{getProductQteDesc(product)}}</span></td>
                                    <td :class="$i18n.locale=='ar'?'text-left':'text-right'">
                                       <v-badge color="error lighten-2" left>
                                                        <template v-if="product.hasNotifications" v-slot:badge>
                                                            <v-icon >
                                                               mdi-dot
                                                            </v-icon>
                                                        </template>
                                        <button v-tooltip="{
                                  content: $t('edit_stock'),
                                  delay: {
                                    show: 750,
                                    hide: 10,
                                  },
                                }" @click="openProductStock(product.id)" class="btn btn-default btn-icon fs23">
                                            <i color="gray" class=" flaticon-warehouse"></i>
                                        </button>
                                       </v-badge>
                                        <button v-tooltip="{
                                  content: $t('a_edit_product'),
                                  delay: {
                                    show: 750,
                                    hide: 10,
                                  },
                                }" @click="editProduct(product.id)" class="btn btn-default btn-icon fs23">
                                            <i class="mdi mdi-pencil-outline"></i>
                                        </button>
                                        <button v-tooltip="{
                                  content: $t('delete_product'),
                                  delay: {
                                    show: 750,
                                    hide: 10,
                                  },
                                }" @click="deleteProduct(index,product.id)" class="btn btn-danger btn-icon fs23">
                                            <i class="mdi mdi-trash-can-outline"></i>
                                        </button>
                                         <!-- <v-badge color="error lighten-2" left>
                                                        <template v-if="product.hasNotifications" v-slot:badge>
                                                            <v-icon >
                                                                notifications
                                                            </v-icon>
                                                        </template>
                                                        <v-btn icon class="icon-44" @click.stop="openProductStock(product.id,$event)">
                                                            <i color="gray" class="fs28 flaticon-warehouse"></i>
                                                        </v-btn>
                                                    </v-badge> -->
                                        <!-- <div class="row">
                                            <div class="col-md-4">

                                            </div>
                                            <div class="col-md-4">
                                                <div class="text-xs-center">
                                                    <v-badge color="error lighten-2" left>
                                                        <template v-if="product.hasNotifications" v-slot:badge>
                                                            <v-icon >
                                                                notifications
                                                            </v-icon>
                                                        </template>
                                                        <v-btn icon class="icon-44" @click.stop="openProductStock(product.id,$event)">
                                                            <i color="gray" class="fs28 flaticon-warehouse"></i>
                                                        </v-btn>
                                                    </v-badge>
                                                </div>

                                            </div>

                                            <div class="col-md-4">
                                                <v-menu attach solo @click.stop="()=>{}" offset-y>
                                                    <template v-slot:activator="{ on }">
                                                        <v-btn icon class="icon-44" v-on="on">
                                                            <v-icon>mdi-dots-vertical</v-icon>
                                                        </v-btn>
                                                    </template>
                                                    <v-list>

                                                        <v-list-tile @click.stop="editProduct(product.id,$event)">
                                                            <v-list-tile-action>
                                                                <v-icon>mdi-pencil-outline</v-icon>
                                                            </v-list-tile-action>

                                                            <v-list-tile-content>
                                                                <v-list-tile-title>{{$t("a_edit_product")}}</v-list-tile-title>
                                                                <v-list-tile-sub-title>(Ctrl+E)</v-list-tile-sub-title>
                                                            </v-list-tile-content>
                                                        </v-list-tile>

                                                        <v-list-tile @click.stop="deleteProduct(index,product.id)">
                                                            <v-list-tile-action>
                                                                <v-icon color="error">mdi-trash-can-outline</v-icon>
                                                            </v-list-tile-action>

                                                            <v-list-tile-content>
                                                                <v-list-tile-title>{{$t("delete_product")}}</v-list-tile-title>
                                                            </v-list-tile-content>
                                                        </v-list-tile>
                                                    </v-list>
                                                </v-menu>

                                            </div>

                                        </div> -->

                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-if="products.length > pageMax && filteredProducts.length > 0" class="row text-center">
                            <nav aria-label="Search results pages">
                                <v-pagination v-model="currentPage" :page-count="pageCount" :classes="bootstrapPaginationClasses" :labels="customLabels"></v-pagination>
                            </nav>
                        </div>
                    </div>
                    <div style="padding: 50px;" class="row text-center" v-if="filteredProducts.length == 0">

                        <i style="font-size:80px;color:gray" class="ti-filter"></i>
                        <h3>{{$t("no_products_found")}}</h3>
                        <p style="margin-bottom:50px" class="category" @click="searchText=''" v-if="products.length > 0">{{$t("clear_to_see_products")}}</p>
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
    Product
} from "./models.js";

var {
    ipcRenderer,
    remote
} = require("electron");
const {
    dialog
} = require("electron").remote;

export default {
    name: "products",
    components: {
        vPagination,
        Avatar
    },
    created() {
        // console.log("created");
        // this.products = JSON.parse(JSON.stringify(store.getters.products));
        // _.map(this.products, p => {
        //     p.available = this.getProductAvailableQte(p);
        //     p.sell_price = this.getProductSellPrice(p.id);
        //     p.buy_price = this.getProductBuyPrice(p.id);
        // });
        this.currency = store.getters.user.currency ?
            store.getters.user.currency :
            "DZD";

        this.preferences = JSON.parse(JSON.stringify(store.getters.preferences));

        //  this.filterProducts();
    },
    activated() {
        console.log("activated");
        this.products = JSON.parse(JSON.stringify(store.getters.products));
        console.log(this.products);
        _.map(this.products, p => {
            p.available = this.getProductAvailableQte(p);
            p.sell_price = this.getProductSellPrice(p.id);
            p.buy_price = this.getProductBuyPrice(p.id);
            p.hasNotifications = this.hasNotifications(p);
            return p;
        });
        this.filterProducts();
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
            currentPage: 1,
            pageMax: 7.0,
            currentCount: 0,
            products: [],
            order_list: [],
            order_list_dir: [],
            product_name_asc: false,
            product_category_asc: false,
            product_buy_price_asc: false,
            product_sell_price_asc: false,
            product_available_asc: false,
            preferences: {},
            filteredProducts: [],
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
        hasNotifications(product) {
            //how wto get notifications ??????? 
            //expiration date
            let stocks = store.getters.getStocks(product.id);
            let exp_date_alert = false;
            let stock_end_alert = false;

            if (stocks) {
                _.forEach(stocks, (stock) => {
                    if (moment(stock.exp_date).isValid()) {

                        if ((moment(stock.exp_date).subtract(parseInt(product.exp_date_pre_alert), "days")).isSameOrBefore(moment(), 'day')) {

                            exp_date_alert = true
                        }

                    }
                    console.log("stock.available_qte-parseInt(product.stock_pre_alert)");
                    console.log(stock.available_qte - parseInt(product.stock_pre_alert));
                    if (stock.available_qte - parseInt(product.stock_pre_alert) <= 0) {
                        stock_end_alert = true
                    }
                })
            }

            return exp_date_alert || stock_end_alert;

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

                        this.deleteProduct(this.getSelectedId(), this.filteredProducts[this.getSelectedId()].id);
                    }
                });
                this.$eventBus.$on("cmd_del", (arg) => {
                    if (this.getSelectedId() || this.getSelectedId() == 0) {
                        this.deleteProduct(this.getSelectedId(), this.filteredProducts[this.getSelectedId()].id, true);
                    }
                });

                this.$eventBus.$on("up", (arg) => {

                    this.selectBeforeRow(this.getSelectedId(), true);

                });
                this.$eventBus.$on("down", (arg) => {

                    this.selectAfterRow(this.getSelectedId(), true);

                });
                this.$eventBus.$on("add", (arg) => {

                    this.addProduct();

                });
                this.$eventBus.$on("edit", (arg) => {
                    if (this.getSelectedId()) {
                        this.editProduct(this.filteredProducts[this.getSelectedId()].id);
                    }
                });
                this.$eventBus.$on("s", (arg) => {
                    if (this.getSelectedId() || this.getSelectedId()==0) {
                        this.openProductStock(this.filteredProducts[this.getSelectedId()].id);
                    }
                });
            } else {
                this.$eventBus.$off("barcode");
                this.$eventBus.$off("del");
                this.$eventBus.$off("cmd_del");
                this.$eventBus.$off("up");
                this.$eventBus.$off("down");
                this.$eventBus.$off("add");
                this.$eventBus.$off("edit");
                this.$eventBus.$off("s");
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
            if (this.$refs[parseInt(id) + 1] && this.filteredProducts.length > parseInt(id) + 1) {
                this.selected_id = parseInt(id) + 1;
                $("tr").removeClass("selected");
                $(this.$refs[this.selected_id]).addClass("selected");

            } else if (this.filteredProducts.length > 0) {
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
            if (this.$refs[parseInt(id) - 1] && this.filteredProducts.length > parseInt(id) - 1) {
                this.selected_id = parseInt(id) - 1;
                $("tr").removeClass("selected");
                $(this.$refs[this.selected_id]).addClass("selected");

            } else if (this.filteredProducts.length > 0) {
                if (this.currentPage > 1) {
                    if (is_keyboard) {
                        this.currentPage--;
                    } else {
                        this.selected_id = this.filteredProducts.length - 1;
                        this.selectRow(this.selected_id);
                    }
                }
                //this.currentPage--;
                //    } else {

            }

        },
        getProductQteDesc(product) {
            if (product.is_bulk_sell && product.available > 0) {
                let eu = product.available % product.packing
                let boxs = (product.available - eu) / product.packing

                return _.join(["(", boxs + " ", boxs > 1 ? this.$t("packs") : this.$t("pack"), eu ? '+' + eu + " " + (product.unit == 'piece' ? this.$t("pieces") : this.$t(product.unit.toLowerCase())) : "", ") "], '')
            } else {
                return ""
            }

        },
        getProductFromBarCode(bcode) {
            let product = _.find(this.products, {
                barcode: bcode
            });
            if (product) {
                return product;
            }
            return null;
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
                        case "name":
                            this.product_name_asc = !this.product_name_asc;
                            this.order_list_dir.push(this.product_name_asc ? "asc" : "desc");
                            break;
                        case "category":
                            this.product_category_asc = !this.product_category_asc;
                            this.order_list_dir.push(
                                this.product_category_asc ? "asc" : "desc"
                            );
                            break;
                        case "buy_price":
                            this.product_buy_price_asc = !this.product_buy_price_asc;
                            this.order_list_dir.push(
                                this.product_buy_price_asc ? "asc" : "desc"
                            );
                            break;
                        case "sell_price":
                            this.product_sell_price_asc = !this.product_sell_price_asc;
                            this.order_list_dir.push(
                                this.product_sell_price_asc ? "asc" : "desc"
                            );
                            break;
                        case "available":
                            this.product_available_asc = !this.product_available_asc;
                            this.order_list_dir.push(
                                this.product_available_asc ? "asc" : "desc"
                            );
                            break;
                    }
                });
            }

            console.log("hocked");
            this.products = _.orderBy(
                this.products,
                this.order_list,
                this.order_list_dir
            );
            this.filterProducts();
            if (event) {
                $(event.target).toggleClass("rotate180");
            }
        },
        getProductBuyPrice(id) {
            let stocks = JSON.parse(
                JSON.stringify(store.getters.getStocks(id, true))
            );
            if (stocks.length > 0) {
                return stocks[0].buy_price;
            }
            return 0.0;
        },
        getProductSellPrice(id) {
            let stocks = JSON.parse(
                JSON.stringify(store.getters.getStocks(id, true))
            );
            if (stocks.length > 0) {
                return stocks[0].sell_price;
            }
            return 0.0;
        },
        getProductAvailableQte(product) {
            let stocks = JSON.parse(
                JSON.stringify(store.getters.getStocks(product.id))
            );
            let available_qte = _.reduce(
                stocks,
                function (sum, s) {
                    return sum + s.available_qte;
                },
                0
            );
            if (product.unit == "piece") {
                return parseInt(available_qte);
            } else {
                return parseFloat(available_qte).toFixed(2);
            }
        },
        openProductStock(id) {
            $("tr").removeClass("animated pulse");
            setTimeout(() => {
              //  $(this.$refs[id]).addClass("animated pulse");
                this.$router.push({
                    name: "product_stock",
                    params: {
                        id: id
                    }
                });
            }, 250);
        },
        zoomImage(path) {
            // todo
        },
        isNotEmpty(str) {
            if (str != null && str != "") {
                return true;
            }
            return false;
        },
        addProduct() {
            this.$router.push("/new-product");
        },

        editProduct(id, event) {

            // $("tr").removeClass("animated pulse");
            // setTimeout(() => {
            //     $(this.$refs[id]).addClass("animated pulse");
            // }, 0);
            setTimeout(() => {
                this.$router.push({
                    name: "edit_product",
                    params: {
                        id: id
                    }
                });
            }, 0);
        },

        filterProducts(resetCurrentPage = false) {
            let filteredP = _.filter(this.products, p => {
                if (this.searchText == "") {
                    return true;
                } else {
                    if (
                        p.name.toLowerCase().search(this.searchText.toLowerCase()) != -1 ||
                        p.barcode.toLowerCase().search(this.searchText.toLowerCase()) != -1
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
            if (this.products.length > 0) {
                this.filteredProducts = _.slice(
                    filteredP,
                    this.pageMax * (this.currentPage - 1),
                    this.pageMax * (this.currentPage - 1) + this.pageMax
                );
            } else {
                this.filteredProducts = [];
            }
            this.pageCount = Math.ceil(filteredP.length / this.pageMax);
        },
        deleteProduct(index, id, force = false) {

            // animate the product row

            //event.stopPropagation();
            if (force) {
                $(this.$refs[index]).addClass("animated fadeOutLeft");
                setTimeout(() => {
                    _.debounce(() => {
                        _.remove(this.products, {
                            id: id
                        });
                        store.dispatch("deleteProduct", id);

                        if (this.filteredProducts.length == 1) {
                            this.currentPage =
                                this.currentPage != 0 ? this.currentPage - 1 : 1;
                        }
                        this.filterProducts();
                        this.selectBeforeRow(this.getSelectedId())
                    }, 50)()
                }, 350);
            } else {
                swal({
                    title: this.$t("delete_product_confirm"),
                    text: "",
                    icon: "warning",

                    buttons: [this.$t("no"), this.$t("yes")],
                    dangerMode: true
                }).then(willDelete => {
                    if (willDelete) {
                        $(this.$refs[index]).addClass("animated fadeOutLeft");

                        setTimeout(() => {
                            _.remove(this.products, {
                                id: id
                            });
                            store.dispatch("deleteProduct", id);

                            if (this.filteredProducts.length == 1) {
                                this.currentPage =
                                    this.currentPage != 0 ? this.currentPage - 1 : 1;
                            }
                            this.filterProducts();
                        }, 370);
                    }
                });
            }

        }
    },
    watch: {
        preferences: {
            handler(val) {
                store.dispatch("preferences", this.preferences);
            },
            deep: true
        },
        currentPage: function (val, oldVal) {
            this.filterProducts();
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
                this.filterProducts(true);
            }, 250);
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

/* .list-enter,
.list-leave-to .main-panel {
  padding: 9px;
} */

.main-panel {
    /*   border: 10px solid white;
    border-radius: 25px;*/
 //   padding: 9px;
}

th {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-size: 16px;
    font-weight: 400;
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

.rotate180 {
    transform: scaleY(-1);
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

.selected {
    background-color: rgb(236, 236, 236);
}
</style>
