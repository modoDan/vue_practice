<template>
    <div class="rate-card">
        <span class="right-gap">
            <el-date-picker class="base-color min-input" v-model="rates.effectiveDate"
                :picker-options="startDatePicker()"
                :editable="false"
                type="date" placeholder="生效时间">
            </el-date-picker>
        </span>
        <span class="right-gap">
            <el-select v-model="rates.rateId" @change="changeRate" placeholder="请选择费率">
                <el-option v-for="item in rateOptions" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
        </span>
        <span class="rate-form" v-if="rates.rateId==2">
            <div v-for="(item,index) in moreRates" :key="index" :class="{'rate-line': !item.showtips}">
                <el-form :ref="`rateform${index}`" :model="item">
                    <span class="right-gap">
                        <el-form-item label="" prop="startamount">
                            <el-input placeholder="金额" class="min-input" v-model.trim="item.startamount" @focus="onFocus(index)">
                            </el-input>
                        </el-form-item>
                        <i>-</i>
                        <el-form-item label="" prop="endamount">
                            <el-input placeholder="金额" class="min-input" v-model.trim="item.endamount" @focus="onFocus(index)">
                            </el-input>
                        </el-form-item>
                        万
                    </span>
                    <el-form-item label="" prop="poundageRate">
                        <el-input placeholder="请输入手续费率" class="min-input" v-model.trim="item.poundageRate" @focus="onFocus(index)">
                        </el-input>%
                    </el-form-item>
                    <span class="handle">
                        <i class="el-icon-remove-outline remove" v-if="item.remove" @click="remove(index)"></i>
                        <i class="el-icon-circle-plus-outline plus" v-if="item.plus" @click="add(index)"></i>
                    </span>
                </el-form>
                <span style="color:red" v-if="item.amountvalidate || item.ratevalidate">
                    {{item.showtips}}
                </span>
            </div>
        </span>
        <span class="rate-form" v-else>
            <el-form ref="rateform" :model="singleRate">
                <el-form-item label="" prop="poundageRate">
                    <el-input placeholder="请输入手续费率" class="min-input" v-model.trim="singleRate.poundageRate">
                    </el-input>%
                </el-form-item>
            </el-form>
            <span style="color:red" v-if="singleRate.ratevalidate">
                {{singleRate.showtips}}
            </span>
        </span>
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
    
    @Component
    export default class RateForm extends Vue {
        @Model('change') rates!: any
        get moreRates(){
            return this.rates.moreRates
        }
        get singleRate(){
            return this.rates.singleRate
        }
        get isvalidate(){
            return this.rates.isvalidate
        }
        activeIndex: any = ''
        rateOptions = [{
            id: 1,
            name: '单费率'
        }, {
            id: 2,
            name: '多费率'
        }]
        validateRate(val:any){
            let reg = /^[0-9]+([.]{1}[0-9]{1,2})?$/
            let rate = val.poundageRate
            if(rate === ''){
                val.ratevalidate = true
                val.showtips = '费率不能为空'
            }else if (rate && (Number(rate) < 0 || Number(rate) > 100)) {
                val.ratevalidate = true
                val.showtips = '费率请输入0-100之间的数'
            } else if (rate && !reg.test(rate)) {
                val.ratevalidate = true
                val.showtips = '费率最多只能有两位小数'
            }else{
                val.ratevalidate = false
            }
        }
        validateMoreRate(arr:any,index:number){
            arr[index].endamount = index == arr.length - 1 && arr[index].endamount === '' ? null : arr[index].endamount
            if(arr[index].startamount === '' || arr[index].endamount === '' || arr[index].poundageRate === ''){
                //先判断为空的情况
                arr[index].amountvalidate = true
                arr[index].showtips = '金额或费率不能为空'
            }else{
                //验证费率
                this.validateRate(arr[index])
                //验证金额
                let reg = /^[0-9]\d*$/
                let startamount = arr[index].startamount
                let endamount = arr[index].endamount
                if ((startamount && !reg.test(startamount)) || (endamount && !reg.test(endamount))) {
                    arr[index].amountvalidate = true
                    arr[index].showtips = '金额请输入非负整数'
                }else{
                    if(index == 0){
                        //第一行
                        if(Number(arr[index].startamount) >= Number(arr[index].endamount)){
                            arr[index].amountvalidate = true
                            arr[index].showtips = '金额区间范围不正确'
                        }else{
                            arr[index].amountvalidate = false
                        }
                    }else{
                        if(Number(arr[index].startamount) < Number(arr[index-1].endamount) || (arr[index].endamount && Number(arr[index].startamount) >= Number(arr[index].endamount))){
                            arr[index].amountvalidate = true
                            arr[index].showtips = '金额区间范围不正确'
                        }else{
                            arr[index].amountvalidate = false
                        }
                    }
                }
            }
        }
        startDatePicker(){
            //有历史记录时，生效时间只可以选择今天之后的日期
            if(this.rates.datedisabled){
                return {
                    disabledDate(time:any){
                        return time.getTime() < Date.now()
                    }
                }
            }
        }
        changeRate(item: any) {
            this.rates.singleRate = {
                poundageRate:'',
                ratevalidate:false,
                showtips:'',
            }
            let newObj = {
                startamount:'',
                endamount:'',
                poundageRate:'',
                amountvalidate:false,
                ratevalidate:false,
                showtips:'',
                plus:true,
                remove:false
            }
            this.rates.moreRates = [newObj]
        }
        onFocus(index:number) {
            this.activeIndex = index
        }
        remove(index:any) {
            this.moreRates.splice(index,1)
            this.setStatus()
            if(this.moreRates.length == 1){
                this.$set(this.moreRates[this.moreRates.length-1],'remove',false)
            }
        }
        add(index:number) {
            if(this.moreRates[index].startamount === '' || this.moreRates[index].endamount === '' || this.moreRates[index].poundageRate === ''){
                this.moreRates[index].amountvalidate = true
                this.moreRates[index].showtips = '请填写完当前行手续费率后再添加下一行'
            } else{
                let newObj = {
                    startamount:'',
                    endamount:'',
                    poundageRate:'',
                    amountvalidate:false,
                    ratevalidate:false,
                    showtips:'',
                }
                this.moreRates.push(newObj)
                this.setStatus()
            }
        }
        setStatus(){
            this.moreRates.forEach((val:any) => {
                this.$set(val,'remove',true)
                this.$set(val,'plus',false)
            });
            this.$set(this.moreRates[this.moreRates.length-1],'plus',true)
        }
    }
</script>

<style scoped lang="scss">
    .rate-card {
        display: flex;

        .rate-line {
            margin-bottom: 10px;
        }
    }

    .handle {
        i {
            cursor: pointer;
            margin-left: 10px;
        }

        .remove {
            &:hover {
                color: red;
            }
        }

        .plus {
            &:hover {
                color: $baseColor;
            }
        }
    }
</style>