<template>
  <div class="wrapper">
    <div class="main-panel" :style="{'float':$i18n.locale=='ar' ? 'left':'right'}">
      <nav class="navbar navbar-default">
        <div class="nav-container">
          <div class="navbar-header" style="display: inline-flex;">
                    <a class="navbar-brand">{{ $route.query.is_supplier ? $t("edit_supplier"):$t("edit_customer")}}</a>
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
            <ErrorPanel :errors="errors"/>
              <div class="content" style="padding: 0px">
                <form novalidate="true">
                  <div class="row center-block text-center">
                    <div class="col-md-12">
                      <div class="form-group">
                        <Avatar
                          :image="isNotEmpty(customer.image) ? customer.image:'static/assets/img/faces/avatar.png'"
                          :width="300"
                          :height="300"
                          :crop="true"
                          :removeable="true"
                          @dataURL="processDataUrl"
                          @removed="imageRemoved"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label>{{ $t("name") }}</label>
                        <input
                        :disabled="parseInt(customer.id) == 1"
                          type="text"
                          class="form-control border-input"
                          v-model="customer.name"
                          :placeholder="$t('name')"
                          value
                        >
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label>{{ $t("phone") }}</label>
                        <input
                          type="text"
                          :disabled="parseInt(customer.id) == 1"
                          class="form-control border-input"
                          v-model="customer.phone"
                          dir="ltr"
                          :placeholder="$t('phone')"
                          value
                        >
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label>{{ $t("sex") }}</label>
                        <select  :disabled="parseInt(customer.id) == 1" class="form-control border-input" v-model="customer.sex" value="m">
                          <option value="m">{{ $t("m") }}</option>
                          <option value="f">{{ $t("f") }}</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="exampleInputEmail1">{{ $t("email_address") }}</label>
                        <input
                        :disabled="parseInt(customer.id) == 1"
                          type="email"
                          class="form-control border-input"
                          v-model="customer.email"
                          :placeholder="$t('email_address')"
                        >
                      </div>
                    </div>
                  </div>
                        <div  class="row">
                    <div v-if="!$route.query.is_supplier"  class="col-md-6">
                      <div class="form-group">
                        <label>{{ $t("discount") }} ({{$t("discount_of_total_amount")}})</label>
                        <div class="input-group">
                          <input
                            type="number"
                            max="100"
                            min="0"
                            step="0.01"
                            @change="customer.discount = parseFloat(customer.discount).toFixed(2)"
                            class="form-control border-input animated"
                            v-model="customer.discount"
                            :placeholder="$t('discount')"
                          >
                          <span class="input-group-addon">%</span>
                        </div>
                      </div>
                    </div>
                     <div v-if="$route.query.is_supplier"  class="col-md-6">
                      <div class="form-group">
                        <label>{{ $t("address") }} </label>
         
                          <input
                            type="text"

                            class="form-control border-input animated"
                            v-model="customer.address"
                            :placeholder="$t('address')"
                          >
       
                    
                      </div>
                    </div>
                  </div>

                  <div :class="$i18n.locale=='ar'?'text-left':'text-right'">
                    <button @click="save" type="submit" class="btn btn-lg">{{$t("update")}}</button>
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
import { Customer } from './models.js'
import Avatar from './sub_components/Avatar.vue'
const nativeImage = require('electron').nativeImage
const { app } = require('electron').remote
const fs = require('fs-extra')
const path = require("path")
export default {
  name: 'EditCustomer',
  props: {
    id: [Number, String]
  },
  components: {Avatar},
  created: function () {
    this.customer = JSON.parse(JSON.stringify(store.getters.getCustomer(this.id)))
  },
  deactivated () {
    this.$destroy()
  },

  data: function () {
    return {
      hidePassword: true,
      errors: [],
      customer: {}
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
    removeImage () {
      this.customer.image = null
    },
      processFile (e) {
      console.log(e)
      let ext = path.extname(e)
      let newpath =
        app.getAppPath().replace('app.asar', 'images\\customers\\') +
        Math.random()
          .toString()
          .substring(2) +
        ext
      fs.ensureFileSync(newpath)
      let image = nativeImage
        .createFromPath(e)
        .resize({ width: 124, height: 124 })
      fs.writeFile(
        newpath,
        Buffer.from(
          image.toDataURL().substring(image.toDataURL().indexOf(',') + 1),
          'base64'
        ),
        err => {
          if (err) throw err

          console.log('The file was succesfully saved!')
        }
      )
      this.customer.image = newpath
    },
    imageRemoved () {
      this.customer.image = null
    },
 processDataUrl (data) {
      console.log('data here')
      console.log(data)
      let reg = /\/\w+\;/
      let ext = reg.exec(data.substring(0, data.indexOf(',') + 1))[0]
        .replace(';', '')
        .replace('/', '')
      console.log('app.getAppPath()')
      console.log(app.getAppPath())
      let newpath =
        app.getAppPath().replace('app.asar', '') +
        'images\\customers\\' +
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
      this.customer.image = newpath
    },
    goBack () {
      this.$router.go(-1)
    },
    save: function (e) {
      e.preventDefault()
      this.errors = []
      console.log(this.customer)
      if (!this.customer.name) {
        this.errors.push(this.$t('name_required'))
      }
      if (!this.customer.phone && parseInt(this.customer.id) != 1) {
        this.errors.push(this.$t('phone_required'))
      }
      if (!this.customer.discount) {
        this.customer.discount = 0
      } else {
        if (!_.isNumber(parseFloat(this.customer.discount))) {
          this.errors.push(this.$t('discount_required_number'))
        }
      }
      if (this.customer.email) {
        if (!this.validEmail(this.customer.email)) {
          this.errors.push(this.$t('email_required'))
        }
      }

      if (this.errors.length == 0) {
        store.dispatch('updateCustomer', this.customer)
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
/* 
.wrapper::-webkit-scrollbar {
  width: 0em;
} */

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