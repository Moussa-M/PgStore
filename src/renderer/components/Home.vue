<template>
    <div ondragstart="return false;" ondrop="return false;" class="h-100 w-100">
        <!--  <transition enter-active-class="animated fadeIn" >
                <Preferences v-on:prefclose="prefclose" v-show="showSettings" />
              </transition>
            -->
        <div class="wrapper">
            <div class="sidebar off-canvas-sidebar" data-background-color="white" data-active-color="danger" :class="$i18n.locale=='ar'?'RTLSide':'LTRSide'" >
                <div class="sidebar-wrapper" :class="$i18n.locale=='ar'?'sidebar-wrapper-rtl':'sidebar-wrapper-ltr'" >
                    <div tabindex="-1" class="logo" style="height: 84px !important;">
                        <a  class="simple-text" style=" padding:0px;position: relative;
                                    top: 50%;
                                    -webkit-transform: translateY(-50%);
                                    -ms-transform: translateY(-50%);
                                    transform: translateY(-50%);">
                            {{storename}}

                        </a>
                    </div>
                    <ul class="nav" style="padding-right:0px">
                        <router-link v-show="$hasAction('view_dashboard')" :active-class="$i18n.locale=='ar'?'activeRTL':'activeLTR'" tag="li" :to="{ name: 'dashboard'}">
                            <a>
                                <i class="ti-panel"></i>
                                <p>
                                {{$t("dashboard")}}
                                <span
                                    :style="{'float':$i18n.locale=='ar' ? 'left':'right'}"
                                    style="font-size:16px"
                                >F1</span>
                                </p>
                            </a>
                        </router-link>
                        <router-link v-show="$hasAction('view_orders')" :active-class="$i18n.locale=='ar'?'activeRTL':'activeLTR'" tag="li" :to="{ name: 'orders'}">
                            <a>
                        <i class="ti-shopping-cart"></i>
                        <p>
                          {{$t("orders")}}
                          <span
                            :style="{'float':$i18n.locale=='ar' ? 'left':'right'}"
                            style="font-size:16px"
                          >F2</span>
                        </p>
                      </a>
                        </router-link>
                        <router-link v-show="$hasAction('view_products')" :active-class="$i18n.locale=='ar'?'activeRTL':'activeLTR'" tag="li" :to="{ name: 'products'}">
                            <a>
                        <i class="ti-archive"></i>
                        <p>
                          {{$t("products")}}
                          <span
                            :style="{'float':$i18n.locale=='ar' ? 'left':'right'}"
                            style="font-size:16px"
                          >F3</span>
                        </p>
                      </a>
                        </router-link>
                        <router-link v-show="$hasAction('view_invoices')" :active-class="$i18n.locale=='ar'?'activeRTL':'activeLTR'" tag="li" :to="{ name: 'invoices'}">
                            <a>
                                <li class="menu-icon">
    
                                    <font-awesome-icon tag="li" icon="file-invoice" />
                                </li>
    
                                <p>
                                    {{$t("buy_invoices")}}
                                    <span :style="{'float':$i18n.locale=='ar' ? 'left':'right'}" style="font-size:16px">F4</span>
                                </p>
                            </a>
                        </router-link>
                        <router-link v-show="$hasAction('view_customers')" :active-class="$i18n.locale=='ar'?'activeRTL':'activeLTR'" tag="li" :to="{ name: 'customers'}">
                            <a>
                                <!-- <i class="ti-view-list-alt"></i> -->
                                <i>
                          <font-awesome-icon icon="users"/>
                        </i>
                                <p>
                                    {{ $t("customers") }}
                                    <span :style="{'float':$i18n.locale=='ar' ? 'left':'right'}" style="font-size:16px">F5</span>
                                </p>
                            </a>
                        </router-link>

                          <router-link v-show="$hasAction('view_employees')" :active-class="$i18n.locale=='ar'?'activeRTL':'activeLTR'" tag="li" :to="{ name: 'employees'}">
                            <a>
                                <!-- <i class="ti-view-list-alt"></i> -->
                                <i>
                          <font-awesome-icon icon="users-cog"/>
                        </i>
                                <p>
                                    {{ $t("employees") }}
                                    <span :style="{'float':$i18n.locale=='ar' ? 'left':'right'}" style="font-size:16px">F7</span>
                                </p>
                            </a>
                        </router-link>

                        <hr>
                        <li v-show="$hasAction('add_order')" class="btn" style="border-bottom: none;border-top: none;border-color: rgb(219, 219, 219);border-radius: 0px;" @click="openFastSell()">
                            <a style="text-align:start;padding:0px">
                        <i>
                          <font-awesome-icon icon="cart-plus"/>
                        </i>
                        <p>
                          {{ $t("fast_sell") }}
                          <span
                            :style="{'float':$i18n.locale=='ar' ? 'left':'right'}"
                            style="font-size:16px"
                          >F6</span>
                        </p>
                      </a>
                        </li>
    
                        <router-link v-if="!is_activated" active-class="active" class="active-pro activate" tag="li" :to="{ name: 'activation'}">
                            <a>
                        <i class="ti-key"></i>
                        <p>{{$t("activation")}}</p>
                      </a>
                        </router-link>
    
                        <li tabindex="0" active-class="active" class="active-pro logout" @click="logout()">
                            <a>
                        <i class="ti-export"></i>
                        <p>{{$t('log_out')}}</p>
                      </a>
                        </li>
    
                        <router-link v-show="$hasAction('change_settings')" active-class="active" class="active-pro" tag="li" :to="{ name: 'preferences'}">
                            <a>
                        <i class="ti-settings"></i>
                        <p>{{$t("settings")}}</p>
                      </a>
                        </router-link>
                    </ul>
                </div>
            </div>
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </div>
    </div>
