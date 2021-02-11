<template>
<div class="wrapper">
    <div class="main-panel" :style="{'float':$i18n.locale=='ar' ? 'left':'right'}">
        <nav class="navbar navbar-default">
            <div class="nav-container">
                <div class="navbar-header" style="display: inline-flex;">
                    <a class="navbar-brand">{{$t("new_product")}}</a>
                </div>
                <ul class="nav navbar-nav navbar-right" style="margin-right: 0px">
                    <li>
                        <a class="btn btn-danger btn-circle" @click="goBack">
                            <i class="ti-close"></i>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
        <div class="content" style=";padding: 15px">
            <div class="container-fluid" style=";width:80%">
                <div class="tab-content" style="width:100%">
                    <div class="card">
                        <ErrorPanel :errors="errors" />
                        <div class="content" style="padding: 0px">
                            <div class="row">
                                <div class="col-md-6" style="-webkit-border-end: 1px solid #d2c6c6;">
                                    <div class="row">
                                        <div class="text-center col-md-12 col-sm-12">
                                            <div class="form-group">
                                                <Avatar image="static/assets/img/faces/product.png" :width="300" :height="300" :crop="true" :removeable="true" @dataURL="processDataUrl" />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-12 col-sm-12 " style="min-width:300px">
                                        <div class="form-group">
                                            <label>{{ $t("name") }}</label>
                                            <input type="text" ref="name" class="form-control border-input" v-model="product.name" :placeholder="$t('product_name')" value>
                                        </div>

                                        <label>{{$t("category")}}</label>
                                        <div class>
                                            <select class="form-control border-input" v-model="product.category" value="other" style="padding:9px;height: 50px;">
                                                <option v-for="c in categories" :key="c" :value="c">{{$t(c)}}</option>

                                            </select>

                                        </div>
                                        <label>{{$t("unit")}}</label>
                                        <div class>
                                            <select class="form-control border-input" v-model="product.unit" value="piece" style="padding:3px;height: 50px;">
                                                <option v-for="u in units" :key="u" :value="u">{{$t(u)}}</option>
                                            </select>

                                        </div>
                                        <hr>
                                        <label style="font-size:18px;"><b>{{$t("notifications")}}</b></label>
                                        <div class="form-group">
                                            <label>{{ $t("days_count_before_exp_date") }}</label>
                                            <div class="input-group">
                                                <input oninput="validity.valid||(value='0');" dir="ltr" min="1" step="1" type="number" class="form-control border-input" v-model="product.exp_date_pre_alert" :placeholder="$t('days_count_before_exp_date')">
                                                <span class="input-group-addon">{{$t('day')}}</span>
                                            </div>
                                        </div>
                                       

                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="row">
                                        <div class="col-md-12">
                                             <div class="form-group">
                                            <label>{{ $t("units_count_before_stock_end") }}</label>
                                            <div class="input-group">
                                                <input oninput="validity.valid||(value='0');" dir="ltr" min="1" step="1" type="number" class="form-control border-input" v-model="product.stock_pre_alert" :placeholder="$t('units_count_before_stock_end')">
                                                <transition name="slide-fade-fast" mode="out-in">
                                                    <span v-if="product.unit=='piece'" key="piece" class="input-group-addon">{{$t('piece')}}</span>
                                                    <span v-else key="weight" class="input-group-addon">{{$t(product.unit.toLowerCase())}}</span>
                                                </transition>
                                            </div>
                                        </div>
                                        <hr>
                                            <label>{{ $t("barcode") }}</label>
                                            <div class="form-inline" style="display:flex">
                                                <input type="text" style="flex-grow:1" class="form-control border-input" v-model="product.barcode" :placeholder="$t('barcode')" value>
                                                <select v-model="product.barcode_format" class="form-control" style="background-color:#ffe681">
                                                    <option value="EAN13">EAN13</option>
                                                    <option value="EAN8">EAN8</option>
                                                    <option value="EAN5">EAN5</option>
                                                    <option value="EAN2">EAN2</option>
                                                    <option value="UPC">UPC</option>
                                                    <option value="CODE39">CODE39</option>
                                                    <option value="CODE128">CODE128</option>
                                                    <option value="pharmacode">pharmacode</option>
                                                    <option value="codabar">codabar</option>
                                                </select>
                                                <button :style="$i18n.locale=='ar' ? 'border-right:0px':'border-left:0px'" style="border-radius: 0px;" @click="save" :disabled="!isBarCodeAvailable" class="btn">{{$t("save")}}</button>
                                            </div>

                                            <div id="barcode" class="text-center">
                                                <barcode :value="product.barcode" :options="{ displayValue: true,format:product.barcode_format }" tag="img"></barcode>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-12">
                                            <label>{{ $t("pack_sale") }}</label>
                                            <label class="switch">
                                                <input type="checkbox" v-model="product.is_bulk_sell" :checked="product.is_bulk_sell" />
                                                <span class="slider round"></span>
                                            </label>
                                        </div>

                                    </div>
                                    <div v-if="product.is_bulk_sell" class="row">
                                        <div class="col-md-12">
                                            <div class="form-group">

                                                <label>{{ product.unit=='piece' ? $t("units_count_in_one_bulk"):$t("pack_weight") }}</label>
                                                <div class="input-group">
                                                    <input @keyup="packChanged()" v-if="product.unit=='piece'" dir="ltr" min="2" step="1" type="number" ref="bulk_qte" class="form-control border-input" v-model="product.packing" :placeholder="$t('qte')">
                                                    <input @keyup="packChanged()" v-else dir="ltr" min="0.02" step="0.01" type="number" ref="bulk_w" class="form-control border-input" v-model="product.packing" :placeholder="$t('weight')">

                                                    <transition name="slide-fade-fast" mode="out-in">
                                                        <span v-if="product.unit=='piece'" key="piece" class="input-group-addon">{{$t('piece')}}</span>
                                                        <span v-else key="weight" class="input-group-addon">{{$t(product.unit.toLowerCase())}}</span>
                                                    </transition>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div v-if="product.is_bulk_sell" class="row">
                                        <div class="col-md-12">
                                            <label>{{ $t("bulk_barcode") }}</label>
                                            <div class="form-inline" style="display:flex">
                                                <input type="text" style="flex-grow:1" class="form-control border-input" v-model="product.pack_barcode" :placeholder="$t('bulk_barcode')" value>
                                                <select v-model="product.pack_barcode_format" class="form-control" style="background-color:#ffe681">
                                                    <option value="EAN13">EAN13</option>
                                                    <option value="EAN8">EAN8</option>
                                                    <option value="EAN5">EAN5</option>
                                                    <option value="EAN2">EAN2</option>
                                                    <option value="UPC">UPC</option>
                                                    <option value="CODE39">CODE39</option>
                                                    <option value="CODE128">CODE128</option>
                                                    <option value="pharmacode">pharmacode</option>
                                                    <option value="codabar">codabar</option>
                                                </select>
                                                <button :style="$i18n.locale=='ar' ? 'border-right:0px':'border-left:0px'" style="border-radius: 0px;" @click="save" :disabled="!isBulkBarCodeAvailable" class="btn">{{$t("save")}}</button>
                                            </div>

                                            <div id="pack_barcode" class="text-center">
                                                <barcode :value="product.pack_barcode" :options="{ displayValue: true,format:pack_barcode_format }" tag="img"></barcode>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row" style="">
                                <div :class="$i18n.locale=='ar'?'text-left':'text-right'">
                                    <button @click="add" type="submit" class="btn btn-lg">{{$t("add")}}</button>
                                </div>
                                <div class="clearfix"></div>
                            </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import swal from "sweetalert";
