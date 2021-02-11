<template>
  <div class="wrapper">
    <div class="main-panel" :style="{'float':$i18n.locale=='ar' ? 'left':'right'}">
      <nav class="navbar navbar-default">
        <div class="nav-container">
          <div class="navbar-header" style="display: inline-flex;">
            <a class="navbar-brand">{{$t("new_employee")}}</a>
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
        <div class="container-fluid center-block" style="width:90%">
          <div class="tab-content" style="width:80%">
            <div class="card">
              <ErrorPanel :errors="errors"/>
              <div class="content" style="padding: 0px">
                <div class="row">
                  <div class="col-md-6" style="-webkit-border-end: 1px solid #d6cece;">
                        <form novalidate="true">
                  <div class="row  ">
                    <div class="col-md-12">
                      <div class="form-group">
                        <Avatar
                          image="static/assets/img/faces/avatar.png"
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
                          type="text"
                          class="form-control border-input"
                          v-model="employee.name"
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
                          class="form-control border-input"
                          v-model="employee.phone"
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
                                <label>{{ $t("password") }}</label>
                                <input :type="passwordType" class="form-control border-input" v-model="employee.password" :placeholder="$t('password')" value="">
                                <font-awesome-icon :class="$i18n.locale=='ar'?'errspanRTL':'errspanLTR'" :icon="passwordIcon" @click="hidePassword = !hidePassword" />
                            </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label>{{ $t("sex") }}</label>
                        <select class="form-control border-input" v-model="employee.sex" value="m">
                          <option value="m">{{ $t("m") }}</option>
                          <option value="f">{{ $t("f") }}</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <label for="exampleInputEmail1">{{ $t("email_address") }}</label>
                        <input
                          type="email"
                          class="form-control border-input"
                          v-model="employee.email"
                          :placeholder="$t('email_address')"
                        >
                      </div>
                    </div>
                  </div>
                        </form>
                  </div>
                  <div class="col-md-6">
                        <form novalidate="true">
                 
                  <div class="row">
                     <div class="col-md-12">
                      <label>{{ $t("allowed_actions") }}</label>
                    <v-combobox
                          v-model="employee.allowed_actions"
                          :items="all_actions"
                          :menu-props="{ maxHeight: '500' }"
                          :label="$t('select_actions')"
                          multiple
                          attach
                          solo
                          dense
                          full-width
                          chips
                          flat
                          color="#ffd700"
                          clearable
                      
                        > 
                        <template v-slot:prepend-item>
                          <v-list-tile
                            ripple
                            @click="toggleInventoryManagerActionsSet"
                          >
                       
                            <v-list-tile-content>
                              <v-list-tile-title>{{$t("stock_manager_actions")}}</v-list-tile-title>
                            </v-list-tile-content>
                          </v-list-tile>
                          <v-divider class="mt-1 mb-1"></v-divider>
                            <v-list-tile
                            ripple
                            @click="toggleSellerActionsSet"
                          >
                       
                            <v-list-tile-content>
                              <v-list-tile-title>{{$t("seller_actions")}}</v-list-tile-title>
                            </v-list-tile-content>
                          </v-list-tile>
                          <v-divider class="mt-1"></v-divider>
                        </template>
                      
                        </v-combobox>
                  </div>
                  </div>
                  <!-- <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label>{{ $t("type") }}</label>
                        <select class="form-control border-input" v-model="employee.type" value="manager">
                          <option value="admin">{{ $t("admin") }}</option>
                          <option value="manager">{{ $t("manager") }}</option>
                          <option value="seller">{{ $t("seller") }}</option>
                        </select>
                      </div>
                    </div>
                  </div> -->
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <label>{{ $t("shift_starting_time") }}</label>
                         <v-menu
                          ref="picker1"
                          v-model="picker1"
                          :close-on-content-click="false"
                           attach
                           full-width
                           :top="false"
                   
                          lazy
                          transition="scale-transition"
                          offset-y
                          :return-value.sync="employee.shift_starting_date"
                        
          
                        >
                        <template v-slot:activator="{ on }">
                            <input
                             class="form-control border-input"
                              v-model="employee.shift_starting_date"
                              style="cursor:pointer!important"
                              readonly
                              v-on="on"
                            />
                          </template>
                        <v-time-picker v-if="picker1"  :landscape="true"
          @click:minute="$refs.picker1.save(employee.shift_starting_date)" color="#ffd700" header-color="#ffd700" v-model="employee.shift_starting_date" ></v-time-picker>
                         </v-menu>
                      </div>
                    </div>
                     <div class="col-md-6">
                      <div class="form-group">
                        <label>{{ $t("shift_ending_time") }}</label>
                      <v-menu
                          ref="picker2"
                          v-model="picker2"
                          :close-on-content-click="false"
                           attach
                           full-width
                           :top="false"
                   
                          lazy
                          transition="scale-transition"
                          offset-y
                          :return-value.sync="employee.shift_ending_date"
                        
          
                        >
                        <template v-slot:activator="{ on }">
                            <input
                             class="form-control border-input"
                              v-model="employee.shift_ending_date"
                              style="cursor:pointer!important"
                              readonly
                              v-on="on"
                            />
                          </template>
                        <v-time-picker v-if="picker2"  :landscape="true" :min="employee.shift_starting_date"
          @click:minute="$refs.picker2.save(employee.shift_ending_date)" color="#ffd700" header-color="#ffd700" v-model="employee.shift_ending_date" ></v-time-picker>
                         </v-menu>
                      </div>
                    </div>
                  </div>
                        </form>
                  </div>
                </div>
                

                  <div :class="$i18n.locale=='ar'?'text-left':'text-right'">
                    <button @click="add" type="submit" class="btn btn-lg">{{$t("add")}}</button>
                  </div>
                  <div class="clearfix"></div>
               
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Employee, Activity } from './models.js'
import Avatar from './sub_components/Avatar.vue'
const nativeImage = require('electron').nativeImage
const { app } = require('electron').remote
const fs = require('fs-extra')
import DatePicker from "vue2-datepicker";
var path = require('path')

