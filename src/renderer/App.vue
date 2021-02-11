<template>
<v-app id="app" :dir="lang=='ar' ? 'rtl':'ltr'" class="w-100 h-100" @keyup="keyPress($event)">

    <div dir="ltr" id="electron-titlebar" class="drag">
        <img class="titleicon" src="static/favicon.png">
    </div>

    <v-content>

        <transition name="slide-fade">
            <keep-alive>
                <router-view ref="view" :dir="lang=='ar' ? 'rtl':'ltr'" :style="{'direction':lang=='ar' ? 'rtl':'ltr'}"></router-view>
            </keep-alive>
        </transition>

    </v-content>

</v-app>
</template>

<script>
const {
    ipcRenderer
} = require("electron");
var Mousetrap = require("mousetrap");
import {
    Product,
    Notification,
    Customer
} from "./components/models.js";
//import { setInterval,clearInterval } from 'timers';
export default {
    name: "app",
    data() {
        return {
            cache: false,
            lang: "ar",
            barcode: "",
            index: 0,
            cpt: 0,
            check_exp_date_interval:null
        };
    },

    created() {
       // store.dispatch("notifications", []);
           // this.products = JSON.parse(JSON.stringify(store.getters.products));
          //  let  last_index = _.last(this.products) ? _.last(this.products).id + 1 : 1;
            // for (let index = 0; index < 100; index++) {
            //     let product = new Product( _.sampleSize("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 6).join(""), "piece", "other", "", "");
            //     store.dispatch('addProduct',product);
            // }

            // for (let index = 0; index < 100; index++) {
            //     let customer= new Customer( _.sampleSize("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 6).join(""), "213458884655");
            //     store.dispatch('addCustomer',customer);
            // }

        // barcode listener
        ipcRenderer.removeAllListeners("KEYBOARD")
        try {
            let user = window.store.getters.user;
            this.lang = user.lang;
            this.$i18n.locale = this.lang;
            this.$vuetify.rtl = this.lang == "ar" ? true : false;
            moment.locale(this.lang == "ar" ? "ar-dz" : this.lang);
        } catch (err) {}
        this.$watch(
            "$i18n.locale",
            () => {
                try {
                    console.log("changed" + this.$i18n.locale);
                    this.lang = this.$i18n.locale;
                    this.$vuetify.rtl = this.lang == "ar" ? true : false;
                    moment.locale(this.lang == "ar" ? "ar-dz" : this.lang);
                    $(this.refs["view"]).attr(
                        "dir",
                        this.$i18n.locale == "ar" ? "rtl" : "ltr"
                    );
                } catch (err) {}
            }, {
                deep: false
            }
        );

        //Mousetrap.bind([ "1","2","3","4","5","6","7","8","9","0" ], function() { console.log('show shortcuts!'); });

        // ipcRenderer.on("KEYBOARD", (event, arg) => {
        //     if (arg == "Esc") {

        //         if (swal.getState().isOpen) {
        //             swal.close()
        //         } else {
        //             if (
        //                 ["dashboard", "orders", "customers", "products", "invoices"].indexOf(
        //                     this.$route.name
        //                 ) == -1
        //             ) {
        //                 this.$router.go(-1);
        //             } else {

        //             }
        //         }

        //     } else if (arg == "del" || arg == "cmd_del" || arg == "edit" || arg == "add" || arg == "r") {
        //         this.$eventBus.$emit(arg)
        //     } else if (arg == "search") {

        //         $("#search").focus();
        //     }

        // });

        //interval to check expired products 
     
      // clearInterval(this.check_exp_date_interval);
    },
    mounted() {
        this.$nextTick(() => {
            setTimeout(() => {
                ipcRenderer.send("main-loaded", "ping");
            }, 3000);
        });
      
        // setTimeout(() => {
        //     document.addEventListener(
        //         "keydown",
        //         event => {

        //             if (event.which == 38) {
        //                 this.$eventBus.$emit('up')
        //                 event.preventDefault();
        //                 event.stopPropagation();
        //                 event.stopImmediatePropagation();
        //                 return false;
        //             }
        //             if (event.which == 40) {
        //                 this.$eventBus.$emit('down')
        //                 event.preventDefault();
        //                 event.stopPropagation();
        //                 event.stopImmediatePropagation();
        //                 return false;
        //             }
        //         });
        //     document.addEventListener(
        //         "keypress",
        //         event => {
        //             if (event.charCode == 13) {
        //                 if (this.barcode != "") {
        //                     console.log(this.index + " ScannedBarCode " + this.barcode);

        //                     this.index++;
        //                     // this.$route.name
        //                     switch (this.$route.name) {
        //                         case "new_order":
        //                             this.$eventBus.$emit("barcode", this.barcode);
        //                             this.barcode = "";

        //                             break;

        //                         case "fast_sell":
        //                             this.$eventBus.$emit("barcode", this.barcode);
        //                             this.barcode = "";

        //                             break;

        //                         case "products":
        //                             this.$eventBus.$emit("barcode", this.barcode);
        //                             this.barcode = "";

        //                             break;

        //                         case "edit_order":
        //                             this.$eventBus.$emit("barcode", this.barcode);
        //                             this.barcode = "";

        //                             break;

        //                         default:
        //                             this.barcode = "";

        //                             // bobe ate the cacke
        //                     }

        //                     event.preventDefault();
        //                     event.stopPropagation();
        //                     event.stopImmediatePropagation();
        //                     return false;
        //                 }
        //             } else {
        //                 // if (
        //                 //     this.$route.name == 'new_order' ||
        //                 //     this.$route.name == 'products' ||
        //                 //     this.$route.name == 'home' ||
        //                 //     this.$route.name == 'fast_sell' ||
        //                 //     this.$route.name == 'edit_order'
        //                 // ) {
        //                 if (event.shiftKey) {
        //                     this.barcode = this.barcode + event.key;
        //                 } else {
        //                     this.barcode = "";
        //                 }

        //                 //  }
        //             }

        //         },
        //         true
        //     );
        // }, 0)

        // document.head.innerHTML = document.head.innerHTML + "<base href='/' />";
    },
    methods: {
        checkNotifications(){
               console.log("Checking Expiration date "+this.cpt);
            this.cpt++;
            let notifications = JSON.parse(JSON.stringify(store.getters.notifications))
            let products = JSON.parse(JSON.stringify(store.getters.products))
            _.forEach(products, (product) => {
              
                if (this.hasAlmostExpired(product)) {
                    let type = this.hasExpired(product) ? "expired" : "almost_expired"
                    let prev_noti = _.find(notifications, {
                        product_id: product.id,
                        product_name: product.name,
                        type: type
                    })
                    if (!prev_noti) {
                        let new_not = new Notification(product.id, product.name, type)
                        notifications.push(new_not)
                    }
                }
            })
            
            store.dispatch("notifications", notifications);
            this.$eventBus.$emit("notifications_changed")
        },
        hasAlmostExpired(product) {

            let stocks = store.getters.getStocks(product.id);
            let exp_date_alert = false;
            if (stocks) {
                _.forEach(stocks, (stock) => {
                    if (moment(stock.exp_date).isValid()) {

                        if ((moment(stock.exp_date).subtract(parseInt(product.exp_date_pre_alert), "days")).isSameOrBefore(moment(), 'day')) {

                            exp_date_alert = true
                        }

                    }

                })
            }

            return exp_date_alert;

        },
        hasExpired(product) {

            let stocks = store.getters.getStocks(product.id);
            let exp_date_alert = false;
            if (stocks) {
                _.forEach(stocks, (stock) => {
                    if (moment(stock.exp_date).isValid()) {

                        if ((moment(stock.exp_date)).isSameOrBefore(moment(), 'day')) {

                            exp_date_alert = true
                        }

                    }

                })
            }

            return exp_date_alert;

        },
    },
    watch: {
        // $route(to, from) {
        //   console.log("route " + to.name);
        //   if (
        //     to.name == "dashboard" ||
        //     to.name == "orders" ||
        //     to.name == "products" ||
        //     to.name == "customers" ||
        //     to.name == "new_order" ||
        //     to.name == "new_customer"
        //   ) {
        //     this.cache = true;
        //   } else {
        //     this.cache = false;
        //   }
        // }
    }
};
</script>

