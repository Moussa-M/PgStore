<template>
    <div class="row center-block">
        <div class="col-xs-12 col-sm-12 col-md-8 col-lg-6 mx-auto">
            <h2 class="title text-center">{{$t("login")}}</h2>
            <div class="card">
                <div class="header">
                    <p v-if="errors.length">
                        <b>{{ $t("correct_errors") }}</b>
                        <ul>
                            <li v-for="error in errors" :key="error">{{ error }}</li>
                        </ul>
                    </p>
                </div>
                <div class="content">
                    <form @submit="login" novalidate="true">
                        <div class="row">
                            <div class="w-100 p-10">
                                <div class="form-group">
                                    <label>{{ $t("user_name") }}</label>
                                    <input type="text" class="form-control border-input" v-model="username" :placeholder="$t('user_name')" value="">
                                </div>
                            </div>

                            <div class="w-100 p-10">
                                <div class="form-group">
                                    <label>{{ $t("password") }}</label>
                                    <input :type="passwordType" class="form-control border-input" v-model="password" :placeholder="$t('password')" value="">
                                    <font-awesome-icon  :class="$i18n.locale=='ar'?'errspanRTL':'errspanLTR'" :icon="passwordIcon" @click="hidePassword = !hidePassword" />
                                </div>
                            </div>
                        </div>
                        <div class="text-center">
                            <button type="submit" @click="login" class="btn btn-outline-primar w-100 p-10">
                                <font-awesome-icon icon="sign-out-alt" /> {{$t("login")}}</button>
                        </div>
                        <div class="clearfix"></div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: 'Login',
  computed: {
    passwordType () {
      return this.hidePassword ? 'password' : 'text'
    },
    passwordIcon () {
      return this.hidePassword ? 'eye' : 'eye-slash'
    }
  },

  data: function () {
    return {
      hidePassword: true,
      errors: [],

      password: null,
      username: null
    }
  },
  methods: {

    login: function (e) {
      console.log('presss')
        	e.preventDefault()
      this.errors = []

      if (!this.username) {
        this.errors.push(this.$t('user_name_required'))
      }
      if (!this.password) {
        this.errors.push(this.$t('password_required'))
      }

      if (this.errors.length == 0) {
        console.log(window.store.getters.user.username)
        console.log(window.store.getters.user.password)
        if (window.store.getters.user.username == this.username && window.store.getters.user.password == this.password) {
          window.store.dispatch('is_logged_in', true)
          this.$router.replace('/home')
        } else {
          this.errors.push(this.$t('username_password_required'))
        }
      } else {
        return true
      }
    }

  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>


.center-block {
	height: 100% !important;
  display: flex;
  align-items: center;
  justify-content: center ;
}
.w-100{
	width: 100%;
}
.p-10{
	padding: 10px;
}
</style>