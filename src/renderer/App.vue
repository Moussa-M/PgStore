<template >
  <div id="app">
    <div id="electron-titlebar" class="drag">
      <img class="titleicon" src="static/favicon.png">
    </div>
    <transition name="slide-fade">
      <keep-alive>
        <router-view
          ref="view"
          :dir="lang=='ar' ? 'rtl':'ltr'"
          :style="{'direction':lang=='ar' ? 'rtl':'ltr'}"
        ></router-view>
      </keep-alive>
    </transition>
  </div>
</template>
<script>
const { ipcRenderer } = require('electron')
export default {
  name: 'app',
  data () {
    return {
      cache: false,
      lang: 'ar',
      barcode: ''
    }
  },
  created () {
    // barcode listener
    try {
      let user = window.store.getters.user
      this.lang = user.lang
      this.$i18n.locale = this.lang
      moment.locale(this.lang == 'ar' ? 'ar-dz' : this.lang)
    } catch (err) {
    }
    this.$watch(
      '$i18n.locale',
      () => {
        try {
          console.log('changed' + this.$i18n.locale)
          this.lang = this.$i18n.locale
          moment.locale(this.lang == 'ar' ? 'ar-dz' : this.lang)
          $(this.refs['view']).attr(
            'dir',
            this.$i18n.locale == 'ar' ? 'rtl' : 'ltr'
          )
        } catch (err) {}
      },
      { deep: false }
    )

    window.addEventListener(
      'keypress',
      event => {
        if (event.charCode == 13) {
          if (this.barcode != '') {
            // this.$route.name
            switch (this.$route.name) {
              case 'new_order':
                this.$eventBus.$emit('barcode', this.barcode)
                this.barcode = ''
                break

              case 'edit_order':
                this.$eventBus.$emit('barcode', this.barcode)
                this.barcode = ''
                break

              default:
                this.barcode = ''
              // bobe ate the cacke
            }
          }
        } else {
          if (
            this.$route.name == 'new_order' ||
            this.$route.name == 'edit_order'
          ) {
            if (event.shiftKey) {
              this.barcode = this.barcode + event.key
              event.preventDefault()
            } else {
              this.barcode = ''
            }
          }
        }
      },
      true
    )
  },
  mounted () {
    this.$nextTick(() => {
      setTimeout(() => {
        ipcRenderer.send('main-loaded', 'ping')
      }, 3000)
    })
    // document.head.innerHTML = document.head.innerHTML + "<base href='/' />";
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
}
</script>
<style >
/*@import "static/assets/css/font-awesome.min.css";*/
/* @import "./assets/css/bootstrap.min.css"; */
/* @import "~bootstrap/dist/css/bootstrap.min.css"; */
@import "~chartist/dist/chartist.min.css";
@import "~hover.css/css/hover-min.css";

 @import "~mystyles/assets/css/bootstrap.min.css"; 
@import "~mystyles/assets/css/animate.min.css";
@import "~mystyles/assets/fonts/muli.font.css";
@import "~mystyles/assets/css/paper-dashboard.css";
@import "~mystyles/assets/css/themify-icons.css";


/* fallback */
@font-face {
  font-family: "Material Icons";
  font-style: normal;
  font-weight: 400;
  src: url(~mystyles/assets/fonts/MaterialDesignFonts.woff2) format("woff2");
}

.material-icons {
  font-family: "Material Icons";
  font-weight: normal;
  font-style: normal;
  font-size: 24px; /* Preferred icon size */
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
}

body {
  height: 100%;
  overflow: hidden;
  user-select: none;
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
.wrapper[electron-titlebar-platform="win32"] #electron-titlebar > .button {
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
  overflow: auto !important;
}
.wrapper::-webkit-scrollbar {
  margin-top: 30px;
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
.sidebar .nav > li.active-pro {
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
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
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
.slide-fade-fast-enter, .slide-fade-fast-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(5px);
  opacity: 0;
}
.animated {
  -webkit-animation-duration: 0.6s;
  animation-duration: 0.6s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}
.pagination > .active > a,
.pagination > .active > a:focus,
.pagination > .active > a:hover,
.pagination > .active > span,
.pagination > .active > span:focus,
.pagination > .active > span:hover {
  color: #fff;
  cursor: pointer;
  background-color: #ffd700;
  border-color: #ffd700;
}
.pagination > li > a,
.pagination > li > span {
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
.navbar .navbar-nav > li > a.btn {
  font-size: 18px;
}
*[dir="rtl"] .row > .col-xs-1,
*[dir="rtl"] .row > .col-xs-2,
*[dir="rtl"] .row > .col-xs-3,
*[dir="rtl"] .row > .col-xs-4,
*[dir="rtl"] .row > .col-xs-5,
*[dir="rtl"] .row > .col-xs-6,
*[dir="rtl"] .row > .col-xs-7,
*[dir="rtl"] .row > .col-xs-8,
*[dir="rtl"] .row > .col-xs-9,
*[dir="rtl"] .row > .col-xs-10,
*[dir="rtl"] .row > .col-xs-11,
*[dir="rtl"] .row > .col-xs-12 {
  float: right;
}
@media (min-width: 768px) {
  *[dir="rtl"] .row > .col-sm-1,
  *[dir="rtl"] .row > .col-sm-2,
  *[dir="rtl"] .row > .col-sm-3,
  *[dir="rtl"] .row > .col-sm-4,
  *[dir="rtl"] .row > .col-sm-5,
  *[dir="rtl"] .row > .col-sm-6,
  *[dir="rtl"] .row > .col-sm-7,
  *[dir="rtl"] .row > .col-sm-8,
  *[dir="rtl"] .row > .col-sm-9,
  *[dir="rtl"] .row > .col-sm-10,
  *[dir="rtl"] .row > .col-sm-11,
  *[dir="rtl"] .row > .col-sm-12 {
    float: right;
  }
}
@media (min-width: 992px) {
  *[dir="rtl"] .row > .col-md-1,
  *[dir="rtl"] .row > .col-md-2,
  *[dir="rtl"] .row > .col-md-3,
  *[dir="rtl"] .row > .col-md-4,
  *[dir="rtl"] .row > .col-md-5,
  *[dir="rtl"] .row > .col-md-6,
  *[dir="rtl"] .row > .col-md-7,
  *[dir="rtl"] .row > .col-md-8,
  *[dir="rtl"] .row > .col-md-9,
  *[dir="rtl"] .row > .col-md-10,
  *[dir="rtl"] .row > .col-md-11,
  *[dir="rtl"] .row > .col-md-12 {
    float: right;
  }
}
@media (min-width: 1170px) {
  *[dir="rtl"] .row > .col-lg-1,
  *[dir="rtl"] .row > .col-lg-2,
  *[dir="rtl"] .row > .col-lg-3,
  *[dir="rtl"] .row > .col-lg-4,
  *[dir="rtl"] .row > .col-lg-5,
  *[dir="rtl"] .row > .col-lg-6,
  *[dir="rtl"] .row > .col-lg-7,
  *[dir="rtl"] .row > .col-lg-8,
  *[dir="rtl"] .row > .col-lg-9,
  *[dir="rtl"] .row > .col-lg-10,
  *[dir="rtl"] .row > .col-lg-11,
  *[dir="rtl"] .row > .col-lg-12 {
    float: right;
  }
}
</style>