<style lang="scss">
@import "~font-awesome/css/font-awesome.min.css";
@import "~electron-titlebar/titlebar/titlebar.css";
/* @import "./assets/css/bootstrap.min.css"; */

/* @import "~bootstrap/dist/css/bootstrap.min.css"; */

@import "~chartist/dist/chartist.min.css";
@import "~hover.css/css/hover-min.css";
@import "/static/assets/css/bootstrap.min.css";
@import "/static/assets/css/animate.min.css";
/* @import "/static/static/assets/fonts/muli.font.css"; */

/* @import "/static/assets/css/paper-dashboard.css"; */
// @import "/static/static/assets/fonts/flaticon.css";

@import "/static/assets/css/paper-dashboard.css";
@import "/static/assets/css/themify-icons.css";
// @import "~@mdi/font/css/materialdesignicons.min.css";
/* fallback */

@font-face {
    font-family: "Material Icons";
    font-style: normal;
    font-weight: 400;
    src: url(/static/assets/fonts/MaterialDesignFonts.woff2) format("woff2");
}

.material-icons {
    font-family: "Material Icons";
    font-weight: normal;
    font-style: normal;
    font-size: 24px;
    /* Preferred icon size */
    display: inline-block;
    line-height: 1;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;
    color: darkgray;
    /* Support for all WebKit browsers. */
    -webkit-font-smoothing: antialiased;
    /* Support for Safari and Chrome. */
    text-rendering: optimizeLegibility;
    /* Support for Firefox. */
    -moz-osx-font-smoothing: grayscale;
    /* Support for IE. */
    font-feature-settings: "liga";
}

