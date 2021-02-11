import Vue from 'vue'
function hasAction(action){

  let employee = store.getters.getEmployee(store.getters.is_logged_in.employee_id);
  if(employee){

    if(_.indexOf(employee.allowed_actions,action) != -1){
      return true
    }else{
      return false
    }
  }else{
    return false;
  }
}
Vue.hasAction = hasAction
Vue.prototype.$hasAction = hasAction
