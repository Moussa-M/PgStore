<template>
  <div class="wrapper">
    <div class="main-panel" :style="{'float':$i18n.locale=='ar' ? 'left':'right'}">
      <nav class="navbar navbar-default">
        <div class="nav-container">
          <div class="navbar-header" style="display: inline-flex;">
            <a class="navbar-brand">{{$t("new_sale")}}</a>
          </div>
          <ul class="nav navbar-nav navbar-right" style="margin-right: 0px">
            <li>
              <a class="btn btn-danger btn-circle" @click="goBack">
                <i class="ti-close"></i>
              </a>
            </li>
          </ul>
          <!-- <ul class="nav nav-tabs">
                          <li class="active"><a data-toggle="tab" href="#home">Product</a></li>
                          <li><a data-toggle="tab" href="#menu1">Customer</a></li>
          </ul>-->
        </div>
      </nav>
      <div class="content">
        <div class="container-fluid">
          <div class>
            <div class="card card-plain" style="margin: 0px">
              <div class="row" style="width:100%">
                <div class="col-md-6">
                  <h4 class="title">{{$t("choose_customer")}}</h4>
                </div>
                <div
                  class="col-md-6"
                  :class="$i18n.locale=='ar'?'text-left':'text-right'"
                  style="padding:0px"
                >
                  <button @click="switchMode" class="btn btn-success">
                    {{$t('fast_sell_mode')}}
                    <font-awesome-icon icon="barcode" size="lg"/>
                  </button>
                </div>
              </div>
              <div class="content">
                <ul
                  @wheel="scrollHor"
                  class="list-unstyled list-inline team-members flex-container"
                >
                  <li v-for="customer in customers" class="card box" :key="customer.id">
                    <CustomerCard
                      :customer="customer"
                      :key="customer.id"
                      v-on:selectCustomer="selectCustomer(customer.id)"
                      :isSelected="isCustomerSelected[customer.id]"
                    />
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
          <div class>
            <div class="card card-plain">
              <div class>
                <div class="row">
                  <div class="col-md-6">
                    <h4 class="title">{{$t("choose_products")}}</h4>
                  </div>
                  <div
                    v-show="products.length > 0"
                    :class="$i18n.locale=='ar'?'text-left':'text-right'"
                    class="col-md-6"
                  >
                    <input
                      type="text"
                      v-model="searchText"
                      class="search"
                      name="search"
                      :placeholder="$t('filter_products')"
                    >
                  </div>
                </div>
              </div>
              <div v-show="products.length > 0" class="content table-responsive table-full-width">
                <table class="table table-hover" style="margin-bottom: 0px">
                  <thead>
                    <th width="5%">{{ $t("n") }}</th>
                    <th
                      :class="$i18n.locale=='ar'?'text-right':'text-left'"
                      width="30%"
                    >{{ $t("name") }}</th>
                    <th class="text-center" width="20%">{{$t("category")}}</th>
                    <th class="text-center" width="10%">{{$t("available")}}</th>

                    <th class="text-center" width="10%">{{$t("u_price")}}</th>
                    <th
                      width="20%"
                      :class="$i18n.locale=='ar'?'text-left':'text-right'"
                    >{{ $t("actions") }}</th>
                  </thead>
                  <tbody>
                    <tr
                      style="cursor: pointer;"
                      v-for="(product , index) in filteredProducts"
                      :key="product.id"
                    >
                      <td
                        :class="$i18n.locale=='ar'?'text-right':'text-left'"
                      >{{index+1+((currentPage-1)*pageMax)}}</td>
                      <td>
                        <div class="row">
                          <div
                            :class="$i18n.locale=='ar'?'text-right':'text-left'"
                            class="col-xs-3"
                            style="width:60px;"
                          >
                            <div class>
                              <Avatar
                                :image="isNotEmpty(product.image)?product.image:'static/assets/img/faces/product.png'"
                                :width="50"
                                :height="50"
                                :radius="7"
                                :crop="true"
                                @click="zoomImage(isNotEmpty(product.image)?product.image:'static/assets/img/faces/product.png')"
                                :changeable="false"
                              />
                            </div>
                          </div>
                          <div
                            :class="$i18n.locale=='ar'?'text-right':'text-left'"
                            class="col-xs-6 trim-text"
                          >{{product.name}}</div>
                        </div>
                      </td>
                      <td class="text-center">{{$t(product.category)}}</td>
                      <td
                        class="text-center"
                      >{{product.initial_qte - product.amount}} {{$t(product.unit.toLowerCase()) }}</td>

                      <td class="text-center">{{product.sell_price}} {{$t(currency.toLowerCase())}}</td>
                      <td
                        :class="$i18n.locale=='ar'?'text-left':'text-right'"
                        style="display: flex;justify-content: flex-end; padding-right: 35px"
                      >
                        <Quantity
                          :disabled="false"
                          :type="product.unit"
                          :max="product.initial_qte"
                          :value="product.amount"
                          v-on:change="updateProductList(product.id,$event)"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="row">
                  <div class="col-xs-6">
                    <div
                      :class="$i18n.locale=='ar'?'text-right':'text-left'"
                      style="padding-right: 15px"
                    >
                      <h5
                        class="category"
                        style="margin: 0px"
                      >{{$t("total")}} : {{total}} {{$t(currency.toLowerCase())}}</h5>
                      <h5
                        class="category"
                        style="margin: 0px"
                      >{{$t("product_discount")}} : {{discount}} {{$t(currency.toLowerCase())}}</h5>

                      <div v-if="is_customer_selected">
                        <h5
                          class="category"
                          style="margin: 0px"
                        >{{$t("customer_discount")}} ({{parseFloat(customer.discount).toFixed(2)}}%) : {{customer_discount}} {{$t(currency.toLowerCase())}}</h5>
                      </div>
                      <h4
                        style="margin: 0px"
                      >{{$t("total_net")}} : {{total_net }} {{$t(currency.toLowerCase())}}</h4>
                    </div>
                  </div>
                  <div class="col-xs-6">
                    <div :class="$i18n.locale=='ar'?'text-left':'text-right'" style="margin: 0px">
                      <nav aria-label="Search results pages">
                        <v-pagination
                          v-model="currentPage"
                          :page-count="pageCount"
                          :classes="bootstrapPaginationClasses"
                          :labels="customLabels"
                        ></v-pagination>
                      </nav>
                    </div>
                    <div class="row" style="padding-top: 50px">
                      <div class="col-md-12">
                        <div :class="$i18n.locale=='ar'?'text-left':'text-right'">
                          <button
                            @click="submitOrder"
                            type="submit"
                            class="btn btn-outline-primar w-50"
                          >
                            <font-awesome-icon icon="clipboard-check"/>
                            {{$t("submit_order")}}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row text-center" v-show="products.length == 0">
                <h5>
                  {{$t("no_products_found")}}
                  <br>
                  {{$t("add_products_to_store")}}
                </h5>
              </div>
            </div>
          </div>
          <div class="tab-content"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import swal from "sweetalert";