html {
    height: 100%;
    overflow-y: hidden !important;
}

body {
    height: 100%;
    overflow: hidden;
    user-select: none !important;
    font-size: 19px;
}

#app {
    height: 100%;
    margin: 0px;
}

.centerall {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
}

.titlestyle {
    top: 2px !important;
    left: 37px !important;
    width: 99% !important;
    height: 30px !important;
    font-size: 15px !important;
    font-weight: 500 !important;
    position: fixed !important;
}

.wrapper[electron-titlebar-platform="win32"] #electron-titlebar>.button {
    height: 35px !important;
}

.titlebar {
    margin-top: 11.5px !important;
}

.titleicon {
    margin-top: 4px !important;
    margin-bottom: 4px !important;
    width: 25px;
    height: 25px;
    max-width: 25px;
    max-height: 25px;
}

#electron-titlebar {
    position: fixed !important;
    top: 0;
    left: 0;
    right: 0;
    padding-left: 10px;
    padding-right: 0px;
    width: 100%;
    height: 30px !important;
    -webkit-user-select: none;
    cursor: default;
    pointer-events: none;
    color: white;
    background-color: #333333d6;
    padding-bottom: 35px;
    z-index: 99;
}

/* #electron-titlebar > .button-close{
  right: 7px !important;
} */

.btn-circle {
    border-radius: 50%;
    border-width: 0px !important;
    padding: 10px 12px !important;
}

.wrapper {
    overflow-y: auto !important;
    overflow-x: hidden !important;
}

.wrapper::-webkit-scrollbar {
    margin-top: 30px;
}

.btn-default {
    color: #ffd700;
}

.btn-default:hover {
    background-color: #ffd700;
    color: #fff;
    border: 1px solid #ffd700;
}

.btn-cancel {
    background: #eaeaea;
    border-color: #eaeaea;
    color: #76766d;
}

.btn-cancel:hover {
    background-color: #eeeeed;
    color: rgb(143, 143, 143);
    border: 1px solid #eeeeed;
}

/*.wrapper::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 10px;
}
 
.wrapper::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
  border-radius: 10px;
}*/

