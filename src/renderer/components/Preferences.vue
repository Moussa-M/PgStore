<template>
<div class="wrapper w-100" ondragstart="return false;" ondrop="return false;">
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
            </div>
        </nav>
        <div class="content">
            <div class="row">
                <div class="col-md-2" style="margin-top:20px;-webkit-padding-start: 0px;">
                    <nav class="nav-sidebar">
                        <ul class="nav tabs">
                            <li style="padding: 10px;" class="active">
                                <a href="#tab1" data-toggle="tab">{{$t("account")}}</a>
                            </li>
                            <li style="padding: 10px;">
                                <a href="#tab2" data-toggle="tab">{{$t("comercial_information")}}</a>
                            </li>

                        </ul>
                    </nav>
                </div>

                <div class="col-md-8" style="-webkit-border-start: 1px solid #eee;">
                    <div class="tab-content">
                        <div class="tab-pane active text-style" id="tab1">
                            <div class="card">
                                <!-- <div v-if="errors.length" class="alert alert-danger header" style="">
                    <div >
                      <b>{{ $t("correct_errors") }}</b>
                      <ul>
                        <li class="error" v-for="error in errors" :key="error">{{ error }}</li>
                      </ul>
                    </div>
                  </div> -->
                                <ErrorPanel :errors="errors" />
                                <div class="content" style="padding: 0px">
                                    <form novalidate="true">

                                        <div style="margin:15px;border-bottom: 2px solid lightgrey;">
                                            <h5>{{$t("account_info")}}</h5>
                                        </div>
                                        <div class="row">

                                            <div class="col-md-6">

                                                <div class="col-md-12">
                                                    <div class="form-group">
                                                        <label>{{$t("user_name")}}</label>
                                                        <input type="text" class="form-control border-input" v-model="username" :placeholder="$t('user_name')" value>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="col-md-12">
                                                    <div class="form-group">
                                                        <label for="exampleInputEmail1">{{ $t("email_address") }}</label>
                                                        <input type="email" class="form-control border-input" v-model="email" :placeholder="$t('email_address')">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="col-md-12">
                                                    <h5>{{$t("change_password")}}</h5>
                                                    <div class="form-group">
                                                        <label>{{$t("old_password")}}</label>
                                                        <input type="password" class="form-control border-input" v-model="old_password" :placeholder="$t('old_password')" value>

                                                    </div>
                                                    <div class="form-group">
                                                        <label>{{$t("new_password")}}</label>
                                                        <input type="password" class="form-control border-input" v-model="new_password" :placeholder="$t('new_password')" value>

                                                    </div>
                                                    <div class="form-group">
                                                        <label>{{$t("confirm_new_password")}}</label>
                                                        <input type="password" class="form-control border-input" v-model="confirm_new_password" :placeholder="$t('confirm_new_password')" value>

                                                    </div>
                                                    <button :disabled="old_password.length <= 0 || new_password.length <= 0 || confirm_new_password.length <= 0" @click="updatePassword" type="submit" class="btn btn-lg">{{$t("update_password")}}</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-12">
                                                <div class="col-md-12">
                                                    <h5 style="color:red"><b>{{$t("erase_data")}}</b></h5>
                                                    <div class="well">
                                                        <label><b>
                                                                {{$t("erase_all")}}
                                                            </b>
                                                        </label>
                                                        <br>
                                                        <div>
                                                            <label>{{ $t("keep_products") }}</label>
                                                            <label class="switch">
                                                                <input type="checkbox" v-model="keep_products" />
                                                                <span class="slider round"></span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label>{{ $t("keep_customers") }}</label>
                                                            <label class="switch">
                                                                <input type="checkbox" v-model="keep_customers" />
                                                                <span class="slider round"></span>
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <label>{{ $t("keep_employees") }}</label>
                                                            <label class="switch">
                                                                <input type="checkbox" v-model="keep_employees" />
                                                                <span class="slider round"></span>
                                                            </label>
                                                        </div>
                                                        <div class="row text-center">
                                                            <button style="width:30%" @click.prevent="eraseData()" class="btn btn-lg btn-danger">{{$t("erase")}}</button>

                                                        </div>

                                                    </div>

                                                </div>
                                            </div>

                                        </div>

                                        <div style="margin-bottom:50px" :class="$i18n.locale=='ar'?'text-left':'text-right'">
                                            <button @click="update" type="submit" class="btn btn-lg">{{$t("done")}}</button>
                                        </div>
                                        <div class="clearfix"></div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane text-style" id="tab2">
                            <div class="card">
                                <ErrorPanel :errors="errors" />
                                <div class="content" style="padding: 0px">
                                    <form novalidate="true">
                                        <div style="margin:15px;border-bottom: 2px solid lightgrey;">
                                            <h5>{{$t("comercial_info")}}</h5>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="col-md-12">
                                                    <div class="form-group">
                                                        <label>{{$t("store_name")}}</label>
                                                        <input type="text" class="form-control border-input" v-model="storename" :placeholder="$t('store_name')" value>
                                                    </div>
                                                </div>
                                                <div class="col-md-12">
                                                    <div class="form-group">
                                                        <label>{{$t("store_phone")}}</label>
                                                        <input type="text" class="form-control border-input" v-model="storephone" dir="ltr" :placeholder="$t('store_phone')" value>
                                                    </div>
                                                </div>
                                                <div class="col-md-12">
                                                    <div class="form-group">
                                                        <label>{{$t("store_address")}}</label>
                                                        <input type="text" class="form-control border-input" v-model="storeaddress" :placeholder="$t('store_address')" value>
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
                                                    <Avatar :image="storelogo" :width="300" :height="300" :crop="true" :removeable="true" @removed="imageRemoved" @dataURL="processDataUrl" />
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
                                            <button @click="update" type="submit" class="btn btn-lg">{{$t("done")}}</button>
                                        </div>
                                        <div class="clearfix"></div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane text-style" id="tab3">
                            <h1>Tab 3</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Avatar from "./sub_components/Avatar.vue";
