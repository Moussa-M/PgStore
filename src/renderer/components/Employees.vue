<template>
  <div class="main-panel" :style="{'float':$i18n.locale=='ar' ? 'left':'right'}">
    <nav class="navbar navbar-default">
      <div class="nav-container">
        <div class="navbar-header" style="width:20%;display: inline-flex;">
          <button type="button" class="navbar-toggle">
            <span class="sr-only">{{ $t("toggle_nav") }}</span>
            <span class="icon-bar bar1"></span>
            <span class="icon-bar bar2"></span>
            <span class="icon-bar bar3"></span>
          </button>
          <a tabindex="-1" class="navbar-brand" >{{ $t("employees") }}</a>
        </div>
        <ul  :class="$i18n.locale=='ar'?'text-left':'text-right'" class="nav navbar-nav " style="width:100%">
          <li style="width:100%">
            <input
              type="text"
              v-model="searchText"
              class="text-center search"
              name="search"
              ref="search" id="search"
              :placeholder="$t('filter_by_name_or_phone')"
            >
              <span :class="$i18n.locale=='ar'?'icon-left':'icon-right'" >
                <font-awesome-icon @click="$refs.search.focus()" class="inlineFilter" color="gray" icon="search"/>
              </span>
          </li>
        </ul>
        <ul class="nav navbar-nav navbar-right" style="margin-right: 0px">
          <li>
            <a tabindex="0" class="btn btn-circle" @click="addEmployee">
              <i class="ti-plus"></i>
            </a>
          </li>
        </ul>
      </div>
    </nav>
    <div class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="card">
            <!-- <div class="header">
                            <div class="row">
                                <div class="col-md-6">
                                    <h4 class="title" >List of employees</h4>
                                </div>
                              
                            </div>
            </div>-->
            <div
             
              class="content table-responsive table-full-width"
            >
              <table class="table table-hover">
                <thead>
                  <th width="4%">{{ $t("id") }}</th>
                  <th
                    :class="$i18n.locale=='ar'?'text-right':'text-left'"
                    width="25%"
                  >{{ $t("name") }}</th>
                  <th class="text-center">{{ $t("shift_start_at") }}</th>
                  <th class="text-center">{{ $t("shift_end_at") }} </th>
                  <th class="text-center">{{ $t("joined_date") }}</th>
                  <th class="text-center">{{ $t("orders_count") }}</th>
                  <th :class="$i18n.locale=='ar'?'text-left':'text-right'">{{ $t("actions") }}</th>
                </thead>
                <tbody  v-if="filteredEmployees.length > 0">
                  <tr
                    style="cursor: pointer;"
                    v-for="(employee,index) in filteredEmployees"
                    :key="employee.id"
                    :ref="employee.id"
                    @click="editEmployee(employee.id,$event)"
                  >
                    <td>{{index+1+((currentPage-1)*pageMax)}}</td>
                    <td>
                      <div class="row center-all">
                        <div :class="$i18n.locale=='ar'?'text-left':'text-right'" class="col-xs-3" style="width:65px;height:50px">
                          <div class>
                            <Avatar
                              :image="employee.image"
                              :fullname="employee.name"
                              :width="50"
                              :height="50"
                              :radius="50"
                              :crop="true"
                              :changeable="false"
                            />
                          </div>
                        </div>
                        <div
                          :class="$i18n.locale=='ar'?'text-right':'text-left'"
                          class="col-xs-9 trim-text"
                        >
                          <span >{{employee.name}}</span>
                          <br>
                          <span class="text-info">
                            <small dir="ltr">{{employee.phone}}</small>
                          </span>
                        </div>
                      </div>
                    </td>
                    <td align="center">
                      <div v-if="employee.shift_starting_date">{{employee.shift_starting_date.substring(0, 10)}}</div>
                      <div style="font-size:25px" v-else><span class="mdi mdi-timer-off"></span></div>
                    </td>
                    <td align="center">
                      <div v-if="employee.shift_ending_date">{{employee.shift_ending_date.substring(0, 10)}}</div>
                      <div style="font-size:25px" v-else><span class="mdi mdi-timer-off"></span></div>
                    </td>
                    <td align="center">{{employee.created_date.substring(0, 10)}}</td>
                    <td align="center">
                      <div v-html="getEmployeeOrdersCount(employee.id)"></div>
                    </td>
                    <td :class="$i18n.locale=='ar'?'text-left':'text-right'">
                       <button
                       
                        @click="editEmployee(employee.id,$event)"
                        class="btn btn-default btn-icon"
                      >
                        <i class="mdi mdi-pencil-outline"></i>
                      </button>
 
                      <button
                        @click="deleteEmployee(employee.id,$event)"
                        
                        class="btn btn-danger btn-icon"
                      >
                        <i class="mdi mdi-trash-can-outline"></i>
                      </button>
                     

                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-if="filteredEmployees.length > 0 && employees.length > pageMax " class="row text-center">
                <nav aria-label="Search results pages">
                  <v-pagination
                    v-model="currentPage"
                    :page-count="pageCount"
                    :classes="bootstrapPaginationClasses"
                    :labels="customLabels"
                  ></v-pagination>
                </nav>
              </div>
            </div>
            <div style="padding: 50px;" class="row text-center"  v-if="filteredEmployees.length == 0">
              <i style="font-size:80px;color:gray" class="ti-filter"></i>
              <h3>{{$t("no_employees_found")}}</h3>
              <p
                style="margin-bottom:50px"
                class="category"
                @click="searchText=''"
                v-if="employees.length > 0"
              >{{$t("clear_to_see_employees")}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import vPagination from "vue-plain-pagination";
import Avatar from "./sub_components/Avatar.vue";
import { Notification } from "electron";
import { Employee } from "./models.js";
const { dialog } = require("electron").remote;
export default {
  name: "Employees",
  components: {
    vPagination,
    Avatar
  },
  created() {
    this.employees = JSON.parse(JSON.stringify(store.getters.employees));
    _.remove(this.employees,{"id":1});
    console.log("this.employees")
    console.log(this.employees)
    console.log(store.getters.activities)
    this.pageCount = Math.ceil(this.employees.length / this.pageMax);
    this.filterEmployees();
  },

  mounted() {
    /* let myNotification = new Notification('Title', {
              body: 'Lorem Ipsum Dolor Sit Amet'
            }) */
  },
  activated() {
    this.customLabels = {
      first: this.$t("first"),
      prev: this.$t("previous"),
      next: this.$t("next"),
      last: this.$t("last")
    };
    this.employees = JSON.parse(JSON.stringify(store.getters.employees));
    _.remove(this.employees,{"id":1});
    this.pageCount = Math.ceil(this.employees.length / this.pageMax);
    setTimeout(()=>{
      this.filterEmployees();
    },1)
    console.log(this.employees)

  },
  deactivated() {
    $("tr").removeClass("animated");
    $("tr").removeClass("pulse");
    $("tr").removeClass("fadeOutLeft");
  },
  data() {
    return {
      currentPage: 1,
      pageMax: 7.0,
      currentCount: 0,
      employees: [],
      orders: [],
      filteredEmployees: [],
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
      }
    };
  },
  methods: {
    openEmployee(id) {
      console.log(store.getters.getEmployee(id));
    },
    addEmployee() {
      this.$router.push("/new-employee");
    },
    editEmployee(id, event) {
      event.stopPropagation();
      $("tr").removeClass("animated pulse");
      setTimeout(() => {
        $(this.$refs[id]).addClass("animated pulse");
        this.$router.push({ name: "edit_employee", params: { id: id } });
      }, 250);
    },
    getEmployeeOrdersCount(id) {
      let acts = store.getters.getEmployeeActivities(id);
      return _.filter(acts,{"action":"add_order"}).length
    },
    filterEmployees(resetCurrentPage = false) {
      let filteredC = _.filter(this.employees, c => {
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
      if (resetCurrentPage) {
        this.currentPage = 1;
      }
      if (this.employees.length > 0) {
        this.filteredEmployees = _.slice(
          filteredC,
          this.pageMax * (this.currentPage - 1),
          this.pageMax * (this.currentPage - 1) + this.pageMax
        );
      }else{
        this.filteredEmployees = [];
      }
      this.pageCount = Math.ceil(filteredC.length / this.pageMax);
    },
    deleteEmployee(id, e) {
      e.stopPropagation();
      let cancel = this.$t("no");
      let ok = this.$t("yes");
      swal({
        title: this.$t("delete_employee_confirm"),
        text: "",
        
        buttons: [this.$t("no"), this.$t("yes")],
        icon: "warning",

        dangerMode: true
      }).then(willDelete => {
        if (willDelete) {
          $(this.$refs[id]).addClass("animated fadeOutLeft");

          setTimeout(() => {
            store.dispatch("deleteEmployee", id);
            // to refrech Vue
            this.employees = JSON.parse(
              JSON.stringify(store.getters.employees)
            );
            _.remove(this.employees,{"id":1});
            if (this.filteredEmployees.length == 1) {
              this.currentPage =
                this.currentPage != 0 ? this.currentPage - 1 : 1;
            } else {
              }
            this.filterEmployees();
          }, 500);
        } else {
          //swal("Your imaginary file is safe!");
        }
      });
    }
  },
  watch: {
    currentPage: function(val, oldVal) {
      this.filterEmployees();
    },
    searchText() {
      setTimeout(() => {
        this.filterEmployees(true);
      }, 250);
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pagination > li > a {
  cursor: pointer;
}

th {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 16px;
  font-weight: 400;
}
list-item {
  display: inline-block;
  margin-right: 10px;
}

.list-enter-active,
.list-leave-active {
  transition: all 1s;
}

.list-enter,
.list-leave-to

/* .list-leave-active below version 2.1.8 */
 {
  opacity: 0;
  transform: translateX(30px);
}

.main-panel {
  /*   bemployee: 10px solid white;
    bemployee-radius: 25px;*/

}
.trim-text {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search[type="text"] {
  width: calc((100% - 20%) / 1.5 );
  -webkit-transition: width 0.4s ease-in-out;
  transition: width 0.4s ease-in-out;
}

.search[type="text"]:focus {
  width: calc(100% - 50px);
      margin-right: 20px;
}
.search {
  height: 50px;
  font-size: 20px;
  font-family: inherit;
  padding-left: 50px;
    text-overflow: ellipsis;
  padding-right: 50px;
      margin-top: 1px;
    margin-right: 20px;
}
.inlineFilter {
  display: inline;
  color: #b7b7b7;;
  font-size: 25px;
  cursor: pointer;
  z-index: 2;
}
.wrapper::-webkit-scrollbar {
  width: 0em;
}
th {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 17px;
  font-weight: 500;
}
/*.page-item::after,.page-item::before {
    box-sizing: bemployee-box;
}
.page-item{
        display: list-item;
    text-align: -webkit-match-parent;
}
.page-link {
    position: relative;
    display: block;
    padding: .5rem .75rem;
    margin-left: -1px;
    line-height: 1.25;
    color: #007bff;
    background-color: #fff;
    bemployee: 1px solid #dee2e6;
}*/
th {
  font-family: "Montserrat","Cairo";
  font-size: 18px;
  font-weight: 700;
  padding: 10px;
  line-height: 38px;
}
thead {
  background: #f5f5f5;
}
.card .content {
    padding: 0px 15px 10px 15px;
}
</style>