.sidebar .nav>li.active-pro {
    position: absolute;
    width: 100%;
    bottom: 20px;
}

.slide-fade-enter-active {
    transition: all 0.8s ease;
}

.slide-fade-leave-active {
    transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter,
.slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */

    {
    transform: translateX(10px);
    opacity: 0;
}

.slide-fade-fast-enter-active {
    transition: all 0.2s ease-out;
}

.slide-fade-fast-leave-active {
    /*transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);*/
    transition: all 0.2s ease-out;
}

.slide-fade-fast-enter,
.slide-fade-fast-leave-to
/* .slide-fade-leave-active below version 2.1.8 */

    {
    transform: translateX(5px);
    opacity: 0;
}

.animated {
    -webkit-animation-duration: 0.6s;
    animation-duration: 0.6s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
}

.pagination>.active>a,
.pagination>.active>a:focus,
.pagination>.active>a:hover,
.pagination>.active>span,
.pagination>.active>span:focus,
.pagination>.active>span:hover {
    color: #fff;
    cursor: pointer;
    background-color: #ffd700;
    border-color: #ffd700;
}

.pagination>li>a,
.pagination>li>span {
    color: black;
    cursor: pointer;
}

.form-group {
    margin-bottom: 5px;
}

*::-webkit-scrollbar {
    height: 8px;
    width: 10px;
}

*::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
}

*::-webkit-scrollbar-thumb {
    background-color: #ffd700;
    outline: 1px solid #ffd700;
    border-radius: 5px;
}

.navbar-brand {
    cursor: default;
}

table {
    white-space: pre-line;
}

.nav-container {
    display: flex;
    justify-content: space-between;
    padding-right: 15px;
    padding-left: 15px;
}

.wrapper[dir="rtl"] .card label {
    font-size: 17px;
}

*[dir="rtl"] p {
    font-size: 18px;
}

*[dir="rtl"] .btn,
.navbar .navbar-nav>li>a.btn {
    font-size: 18px;
    margin: 0px;
    /* margin: 3px 3px; */
}

*[dir="rtl"] .btn-icon {
    font-size: 22px;
    margin: 0px;
    /* margin: 3px 3px; */
}

select {
    height: 50px !important;
}

*[dir="rtl"] .row>.col-xs-1,
*[dir="rtl"] .row>.col-xs-2,
*[dir="rtl"] .row>.col-xs-3,
*[dir="rtl"] .row>.col-xs-4,
*[dir="rtl"] .row>.col-xs-5,
*[dir="rtl"] .row>.col-xs-6,
*[dir="rtl"] .row>.col-xs-7,
*[dir="rtl"] .row>.col-xs-8,
*[dir="rtl"] .row>.col-xs-9,
*[dir="rtl"] .row>.col-xs-10,
*[dir="rtl"] .row>.col-xs-11,
*[dir="rtl"] .row>.col-xs-12 {
    float: right;
}

@media (min-width: 768px) {

    *[dir="rtl"] .row>.col-sm-1,
    *[dir="rtl"] .row>.col-sm-2,
    *[dir="rtl"] .row>.col-sm-3,
    *[dir="rtl"] .row>.col-sm-4,
    *[dir="rtl"] .row>.col-sm-5,
    *[dir="rtl"] .row>.col-sm-6,
    *[dir="rtl"] .row>.col-sm-7,
    *[dir="rtl"] .row>.col-sm-8,
    *[dir="rtl"] .row>.col-sm-9,
    *[dir="rtl"] .row>.col-sm-10,
    *[dir="rtl"] .row>.col-sm-11,
    *[dir="rtl"] .row>.col-sm-12 {
        float: right;
    }
}

@media (min-width: 992px) {

    *[dir="rtl"] .row>.col-md-1,
    *[dir="rtl"] .row>.col-md-2,
    *[dir="rtl"] .row>.col-md-3,
    *[dir="rtl"] .row>.col-md-4,
    *[dir="rtl"] .row>.col-md-5,
    *[dir="rtl"] .row>.col-md-6,
    *[dir="rtl"] .row>.col-md-7,
    *[dir="rtl"] .row>.col-md-8,
    *[dir="rtl"] .row>.col-md-9,
    *[dir="rtl"] .row>.col-md-10,
    *[dir="rtl"] .row>.col-md-11,
    *[dir="rtl"] .row>.col-md-12 {
        float: right;
    }
}

