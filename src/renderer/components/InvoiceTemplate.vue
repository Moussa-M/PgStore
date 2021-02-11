<template>
  <div :class="lang=='ar'?'rtl':''" id="invoice" class="invoice-box">
    <table cellpadding="0" cellspacing="0">
      <tr class="top">
        <td colspan="4" style="padding:0px">
          <table>
            <tr>
              <td v-if="store.logo" class="title">
                <img :src="'file://'+store.logo" width="200px" height="200px"/>
                <!-- <Avatar
                          :image="store.logo"
                          :width="200"
                          :height="200"
                          :crop="true"
                          :removeable="false"
                          :radius="1"
                        /> -->
              </td>
              <td>{{$t("invoice")}}: #{{order.id.slice(0,8).toUpperCase()}}<br>
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
                {{store.address}}<br v-if="store.phone"><span dir="ltr">{{store.phone}}</span>
              </td>
              <template v-if="customer!=null">
                <td>
                  <span>{{customer.name}}</span>
                  <br><span dir="ltr">{{customer.phone}}</span>
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
        <td :class="lang=='ar'?'text-left':'text-right'">{{$t("total")}} ({{$t(currency.toLowerCase())}})</td>
      </tr>

      <tr v-for="item in items" :key="item.name" class="item">
        <td>{{item.name}}</td>
        <td align="center" class="text-center">{{item.sell_price}}</td>
        <td align="center" class="text-center">{{item.amount}} {{$t(item.unit)}}</td>
        <td
          :class="lang=='ar'?'text-left':'text-right'"
        >{{(item.sell_price*item.amount).toFixed(2)}}</td>
      </tr>

      <tr class="total">
        <td></td>
        <td></td>
        <td colspan="2" :class="lang=='ar'?'text-left':'text-right'">{{$t("total")}}: {{total.toFixed(2)}} {{$t(currency.toLowerCase())}}</td>
      </tr>
      <tr class="total">
        <td></td>
        <td></td>
        <td colspan="2" :class="lang=='ar'?'text-left':'text-right'">{{ $t("discount") }}: {{discount.toFixed(2)}} {{$t(currency.toLowerCase())}}</td>
      </tr>

      <tr class="total">
        <td></td>
        <td></td>
        <td colspan="2" :class="lang=='ar'?'text-left':'text-right'">{{$t("total_net")}}: {{total_net.toFixed(2)}} {{$t(currency.toLowerCase())}}</td>
      </tr>
    </table>
  </div>