</template>

<script>
import { EmployeeLoggingLog } from './models';
const {
    ipcRenderer
} = require("electron");
export default {
    name: "Home",
    components: {},
   
    data: function() {
        return {
            employee:{},
            showSettings: false,
            is_activated: false,
            storename: ""
        };
    },
    methods: {

        openFastSell() {
            this.$router.push("/fast-sell");
        },
        logout: function() {


            let emp_id = store.getters.is_logged_in.employee_id
            let emplog = new EmployeeLoggingLog(emp_id,"check_out");
            window.store.dispatch("is_logged_in", {"status":false});
            this.$router.push("/login");
        },
        prefclose: function() {
            this.$router.push("/preferences");
            // this.showSettings = false;
        }
    },
    /* components:{
              VueChartist,
          }, */
    
    activated(){
         this.employee = store.getters.getEmployee(store.getters.is_logged_in.employee_id)
    },
    created: function() {
        //this.logout();
        console.log("home create");
        this.all_actions = window.store.getters.all_actions;
        this.is_activated = window.store.getters.is_activated;
        this.storename = window.store.getters.user.storename;
         this.employee = store.getters.getEmployee(store.getters.is_logged_in.employee_id)
        ipcRenderer.on("KEYBOARD", (event, arg) => {
            switch (arg) {
                case "F1":
                    if(this.$hasAction('view_dashboard'))this.$router.push("dashboard");
                    break;
                case "F2":
                    if(this.$hasAction('view_orders'))this.$router.push("orders");
                    break;
                case "F3":
                    if(this.$hasAction('view_products'))this.$router.push("products");
                    break;
                case "F4":
                    if(this.$hasAction('view_invoices'))this.$router.push("invoices");
                    break;
                case "F5":
                    if(this.$hasAction('view_customers'))this.$router.push("customers");
                    break;
                case "F6":
                    
                    if(this.$hasAction('add_order'))this.openFastSell();
                    break;
            }
        });

        var fixedTop = false;
        var transparent = true;
        var navbar_initialized = false;
        var mobile_menu_initialized = false;
        var pd = {
            misc: {
                navbar_menu_visible: 0
            },
            // checkScrollForTransparentNavbar: debounce(function() {
            //   if ($(document).scrollTop() > 381) {
            //     if (transparent) {
            //       transparent = false;
            //       $(".navbar-color-on-scroll").removeClass("navbar-transparent");
            //       $(".navbar-title").removeClass("hidden");
            //     }
            //   } else {
            //     if (!transparent) {
            //       transparent = true;
            //       $(".navbar-color-on-scroll").addClass("navbar-transparent");
            //       $(".navbar-title").addClass("hidden");
            //     }
            //   }
            // }),
            initRightMenu: debounce(function() {
                var $sidebar_wrapper = $(".sidebar-wrapper");
                var $sidebar = $(".sidebar");

                if (!mobile_menu_initialized) {
                    /* var $navbar = $('nav').find('.navbar-collapse').children('.navbar-nav');

                                                  var mobile_menu_content = '';

                                                  var nav_content = $navbar.html();

                                                  nav_content = '<ul class="nav nav-mobile-menu">' + nav_content + '</ul>';

                                                  var $sidebar_nav = $sidebar_wrapper.find(' > .nav'); */

                    // insert the navbar form before the sidebar list
                    $sidebar.addClass("off-canvas-sidebar");
                    // var $nav_content = $(nav_content);
                    //  $nav_content.insertBefore($sidebar_nav);

                    $(".sidebar-wrapper .dropdown .dropdown-menu > li > a").click(
                        function(event) {
                            event.stopPropagation();
                        }
                    );

                    // simulate resize so all the charts/maps will be redrawn
                    window.dispatchEvent(new Event("resize"));

                    mobile_menu_initialized = true;
                } else {
                    if ($(window).width() > 991) {
                        // reset all the additions that we made for the sidebar wrapper only if the screen is bigger than 991px
                        $sidebar_wrapper.find(".nav-mobile-menu").remove();
                        $sidebar.removeClass("off-canvas-sidebar");

                        mobile_menu_initialized = false;
                    }
                }
            }, 0)
        };

        $(document).ready(function() {
            var window_width = $(window).width();

            // Init navigation toggle for small screens
            if (window_width <= 991) {
                pd.initRightMenu();
            }

            //  Activate the tooltips
        });

        $(document).on("click", ".navbar-toggle", function() {
            var $toggle = $(this);
            if (pd.misc.navbar_menu_visible == 1) {
                $("html").removeClass("nav-open");
                pd.misc.navbar_menu_visible = 0;
                $("#bodyClick").remove();
                setTimeout(function() {
                    $toggle.removeClass("toggled");
                }, 0);
            } else {
                setTimeout(function() {
                    $toggle.addClass("toggled");
                }, 0);

                var div = '<div id="bodyClick"></div>';
                $(div)
                    .appendTo("body")
                    .click(function() {
                        $("html").removeClass("nav-open");
                        pd.misc.navbar_menu_visible = 0;
                        $("#bodyClick").remove();
                        setTimeout(function() {
                            $toggle.removeClass("toggled");
                        }, 0);
                    });

                $("html").addClass("nav-open");
                pd.misc.navbar_menu_visible = 1;
            }
        });

        // activate collapse right menu when the windows is resized
        $(window).resize(function() {
            if ($(window).width() <= 991) {
                pd.initRightMenu();
            }
        });

        // Returns a function, that, as long as it continues to be invoked, will not
        // be triggered. The function will be called after it stops being called for
        // N milliseconds. If `immediate` is passed, trigger the function on the
        // leading edge, instead of the trailing.

        function debounce(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this,
                    args = arguments;
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                }, wait);
                if (immediate && !timeout) func.apply(context, args);
            };
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss">
.active:parent {
    color: #eb5e28;
}