@media (min-width: 1170px) {

    *[dir="rtl"] .row>.col-lg-1,
    *[dir="rtl"] .row>.col-lg-2,
    *[dir="rtl"] .row>.col-lg-3,
    *[dir="rtl"] .row>.col-lg-4,
    *[dir="rtl"] .row>.col-lg-5,
    *[dir="rtl"] .row>.col-lg-6,
    *[dir="rtl"] .row>.col-lg-7,
    *[dir="rtl"] .row>.col-lg-8,
    *[dir="rtl"] .row>.col-lg-9,
    *[dir="rtl"] .row>.col-lg-10,
    *[dir="rtl"] .row>.col-lg-11,
    *[dir="rtl"] .row>.col-lg-12 {
        float: right;
    }
}

/* cyrillic-ext */

@font-face {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    src: local("Montserrat Regular"), local("Montserrat-Regular"), url(/static/assets/fonts/Montserrat-1.woff2) format("woff2");
    unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}

/* cyrillic */

@font-face {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    src: local("Montserrat Regular"), local("Montserrat-Regular"), url(/static/assets/fonts/Montserrat-2.woff2) format("woff2");
    unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}

/* vietnamese */

@font-face {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    src: local("Montserrat Regular"), local("Montserrat-Regular"), url(/static/assets/fonts/Montserrat-3.woff2) format("woff2");
    unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9, U+20AB;
}

/* latin-ext */

@font-face {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    src: local("Montserrat Regular"), local("Montserrat-Regular"), url(/static/assets/fonts/Montserrat-4.woff2) format("woff2");
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}

/* latin */

@font-face {
    font-family: "Montserrat";
    font-style: normal;
    font-weight: 400;
    src: local("Montserrat Regular"), local("Montserrat-Regular"), url(/static/assets/fonts/Montserrat-5.woff2) format("woff2");
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
    font-family: "Cairo";
    font-style: normal;
    font-weight: 400;
    src: local("Cairo"), local("Cairo-Regular"), url(/static/assets/fonts/Cairo-1.woff2) format("woff2");
    unicode-range: U+0600-06FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE80-FEFC;
}

/* latin-ext */

@font-face {
    font-family: "Cairo";
    font-style: normal;
    font-weight: 400;
    src: local("Cairo"), local("Cairo-Regular"), url(/static/assets/fonts/Cairo-2.woff2) format("woff2");
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}

/* latin */

@font-face {
    font-family: "Cairo";
    font-style: normal;
    font-weight: 400;
    src: local("Cairo"), local("Cairo-Regular"), url(/static/assets/fonts/Cairo-3.woff2) format("woff2");
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
    padding: 0;
    border: 0;
    font-family: "Montserrat", "Cairo";
    vertical-align: baseline;
}

/* HTML5 display-role reset for older browsers */

article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
    display: block;
}

ol,
ul {
    list-style: none;
}

blockquote,
q {
    quotes: none;
}

blockquote:before,
blockquote:after,
q:before,
q:after {
    content: "";
    content: none;
}

table {
    border-collapse: collapse;
    border-spacing: 0;
}

.total_currency {
    padding-left: 20px !important;
    padding-right: 20px !important;
    font-size: 2.5vw !important;
}

.btn-default:hover {
    background-color: #ffe681 !important;
}

.btn-danger:hover {
    background-color: crimson;
}

.swal-button--cancel {
    border-radius: 5px;
    box-sizing: border-box;
    border-width: 1px;
    background-color: #eee;
    font-size: 14px;
    font-weight: 500;
    padding: 7px 18px;
    cursor: pointer;
    border: none !important;
    border-color: #eee;
}

