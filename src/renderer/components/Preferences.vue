<template>
  <div class="wrapper">
    <div class="main-panel">
      <nav class="navbar navbar-default">
        <div class="nav-container">
          <div class="navbar-header" style="display: inline-flex;">
            <a class="navbar-brand">{{$t("settings")}}</a>
          </div>
          <ul class="nav navbar-nav navbar-right" style="margin-right: 0px">
            <li>
              <a class="btn btn-danger btn-circle" @click="goBack">
                <i class="ti-close"></i>
              </a>
            </li>
          </ul>

          <!--  <ul class="nav nav-tabs">
                          <li class="active"><a data-toggle="tab" href="#home">Preferences</a></li>
                          <li><a data-toggle="tab" href="#menu1">Profile</a></li>
          </ul>-->
        </div>
      </nav>
      <div class="content center-block">
        <div class="container-fluid">
          <!--   <div class="tab-content" id="pills-tabContent">
                        <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">home...</div>
                        <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">profile...</div>
          </div>-->
          <div class="tab-content">
            <!--   <div id="home" class="tab-pane fade in active">
    <h3>HOME</h3>
    <p>Some content.</p>
            </div>-->
            <!--   <div id="menu1" class="tab-pane fade">
            </div>-->
            <div class="card">
              <div class="header">
                <div v-if="errors.length">
                  <b>{{ $t("correct_errors") }}</b>
                  <ul>
                    <li class="error" v-for="error in errors" :key="error">{{ error }}</li>
                  </ul>
                </div>
              </div>
              <div class="content" style="padding: 0px">
                <form novalidate="true">
                  <p>{{$t("comercial_info")}}</p>
                  <div style="margin-bottom:10px;border-bottom: 2px solid lightgrey;"></div>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="col-md-12">
                        <div class="form-group">
                          <label>{{$t("store_name")}}</label>
                          <input
                            type="text"
                            class="form-control border-input"
                            v-model="storename"
                            :placeholder="$t('store_name')"
                            value
                          >
                        </div>
                      </div>
                      <div class="col-md-12">
                        <div class="form-group">
                          <label>{{$t("store_phone")}}</label>
                          <input
                            type="text"
                            class="form-control border-input"
                            v-model="storephone"
                            dir="ltr"
                            :placeholder="$t('store_phone')"
                            value
                          >
                        </div>
                      </div>
                      <div class="col-md-12">
                        <div class="form-group">
                          <label>{{$t("store_address")}}</label>
                          <input
                            type="text"
                            class="form-control border-input"
                            v-model="storeaddress"
                            :placeholder="$t('store_address')"
                            value
                          >
                        </div>
                      </div>
                      <div class="col-md-12">
                        <div class="form-group">
                          <label>{{$t('currency')}}</label>
                          <select class="form-control border-input" v-model="currency" value="DZD">
                            <option value="DZD">{{$t('dzd')}}</option>
                            <option value="USD">{{$t('usd')}}</option>
                            <option value="EUR">{{$t('eur')}}</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label>{{$t("store_logo")}}</label>
                        <Avatar
                          :image="storelogo"
                          :width="200"
                          :height="200"
                          :crop="true"
                          :removeable="true"
                          @removed="imageRemoved"
                          @dataURL="processDataUrl"
                        />
                      </div>
                    </div>
                  </div>

                  <br>
                  <p>{{$t("account_info")}}</p>
                  <div style="margin-bottom:10px;border-bottom: 2px solid lightgrey;"></div>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="col-md-12">
                        <div class="form-group">
                          <label>{{$t("user_name")}}</label>
                          <input
                            type="text"
                            class="form-control border-input"
                            v-model="username"
                            :placeholder="$t('user_name')"
                            value
                          >
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="col-md-12">
                        <div class="form-group">
                          <label for="exampleInputEmail1">{{ $t("email_address") }}</label>
                          <input
                            type="email"
                            class="form-control border-input"
                            v-model="email"
                            :placeholder="$t('email_address')"
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="col-md-12">
                        <div class="form-group">
                          <label>{{$t("password")}}</label>
                          <input
                            :type="passwordType"
                            class="form-control border-input"
                            v-model="password"
                            :placeholder="$t('password')"
                            value
                          >
                          <font-awesome-icon
                             :class="$i18n.locale=='ar'?'errspanRTL':'errspanLTR'"
                            :icon="passwordIcon"
                            @click="hidePassword = !hidePassword"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="col-md-12">
                        <div class="form-group">
                          <lang-changer></lang-changer>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div :class="$i18n.locale=='ar'?'text-left':'text-right'">
                    <button @click="update" type="submit" class="btn">{{$t("done")}}</button>
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
import Avatar from './sub_components/Avatar.vue'
import LangChanger from './ChangeLang.vue'
const nativeImage = require('electron').nativeImage
const { app } = require('electron').remote
const fs = require('fs-extra')
const path = require('path')
export default {
  name: 'Preferences',
  components: {
    Avatar,
    LangChanger
  },
  created: function () {
    console.log('pref created ')
    let user = window.store.getters.user
    this.storename = user.storename
    this.storephone = user.storephone
    this.storeaddress = user.storeaddress
    this.storelogo = user.storelogo
    this.email = user.email
    this.username = user.username
    this.password = user.password
    this.currency = user.currency
  },
  deactivated () {
    this.$destroy()
  },
  data: function () {
    return {
      hidePassword: true,
      errors: [],
      storename: null,
      storephone: null,
      storeaddress: null,
      storelogo: null,
      email: null,
      password: null,
      username: null,

      currency: null
    }
  },
  computed: {
    passwordType () {
      return this.hidePassword ? 'password' : 'text'
    },
    passwordIcon () {
      return this.hidePassword ? 'eye' : 'eye-slash'
    }
  },
  methods: {
    imageRemoved () {
      this.storelogo = null
    },
    processDataUrl (data) {
      console.log(__dirname)

      console.log(app.getPath('exe'))
      let reg = /\/\w+\;/
      let ext = reg
        .exec(data.substring(0, data.indexOf(',') + 1))[0]
        .replace(';', '')
        .replace('/', '')

      // let newpath = path.join(app.getPath("exe").replace('MyStore.exe','images'),'logo_'+_.sampleSize("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 3).join(""),'.'+ext);
      let newpath =
        app.getAppPath().replace('app.asar', 'images\\') +
        'logo_' +
        _.sampleSize('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 3).join('') +
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
      this.storelogo = newpath
      console.log('this.storelogo')
      console.log(this.storelogo)
    },
    goBack () {
      this.$router.go(-1)
      // this.$emit('prefclose');

      /*     window.history.length > 1 ?
                     this.$router.go(-1) :
                     this.$router.push('/') */
    },
    update: function (e) {
      e.preventDefault()
      this.errors = []

      if (!this.storename) {
        this.errors.push(this.$t('store_name_required'))
      }
      if (!this.username) {
        this.errors.push(this.$t('user_name_required'))
      }
      if (!this.password) {
        this.errors.push(this.$t('password_required'))
      }
      if (!this.validEmail(this.email)) {
        this.errors.push(this.$t('email_required'))
      }
      console.log('clicker')

      if (this.errors.length == 0) {
        window.store.dispatch('user', {
          lang: this.$i18n.locale,
          storename: this.storename,
          storephone: this.storephone,
          storeaddress: this.storeaddress,
          storelogo: this.storelogo,
          username: this.username,
          email: this.email,
          password: this.password,
          currency: this.currency
        })
        window.store.dispatch('is_logged_in', true)
        window.store.dispatch('is_registered', true)
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
</style>