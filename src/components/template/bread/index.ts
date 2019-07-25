import bread from './bread.vue'
const Breadcrumb = {
  install: function (Vue:any) {
    Vue.component('Breadcrumb', bread)
  }
}
export default Breadcrumb