.swal-button--confirm {
    border-radius: 5px;
    box-sizing: border-box;
    border-width: 1px;
    background-color: #ffd700;
    font-size: 14px;
    font-weight: 500;
    padding: 7px 18px;
    cursor: pointer;
    border: none !important;
    border-color: #eee;
}

.swal-button--confirm:hover {
    background-color: #e7c711 !important;
}

.swal-button--danger {
    background-color: #ff716b;
    padding: 7px 30px;
}

.swal-button:focus {
    outline: none;
    box-shadow: 0px 0px 0px 1px #fff, 0 0 0 2px rgba(178, 178, 178, 0.29);
}

.swal-button--delete {
    border-radius: 5px;
    box-sizing: border-box;
    border-width: 1px;
    background-color: crimson;
    font-size: 14px;
    font-weight: 500;
    padding: 7px 18px;
    cursor: pointer;
    border: none;
    border-color: #eee;
}

.swal-button--delete:hover {
    border-radius: 5px;
    box-sizing: border-box;
    border-width: 1px;
    background-color: crimson !important;
    font-size: 14px;
    font-weight: 500;
    padding: 7px 18px;
    cursor: pointer;
    border: none;
    border-color: #eee;
}

.form-group input {
    height: 50px !important;
}

.form-group select {
    height: 50px !important;
}

.form-inline input {
    height: 50px !important;
}

.form-inline select {
    height: 50px !important;
}

.input-group {
    height: 50px !important;
}

.input-group select {
    height: 51px !important;
}

option:hover {
    background-color: #ffd700 !important;
}

.ct-label {
    font-size: 1rem !important;
    justify-content: flex-end !important;
    font-weight: 700;
}

.mx-input {
    /* background-color: white; */
    border: medium none;
    border-radius: 0px;
    color: #3a3a38;
    font-size: 18px;
    transition: background-color 0.3s ease 0s;
    padding: 7px;
    height: inherit;
    -webkit-box-shadow: none;
    box-shadow: none;
    border: 1px solid #ccc5b9;
    text-align: -webkit-match-parent;
}

.cell {
    border-top: 0px !important;
}

.mx-datepicker {
    display: inline-block !important;
    width: 100% !important;
}

.mx-calendar-content {
    width: 390px !important;
    height: 275px !important;
}

.mx-range-wrapper {
    width: 830px !important;
}

.mx-datepicker-popup {
    left: -200px !important;
}

.mx-panel-date td,
.mx-panel-date th {
    font-size: 16px !important;
    width: 40px !important;
    height: 40px !important;
    padding: 0;
    overflow: hidden;
    text-align: center;
}

[class^="ti-"],
[class*=" ti-"] {
    font-size: 22px;
}

.fs23 {
    font-size: 23px;
}

.mx-input2 {
    display: inline-block;
    /* width: 100%; */
    direction: initial;
    height: 36px !important;
    font-weight: 700;
        text-align: -webkit-center;
    padding-left: 0px;
    font-size: 15px !important;
    line-height: 1.4;
    color: #ffd700;
    background-color: transparent;
    border: 0px solid #ccc !important;
    border-radius: 4px !important;
    font-family: inherit !important;
    -webkit-box-shadow: none !important;
    box-shadow: none !important;
}

.mx-calendar-icon {
    height: 20px !important;
    color: #555;
    stroke-width: 8px;
    stroke: currentColor;
    fill: currentColor;
}

/* //tooltip */

.tooltip {
    display: block !important;
    z-index: 10000;
}

.tooltip .tooltip-inner {
    background: rgb(131, 127, 127);
    color: white;
    border-radius: 5px;
    padding: 8px;
    font-size: 15px;
    /* font-family: inherit; */
}

.tooltip .tooltip-arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
    border-color: black;
    z-index: 1;
}

.tooltip[x-placement^="top"] {
    margin-bottom: 5px;
}

.tooltip[x-placement^="top"] .tooltip-arrow {
    border-width: 5px 5px 0 5px;
    border-left-color: transparent !important;
    border-right-color: transparent !important;
    border-bottom-color: transparent !important;
    bottom: -5px;
    left: calc(50% - 5px);
    margin-top: 0;
    margin-bottom: 0;
}