.activate {
    bottom: 100px !important;
    cursor: pointer;
    i {
        transform: rotate(90deg) !important;
        -ms-transform: rotate(90deg) !important;
        -moz-transform: rotate(90deg) !important;
        -webkit-transform: rotate(90deg) !important;
        -o-transform: rotate(90deg) !important;
    }
}

.logout {
    bottom: 60px !important;
    cursor: pointer;
    i {
        transform: rotate(90deg) !important;
        -ms-transform: rotate(90deg) !important;
        -moz-transform: rotate(90deg) !important;
        -webkit-transform: rotate(90deg) !important;
        -o-transform: rotate(90deg) !important;
    }
}

.logo {
    text-transform: capitalize;
}

.sidebar-wrapper {
    background-color: #f1e7ff2b !important;
}

.sidebar .nav li.activeRTL>a:before,
.off-canvas-sidebar .nav li.activeRTL>a:before {
    border-left: 17px solid #dddddd;
    border-top: 17px solid transparent;
    border-bottom: 17px solid transparent;
    border-right: none;
    content: "";
    display: inline-block;
    position: absolute;
    right: auto;
    left: 0;
    top: 8px;
}

.sidebar[data-active-color="danger"] .nav li.activeRTL>a,
.off-canvas-sidebar[data-active-color="danger"] .nav li.activeRTL>a {
    color: #ffd700;
    opacity: 1;
}

.sidebar .nav li.activeLTR>a:before,
.off-canvas-sidebar .nav li.activeLTR>a:before {
    border-right: 17px solid #dddddd;
    border-top: 17px solid transparent;
    border-bottom: 17px solid transparent;
    content: "";
    display: inline-block;
    position: absolute;
    right: 0;
    top: 8px;
}

.sidebar[data-active-color="danger"] .nav li.activeLTR>a,
.off-canvas-sidebar[data-active-color="danger"] .nav li.activeLTR>a {
    color: #ffd700;
    opacity: 1;
}

// .activeRTL{
//     border-left: 17px solid #DDDDDD;
//     border-top: 17px solid transparent;
//     border-bottom: 17px solid transparent;
//     border-right: none;
//     content: "";
//     display: inline-block;
//     position: absolute;
//     right: auto;
//     left: 0;
//     top: 8px;
// }
// .activeLTR{
//       border-right: 17px solid #DDDDDD;
//     border-top: 17px solid transparent;
//     border-bottom: 17px solid transparent;
//     border-left: none;
//     content: "";
//     display: inline-block;
//     position: absolute;
//     right: 0;
//     left: auto;
//     top: 8px;
// }
.menu-icon {
    font-size: 24px;
    float: left;
    margin-right: 15px;
    line-height: 30px;
    width: 30px;
    text-align: center;
}
.LTRSide{
 left:auto;
}
@media (max-width: 992px) {
    .LTRSide{
 right:0px;
 left:auto;
}
}
.RTLSide{
left:auto;
right: 0px;
}
.sidebar-wrapper-ltr {
    box-shadow: inset -1px 0px 0px 0px #DDDDDD !important;
}
.sidebar-wrapper-rtl {
        box-shadow:  inset 1px 0px 0px 0px #DDDDDD !important;
}
</style>