import vPagination from "vue-plain-pagination";
import Quantity from "./sub_components/Quantity.vue";
import CustomerCard from "./sub_components/CustomerCard.vue";
import Avatar from "./sub_components/Avatar.vue";
import Vue from "vue";
import { Order } from "./models.js";
const { dialog } = require("electron").remote;
export default {
  name: "NewOrder",
  components: {
    vPagination,

    Quantity,
    CustomerCard,
    Avatar
  },
  created: function() {
    console.log("created");
    let user = window.store.getters.user;
    this.currency = user.currency;
    this.products = JSON.parse(JSON.stringify(store.getters.products));
    this.all_stocks = JSON.parse(JSON.stringify(store.getters.stocks));
    console.log(this.all_stocks);

    this.products = _.map(this.products, p => {
      p.amount = 0;
      var fstock = this.getStocks(p.id)[0];
      p.initial_qte = this.getProductAvailableQte(p.id);

      p.sell_price = fstock ? parseFloat(fstock.sell_price) : 0;
      p.discount = fstock ? parseFloat(fstock.discount) : 0;

      return p;
    });

    this.customers = JSON.parse(JSON.stringify(store.getters.customers));
    this.pageCount = Math.ceil(this.products.length / this.pageMax);
    this.filterProducts();

    $("body").focus();

    this.$eventBus.$on("barcode", bcode => {
      let btype = this.getBarCodeType();
      switch (btype) {
        case "product":
          let bproduct = this.getProductFromBarCode(bcode);
          let added_before = this.isProductAddedBefore(bproduct);
          if (bproduct) {
            if (added_before) {
            } else {
            }
          } else {
            // search the net
          }
          break;
      }
    });
  },

  async activated() {
    console.log("activated");
    await this.$nextTick();
    let last_size = this.customers.length;
    this.customers = JSON.parse(JSON.stringify(store.getters.customers));
    if (this.customers.length > last_size) {
      setTimeout(() => {
        this.selectCustomer(_.last(this.customers).id);
      }, 250);
    }
  },

  data: function() {
    return {
      isCustomerSelected: {},
      is_customer_selected: false,
      is_products_selected: 0,
      currentPage: 1,
      pageMax: 5,
      pageCount: 0,
      currentCount: 0,
      products: [],
      all_stocks: [],
      orders: [],
      filteredProducts: [],
      total: 0,
      total_discount: 0,
      total_net: 0,
      currency: null,
      discount: 0,
      customer_discount: 0,
      customer: null,
      searchText: "",
      barcode: "",
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
  watch: {
    currentPage: function(val, oldVal) {
      this.filterProducts();
    },
    searchText() {
      setTimeout(() => {
        this.filterProducts(true);
      }, 250);
    }
  },
  methods: {
    getStocks(id) {
      let stocks = this.all_stocks.filter(
        s => s.product_id == id && s.available_qte > 0
      );
      if (stocks.length > 0) {
        return JSON.parse(JSON.stringify(stocks));
      } else {
        return [];
      }
    },
    getProductAvailableQte(id) {
      let stocks = store.getters.getStocks(id);
      return _.reduce(
        stocks,
        function(sum, s) {
          return sum + s.available_qte;
        },
        0
      );
    },
    switchMode() {
      this.$router.push("/fast-sell");
      //this.goBack();
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
    submitOrder() {
      if (!this.is_customer_selected) {
        swal(this.$t("please_choose_customer"), "", "info");
      } else if (this.is_customer_selected && this.selected_products == 0) {
        swal(this.$t("warning"), this.$t("add_product_to_basket"), "info");
      } else {
        swal({
          title: this.$t("do_you_wanna_submit_order"),
          text: "",
          icon: "warning",
          buttons: true,
          dangerMode: false
        }).then(add => {
          if (add) {
            let order_products = JSON.parse(
              JSON.stringify(this.products.filter(p => p.amount != 0))
            );
            //updating product stock && calculating buy_total
            let order_stocks = [];
            let buy_total = 0;
            order_products = _.map(order_products, p => {
              buy_total = buy_total + p.amount * p.buy_price;
              let stocks = this.getStocks(p.id);
              let qte = 0;
              _.forEach(stocks, stock => {
                let clone = JSON.parse(JSON.stringify(stock));
                while (qte < p.amount) {
                  if (stock.available_qte >= p.amount - qte) {
                    clone.available_qte = p.amount - qte;
                    stock.available_qte =
                      stock.available_qte - (p.amount - qte);
                    store.dispatch("updateStock", stock);
                    qte = p.amount;
                    order_stocks.push(clone);
                  } else {
                    clone.available_qte = stock.available_qte;
                    qte = qte + stock.available_qte;
                    stock.available_qte = 0;
                    store.dispatch("updateStock", stock);
                    order_stocks.push(clone);
                    break;
                  }
                }
              });

              delete p.initial_qte;
              //delete p.amount;

              return p;
            });

            let payments = [
              {
                id: 1,
                type: "cash",
                amount: this.total_net
              }
            ];

            let order = new Order(
              this.customer_discount,
              this.total,
              this.total_net,
              buy_total,
              order_products,
              order_stocks,
              payments,
              this.customer.id
            );
            console.log("order");
            console.log(order);
            console.log("stocks");
            console.log(store.getters.stocks);
            this.products = _.map(this.products, p => {
              delete p.initial_qte;
              delete p.qte;
              delete p.amount;
              return p;
            });

            store.dispatch("addOrder", order);
            store.dispatch("products", this.products);
            this.goBack();
            // swal("Poof! Your imaginary file has been deleted!", {
            //   icon: "success",
            // });
          } else {
          }
        });
      }
    },
    scrollHor(event) {
      $(".flex-container").scrollLeft(
        event.deltaY + $(".flex-container").scrollLeft()
      );
    },
    addCustomer() {
      this.$router.push("/new-customer");
    },

    unSelectCustomers() {
      this.customers = _.map(this.customers, c => {
        c.selected = false;
        this.isCustomerSelected[c.id] = false;
        return c;
      });
      this.updateProductList(null, null);
    },
    selectCustomer(id) {
      this.customers = _.map(this.customers, c => {
        if (c.id == id) {
          c.selected = true;
          this.isCustomerSelected[c.id] = true;
          this.customer = c;
        } else {
          c.selected = false;
          this.isCustomerSelected[c.id] = false;
        }
        return c;
      });
      this.is_customer_selected = true;
      this.isCustomerSelected = Object.assign(
        {},
        this.isCustomerSelected,
        this.isCustomerSelected
      );

      this.updateProductList(null, null);
    },
    updateProductList(product_id, _amount) {
      if (product_id != null) {
        let amount = _amount;
        this.total = 0;
        this.discount = 0;
        this.is_products_selected = 0;
        this.products = _.map(this.products, p => {
          if (p.id == product_id) {
            p.amount = amount;
            //finding mid price and discount
            let qte = 0;
            let mid_price = 0;
            let buy_mid_price = 0;
            let mid_discount = 0;
            let total_temp = 0;
            let buy_total_temp = 0;
            let discount_temp = 0;
            let stock_index = 0;
            let stocks = this.getStocks(product_id);
            console.log(stocks);
            while (qte < amount) {
              if (stocks[stock_index].available_qte >= amount - qte) {
                stocks[stock_index].available_qte =
                  stocks[stock_index].available_qte - (amount - qte);
                total_temp =
                  total_temp + stocks[stock_index].sell_price * (amount - qte);
                buy_total_temp =
                  buy_total_temp +
                  stocks[stock_index].buy_price * (amount - qte);
                discount_temp =
                  discount_temp +
                  (stocks[stock_index].discount / 100) *
                    (stocks[stock_index].sell_price * (amount - qte));
                qte = amount;
              } else {
                total_temp =
                  total_temp +
                  stocks[stock_index].sell_price *
                    stocks[stock_index].available_qte;
                buy_total_temp =
                  buy_total_temp +
                  stocks[stock_index].buy_price *
                    stocks[stock_index].available_qte;
                discount_temp =
                  discount_temp +
                  (stocks[stock_index].discount / 100) *
                    (stocks[stock_index].sell_price *
                      stocks[stock_index].available_qte);
                qte = qte + stocks[stock_index].available_qte;
                stocks[stock_index].available_qte = 0;
              }
              stock_index++;
            }
            if (amount == 0) {
              //reset to inital price
              var fstock = this.getStocks(p.id)[0];
              p.sell_price = fstock ? parseFloat(fstock.sell_price) : 0;
              p.discount = fstock ? parseFloat(fstock.discount) : 0;
            } else {
              mid_price = parseFloat((total_temp / amount).toFixed(2));
              buy_mid_price = parseFloat((buy_total_temp / amount).toFixed(2));
              mid_discount = (discount_temp * 100) / total_temp;
              p.sell_price = mid_price;
              p.buy_price = buy_mid_price;
              p.discount = mid_discount;
            }
          }

          this.is_products_selected =
            this.is_products_selected + p.amount == 0 ? 0 : 1;

          this.total = parseFloat(
            (this.total + p.amount * p.sell_price).toFixed(2)
          );
          this.discount = parseFloat(
            (
              this.discount +
              (p.discount / 100) * (p.amount * p.sell_price)
            ).toFixed(2)
          );

          return p;
        });
      }
      this.total_net = this.total - this.discount;
      if (this.customer) {
        this.customer_discount = (
          (this.customer.discount / 100) *
          this.total_net
        ).toFixed(2);
        this.total_net =
          this.total_net - (this.customer.discount / 100) * this.total_net;
      }
      console.log(this.total);
      this.total = parseFloat(this.total.toFixed(2));
      this.total_net = parseFloat(this.total_net.toFixed(2));
      this.discount = parseFloat(this.discount.toFixed(2));
      console.log("this.getStocks(product_id)");
      console.log(this.getStocks(product_id));
    },
    filterProducts(resetCurrentPage = false) {
      let filteredP = _.filter(this.products, p => {
        if (this.searchText == "") {
          return true;
        } else {
          if (
            p.name.toLowerCase().search(this.searchText.toLowerCase()) != -1 ||
            p.category.toLowerCase().search(this.searchText.toLowerCase()) != -1
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
      }
      this.pageCount = Math.ceil(filteredP.length / this.pageMax);
    },
    goBack() {
      this.$eventBus.$off("barcode");
      this.$router.go(-1);
      this.$destroy();
    },

    validEmail: function(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.w-100 {
  width: 100%;
}

.w-50 {
  width: 50%;
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

.p-5 {
  padding: 5px;
}

.wrapper::-webkit-scrollbar {
  width: 0em;
}

.wrapper {
  padding-bottom: 15px;
}

.main-panel {
  /*   border: 10px solid white;
    border-radius: 25px;*/
  /* padding: 9px; */
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

.list-unstyled > li {
  margin: 10px !important;
  padding: 10px !important;
  background-color: rgba(248, 248, 248, 0.58);
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

.selected_btn {
  background-color: #ffe681 !important;
  color: white !important;
}

input[type="text"] {
  width: 300px;
  -webkit-transition: width 0.4s ease-in-out;
  transition: width 0.4s ease-in-out;
}

/* When the input field gets focus, change its width to 100% */
input[type="text"]:focus {
  width: 75%;
}

.search {
  height: 40px;
  font-size: 17px;
  font-family: inherit;
  padding-left: 10px;
}
</style>
