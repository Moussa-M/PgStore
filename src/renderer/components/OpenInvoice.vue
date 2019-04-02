<template>
  <div style="height:100%;padding-top:35px">
    <div class="row" style="height:100%;">
      <div class="col-sm-3" style="height:100%;background-color:white;padding:15px">
        <div class="util-box" style="
            padding-top: 10px;">
          <div  :class="$i18n.locale=='ar'?'text-right':'text-left'" style="
               display: inline-block;">
            <p style="font-size: 20px; font-weight: 500; padding-top: 10px;">{{$t("printing")}}</p>
          </div>
          <div
           :style="{'float':$i18n.locale=='ar' ? 'left':'right'}"
            :class="$i18n.locale=='ar'?'text-left':'text-right'"
            style="
               display: inline-block;
               
               padding-top:  10px;
               "
          >
            <button
              @click="toPDF"
              class="btn btn-outline-primar btn-warning"
              style="position: relative; top: 0px; right: 0px; margin-bottom: 10px;"
            >{{$t("print")}}</button>
            <button
              @click="goBack"
              class="btn btn-outline-primar btn-danger"
              style="position: relative; top: 0px; right: 0px; margin-bottom: 10px;"
            >{{$t("close")}}</button>
          </div>
        </div>
        <hr>
        <div class="util-box">
          <div class="form-group">
            <p
              style="font-size: 20px;
                  font-weight: 500;display:inline-block;width:40%;
                  padding-top: 10px;"
            >{{$t("paper_size")}}</p>
            <select v-model="paperSize" class="form-control" style="width:55%;display:inline-block">
              <option value="A0">{{$t("A0")}}</option>
              <option value="A1">{{$t("A1")}}</option>
              <option value="A2">{{$t("A2")}}</option>
              <option value="A3">{{$t("A3")}}</option>
              <option value="A4">{{$t("A4")}}</option>
              <option value="A5">{{$t("A5")}}</option>
              <option value="A6">{{$t("A6")}}</option>
              <option value="Letter">{{$t("Letter")}}</option>
              <option value="Legal">{{$t("Legal")}}</option>
            </select>
          </div>
        </div>
        <hr>
        <div class="util-box">
          <div class="form-group">
            <p
              style="font-size: 20px;
                  font-weight: 500;display:inline-block;width:40%;
                  padding-top: 10px;"
            >{{$t("printers")}}</p>
            <select
              v-model="printerName"
              class="form-control"
              style="width:55%;display:inline-block"
            >
              <option
                :value="printer.name"
                v-for="printer in printers"
                :key="printer.name"
              >{{printer.name}}</option>
            </select>
          </div>
        </div>
        <hr>
        <div class="util-box">
          <div class="form-group">
            <p
              style="font-size: 20px;
                  font-weight: 500;display:inline-block;width:40%;
                  padding-top: 10px;"
            >{{$t("layout")}}</p>
            <select v-model="layout" class="form-control" style="width:55%;display:inline-block">
              <option value="false" selected>{{$t("portrait")}}</option>
              <option value="true">{{$t("landscape")}}</option>
            </select>
          </div>
        </div>
        <hr>
        <div class="util-box">
          <div class="form-group">
            <p
              style="font-size: 20px;
                  font-weight: 500;display:inline-block;width:40%;
                  padding-top: 10px;"
            >{{$t("margins")}}</p>
            <select v-model="margins" class="form-control" style="width:55%;display:inline-block">
              <option value="0" selected>{{$t("default")}}</option>
              <option value="1">{{$t("none")}}</option>
              <option value="2">{{$t("minimum")}}</option>
            </select>
          </div>
        </div>
        <hr>
        <div class="util-box">
          <div class="form-group">
            <p
              style="font-size: 20px;
                  font-weight: 500;display:inline-block;width:40%;
                  padding-top: 10px;"
            >{{$t("scale")}}</p>
            <input
              v-model="scale"
              id="input"
              type="number"
              style="width:55%;display:inline-block"
              max="200"
              min="10"
              class="form-control"
              aria-label="Scale"
              tabindex="0"
            >
            <span v-if="scale > 200" style="color:#eb5e28">{{$t("scale_must_10_200")}}</span>
          </div>
        </div>
      </div>
      <div class="col-sm-9" style="background-color:#e2e1e0;height:100%;">
        <div class="center-page">
          <!-- <div :class="!is_loading?'show_frame':''"  class="iframe_container">
               <iframe  type="application/pdf"
               frameborder="0" sandbox="allow-top-navigation allow-same-origin allow-forms allow-popups allow-scripts" class="canvas"  id="the-canvas" :src="page" width="100%" height="100%"></iframe>
               </div>
          <p  style="position:absolute;top:50%;left:50%" :hidden="!is_loading" >loading document ...</p>-->
          <div id="invoice-container">
            <div :class="$i18n.locale=='ar'?'rtl':''" id="invoice" class="invoice-box">
              <table cellpadding="0" cellspacing="0">
                <tr class="top">
                  <td colspan="4">
                    <table>
                      <tr>
                        <td v-if="store.logo" class="title">
                          <!-- <img :src="store.logo" style="width:100%; max-width:300px;"> -->
                          <Avatar
                          :image="store.logo"
                          :width="200"
                          :height="200"
                          :crop="true"
                          :removeable="false"
                          :radius="1"
                        />
                        </td>
                        <td style="padding-top:30px">
                          {{$t("invoice")}}: #{{order.id}}
                          <br>
                          {{$t("created")}}: {{ invoiceDate() }}
                          <!-- <br>Due: February 1, 2015 -->
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr class="information">
                  <td colspan="4">
                    <table>
                      <tr>
                        <td>
                          {{store.name}}
                          <br v-if="store.address">
                          {{store.address}}
                          <br v-if="store.phone">
                          <span dir="ltr">{{store.phone}}</span>
                        </td>
                        <template v-if="customer!=null">
                          <td>
                            {{customer.name}}
                            <br>
                           <span dir="ltr"> {{customer.phone}}</span>
                          </td>
                        </template>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr class="heading">
                  <td>{{$t("item")}}</td>
                  <td align="center" class="text-center">{{$t("u_price")}} ({{$t(currency.toLowerCase())}})</td>
                  <td align="center" class="text-center">{{$t("qte")}}</td>
                  <td :class="$i18n.locale=='ar'?'text-left':'text-right'">{{$t("total")}} ({{$t(currency.toLowerCase())}})</td>
                </tr>
                <tr v-for="item in items" :key="item.name" class="item">
                  <td>{{item.name}}</td>
                  <td align="center" class="text-center">{{item.sell_price}}</td>
                  <td align="center" class="text-center">{{item.unit=='piece'? item.qte:item.weight}} {{item.unit=='piece' ? ($t('piece')).toUpperCase():$t(item.unit.toLowerCase())}}</td>
                  <td
                    :class="$i18n.locale=='ar'?'text-left':'text-right'"
                  >{{(item.sell_price*(item.unit=='piece'? item.qte:item.weight)).toFixed(2)}}</td>
                </tr>
                <tr class="total">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td :class="$i18n.locale=='ar'?'text-left':'text-right'">{{$t("total")}}: {{total.toFixed(2)}} {{$t(currency.toLowerCase())}}</td>
                </tr>
                <tr class="total">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td :class="$i18n.locale=='ar'?'text-left':'text-right'">{{ $t("discount") }}: {{discount.toFixed(2)}} {{$t(currency.toLowerCase())}}</td>
                </tr>
                <tr class="total">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td :class="$i18n.locale=='ar'?'text-left':'text-right'">{{$t("total_net")}}  {{total_net.toFixed(2)}} {{$t(currency.toLowerCase())}}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import Avatar from './sub_components/Avatar.vue'
