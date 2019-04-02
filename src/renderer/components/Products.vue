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
          <a class="navbar-brand" href="#">{{$t("products")}}</a>
        </div>

        <ul class="nav navbar-nav text-center" style="width:100%">
          <li style="width:100%">
           
            <input
              type="text"
              v-model="searchText"
              class="text-center search"
              name="search"
              :placeholder="$t('filter_by_name_desc')"
            >
          </li>
        </ul>

        <ul class="nav navbar-nav navbar-right" style="margin-right: 0px">
          <li>
            <a class="btn btn-circle" @click="addProduct">
              <i class="ti-plus"></i>
            </a>
          </li>
        </ul>
      </div>
    </nav>
    <div class="content">
      <div class="container-fluid ">
        <div class="row">
          <div class="card">
            <!--  <div class="header">
                            <div class="row">
                                <div class="col-md-6">
                                    <h4 class="title" >List of products</h4>
                                </div>
                              
                            </div>
                        
            </div>-->
            <div
              v-if="filteredProducts.length > 0"
              class="content table-responsive table-full-width"
            >
              <table class="table table-hover">
                <thead>
                  <th width="4%">{{$t("n")}}</th>
                  <th :class="$i18n.locale=='ar'?'text-right':'text-left'" width="20%">{{ $t("name") }}</th>
                  <th class="text-center" width="18%">{{$t("desc")}}</th>
                  <th class="text-center" width="15%">{{$t("buy_price")}}</th>
                  <th class="text-center" width="15%">{{$t("sell_price")}}</th>
                  <th class="text-center" width="13%">{{$t("available")}}</th>
                  <th :class="$i18n.locale=='ar'?'text-left':'text-right'" width="15%">{{ $t("actions") }}</th>
                </thead>
                <tbody>
                  <tr
                    style="cursor: pointer;"
                    v-for="(product,index) in filteredProducts"
                    :ref="product.id"
                    :key="product.id"
                    @click="editProduct(product.id,$event)"
                  >
                    <td>{{(currentPage-1)*pageMax + index+1}}</td>
                    <td>
                      <div class="row">
                        <div  :class="$i18n.locale=='ar'?'text-left':'text-right'" class="col-xs-3 ">
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
                        <div :class="$i18n.locale=='ar'?'text-right':'text-left'"  class="col-xs-6 trim-text">{{product.name}}</div>
                      </div>
                    </td>
                    <td class="text-center">
                      <div style="max-height: 80px;overflow-y: auto;">{{product.desc}}</div>
                    </td>
                    <td class="text-center">{{product.buy_price}} {{$t(currency.toLowerCase())}}</td>
                    <td class="text-center">{{product.sell_price}} {{$t(currency.toLowerCase())}}</td>
                    <td class="text-center">{{product.unit=='piece'? product.qte:product.weight}} {{product.unit=='piece'? $t('piece'):($t(product.unit.toLowerCase())).toUpperCase()}}</td>
                    <td :class="$i18n.locale=='ar'?'text-left':'text-right'">
                      <button @click="editProduct(product.id,$event)" class="btn btn-success btn-icon">
                        <i class="ti-pencil"></i>
                      </button>
                      <button @click="deleteProduct(product.id,$event)" class="btn btn-danger btn-icon">
                        <i class="ti-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-if="products.length > pageMax" class="row text-center">
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
              <h3>{{$t("no_products_found")}}</h3>
              <p
                style="margin-bottom:50px"
                class="category"
                @click="searchText=''"
                v-if="products.length > 0"
              >{{$t("clear_to_see_products")}}</p>
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
import { Product } from './models.js'

var { ipcRenderer, remote } = require('electron')
const { dialog } = require('electron').remote

export default {
  name: 'Products',
  components: {
    vPagination,
    Avatar
  },
  created () {
    console.log('created')
    this.products = store.getters.products
    this.currency = store.getters.user.currency
      ? store.getters.user.currency
      : 'DZD'
    console.log(this.products)

    this.filterProducts()
  },
  activated () {
    console.log('activated')
    this.products = store.getters.products
    console.log(this.products)
    this.filterProducts()
    this.customLabels = {
      first: this.$t('first'),
      prev: this.$t('previous'),
      next: this.$t('next'),
      last: this.$t('last')
    }
  },
  deactivated () {
    $('tr').removeClass('animated')
    $('tr').removeClass('pulse')
    $('tr').removeClass('fadeOutLeft')
  },
  mounted () {
    /* let myNotification = new Notification('Title', {
              body: 'Lorem Ipsum Dolor Sit Amet'
            }) */
  },
  data () {
    return {
      currentPage: 1,
      pageMax: 7.0,
      currentCount: 0,
      products: [],
      filteredProducts: [],
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
    zoomImage (path) {
      // todo
    },
    isNotEmpty (str) {
      if (str != null && str != '') {
        return true
      }
      return false
    },
    addProduct () {
      this.$router.push('/new-product')
    },

    editProduct (id, event) {
      event.stopPropagation()
      $('tr').removeClass('animated pulse')
      setTimeout(() => {
        $(this.$refs[id]).addClass('animated pulse')
        this.$router.push({ name: 'edit_product', params: { id: id } })
      }, 250)
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
    deleteProduct (id, event) {
      // animate the product row
      event.stopPropagation()
      let res = dialog.showMessageBox({
        message: this.$t('delete_product_confirm'),
        type: 'question',
        buttons: [this.$t('ok'), this.$t('cancel')],
        defaultId: 0,
        cancelId: 1
      })
      if (res == 0) {
        $(this.$refs[id]).addClass('animated fadeOutLeft')

        setTimeout(() => {
          store.dispatch('deleteProduct', id)
          this.products = JSON.parse(JSON.stringify(store.getters.products))
          if (this.filteredProducts.length == 1) {
            this.currentPage = this.currentPage != 0 ? this.currentPage - 1 : 1
          } else {
            this.filterProducts()
          }
        }, 500)
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

/* .list-enter,
.list-leave-to .main-panel {
  padding: 9px;
} */
.main-panel {
  /*   border: 10px solid white;
    border-radius: 25px;*/
  padding: 9px;
}

th {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 16px;
  font-weight: 400;
}

input[type="text"] {
  width: 30%;
  -webkit-transition: width 0.4s ease-in-out;
  transition: width 0.4s ease-in-out;
}

/* When the input field gets focus, change its width to 100% */
input[type="text"]:focus {
  width:calc(100% - 170px)
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
</style>