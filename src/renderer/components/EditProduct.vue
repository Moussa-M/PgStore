<template>
  <div class="wrapper">
    <div class="main-panel" :style="{'float':$i18n.locale=='ar' ? 'left':'right'}">
      <nav class="navbar navbar-default">
        <div class="nav-container">
          <div class="navbar-header" style="display: inline-flex;">
            <a class="navbar-brand">{{$t("edit_product")}}</a>
          </div>
          <ul class="nav navbar-nav navbar-right" style="margin-right: 0px">
            <li>
              <a class="btn btn-danger btn-circle" @click="goBack">
                <i class="ti-close"></i>
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <div class="content" style="padding: 15px">
         <div class="container-fluid center-block" style="width:60%">
          <div class="tab-content">
            <div class="card">
              <div class="header">
                <div v-if="errors.length">
                  <p>
                    <b>{{ $t("correct_errors") }}</b>
                  </p>
                  <ul>
                    <li class="error" v-for="error in errors" :key="error">
                      {{ error }}
                    </li>
                  </ul>
                </div>
              </div>
              <div class="content" style="padding: 0px">
                <form novalidate="true">
                   <div class="row center-block text-center">
                    <div class="col-md-12">
                      <div class="form-group">
                        <Avatar
                          :image="isNotEmpty(product.image) ? product.image:'static/assets/img/faces/product.png'"
                          :width="400"
                          :height="400"
                          :crop="true"
                          :removeable="true"
                          @removed="removeImage"
                          @dataURL="processDataUrl"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label>{{ $t("name") }}</label>
                        <input
                          type="text"
                          class="form-control border-input"
                          v-model="product.name"
                          placeholder="Product name"
                          value
                        >
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label>{{$t("desc")}}</label>
                        <input
                          type="text"
                          class="form-control border-input"
                          v-model="product.desc"
                          :placeholder="$t('product_desc')"
                          value
                        >
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-4">
                      <div class="form-group">
                        <label>{{$t("unit")}}</label>
                        <select class="form-control border-input" v-model="product.unit" value="piece">
                          <option value="oz">{{$t("oz")}}</option>
                          <option value="g">{{$t("g")}}</option>
                          <option value="kg">{{$t("kg")}}</option>
                          <option value="l">{{$t("l")}}</option>
                          <option value="piece">{{$t("piece")}}</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <transition name="slide-fade-fast" mode="out-in">
                          <label v-if="product.unit=='piece'" key="qte">{{$t("qte")}}</label>
                          <label v-else key="weight">{{$t("weight")}}</label>
                        </transition>
                        <div class="input-group">
                          <input
                            v-if="product.unit=='piece'"
                            type="number"
                            min="0"
                            step="1"
                            @change="product.qte = parseInt(product.qte.toString())"
                            class="form-control border-input animated"
                            v-model="product.qte"
                            :placeholder="$t('qte')"
                            value="1"
                          >
                          
                          <input
                            v-else
                            type="number"
                            min="0.00"
                            step="0.1"
                            @change="product.weight=parseFloat(product.weight)"
                            class="form-control border-input animated"
                            v-model="product.weight"
                            :placeholder="$t('weight')"
                            value
                          >

                          <transition name="slide-fade-fast" mode="out-in">
                            <span
                              :key="product.unit"
                              class="input-group-addon"
                            >{{$t(product.unit.toLowerCase())}}</span>
                          </transition>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <label>{{ $t("discount") }}</label>
                        <div class="input-group">
                          <input
                            type="number"
                            max="100"
                            min="0"
                            step="0.1"
                            @change="product.discount = parseFloat(product.discount).toFixed(2)"
                            class="form-control border-input animated"
                            v-model="product.discount"
                            :placeholder="$t('discount')"
                            value="0"
                          >
                          <span class="input-group-addon">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label :key="product.unit">{{$t('buy_price')}} (
                          <transition name="slide-fade-fast" mode="out-in">
                            <span :key="product.unit">{{ $t(product.unit.toLowerCase()) }})</span>
                          </transition>
                        </label>

                        <div class="input-group">
                          <input
                            type="number"
                            min="0.00"
                            class="form-control border-input"
                            v-model="product.buy_price"
                            :placeholder="$t('buy_price')"
                            value
                          >
                          <span class="input-group-addon" id="basic-addon1">{{$t(currency)}}</span>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="exampleInputEmail1">{{$t('sell_price')}} (
                          <transition name="slide-fade-fast" mode="out-in">
                            <span :key="product.unit">{{ $t(product.unit.toLowerCase()) }})</span>
                          </transition>
                        </label>
                        <div class="input-group">
                          <input
                            type="number"
                            min="0.00"
                            class="form-control border-input"
                            v-model="product.sell_price"
                            :placeholder="$t('sell_price')"
                          >
                          <span class="input-group-addon" id="basic-addon1">{{$t(currency)}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                 
                  <div :class="$i18n.locale=='ar'?'text-left':'text-right'">
                    <button @click="save" type="submit" class="btn">{{$t("save")}}</button>
                  </div>
                  <div class="clearfix"></div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Quantity from './sub_components/Quantity.vue'
import { Product } from './models.js'
import Avatar from './sub_components/Avatar.vue'
const nativeImage = require('electron').nativeImage
const { app } = require('electron').remote
const fs = require('fs-extra')

export default {
  name: 'EditOrder',
  props: {
    id: Number
  },
  components: {
    Quantity,
    Avatar
  },
  created: function () {
    this.products = store.getters.products
    this.currency = store.getters.user.currency
    this.product = JSON.parse(JSON.stringify(store.getters.getProduct(this.id)))
    this.product.unit = this.product.unit.toLowerCase()
    console.log(this.product)
  },

  deactivated () {
    this.$destroy()
  },
  data: function () {
    return {
      hidePassword: true,
      errors: [],
      products: [],
      product: {},
      currency: null
    }
  },
  watch: {},
  methods: {
    isNotEmpty (str) {
      if (str != null && str != '') {
        return true
      }
      return false
    },
    productNameExists (name) {
      var found = false
      this.products = _.forEach(this.products, p => {
        if (p.name == name && p.id != this.id) {
          found = true
        }
      })
      return found
    },
    removeImage () {
      this.product.image = null
    },

    processDataUrl (data) {
      let reg = /\/\w+\;/
      let ext = reg
        .exec(data.substring(0, data.indexOf(',') + 1))[0]
        .replace(';', '')
        .replace('/', '')
      let newpath =
         app.getAppPath().replace('app.asar', 'images\\products\\') +
        Math.random()
          .toString()
          .substring(2) +
        '.' +
        ext
      fs.ensureFileSync(newpath)
      fs.writeFile(
        newpath,
        Buffer.from(data.substring(data.indexOf(',') + 1), 'base64'),
        err => {
          if (err) throw err

          console.log('The file was succesfully saved!')
        }
      )
      this.product.image = newpath
    },

    goBack () {
      this.$router.go(-1)
    },
    save (e) {
      console.log(this.product)
      e.preventDefault()
      this.errors = []

      if (!this.product.name) {
        this.errors.push(this.$t('name_required'))
      } else {
        if (this.productNameExists(this.product.name)) {
          this.errors.push(this.$t('name_used'))
        }
      }
      if (!this.product.sell_price) {
        this.errors.push(this.$t('sell_price_required'))
      } else {
        if (!_.isNumber(parseFloat(this.product.sell_price))) {
          this.errors.push(this.$t('sell_price_required_number'))
        }
      }
      if (!this.product.buy_price) {
        this.errors.push(this.$t('buy_price_required'))
      } else {
        if (!_.isNumber(parseFloat(this.product.buy_price))) {
          this.errors.push(this.$t('buy_price_required_number'))
        }
      }

      if (!this.product.unit) {
        this.errors.push(this.$t('unit_required'))
      } else {
        if (this.product.unit == 'piece') {
          if (!this.product.qte) {
            this.errors.push(this.$t('qte_required'))
          } else {
            if (!_.isNumber(parseInt(this.product.qte))) {
              this.errors.push(this.$t('qte_required_number'))
            }
          }
        } else {
          if (!this.product.weight) {
            this.errors.push(this.$t('weight_required'))
          } else {
            if (!_.isNumber(parseFloat(this.product.weight))) {
              this.errors.push(this.$t('weight_required_number'))
            }
          }
        }
      }

      if (this.errors.length == 0) {
        store.dispatch('updateProduct', this.product)
        this.goBack()
        return true
      } else {
        return true
      }
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

/* .wrapper::-webkit-scrollbar {
  width: 0em;
} */

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
  overflow-x: scroll;

  /*flex-wrap:wrap;*/
}
.box {
  flex: 1;
  -webkit-flex: 1;
  min-width: 200px;
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
</style>