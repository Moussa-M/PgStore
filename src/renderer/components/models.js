function getCurrentEmployee(){
  return store.getters.is_logged_in.employee_id
}

class Product {
  constructor (name, unit,category, image=null,barcode="",is_popular=false,is_bulk_sell=false,packing=1,pack_barcode="",pack_barcode_format="EAN13",barcode_format="EAN13",exp_date_pre_alert=0,stock_pre_alert=0) {
    this.id = uuid()
    this.name = name
    this.unit = unit
    this.category = category
    this.image = image
    this.barcode = barcode
    this.date = moment(new Date()).format()
    this.is_popular=is_popular
    this.is_bulk_sell = is_bulk_sell
    this.packing = packing//how many unit in one bulk ;pack
    this.pack_barcode = pack_barcode
    this.pack_barcode_format = pack_barcode_format
    this.barcode_format = barcode_format
    this.exp_date_pre_alert = exp_date_pre_alert
    this.stock_pre_alert = stock_pre_alert
    this.is_deleted=false
    this.issuer_employee_id = getCurrentEmployee()
  }
}

class Stock {

  constructor (product_id,supplier_id,invoice_id,exp_date,unit,pack,packing,total_qte,available_qte,buy_price, sell_price, discount,store_credit_points=0,extra_units=0,is_pre_ordered=false) {
    this.id = uuid()
    this.product_id = product_id
    this.supplier_id = supplier_id
    this.invoice_id = invoice_id
    this.exp_date = exp_date
    this.unit = unit
    this.pack = pack  
    this.packing = packing
    this.available_qte = available_qte
    this.total_qte = total_qte
    this.buy_price = buy_price
    this.sell_price = sell_price
    this.discount = discount
    this.store_credit_points=store_credit_points
    this.extra_units = extra_units
    this.is_deleted=false
    this.date = moment(new Date()).format()
    this.is_pre_ordered = is_pre_ordered //for products purchased and not added to stock
    this.issuer_employee_id = getCurrentEmployee()
    
    
  }
 
}

class Order {
  constructor (discount, total, total_net, buy_total, products,stocks,payments, customer_id,valid_store_credit_points=0) {
    this.id = uuid()
    this.discount = discount//customer dicount fro mthe total net 
    this.total = total
    this.total_net = total_net //minus product discount and customer discount 
    this.buy_total = buy_total
    this.products = products
    this.stocks = stocks
    this.payments = payments
    this.date = moment(new Date()).format()
    this.customer_id = customer_id
    this.valid_store_credit_points=valid_store_credit_points
    this.is_deleted=false
    this.issuer_employee_id = getCurrentEmployee()
  }
}


class Invoice {
  constructor (supplier_id = 1) {
    this.id = uuid()
    this.supplier_id = supplier_id
    this.date = moment(new Date()).format()
    this.is_deleted=false
    this.issuer_employee_id = getCurrentEmployee()
  }
}
class Customer {
  constructor (name, phone, email, sex="m", discount=0, image=null,address=null) {
    this.id = uuid()
    this.name = name
    this.phone = phone
    this.email = email
    this.sex = sex
    this.discount = discount
    this.image = image
    this.address = address
    this.date = moment(new Date()).format()
    this.is_deleted=false
    this.is_supplier=false
    this.issuer_employee_id = getCurrentEmployee()
  }
}

class Employee {
  constructor (name,password, phone, email, sex, image=null,allowed_actions,shift_starting_date=null,shift_ending_date=null) {
    this.id = uuid()
    this.name = name
    this.password = password
    this.phone = phone
    this.email = email
    this.sex = sex
    this.image = image
    this.allowed_actions = allowed_actions
    this.shift_starting_date = shift_starting_date
    this.shift_ending_date = shift_ending_date
    this.created_date = moment(new Date()).format()
    this.is_deleted=false
    this.issuer_employee_id = getCurrentEmployee()
  }
  
}

class EmployeeLoggingLog{
  constructor(employee_id,action,date=moment(new Date()).format()){
    this.id = uuid()
    this.employee_id = employee_id
    this.action = action //check_in,check_out
    this.date = date
    this.is_deleted = false
  }
}

class Activity{
    constructor(action,model_id){
          this.id = uuid()
          this.issuer_employee_id = getCurrentEmployee()
          this.action = action//all_actions
          this.model_id = model_id
          this.date = moment(new Date()).format()
          this.is_deleted = false
    }
    save(){

      window.store.dispatch("addActivity",this)
    }
}

class Notification{
  constructor(product_id,stock_id,product_name,type,status="new"){
        this.id = uuid()
        this.product_id = product_id//all_actions
        this.stock_id = stock_id//all_actions
        this.product_name = product_name//all_actions
        this.type = type
        this.status = status
        this.date = moment(new Date()).format()
        this.is_deleted = false
  }
}

export { Product, Order, Customer,Stock,Invoice,Employee,EmployeeLoggingLog,Activity,Notification }