const webContents = require('electron').remote.getCurrentWebContents()
const app = require('electron').remote.app
const { ipcRenderer } = require('electron')
const { BrowserWindow } = require('electron').remote
const path = require('path')
export default {
  name: 'OpenInvoice',
  props: {
    id: [Number, String]
  },
  components: {Avatar},
  data: function () {
    return {
      url: '',
      order: {},
      items: {},
      currency: 0,
      total: 0,
      total_net: 0,
      discount: 0,
      scale: 100,
      store: {},
      page: 'pdfjs/web/viewer.html',
      is_loading: true,
      zoom_rate: 1,
      viewport: null,
      customer: null,
      printers: [],
      printerName: '',
      margins: 0,
      layout: false,
      paperSize: 'A4'
    }
  },
  created () {
    // console.log("invoice created");
    this.printers = webContents.getPrinters()
    this.printerName = _.find(this.printers, { isDefault: true })
      ? _.find(this.printers, { isDefault: true }).name
      : ''
    this.url = window.location.href
    this.currency = store.getters.user.currency

    this.order = JSON.parse(JSON.stringify(store.getters.getOrder(this.id)))
    // console.log("user");
    let user = store.getters.user
    // console.log(user);
    this.store = {
      name: user.storename.trim(),
      address: user.storeaddress.trim(),
      phone: user.storephone.trim(),
      logo: user.storelogo
    }

    if (parseInt(this.order.customer.id) != 1) {
      this.customer = {
        name: this.order.customer.name.trim(),
        phone: this.order.customer.phone.trim()
      }
    } else {
      this.customer = null
    }

    this.items = _.forEach(this.order.products, p => {
      let amount = p.unit == 'piece' ? p.qte : p.weight
      this.total = this.total + amount * p.sell_price
      this.discount =
        this.discount + (p.discount / 100) * (amount * p.sell_price)
    })
    this.total_net = this.total - this.discount
    this.total_net =
      this.total_net - (this.order.customer.discount / 100) * this.total_net

    // this.loadPDF();
  },
  methods: {
    toPDF () {
      // const convertHTMLToPDF = require("pdf-puppeteer");
      // const { ipcRenderer } = require("electron");

      let { width, height } = this.getPaperSize()
      let margin = this.getPaperMargin()
      this.order.currency = this.currency
      let user = store.getters.user

      ipcRenderer.send('print', {
        order: this.order,
        user: user,
        lang: this.$i18n.locale,
        printOptions: {
          margin: margin,
          width: width,
          height: height,
          scale: this.scale,
          pageType: this.paperSize,
          landscape: this.layout == 'true',
          deviceName: this.printerName
        }
      })
    },

    print () {
      let { width, height } = this.getPaperSize()
      let margin = this.getPaperMargin()

      let pg =
        window.location.href.replace('/invoice/', '/invoice_template/') +
        '?width=' +
        width +
        '&height=' +
        height +
        '&padding=' +
        margin
      const { BrowserWindow } = require('electron').remote
      let win = new BrowserWindow({
        width: 800,
        height: 600,
        show: true
      })
      win.loadURL(pg)

      win.webContents.on('did-finish-load', () => {
        // Use default printing options
        win.webContents.print(
          {
            silent: true,
            deviceName: this.printerName,
            printBackground: true
          },
          success => {
            // console.log("printed");
          }
        )
        win.webContents.openDevTools()
      })
    },
    goBack () {
      this.$router.go(-1)
      this.$destroy()
    },
    invoiceDate (d) {
      return this.$i18n.locale == 'ar' ? moment(d).format('DD MMM YYYY') : moment(d).format('MMM DD YYYY')
    },
    getPaperMargin () {
      // console.log("this.margins");
      // console.log(this.margins);
      switch (parseInt(this.margins)) {
        case 0:
          return '30px'
          break
        case 1:
          return '0px'
          break
        case 2:
          return '15px'
          break
      }
    },
    getPaperSize () {
      let dpi = 96
      switch (this.paperSize) {
        case 'A0':
          return {
            width: 33.1 * dpi + 'px',
            height: 46.8 * dpi + 'px'
          }
          break
        case 'A1':
          return {
            width: 23.4 * dpi + 'px',
            height: 33.1 * dpi + 'px'
          }
          break
        case 'A2':
          return {
            width: 16.5 * dpi + 'px',
            height: 23.4 * dpi + 'px'
          }
          break
        case 'A3':
          return {
            width: 11.7 * dpi + 'px',
            height: 16.5 * dpi + 'px'
          }
          break
        case 'A4':
          return {
            width: 8.3 * dpi + 'px',
            height: 11.7 * dpi + 'px'
          }
          break
        case 'A5':
          return {
            width: 5.8 * dpi + 'px',
            height: 8.3 * dpi + 'px'
          }
          break
        case 'A6':
          return {
            width: 4.1 * dpi + 'px',
            height: 5.8 * dpi + 'px'
          }
          break
        case 'A7':
          return {
            width: 2.9 * dpi + 'px',
            height: 4.1 * dpi + 'px'
          }
          break
        case 'A8':
          return {
            width: 2.0 * dpi + 'px',
            height: 2.9 * dpi + 'px'
          }
          break
        case 'A9':
          return {
            width: 1.5 * dpi + 'px',
            height: 2.0 * dpi + 'px'
          }
          break
        case 'Letter':
          return {
            width: 8.3 * dpi + 'px',
            height: 110 * dpi + 'px'
          }
          break
        case 'Legal':
          return {
            width: 8.3 * dpi + 'px',
            height: 140 * dpi + 'px'
          }
          break
      }
    }
  }
}
</script>