.tooltip[x-placement^="bottom"] {
    margin-top: 5px;
}

.tooltip[x-placement^="bottom"] .tooltip-arrow {
    border-width: 0 5px 5px 5px;
    border-left-color: transparent !important;
    border-right-color: transparent !important;
    border-top-color: transparent !important;
    top: -5px;
    left: calc(50% - 5px);
    margin-top: 0;
    margin-bottom: 0;
}

.tooltip[x-placement^="right"] {
    margin-left: 5px;
}

.tooltip[x-placement^="right"] .tooltip-arrow {
    border-width: 5px 5px 5px 0;
    border-left-color: transparent !important;
    border-top-color: transparent !important;
    border-bottom-color: transparent !important;
    left: -5px;
    top: calc(50% - 5px);
    margin-left: 0;
    margin-right: 0;
}

.tooltip[x-placement^="left"] {
    margin-right: 5px;
}

.tooltip[x-placement^="left"] .tooltip-arrow {
    border-width: 5px 0 5px 5px;
    border-top-color: transparent !important;
    border-right-color: transparent !important;
    border-bottom-color: transparent !important;
    right: -5px;
    top: calc(50% - 5px);
    margin-left: 0;
    margin-right: 0;
}

.tooltip.popover .popover-inner {
    background: #f9f9f9;
    color: black;
    padding: 24px;
    border-radius: 5px;
    box-shadow: 0 5px 30px rgba(black, 0.1);
}

.tooltip.popover .popover-arrow {
    border-color: #f9f9f9;
}

.tooltip[aria-hidden="true"] {
    visibility: hidden;
    opacity: 0;
    // transition: opacity 0.15s, visibility 0.15s;
}

.tooltip[aria-hidden="false"] {
    visibility: visible;
    opacity: 1;
    //transition: opacity 0.15s;
}

.swal-title {
    font-size: 24px;
}

.input_border {
    border: 1px solid #ccc5b9 !important;
}

.center-all {
    display: flex;
    align-content: center;
    align-items: center;
}

.center-block {
    height: 100% !important;
    display: flex;
    align-items: center;
    justify-content: center;
}

.w-100 {
    width: 100%;
}

.p-10 {
    padding: 10px;
}

.pm0 {
    padding: 0px;
    margin: 0px;
}

input[type="number"] {
    direction: ltr;
}

.icon-right {
    position: absolute;
    top: 12px;
    right: 30px;
}

.icon-left {
    position: absolute;
    top: 12px;
    left: 10px;
}

/* .mx-input-append {
    display: flex;
    align-items: center;
    align-content: center;
} */

.mx-input-append {
    position: absolute;
    top: 0;
    width: 30px;
    height: 100%;
    padding: 0px;
    display: flex;
    align-items: center;

}

.mx-datepicker-popup {
    z-index: 99998 !important;
}

.mx-shortcuts-wrapper .mx-shortcuts:after {
    content: ' ' !important;
}

.hiddenFocus:focus {
    outline: none;
}

