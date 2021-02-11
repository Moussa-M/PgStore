<template>
  <div class="lang-changer">
    <label>{{$t("lang")}}</label>
    <select v-model="$i18n.locale" @change="changed" class="form-control border-input">
      <option v-for="(lang, i) in langs" :key="`Lang${i}`" :value="lang" >{{ $t(lang) }}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'lang-changer',
  data () {
    return { langs: ['ar', 'en', 'fr'] }
  },
  methods: {
    changed () {
      store.dispatch('changeLang', this.$i18n.locale)
    }
  }
}
</script>
<style>
.lang-changer{
      height: 50px;
}
</style>