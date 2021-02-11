<template>
  <div class="row center-block">
    <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 mx-auto">
      <img src="static/assets/logo.png" width="100px" height="auto" />
            <h2 class="title ">{{$t("activation")}}</h2>
            <h5 class="title ">{{$t("enter_act_key")}}</h5>

            <div v-if="!is_trail">
                   <p>{{$t("you_can_try_demo")}}</p>
             <button v-if="trail_days_left>0" type="button" @click="demo()" :disabled="is_loading" class="btn btn-outline-primar btn-warning">
                  <font-awesome-icon icon="sign-in-alt"/> {{$t("demo")}}
                </button>
            </div>
            <div v-else>
               <button v-if="trail_days_left>0" type="button" @click="demo()" :disabled="is_loading" class="btn btn-outline-primar btn-warning">
                  <font-awesome-icon icon="sign-in-alt"/> {{$t("demo")}}
                </button>
            </div>
            <br/>
            <p style="user-select: text;">{{$t("for_info_contact_us")}} m_mokhtari@esi.dz</p>
            
         
    </div>
    <div class="col-xs-8 col-sm-8 col-md-6 col-offset-md-2 col-offset-lg-3 col-lg-5 mx-auto">
      <!-- <h2 class="title text-center">{{$t("activation")}}</h2> -->
      <div class="card">
       <ErrorPanel :errors="errors"/>
        <div class="content">
          <form @submit="activate" novalidate="true">
            <div v-show="true" class="row">
              <div class="col-md-12">
                <div class="form-group">
                  <!-- <label style="font-size=20px!important">Please enter your activation key</label> -->
                  <input
                    type="text"
                    class="form-control border-input keyinput"
                    v-model="token"
                    style="text-align:center"
                    :placeholder="$t('key_activation')"
                    :disabled="is_loading"
                    :maxlength="getMaxLength()"
                    @keyup="splitToken()"
                  >
                   <font-awesome-icon v-if="is_loading" class="loading fa-spin" icon="circle-notch" />
                </div>
              </div>
            </div>

            <div  class="text-center">
              <button @click="activate" type="submit" :disabled="is_loading" class="btn btn-outline-primar btn-block btn-default">
                <font-awesome-icon icon="sign-in-alt"/> {{$t("activate")}}
              </button>
              <br>
              <br>
              <div v-if="is_trail && trail_days_left > 0" class="alert alert-info">
              <h4>{{ $t("you_have_left",{days:trail_days_left})}}</h4>
              </div>
              
              <!-- <p>Try the 30 days trail version</p>
                <button type="button" @click="demo()" :disabled="is_loading" class="btn btn-outline-primar btn-warning">
                  <font-awesome-icon icon="sign-in-alt"/> Demo
                </button> -->
            </div>
            <div v-if="trail_days_left<0" class="text-center ">
             
              <div class="alert alert-warning">
              <h4>{{$t("trail_expired")}}</h4>
              </div>
            </div>
            <div class="clearfix"></div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { diffInDays } from './utils.js'
const si = require('systeminformation')

export default {
  name: 'Activation',

  created () {
    si.system().then((info) => {
      this.serial = info.serial
    })
    this.email = store.getters.user.email

    this.trail_days_left = 30 - diffInDays(new Date(window.store.getters.first_opened), new Date())
    this.is_trail = window.store.getters.is_trail
  },
  deactivated () {
    this.$destroy()
  },
  data: function () {
    return {
      errors: [],
      token: "",
      serial: null,
      email: null,
      is_loading: false,
      trail_days_left: 0,
      is_trail: false
    }
  },
  methods: {
    getMaxLength(){
      console.log("leeeeee")
      if(this.token.match(/\-/g)){
          return 20+this.token.match(/\-/g).join('').length;
      }else{
          return 24;
      }
     
      
    },
    demo (e) {
      window.store.dispatch('is_trail', true)
      this.$router.push('home')
    },
    splitToken () {
      if (this.token.length >= 4) {
        var numbers = this.token.match(/\w/g).join('')
        console.log("token" + this.token)
        console.log("numbers")
        console.log(numbers)
        var splited = numbers.match(/\w{1,4}/g)
        console.log("splited")
        console.log(splited)
        this.token = splited.join('-')
        console.log("this.token")
        console.log(this.token)
      }
    },
    activate (e) {
      e.preventDefault()
      this.is_loading = true
      this.errors = []

      if (!this.token) {
        this.errors.push(this.$t('key_is_required'))
      }

      if (this.errors.length == 0) {
        window.store.dispatch('activate', {
          'key_attempt': this.token.match(/\w{1,4}/g).join(''),
          'serial_number': this.serial,
          'product_name': 'MyStore-1.0.0',
          'email': this.email
        })
          .then(response => {
            this.is_loading = false
            if (response.data['STATUS'] == 'VALID_KEY') {
              window.store.dispatch('is_activated', true)
              window.store.dispatch('is_logged_in', true)
              window.store.dispatch('is_activated', true)
              this.$router.push('home')
            } else {
              this.errors.push(this.$t('unvalid_key'))
            }
          })
          .catch((error) => {
            this.is_loading = false
            console.log(error.response)
            this.errors.push(this.$t('unvalid_key'))
          })

        return true
      } else {
        this.is_loading = false
        return true
      }
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.keyinput {
  font-size: 25px !important;
  text-align: center;
}
.loading {
  float: right;
  color: grey;
  font-size: 25px;
  margin-right: 6px;
  margin-top: -36px;
  position: relative;
  z-index: 2;
}
</style>