export default {
  name: 'NewEmployee',
  components: { Avatar,DatePicker },
      computed: {
        passwordType() {
            return this.hidePassword ? 'password' : 'text'
        },
        passwordIcon() {
            return this.hidePassword ? 'eye' : 'eye-slash'
        }
    },
  created () {
    console.log('newemployee created')
    this.employees = JSON.parse(JSON.stringify(store.getters.employees))

    this.employee = new Employee(
      '',
      '',
      '',
      '',
      'm',
      null,
      []
    )

    this.all_actions = store.getters.all_actions
     this.lang = {
      days: [
        this.$t("Sun"),
        this.$t("Mon"),
        this.$t("Tue"),
        this.$t("Wed"),
        this.$t("Thu"),
        this.$t("Fri"),
        this.$t("Sat")
      ],
      months: [
        this.$t("Jan"),
        this.$t("Feb"),
        this.$t("Mar"),
        this.$t("Apr"),
        this.$t("May"),
        this.$t("Jun"),
        this.$t("Jul"),
        this.$t("Aug"),
        this.$t("Sep"),
        this.$t("Oct"),
        this.$t("Nov"),
        this.$t("Dec")
      ],
      placeholder: {
        date: this.$t("select_date")
      }
    };
  },
  activated () {
    console.log('newemployee activated')
    
    this.all_actions = [
        {text:this.$t("add_order"),value:'add_order'},
        {text:this.$t("edit_order"),value:'edit_order'},
        {text:this.$t("cancel_order"),value:'cancel_order'},
        {text:this.$t("del_order"),value:'del_order'},
        {text:this.$t("add_product"),value:'add_product'},
        {text:this.$t("a_edit_product"),value:'edit_product'},
        {text:this.$t("del_product"),value:'del_product'},
        {text:this.$t("add_invoice"),value:'add_invoice'},
        {text:this.$t("edit_invoice"),value:'edit_invoice'},
        {text:this.$t("del_invoice"),value:'del_invoice'},
        {text:this.$t("add_stock"),value:'add_stock'},
        {text:this.$t("edit_stock"),value:'edit_stock'},
        {text:this.$t("del_stock"),value:'del_stock'},
        {text:this.$t("view_dashboard"),value:'view_dashboard'},
        {text:this.$t("view_orders"),value:'view_orders'},
        {text:this.$t("view_products"),value:'view_products'},
        {text:this.$t("view_invoices"),value:'view_invoices'},
        {text:this.$t("view_customers"),value:'view_customers'},
        {text:this.$t("view_employees"),value:'view_employees'},
        {text:this.$t("change_settings"),value:'change_settings'},
        
      ],
    this.lang = {
      days: [
        this.$t("Sun"),
        this.$t("Mon"),
        this.$t("Tue"),
        this.$t("Wed"),
        this.$t("Thu"),
        this.$t("Fri"),
        this.$t("Sat")
      ],
      months: [
        this.$t("Jan"),
        this.$t("Feb"),
        this.$t("Mar"),
        this.$t("Apr"),
        this.$t("May"),
        this.$t("Jun"),
        this.$t("Jul"),
        this.$t("Aug"),
        this.$t("Sep"),
        this.$t("Oct"),
        this.$t("Nov"),
        this.$t("Dec")
      ],
      pickers: [
        "next 7 days",
        "next 30 days",
        "previous 7 days",
        "previous 30 days"
      ],
      placeholder: {
        date: this.$t("select_date")
      }
    };
  },
  data () {
    return {
       hidePassword: true,
      picker1:false,
      picker2:false,
      hidePassword: true,
      employee_actions:[],
      all_actions:[],
      errors: [],
      employees: [],
      employee: {},
            lang: {
        days: [
          this.$t("Sun"),
          this.$t("Mon"),
          this.$t("Tue"),
          this.$t("Wed"),
          this.$t("Thu"),
          this.$t("Fri"),
          this.$t("Sat")
        ],
        months: [
          this.$t("Jan"),
          this.$t("Feb"),
          this.$t("Mar"),
          this.$t("Apr"),
          this.$t("May"),
          this.$t("Jun"),
          this.$t("Jul"),
          this.$t("Aug"),
          this.$t("Sep"),
          this.$t("Oct"),
          this.$t("Nov"),
          this.$t("Dec")
        ],
        pickers: [
          this.$t("after_month"),
          this.$t("after_6_months"),
          this.$t("after_year")
        ],
        placeholder: {
          date: this.$t("select_date")
        }
      },
    }
  },
  watch: {},
  methods: {
    toggleInventoryManagerActionsSet(){
        this.$nextTick(() => {
            this.employee.allowed_actions = [
               {text:this.$t("add_product"),value:'add_product'},
                {text:this.$t("a_edit_product"),value:'edit_product'},
                {text:this.$t("del_product"),value:'del_product'},
                {text:this.$t("add_invoice"),value:'add_invoice'},
                {text:this.$t("edit_invoice"),value:'edit_invoice'},
                {text:this.$t("del_invoice"),value:'del_invoice'},
                {text:this.$t("add_stock"),value:'add_stock'},
                {text:this.$t("edit_stock"),value:'edit_stock'},
                {text:this.$t("del_stock"),value:'del_stock'},
        ]
        })
    },
    toggleSellerActionsSet(){
        this.$nextTick(() => {
            this.employee.allowed_actions = [
           {text:this.$t("add_order"),value:'add_order'},
        {text:this.$t("edit_order"),value:'edit_order'},
        {text:this.$t("cancel_order"),value:'cancel_order'}
        ]
        })
    },
    removeImage () {
      this.employee.image = null
    },
    processFile (e) {
      console.log(e)
      let ext = path.extname(e)
      let newpath =
        app.getAppPath().replace('app.asar', 'images\\employees\\') +
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
      this.employee.image = newpath
    },
    imageRemoved () {
      this.employee.image = null
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
        'images\\employees\\' +
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
      this.employee.image = newpath
    },

    goBack () {
      this.$router.go(-1)
      
    },
    add: function (e) {
      e.preventDefault()
      this.errors = []
      console.log(this.employee);
      if (!this.employee.name) {
        this.errors.push(this.$t('name_required'))
      } else {
        if (_.find(this.employees,{"name":this.employee.name})) {

            this.errors.push(this.$t('name_taken'))
          
        }
      }
      if (!this.employee.phone) {
        this.errors.push(this.$t('phone_required'))
      }
      if (!this.employee.password) {
        this.errors.push(this.$t('password_required'))
      }
      if (this.employee.email) {
        if (!this.validEmail(this.employee.email)) {
          this.errors.push(this.$t('non_valid_email'))
        }
      }

      if (this.errors.length == 0) {
        let actions = []
        _.forEach(this.employee.allowed_actions,act=>{
            actions.push(act.value);
        })
        this.employee.allowed_actions = actions;
        

        window.store.dispatch('addEmployee', this.employee)
        this.goBack()
        this.$destroy()
        return true
      } else {
        return false
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
.picture-preview{
  z-index: 8 !important;
}
</style>