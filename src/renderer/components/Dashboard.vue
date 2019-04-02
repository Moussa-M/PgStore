<template>
  <div>
    <div class="main-panel" :style="{'float':$i18n.locale=='ar' ? 'left':'right'}">
      <nav class="navbar navbar-default">
        <div class="nav-container">
          <div class="navbar-header" style="display: inline-flex;">
            <button type="button" class="navbar-toggle">
              <span class="sr-only">{{ $t('toggle_nav') }}</span>
              <span class="icon-bar bar1"></span>
              <span class="icon-bar bar2"></span>
              <span class="icon-bar bar3"></span>
            </button>
            <a class="navbar-brand" href="#">{{ $t('dashboard') }}</a>
          </div>
        </div>
      </nav>
      <div class="content">
        <div class="">
          <div class="row">
            <div class="col-lg-3 col-sm-6">
              <div class="card" style="height:140px">
                <div class="content">
                  <div class="row">
                    <div class="col-xs-3">
                      <div class="icon-big icon-success text-xs-center">
                        <i class="ti-wallet"></i>
                      </div>
                    </div>
                    <div class="col-xs-9">
                      <div class="numbers" style="font-size:1.4vw">
                        <p>{{$t("revenue")}}</p>
                        {{currency}} {{revenue}}
                      </div>
                    </div>
                  </div>
                  <div class="footer">
                    <hr>
                    <div class="stats">
                      <i class="ti-calendar"></i>
                      <select
                        @change="updateRevenue()"
                        v-model="preferences.revenue_span"
                        class="custom-select mr-sm-2 form-control"
                        style="display: inline;padding: 2px;width: inherit;"
                      >
                        <option value="today">{{ $t("today") }}</option>
                        <option value="month">{{ $t("this_month") }}</option>
                        <option value="year">{{ $t("this_year") }}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-3 col-sm-6">
              <div class="card" style="height:140px">
                <div class="content">
                  <div class="row">
                    <div class="col-xs-3">
                      <div class="icon-big icon-info text-xs-center">
                        <i class="ti-shopping-cart-full"></i>
                      </div>
                    </div>
                    <div class="col-xs-9">
                      <div class="numbers">
                        <p>{{$t("sales")}}</p>
                        {{sales}}
                      </div>
                    </div>
                  </div>
                  <div class="footer">
                    <hr>
                    <div class="stats">
                      <i class="ti-calendar"></i>
                      <select
                        @change="updateSales()"
                        v-model="preferences.sales_span"
                        class="custom-select mr-sm-2 form-control"
                        style="display: inline;padding: 2px;width: inherit;"
                      >
                            <option value="today">{{ $t("today") }}</option>
                        <option value="month">{{ $t("this_month") }}</option>
                        <option value="year">{{ $t("this_year") }}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="monthCustomer != null" class="col-lg-3 col-sm-6">
              <div class="card" style="height:140px">
                <div class="content">
                  <div class="row">
                    <div class="col-xs-3">
                      <div class="icon-big icon-info text-xs-center">
                        <i>
                          <Avatar
                            :image="monthCustomer.image"
                            :fullname="monthCustomer.name"
                            :width="50"
                            :height="50"
                            :radius="50"
                            :crop="true"
                            :changeable="false"
                          />
                        </i>
                      </div>
                    </div>
                    <div class="col-xs-9">
                      <div class="numbers">
                        <p>{{$t("customer_of_the_month")}}</p>
                        {{monthCustomer.name}}
                      </div>
                    </div>
                  </div>
                  <div class="footer">
                    <hr>
                    <div class="stats">
                      <p>{{$t("sales_count")}} {{monthCustomer.count}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="monthProduct!=null" class="col-lg-3 col-sm-6">
              <div class="card" style="height:140px">
                <div class="content">
                  <div class="row">
                    <div class="col-xs-3">
                      <div class="icon-big icon-info text-xs-center">
                        <i>
                          <Avatar
                            :image="monthProduct.image"
                            :fullname="monthProduct.name"
                            :width="50"
                            :height="50"
                            :radius="7"
                            :crop="true"
                            :changeable="false"
                          />
                        </i>
                      </div>
                    </div>
                    <div class="col-xs-9">
                      <div class="numbers">
                        <p>{{$t("product_of_the_month")}}</p>
                        {{monthProduct.name}}
                      </div>
                    </div>
                  </div>
                  <div class="footer">
                    <hr>
                    <div class="stats">
                      <p>{{$t("amount")}} {{monthProduct.amount}} {{$t(monthProduct.unit.toLowerCase())}} / {{$t("orders")}} {{monthProduct.count}} </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="card">
                <div class="header">
                  <h4 class="title">{{$t("sales_chart")}}</h4>
                  <p class="category">
                    {{$t("sales_of")}}
                    <select
                      @change="updateSalesChart()"
                      class="custom-select mr-sm-2 form-control"
                      v-model="preferences.sales_chart_span"
                      style="display: inline;padding: 2px;width: inherit;"
                    >
                       <option value="month">{{ $t("this_month") }}</option>
                        <option value="year">{{ $t("this_year") }}</option>
                    </select>
                  </p>
                </div>
                <div class="content">
                  <div id="salesChart"></div>
                  <!-- <div style="width:100%;height:300px!important">
                      <canvas id="linechart"></canvas>
                  </div>-->
                  <div class="footer">
                    <!--  <div class="chart-legend">
                                            <i class="fa fa-circle text-info"></i> Tesla Model S
                                            <i class="fa fa-circle text-warning"></i> BMW 5 Series
                    </div>-->
                    <hr>
                    <div class="stats">
                      <i class="ti-calendar"></i>
                      <span
                        v-show="preferences.sales_chart_span=='month'"
                      >{{current_month+1}}/{{current_year}}</span>
                      <span v-show="preferences.sales_chart_span=='year'">{{current_year}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row" style="margin-bottom:20px">
            <div class="col-md-6" style="max-height:600px;height:600px">
              <div class="card">
                <div class="header">
                  <h4 class="title">{{$t("revenue_source_chart")}}</h4>
                  <p class="category">{{$t("top_5_product")}}</p>
                </div>
                <div class="content">
                  <div id="chartPreferences" class="ct-chart ct-perfect-fourth"></div>

                  <div class="footer">
                    <div class="row chart-legend" style="display: flex;
    justify-content: space-evenly;width:100%">
                      <div
                        
                        v-for="(revenue,index) in pieArray"
                        :ref="revenue.name"
                        :key="revenue.name"
                      >
                        <font-awesome-icon icon="circle" :class="'stroke-'+index"/>
                        <span style="margin-right:10px">{{revenue.name}}</span>
                      </div>
                    </div>
                    <hr>
                    <div class="stats">
                      <i class="ti-timer"></i> {{$t("this_month")}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6" style="max-height:600px;height:600px;">
              <div class="card">
                <div class="header">
                  <h4 class="title">{{$t("revenue_list")}}</h4>
                </div>
                <div class="content">
                  <div class="table-responsive table-full-width" style="height:100%">
                    <table class="table table-hover">
                      <thead>
                        <th style="width:40%" :class="$i18n.locale=='ar'?'text-right':'text-left'">{{ $t("name") }}</th>
                        <th style="width:30%" :class="$i18n.locale=='ar'?'text-right':'text-left'">{{$t("revenue")}} ({{currency}})</th>
                        <th style="width:30%" :class="$i18n.locale=='ar'?'text-right':'text-left'" >{{$t("revenue")}} (%)<i
                            style="padding-left:10px;transition: all 0.3s ease-out;display:inline-block"
                            ref="pie_table_reorder"
                            @click="ReOrderRevenueTable()"
                            class="ti-exchange-vertical"
                          ></i>
                        </th>
                      </thead>
                      <tbody
                        name="fade"
                        is="transition-group"
                        style="display:block;height:431px;overflow:auto;"
                      >
                        <tr v-for="revenue in revenue_pie" :key="revenue.name" :ref="revenue.name">
                          <td :class="$i18n.locale=='ar'?'text-right':'text-left'" style="width:40%">{{revenue.name}}</td>
                          <td :class="$i18n.locale=='ar'?'text-right':'text-left'" style="width:30%">{{revenue.revenue.toFixed(2)}}</td>
                          <td :class="$i18n.locale=='ar'?'text-right':'text-left'" style="width:30%">{{revenue.revenue_perc}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <hr style="margin-top:5px;margin-bottom:5px;">
                  <div class="footer">
                    <div class="stats">
                      <i class="ti-timer"></i> {{$t("this_month")}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- modal start -->
    <div
      class="modal fade"
      id="myModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="myModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h3 class="modal-title" id="myModalLabel">Custom filter</h3>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-xs-6">
                <h4>Filter by date</h4>
                <date-picker
                  @confirm="filterOrders(true)"
                  v-model="daterange"
                  input-class="mx-input"
                  :confirm="true"
                  :not-after="new Date()"
                  :shortcuts="shortcuts"
                  :lang="lang"
                  range
                ></date-picker>
              </div>
              <div class="col-xs-6">
                <h4>Filter by customer</h4>
                <input
                  type="text"
                  v-model="searchText"
                  class="mx-input"
                  name="search"
                  placeholder="Filter by customer name or description..."
                >
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-default">Filter</button>
          </div>
        </div>
      </div>
    </div>
    <!-- modal end -->
  </div>
</template>
<script>
import Chartist from 'chartist'
import { Product } from './models.js'
import { daysInMonth, formatIsoDate, randomColor } from './utils.js'
import DatePicker from 'vue2-datepicker'
import Avatar from './sub_components/Avatar.vue'

export default {
  name: 'Home',
  components: {
    DatePicker,
    Avatar
  },
  created () {
    /// /console.log("dashboard created");
    this.orders = store.getters.orders
    this.products = store.getters.orders
    this.preferences = store.getters.preferences
    this.preferences.sales_chart_span = this.preferences['sales_chart_span']
    this.preferences.sales_span = this.preferences['sales_span']
    this.preferences.revenue_span = this.preferences['revenue_span']

    this.current_year = new Date().getFullYear()
    this.current_month = new Date().getMonth()
    this.current_day = new Date().getDate()

    this.initCustomerOfMonth()
    this.initProductOfMonth()
    this.currency = store.getters.user.currency
  },
  activated () {
    this.orders = store.getters.orders
    this.current_year = new Date().getFullYear()
    this.current_month = new Date().getMonth()
    this.current_day = new Date().getDate()
    this.initCharts()
    this.initReveneu()
    this.initSales()

    this.initCustomerOfMonth()
    this.initProductOfMonth()
  },
  mounted () {
    this.orders = store.getters.orders
    this.initCharts()
    this.initReveneu()
    this.initSales()
  },
  data: function () {
    return {
      word: null,
      orders: [],
      labels: [],
      series: [],
      products: [],
      daterange: '',
      searchText: '',
      monthProduct: null,
      monthCustomer: null,
      lang: {
        days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        months: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec'
        ],
        pickers: [
          'next 7 days',
          'next 30 days',
          'previous 7 days',
          'previous 30 days'
        ],
        placeholder: {
          date: 'Select range',
          dateRange: 'Filter by range'
        }
      },
      shortcuts: [
        {
          text: 'Today',
          onClick: () => {
            let sdate = new Date()
            sdate.setHours(0)
            sdate.setMinutes(0)
            sdate.setSeconds(0)
            sdate.setMilliseconds(0)
            let edate = new Date()
            edate.setHours(23)
            edate.setMinutes(59)
            edate.setSeconds(59)
            edate.setMilliseconds(99)
            this.daterange = [sdate, edate]
          }
        },
        {
          text: 'This month',
          onClick: () => {
            this.daterange = [getStartMonthDate(new Date()), new Date()]
          }
        },
        {
          text: 'This year',
          onClick: () => {
            this.daterange = [getStartYearDate(new Date()), new Date()]
          }
        }
      ],
      showChart: false,
      preferences: {
        sales_chart_span: '',
        revenue_span: '',
        sales_span: ''
      },
      current_year: '',
      current_month: '',
      current_day: '',
      revenue: 0,
      sales: 0,
      chart: null,
      ctx: null,
      revenue_pie: [],
      pieArray: [],
      currency: ''
    }
  },
  methods: {
    initCustomerOfMonth () {
      let month_orders = _.filter(this.orders, o => {
        return (
          new Date(o.date).getFullYear() == this.current_year &&
          new Date(o.date).getMonth() == this.current_month
        )
      })

      let customers = JSON.parse(JSON.stringify(store.getters.customers))
      _.forEach(customers, c => {
        c['count'] = 0
      })
      _.forEach(month_orders, o => {
        _.map(customers, c => {
          if (c.id == o.customer.id) {
            c['count'] = c['count'] + 1
          }
        })
      })

      this.monthCustomer = _.orderBy(customers, ['count'], ['desc'])[0]
      // console.log(this.monthCustomer);
      if (parseInt(this.monthCustomer.id) == 1) {
        if (
          (this.monthCustomer = _.orderBy(customers, ['count'], ['desc'])[1])
        ) {
          this.monthCustomer = _.orderBy(customers, ['count'], ['desc'])[1]
        } else {
          this.monthCustomer = null
        }
      }
    },

    initProductOfMonth () {
      let month_orders = _.filter(this.orders, o => {
        return (
          new Date(o.date).getFullYear() == this.current_year &&
          new Date(o.date).getMonth() == this.current_month
        )
      })

      let m_products = []
      _.forEach(month_orders, o => {
        m_products = m_products.concat(o.products)
      })

      let p_count = []
      _.forEach(m_products, p => {
        if (_.find(p_count, { id: p.id })) {
          let index = _.findIndex(p_count, { id: p.id })
          let amount = p.unit == 'piece' ? p.qte : p.weight
          p_count[index].amount = p_count[index].count + amount
          p_count[index].count = p_count[index].count + 1
        } else {
          p_count.push({
            id: p.id,
            name: p.name,
            image: p.image,
            unit: p.unit.toUpperCase(),
            amount: p.unit == 'piece' ? p.qte : p.weight,
            count: 1
          })
        }
      })

      if (p_count.length > 0) {
        let first = _.orderBy(p_count, ['count'], ['desc'])[0]
        this.monthProduct = {}
        this.monthProduct['name'] = first.name
        this.monthProduct['image'] = first.image
        this.monthProduct['amount'] = first.amount
        this.monthProduct['count'] = first.count
        this.monthProduct['unit'] = first.unit
      }
    },
    filterOrders () {},

    toggleFilter () {
      $('#myModal').modal('toggle')
    },
    logout () {
      store.dispatch('is_logged_in', false)
      this.$router.push('login')
    },
    updateSalesChart () {
      store.dispatch('preferences', this.preferences)
      this.initCharts()
    },
    updateSales () {
      store.dispatch('preferences', this.preferences)
      this.initSales()
    },
    updateRevenue () {
      store.dispatch('preferences', this.preferences)
      this.initReveneu()
    },
    initReveneu () {
      if (this.preferences.revenue_span == 'month') {
        var temp_orders = _.filter(this.orders, o => {
          return (
            new Date(o.date).getFullYear() == this.current_year &&
            new Date(o.date).getMonth() == this.current_month
          )
        })

        _.forEach(temp_orders, order => {
          this.revenue = this.revenue + (order.total_net - order.buy_total)
        })
        this.revenue = parseFloat(this.revenue).toFixed(2)
      } else if (this.preferences.revenue_span == 'year') {
        var temp_orders = _.filter(this.orders, o => {
          return new Date(o.date).getFullYear() == this.current_year
        })
        _.forEach(temp_orders, order => {
          this.revenue = this.revenue + (order.total_net - order.buy_total)
        })
        this.revenue = parseFloat(this.revenue).toFixed(2)
      } else {
        var temp_orders = _.filter(this.orders, o => {
          return (
            new Date(o.date).getFullYear() == this.current_year &&
            new Date(o.date).getMonth() == this.current_month &&
            new Date(o.date).getDate() == this.current_day
          )
        })
        _.forEach(temp_orders, order => {
          this.revenue = this.revenue + (order.total_net - order.buy_total)
        })
        this.revenue = parseFloat(this.revenue).toFixed(2)
      }
    },

    initSales () {
      /// ///console.log(Date.now())
      if (this.preferences.sales_span == 'month') {
        var temp_orders = _.filter(this.orders, o => {
          return (
            new Date(o.date).getFullYear() == this.current_year &&
            new Date(o.date).getMonth() == this.current_month
          )
        })
        this.sales = temp_orders.length
      } else if (this.preferences.sales_span == 'year') {
        var temp_orders = _.filter(this.orders, o => {
          return new Date(o.date).getFullYear() == this.current_year
        })
        this.sales = temp_orders.length
      } else {
        var temp_orders = _.filter(this.orders, o => {
          return (
            new Date(o.date).getFullYear() == this.current_year &&
            new Date(o.date).getMonth() == this.current_month &&
            new Date(o.date).getDate() == this.current_day
          )
        })
        this.sales = temp_orders.length
      }
      /// ///console.log(Date.now())
    },

    ReOrderRevenueTable () {
      this.revenue_pie = this.revenue_pie.reverse()

      $(this.$refs['pie_table_reorder']).toggleClass('rotate180')
    },

    initCharts () {
      // init line chart

      if (this.preferences.sales_chart_span == 'month') {
        var days_num = daysInMonth(this.current_year, this.current_month)

        this.labels = Array.apply(null, { length: this.current_day })
          .map(Number.call, Number)
          .map(x => moment().format('MMM') + ' ' + (x + 1))

        let this_month_orders = _.filter(this.orders, o => {
          return (
            new Date(o.date).getFullYear() == this.current_year &&
            new Date(o.date).getMonth() == this.current_month
          )
        })
        this.series = Array.apply(null, { length: this.current_day }).fill(0)
        _.forEach(this_month_orders, o => {
          var day = new Date(o.date).getDate() - 1
          this.series[day] = this.series[day] + 1
        })

        if (this.series.length > 0) {
          this.showChart = true
        }
        /// /console.log(this.series);
      } else {
        this.labels = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'Mai',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec'
        ]

        var this_year_orders = _.filter(this.orders, o => {
          return new Date(o.date).getFullYear() == this.current_year
        })

        this.series = Array.apply(null, { length: 12 }).fill(0)
        _.forEach(this_year_orders, o => {
          var month = new Date(o.date).getMonth()

          this.series[month] = this.series[month] + 1
        })

        if (this.series.length > 0) {
          this.showChart = true
        }
      }

      // test
      this.showChart = true

      var data = {
        labels: this.labels,
        series: [this.series]
      }

      var data = {
        labels: this.labels,
        series: [this.series]
      }

      var options = {
        seriesBarDistance: 5,
        onlyInteger: true,
        low: 0,
        // showArea: true,
        showPoint: false,
        fullWidth: true,
        axisX: {
          onlyInteger: true
        },

        axisY: {
          onlyInteger: true
        },
        /*     axisX: {
                         showGrid: true
                     },
                      axisY: {
                         showGrid: false
                     }, */
        height: '300px'

        // lineSmooth: Chartist.Interpolation.cardinal({
        //   tension: 0.5
        //  })
      }

      var responsiveOptions = [
        /* ['screen and (max-width: 640px)', {
                   seriesBarDistance: 5,
                   axisX: {
                     labelInterpolationFnc: function (value) {
                       return value[0];
                     }
                   }
                 }] */
      ]

      let chart = new Chartist.Line(
        '#salesChart',
        data,
        options,
        responsiveOptions
      )

      let month_orders = _.filter(this.orders, o => {
        return (
          new Date(o.date).getFullYear() == this.current_year &&
          new Date(o.date).getMonth() == this.current_month
        )
      })

      // month products
      let m_products = []

      _.forEach(month_orders, o => {
        let prs = _.map(o.products, p => {
          p['customer_discount'] = o.customer.discount
          return p
        })
        m_products = m_products.concat(prs)
      })

      // month revenue

      let p_revenue = []

      _.forEach(m_products, p => {
        if (_.find(p_revenue, { id: p.id })) {
          let index = _.findIndex(p_revenue, { id: p.id })
          let amount = p.unit == 'piece' ? p.qte : p.weight

          let revenue = amount * (p.sell_price - p.buy_price)
          revenue = revenue - (p.discount / 100) * (amount * p.sell_price) // substracting product discount
          revenue = revenue - (p.customer_discount / 100) * revenue // substracting >{{$t("customer_discount")}}
          p_revenue[index].revenue = p_revenue[index].revenue + revenue
          /// /console.log(p.name + " " + p_revenue[index].revenue);
        } else {
          let amount = p.unit == 'piece' ? p.qte : p.weight
          let revenue = amount * (p.sell_price - p.buy_price)
          revenue = revenue - (p.discount / 100) * (amount * p.sell_price) // substracting product discount
          revenue = revenue - (p.customer_discount / 100) * revenue // substracting >{{$t("customer_discount")}}
          let pr = store.getters.getProduct(p.id)
          let name
          if (!pr) {
            name = p.name
          } else {
            name = pr.name
          }
          p_revenue.push({
            id: p.id,
            color: randomColor(),
            name: name,
            unit: p.unit.toUpperCase(),
            revenue: revenue
          })
        }
      })
      p_revenue = p_revenue.map(x => {
        x.revenue = Math.round(x.revenue)
        return x
      })

      let total_month_revenue = 0
      total_month_revenue = _.sumBy(p_revenue, 'revenue')

      this.revenue_pie = _.orderBy(p_revenue, ['revenue'], ['desc'])

      _.forEach(this.revenue_pie, p => {
        p.revenue_perc = ((p.revenue * 100) / total_month_revenue).toFixed(2)
      })

      let top5Products = this.revenue_pie.slice(0, 5)

      let otherProducts = this.revenue_pie.slice(5)
      let other_product_revenue = 0
      other_product_revenue = _.sumBy(otherProducts, 'revenue')

      let pielabels = []
      let pieseries = []

      pielabels = []
      pieseries = []

      let cpt = 0
      _.forEach(top5Products, p => {
        // console.log(parseFloat(p.revenue_perc));
        if (parseInt(p.revenue_perc) >= 1) {
          let perc = Math.round((p.revenue * 100) / total_month_revenue)
          pielabels.push(perc + '%')
          pieseries.push(perc)
          cpt++
        }
      })
      top5Products.length = cpt

      this.pieArray = this.revenue_pie.slice(0, 5)
      this.pieArray = _.filter(this.pieArray, p => {
        return parseInt(p.revenue_perc) >= 1
      })

      if (top5Products.length >= 5 && otherProducts.length > 0) {
        pielabels.push(
          ((other_product_revenue * 100) / total_month_revenue).toFixed(2) + '%'
        )
        pieseries.push(
          Math.round((other_product_revenue * 100) / total_month_revenue)
        )
        this.pieArray.push({
          name: 'Other',
          revenue: other_product_revenue,
          revenue_perc: Math.round(
            (other_product_revenue * 100) / total_month_revenue
          )
        })
      }

      var dataPreferences = {
        labels: pielabels,
        series: pieseries
      }

      var optionsPreferences = {
        total: 100,
        startAngle: 270,
        // showLabel: false,
        labelInterpolationFnc: function (value) {
          return value
        },
        height: '350px'
      }
      var responsiveOptions = [
        // ['screen and (min-width: 640px)', {
        //   chartPadding: 30,
        //   labelOffset: Math.random()*1000,
        //   labelDirection: 'explode',
        //   labelInterpolationFnc: function(value) {
        //     return value;
        //   }
        // }],
        // ['screen and (min-width: 1024px)', {
        //   labelOffset: 150,
        //   chartPadding: 20
        // }
      ]

      let charty = Chartist.Pie(
        '#chartPreferences',
        dataPreferences,
        optionsPreferences,
        responsiveOptions
      )

      let span = 100
      charty.on('draw', (data) => {
        if (data.type === 'label') {
          data.x = data.x + span
          data.group.x = data.group.x + span
          // data.element.y = data.element.y+span;
          // data.group
          //   .elem(
          //     "text",
          //     {
          //       x: data.x+span,
          //       y: data.y + span,
          //       style: ""
          //     },
          //     ""
          //   )
          //   .text(data.value + "Hellow");
          span = span + 100
          // console.log(data);
          // console.log(span);
        }
      })
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main-panel {
  /*   border: 10px solid white;
    border-radius: 25px;*/
  padding: 9px;
}

@keyframes width-pulse {
  0% {
    stroke-width: 6px;
  }

  50% {
    stroke-width: 14px;
  }

  100% {
    stroke-width: 6px;
  }
}

@keyframes dashoffset-seven {
  0% {
    stroke-dashoffset: 7px;
  }

  100% {
    stroke-dashoffset: 0px;
  }
}

@keyframes dasharray-craziness {
  0% {
    stroke-dasharray: 7px 2px;
  }

  80% {
    stroke-dasharray: 7px 100px;
    stroke-width: 10px;
  }

  100% {
    stroke-dasharray: 7px 2px;
  }
}

.ct-chart .ct-series.ct-series-a .ct-line {
  stroke: #b0e0e6;
  stroke-width: 2px;
  stroke-dasharray: 5px 2px;
  animation: dashoffset-seven 200ms infinite linear;
}

.modal-dialog {
  position: absolute;
  top: 50%;
  left: calc(45% - 300px);
  transform: translate(0, -50%) !important;
  -ms-transform: translate(0, -50%) !important;
  -webkit-transform: translate(0, -50%) !important;
  width: 900px;
  height: 600px;
}

.modal-content {
  min-height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.modal-body {
  position: absolute;
  top: 45px;
  bottom: 45px;
  left: 0;
  right: 0;
  overflow-y: auto;
}
.modal-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.search {
  width: 100%;
  height: 30px;
  font-size: 15px;
  font-family: inherit;
  padding-left: 10px;
  margin-top: 7px;
}

.stroke-0 {
  color: #68b3c8;
}
.stroke-1 {
  color: #ffd700;
}
.stroke-2 {
  color: #eb5e28;
}
.stroke-3 {
  color: #7ac29a;
}
.stroke-4 {
  color: #7a9e9f;
}
.stroke-5 {
  color: rgba(104, 179, 200, 0.8);
}
.rotate180 {
  transform: scaleY(-1);
}
.flip-list-move {
  transition: transform 0.1s;
}
thead,
tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}
.ct-chart-pie{
  display: flex !important;
  justify-content: center  !important;
}

th {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 17px;
  font-weight: 500;
}

</style>