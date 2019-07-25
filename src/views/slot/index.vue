<template>
    <div>
        <h3>当前用户：{{username}}</h3>
        <slotItem v-model="checkList">
            <template v-slot:role="roleProps">
                <el-select 
                    :disabled="!roleProps.checkList.includes(roleProps.list)" 
                    @change="changeSelect(roleProps)" 
                    v-model="roleProps.list.productLines" 
                    multiple 
                    placeholder="请选择产品线">
                    <el-option 
                        v-for="(item,index) in roleProps.productLineList" 
                        :key="item.id" 
                        :label="item.productLineName" 
                        :value="item.id">
                    </el-option>
                </el-select>
            </template>
            <p slot="guide">
                <!-- <p>具名插槽：title slot1</p> -->
                尚无用户信息！<span @click="addAccount('ACCOUNTADD')" class="new-add">点击添加</span>
            </p>
        </slotItem>
        <el-button type="primary" @click="submitForm">确定</el-button>
    </div>
</template>
<script>
import slotItem from "./slotItem";
import { store, mutations } from "../../store";
export default {
    components: {
        slotItem
    },
    data() {
        return {
            checkList:[],
            username:store.username
        };
    },
    watch:{
        checkList:{
            handler(val,oldVal){
                console.log(val)
            },
            deep:true,
            immediate:true 
        }
    },
    methods:{
        changeSelect(roleProps){
            this.checkList = roleProps.checkList
        },
        submitForm(){
            //复选框选中状态
            let checkArr = this.checkList.filter(val=>{
                return !val.choose
            })
            //产品线是否选择
            let productArr = this.checkList.filter(val=>{
                return val.choose && !val.productLines.length
            })
            console.log(this.checkList)
            if(!this.checkList.length || checkArr.length>0){
                console.log('请选择至少一种角色！')
            }else if(productArr.length > 0){
                console.log('请至少选择一个产品线关联角色')
            }else {
                //可以提交
            }
        }
    }
};
</script>