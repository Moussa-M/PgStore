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
          <a class="navbar-brand" href="#">{{ $t("customers") }}</a>
        </div>
         <ul class="nav navbar-nav text-center" style="width:100%">
          <li style="width:100%">
            <input
              type="text"
              v-model="searchText"
              class="text-center search"
              name="search" 
              :placeholder="$t('filter_by_name_or_phone')"
            >
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
            <div v-if="filteredCustomers.length > 0" class="content table-responsive table-full-width">
              <table class="table table-hover">
                <thead>
                  <th width="4%" >{{ $t("id") }}</th>
                  <th :class="$i18n.locale=='ar'?'text-right':'text-left'" width="20%">{{ $t("name") }}</th>
                  <th class="text-center">{{ $t("discount") }} (%)</th>
                  <th class="text-center">{{ $t("joined_date") }}</th>
                  <th class="text-center">{{ $t("last_order") }}</th>
                  <th :class="$i18n.locale=='ar'?'text-left':'text-right'" >{{ $t("actions") }}</th>
                </thead>
                <tbody>
                  <tr
                    style="cursor: pointer;"
                    v-for="customer in filteredCustomers"
                    :key="customer.id"
                    :ref="customer.id"
                    @click="editCustomer(customer.id,$event)"
                  >
                    <td>{{customer.id}}</td>
                    <td>
                      <div class="row">
                        <div :class="$i18n.locale=='ar'?'text-left':'text-right'"  class="col-xs-3">
                          <div class="">
                            <Avatar
                              :image="customer.image"
                              :fullname="customer.name"
                              :width="50"
                              :height="50"
                              :radius="50"
                              :crop="true"
                              :changeable="false"
                            />
                          </div>
                        </div>
                        <div :class="$i18n.locale=='ar'?'text-right':'text-left'"  class="col-xs-6 trim-text">
                          {{customer.name}}
                          <br>
                          <span class="text-info">
                            <small dir="ltr">{{customer.phone}}</small>
                          </span>
                        </div>
                      </div>
                    </td>
                    <td align="center">
                      {{customer.discount}}
                      </td>
                    <td align="center">{{customer.date.substring(0, 10)}}</td>
                    <td align="center">
                      <div v-html="getCustomerLastOrderDate(customer.id)"></div>
                    </td>
                    <td :class="$i18n.locale=='ar'?'text-left':'text-right'">
                      <button @click="editCustomer(customer.id,$event)" class="btn btn-success btn-icon">
                        <i class="ti-pencil"></i>
                      </button>
                      <button v-if="customer.id != 1" @click="deleteCustomer(customer.id,$event)" class="btn btn-danger btn-icon">
                        <i class="ti-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-if="customers.length > pageMax" class="row text-center">
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
            <div style="padding: 50px;" class="row text-center"  v-else>
              <i style="font-size:80px;color:gray" class="ti-filter"></i>
              <h3 >{{$t("no_customers_found")}}</h3>
              <p style="margin-bottom:50px" class="category" @click="searchText=''" v-if="customers.length > 0">{{$t("clear_to_see_customers")}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import vPagination from 'vue-plain-pagination'
import Avatar from './sub_components/Avatar.vue'
import { Notification } from 'electron'
import { Customer } from './models.js'
const { dialog } = require('electron').remote
export default {
  name: 'Customers',
  components: {
    vPagination,
    Avatar
  },
  created () {
    this.customers = JSON.parse(JSON.stringify(store.getters.customers))
    this.pageCount = Math.ceil(this.customers.length / this.pageMax)
    this.filterCustomers()
  },

  mounted () {
    /* let myNotification = new Notification('Title', {
              body: 'Lorem Ipsum Dolor Sit Amet'
            }) */
  },
  activated () {
    this.customLabels = {
      first: this.$t('first'),
      prev: this.$t('previous'),
      next: this.$t('next'),
      last: this.$t('last')
    }
    this.customers = JSON.parse(JSON.stringify(store.getters.customers))
    this.pageCount = Math.ceil(this.customers.length / this.pageMax)
    this.filterCustomers()
  },
  deactivated () {
    $('tr').removeClass('animated')
    $('tr').removeClass('pulse')
    $('tr').removeClass('fadeOutLeft')
  },
  data () {
    return {
      currentPage: 1,
      pageMax: 7.0,
      currentCount: 0,
      customers: [],
      orders: [],
      filteredCustomers: [],
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
    openCustomer (id) {
      console.log(store.getters.getCustomer(id))
    },
    addCustomer () {
      this.$router.push('/new-customer')
    },
    editCustomer (id, event) {
      event.stopPropagation()
      $('tr').removeClass('animated pulse')
      setTimeout(() => {
        $(this.$refs[id]).addClass('animated pulse')
        this.$router.push({ name: 'edit_customer', params: { id: id } })
      }, 250)
    },
    getCustomerLastOrderDate (id) {
      let lastorder = store.getters.getCustomerLastOrder(id)
      if (lastorder) {
        return lastorder.date.substring(0, 10)
      } else {
        return '<i class="material-icons">remove_shopping_cart</i>'
      }
    },
    filterCustomers (resetCurrentPage = false) {
      let filteredC = _.filter(this.customers, c => {
        if (this.searchText.trim() == '') {
          return true
        } else {
          if (
            c.name.toLowerCase().search(this.searchText.trim().toLowerCase()) != -1 || c.phone.search(this.searchText.trim()) != -1
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
      if (this.customers.length > 0) {
        this.filteredCustomers = _.slice(
          filteredC,
          this.pageMax * (this.currentPage - 1),
          this.pageMax * (this.currentPage - 1) + this.pageMax
        )
      }
      this.pageCount = Math.ceil(filteredC.length / this.pageMax)
    },
    deleteCustomer (id, e) {
      e.stopPropagation()
      let res = dialog.showMessageBox({
        message: this.$t('delete_customer_confirm'),
        type: 'question',
        buttons: [this.$t('ok'), this.$t('cancel')],
        defaultId: 0,
        cancelId: 1
      })
      if (res == 0) {
    
        $(this.$refs[id]).addClass('animated fadeOutLeft')

        setTimeout(() => {
          store.dispatch('deleteCustomer', id)
          // to refrech Vue
          this.customers = JSON.parse(JSON.stringify(store.getters.customers))
          if (this.filteredCustomers.length == 1) {
            this.currentPage = this.currentPage != 0 ? this.currentPage - 1 : 1
          } else {
            this.filterCustomers()
          }
        }, 500)
      }
    }
  },
  watch: {
    currentPage: function (val, oldVal) {
      this.filterCustomers()
    },
    searchText () {
      setTimeout(() => {
        this.filterCustomers(true)
      }, 250)
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pagination > li > a {
  cursor: pointer;
}

th{
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
  padding: 9px;
}
.trim-text {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
input[type="text"] {
  width: 30%;
  -webkit-transition: width 0.4s ease-in-out;
  transition: width 0.4s ease-in-out;
}

/* When the input field gets focus, change its width to 100% */
input[type="text"]:focus {
  width:calc(100% - 200px);
}
.search {
  height: 50px;
  font-size: 20px;
  font-family: inherit;
  padding-left: 10px;
  margin-top: 7px;
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
</style>