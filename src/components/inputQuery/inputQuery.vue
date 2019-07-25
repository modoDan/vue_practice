<template>
       <el-input placeholder="请输入订单号" prefix-icon="el-icon-search" v-model.trim="query.searchingText" class="my-search-order" @input="query.searchOrder">
        </el-input>
</template>
<script lang="ts">
    import {
        Component,
        Prop,
        Vue,
        Watch,
        Model
    } from 'vue-property-decorator';
    import {
        Mutation,
        State,
        Action
    } from 'vuex-class';
    @Component
    export default class BlockDate extends Vue {
        @Model('input') query!: any
    }
</script>

<style scoped lang="scss">

</style>