.overflowEllipsis {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

.vtitle {
    padding: 30px;
    background-color: rgba(255, 255, 255, 0.38);
    color: #ffffff;
    font-size: 60px !important;
    font-weight: 600;
    line-height: 1 !important;
    letter-spacing: 0.05em !important;
    margin: 0px;
}

.card_title {
    margin: 0;
    color: #252422;
    font-weight: 300;
    font-size: 20px !important;

    line-height: 1 !important;
    letter-spacing: .02em !important;

}

.swal-modal {
    width: 500px;
}

.main-panel {
    background-color: white;
}

.wrapper {
    background-color: white;
    width: 100%;
}

.container.fill-height {

    padding: 0px;
    margin: 0px;
}

.v-content {
    height: 100%;
}

// .v-text-field input {
//     padding:10px !important;
// }
// .v-text-field .v-label {
//     padding-left:10px !important;
//     padding-right:10px !important;
// }
.v-input__prepend-outer {
    margin-right: 9px;
    margin-left: 9px;
}

.form-control.border-input {
    font-family: 'Cairo';
}

body[dir="rtl"] {
    font-family: 'Cairo';
}

body[dir="ltr"] {
    font-family: 'Montserrat';
}

.check {
    position: absolute;
    display: block;
    cursor: pointer;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 6;
}

.check:checked~.switch {
    right: 2px;
    left: 37.5%;
    transition: 0.25s cubic-bezier(0.785, 0.135, 0.15, 0.86);
    transition-property: left, right;
    transition-delay: 0.08s, 0s;
}

.switch {
    position: absolute;
    margin: 0px;
    background-color: #fff;
    border-radius: 36px;
    z-index: 1;
    transition: 0.25s cubic-bezier(0.785, 0.135, 0.15, 0.86);
    transition-property: left, right;
    transition-delay: 0s, 0.08s;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
    vertical-align: middle;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #eee;
    -webkit-transition: 0.4s;
    transition: 0.4s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
}

input:checked+.slider {
    background-color: #ffd700;
}

input:focus+.slider {
    box-shadow: 0 0 1px #ffd700;
}

input:checked+.slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);

}

/* Rounded sliders */

.slider.round {
    border-radius: 34px;
}

.slider.round:before {
    border-radius: 50%;
}

.theme--light.v-text-field--outline>.v-input__control>.v-input__slot {
    border-width: 1px !important;
}

.form-control.border-input {
    font-size: unset;
}

input[type=number] {
    direction: ltr !important;
}

.number_input {
    direction: ltr !important;
}

.btn-cancel:hover {
    background-color: rgb(216, 216, 216);
}

.mx-icon-last-year:before {
    direction: initial !important;
    content: "\f053";
    font-family: FontAwesome;
    font-style: normal;
    font-weight: normal;
    text-decoration: inherit;
    display: -webkit-box;

}

.mx-icon-last-month:before {
    direction: initial !important;
    content: "\f100";
    font-family: FontAwesome;
    font-style: normal;
    font-weight: normal;
    text-decoration: inherit;
    display: -webkit-box;

}

.mx-icon-next-year:before {
    direction: initial !important;
    content: "\f054";
    font-family: FontAwesome;
    font-style: normal;
    font-weight: normal;
    text-decoration: inherit;
    display: -webkit-box;

}

.mx-icon-next-month:before {
    direction: initial !important;
    content: "\f101";
    font-family: FontAwesome;
    font-style: normal;
    font-weight: normal;
    text-decoration: inherit;
    display: -webkit-box;

}

.mx-calendar-content .cell.actived {
    background-color: #ffd700 !important;
}

.mx-calendar-content .cell.inrange {
    background-color: rgba(255, 235, 131, 0.57) !important;
}

.mx-datepicker-btn-confirm {
    visibility: hidden;
    height: 35px;
}

.mx-datepicker-btn-confirm:before {
    direction: initial !important;
    content: "\f00c";
    visibility: visible;
    font-size: 20px;
    font-family: FontAwesome;
    font-style: normal;
    font-weight: normal;
    text-decoration: inherit;
    display: -webkit-box;
}

.mx-input3 {
    display: inline-block;
    width: 300px;
    text-align: -webkit-right;
    direction: initial;
    height: 50px !important;
    font-weight: 700;
    padding: 27px;
    padding-right: 35px;
    font-size: 17px !important;
    line-height: 1.4;
    color: #737373;
    background-color: #eee;
    border-radius: 2px !important;
    font-family: inherit !important;
    box-shadow: none !important;
}

.navbar {
    z-index: 1;
}

.fs28 {
    font-size: 28px !important;
}

.icon-44 {
    height: 44px !important;
    width: 44px !important;
}

.fs28:before {
    font-size: 28px !important;
}

.application--is-rtl .v-badge__badge {
    right: auto;
    left: -5px !important;
    top: -5px !important;
}

.application .v-badge__badge {
    left: auto;
    right: -5px !important;
    top: -5px !important;
}

.error {
    color: white !important;
}
</style>
