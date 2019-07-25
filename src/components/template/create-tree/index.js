
import createTree from './index.vue'
const CreateTree = {
  install: function (Vue) {
    Vue.component('CreateTree', createTree)
  }
}
export default CreateTree
