<template>
    <div class="query-header fiexd-pos">
        <RelatedSelect v-model="query" ref="queryLine"></RelatedSelect>
        <BlockDate v-model="query" class="right-gap"></BlockDate>
        <InputQuery v-model="query" v-show="query.isInput"></InputQuery>
    </div>
</template>

<script lang="ts">
    import {
        Component,
        Prop,
        Vue,
        Model
    } from 'vue-property-decorator';
    import { Mutation, State, Action } from 'vuex-class';

    @Component
    export default class QueryHeader extends Vue {
        @Model('change') query!: any
        created(){
        }
    }
</script>

<style lang="scss" >

</style>