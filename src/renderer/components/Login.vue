<template>
<div class="bg-full-screen-image ">
    <div class="row center-block">
        <div class="col-xs-12 col-sm-12 col-md-8 col-lg-6 mx-auto">
            <h2 class="vtitle text-center">{{$t("login")}}</h2>
            <div class="card">
                <ErrorPanel :errors="errors" />
                <div class="content">
                    <v-form novalidate="true" ref="form" v-model="valid" lazy-validation>
                        <div class="row">
                            <div class="w-100 p-10">
                                <div class="form-group ">
                                    <!-- <v-text-field solo flat outline @keyup.enter="validate($event)" :label="$t('user_name')" prepend-icon="mdi-account-circle-outline" v-model="username" :rules="nameRules" required></v-text-field> -->
                                    <label>{{ $t("user_name") }}</label>
                                <input @keyup.enter="login($event)" type="text" style="padding-left:50px;padding-right:50px" class="form-control border-input" v-model="username" :placeholder="$t('user_name')" value="">
                                <i :style="{'float':$i18n.locale=='ar'?'right':'left'}" style="margin-right:5px" class="mdi mdi-account-circle-outline input-icon" ></i>
                                </div>
                            </div>

                            <div class="w-100 p-10">
                                <div class="form-group">
                                    <!-- <v-text-field @keyup.enter="validate($event)" v-model="password" prepend-icon="mdi-account-key-outline" :append-icon="hidePassword ? 'visibility' : 'visibility_off'" :rules="[rules.required, ]" :type="hidePassword ? 'text' : 'password'" name="input-10-1" :label="$t('password')" :hint="$t('min_8_char')" counter @click:append="hidePassword = !hidePassword"></v-text-field> -->
                                    <label>{{ $t("password") }}</label>
                                <input @keyup.enter="login($event)" style="padding-left:50px;padding-right:50px" :type="passwordType" class="form-control border-input" v-model="password" :placeholder="$t('password')" value="">
                                <i :style="{'float':$i18n.locale=='ar'?'right':'left'}" style="margin-right:5px" class="mdi mdi-account-key-outline input-icon" ></i>
                                <font-awesome-icon :class="$i18n.locale=='ar'?'errspanRTL':'errspanLTR'" :icon="passwordIcon" @click="hidePassword = !hidePassword" />
                                </div>
                            </div>
                        </div>
                        <!-- <div class="text-center">
                            <button  @click="validate($event)" class="btn btn-outline-primar w-100 p-10">
                                <font-awesome-icon icon="sign-out-alt" /> {{$t("login")}}</button>
                        </div> -->
                         <!-- <v-alert
                            v-model="wrong_cred"
                             transition="fade-transition"
                            dismissible
                            color="error"
                            icon="warning"
                            outline
                            >
                           {{$t("username_password_wrong")}}
                            </v-alert> -->
                          <v-btn
                            color="primary"
                            block
                            outline
                            large
                             @click="login($event)"
                            >
                            {{$t("login")}}
                          </v-btn>
                        <div class="clearfix"></div>
                    </v-form>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import {
    EmployeeLoggingLog
} from './models';
export default {
    name: 'Login',
    computed: {
        passwordType() {
            return this.hidePassword ? 'password' : 'text'
        },
        passwordIcon() {
            return this.hidePassword ? 'eye' : 'eye-slash'
        }
    },

    data: function () {
        return {
            hidePassword: true,
            errors: [],
            wrong_cred:true,
            password: '',
            username: '',
            valid: true,
            nameRules: [
                v => !!v || this.$t('user_name_required'),
                v => (v && v.length <= 30) || this.$t('name_less_then_30')
            ],
            rules: {
                required: value => !!value || this.$t('password_required'),
                min: v => v.length >= 8 || this.$t('min_8_char'),
            }
        }
    },
    methods: {
        validate(e) {
            
            if (this.$refs.form.validate()) {
            this.wrong_cred = false;
                      let emps = window.store.getters.employees;
                let emp = _.find(emps, {
                    "name": this.username,
                    "password": this.password
                })
                console.log(emp)
                if (emp) {
                    let emplog = new EmployeeLoggingLog(emp.id, "check_in");
                    window.store.dispatch("addEmployeeLog", emplog);
                    window.store.dispatch('is_logged_in', {
                        "status": true,
                        "employee_id": emp.id
                    })
                    this.$router.replace('/home')
                    this.$destroy();
                }else{
                    this.wrong_cred = true;
                }
                }
                e.preventDefault();
        },
        login: function (e) {
            console.log('presss')
            console.log(window.store.getters.user.username)
            console.log(window.store.getters.user.password)
            e.preventDefault()
            this.errors = []

            if (!this.username) {
                this.errors.push(this.$t('user_name_required'))
            }
            if (!this.password) {
                this.errors.push(this.$t('password_required'))
            }

            if (this.errors.length == 0) {

                console.log(window.store.getters.user.username)
                console.log(window.store.getters.user.password)
                console.log(window.store.getters.employees)
                console.log(this.username, this.password)
                let emps = window.store.getters.employees;
                let emp = _.find(emps, {
                    "name": this.username,
                    "password": this.password
                })
                console.log(emp)
                if (emp) {
                    let emplog = new EmployeeLoggingLog(emp.id, "check_in");
                    window.store.dispatch("addEmployeeLog", emplog);
                    window.store.dispatch('is_logged_in', {
                        "status": true,
                        "employee_id": emp.id
                    })
                    this.$router.replace('/home')
                    this.$destroy();
                } else {
                    this.errors.push(this.$t('username_password_wrong'))
                }
            } else {
                return true
            }
        }

    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped lang="scss">

.input-icon {
    color: gray;
    font-size: 35px;
    position: relative;
    float: left;
    margin-left: 5px;
    margin-top: -47px;
    z-index: 2;
}
.input-icon[dir='rtl'] {

    float: right;

}
.errspanLTR {
    color: grey;
    font-size: 25px;
    position: relative;
    float: right;
    margin-right: -5px;
    margin-top: -38px;
    z-index: 2;
}

.errspanRTL {

    color: grey;
    font-size: 25px;
    position: relative;
    float: left;
    margin-left: -5px;
    margin-top: -38px;
    z-index: 2;
}

.bg-full-screen-image {
    background: url(/static/assets/img/vuesax-login-bg.jpg) center center no-repeat;
    -webkit-background-size: cover;
    background-size: cover;
    width: 100%;
    height: 100%;
}

.card {
    border-radius: 6px;
    box-shadow: 1px 8px 20px 6px rgba(243, 240, 234, 0.5);
    background-color: #FFFFFF;
    color: #252422;
    border-top-right-radius: 0px;
    border-top-left-radius: 0px;
    margin-bottom: 20px;
    position: relative;

    z-index: 1;
}
</style>
