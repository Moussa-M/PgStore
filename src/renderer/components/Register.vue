<template>
  <div class="row center-block">
    <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 mx-auto">
      <img src="static/logo.png" width="100px" height="auto">
      <h2 class="title">{{$t("registration")}}</h2>
      <h5 class="title">{{$t("welcome")}}</h5>
       <lang-changer></lang-changer>
    </div>
    <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8 mx-auto">
      <div class="card">
        <div class="header">
          <div v-if="errors.length">
            <p>
            <b>{{ $t("correct_errors") }}</b>
            </p>
            <ul>
              <li class="error" v-for="error in errors" :key="error">
                <p>
                  {{ error }}
                  </p>
                  </li>
            </ul>
          </div>
        </div>
        <div class="content">
          <form @submit="register" novalidate="true">
            <p>{{$t("store_info")}}</p>
            <div style="margin-bottom:10px;border-bottom: 2px solid lightgrey;"></div>
            <div v-show="true" class="row">
              <div class="col-md-6">
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
              <div class="col-md-6">
                <div class="form-group">
                  <label>{{$t("store_phone")}}</label>
                  <input
                    type="text"
                    dir="ltr"
                    class="form-control border-input"
                    v-model="storephone"
                    :placeholder="$t('store_phone')"
                    value
                  >
                </div>
              </div>
            </div>
            <div class="row">
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
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>{{$t("currency")}}</label>
                  <select class="form-control border-input" v-model="currency" value="DZD">
                    <option value="DZD">{{$t('dzd')}}</option>
                    <option value="USD">{{$t('usd')}}</option>
                    <option value="EUR">{{$t('eur')}}</option>
                  </select>
                </div>
              </div>
            </div>
            <br>
            <p>{{$t("account_info")}}</p>
            <div style="margin-bottom:10px;border-bottom: 2px solid lightgrey;"></div>
            <div class="row">
              <div class="col-md-6">
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
              <div class="col-md-6">
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
            <div class="row">
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
            <div class="text-center">
              <button type="submit" class="btn btn-outline-primar btn-block btn-lg">
                <font-awesome-icon icon="sign-in-alt"/>
                {{$t("register")}}
              </button>
            </div>
            <div class="clearfix"></div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import LangChanger from './ChangeLang.vue'
export default {
  name: "Register",
    components: {
    LangChanger
  },
  computed: {
    passwordType() {
      return this.hidePassword ? "password" : "text";
    },
    passwordIcon() {
      return this.hidePassword ? "eye" : "eye-slash";
    }
  },
  created: function() {
    // `this` points to the vm instance
    // console.log(window.store);
  },
  data: function() {
    return {
      hidePassword: true,
      errors: [],
      storename: null,
      storephone: null,
      storeaddress: null,
      email: null,
      password: null,
      username: null,
      currency: "DZD"
    };
  },
  methods: {
    register: function(e) {
      e.preventDefault();
      this.errors = [];

      if (!this.storename) {
        this.errors.push(this.$t("store_name_required"));
      }

      if (!this.username) {
        this.errors.push(this.$t("user_name_required"));
      }
      if (!this.password) {
        this.errors.push(this.$t("password_required"));
      }
      if (!this.validEmail(this.email)) {
        this.errors.push(this.$t("email_required"));
      }
      // console.log("clicker");

      if (this.errors.length == 0) {
        window.store.dispatch("user", {
          lang: "ar",
          storename: this.storename,
          storeaddress: this.storeaddress,
          storephone: this.storephone,
          username: this.username,
          storelogo: "",
          email: this.email,
          password: this.password,
          currency: this.currency
        });
        window.store.dispatch("is_logged_in", true);
        window.store.dispatch("is_registered", true);
        // console.log(window.store);
        this.$router.push({ name: "activation" });
        return true;
      } else {
        return true;
      }
    },
    validEmail: function(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.error {
  color: #ff5722;
}
.errspanLTR {
  float: right;
  color: grey;
  font-size: 20px;
  margin-right: 6px;
  margin-top: -30px;
  position: relative;
  z-index: 2;
}
.errspanRTL {
  float: left;
  color: grey;
  font-size: 20px;
  margin-left: 6px;
  margin-top: -30px;
  position: relative;
  z-index: 2;
}
</style>