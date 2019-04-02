import Vuex from 'vuex'
import Vue from 'vue'
import { createPersistedState, createSharedMutations } from 'vuex-electron'
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
    'customers': [{'id': '1', 'name': 'Anounymous', 'phone': '+000', 'sex': 'm', 'discount': 0, 'date': new Date(), 'email': '', 'image': 'static/assets/img/faces/face-0.jpg'}],
    'user': {
      'lang': 'ar'
    },
    'is_registered': false,
    'is_logged_in': false,
    'is_activated': false,
    'is_trail': false,
    'first_opened': new Date(),
    'last_opened': null,
    'preferences': {
      'sales_chart_span': 'month',
      'sales_span': 'month',
      'revenue_span': 'month'
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
    'customers': [],
    'user': {
      currency: 'DZD',
      lang: 'en'
    },
    'is_registered': false,
    'is_logged_in': false,
    'is_activated': false,
    'is_trail': false,
    'first_opened': new Date(),
    'last_opened': null,
    'preferences': {
      'sales_chart_span': 'month',
      'sales_span': 'month',
      'revenue_span': 'month'
    }
  },
  getters: {
    orders: state => {
      return state.orders
    },
    products: state => {
      return state.products
    },
    customers: state => {
      return state.customers
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
    getOrder: (state) => (id) => {
      return state.orders.find(order => order.id === id)
    },
    getCustomer: (state) => (id) => {
      return state.customers.find(customer => customer.id === id)
    },
    getCustomerLastOrder: (state) => (id) => {
      return state.orders.find(order => order.customer.id === id)
    },
    getProduct: (state) => (id) => {
      return state.products.find(product => product.id === id)
    }
  },

  mutations: {
    orders (state, orders) {
      state.orders = orders
    },
    customers (state, customers) {
      state.customers = customers
    },
    products (state, products) {
      state.products = products
    },
    user (state, user) {
      state.user = user
    },
    is_registered (state, is_registered) {
      state.is_registered = is_registered
    },
    is_logged_in (state, is_logged_in) {
      state.is_logged_in = is_logged_in
    },
    is_activated (state, is_activated) {
      state.is_activated = is_activated
    },
    is_trail (state, is_trail) {
      state.is_trail = is_trail
    },
    first_opend (state, first_opend) {
      state.first_opend = first_opend
    },
    last_opened (state, last_opened) {
      state.last_opened = last_opened
    },
    preferences (state, preferences) {
      state.preferences = preferences
    }

  },
  actions: {
    addOrder ({ state }, order) {
      state.orders.unshift(order)
      db.set('orders', state.orders)
    },
    deleteOrder ({ state }, id) {
      _.remove(state.orders, function (o) { return o.id == id })
      db.set('orders', state.orders)
    },
    updateOrder ({ state }, order) {
      let index = _.findIndex(state.orders, { 'id': order.id })
      state.orders.splice(index, 1, order)
      db.set('orders', state.orders)
    },
    addCustomer ({ state }, customer) {
      state.customers.push(customer)
      db.set('customers', state.customers)
    },
    deleteCustomer ({ state }, id) {
      _.remove(state.customers, function (o) { return o.id == id })
      db.set('customers', state.customers)
    },
    updateCustomer ({ state }, customer) {
      let index = _.findIndex(state.customers, { 'id': customer.id })

      state.customers.splice(index, 1, customer)
      db.set('customers', state.customers)
    },
    addProduct ({ state }, product) {
      state.products.push(product)
      db.set('products', state.products)
    },
    deleteProduct ({ state }, id) {
      _.remove(state.products, function (o) { return o.id == id })
      db.set('products', state.products)
    },
    updateProduct ({ state }, product) {
      let index = _.findIndex(state.products, { 'id': product.id })
      state.products.splice(index, 1, product)
      db.set('products', state.products)
    },
    products ({ state, commit }, products) {
      state.products = products
      db.set('products', products)
    },
    orders ({ state, commit }, orders) {
      state.orders = orders
      db.set('orders', orders)
    },
    customers ({ state, commit }, customers) {
      state.customers = customers
      db.set('customers', customers)
    },
    user ({ state, commit }, user) {
      state.user = user
      db.set('user', user)
    },
    is_registered ({ state, commit }, is_registered) {
      state.is_registered = is_registered
      db.set('is_registered', is_registered)
    },
    is_logged_in ({ state, commit }, is_logged_in) {
      state.is_logged_in = is_logged_in
      db.set('is_logged_in', is_logged_in)
    },
    is_activated ({ state, commit }, is_activated) {
      state.is_activated = is_activated
      db.set('is_activated', is_activated)
    },
    is_trail ({ state, commit }, is_trail) {
      state.is_trail = is_trail
      db.set('is_trail', is_trail)
    },
    first_opened ({ state, commit }, first_opened) {
      state.first_opened = first_opened
      db.set('first_opened', first_opened)
    },
    last_opened ({ state, commit }, last_opened) {
      state.last_opened = last_opened
      db.set('last_opened', last_opened)
    },
    preferences ({ state, commit }, preferences) {
      state.preferences = preferences
      db.set('preferences', preferences)
    },
    changeLang ({ state, commit }, lang) {
      state.user.lang = lang
      db.set('user', state.user)
    },
    register ({ state }, user) {
      state.user = user
      db.set('user', state.user)
    },
    activate ({ state }, credintals) {
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
Store.dispatch('products', db.get('products'))
Store.dispatch('user', db.get('user'))
Store.dispatch('is_registered', db.get('is_registered'))
Store.dispatch('is_logged_in', db.get('is_logged_in'))
Store.dispatch('is_activated', db.get('is_activated'))
Store.dispatch('is_trail', db.get('is_trail'))
Store.dispatch('first_opened', db.get('first_opened'))
Store.dispatch('last_opened', db.get('last_opened'))
Store.dispatch('preferences', db.get('preferences'))

export default Store
