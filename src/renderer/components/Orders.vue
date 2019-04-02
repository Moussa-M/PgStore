<template>
  <div class="main-panel" :style="{'float':$i18n.locale=='ar' ? 'left':'right'}">
    <nav class="navbar navbar-default">
      <div class="nav-container">
        <div class="navbar-header" style="display: inline-flex;">
          <button type="button" class="navbar-toggle">
            <span class="sr-only">{{ $t("toggle_nav") }}</span>
            <span class="icon-bar bar1"></span>
            <span class="icon-bar bar2"></span>
            <span class="icon-bar bar3"></span>
          </button>
          <a class="navbar-brand" href="#">{{$t("sales")}}</a>
        </div>
        <ul class="nav navbar-nav text-center" style="width:100%">
          <li style="width:100%">
            <div class="form-group">
              <input
                type="text"
                v-model="searchText"
                class="text-center search"
                name="search"
                :placeholder="$t('filter_by_customer_name_or_phone')"
              >
              <!-- <font-awesome-icon class="inlineFilter" icon="filter"/> -->
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
                <div :class="$i18n.locale=='ar'?'text-left':'text-right'" class="col-md-6">
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
                </div>
              </div>
            </div>
            <div v-if="filteredOrders.length > 0" class="content table-responsive table-full-width">
              <table class="table table-hover">
                <thead>
                  <th width="4%">{{$t('n')}}</th>
                  <th
                    :class="$i18n.locale=='ar'?'text-right':'text-left'"
                    width="20%"
                  >{{$t("customer")}}</th>
                  <th class="text-center">{{$t("date")}}</th>
                  <th class="text-center">{{$t("desc")}}</th>
                  <th class="text-center">{{$t("total")}}</th>
                  <th :class="$i18n.locale=='ar'?'text-left':'text-right'">{{ $t("actions") }}</th>
                </thead>
                <tbody>
                  <tr
                    @click="editOrder(order.id,$event)"
                    style="cursor: pointer;"
                    v-for="(order, index) in filteredOrders"
                    :key="order.id"
                    :ref="order.id"
                  >
                    <td>{{index+1+((currentPage-1)*pageMax)}}</td>
                    <td>
                      <div class="row">
                        <div
                          :class="$i18n.locale=='ar'?'text-left':'text-right'"
                          class="col-xs-4 col-md-4 col-lg-3"
                        >
                          <div class>
                            <Avatar
                              :image="order.customer.image"
                              :fullname="order.customer.name"
                              :width="50"
                              :height="50"
                              :radius="50"
                              :crop="true"
                              :changeable="false"
                            />
                          </div>
                        </div>
                        <div
                          :class="$i18n.locale=='ar'?'text-right':'text-left'"
                          class="col-xs-8 col-md-8 col-lg-6 trim-text"
                        >
                          {{order.customer.name}}
                          <br>
                          <span class="text-info">
                            <small dir="ltr">{{order.customer.phone}}</small>
                          </span>
                        </div>
                      </div>
                    </td>
                    <td class="text-center">{{order.date.substring(0,16).replace('T',' ')}}</td>
                    <td class="text-center">
                      <div
                        style="max-height: 80px;overflow-y: auto;direction:initial"
                      >{{getOrderDesc(order.products)}}</div>
                    </td>

                    <td class="text-center">{{order.total_net}} {{$t(currency.toLowerCase())}}</td>
                    <td :class="$i18n.locale=='ar'?'text-left':'text-right'">
                      <button @click="openInvoice(order.id,$event)" class="btn btn-info btn-icon">
                        <i class="ti-file"></i>
                      </button>
                      <button @click="editOrder(order.id,$event)" class="btn btn-success btn-icon">
                        <i class="ti-pencil"></i>
                      </button>
                      <button @click="deleteOrder(order.id,$event)" class="btn btn-danger btn-icon">
                        <i class="ti-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-if="orders.length > pageMax" class="row text-center">
                <nav aria-label="Search results pages">
                  <v-pagination
                    v-model="currentPage"
                    :page-count="pageCount"
                    :classes="bootstrapPaginationClasses"
                    :labels="customLabels"
                  ></v-pagination>
                </nav>
              </div>
            </div>
            <div style="padding: 50px;" class="row text-center" v-else>
              <i style="font-size:80px;color:gray" class="ti-filter"></i>
              <h3>{{$t("no_orders_found")}}</h3>
              <p
                style="margin-bottom:50px"
                class="category"
                v-if="orders.length > 0"
              >{{$t("change_search_to_see_orders")}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import vPagination from 'vue-plain-pagination'
import { Notification } from 'electron'
import { Product } from './models.js'
import DatePicker from 'vue2-datepicker'
import Avatar from './sub_components/Avatar.vue'

import { getStartYearDate, getStartMonthDate } from './utils.js'
var { ipcRenderer, remote } = require('electron')
const { dialog } = require('electron').remote


export default {
  name: 'Orders',
  components: {
    vPagination,
    DatePicker,
    Avatar
  },
  created () {
    console.log('orders created')
    this.orders = store.getters.orders
    this.currency = store.getters.user.currency
      ? store.getters.user.currency
      : 'DZD'

    this.pageCount = Math.ceil(this.orders.length / this.pageMax)
    this.filterOrders()
  },
  activated () {
    console.log('activated')
    this.orders = store.getters.orders
    // console.log(this.orders);

    this.filterOrders()
    this.lang = {
      days: [
        this.$t('Sun'),
        this.$t('Mon'),
        this.$t('Tue'),
        this.$t('Wed'),
        this.$t('Thu'),
        this.$t('Fri'),
        this.$t('Sat')
      ],
      months: [
        this.$t('Jan'),
        this.$t('Feb'),
        this.$t('Mar'),
        this.$t('Apr'),
        this.$t('May'),
        this.$t('Jun'),
        this.$t('Jul'),
        this.$t('Aug'),
        this.$t('Sep'),
        this.$t('Oct'),
        this.$t('Nov'),
        this.$t('Dec')
      ],
      pickers: [
        'next 7 days',
        'next 30 days',
        'previous 7 days',
        'previous 30 days'
      ],
      placeholder: {
        date: this.$t('select_range'),
        dateRange: this.$t('filter_by_range')
      }
    }
    this.customLabels = {
      first: this.$t('first'),
      prev: this.$t('previous'),
      next: this.$t('next'),
      last: this.$t('last')
    }
  },

  data () {
    return {
      daterange: '',
      lang: {
        days: [
          this.$t('Sun'),
          this.$t('Mon'),
          this.$t('Tue'),
          this.$t('Wed'),
          this.$t('Thu'),
          this.$t('Fri'),
          this.$t('Sat')
        ],
        months: [
          this.$t('Jan'),
          this.$t('Feb'),
          this.$t('Mar'),
          this.$t('Apr'),
          this.$t('May'),
          this.$t('Jun'),
          this.$t('Jul'),
          this.$t('Aug'),
          this.$t('Sep'),
          this.$t('Oct'),
          this.$t('Nov'),
          this.$t('Dec')
        ],
        pickers: [
          'next 7 days',
          'next 30 days',
          'previous 7 days',
          'previous 30 days'
        ],
        placeholder: {
          date: this.$t('select_range'),
          dateRange: this.$t('filter_by_range')
        }
      },
      shortcuts: [
        {
          text: this.$t('today'),
          onClick: () => {
            let sdate = new Date()
            sdate.setHours(0)
            sdate.setMinutes(0)
            sdate.setSeconds(0)
            sdate.setMilliseconds(0)
            let edate = new Date()
            edate.setHours(23)
            edate.setMinutes(59)
            edate.setSeconds(59)
            edate.setMilliseconds(99)
            this.daterange = [sdate, edate]
          }
        },
        {
          text: this.$t('this_month'),
          onClick: () => {
            this.daterange = [getStartMonthDate(new Date()), new Date()]
          }
        },
        {
          text: this.$t('this_year'),
          onClick: () => {
            this.daterange = [getStartYearDate(new Date()), new Date()]
          }
        }
      ],

      currentPage: 1,
      pageMax: 7.0,
      currentCount: 0,
      orders: [],
      filteredOrders: [],
      currency: null,
      searchText: '',
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
  methods: {
    openInvoice (id, event) {
      event.stopPropagation()
      $('tr').removeClass('animated pulse')
      setTimeout(() => {
        $(this.$refs[id]).addClass('animated pulse')
        this.$router.push({ name: 'open_invoice', params: { id: id } })
      }, 250)
    },
    getOrderDesc (products) {
      var desc = []
      _.forEach(products, p => {
        if (p.unit == 'piece') {
          desc.push(p.name + ' x ' + p.qte)
        } else {
          desc.push(p.name + ' x ' + p.weight + p.unit)
        }
      })
      return _.join(desc, '\n')
    },
    addOrder () {
      this.$router.push('/new-order')
    },
    editOrder (id, event) {
      event.stopPropagation()
      $('tr').removeClass('animated pulse')
      setTimeout(() => {
        $(this.$refs[id]).addClass('animated pulse')
        this.$router.push({ name: 'edit_order', params: { id: id } })
      }, 250)
    },

    filterOrders (resetCurrentPage = false) {
      let filteredO1 = _.filter(this.orders, o => {
        if (this.daterange[0] == null && this.daterange[1] == null) {
          return true
        } else {
          let sdate = this.daterange[0]
          let edate = this.daterange[1]
          edate.setHours(23)
          edate.setMinutes(59)
          edate.setSeconds(59)
          edate.setMilliseconds(99)

          if (
            new Date(o.date).getTime() >= sdate.getTime() &&
            new Date(o.date).getTime() <= edate.getTime()
          ) {
            return true
          } else {
            return false
          }
        }
      })

      let filteredO = _.filter(filteredO1, o => {
        if (this.searchText.trim() == '') {
          return true
        } else {
          if (
            o.customer.name
              .toLowerCase()
              .search(this.searchText.toLowerCase()) != -1 ||
            o.customer.phone.search(this.searchText) != -1
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
      if (this.orders.length > 0) {
        this.filteredOrders = _.slice(
          filteredO,
          this.pageMax * (this.currentPage - 1),
          this.pageMax * (this.currentPage - 1) + this.pageMax
        )
      }
      this.pageCount = Math.ceil(filteredO.length / this.pageMax)
    },
    deleteOrder (id, event) {
      event.stopPropagation()
      // animate the order row
      let res = dialog.showMessageBox({
        message: this.$t('delete_order_confirm'),
        type: 'question',
        buttons: [this.$t('ok'), this.$t('cancel')],
        defaultId: 0,
        cancelId: 1
      })
      if (res == 0) {
        $(this.$refs[id][0]).addClass('animated fadeOutLeft')

        setTimeout(() => {
          // console.log(this.orders.length);
          _.remove(this.orders, { id: id })
          store.dispatch('orders', this.orders)
          // console.log(this.orders.length);
          this.orders = JSON.parse(JSON.stringify(this.orders))
          if (this.filteredOrders.length == 1) {
            this.currentPage = this.currentPage != 0 ? this.currentPage - 1 : 1
          } else {
            this.filterOrders()
          }
        }, 500)
      }
    },
    rangeCleared () {
      this.filterOrders(true)
    }
  },
  watch: {
    currentPage: function (val, oldVal) {
      this.filterOrders()
    },
    searchText () {
      setTimeout(() => {
        this.filterOrders(true)
      }, 250)
    },
    daterange () {
      if (this.daterange[0] != null && this.daterange[1] != null) {
        setTimeout(() => {
          this.filterOrders(true)
        }, 400)
      }
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pagination > li > a {
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
  padding: 9px;
}
.wrapper::-webkit-scrollbar {
  width: 0em;
}

th {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 17px;
  font-weight: 500;
}

input[type="text"] {
  width: 30%;
  -webkit-transition: width 0.4s ease-in-out;
  transition: width 0.4s ease-in-out;
}

/* When the input field gets focus, change its width to 100% */
input[type="text"]:focus {
  width: calc(100% - 170px);
}
.search {
  height: 50px;
  font-size: 20px;
  font-family: inherit;
  padding-left: 10px;
  margin-top: 7px;
}
.inlineFilter {
  display: inline;
  color: grey;
  font-size: 25px;
  z-index: 2;
}

.mx-input {
  display: inline-block;
  /* width: 100%; */
  height: 40px !important;
  padding: 6px 30px;
  padding-left: 10px;
  font-size: 15px !important;
  line-height: 1.4;
  color: #555;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px !important;
  font-family: inherit !important;
  -webkit-box-shadow: none;
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
</style>