import Quantity from "./sub_components/Quantity.vue";
import {
    Product
} from "./models.js";
import Avatar from "./sub_components/Avatar.vue";
const {
    dialog
} = require("electron").remote;
const nativeImage = require("electron").nativeImage;
const {
    app
} = require("electron").remote;
const fs = require("fs-extra");

export default {
    name: "NewProduct",
    components: {
        Quantity,
        Avatar
    },
    created: function () {
        this.products = JSON.parse(JSON.stringify(store.getters.products));
        this.currency = JSON.parse(JSON.stringify(store.getters.user.currency));
        this.categories = JSON.parse(JSON.stringify(store.getters.categories));
        this.units = JSON.parse(JSON.stringify(store.getters.units));
        let bcode = this.$route.query.barcode ? this.$route.query.barcode : "";
        this.product = new Product("", "piece", "other", "", bcode);

        console.log(this.product);
    },
    data: function () {
        return {
            barcode_format: "EAN13",
            pack_barcode_format: "EAN13",
            categories: [],
            units: [],
            isBarCodeAvailable: false,
            isBulkBarCodeAvailable: false,
            hidePassword: true,
            errors: [],
            products: [],
            product: {},
            currency: null
        };
    },
    mounted() {

        setTimeout(() => {
            this.$refs.name.focus()
        }, 500);
    },
    activated() {
        let bcode = this.$route.query.barcode ? this.$route.query.barcode : "";
        this.product = new Product("", "piece", "other", "", bcode);
        setTimeout(() => {
            this.$refs.name.focus()
        }, 500);
    },
    watch: {
        "product.unit"() {
            this.packChanged();
        },
        "product.barcode"() {
            this.barChanged("#barcode");
        },

        "product.pack_barcode"() {
            this.barChanged("#pack_barcode");
        },
        barcode_format() {
            setTimeout(() => {
                this.barChanged("#barcode");
            }, 1000);
        },
        pack_barcode_format() {
            setTimeout(() => {
                this.barChanged("#pack_barcode");
            }, 1000);
        }
    },
    methods: {
        packChanged() {
            console.log("changed");
            _.debounce(() => {
                if (this.product.unit == 'piece') {
                    if (!this.$refs.bulk_qte.validity.valid) {
                        this.$refs.bulk_qte.value = 2;
                    } else {
                        if (_.isNumber(this.product.packing)) {
                            this.$refs.bulk_qte.value = parseInt(this.product.packing);
                        }
                    }
                } else {
                    if (!this.$refs['bulk_w'].validity.valid) {
                        this.$refs['bulk_w'].value = 0.02;
                    }
                }

            }, 500)();
        },
        removeCategory() {
            if (this.product.category != "" && this.product.category != "Other") {
                store.dispatch("removeCategory", this.product.category);
                _.remove(this.categories, c => {
                    return c == this.product.category;
                });
            }
        },
        addCategory() {
            swal({
                content: {
                    element: "input",
                    attributes: {
                        placeholder: "Category name",
                        type: "text"
                    }
                },
                button: {
                    text: "Add",
                    visible: true,
                    className: "btn btn-default",
                    closeModal: true
                }
            }).then(value => {
                if (value) {
                    store.dispatch("addCategory", value);
                    this.categories.push(value);
                }
            });
        },

        removeUnit() {
            if (this.product.unit != "" && this.product.unit != "piece") {
                store.dispatch("removeUnit", this.product.unit);
                _.remove(this.units, c => {
                    return c == this.product.unit;
                });

                this.product.unit = "piece";
            }
        },
        addUnit() {
            swal({
                content: {
                    element: "input",
                    attributes: {
                        placeholder: "Unit name",
                        type: "text"
                    }
                },
                button: {
                    text: "Search!",
                    closeModal: false
                },
                button: {
                    text: "Add",
                    visible: true,
                    className: "btn btn-default",
                    closeModal: true
                }
            }).then(value => {
                console.log(value);
                if (value) {
                    store.dispatch("addUnit", value);
                    this.units.push(value);
                    this.product.unit = value;
                }
            });
        },
        barChanged(barcode) {
            let src = $($(barcode).children()[0]).attr("src");
            if (src == undefined || src == "") {
                if (barcode == "#barcode") {
                    this.isBarCodeAvailable = false;
                } else {
                    this.isBulkBarCodeAvailable = false;
                }

            } else {
                if (barcode == "#barcode") {
                    this.isBarCodeAvailable = true;
                } else {
                    this.isBulkBarCodeAvailable = true;
                }
            }
        },

        save(barcode) {
            let src = $($(barcode).children()[0]).attr("src");
            let path = dialog.showOpenDialog({
                properties: ["openDirectory"]
            });
            if (path) {
                fs.writeFile(
                    path + "\\" + this.product.barcode + ".png",
                    Buffer.from(src.substring(src.indexOf(",") + 1), "base64"),
                    err => {
                        if (err) throw err;

                        console.log("The file was succesfully saved!");
                    }
                );
            }
        },
        productNameExists(product) {
            var found = false;
            this.products = _.forEach(this.products, p => {
                if (p.name == product.name && p.id != product.id) {
                    found = true;
                }
            });
            return found;
        },
        removeImage() {
            this.product.image = null;
        },
        processDataUrl(data) {
            let reg = /\/\w+\;/;
            let ext = reg
                .exec(data.substring(0, data.indexOf(",") + 1))[0]
                .replace(";", "")
                .replace("/", "");
            let newpath =
                app.getAppPath().replace("app.asar", "images\\products\\") +
                Math.random()
                .toString()
                .substring(2) +
                "." +
                ext;
            fs.ensureFileSync(newpath);
            fs.writeFile(
                newpath,
                Buffer.from(data.substring(data.indexOf(",") + 1), "base64"),
                err => {
                    if (err) throw err;

                    console.log("The file was succesfully saved!");
                }
            );
            this.product.image = newpath;
        },
        goBack() {
            this.$router.go(-1);
        },
        add: function (e) {
            e.preventDefault();
            this.errors = [];

            if (!this.product.name) {
                this.errors.push(this.$t("name_required"));
            } else {
                if (this.productNameExists(this.product)) {
                    this.errors.push(this.$t("name_used"));
                }
            }
            if (!this.product.is_bulk_sell) {
                this.product.packing = 1;
            }
            if (this.errors.length == 0) {
                store.dispatch("addProduct", this.product);
                this.goBack();
                this.$destroy();
                return true;
            } else {
                return true;
            }
        },
        validEmail: function (email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
        getNextIndex: products => {
            let dat = new Date();
            let index = dat.getYear();
        }
    }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.w-100 {
    width: 100%;
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

/* 
.wrapper::-webkit-scrollbar {
  width: 0em;
} */

.wrapper {
    padding-bottom: 15px;
    top: 30px !important;
}

.main-panel {
    /*   border: 10px solid white;
    border-radius: 25px;*/
    /* padding: 9px; */
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
    background-color: white;
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
    overflow-x: scroll;

    /*flex-wrap:wrap;*/
}

.box {
    flex: 1;
    -webkit-flex: 1;
    min-width: 200px;
    height: 80px;
}

.vertical-center {
    display: flex;
    align-items: center;
}

.selected_btn {
    background-color: #ffe681 !important;
    color: white !important;
}

.mdi-80px {
    font-size: 80px;
}

::-webkit-scrollbar {
    height: 8px !important;
    width: 10px !important;
}

::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2) !important;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2) !important;
    border-radius: 5px !important;
}

::-webkit-scrollbar-thumb {
    background-color: #ffd700 !important;
    outline: 1px solid #ffd700 !important;
    border-radius: 5px !important;
}
</style>
