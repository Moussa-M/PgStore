<template>
  <div v-if="errors.length" class="alert alert-danger header">
          <p>
            <b v-if="errors.length>1">{{ $t("correct_errors") }}</b>
            <b v-else>{{ $t("correct_error") }}</b>
            <ul>
              <li class="error" v-for="error in errors" :key="error">{{ error }}</li>
            </ul>
          </p>
        </div>
</template>

<script>

export default {
  name: "ErrorPanel",
  props: {
    errors: [Array],
  },
};
</script>

<style scoped lang="scss">
.card .header {
    padding: 20px;
}
.alert-danger {
    background-color: #F44336;
    color: #ffffff;
        font-size: 16px;
    .error {
    color: #ffffff;
    }
}
</style>
