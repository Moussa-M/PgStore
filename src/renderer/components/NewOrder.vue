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
              <div class>
                <h4 class="title">{{$t("choose_customer")}}</h4>
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
                  <div v-show="products.length > 0" :class="$i18n.locale=='ar'?'text-left':'text-right'" class="col-md-6">
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
                    <th width="5%">{{ $t("id") }}</th>
                    <th :class="$i18n.locale=='ar'?'text-right':'text-left'"  width="20%">{{ $t("name") }}</th>
                    <th class="text-center" width="30%">{{$t("desc")}}</th>
                    <th class="text-center" width="10%">{{$t("available")}}</th>
      
                    <th class="text-center" width="10%">{{$t("u_price")}}</th>
                    <th width="20%" :class="$i18n.locale=='ar'?'text-left':'text-right'">{{ $t("actions") }}</th>
                  </thead>
                  <tbody>
                    <tr
                      style="cursor: pointer;"
                      v-for="product in filteredProducts"
                      :key="product.id"
                    >
                      <td :class="$i18n.locale=='ar'?'text-right':'text-left'">{{product.id}}</td>
                      <td>
                        <div class="row">
                          <div :class="$i18n.locale=='ar'?'text-left':'text-right'"  class="col-xs-3">
                            <div class>
                              <Avatar
                                :image="isNotEmpty(product.image)?product.image:'assets/img/faces/product.png'"
                                :width="50"
                                :height="50"
                                :radius="7"
                                :crop="true"
                                @click="zoomImage(isNotEmpty(product.image)?product.image:'assets/img/faces/product.png')"
                                :changeable="false"
                              />
                            </div>
                          </div>
                          <div  :class="$i18n.locale=='ar'?'text-right':'text-left'"  class="col-xs-6 trim-text">{{product.name}}</div>
                        </div>
                      </td>
                      <td class="text-center" >{{product.desc}}</td>
                      <td class="text-center" >{{product.unit=='piece' ? product.qte:product.weight}} {{product.unit=='piece' ? ($t('piece')).toUpperCase():$t(product.unit.toLowerCase())}}</td>

                      <td class="text-center">{{product.sell_price}} {{$t(currency.toLowerCase())}}</td>
                      <td :class="$i18n.locale=='ar'?'text-left':'text-right'" 
                        style="display: flex;justify-content: flex-end; padding-right: 35px">
                        <Quantity
                          :disabled="false"
                          :max="product.unit=='piece' ? product.initial_qte:product.initial_weight"
                          :value="product.amount"
                          v-on:change="updateProductList(product.id,$event)"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="row"  >
                  <div class="col-xs-6"   >
                    <div :class="$i18n.locale=='ar'?'text-right':'text-left'" style="padding-right: 15px">
                      <h5 class="category" style="margin: 0px">{{$t("total")}} : {{total}} {{$t(currency.toLowerCase())}}</h5>
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
                      <h4 style="margin: 0px">{{$t("total_net")}} : {{total_net }} {{$t(currency.toLowerCase())}}</h4>
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
                            <font-awesome-icon icon="clipboard-check"/> {{$t("submit_order")}}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row text-center" v-show="products.length == 0">
                <h5>{{$t("no_products_found")}}<br/> {{$t("add_products_to_store")}}</h5>
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
import vPagination from 'vue-plain-pagination'
import Quantity from './sub_components/Quantity.vue'
import CustomerCard from './sub_components/CustomerCard.vue'
import Avatar from './sub_components/Avatar.vue'
import Vue from 'vue'
import { Order } from './models.js'
const { dialog } = require('electron').remote
export default {
  name: 'NewOrder',
  components: {
    vPagination,
    Quantity,
    CustomerCard,
    Avatar
  },
  created: function () {
    console.log('created')
    let user = window.store.getters.user
    this.currency = user.currency
    this.products = JSON.parse(JSON.stringify(store.getters.products))

    this.products = _.map(this.products, p => {
      p.amount = 0
      p.initial_qte = p.qte
      p.initial_weight = p.weight
      return p
    })

    this.customers = JSON.parse(JSON.stringify(store.getters.customers))
    this.pageCount = Math.ceil(this.products.length / this.pageMax)
    this.filterProducts()

    $('body').focus()

    this.$eventBus.$on('barcode', (bcode) => {
      let btype = this.getBarCodeType()
      switch (btype) {
        case 'product':
          let bproduct = this.getProductFromBarCode(bcode)
          let added_before = this.isProductAddedBefore(bproduct)
          if (bproduct) {
            if (added_before) {

            } else {

            }
          } else {
            // search the net

          }
          break
      }
    })
  },

  async activated () {
    console.log('activated')
    await this.$nextTick()
    this.customers = JSON.parse(JSON.stringify(store.getters.customers))
    this.unSelectCustomers()
  },

  data: function () {
    return {
      isCustomerSelected: {},
      is_customer_selected: false,
      is_products_selected: 0,
      currentPage: 1,
      pageMax: 5,
      pageCount: 0,
      currentCount: 0,
      products: [],
      orders: [],
      filteredProducts: [],
      total: 0,
      total_discount: 0,
      total_net: 0,
      currency: null,
      discount: 0,
      customer_discount: 0,
      customer: null,
      searchText: '',
      barcode: '',
      bootstrapPaginationClasses: {
        // http://getbootstrap.com/docs/4.1/components/pagination/
        ul: 'pagination',
        li: 'page-item',
        liActive: 'active',
        liDisable: 'disabled',
        button: 'page-link'
      },
      customLabels: {
        first: this.$t('first'),
        prev: this.$t('previous'),
        next: this.$t('next'),
        last: this.$t('last')
      }
    }
  },
  watch: {
    currentPage: function (val, oldVal) {
      this.filterProducts()
    },
    searchText () {
      setTimeout(() => {
        this.filterProducts(true)
      }, 250)
    }
  },
  methods: {
    zoomImage (path) {
      // todo
    },
    isNotEmpty (str) {
      if (str != null && str != '') {
        return true
      }
      return false
    },
    submitOrder () {
      if (!this.is_customer_selected) {
        dialog.showMessageBox({
          message: this.$t('please_choose_customer'),
          type: 'warning',
          buttons: [this.$t('ok')],
          defaultId: 0
        })
      } else if (this.is_customer_selected && this.selected_products == 0) {
        dialog.showMessageBox({
          message: this.$t('add_product_to_basket'),
          type: 'warning',
          buttons: [this.$t('Ok')],
          defaultId: 0
        })
      } else {
        let res = dialog.showMessageBox({
          message: this.$t('do_you_wanna_submit_order'),
          type: 'question',
          buttons: [this.$t('ok'), this.$t('cancel')],
          defaultId: 0,
          cancelId: 1
        })
        if (res == 0) {
          let order_products = JSON.parse(
            JSON.stringify(this.products.filter(p => p.amount != 0))
          )
          let buy_total = 0
          order_products = _.map(order_products, p => {
            p.qte = p.unit == 'piece' ? p.amount : 0
            p.weight = p.unit != 'piece' ? p.amount : 0
            buy_total = buy_total + ((p.amount * p.buy_price) * (1))
            delete p.initial_qte
            delete p.initial_weight
            delete p.amount
            return p
          })

          const id = _.sampleSize('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6).join('')
          let order = new Order(
            id,
            this.customer_discount,
            this.total,
            this.total_net,
            buy_total,
            order_products,
            new Date().toISOString(),
            this.customer
          )
          this.products = _.map(this.products, p => {
            delete p.initial_qte
            delete p.initial_weight
            delete p.amount
            return p
          })

          store.dispatch('addOrder', order)
          store.dispatch('products', this.products)
          this.goBack()
        }
      }
    },
    scrollHor (event) {
      $('.flex-container').scrollLeft(
        event.deltaY + $('.flex-container').scrollLeft()
      )
    },
    addCustomer () {
      this.$router.push('/new-customer')
    },

    unSelectCustomers () {
      this.customers = _.map(this.customers, c => {
        c.selected = false
        this.isCustomerSelected[c.id] = false
        return c
      })
      this.updateProductList(null, null)
    },
    selectCustomer (id) {
      this.customers = _.map(this.customers, c => {
        if (c.id == id) {
          c.selected = true
          this.isCustomerSelected[c.id] = true
          this.customer = c
        } else {
          c.selected = false
          this.isCustomerSelected[c.id] = false
        }
        return c
      })
      this.is_customer_selected = true
      this.isCustomerSelected = Object.assign(
        {},
        this.isCustomerSelected,
        this.isCustomerSelected
      )
      this.updateProductList(null, null)
    },
    updateProductList (product_id, _amount) {
      let amount = _amount
      this.total = 0
      this.discount = 0
      this.is_products_selected = 0
      this.products = _.map(this.products, p => {
        if (p.id == product_id) {
          p.amount = amount
          if (p.unit == 'piece') {
            p.qte = p.initial_qte - amount
          } else {
            p.weight = p.initial_weight - amount
          }
        }
        this.is_products_selected =
          this.is_products_selected + p.amount == 0 ? 0 : 1
        this.total = this.total + p.amount * p.sell_price
        this.discount =
          this.discount + (p.discount / 100) * (p.amount * p.sell_price)
        return p
      })
      this.total_net = this.total - this.discount
      if (this.customer) {
        this.customer_discount = (
          (this.customer.discount / 100) *
          this.total_net
        ).toFixed(2)
        this.total_net = this.total_net - (this.customer.discount / 100) * this.total_net
      }

      this.total = this.total.toFixed(2)
      this.total_net = this.total_net.toFixed(2)
      this.discount = this.discount.toFixed(2)
    },
    filterProducts (resetCurrentPage = false) {
      let filteredP = _.filter(this.products, p => {
        if (this.searchText == '') {
          return true
        } else {
          if (
            p.name.toLowerCase().search(this.searchText.toLowerCase()) != -1
          ) {
            return true
          } else {
            return false
          }
        }
      })
      if (resetCurrentPage) {
        this.currentPage = 1
      }
      if (this.products.length > 0) {
        this.filteredProducts = _.slice(
          filteredP,
          this.pageMax * (this.currentPage - 1),
          this.pageMax * (this.currentPage - 1) + this.pageMax
        )
      }
      this.pageCount = Math.ceil(filteredP.length / this.pageMax)
    },
    goBack () {
      this.$eventBus.$off('barcode')
      this.$router.go(-1)
      this.$destroy()
    },

    validEmail: function (email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    }
  }
}
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
  padding: 9px;
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