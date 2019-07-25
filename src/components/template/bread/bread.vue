<template>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item v-for="(item, index) in breadList" :key="index"
            :to="item.path === $route.path ? '' : item.path">
            <span v-if="!index"><img src="../../../../assets/img/title_icon.png"></span>
            {{item.name}}
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>
<script lang="ts">
    import {
        Component,
        Prop,
        Vue
    } from 'vue-property-decorator';
    interface Obj {
        name: string;
        path: string;
        component?: string;
        children?: Obj[] | never[] | undefined;
    }
    
    @Component
    export default class Bread extends Vue {
        @Prop() private listName!: string;
        breadList:Array<{ name: string; path: string; }> = []
        router:Obj[] = [
             { //账号管理员
                path: '/admin/productLine/productLineTable',
                name: '产品线列表',
                component: 'productLine',
                children: [
                {
                    path: '/admin/productLine/productLineEdit',
                    name: '新建产品线',
                    component: 'productLineEdit',
                }]
            },
            { //业务管理员
                path: '/admin/productLine/productLineList',
                name: '产品线列表',
                component: 'productLineList',
            },
            { //用户管理员
                path: '/admin/user/userTable',
                name: '用户列表',
                component: 'user',
                children: [
                {
                    path: '/admin/user/userEdit',
                    name: '添加用户',
                    component: 'userEdit',
                }]
            },
            { //账户管理
                path: '/admin/account/accountTable',
                name: '账户列表',
                component: 'account',
                children: [
                {
                    path: '/admin/account/accountEdit',
                    name: '添加账户',
                    component: 'accountEdit',
                },
                {
                    path: '',//此处为动态路由，不做处理依然生效，因为 '' !== $route.path
                    name: '手续费率',
                    component: 'rateList'
                }]
            },
            { //数据审核
                path: '/nonadmin/diversity/checkData',
                name: '数据审核',
                component: 'diversity',
                children: [
                {
                    path: '/nonadmin/diversity/diversityData',
                    name: '差异数据',
                    component: 'diversityData',
                },{
                    path: '/nonadmin/diversity/consistentData',
                    name: '一致数据',
                    component: 'consistentData',
                }]
            },
            { //明细查询
                path: '/nonadmin/detailed/detailTable',
                name: '明细查询',
                component: 'detailed'
            }
        ]
        get ratePath(){
            return  '/admin/account/rateList/' + this.$route.params.businessAccountId
        }
        get operateType(){
            return this.$route.query.operateType
        }
        created() {
            this.filterArr('产品线列表','productLineEdit','EDIT','编辑产品线')
            this.filterArr('用户列表','userEdit','USEREDIT','编辑用户')
            let accountArr = this.filterArr('账户列表','accountEdit','ACCOUNTEDIT','编辑账户')
            //手续费率为动态路由
            accountArr.forEach((val)=>{
                if(val.component === 'rateList'){
                    val.path = this.ratePath
                }
            })
            this.getBread()
        }

        filterArr(filterName:string,component:string,type:string,pathName:any){
            let arr = (this.router.filter(x => x.name === filterName)[0].children as Obj[])
            if (arr.some(x => x.component === component)) {
                let filterNewArr = arr.filter(x => x.component === component)
                filterNewArr.forEach((val)=>{
                    if(this.operateType == type){
                        val.name = pathName
                    }
                })
            }
            return arr
        }

        getBread() {
                let route = this.$route.path.split('/')
                let len = route.length
                this.breadList = []
                // if(this.listName){
                //     let obj:Obj = {
                //         name: this.listName,
                //         path: ''
                //     }
                //     this.breadList.push(obj)
                // }
                if(this.listName){
                    //账号管理员-产品线
                    this.setBread(this.router, route, 3, len)
                }else{
                    this.setBread(this.router, route, 2, len)
                }
            }
            setBread(arr1: any[], arr2: any[], x: number, y: number) {
                if (x < y) {
                    for (let i in arr1) {
                        if (arr1[i].component === arr2[x]) {
                            this.breadList.push({
                                name: arr1[i].name,
                                path: arr1[i].path
                            })
                            x++
                            this.setBread(arr1[i].children, arr2, x, y)
                        }
                    }
                }
            }
    }
</script>

<style lang="scss">
.breadcrumb {
    // width: 100%;
    height: 50px;
    background-color: $white;
    line-height: 50px !important;
    padding-left: 20px;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
}
</style>