</template>
<script>
import Avatar from './sub_components/Avatar.vue'
const { ipcRenderer } = require('electron')
const puppeteer = require('puppeteer')
const webContents = require('electron').remote.getCurrentWebContents()
const app = require('electron').remote.app
const path = require('path')
const fs = require('fs')
const { BrowserWindow } = require('electron').remote
export default {
  name: 'InvoiceTemplate',
  components: {Avatar},
  props: {
    id: [Number, String]
  },
  created () {
    ipcRenderer.on('print', (event, arg) => {
      console.log('Getting print')
      this.args = arg
      console.log(this.args)
      this.initOrder()
    })
  },
  mounted () {
    $('#electron-titlebar').css({ display: 'none' })
    $('body').css({ width: '100%', height: '100%' })
  },
  deactivated () {
    // this.$destroy();
  },
  data: function () {
    return {
      args: {},
      url: '',
      order: {},
      items: {},
      currency: '',
      total: 0,
      total_net: 0,
      discount: 0,
      store: {},
      is_loading: true,
      zoom_rate: 1,
      viewport: null,
      customer: null,
      lang: 'en',
      isLogoSet: false
    }
  },
  methods: {
    print () {
      let tempName =
        _.sampleSize('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6).join('') + '.pdf'
      let file = path.join(app.getPath('temp'), tempName)
      // let tempName = "invoice.pdf";
      webContents.savePage(
        app.getPath('temp') + '/invoice.html',
        'HTMLComplete',
        error => {
          if (!error) console.log('Save page successfully');

          (async () => {
            const browser = await puppeteer.launch({executablePath: puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked')})
            const page = await browser.newPage()
            await page.goto(
              `file:${path.join(app.getPath('temp'), 'invoice.html')}`
            )

            // let margin = parseInt(
            //   this.args.printOptions.margin.replace("px", "")
            // );

            await page.pdf({
              path: file,
              // format: this.args.printOptions.pageType,
              // margin: {
              //   top: margin,
              //   right: margin,
              //   bottom: margin,
              //   left: margin
              // },
              scale: this.args.printOptions.scale / 100,
              printBackground: true,
              width: this.args.printOptions.width,
              height: this.args.printOptions.height,
              landscape: this.args.printOptions.landscape
            })

            await browser.close()
            const { execFile } = require('child_process')

            // let command =
            //   '"' +
            //   path.join(app.getAppPath(), "SumatraPDF.exe").replace('app.asar', 'app.asar.unpacked') +
            //   '"' +` -print-to \"${this.args.printOptions.deviceName}\"  \"${file}\"`;
            //   let command =
            //   '"' +
            //   path.join(app.getAppPath(), "SumatraPDF.exe").replace('app.asar', 'app.asar.unpacked') +
            //   '"' +` -print-to \"${this.args.printOptions.deviceName}\"  \"${file}\"`;
             console.log(path.join(app.getAppPath(), 'SumatraPDF.exe').replace('\\app.asar', ''));
            execFile(path.join(app.getAppPath(), 'SumatraPDF.exe').replace('\\app.asar', ''), [
              '-print-to', this.args.printOptions.deviceName, file], (err, stdout, stderr) => {
              if (err) {
                // node couldn't execute the command
                console.log(err)
              } else {
                console.log('Printed')
                // clear

                fs.unlink(file, err => {
                  if (err) throw err
                })
                fs.unlink(
                  path.join(app.getPath('temp'), 'invoice.html'),
                  err => {
                    if (err) throw err
                  }
                )

                // fs.unlink(path.join(app.getPath("temp"), "invoice_files"), (err) => {
                //   if (err) throw err;

                // });
              }
            })
          })()
        }
      )

      // webContents.print({silent: true,deviceName:this.args.printOptions.deviceName});
    },
    initOrder () {
      if (this.args.order.id != 'start') {
        $('body').css({
          width: this.args.printOptions.width,
          height: this.args.printOptions.height,
          padding: '0px',
          margin: '0px'
        })

        $('.invoice-box').css('padding', this.args.printOptions.margin)
        this.lang = this.args.lang
        this.$i18n.locale = this.lang
        console.log('this.lang')
        console.log(this.lang)
        this.order = this.args.order
        this.currency = this.order.currency
        this.store = {
          name: this.args.user.storename.trim(),
          address: this.args.user.storeaddress.trim(),
          phone: this.args.user.storephone.trim(),
          logo: this.args.user.storelogo
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
          let amount = p.amount
          this.total = this.total + amount * p.sell_price
          this.discount =
            this.discount + (p.discount / 100) * (amount * p.sell_price)
        })
        this.total_net = this.total - this.discount
        this.total_net =
          this.total_net -
          (this.order.customer.discount / 100) * this.total_net

        this.print()
      }
    },

    invoiceDate (d) {
      return this.lang == 'ar' ? moment(d).format('DD MMM YYYY') : moment(d).format('MMM DD YYYY')
    }
  },
  computed: {
    getStyle () {
      console.log('sdsds')
      console.log(this.$route.query)
      console.log(this.$route.query.padding)

      // return {
      //   "width":this.$route.query.width?this.$route.query.width:'794px !important',
      //   "height":this.$route.query.height?this.$route.query.height:'1123px !important',
      //   "padding":this.$route.query.padding?this.$route.query.padding:'20px !important',
      // }

      return {
        width: '100%',
        height: '100%',
        padding: this.$route.query.padding
          ? this.$route.query.padding
          : '20px !important'
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

  width: 100vw;
  height: 100vh;
  /* padding: 0px; */
  margin: 0px;

  font-size: calc(10px + 0.9vw);
  /* line-height: 24px; */
  font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
  color: #555;
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
  background: #bfbfbf;
  border-bottom: 1px solid #0000007a;
  font-weight: bold;
}

.invoice-box table tr.details td {
  padding-bottom: 20px;
}

.invoice-box table tr.item td {
  border-bottom: 1px solid #0000007a;
}

.invoice-box table tr.item.last td {
  border-bottom: none;
}

.invoice-box table tr.total td:nth-child(3) {
  border-bottom: 1px solid #0000007a;
  font-weight: bold;
}

/* @media only screen and (max-width: 600px) {
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
} */

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
</style>