<style scoped>
.invoice-container {
  max-width: 900px;
}

.invoice-box {
  background-color: #ffffff;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  max-width: 800px;
  width: 800px;
  margin: auto;
  padding: 30px;
  border: 1px solid #eee;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  font-size: 0.89vw;
  line-height: 24px;
  font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
  color: #555;
}
@media only screen and (max-width: 1600px) {
  .invoice-box {
    font-size: 16px;
  }
}
.invoice-box table {
  width: 100%;
  line-height: inherit;
  text-align: left;
  white-space: normal !important;
}

.invoice-box table td {
  padding: 5px;
  vertical-align: top;
}

.invoice-box table tr td:nth-child(2) {
  text-align: right;
}

.invoice-box table tr.top table td {
  padding-bottom: 20px;
}

.invoice-box table tr.top table td.title {
  font-size: 45px;
  line-height: 45px;
  color: #333;
}

.invoice-box table tr.information table td {
  padding-bottom: 40px;
}

.invoice-box table tr.heading td {
  background: #eee;
  border-bottom: 1px solid #ddd;
  font-weight: bold;
}

.invoice-box table tr.details td {
  padding-bottom: 20px;
}

.invoice-box table tr.item td {
  border-bottom: 1px solid #eee;
}

.invoice-box table tr.item.last td {
  border-bottom: none;
}

