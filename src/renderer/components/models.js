class Product {
  constructor (id, name, desc, unit, buy_price, sell_price, qte, weight, discount, image) {
    this.id = id
    this.name = name
    this.desc = desc
    this.unit = unit
    this.buy_price = buy_price
    this.sell_price = sell_price
    this.qte = qte
    this.weight = weight
    this.discount = discount
    this.image = image
  }
}

class Order {
  constructor (id, discount, total, total_net, buy_total, products, date, customer) {
    this.id = id
    this.discount = discount
    this.total = total
    this.total_net = total_net
    this.buy_total = buy_total
    this.products = products
    this.date = date
    this.customer = customer
  }
}

class Customer {
  constructor (id, name, phone, email, sex, discount, image, date) {
    this.id = id
    this.name = name
    this.phone = phone
    this.email = email
    this.sex = sex
    this.discount = discount
    this.image = image
    this.date = date
  }
}

export { Product, Order, Customer }
