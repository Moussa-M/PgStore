<template>
<div @keyup.enter.stop="enterPressed($event)" tabindex="0" id="panelChoose" class="wrapper hiddenFocus">
    <div class="main-panel" :style="{'float':$i18n.locale=='ar' ? 'left':'right'}">
        <nav class="navbar navbar-default">
            <div class="nav-container">
                <div class="navbar-header" style="display: inline-flex;">
                    <a class="navbar-brand">{{ $route.query.is_supplier ? $t("choose_supplier"):$t("choose_customer")}}</a>
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
        <div class="content" style="height:90vh;padding: 15px">
            <div class="container-fluid" style=";width:60%">
                <div class="tab-content">
                    <div class="card">
                        <div class="content" style="padding: 0px">
                            <div class="row">
                                <div class="col-md-12">
                                    <input type="text" v-model="searchText" class="search" name="search" :placeholder="$t('filter_by_name_or_phone')">
                                </div>
                            </div>

                            <ul @wheel="scrollHor" class="list-unstyled list-inline team-members flex-container">
                                <li v-for="customer in filteredCustomers" class="card box" :key="customer.id">
                                    <CustomerCard :customer="customer" :key="customer.id" v-on:enterPressed="goBack" v-on:selectCustomer="selectCustomer(customer.id)" :isSelected="isCustomerSelected[customer.id]" />
                                </li>
                                <li style="border:1px solid #F1EAE0" class="card box vertical-center">
                                    <div class="w-100">
                                        <div class="col-xs-12 text-center">
                                            <button @click="addCustomer" class="btn btn-success btn-icon">
                                                <i class="ti-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="row" style="margin-left: 0px;margin-right: 0px;">
                        <div :class="$i18n.locale=='ar'?'text-left':'text-right'">
                            <button :disabled="!customer" @click="goBack" type="submit" class="btn btn-lg">{{$t("done")}}</button>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import swal from "sweetalert";
import CustomerCard from "./sub_components/CustomerCard.vue";
import Avatar from "./sub_components/Avatar.vue";

export default {
    name: "choose-customer-panel",
    data: function () {
        return {
            isCustomerSelected: {},
            customers: [],
            filteredCustomers: [],
            searchText: "",
            customer: null
        };
    },
    components: {
        CustomerCard,
        Avatar
    },

    created() {
        this.customers = JSON.parse(JSON.stringify(store.getters.customers));
        this.filterCustomers();
    },

    methods: {
        scrollHor(event) {
            $(".flex-container").scrollLeft(
                event.deltaY + $(".flex-container").scrollLeft()
            );
        },
        enterPressed() {

            if (this.customer) {
                this.goBack();
            }
        },
        selectCustomer(id) {
            this.customers = _.map(this.customers, c => {
                if (c.id == id) {
                    c.selected = true;
                    this.isCustomerSelected[c.id] = true;
                    this.customer = c;
                    store.commit('panel_choosed_customer', this.customer)
                } else {
                    c.selected = false;
                    this.isCustomerSelected[c.id] = false;
                }
                return c;
            });
            this.is_customer_selected = true;
            this.isCustomerSelected = Object.assign({},
                this.isCustomerSelected,
                this.isCustomerSelected
            );
        },
        addCustomer() {
          console.log("this.$route.query.is_supplier");
          console.log(this.$route.query.is_supplier);
            this.$router.push({path:"/new-customer",query:{"is_supplier":this.$route.query.is_supplier?true:false}});
        },
        goBack() {
            this.$router.go(-1);
            this.$destroy();
        },
        filterCustomers() {
            this.filteredCustomers = _.filter(this.customers, c => {
                if (this.searchText.trim() == "") {
                    return true;
                } else {
                    if (
                        c.name.toLowerCase().search(this.searchText.trim().toLowerCase()) !=
                        -1 ||
                        c.phone.search(this.searchText.trim()) != -1
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                }
            });
        }
    },
    activated() {
        let initial_customer_length = this.customers.length;
        this.customers = JSON.parse(JSON.stringify(store.getters.customers));
        this.filterCustomers();
        if (initial_customer_length < this.customers.length) {
            this.selectCustomer(_.last(this.customers).id);
        } else {
            if (this.customer) {
                this.selectCustomer(customer.id);
            }
        }

    },
    watch: {
        searchText() {
            setTimeout(() => {
                this.filterCustomers();
            }, 250);
        }
    }
};
</script>

<style lang="scss" scoped>
.w-100 {
    width: 100%;
}

.pl-15 {
    padding-left: 15px;
}

.pr-15 {
    padding-right: 15px;
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

/* .wrapper::-webkit-scrollbar {
  width: 0em;
} */

.wrapper {
    padding-bottom: 15px;
}

.main-panel {
    /*   border: 10px solid white;
    border-radius: 25px;*/
    // padding: 9px;
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
    flex-wrap: wrap;
    align-content: flex-start;
    width: 100%;
    height: 500px;
    overflow-y: auto;

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

.selected_btn {
    background-color: #ffe681 !important;
    color: white !important;
}

.search {
    width: 100%;
    height: 50px;
    font-size: 17px;
    font-family: inherit;
    padding-left: 10px;
    margin: 10px;
}
</style>
