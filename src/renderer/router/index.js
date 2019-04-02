import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/Home.vue';
import Dashboard from '@/components/Dashboard.vue';
import Preferences from '@/components/Preferences.vue';
import Login from '@/components/Login.vue';
import Register from '@/components/Register.vue';
import Activation from '@/components/Activation.vue';
import Products from '@/components/Products.vue';
import Customers from '@/components/Customers.vue';
import NewCustomer from '@/components/NewCustomer.vue';
import EditCustomer from '@/components/EditCustomer.vue';
import Orders from '@/components/Orders.vue';
import NewOrder from '@/components/NewOrder.vue';
import EditOrder from '@/components/EditOrder.vue';
import OpenInvoice from '@/components/OpenInvoice.vue';
import InvoiceTemplate from '@/components/InvoiceTemplate.vue';
import NewProduct from '@/components/NewProduct.vue';
import EditProduct from '@/components/EditProduct.vue';
import {
  diffInDays
} from '@/components/utils.js';

import store from '../store'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
      path: '/',
      redirect: '/home/dashboard'
    },
    {
      path: '/home',
      redirect: '/home/dashboard'
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [{
          path: 'dashboard',
          name: 'dashboard',
          component: Dashboard
        },
        {

          path: 'orders',
          name: 'orders',
          component: Orders
        },
        {
          path: 'products',
          name: 'products',
          component: Products
        },
        {
          path: 'customers',
          name: 'customers',
          component: Customers
        }

      ]
    },

    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/activation',
      name: 'activation',
      component: Activation
    },
    {
      path: '/preferences',
      name: 'preferences',
      component: Preferences
    },
    {
      path: '/new-order',
      name: 'new_order',
      component: NewOrder
    },
    {
      path: '/edit-order',
      name: 'edit_order',
      component: EditOrder,
      props: true
    },
    {
      path: '/new-product',
      name: 'new_product',
      component: NewProduct
    },
    {
      path: '/edit-product/:id',
      name: 'edit_product',
      component: EditProduct,
      props: true
    },
    {
      path: '/new-customer',
      name: 'new_customer',
      component: NewCustomer
    },
    {
      path: '/edit-customer/:id',
      name: 'edit_customer',
      component: EditCustomer,
      props: true
    },
    {
      path: '/invoice/:id',
      name: 'open_invoice',
      component: OpenInvoice,
      props: true
    },
    {
      path: '/invoice_template/:id',
      name: 'open_invoice_template',
      component: InvoiceTemplate,
      props: true
    }

  ]
})

let is_activated = store.getters.is_activated
let is_trail = store.getters.is_trail
let trail_days_left = 30 - diffInDays(new Date(store.getters.first_opened), new Date())
let is_registered = store.getters.is_registered
let is_logged_in = store.getters.is_logged_in

router.beforeEach((to, from, next) => {
  is_activated = store.getters.is_activated
  is_trail = store.getters.is_trail
  trail_days_left = 30 - diffInDays(new Date(store.getters.first_opened), new Date())
  is_registered = store.getters.is_registered
  is_logged_in = store.getters.is_logged_in
  if (!is_registered) {
    if (to.path != '/register') {
      next('/register')
    } else {
      next()
    }
  } else {
    if (!is_logged_in) {
      if (to.path != '/login') {
        next('/login')
      } else {
        next()
      }
    } else {
      if (!is_activated && trail_days_left <= 0) {
        if (to.path != '/activation') {
          next('/activation')
        } else {
          next()
        }
      } else {
        if (!is_activated && !is_trail && to.path != '/activation') {
          next('/activation')
        } else {
          next()
        }
      }
    }
  }
})

export default router