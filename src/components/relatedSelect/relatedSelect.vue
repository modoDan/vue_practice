<template>
    <div>
        <el-select v-model="query.productLineId" placeholder="虚拟运营商" @change="changeSelect()" v-if="currentRole==='auditorRole'" class="right-gap"
            :title="$handleTitle(productLineName)" popper-class="selectProduct">
            <el-option v-for="item in productLineList" :key="item.id" :label="$handleLable(item.productLineName)"
                v-show="item.type==1" :title="$handleTitle(item.productLineName)" :value="item.id">
            </el-option>
        </el-select>
        <el-select v-model="query.payChannelTypeId" placeholder="来源渠道" @change="getStoreIds()" class="right-gap" popper-class="selectProduct">
            <el-option label="请选择来源渠道" :value="0"></el-option>
            <el-option v-for="item in payChannelList" :key="item.id" :label="item.paychanneltypename" :value="item.id">
            </el-option>
        </el-select>
        <el-select v-model="query.storeIndex" placeholder="商户号" class="right-gap" @change="updatePayChannel(query.storeIndex-1)" :title="$handleTitle(query.storeId)"
            popper-class="selectProduct">
            <el-option label="请选择商户号" :value="0"></el-option>
            <el-option v-for="(item,index) in storeIdList" :key="index" :label="$handleLable(item.storeId)" :title="$handleTitle(item.storeId)"
                :value="index+1">
            </el-option>
        </el-select>
    </div>
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
    import {StoreIds} from '@/api/dataDetail'
    import { PayChannels } from '@/api/businessAccount'
    import { NowStartTime,NowEndTime } from '../../method/date'
    @Component
    export default class RalatedSelect extends Vue {
        @Model('change') query!: any
        get productLineId(){
            return this.query.productLineId
        }
        @Watch('productLineId', { immediate: true, deep: true })
        private productLineIdChanged(val: any, oldVal: any) {
            this.productLineList.forEach((item:any)=>{
                if(val==item.id){
                    this.productLineName = item.productLineName
                }
            })
        }
        @State private currentRole!: any;
        storeIdList:any = []
        payChannelList:any = [];
        @State private productLineList!: any[];
        @Watch('productLineList', { immediate: true, deep: true })
        private productLineListChanged(val: any, oldVal: any) {
            if (val.length>0 && this.currentRole == 'auditorRole') {
                //解决首次进来产品线列表还没拿到值
                //审核员角色默认选中第一条产品线，审核页面进入差异|一致数据的
                this.query.productLineId = this.$route.query.productLineId || val[0].id;
            }
        }
        @Watch('currentRole', { immediate: true, deep: true })
        private currentRoleChanged(val: any, oldVal: any) {
            if(val.hasOwnProperty('productLineName')){
                this.query.productLineId = val.productLineId;
            }
            if(this.$route.query.date){
                //总表/审核进入--默认选中当天时间
                this.query.dateRange = [NowStartTime(this.$route.query.date), NowEndTime(this.$route.query.date)]
            }
        }
        productLineName:string = ''
        getpayChannelList(){
            this.query.payChannelTypeId = ''
            let params = {
                productLineId: this.query.productLineId
            }
            PayChannels(params).then((res:any) => {
                this.payChannelList = res ? res : []
            })
        }
        changeSelect(){
            this.getStoreIds()
            this.getpayChannelList()
        }
        getStoreIds(){
            this.query.storeIndex = 0
            this.query.storeId = ''
            let params = {
                productLineId:this.query.productLineId,
                payChannelTypeId:this.query.payChannelTypeId ? this.query.payChannelTypeId  : ''
            }
            StoreIds(params).then((res:any) => {
                this.storeIdList = res ? res : []
            })
        }
        updatePayChannel(index:number){
            if(this.query.storeIndex>0){
                this.query.payChannelTypeId = this.storeIdList[index].payChannelTypeId
                this.query.storeId = this.storeIdList[index].storeId
            }else{
                this.query.payChannelTypeId = 0
                this.query.storeId = 0
            }
        }
        created(){
            this.changeSelect()
        }
    }
</script>

<style scoped lang="scss">

</style>