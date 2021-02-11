import { Notification } from './components/models';
import router from './router'
import Vue from 'vue'
const {ipcRenderer} = require("electron");
let $eventBus = Vue.prototype.$eventBus;
let $router = router;

let barcode = ""
//store.dispatch("notifications", []);
setInterval(() => {
  console.log("fired")
    let notifications = JSON.parse(JSON.stringify(store.getters.notifications))
    let products = JSON.parse(JSON.stringify(store.getters.products))
    _.forEach(products, (product) => {
      
        if (hasAlmostExpired(product)) {
            let type = hasExpired(product) ? "expired" : "almost_expired"
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
    $eventBus.$emit("notifications_changed")
  }, 900000)

  ipcRenderer.on("KEYBOARD", (event, arg) => {
        if (arg == "Esc") {

            if (swal.getState().isOpen) {
                swal.close()
            } else {
                if (
                    ["dashboard", "orders", "customers", "products", "invoices"].indexOf(
                        $router.currentRoute.name
                    ) == -1
                ) {
                    $router.go(-1);
                } else {

                }
            }

        } else if (arg == "del" || arg == "cmd_del" || arg == "edit" || arg == "add" || arg == "r" || arg == "s") {
            $eventBus.$emit(arg)
        } else if (arg == "search") {

            $("#search").focus();
        }

    });

    setTimeout(() => {
      document.addEventListener(
          "keydown",
          event => {

              if (event.which == 38) {
                  $eventBus.$emit('up')
                  event.preventDefault();
                  event.stopPropagation();
                  event.stopImmediatePropagation();
                  return false;
              }
              if (event.which == 40) {
                  $eventBus.$emit('down')
                  event.preventDefault();
                  event.stopPropagation();
                  event.stopImmediatePropagation();
                  return false;
              }
          });
      document.addEventListener(
          "keypress",
          event => {

              if (event.charCode == 13) {
                  if (barcode != "") {
                 //     console.log(index + " ScannedBarCode " + barcode);

                   //   index++;
                      // $router.currentRoute.name
                      switch ($router.currentRoute.name) {
                          case "new_order":
                              $eventBus.$emit("barcode", barcode);
                              barcode = "";

                              break;

                          case "fast_sell":
                              console.log("im here");
                              $eventBus.$emit("barcode", barcode);
                              barcode = "";

                              break;

                          case "products":
                              $eventBus.$emit("barcode", barcode);
                              barcode = "";

                              break;

                          case "edit_order":
                              $eventBus.$emit("barcode", barcode);
                              barcode = "";

                              break;

                          default:
                              barcode = "";

                              // bobe ate the cacke
                      }

                      event.preventDefault();
                      event.stopPropagation();
                      event.stopImmediatePropagation();
                      return false;
                  }
              } else {
                  // if (
                  //     $router.currentRoute.name == 'new_order' ||
                  //     $router.currentRoute.name == 'products' ||
                  //     $router.currentRoute.name == 'home' ||
                  //     $router.currentRoute.name == 'fast_sell' ||
                  //     $router.currentRoute.name == 'edit_order'
                  // ) {
                  if (event.shiftKey) {
                      barcode = barcode + event.key;
                  } else {
                      barcode = "";
                  }

                  //  }
              }

          },
          true
      );
  }, 0)

  function hasAlmostExpired(product) {

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
  
  }
  function hasExpired(product) {
  
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

  }
  