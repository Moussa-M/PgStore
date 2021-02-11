import Vuex from 'vuex'
import Vue from 'vue'
import { createPersistedState, createSharedMutations } from 'vuex-electron'
import { uuid } from 'systeminformation';
import { Activity } from '../components/models';
Vue.use(Vuex)

// const  mysql    = require('mysql');
// const connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : 'Snatch',
//   database : 'mystore'
// });
// connection.connect();

const _db = require('electron-store')

const db = new _db({
  'defaults': {
    'orders': [],
    'products': [],
    'stocks': [],
    'invoices': [],
    'categories': ["beverages", "bakery", "canned_goods", "dairy", "dry_goods", "frozen_foods", "meat", "produce", "cleaners", "paper_goods", "personal_care", "other"],
    'all_actions': [
      'add_order',
      'edit_order',
      'cancel_order',
      'del_order',
      'add_product',
      'edit_product',
      'del_product',
      'add_invoice',
      'edit_invoice',
      'del_invoice',
      'add_stock',
      'edit_stock',
      'del_stock',
      'view_dashboard',
      'view_orders',
      'view_invoices',
      'view_customers',
      'view_employees',
      'change_settings'
    ],
    'activities': [],
    'notifications': [],
    'units': ["g", "kg", "cl", "l", "oz", "piece"],
    'customers': [{ 'id': 1, 'name': 'Anonymous', 'phone': '', 'sex': 'm', 'discount': 0.00, 'date': new Date(), 'email': '', 'image': 'static/assets/img/faces/face-0.jpg', 'is_deleted': false }],
    'user': {
      'lang': 'ar'
    },
    'employees': [],
    'employees_log': [],
    'is_registered': false,
    'is_logged_in': {
      'status': false,
      'employee_id': null
    },
    'is_activated': false,
    'is_trail': false,
    'first_opened': new Date(),
    'last_opened': null,
    'preferences': {
      'points_currency_rate': 100,//every 100points == 1dzd  
      'sales_chart_span': 'month',
      'sales_span': 'month',
      'revenue_span': 'month',
      'stock_table': [
      {'name':'show_n','value':true},
      {'name':'show_empty_qte','value':false},
      {'name':'show_buy_date','value':true},
      {'name':'show_supplier','value':true},
      {'name':'show_expiration_date','value':true},
      {'name':'show_buy_price','value':true},
      {'name':'show_sell_price','value':true},
      {'name':'show_qte','value':true},
      {'name':'show_available_qte','value':true},
      {'name':'stock_date_asc','value':true},
      {'name':'stock_exp_date_asc','value':true},
      {'name':'stock_buy_price_asc','value':true},
      {'name':'stock_sell_price_asc','value':true},
      {'name':'stock_qte_asc','value':true},
      {'name':'stock_available_asc','value':true}]

    }
  },
  'name': 'db',
  'fileExtension': 'db',
  'encryptionKey': 'a1c77e789d8ff952af1c22aa09fe2d1b0ececc239759d2334c85901276ef8a18'
})
db.set('last_opened', new Date())