.invoice-box table tr.total td:nth-child(4) {
  border-bottom: 1px solid #eee;
  font-weight: bold;
}

@media only screen and (max-width: 600px) {
  .invoice-box table tr.top table td {
    width: 100%;
    display: block;
    text-align: center;
  }
  .invoice-box table tr.information table td {
    width: 100%;
    display: block;
    text-align: center;
  }
}

/** RTL **/

.rtl {
  direction: rtl;
  font-family: Tahoma, "Helvetica Neue", "Helvetica", Helvetica, Arial,
    sans-serif;
}

.rtl table {
  text-align: right;
}

.rtl table tr td:nth-child(2) {
  text-align: left;
}

.util-box {
  background-color: white;
  padding: 0px;
  padding-left: 30px;
  padding-right: 10px;
}

iframe {
  /* display:block;overflow:none;    padding: 0px;
            margin: 0px;
            border-width: 0px; */
  width: "100%";
  height: "100%";
}

.iframe_container {
  width: 100%;
  height: 100%;
  display: block;
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s, opacity 0.5s linear;
}

.show_frame {
  visibility: visible;
  opacity: 1;
}

.canvas {
  display: block;
  padding: 0px;
  border-width: 0px;
  border-left-width: 1px;
}

.center-page {
  height: 100% !important;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow-y: scroll;
  padding-top: 30px;
  padding-bottom: 30px;
}
</style>