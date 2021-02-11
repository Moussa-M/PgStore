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
import Employees from '@/components/Employees.vue';
import NewCustomer from '@/components/NewCustomer.vue';
import NewEmployee from '@/components/NewEmployee.vue';
import EditEmployee from '@/components/EditEmployee.vue';
import EditCustomer from '@/components/EditCustomer.vue';
import Orders from '@/components/Orders.vue';
import NewOrder from '@/components/NewOrder.vue';
import FastSell from '@/components/FastSell.vue';
import FastSellEdit from '@/components/FastSellEdit.vue';
import EditOrder from '@/components/EditOrder.vue';
import OpenInvoice from '@/components/OpenInvoice.vue';
import InvoiceTemplate from '@/components/InvoiceTemplate.vue';
import NewProduct from '@/components/NewProduct.vue';
import EditProduct from '@/components/EditProduct.vue';
import ProductStock from '@/components/ProductStock.vue';
import AddStock from '@/components/AddStock.vue';
import EditStock from '@/components/EditStock.vue';
import AddInvoice from '@/components/AddInvoice.vue';
import EditInvoice from '@/components/EditInvoice.vue';
import Invoices from '@/components/Invoices.vue';
import ChooseCustomerPanel from '@/components/ChooseCustomerPanel.vue';
import app from '@/App.vue';
import {
  diffInDays
} from '@/components/utils.js';

import store from '../store'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/home/dashboard'
    },
    {
      path: '/home',
      redirect: '/home/dashboard'
    },
    {
      path: '/',
      name: 'app',
      component: app,
      children: [
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
            path: 'invoices',
            name: 'invoices',
            component: Invoices
          },
          {
            path: 'customers',
            name: 'customers',
            component: Customers
          },
          {
            path: 'employees',
            name: 'employees',
            component: Employees
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
          path: '/fast-sell',
          name: 'fast_sell',
          component: FastSell
        },
        {
          path: '/fast-sell-edit/:id',
          name: 'fast_sell_edit',
          component: FastSellEdit,
          props: true
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
          path: '/product-stock/:id',
          name: 'product_stock',
          component: ProductStock,
          props: true
        },
        {
          path: '/add-stock/:product_id',
          name: 'add_stock',
          component: AddStock,
          props: true
        },
        {
          path: '/edit-stock/:id',
          name: 'edit_stock',
          component: EditStock,
          props: true
        },
        {
          path: '/add-invoice',
          name: 'add_invoice',
          component: AddInvoice,
        },
        {
          path: '/edit-invoice/:id',
          name: 'edit_invoice',
          component: EditInvoice,
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
          path: '/new-employee',
          name: 'new_employee',
          component: NewEmployee
        },
        {
          path: '/edit-employee/:id',
          name: 'edit_employee',
          component: EditEmployee,
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
        },
        {
          path: '/choose-customer-panel',
          name: 'choose_customer_panel',
          component: ChooseCustomerPanel
        }
      ]
    }



  ]
})

let is_activated = store.getters.is_activated
let is_trail = store.getters.is_trail
let trail_days_left = 30 - diffInDays(new Date(store.getters.first_opened), new Date())
let is_registered = store.getters.is_registered
let is_logged_in = store.getters.is_logged_in.status


router.afterEach((to, from, next) => {
  document.activeElement.blur();//trick to take the focus on body 
});
router.beforeEach((to, from, next) => {

  console.log("from.name");
  console.log(to.name);
  is_activated = store.getters.is_activated
  is_trail = store.getters.is_trail
  trail_days_left = 30 - diffInDays(new Date(store.getters.first_opened), new Date())
  is_registered = store.getters.is_registered
  is_logged_in = store.getters.is_logged_in.status
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