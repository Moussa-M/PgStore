<template>
<div class="wrapper">
    <div class="row">
        <div class="col-md-7">
            <div class="row">
                <div class="col-md-4">
                    <div @click="changeCustomer()" class="text-left center-all" style="cursor:pointer;padding: 28px;padding-left: 0px;
                                                padding-right: 0px;">
                        <div :class="$i18n.locale=='ar'?'text-left':'text-right'" style="width:100px;float:left">
                            <div>
                                <Avatar :image="customer.image" :fullname="customer.name" :width="80" :height="80" :radius="50" :crop="true" :changeable="false" :showPointer="true" />
                            </div>
                        </div>
                        <div :class="$i18n.locale=='ar'?'text-right':'text-left'" class="col-md-6 trim-text;" style=" display: grid;
                                                align-items: center;
                                                height: 68px;
                                                font-size: 20px">
                            <div v-if="customer.id!=1">{{customer.name}}</div>
                            <div v-else>{{ $t('anonymous') }}</div>

                            <span class="text-info">
                                <small dir="ltr">{{customer.phone}}</small>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="col-md-8">
                    <div style="direction: ltr;" class="text-center">
                        <div @change="totalChanged()" id="total" class="total"></div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div :class="$i18n.locale=='ar'?'border-left':'border-right'" class="col-md-12" style="height:100%">
                    <div class="row" style="border:1px solid #eee;border-bottom:none;padding: 10px;background: #f5f5f5;">
                        <div :class="$i18n.locale=='ar'?'text-right':'text-left'" class="col-md-6" style="padding:0px">
                            <div class style="width:100%;">
                                <input type="text" v-model="searchText" class="text-center search" name="search" :placeholder="$t('filter_by_name_codebar')" />

                                <!-- <font-awesome-icon class="inlineFilter" icon="search" /> -->
                            </div>
                        </div>
                        <div class="col-md-6" :class="$i18n.locale=='ar'?'text-left':'text-right'" style="padding-right:0px;">
                            <div class="form-group" style="width:100%;">
                                <!-- <font-awesome-icon class="inlineFilter" icon="filter" /> -->
                                <div class="btn-group btn-group-toggle" data-toggle="buttons">
                                    <label @click="switchToPopular()" class="btn btn-secondary active">
                                        <input type="radio" autocomplete="off" :checked="showPopular" />
                                        {{$t("popular_products")}}
                                    </label>

                                    <label @click="switchToAll()" class="btn btn-secondary">
                                        <input type="radio" autocomplete="off" :checked="!showPopular" />
                                        {{$t("all_products")}}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row" v-if="showPopular">
                        <div v-if="filteredPopularProducts.length>0" style="    padding: 10px;
                padding-top: 0px;border:1px solid #ddd;width:100%;max-height:calc(100vh - 240px);height:calc(100vh - 240px);overflow-y:auto;overflow-x:hidden">
                            <grid @dragend="dragEnd($event)" :draggable="searchText == ''" :sortable="false" :items="filteredPopularProducts" :Height="100" :Width="100" :cellHeight="180" :cellWidth="300">
                                <template slot="cell" slot-scope="props">
                                    <div style="width:100; margin: auto;" :key="props.item.id">
                                        <Product @plus="updateProductList(props.item.id,1,false,$event)" :product="props.item" :width="120" :height="120" :max="props.item.initial_qte-props.item.amount" :currency="currency" :disable="props.item.initial_qte-props.item.amount<=0?true:false" />
                                    </div>
                                </template>
                            </grid>
                        </div>

                        <div style="border:1px solid #ddd;width:100%;height:calc(100vh - 120px);" class="flex-center" v-else>
                            <div class="text-center">
                                <i style="font-size:80px;color:gray" class="ti-filter"></i>
                                <h3>{{$t("no_popular_products_found")}}</h3>
                                <p style="margin-bottom:50px" class="category" v-if="products.length > 0">{{$t("clear_to_see_products")}}</p>
                                <button @click="showPopular=false" class="btn btn-default btn-lg">{{$t("add")}}</button>
                            </div>
                        </div>
                    </div>
                    <div v-else style="border:1px solid #ddd;width:100%;overflow-y:auto;max-height:calc(100vh - 240px);height:calc(100vh - 240px);">
                        <div v-if="filteredProducts.length > 0" class="content table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <th width="5%">{{$t("n")}}</th>
                                    <th :class="$i18n.locale=='ar'?'text-right':'text-left'" width="25%">{{ $t("name") }}</th>

                                    <th class="text-center" width="15%">{{$t("sell_price")}}</th>
                                    <th class="text-center" width="20%">{{$t("available")}}</th>
                                    <th class="text-center" width="20%">{{ $t("is_popular") }}</th>
                                    <th :class="$i18n.locale=='ar'?'text-left':'text-right'" width="20%">{{ $t("add") }}</th>
                                </thead>
                                <tbody style="max-height:calc(100vh - 500px);">
                                    <tr style="cursor: pointer;" v-for="(product,index) in filteredProducts" :key="product.id" @click="selectRow(product.id)">
                                        <td style="padding-left:10px;padding-right:10px;">{{(currentPage-1)*pageMax + index+1}}</td>
                                        <td>
                                            <div class="row">
                                                <div :class="$i18n.locale=='ar'?'text-right':'text-left'" class="col-xs-4">
                                                    <div class>
                                                        <Avatar :image="isNotEmpty(product.image)?product.image:'static/assets/img/faces/product.png'" :width="50" :height="50" :radius="7" :crop="true" @click="zoomImage(isNotEmpty(product.image)?product.image:'static/assets/img/faces/product.png')" :changeable="false" />
                                                    </div>
                                                </div>
                                                <div :class="$i18n.locale=='ar'?'text-right':'text-left'" class="col-xs-8 trim-text">{{product.name}}</div>
                                            </div>
                                        </td>

                                        <td class="text-center">{{product.sell_price}} {{$t(currency.toLowerCase())}}</td>
                                        <td class="text-center">{{product.initial_qte-product.amount}} {{($t(product.unit.toLowerCase())).toUpperCase()}}</td>
                                        <td class="center-block">
                                            <div>
                                                <label class="switch">
                                                    <input @change="addToPopular(product)" type="checkbox" :checked="isPopular(product.id)" />
                                                    <span class="slider round"></span>
                                                </label>
                                            </div>
                                        </td>
                                        <td :class="$i18n.locale=='ar'?'text-left':'text-right'">
                                            <button :disabled="product.initial_qte-product.amount<=0?true:false" @click="updateProductList(product.id,1)" class="btn btn-default btn-icon">
                                                <font-awesome-icon icon="cart-plus" size="lg" />
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div v-if="products.length > pageMax" class="row text-center" style="margin-top:40px">
                                <nav aria-label="Search results pages">
                                    <v-pagination v-model="currentPage" :page-count="pageCount" :classes="bootstrapPaginationClasses" :labels="customLabels"></v-pagination>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-5" style="height: calc(100vh - 50px);padding:0px;padding-right:10px" :style="{'padding-right':$i18n.locale=='ar' ? '0px':'10px','padding-left':$i18n.locale=='ar' ? '10px':'0px'}">
            <div class="row" style="height:calc(60vh);padding-left:0px">
                <div v-if="selectedProducts.length>0">
                    <table class="table table-hover" style="border:1px solid #eee;margin-bottom:5px;display:block;display:block;overflow: hidden;">
                        <thead style="width:100%">
                            <th style="width:1%">{{ $t("n") }}</th>
                            <th :class="$i18n.locale=='ar'?'text-right':'text-left'" style="width:30%;padding-right:15px;padding-left: 15px;">{{ $t("name") }}</th>
                            <th style="width:19%" :class="$i18n.locale=='ar'?'text-right':'text-left'">{{ $t("qte") }}</th>
                            <th style="width:20%" :class="$i18n.locale=='ar'?'text-right':'text-left'">{{$t("total")}}</th>

                            <th style="width:30%" :class="$i18n.locale=='ar'?'text-left':'text-right'">{{ $t("actions") }}</th>
                        </thead>
                        <tbody style="display:block;max-height:calc(60vh - 200px);width:100%;overflow-y:auto;">
                            <tr style="cursor: pointer;width:100%" v-for="(product,index) in selectedProducts" :ref="product.id" :key="product.id" @click="selectRow(product.id)">
                                <td style="width:1%;padding-left:10px;padding-right:10px;" :class="$i18n.locale=='ar'?'text-right':'text-left'">{{index+1}}</td>
                                <td style="width:30%">
                                    <div class="row" style="min-width:13vw">
                                        <div :class="$i18n.locale=='ar'?'text-left':'text-right'" class="col-xs-4">
                                            <div class>
                                                <Avatar :image="isNotEmpty(product.image)?product.image:'static/assets/img/faces/product.png'" :width="50" :height="50" :radius="7" :crop="true" @click="zoomImage(isNotEmpty(product.image)?product.image:'static/assets/img/faces/product.png')" :changeable="false" />
                                            </div>
                                        </div>
                                        <div :class="$i18n.locale=='ar'?'text-right':'text-left'" class="col-xs-6 trim-text" style="max-height: 50px;overflow: hidden;">{{product.name}}</div>
                                        <div :class="$i18n.locale=='ar'?'text-right':'text-left'" class="col-xs-6 trim-text" style="max-height: 50px;overflow: hidden;">{{product.sell_price}} {{$t(currency.toLowerCase())}}</div>
                                    </div>
                                </td>

                                <td style="width:19%" :class="$i18n.locale=='ar'?'text-right':'text-left'">{{product.amount}}</td>
                                <td style="width:20%" :class="$i18n.locale=='ar'?'text-right':'text-left'">{{(parseFloat(product.amount) * parseFloat(product.sell_price)).toFixed(2)}} {{$t(currency.toLowerCase())}}</td>
                                <td :class="$i18n.locale=='ar'?'text-left':'text-right'" style="display: flex;justify-content: flex-end; ">
                                    <button @click="removeProduct(product.id,$event)" style="margin-right:10px;margin-left:10px;" class="btn btn-danger">
                                        <font-awesome-icon icon="trash" size="lg" />
                                    </button>
                                    <Quantity :disabled="false" :max="product.initial_qte" :type="product.unit" :value="product.amount" v-on:change="updateProductList(product.id,$event,true)" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="row">
                        <div class="col-md-6" style="padding-start:0px;">
                            <div :class="$i18n.locale=='ar'?'text-right':'text-left'" class="payments-box">
                                <h5 class="category" style="margin: 0px">
                                    <label>{{$t("payments_made")}}</label> :
                                </h5>
                                <div v-if="payments.length>0">
                                    <h5 v-for="payment in payments" :key="payment.id" class="payment" style="margin: 0px">
                                        <label>+{{$t(payment.type)}}</label>
                                        : {{payment.amount}} {{$t(currency.toLowerCase())}}
                                           <span>({{payment.date.substring(0,10)}})</span>
                                        <span @click="removePayment(payment.id)" class="btn-circle" style="background:#eee;">
                                            {{($t("refund"))}}
                                            <font-awesome-icon style="padding:0px" class="inlineFilter" icon="minus" />
                                        </span>
                                    </h5>
                                </div>
                                <div v-else>{{$t("no_payments_made")}}</div>
                                <h5 class="category" style="margin: 0px">
                                    <label>{{$t("balance_due")}}</label>
                                    : {{(balance_due < 0 ? 0:balance_due.toFixed(2))}} {{$t(currency.toLowerCase())}}
                                </h5>
                                <h5 v-if="parseFloat(total_payments) > parseFloat(total_net)" class="category" style="margin: 0px">
                                    <label>{{$t("change")}}</label>
                                    : {{(total_payments - total_net).toFixed(2)}} {{$t(currency.toLowerCase())}}
                                </h5>
                            </div>
                        </div>
                        <div class="col-md-6" style="padding:0px">
                            <div :class="$i18n.locale=='ar'?'text-left':'text-right'" class="payments-box">
                                <h5 class="category" style="margin: 0px">{{$t("total")}} : {{total}} {{$t(currency.toLowerCase())}}</h5>
                                <h5 class="category" style="margin: 0px">{{$t("product_discount")}} : {{discount}} {{$t(currency.toLowerCase())}}</h5>

                                <div v-if="is_customer_selected">
                                    <h5 class="category" style="margin: 0px">{{$t("customer_discount")}} ({{parseFloat(customer.discount).toFixed(2)}}%) : {{customer_discount}} {{$t(currency.toLowerCase())}}</h5>
                                </div>
                                <h4 style="margin: 0px">{{$t("total_net")}} : {{total_net }} {{$t(currency.toLowerCase())}}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <table class="table table-hover" style="border:1px solid #eee;display:block;overflow: hidden;">
                        <thead style="width:100%">
                            <th style="width:1%">{{ $t("n") }}</th>
                            <th :class="$i18n.locale=='ar'?'text-right':'text-left'" style="width:30%;padding-right:15px;padding-left: 15px;">{{ $t("name") }}</th>
                            <th style="width:19%" class>{{ $t("qte") }}</th>
                            <th style="width:20%" class>{{$t("total")}}</th>

                            <th style="width:30%" :class="$i18n.locale=='ar'?'text-left':'text-right'">{{ $t("actions") }}</th>
                        </thead>
                        <tbody style="display:block;max-height:calc(100vh - 455px);width:100%;overflow-y:auto;">
                            <div class="text-center">
                                <span class="mdi mdi-basket-fill mdi-58px"></span>
                                <h3>{{$t("empty_list")}}</h3>
                            </div>
                        </tbody>
                    </table>
                </div>
            </div>
            <div v-if="!show_cash_payment && !show_debit_payment && !show_store_credit_payment" class="row payments-method-box" style="padding:10px">
                <label style="font-size:22px">{{$t("payment_methods")}}</label>
                <hr style="margin-top:0px" />
                <div style="display:flex;justify-content:space-evenly">
                    <button @click="toggleDebitPayment()" :disabled="(parseFloat(total_payments)>=parseFloat(total_net) && total_net>0) || selectedProducts.length<=0" class="btn btn-default btn-md" style="width:31%;padding-bottom:0px; padding-top:0px;padding-right:30px;padding-left:30px">
                        {{$t("debit")}}
                        <span class="mdi mdi-credit-card" style="font-size:40px"></span>
                    </button>
                    <button @click="toggleCashPayment()" :disabled="(parseFloat(total_payments)>=parseFloat(total_net) && total_net>0) || selectedProducts.length<=0" class="btn btn-default btn-md" style="width:31%;padding-bottom:0px; padding-top:0px;padding-right:30px;padding-left:30px">
                        {{$t("cash")}}
                        <span class="mdi mdi-cash" style="font-size:40px"></span>
                    </button>
                    <button @click="toggleStoreCreditPayment()" :disabled="(parseFloat(total_payments)>=parseFloat(total_net) && total_net>0) || selectedProducts.length<=0 || customer.id==1" class="btn btn-default btn-md" style="width:31%;padding-bottom:0px; padding-top:0px;padding-right:30px;padding-left:30px">
                        {{$t("store_credit")}}
                        <span class="mdi mdi-store" style="font-size:40px"></span>
                    </button>
                </div>
                <div class="row" style="width:calc(100% - 30px);position:absolute;bottom:0px">
                     <div class="pay col-md-3 text-left" style="padding:5px">

                        <button @click="goBack" class="btn btn-cancel btn-lg" style="width:100%;padding-bottom:15px;padding-top:15px;">{{$t("back")}}</button>
                    </div>
                     <div class="pay col-md-3 text-left" style="padding:5px">
                        <button :disabled="selectedProducts.length<=0" @click="cancelOrder()" class="btn btn-danger btn-lg" style="width:100%;padding-bottom:15px;padding-top:15px;">{{$t("cancel_order")}}</button>
                      
                    </div>
                    <div class="pay col-md-6 text-right" style="padding:5px">
                        <button @click="updateOrder" :disabled="selectedProducts.length<=0 || isUpdateBtnDisabled()" class="btn btn-default btn-lg" style="width:100%;padding-bottom:15px;padding-top:15px;">{{$t("update_order")}}</button>
                    </div>
                </div>
            </div>
            <div v-else class="row payments-method-box">
                <div v-if="show_debit_payment" style="padding:10px; height: calc(40vh - 245px);">
                    <label style="font-size:22px;text-transform:uppercase">{{$t("debit")}}</label>
                    <div class="form-group">
                        <label style="font-size:18px">{{$t("reciept_number")}}</label>
                        <input type="text" min="1" step="1" dir="ltr" class="form-control border-input animated" v-model="appr_code" :placeholder="$t('card_reader_reciept_number')" value="1" />
                    </div>
                    <div class="form-group">
                        <label style="font-size:18px">{{$t("payed_amount")}} ({{$t(currency.toLowerCase())}})</label>
                        <input style="width:50%" type="number" min="1" step="0.01" @keyup.enter="(debit_amount_error || parseFloat(debit_charged_amount)<=0|| appr_code.length<=0) ? ()=>{}:saveDebitPayment()" :max="balance_due" @input="debit_charged_amount > balance_due ? debit_amount_error=true:debit_amount_error=false" class="form-control border-input animated" v-model="debit_charged_amount" :placeholder="$t('payed_amount')" value="1" />
                        <span style="position:absolute" v-show="debit_amount_error" class="error">{{$t("debit_charged_big_balance")}}</span>
                    </div>
                    <div class="row center-block" style="justify-content:space-evenly;margin-top:10px">
                        <button @click="toggleDebitPayment()" class="btn btn-cancel" style="padding-bottom:10px;padding-top:10px;padding-right:80px;padding-left:80px"><i style="font-size:25px" class="mdi mdi-keyboard-return"></i></button>
                        <button :disabled="parseFloat(debit_charged_amount)<=0|| appr_code.length<=0 || debit_amount_error" @click="saveDebitPayment()" class="btn btn-default" style="padding-bottom:10px;padding-top:10px;padding-right:80px;padding-left:80px">{{$t("add_amount")}}</button>
                    </div>
                </div>
                <div v-else-if="show_cash_payment" style="padding:10px">
                    <div class="row">
                        <div style="padding:0px" class="col-md-6">
                            <label class style="font-size:22px;text-transform:uppercase">{{$t("cash")}}</label>
                            <div class="form-group">
                                <label style="font-size:15px">{{$t("payed_amount")}} ({{$t(currency.toLowerCase())}})</label>
                                <input style="width:100%" type="number" min="1" step="1" class="form-control border-input animated" v-model="cash_amount" @keyup.enter="cash_amount<=0 ? ()=>{}:saveCashPayment()" :placeholder="$t('payed_amount')" value="1" />
                            </div>
                            <span v-if="balance_due-cash_amount < 0" style="font-weight:bold;opacity:0.5">{{$t("change")}}</span>
                            <span v-if="balance_due-cash_amount < 0" style="opacity:0.6">{{Math.abs(balance_due-cash_amount).toFixed(2)}}</span>
                        </div>
                        <label style="padding-right:20px;padding-left:20px">{{$t("bills")}} ({{$t(currency.toLowerCase())}})</label>
                        <div class="col-md-6 bills-box">
                            <div @click="billClicked(bill)" v-for="bill in bills" :key="bill" class="hvr-grow bill">
                                <span>{{bill}}</span>
                            </div>
                            <div @click="billClicked('c')" key="1232" class="hvr-grow bill">
                                <span>{{$t("c")}}</span>
                            </div>
                        </div>
                    </div>

                    <div class="row center-block" style="justify-content:space-evenly;margin-top:5px">
                        <button @click="toggleCashPayment()" class="btn btn-cancel" style="padding-bottom:10px;padding-top:10px;padding-right:80px;padding-left:80px"><i style="font-size:25px" class="mdi mdi-keyboard-return"></i></button>
                        <button :disabled="cash_amount<=0" @click="saveCashPayment()" class="btn btn-default" style="padding-bottom:10px;padding-top:10px;padding-right:80px;padding-left:80px">{{$t("add_amount")}}</button>
                    </div>
                </div>
                <div v-else style="padding:10px">
                    <div class="row">
                        <div style="padding:0px" class="col-md-5">
                            <label class style="font-size:22px;text-transform:uppercase">{{$t("store_credit")}}</label>
                            <div class="form-group">
                                <label style="font-size:15px">{{$t("customer")}}</label>
                                <div class="row">
                                    <div @click="changeCustomer()" :class="$i18n.locale=='ar'?'text-right':'text-left'" class="center-all" style="cursor:pointer;padding: 5px;background-color:#eaeaea
                                        padding-right: 0px;">
                                        <div :class="$i18n.locale=='ar'?'text-right':'text-left'" style="width:50px;float:left">
                                            <div>
                                                <Avatar :image="customer.image" :fullname="customer.name" :width="50" :height="50" :radius="50" :crop="true" :changeable="false" :showPointer="true" />
                                            </div>
                                        </div>
                                        <div :class="$i18n.locale=='ar'?'text-right':'text-left'" class="col-md-6 trim-text;" style="
                                        height: 50px;
                                        font-size: 18px">
                                            <div v-if="customer.id!=1">{{customer.name}}</div>
                                            <div v-else>{{ $t('anonymous') }}</div>

                                            <span class="text-info">
                                                <small dir="ltr">{{customer.phone}}</small>
                                            </span>
                                        </div>
                                        <div class="row" style="    display: flex; flex-direction: column;">
                                            <span class="label label-default" style="font-size: 17px;">
                                                <small>{{getCustomerStoreCreditPoints(customer)}} {{$t("points")}}</small>
                                            </span>

                                            <span class="label label-info" style="font-size: 17px;">
                                                <small>~ {{ getCustomerStoreCreditBalance(customer) }} {{ $t(currency.toLowerCase()) }}</small>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label style="font-size:15px">{{$t("payed_amount")}}</label>
                                <input style="width:100%" type="number" min="1" step="1" :max="balance_due" @input="storeCreditChanged()" @keyup.enter="store_credit_amount_error ? ()=>{}:saveStoreCreditPayment()" class="form-control border-input animated" v-model="store_credit_amount" :placeholder="$t('payed_amount')" value="1" />
                                <span style="position:absolute" v-show="store_credit_amount_error" class="error">{{$t("you_dont_have_store_credit")}}</span>
                            </div>

                            <!-- <span
                  v-if="balance_due-store_credit_amount < 0"
                  style="font-weight:bold;opacity:0.5"
                >{{$t("change")}}</span>
                <span
                  v-if="balance_due-store_credit_amount < 0"
                  style="opacity:0.6"
                >{{Math.abs(balance_due-store_credit_amount).toFixed(2)}}</span> -->
                        </div>
                        <div class="col-md-7" style="padding-left:10px">
                            <label style="padding-right:5px;padding-left:5px">{{$t("bills")}} ({{$t(currency.toLowerCase())}})</label>
                            <div class="row bills-box">
                                <div @click="billClicked(bill,true)" v-for="bill in bills" :key="bill" class="hvr-grow bill">
                                    <span>{{bill}}</span>
                                </div>
                                <div @click="billClicked('c',true)" key="12553" class="hvr-grow bill">
                                    <span>{{$t("c")}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row center-block" style="justify-content:space-evenly;margin-top:5px">
                        <button @click="toggleStoreCreditPayment()" class="btn btn-cancel" style="padding-bottom:10px;padding-top:10px;padding-right:80px;padding-left:80px"><i style="font-size:25px" class="mdi mdi-keyboard-return"></i></button>
                        <button @click="saveStoreCreditPayment()" :disabled="store_credit_amount_error || store_credit_amount == 0" class="btn btn-default" style="padding-bottom:10px;padding-top:10px;padding-right:80px;padding-left:80px">{{$t("add_amount")}}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
const toLower = text => {
    return text.toString().toLowerCase();
};

const searchByName = (items, term) => {
    if (term) {
        return items.filter(item => toLower(item.name).includes(toLower(term)));
    }

    return items;
};

import Odometer from "odometer";
import "odometer/themes/odometer-theme-digital.css";
import BasketUnfill from "vue-material-design-icons/BasketUnfill.vue";
import swal from "sweetalert";
import vPagination from "vue-plain-pagination";
import Quantity from "./sub_components/Quantity.vue";
import CustomerCard from "./sub_components/CustomerCard.vue";
import Avatar from "./sub_components/Avatar.vue";
import Product from "./sub_components/Product.vue";
import Vue from "vue";
import {
    Order,
    Invoice
} from "./models.js";

export default {
    name: "FastSellEdit",
    components: {
        vPagination,
        Quantity,
        Product,
        CustomerCard,
        Avatar,
        BasketUnfill
    },
        props: {
        id: [Number, String]
    },
    deactivated() {
        this.$eventBus.$off("barcode");
    },

    created: function () {
        let user = window.store.getters.user;
        this.currency = user.currency;
        this.products = JSON.parse(JSON.stringify(store.getters.products));
        this.bills = [1000, 500, 200, 100, 50, 20, 10, 5, 2, 1, 0.5, 0.25, 0.1];
        this.pageMax = parseInt(($(window).height() - 310) / 80);
        this.all_stocks = JSON.parse(JSON.stringify(store.getters.stocks));
        console.info(this.all_stocks);

        this.order = JSON.parse(JSON.stringify(store.getters.getOrder(this.id)));
        _.forEach(this.order.stocks, stock => {
            let stock_index = _.findIndex(this.all_stocks, {
                id: stock.id
            });
            if (stock_index != -1) {
                let st = this.all_stocks[stock_index];
                st.available_qte = parseFloat(st.available_qte) + parseFloat(stock.available_qte);
                this.all_stocks.splice(stock_index, 1, st);
            } else {
                this.all_stocks.unshift(stock);
            }
        });

        this.products = _.map(this.products, p => {
            p.amount = 0;
            var fstock = this.getStocks(p.id)[0];

            p.initial_qte = this.getProductAvailableQte(p.id) + this.getProductAvailableQte2(p.id);

            p.sell_price = fstock ? parseFloat(fstock.sell_price) : 0;
            p.discount = fstock ? parseFloat(fstock.discount) : 0;

            return p;
        });
        console.log("this.order");
        console.log(this.order);

        //  _.forEach(this.order.products, p => {
        //      this.updateProductList(p.id,p.amount)
        //  });
        this.payments = JSON.parse(JSON.stringify(this.order.payments));
        console.log("this.order")
        console.log(this.order)
        this.customer = JSON.parse(JSON.stringify(store.getters.getCustomer(this.order.customer_id)));
        this.popularProducts = this.getPopularProducts();
        this.filterProducts();
        this.customers = JSON.parse(JSON.stringify(store.getters.customers));
        this.getSelectedCustomer();

    },

    activated() {
        console.log("activated");

        this.customers = JSON.parse(JSON.stringify(store.getters.customers));
        this.getSelectedCustomer();

        this.filterProducts();

        this.customLabels = {
            first: this.$t("first"),
            prev: this.$t("previous"),
            next: this.$t("next"),
            last: this.$t("last")
        };

        this.$eventBus.$on("barcode", bcode => {
            let product = this.getProductFromBarCode(bcode);
            if (product) {
                console.log("UPDATED PROD");
                this.updateProductList(product.id, 1, false);
            } else {
                swal({
                    title: this.$t("product_not_found"),
                    text: this.$t("pls_add_product"),
                    icon: "warning",
                    dangerMode: false
                });
            }
        });

        // this.popularProducts = JSON.parse(JSON.stringify(store.getters.customers));
    },

    data: function () {
        return {
            preOrderedStocks: [],
            preOrderedStock: {},
            debit_amount_error: false,
            store_credit_amount_error: false,
            all_stocks: [],
            total_payments: 0,
            bills: [],
            payments: [],
            search: null,
            od: null,
            size48: 58,
            ringtone: true,
            selected_id: null,
            searched: [],
            showPopular: true,
            isCustomerSelected: {},
            is_customer_selected: false,
            is_products_selected: 0,

            products: [],
            orders: [],
            filteredProducts: [],
            filteredPopularProducts: [],
            selectedProducts: [],
            popularProducts: [],

            fastProducts: [],
            total: 0,
            total_discount: 0,
            total_net: 0,
            currency: null,
            discount: 0,
            customer_discount: 0,
            customer: null,
            searchText: "",
            barcode: "",
            currentPage: 1,
            pageMax: 9,
            currentCount: 0,
            products: [],
            filteredProducts: [],
            currency: null,
            searchText: "",
            bootstrapPaginationClasses: {
                // http://getbootstrap.com/docs/4.1/components/pagination/
                ul: "pagination",
                li: "page-item",
                liActive: "active",
                liDisable: "disabled",
                button: "page-link"
            },
            customLabels: {
                first: this.$t("first"),
                prev: this.$t("previous"),
                next: this.$t("next"),
                last: this.$t("last")
            },
            debit_amount: 0,
            show_debit_payment: false,
            cash_amount: 0,
            show_cash_payment: false,
            store_credit_amount: 0,
            show_store_credit_payment: false,

            appr_code: "",
            debit_charged_amount: 0,
            balance_due: 0,
            bill_clicked: true
        };
    },
    watch: {
        pageMax: function () {
            console.log("this.pageMax changed");
            console.log(this.pageMax);
        },
        payments: {
            handler: function (val, oldVal) {
                console.log("changed hhhh");
                this.total_payments = 0;
                _.forEach(this.payments, p => {
                    this.total_payments =
                        parseFloat(this.total_payments) + parseFloat(p.amount);
                });
                this.balance_due = parseFloat(
                    (
                        parseFloat(this.total_net) - parseFloat(this.total_payments)
                    ).toFixed(2)
                );
            },
            deep: true
        },

        currentPage: function (val, oldVal) {
            this.filterProducts();
        },
        searchText() {
            setTimeout(() => {
                console.log("this.showPopular" + this.searchText);
                console.log(this.showPopular);
                if (!this.showPopular) {
                    this.filterProducts(true);
                } else {
                    this.filterPopular();
                }
            }, 250);
        }
    },
    methods: {
        
         isUpdateBtnDisabled(){
                       console.log("this.dsfsdfdsfsdfdsfsdfsdf");
                       console.log(_.isEqual(this.order.payments,this.payments));
          
            if(_.isEqual(this.order.payments,this.payments) && this.order.customer_id == this.customer.id){
                let match_qte = true;
                _.forEach(this.order.products,p=>{
                            let pro = _.find(this.selectedProducts,{id:p.id});
                            if(pro){
                                if(pro.amount != p.amount){ match_qte=false;return false;}
                            }else{
                                match_qte = false;
                            }
                });
               
                return match_qte&&this.order.products.length == this.selectedProducts.length
            }else{

                return false;
            }
        },
        storeCreditChanged() {

            if (parseFloat(this.store_credit_amount) > this.getCustomerStoreCreditBalance(this.customer)) {
                this.store_credit_amount_error = true;
            } else {
                this.store_credit_amount_error = false;
            }
        },
        changeCustomer() {
            //open pop up to choose customer
          
            this.$router.push("/choose-customer-panel");
            //this.$eventBus.$emit('barcode', this.barcode)

        },
        removePayment(id) {
            _.remove(this.payments, {
                id: id
            });
            this.total_payments = 0;
            _.forEach(this.payments, p => {
                this.total_payments = this.total_payments + p.amount;
            });
            this.balance_due = this.total_net - this.total_payments;
        },
        removeCreditStorePayment() {
            _.remove(this.payments, {
                type: "store_credit"
            });
            this.total_payments = 0;
            _.forEach(this.payments, p => {
                this.total_payments = this.total_payments + p.amount;
            });
            this.balance_due = this.total_net - this.total_payments;
        },
        billClicked(bill, is_store_credit = false) {
            if (is_store_credit) {
                if (bill != "c") {
                    if (this.bill_clicked) {
                        this.store_credit_amount = parseFloat((parseFloat(this.store_credit_amount) + parseFloat(bill)).toFixed(2));
                    } else {
                        this.store_credit_amount = parseFloat(parseFloat(bill).toFixed(2));
                    }
                    this.bill_clicked = true;
                } else {
                    this.store_credit_amount = 0;
                }
                this.storeCreditChanged();
            } else {
                if (bill != "c") {
                    if (this.bill_clicked) {
                        this.cash_amount = parseFloat((parseFloat(this.cash_amount) + parseFloat(bill)).toFixed(2));
                    } else {
                        this.cash_amount = parseFloat(parseFloat(bill).toFixed(2));
                    }
                    this.bill_clicked = true;
                } else {
                    this.cash_amount = 0;
                }
            }

        },
        saveDebitPayment() {
            let debit = _.find(this.payments, {
                type: "debit",
                appr: this.appr_code
            });
            if (debit) {
                debit.amount =
                    parseFloat(debit.amount) + parseFloat(this.debit_charged_amount);
            } else {
                this.payments.push({
                    id: uuid(),
                    type: "debit",
                    amount: parseFloat(this.debit_charged_amount),
                    date: moment(new Date()).format(),
                    appr: this.appr_code
                });
            }

            this.toggleDebitPayment();
        },
        toggleDebitPayment() {
            this.debit_charged_amount = this.balance_due;
            this.show_debit_payment = !this.show_debit_payment;
            console.log(this.show_debit_payment);
        },
        saveCashPayment() {
            let cash = _.find(this.payments, {
                type: "cash"
            });
            if (cash) {
                cash.amount = parseFloat(cash.amount) + parseFloat(this.cash_amount);
            } else {
                this.payments.push({
                    id: uuid(),
                    type: "cash",
                    date: moment(new Date()).format(),
                    amount: this.cash_amount
                });
            }

            this.toggleCashPayment();
        },
        toggleCashPayment() {
            this.cash_amount = this.balance_due;
            this.show_cash_payment = !this.show_cash_payment;
            this.bill_clicked = false;
        },
        saveStoreCreditPayment() {
            this.payments.push({
                id: uuid(),
                type: "store_credit",
                date: moment(new Date()).format(),
                amount: this.store_credit_amount
            });
            this.toggleStoreCreditPayment();
        },
        toggleStoreCreditPayment() {
            this.show_store_credit_payment = !this.show_store_credit_payment;
        },
        selectRow(id) {
            this.selected_id = id;
            $("tr").removeClass("selected");
            $(this.$refs[id]).addClass("selected");
        },
        isPopular(id) {
            return (
                _.findIndex(this.popularProducts, {
                    id: id
                }) != -1
            );
        },
        addToPopular(prod) {
            console.log(prod);
            prod.is_popular = !prod.is_popular;
            this.products = _.map(this.products, p => {
                if (prod.id == p.id) {
                    p.is_popular = prod.is_popular;
                }
                return p;
            });
            store.dispatch("updateProduct", prod);
            console.log("this.products");
            console.log(this.products);
            this.getPopularProducts();
            this.filterPopular();
        },
         getSelectedCustomer() {
            let cus = store.getters.panel_choosed_customer;
            if (cus) {
                this.selectCustomer(cus.id);
                store.commit('panel_choosed_customer', null)
            } else {
                if (this.customer == null) {
                    this.customer = this.customers[0];
                } else {
                    this.selectCustomer(this.customer.id);
                }
            }
        },
        // selectCustomer(id) {
        //   let customer = _.find(this.customers, {
        //     id: id
        //   });
        //   if (customer) {
        //     this.customer = customer;
        //   } else {
        //     this.customer = this.customers[0];
        //   }
        // },
        switchToAll() {
            //console.log("changed");
            this.showPopular = false;
        },
        switchToPopular() {
            // console.log("changed");
            this.showPopular = true;
        },
        filterPopular() {
            let filteredP = _.filter(this.popularProducts, p => {
                if (this.searchText == "") {
                    return true;
                } else {
                    if (
                        p.name.toLowerCase().search(this.searchText.toLowerCase()) != -1 ||
                        p.barcode.toLowerCase().search(this.searchText.toLowerCase()) != -1
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                }
            });
            this.filteredPopularProducts = filteredP;
        },
        filterProducts(resetCurrentPage = false) {
            let filteredP = _.filter(this.products, p => {
                if (this.searchText == "") {
                    return true;
                } else {
                    if (
                        p.name.toLowerCase().search(this.searchText.toLowerCase()) != -1 ||
                        p.barcode.toLowerCase().search(this.searchText.toLowerCase()) != -1
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                }
            });
            if (resetCurrentPage) {
                this.currentPage = 1;
            }
            if (this.products.length > 0) {
                this.filteredProducts = _.slice(
                    filteredP,
                    this.pageMax * (this.currentPage - 1),
                    this.pageMax * (this.currentPage - 1) + this.pageMax
                );
            }
            this.pageCount = Math.ceil(filteredP.length / this.pageMax);
        },
        getPopularProducts() {
            this.popularProducts = JSON.parse(JSON.stringify(_.filter(this.products, {
                is_popular: true
            })));
            this.filteredPopularProducts = this.popularProducts;
            return this.popularProducts;
        },

        dragEnd(event) {
            let tempPopularProducts = _.map(event.items, el => {
                return el.item.id;
            });
            //store.dispatch("popularProducts", tempPopularProducts);
        },
        removeProduct(id, event) {
            if (event) {
                event.stopPropagation();
            }
            $(this.$refs[id]).addClass("animated fadeOutLeft");
            this.updateProductList(id, 0, true);
            // _.remove(this.selectedProducts, {
            //     id: id
            // });
            console.log(this.selectedProducts);
        },
        getProductFromBarCode(bcode) {
            let product = _.find(this.products, {
                barcode: bcode
            });
            if (product) {
                return product;
            }
            return null;
        },

        isNotEmpty(str) {
            if (str != null && str != "") {
                return true;
            }
            return false;
        },
        updateOrder() {
            //open cahc drawer
            //print reciept
            if (this.balance_due > 0) {
                if (this.customer.id != 1) {
                    swal({
                        title: this.$t("payment_not_complete"),
                        text: this.$t("wanna_pay_with_debt"),
                        icon: "warning",
                        buttons: [this.$t("no"), this.$t("yes")],
                        dangerMode: false
                    }).then(add => {
                        if (add) {
                            this.subUpdateOrder();
                        }
                    });
                } else {
                    swal({
                        title: this.$t("payment_not_complete"),
                        text: this.$t("cant_pay_debt_anonymous"),
                        icon: "warning",
                        button: this.$t("ok"),
                        dangerMode: false
                    })
                }

            } else {
                console.log(this.selectedProducts);
                this.subUpdateOrder();
            }
        },
        subUpdateOrder() {
            {
                swal({
                    title: this.$t("do_you_wanna_print_reciept"),
                    text: "",
                    icon: "question",
                    buttons: [this.$t("no"), this.$t("yes")],
                    dangerMode: false
                }).then(print => {
                    let order_products = this.selectedProducts;
                    //updating product stock && calculating buy_total
                    let order_stocks = [];
                    let buy_total = 0;
                    order_products = _.map(order_products, p => {
                        buy_total = buy_total + p.amount * p.buy_price;
                        let stocks = this.getStocks(p.id);
                        //to add pre ordered stocks in db
                        if (p.amount > p.initial_qte) {
                            let pre_ordered_stock = store.getters.getProductPreOrderedStock(p.id);
                            if (pre_ordered_stock) {
                                //pre_ordered_stock.available_qte =0; 
                                pre_ordered_stock.available_qte = pre_ordered_stock.available_qte + (p.amount - p.initial_qte);
                                if (p.is_bulk_sell) {
                                    pre_ordered_stock.extra_units = pre_ordered_stock.extra_units + ((p.amount - p.initial_qte) % parseFloat(p.packing));
                                    pre_ordered_stock.pack = pre_ordered_stock.pack + (((p.amount - p.initial_qte) - parseFloat(((p.amount - p.initial_qte) % parseFloat(p.packing)))) / parseFloat(p.packing))
                                    if (parseFloat(pre_ordered_stock.extra_units) >= parseFloat(p.packing)) {
                                        let eu = parseFloat(pre_ordered_stock.extra_units) % parseFloat(p.packing)
                                        pre_ordered_stock.pack = pre_ordered_stock.pack + ((parseFloat(pre_ordered_stock.extra_units) - eu) / parseFloat(p.packing))
                                        pre_ordered_stock.extra_units = eu
                                    }
                                } else {
                                    pre_ordered_stock.extra_units = 0
                                    pre_ordered_stock.pack = pre_ordered_stock.pack + (p.amount - p.initial_qte)
                                }
                                pre_ordered_stock.total_qte = pre_ordered_stock.total_qte + (p.amount - p.initial_qte);
                                store.dispatch("updateStock", pre_ordered_stock);
                                console.log("pre_ordered_stock");
                                console.log(pre_ordered_stock);
                            } else {
                                console.log("ppppppppppppppppppppppppp");
                                console.log(p);
                                let stock = JSON.parse(JSON.stringify(stocks[0]));
                                let invoice = new Invoice();
                                stock.id = uuid();
                                stock.invoice_id = invoice.id;
                                stock.supplier_id = 1;
                                stock.is_pre_ordered = true;
                                stock.available_qte = (p.amount - p.initial_qte);
                                stock.total_qte = (p.amount - p.initial_qte);
                                stock.date = moment(new Date()).format()
                                if (p.is_bulk_sell) {
                                    stock.extra_units = (p.amount - p.initial_qte) % p.packing;
                                    stock.pack = ((p.amount - p.initial_qte) - parseFloat(stock.extra_units)) / p.packing
                                } else {
                                    stock.extra_units = 0
                                    stock.pack = p.amount - p.initial_qte
                                }

                                store.dispatch("addInvoice", invoice);
                                store.dispatch("addStock", stock);
                                pre_ordered_stock = stock;
                            }
                            if (stocks[0].available_qte == 0) {
                                stocks[0] = pre_ordered_stock;
                            } else {
                                stocks.push(pre_ordered_stock);
                            }
                        }
                        console.log("stocksssdsdsd");
                        console.log(stocks);
                        let qte_accumulated = 0;
                        _.forEach(stocks, stock => {
                            let clone = JSON.parse(JSON.stringify(stock));
                            while (qte_accumulated < p.amount) {
                                if (stock.available_qte >= p.amount - qte_accumulated) {
                                    clone.available_qte = p.amount - qte_accumulated;
                                    stock.available_qte =
                                        stock.available_qte - (p.amount - qte_accumulated);
                                    store.dispatch("updateStock", stock);
                                    console.log("saving stock1");
                                    console.log(stock);
                                    qte_accumulated = p.amount;

                                    order_stocks.push(clone);
                                } else {
                                    clone.available_qte = stock.available_qte;
                                    qte_accumulated = qte_accumulated + stock.available_qte;
                                    stock.available_qte = 0;
                                    console.log("saving stock2");
                                    console.log(stock);
                                    store.dispatch("updateStock", stock);

                                    order_stocks.push(clone);
                                    break;
                                }
                            }
                            store.dispatch("updateStock", stock);
                        });

                        delete p.initial_qte;
                        //delete p.amount;

                        return p;
                    });
                    console.log("order_stocks")
                    console.log(order_stocks)
                    let valid_store_credit_points = _.reduce(order_stocks, (result, s) => {
                        let num = s.store_credit_points ? s.store_credit_points : 0
                        return result + _.toNumber(num) * _.toNumber(s.available_qte);
                    }, 0);

                    let order = new Order(
                        this.customer_discount,
                        this.total,
                        this.total_net,
                        buy_total,
                        order_products,
                        order_stocks,
                        this.payments,
                        this.customer.id,
                        valid_store_credit_points
                    );
                     order.id = this.order.id; 
                    order.date = this.order.date;

                    console.log("order");
                    console.log(order);

                    store.dispatch("updateOrder", order);

                    this.products = _.map(this.products, p => {
                        delete p.initial_qte;
                        delete p.qte;
                        delete p.amount;
                        return p;
                    });

                    //update valid store credit 
                    let pointsCurrencyRate = store.getters.preferences.points_currency_rate ? _.toNumber(store.getters.preferences.points_currency_rate) : 100;
                    let store_credit_payment_total = _.reduce(this.payments, (result, p) => {
                           if(p.type=='store_credit'){
                            return result + parseFloat((p.amount * pointsCurrencyRate));
                        }
                    }, 0);

                    if (store_credit_payment_total > 0) {
                        _.forEach(store.getters.getCustomerOrders(this.customer.id, true), (order) => {
                            if (order.valid_store_credit_points > 0) {
                                if (order.valid_store_credit_points >= store_credit_payment_total) {
                                    order.valid_store_credit_points = _.toNumber(order.valid_store_credit_points) - _.toNumber(store_credit_payment_total);
                                    store_credit_payment_total = 0;
                                    store.dispatch("updateOrder", order);
                                    return false;
                                } else {
                                    store_credit_payment_total = _.toNumber(store_credit_payment_total) - _.toNumber(order.valid_store_credit_points);
                                    order.valid_store_credit_points = 0;
                                    store.dispatch("updateOrder", order);
                                }
                                console.log("updated order");
                                console.log(order);
                            }
                        });
                    }

                    
                    store.dispatch("products", this.products);
                    this.clear();

                    if (print) {
                        //print reciept
                    }
                });
            }
        },
        getProductAvailableQte(id) {
            let stocks = store.getters.getStocks(id);
            return _.reduce(
                stocks,
                function (sum, s) {
                    return sum + s.available_qte;
                },
                0
            );
        },
        getProductAvailableQte2(id) {
         
            return _.reduce(
                this.all_stocks,
                function (sum, s) {
                    return sum + s.available_qte;
                },
                0
            );
        },
        getStocks(id) {
            let stocks = this.all_stocks.filter(
                s => s.product_id == id && s.available_qte > 0
            );
            if (stocks.length > 0) {
                return JSON.parse(JSON.stringify(stocks));
            } else {
                //getting the last stock
                return JSON.parse(JSON.stringify([_.last(this.all_stocks.filter(s => s.product_id == id))]));
                // return [];
            }
        },
        scrollHor(event) {
            $(".flex-container").scrollLeft(
                event.deltaY + $(".flex-container").scrollLeft()
            );
        },
        addCustomer() {
            this.$router.push("/new-customer");
        },

        selectCustomer(id) {
            console.log("id");
            console.log(id);

            this.customer = _.find(this.customers, {
                id: id
            })
            this.is_customer_selected = true;
            this.refreshTotals();
        },
        updateProductList(product_id, _amount, init_amount = false, type = 'unit') {

            let amount = _amount;
            let is_amount_enough = true;
            //update selected products
            let vproduct = _.find(this.products, {
                id: product_id
            });
            if (type == 'pack') amount = parseFloat(vproduct.packing);
            if ((init_amount && vproduct.initial_qte < amount) || (!init_amount && vproduct.initial_qte - vproduct.amount < amount)) is_amount_enough = false;
            console.log("vproduct");
            console.log(vproduct);
            let add_stock_response = true;
            if (is_amount_enough) {
                this.updateSelectedProducts(product_id, amount, init_amount, type);
                this.updateProductListAndSetMidPrices(product_id, amount, init_amount, is_amount_enough)
            } else {
                return swal({
                    title: this.$t("no_stock_available"),
                    text: "do you wanna add this amount to the stock",
                    icon: "warning",
                    buttons: [this.$t("no"), this.$t("yes")],
                    dangerMode: false
                }).then(ok => {
                    if (ok) {
                        this.updateSelectedProducts(product_id, amount, init_amount, type);

                        this.updateProductListAndSetMidPrices(product_id, amount, init_amount, is_amount_enough);
                    }

                });
            }

        },
        updateProductListAndSetMidPrices(product_id, amount, init_amount, is_amount_enough) {
            let product = _.find(this.selectedProducts, {
                id: product_id
            });
            let qte = 0;
            let mid_price = 0;
            let buy_mid_price = 0;
            let mid_discount = 0;
            let total_temp = 0;
            let buy_total_temp = 0;
            let discount_temp = 0;
            let stock_index = 0;
            let stocks = this.getStocks(product_id);
            if (!is_amount_enough) {
                if (stocks[0].available_qte == 0) {

                    stocks[0].available_qte = amount

                } else {
                    let tstock = _.last(stocks)
                    tstock.available_qte = tstock.available_qte + (amount - product.initial_qte);
                    stocks.push(tstock);
                }
            }
            while (qte < amount) {
                if (stocks[stock_index].available_qte >= amount - qte) {
                    stocks[stock_index].available_qte = stocks[stock_index].available_qte - (amount - qte);
                    total_temp = total_temp + stocks[stock_index].sell_price * (amount - qte);
                    buy_total_temp = buy_total_temp + stocks[stock_index].buy_price * (amount - qte);
                    discount_temp = discount_temp + (stocks[stock_index].discount / 100) * (stocks[stock_index].sell_price * (amount - qte));
                    qte = amount;
                } else {
                    total_temp = total_temp + stocks[stock_index].sell_price * stocks[stock_index].available_qte;
                    buy_total_temp = buy_total_temp + stocks[stock_index].buy_price * stocks[stock_index].available_qte;
                    discount_temp = discount_temp + (stocks[stock_index].discount / 100) * (stocks[stock_index].sell_price * stocks[stock_index].available_qte);
                    qte = qte + stocks[stock_index].available_qte;
                    stocks[stock_index].available_qte = 0;
                }
                stock_index++;
            }
            if (!product) {
                product = _.find(this.products, {
                    id: product_id
                });
            }
            if (amount == 0) {
                //reset to inital price
                var fstock = this.getStocks(product_id)[0];
                product.sell_price = fstock ? parseFloat(fstock.sell_price) : 0;
                product.discount = fstock ? parseFloat(fstock.discount) : 0;
            } else {
                mid_price = parseFloat((total_temp / amount).toFixed(2));
                buy_mid_price = parseFloat((buy_total_temp / amount).toFixed(2));
                mid_discount = (discount_temp * 100) / total_temp;
                product.sell_price = mid_price;
                product.buy_price = buy_mid_price;
                product.discount = mid_discount;
            }

            //update stock
            this.products = _.map(this.products, p => {
                if (p.id == product_id) {
                    if (init_amount) {
                        p.qte = p.initial_qte - amount;
                        p.amount = amount;
                    } else {
                        p.qte = p.initial_qte - (p.amount + amount);
                        p.amount = p.amount + amount;
                    }
                }
                return p;
            });

            this.filterProducts();
            this.getPopularProducts();

            //calculating totals 
            this.refreshTotals();
        },
        updateSelectedProducts(product_id, amount, init_amount = false, type = 'unit') {
            let product = _.find(this.selectedProducts, {
                id: product_id
            });
            if (product) {

                if (type == 'pack') {
                    amount = parseFloat(product.packing);
                }
                //update qte
                if (init_amount) {
                    product.amount = amount;
                } else {
                    if (product.amount == 0 && amount < 0) {

                    } else {
                        product.amount = product.amount + amount;
                    }
                }
                if (product.amount == 0) {
                    _.remove(this.selectedProducts, {
                        id: product_id
                    });
                }
                //
            } else {
                //add product
                product = _.find(this.products, {
                    id: product_id
                });
                if (type == 'pack') {
                    amount = parseFloat(product.packing);
                }
                let prod = JSON.parse(JSON.stringify(product));
                prod.amount = amount;
                this.selectedProducts.push(prod);
            }
        },
        refreshTotals() {
            this.total = 0;
            this.discount = 0;
            _.forEach(this.selectedProducts, p => {
                this.total = this.total + p.amount * p.sell_price;
                this.discount = this.discount + (p.discount / 100) * (p.amount * p.sell_price);
            });
            this.total_net = this.total - this.discount;
            if (this.customer) {
                this.customer_discount = (
                    (this.customer.discount / 100) *
                    this.total_net
                ).toFixed(2);
                this.total_net = this.total_net - this.customer_discount;
            }
            this.total = this.total.toFixed(2);
            this.total_net = parseFloat(this.total_net.toFixed(2));
            this.discount = this.discount.toFixed(2);

            console.log("this.total_net");
            console.log(this.total_net);
            if(this.od)this.od.update(this.total_net);
            let digitAfter4 =(new String(this.total_net)).length > 5 ? ((new String(this.total_net)).length - 5) * 10 : 0;
            $(".odometer-inside").css("font-size", `calc(6vw - ${digitAfter4}px)`);

            //updating
            this.total_payments = 0;
            _.forEach(this.payments, p => {
                this.total_payments = this.total_payments + p.amount;
            });
            this.balance_due = this.total_net - this.total_payments;
        },
        clear() {
            this.products = _.map(this.products, p => {
                p.amount = 0;
                var fstock = this.getStocks(p.id)[0];
                p.initial_qte = this.getProductAvailableQte(p.id);

                p.sell_price = fstock ? parseFloat(fstock.sell_price) : 0;
                p.discount = fstock ? parseFloat(fstock.discount) : 0;

                return p;
            });
            this.initOrder();

        },

       cancelOrder() {
            swal({
                title: this.$t("do_you_wanna_cancel_order"),
                text: "",
                icon: "warning",
                buttons: [this.$t("no"), this.$t("yes")],
                dangerMode: false
            }).then(cancel => {
                if (cancel) {
                    _.forEach(this.order.stocks, (s) => {
                        let stock = store.getters.getStock(s.id, true);
                        stock.available_qte = stock.available_qte + s.available_qte;
                        store.dispatch("updateStock", stock);
                    });
                    store.dispatch('deleteOrder', this.order.id);
                    this.goBack();
                }
            });
            //return all stocks

        },
        initOrder() {
            this.customer = this.customers[0];
            this.selectCustomer(this.customer.id);
            this.payments = [];
            if(this.od)this.od.render(0);
            //this.od.update(0);
            this.selectedProducts = [];
            this.total_net = 0;
            this.total = 0;
            this.discount = 0;
        },
        goBack() {
            this.$eventBus.$off("barcode");
            this.$router.go(-1);
            this.$destroy();
        },

        validEmail: function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
        getCustomerStoreCreditBalance(customer) {
            console.log("sdkjdhsjkdqskdjsqk");
            console.log(store.getters.getCustomerOrders(customer.id, true));
            let customer_valid_points = _.reduce(store.getters.getCustomerOrders(customer.id, true), (result, order) => {
                return result + _.toNumber(order.valid_store_credit_points);
            }, 0)
            console.log("customer_valid_points");
            console.log(customer_valid_points);

            let pointsCurrencyRate = store.getters.preferences.points_currency_rate ? store.getters.preferences.points_currency_rate : 100;
            return parseFloat((customer_valid_points / pointsCurrencyRate).toFixed(2));
        },
        getCustomerStoreCreditPoints(customer) {
            return _.reduce(store.getters.getCustomerOrders(customer.id, true), (result, order) => {
                return result + order.valid_store_credit_points;
            }, 0)
        }
    },
    mounted() {
        var el = document.querySelector(".total");

        this.od = new Odometer({
            el: el,
            value: this.total_net,
            format: "(,ddd).dd",
            duration: 250
            // Any option (other than auto and selector) can be passed in here
            // format: "",
            // theme: "digital"
        });
        if (this.$i18n.locale == "ar") {
            $(".total").prepend(
                "<span class='total_currency'>" +
                this.$t(this.currency.toLowerCase()) +
                "</span>"
            );
        } else {
            $(".total").append(
                "<span class='total_currency'>" +
                this.$t(this.currency.toLowerCase()) +
                "</span>"
            );
        }

           _.forEach(this.order.products, p => {
            this.updateProductList(p.id, p.amount)
        });
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="scss" scoped>
.w-100 {
    width: 100%;
}

.w-50 {
    width: 50%;
}

.h-100 {
    height: 100% !important;
}

.h-96 {
    height: 96% !important;
}

.w-96 {
    width: 96% !important;
}

.p-10 {
    padding: 10px;
}

.p-5 {
    padding: 5px;
}

.wrapper::-webkit-scrollbar {
    width: 0em;
}

.wrapper {
    font-size: 15px;
    padding-bottom: 15px;
}

.main-panel {
    /*   border: 10px solid white;
    border-radius: 25px;*/
    padding: 9px;
    height: 100%;
    width: 100% !important;
}

.btnC {
    display: block;
    height: 30px;
    width: 30px;
    border-radius: 50%;
    border: 0px solid red !important;
    border-width: 0px !important;
}

.card {
    background-color: inherit;
    box-shadow: none;
}

.pagination {
    margin: 0px;
}

.list-unstyled>li {
    margin: 10px !important;
    padding: 10px !important;
    background-color: rgba(248, 248, 248, 0.58);
    width: 200px;
}

.flex-container {
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    flex-flow: row;
    width: 100%;
    overflow-x: auto;
    /*flex-wrap:wrap;*/
}

.box {
    flex: 1;
    -webkit-flex: 1;
    min-width: 300px;
    max-width: 320px;
    height: 80px;
}

.vertical-center {
    display: flex;
    align-items: center;
}

.flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
}

.selected_btn {
    background-color: #ffe681 !important;
    color: white !important;
}

.search[type="text"] {
    width: 450px;
    -webkit-transition: width 0.4s ease-in-out;
    transition: width 0.4s ease-in-out;
}

/* When the input field gets focus, change its width to 100% */

/* input[type="text"]:focus {
  width: 100%;
} */

.search {
    height: 40px;
    text-align: start;
    font-size: 17px;
    font-family: inherit;
    padding-left: 10px;
}

.total {
    display: flex;
    justify-content: center;
    /* background-image: radial-gradient(rgba(139, 245, 165, 0.4), #000000);
    background-color: #000;
    font-family: 'Segoe UI' !important;
    padding: 0 0.2em;
    line-height: 1.1em;
    color: #ffe681; */
    /* background-color: #4f4949;
  color: #ffe681; */
    color: #ffe681;
    font-size: 4.5vw;
    border-radius: 10px;
    padding: 14px;
    width: 100%;
    font-family: inherit;
}

.list {
    padding: 20px;
}

.product {
    background-color: blue;
    height: 150px;
    margin: 5px;
}

.pay {
    margin-top: 10px;
}

.row {
    margin-right: 0px;
    margin-left: 0px;
}

*::-webkit-scrollbar {
    height: 8px;
    width: 15px;
}

*::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(65, 65, 65, 0.5);
    -webkit-box-shadow: inset 0 0 6px rgba(65, 65, 65, 0.5);
    border-radius: 5px;
}

.toggle,
.toggler {
    display: inline-block;
    vertical-align: middle;
    margin: 10px;
}

.toggler {
    color: slategray;
    transition: 0.2s;
}

.toggler--is-active {
    color: black;
}

.b {
    display: block;
}

.toggle {
    width: 100px;
    height: 60px;
    border-radius: 100px;
    background-color: #2ecc71;
    overflow: hidden;
    box-shadow: inset 0 0 2px 1px rgba(0, 0, 0, 0.05);
}

.inlineFilter {
    color: #707070;
}

th {
    padding: 10px;
}

thead {
    background: #f5f5f5;
}

.inner-addon {
    position: relative;
}

/* style icon */

.inner-addon .glyphicon {
    position: absolute;
    padding: 10px;
    pointer-events: none;
}

/* align icon */

.left-addon .glyphicon {
    left: 0px;
}

.right-addon .glyphicon {
    right: 0px;
}

/* add padding  */

.left-addon input {
    padding-left: 30px;
}

.right-addon input {
    padding-right: 30px;
}

.iconHolder {
    position: relative;
}

.iconBan {
    position: absolute;
    top: 0px;
    left: 0px;
    color: rgba(217, 83, 79, 0.7);
}

.mdi-58px {
    font-size: 88px;
}

.selected {
    background-color: rgb(236, 236, 236);
}

/* .search {
  height: 50px;
  font-size: 20px;
  font-family: inherit;
  padding-left: 10px;
  margin-top: 7px;
} */

.pl10 {
    padding-left: 10px;
}

.pr10 {
    padding-right: 10px;
}

.pl20 {
    padding-left: 20px;
}

.pr20 {
    padding-right: 20px;
}

.bill {
    cursor: pointer;
    width: 60px;
    height: 50px;
    background: #eaeaea;
    color: #76766d;
    display: flex;
    margin: 5px;
    justify-content: center;
    font-size: 18px;
    align-items: center;
}

.payment {
    * {
        -webkit-transition: all 0.2s ease-in-out;
        transition: all 0.2s ease-in-out;
    }

    span {
        border-radius: 2px;
        padding: 5px !important;
        padding: 3px;
        cursor: pointer;
        opacity: 0.3;
    }
}

.payment:hover {
    span {
        // -webkit-box-shadow: 1px -2px 5px 0px rgba(0, 0, 0, 0.05);
        // -moz-box-shadow: 1px -2px 5px 0px rgba(0, 0, 0, 0.05);
        // box-shadow: 1px -2px 5px 0px rgba(0, 0, 0, 0.05);
        opacity: 1;
    }
}

.border-left {
    border-left: 1px solid #ebebeb;
}

.border-right {
    border-right: 1px solid #ebebeb;
}

.flex-center {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.payments-box {
    font-size: small;
    background-color: #f5f5f5;
    border-radius: 5px;
    padding: 10px;
    max-height: 140px;
    height: 140px;
    overflow-y: auto;
}

.payments-method-box {
    height: calc(40vh - 35px);
    padding: 0px;
    overflow-y: auto;
    overflow-x: auto;

    background: #f4f4f4;
}

.bills-box {
    display: flex;
    flex-wrap: wrap;
    padding-left: 10px;
    height: calc(40vh - 135px);
    overflow-y: auto;

}
</style>