const Store = new Vuex.Store({
  state: {
    'orders': [],
    'products': [],
    'stocks': [],
    'invoices': [],

    'customers': [],
    'employees': [],
    'categories': [],
    'all_actions': [],
    'activities': [],
    'notifications': [],
    'units': [],
    'user': {
      currency: 'DZD',
      lang: 'en'
    },
    'is_registered': false,
    'is_logged_in': {
      'status': false,
      'employee_id': null
    },
    'is_activated': false,
    'is_trail': false,
    'first_opened': new Date(),
    'last_opened': null,
    'preferences': {
      'sales_chart_span': 'month',
      'sales_span': 'month',
      'revenue_span': 'month',
      'income_span': 'month',
      'expenses_span': 'month',
      'debt_span': 'month',
      'dashboard': {
        'selected_charts':["revenue"]
       },
      'show_n': true,
      'show_empty_qte': false,
      'show_buy_date': true,
      'show_supplier': true,
      'show_expiration_date': true,
      'show_buy_price': true,
      'show_sell_price': true,
      'show_qte': true,
      'show_available_qte': true,

      'stock_date_asc': true,
      'stock_exp_date_asc': true,
      'stock_buy_price_asc': true,
      'stock_sell_price_asc': true,
      'stock_qte_asc': true,
      'stock_available_asc': true,
    },
    'panel_choosed_customer': null
    
  },
  getters: {
    panel_choosed_customer: state => {
      return state.panel_choosed_customer
    },

    orders: state => {
      return _.filter(state.orders, { 'is_deleted': false });
    },
    allOrders: state => {
      return state.orders
    },
    products: state => {
      return _.filter(state.products, { 'is_deleted': false });
    },
    allProducts: state => {
      return state.products
    },
    stocks: state => {
      return _.filter(state.stocks, { 'is_deleted': false });
    },
    allStocks: state => {
      return state.stocks
    },
    invoices: state => {
      return _.filter(state.invoices, { 'is_deleted': false });
    },
    allInvoices: state => {
      return state.invoices;
    },
    categories: state => {
      return state.categories
    },
    all_actions: state => {
      return state.all_actions
    },
    units: state => {
      return state.units
    },
    employees: state => {
      return _.filter(state.employees, { 'is_deleted': false });
    },

    activities: state => {
      return _.filter(state.activities, { 'is_deleted': false });
    },
    notifications: state => {
      
      return _.filter(state.notifications, { 'is_deleted': false });
    },
    getEmployeeActivities: state => (id)=>{
      return _.filter(state.activities, { 'issuer_employee_id': id,'is_deleted': false });
    },
    AllActivities: state => {
      return state.activities
    },

    AllEmployees: state => {
      return state.employees;
    },
    customers: state => {
      return _.filter(state.customers, { 'is_deleted': false });
    },
    allCustomers: state => {
      return state.customers;
    },
    user: state => {
      return state.user
    },
    is_registered: state => {
      return state.is_registered
    },
    is_logged_in: state => {
      return state.is_logged_in
    },
    is_activated: state => {
      return state.is_activated
    },
    is_trail: state => {
      return state.is_trail
    },
    first_opened: state => {
      return state.first_opened
    },
    last_opened: state => {
      return state.last_opened
    },
    preferences: state => {
      return state.preferences
    },
    getOrder: (state) => (id, hard_fetch = false) => {
      if (hard_fetch) return state.orders.find(order => order.id == id)
      return state.orders.find(order => order.id == id && !order.is_deleted)
    },
    getEmployee: (state) => (id, hard_fetch = false) => {
      if (hard_fetch) return state.employees.find(employee => employee.id == id)
      return state.employees.find(employee => employee.id == id && !employee.is_deleted)
    },
    getCustomer: (state) => (id, hard_fetch = false) => {
      if (hard_fetch) return state.customers.find(customer => customer.id == id)
      return state.customers.find(customer => customer.id == id && !customer.is_deleted)
    },
    getCustomerLastOrder: (state) => (id, hard_fetch = false) => {
      if (hard_fetch) state.orders.find(order => order.customer_id == id)
      return state.orders.find(order => order.customer_id == id && !order.is_deleted)
    },
    getCustomerOrders: (state) => (id, hard_fetch = false) => {
      if (hard_fetch) return state.orders.filter(order => order.customer_id == id)
      return state.orders.filter(order => order.customer_id == id && !order.is_deleted)
    },
    getEmployeeOrders: (state) => (id, hard_fetch = false) => {
      if (hard_fetch) return state.orders.filter(order => order.issuer_employee_id == id)
      return state.orders.filter(order => order.issuer_employee_id == id && !order.is_deleted)
    },
    getProduct: (state) => (id, hard_fetch = false) => {
      if (hard_fetch) return state.products.find(product => product.id == id)
      return state.products.find(product => product.id == id && !product.is_deleted)
    },
    getStocks: (state) => (id, filter_empty = false, hard_fetch = false) => {
      if (hard_fetch) state.stocks.filter(stock => stock.product_id == id && stock.available_qte > (filter_empty ? 0 : -1) )
      return state.stocks.filter(stock => stock.product_id == id && stock.available_qte > (filter_empty ? 0 : -1) && !stock.is_deleted )
      // if (hard_fetch) state.stocks.filter(stock => stock.product_id == id && stock.available_qte > (filter_empty ? 0 : -1) && !stock.is_pre_ordered)
      // return state.stocks.filter(stock => stock.product_id == id && stock.available_qte > (filter_empty ? 0 : -1) && !stock.is_deleted && !stock.is_pre_ordered)
    },
    getPreOrderedStocks: (state) => () => {
      return state.stocks.filter(stock => stock.is_pre_ordered)
    },
    getProductPreOrderedStock: (state) => (id) => {
      return state.stocks.find(stock => stock.product_id == id && stock.is_pre_ordered)
    },
    getInvoiceStocks: (state) => (id, filter_empty = false, hard_fetch = false) => {
      if (hard_fetch) state.stocks.filter(stock => stock.invoice_id == id && stock.available_qte > (filter_empty ? 0 : -1))
      return state.stocks.filter(stock => stock.invoice_id == id && stock.available_qte > (filter_empty ? 0 : -1) && !stock.is_deleted)
    },
    getStock: (state) => (id, hard_fetch = false) => {
      if (hard_fetch) return state.stocks.find(stock => stock.id == id)
      return state.stocks.find(stock => stock.id == id && !stock.is_deleted)
    },
    getInvoice: (state) => (id, hard_fetch = false) => {
      if (hard_fetch) state.invoices.find(invoice => invoice.id == id)
      return state.invoices.find(invoice => invoice.id == id && !invoice.is_deleted)
    }
  },

  mutations: {
    panel_choosed_customer(state, customer) {
      console.log("jdksldjlsqkdjsqlkdjsqlkdjsqlkdjsqkldjsqlkdjqskl")
      state.panel_choosed_customer = customer
    },
    orders(state, orders) {
      state.orders = orders
    },
    customers(state, customers) {
      state.customers = customers
    },
    products(state, products) {
      state.products = products
    },
    stocks(state, stocks) {
      state.stocks = stocks
    },
    invoices(state, invoices) {
      state.invoices = invoices
    },
    categories(state, categories) {
      state.categories = categories
    },
    units(state, units) {
      state.units = units
    },
    user(state, user) {
      state.user = user
    },
    is_registered(state, is_registered) {
      state.is_registered = is_registered
    },
    is_logged_in(state, is_logged_in) {
      state.is_logged_in = is_logged_in
    },
    is_activated(state, is_activated) {
      state.is_activated = is_activated
    },
    is_trail(state, is_trail) {
      state.is_trail = is_trail
    },
    first_opend(state, first_opend) {
      state.first_opend = first_opend
    },
    last_opened(state, last_opened) {
      state.last_opened = last_opened
    },
    preferences(state, preferences) {
      state.preferences = preferences
    }

  },
  actions: {
    addOrder({ state }, order) {
      state.orders.unshift(order)
      db.set('orders', state.orders)
      new Activity("add_order",order.id).save();
    },
    deleteOrder({ state }, id) {
      let index = _.findIndex(state.orders, { 'id': id })
      let order = state.orders[index];
      order.is_deleted = true;
      state.orders.splice(index, 1, order)
      db.set('orders', state.orders)
      new Activity("del_order",id).save();
    },
    addCategory({ state }, category) {
      state.categories.push(category)
      db.set('categories', state.categories)
    
    },
    removeCategory({ state }, category) {
      _.remove(state.categories, (c) => { c == category })
      db.set('categories', state.categories)

    },
    addUnit({ state }, unit) {
      state.units.push(unit)
      db.set('unit', state.units)
    },
    removeUnit({ state }, unit) {
      _.remove(state.units, (c) => { c == unit })
      db.set('units', state.units)
    },
    updateOrder({ state }, order) {
      let index = _.findIndex(state.orders, { 'id': order.id })
      state.orders.splice(index, 1, order)
      db.set('orders', state.orders)
      new Activity("edit_order",order.id).save();
    },

    addCustomer({ state }, customer) {
      state.customers.push(customer)
      db.set('customers', state.customers)
      new Activity("add_customer",customer.id).save();
    },
    deleteCustomer({ state }, id) {
      let index = _.findIndex(state.customers, { 'id': id })
      let customer = state.customers[index];
      customer.is_deleted = true;
      state.customers.splice(index, 1, customer)
      db.set('customers', state.customers)
      new Activity("del_customer",id).save();
    },
    updateCustomer({ state }, customer) {
      let index = _.findIndex(state.customers, { 'id': customer.id })

      state.customers.splice(index, 1, customer)
      db.set('customers', state.customers)
      new Activity("edit_customer",customer.id).save();
    },
    hideNotification({ state }, id) {
      let index = _.findIndex(state.notifications, { 'id': id })
      let notification = state.notifications[index];
      notification.status = "seen";
      state.notifications.splice(index, 1, notification)
      db.set('notifications', state.notifications)
    },
    addActivity({ state }, activity) {
      state.activities.push(activity)
      db.set('activities', state.activities)
    },
    deleteActivity({ state }, id) {
      let index = _.findIndex(state.activities, { 'id': id })
      let activity = state.activities[index];
      activity.is_deleted = true;
      state.activities.splice(index, 1, activity)
      db.set('activities', state.activities)
    },

    addEmployee({ state }, employee) {
      state.employees.push(employee)
      db.set('employees', state.employees)
      new Activity("add_employee",employee.id).save();
    },
    deleteEmployee({ state }, id) {
      let index = _.findIndex(state.employees, { 'id': id })
      let employee = state.employees[index];
      employee.is_deleted = true;
      state.employees.splice(index, 1, employee)
      db.set('employees', state.employees)
      new Activity("del_employee",id).save();
    },
    updateEmployee({ state }, employee) {
      let index = _.findIndex(state.employees, { 'id': employee.id })

      state.employees.splice(index, 1, employee)
      db.set('employees', state.employees)
      new Activity("edit_employee",employee.id).save();
    },
    addEmployeeLog({ state }, employee_log) {
      state.employees_log.push(employee_log)
      db.set('employees_log', state.employees_log)
    },
    deleteEmployeeLog({ state }, id) {
      let index = _.findIndex(state.employees_log, { 'id': id })
      let employee_log = state.employees_log[index];
      employee_log.is_deleted = true;
      state.employees_log.splice(index, 1, employee_log)
      db.set('employees_log', state.employees_log)
    },
    addProduct({ state }, product) {
      state.products.push(product)
      db.set('products', state.products)
      new Activity("add_product",product.id).save();
    },
    deleteProduct({ state }, id) {
      let index = _.findIndex(state.products, { 'id': id })
      let product = state.products[index];
      product.is_deleted = true;
      state.products.splice(index, 1, product)
      db.set('products', state.products)
      new Activity("del_product",id).save();
    },
    updateProduct({ state }, product) {
      let index = _.findIndex(state.products, { 'id': product.id })
      state.products.splice(index, 1, product)
      db.set('products', state.products)
      new Activity("edit_product",product.id).save();
    },
    addInvoice({ state }, invoice) {
      state.invoices.unshift(invoice)
      db.set('invoices', state.invoices)
      new Activity("add_invoice",invoice.id).save();
    },
    deleteInvoice({ state }, id) {
      let index = _.findIndex(state.invoices, { 'id': id })
      let invoice = state.invoices[index];
      invoice.is_deleted = true;
      state.invoices.splice(index, 1, invoice)
      db.set('invoices', state.invoices)
      new Activity("del_invoice",id).save();
    },
    updateInvoice({ state }, invoice) {
      let index = _.findIndex(state.invoices, { 'id': invoice.id })
      state.invoices.splice(index, 1, invoice)
      db.set('invoices', state.invoices)
      new Activity("edit_invoice",invoice.id).save();
    },
    addStock({ state }, stock) {
      state.stocks.push(stock)
      db.set('stocks', state.stocks)
      new Activity("add_stock",stock.id).save();
    },
    deleteStock({ state }, id) {
      let index = _.findIndex(state.stocks, { 'id': id })
      let stock = state.stocks[index];
      stock.is_deleted = true;
      state.stocks.splice(index, 1, stock)
      // _.remove(state.stocks,{id:id});
      db.set('stocks', state.stocks)
      new Activity("del_stock",id).save();
    },
    forceUpdateStock({ state }, stock) {
      let index = _.findIndex(state.stocks, { 'id': stock.id })
      if (index != -1) {
        state.stocks.splice(index, 1, stock)
      } else {
        if (stock.available_qte > 0) {
          state.stocks.unshift(stock)
        }
      }

      db.set('stocks', state.stocks)
      new Activity("edit_stock",stock.id).save();
    },
    updateOrAddStock({ state }, stock) {
      let index = _.findIndex(state.stocks, { 'id': stock.id })
      if (index != -1) {
        state.stocks.splice(index, 1, stock)
      } else {
        state.stocks.push(stock)
      }

      db.set('stocks', state.stocks)
      new Activity("edit_stock",stock.id).save();
    },
    updateStock({ state }, stock) {
      let index = _.findIndex(state.stocks, { 'id': stock.id })
      state.stocks.splice(index, 1, stock)
      db.set('stocks', state.stocks)
      new Activity("edit_stock",stock.id).save();
    },
    products({ state, commit }, products) {
      state.products = products
      db.set('products', products)
    },
    invoices({ state, commit }, invoices) {
      state.invoices = invoices
      db.set('invoices', invoices)
    },
    stocks({ state, commit }, stocks) {
      state.stocks = stocks
      db.set('stocks', stocks)
    },
    categories({ state, commit }, categories) {
      state.categories = categories
      db.set('categories', categories)
    },
    units({ state, commit }, units) {
      state.units = units
      db.set('units', units)
    },
    orders({ state, commit }, orders) {
      state.orders = orders
      db.set('orders', orders)
    },
    all_actions({ state, commit }, all_actions) {
      state.all_actions = all_actions
      db.set('all_actions', all_actions)
    },
    customers({ state, commit }, customers) {
      state.customers = customers
      db.set('customers', customers)
    },
    employees({ state, commit }, employees) {
      state.employees = employees
      db.set('employees', employees)
    },
    activities({ state, commit }, activities) {
      state.activities = activities
      db.set('activities', activities)
    },
    notifications({ state, commit }, notifications) {
      state.notifications = notifications
      db.set('notifications', notifications)
    },
    employees_log({ state, commit }, employees_log) {
      state.employees_log = employees_log
      db.set('employees_log', employees_log)
    },
    user({ state, commit }, user) {
      state.user = user
      db.set('user', user)
    },
    is_registered({ state, commit }, is_registered) {
      state.is_registered = is_registered
      db.set('is_registered', is_registered)
    },
    is_logged_in({ state, commit }, is_logged_in) {
      state.is_logged_in = is_logged_in
      db.set('is_logged_in', is_logged_in)
    },
    is_activated({ state, commit }, is_activated) {
      state.is_activated = is_activated
      db.set('is_activated', is_activated)
    },
    is_trail({ state, commit }, is_trail) {
      state.is_trail = is_trail
      db.set('is_trail', is_trail)
    },
    first_opened({ state, commit }, first_opened) {
      state.first_opened = first_opened
      db.set('first_opened', first_opened)
    },
    last_opened({ state, commit }, last_opened) {
      state.last_opened = last_opened
      db.set('last_opened', last_opened)
    },
    preferences({ state, commit }, preferences) {
      state.preferences = preferences
      db.set('preferences', preferences)
    },
    changeLang({ state, commit }, lang) {
      state.user.lang = lang
      db.set('user', state.user)
    },
    register({ state }, user) {
      state.user = user
      db.set('user', state.user)
    },
    activate({ state }, credintals) {
      return window.axios.post('http://paradox007.pythonanywhere.com/api/activate-product/', credintals)
    }

  }
  // plugins: [
  //   createPersistedState(),
  //   createSharedMutations()
  // ],
  // strict: process.env.NODE_ENV !== 'production'
})
// init state

Store.dispatch('orders', db.get('orders'))
Store.dispatch('customers', db.get('customers'))
Store.dispatch('employees', db.get('employees'))
Store.dispatch('employees_log', db.get('employees_log'))
Store.dispatch('products', db.get('products'))
Store.dispatch('stocks', db.get('stocks'))
Store.dispatch('invoices', db.get('invoices'))
Store.dispatch('categories', db.get('categories'))
Store.dispatch('units', db.get('units'))
Store.dispatch('user', db.get('user'))
Store.dispatch('is_registered', db.get('is_registered'))
Store.dispatch('is_logged_in', db.get('is_logged_in'))
Store.dispatch('is_activated', db.get('is_activated'))
Store.dispatch('is_trail', db.get('is_trail'))
Store.dispatch('first_opened', db.get('first_opened'))
Store.dispatch('last_opened', db.get('last_opened'))
Store.dispatch('preferences', db.get('preferences'))
Store.dispatch('all_actions', db.get('all_actions'))
Store.dispatch('activities', db.get('activities'))
Store.dispatch('notifications', db.get('notifications'))



export default Store
