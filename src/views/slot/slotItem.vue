<template>
    <div>
        <el-checkbox-group v-model="checkList">
            <div v-for="(list,index) in roleList" :key="index">
                <el-checkbox :label="list" @change="changeCheck(list)">
                    <span>{{list.rolename}}</span>
                </el-checkbox>
                <slot name="role" :list="list" :checkList="checkList" :productLineList="productLineList"></slot>
            </div>
        </el-checkbox-group>
        <slot name="guide">
            <!-- 尚无用户信息！<span @click="addAccount('ACCOUNTADD')" class="new-add">点击添加</span> -->
        </slot>
    </div>
</template>
<script>
export default {
	model:{
		event:'change',
		checkList:[]
	},
    data() {
        return {
        	checkList:[],
            roleList:[{
            	id:1,
            	rolename:'业务管理员',
            	productLines:[]
            },{
            	id:2,
            	rolename:'审核员',
            	productLines:[]
            },{
            	id:3,
            	rolename:'业务员',
            	productLines:[]
            },{
            	id:4,
            	rolename:'对账员',
            	productLines:[]
            }],
            productLineList: [{
                id: 1,
                productLineName: '产品线1'
            }, {
                id: 2,
                productLineName: '产品线2'
            }, {
                id: 3,
                productLineName: '产品线3'
            }]
        }
    },
    methods:{
        addAccount(type){
            console.log(type)
        },
    	changeCheck(list){
    		if(!this.checkList.length){
    			list.productLines = []
    			list.choose = false
    		}else{
    			list.choose = true
    		}
    	}
    }
};
</script>