import LangChanger from "./ChangeLang.vue";
const nativeImage = require("electron").nativeImage;
const {
    app
} = require("electron").remote;
const fs = require("fs-extra");
const path = require("path");
export default {
    name: "Preferences",
    components: {
        Avatar,
        LangChanger
    },
    created: function () {
        console.log("pref created ");
        this.user = window.store.getters.user;
        this.storename = this.user.storename;
        this.storephone = this.user.storephone;
        this.storeaddress = this.user.storeaddress;
        this.storelogo = this.user.storelogo;
        this.email = this.user.email;
        this.username = this.user.username;
        this.password = this.user.password;
        this.currency = this.user.currency;
    },
    deactivated() {
        this.$destroy();
    },
    data: function () {
        return {
            keep_products: false,
            keep_customers: false,
            keep_employees: false,
            hidePassword: true,
            errors: [],
            storename: null,
            storephone: null,
            storeaddress: null,
            storelogo: null,
            email: null,
            user: {},
            password: null,
            old_password: "",
            new_password: "",
            confirm_new_password: "",
            username: null,

            currency: null
        };
    },
    computed: {
        passwordType() {
            return this.hidePassword ? "password" : "text";
        },
        passwordIcon() {
            return this.hidePassword ? "eye" : "eye-slash";
        }
    },
    methods: {
        eraseData() {
           
            swal({
                title: this.$t("erase_confirmation"),
                text: this.$t("this_action_is_undoable"),
                icon: "warning",
                buttons: {
                    cancel: {
                        text: this.$t("cancel"),
                        value: false,
                        visible: true,
                        className: "",
                        closeModal: true,
                    },
                    confirm: {
                        text: this.$t("continue"),
                        value: true,
                        visible: true,
                        className: "",
                        closeModal: true
                    }
                },
                dangerMode: true,
                content: {
                    element: "input",
                    attributes: {
                        className:"form-control border-input",
                        placeholder: this.$t("for_security_purposes_enter_password"),
                        type: "password",
                    },
                },
            }).then(password => {

                if (password == this.user.password) {
                    store.dispatch("orders", []);
                    store.dispatch("stocks", []);
                    store.dispatch("invoices", []);
                    store.dispatch("notifications", []);
                    if (!this.keep_products) {
                        store.dispatch("products", []);
                    }
                    if (!this.keep_customers) {
                        let anon = store.getters.getCustomer(1);
                        store.dispatch("customers", []);
                        store.dispatch("addCustomer", anon);
                    }
                    if (!this.keep_employees) {
                        store.dispatch("employees", []);
                    }
                    store.dispatch("activities", []);
                    
                    swal({
                        title: this.$t("erase_done"),
                        text: "",
                        icon: "success",
                        button: this.$t("ok"),

                    })
                } else if(password != false){
                    swal({
                        title: this.$t("wrong_password"),
                        text: "",
                        icon: "error",
                        button: this.$t("ok"),
                        dangerMode: false,
                    });
                }

            });

        },
        imageRemoved() {
            this.storelogo = null;
        },
        processDataUrl(data) {
            console.log(__dirname);

            console.log(app.getPath("exe"));
            let reg = /\/\w+\;/;
            let ext = reg
                .exec(data.substring(0, data.indexOf(",") + 1))[0]
                .replace(";", "")
                .replace("/", "");

            // let newpath = path.join(app.getPath("exe").replace('MyStore.exe','images'),'logo_'+_.sampleSize("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 3).join(""),'.'+ext);
            let newpath =
                app.getAppPath().replace("app.asar", "images\\") +
                "logo_" +
                _.sampleSize("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 3).join("") +
                "." +
                ext;
            fs.ensureFileSync(newpath);
            fs.writeFile(
                newpath,
                Buffer.from(data.substring(data.indexOf(",") + 1), "base64"),
                err => {
                    if (err) throw err;

                    console.log("The file was succesfully saved!");
                }
            );
            this.storelogo = newpath;
            console.log("this.storelogo");
            console.log(this.storelogo);
        },
        goBack() {
            this.$router.go(-1);
            // this.$emit('prefclose');

            /*     window.history.length > 1 ?
                           this.$router.go(-1) :
                           this.$router.push('/') */
        },
        updatePassword: function (e) {
            e.preventDefault();
            this.errors = [];
            if (store.getters.user.password == this.old_password) {
                if (this.new_password == this.confirm_new_password) {
                    this.user.password = this.new_password;
                    window.store.dispatch("user", this.user);
                } else {
                    this.errors.push(this.$t("confirm_password_not_match"));
                }
            } else {
                this.errors.push(this.$t("wrong_password"))
            }
        },
        update: function (e) {
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
            console.log("clicker");

            if (this.errors.length == 0) {
                window.store.dispatch("user", {
                    lang: this.$i18n.locale,
                    storename: this.storename,
                    storephone: this.storephone,
                    storeaddress: this.storeaddress,
                    storelogo: this.storelogo,
                    username: this.username,
                    email: this.email,
                    password: this.user.password,
                    currency: this.currency
                });
                let emp = store.getters.getEmployee(1)
                emp.name = this.username
                emp.password = this.password
                window.store.dispatch("updateEmployee", emp);
                //window.store.dispatch("is_registered", true);
                this.goBack();
                return true;
            } else {
                return true;
            }
        },
        validEmail: function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }
    }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" scoped>
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
    // padding: 9px;
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

.tabs {
    li {
        a {
            color: gray;
        }

        background-color: white !important;

        &.active {
            background-color: rgba(255, 223, 54, 0.52) !important;

        }

        &:hover {
            a {
                color: rgb(207, 207, 207);
            }
        }

        &.active:hover {
            a {
                color: gray;
            }

        }
    }

}
</style>
