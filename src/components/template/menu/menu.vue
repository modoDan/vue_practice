<template>
    <el-menu router :default-active="activePath"  class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item :index="item.path" v-for="(item,index) in menuList" :key="index" :style="{backgroundImage: `url('${item.icon}')`}">
            <span class="left-gap">{{item.name}}</span>
        </el-menu-item>
    </el-menu>
</template>
<script lang="ts">
    import {
        Component,
        Prop,
        Vue,
        Watch
    } from 'vue-property-decorator';
    import { State } from 'vuex-class';
    interface MenuObj {
        name:string;
        icon:string;
        path:string
    }
    @Component
    export default class Menu extends Vue {
        @Prop() private minMenu!:boolean;
        @State private currentRole!: any;
        @Watch('currentRole', { immediate: true, deep: true })
        private selectRoleChanged(val: any, oldVal: any) {
            if (val==='accountAdminrole') {
                this.menuList = this.accountAdminList;
            } else if(val==='businessAdminrole'){
                this.menuList = this.businessAdminList;
            }else{
                if(this.currentRole==='auditorRole'){
                    this.otherRoleList[0].path = '/nonadmin/diversity/checkData'
                }else{
                    this.otherRoleList[0].path = '/nonadmin/diversity/totalData'
                }
                this.menuList = this.otherRoleList
            }
        }
        activePath: string = ''
        menuList:MenuObj[] = []
        adminRoleList:MenuObj[] = [{ 
                name: '产品线管理',
                icon: require('../../../../assets/img/product_line_icon.png'),
                path:'/admin/productLine/productLineTable'
            },
            {
                name: '用户管理',
                icon: require('../../../../assets/img/user_manage_icon.png'),
                path:'/admin/user/userTable'
            },
            {
                name: '账户管理',
                icon: require('../../../../assets/img/account_icon.png'),
                path:'/admin/account/accountTable'
            }
        ]
        accountAdminList:MenuObj[] = [{ 
                name: '产品线管理',
                icon: require('../../../../assets/img/product_line_icon.png'),
                path:'/admin/productLine/productLineList'
            },
            {
                name: '用户管理',
                icon: require('../../../../assets/img/user_manage_icon.png'),
                path:'/admin/user/userTable'
            }
        ]
        businessAdminList:MenuObj[] = [{ 
                name: '产品线管理',
                icon: require('../../../../assets/img/product_line_icon.png'),
                path:'/admin/productLine/productLineTable'
            },
            {
                name: '账户管理',
                icon: require('../../../../assets/img/account_icon.png'),
                path:'/admin/account/accountTable'
            }
        ]
        otherRoleList:MenuObj[] = [{ 
                name: '差异处理',
                icon:require('../../../../assets/img/diversity_icon.png'),
                path:'/nonadmin/diversity/totalData'
            },
            {
                name: '报表查询',
                icon:require('../../../../assets/img/report_form_icon.png'),
                path:'/nonadmin/report/dayReport'
            },
            {
                name: '明细查询',
                icon:require('../../../../assets/img/detailed_icon.png'),
                path:'/nonadmin/detailed/detailTable'
            }
        ]
        created(){
           this.setActivePath()
        }
        setActivePath(){
            if (this.currentRole==='accountAdminrole') {
                this.activePath = '/admin/productLine/productLineList';
            }else if (this.currentRole==='businessAdminrole') {
                this.activePath = '/admin/productLine/productLineTable';
            }else if(this.currentRole==='auditorRole'){
                this.activePath = '/nonadmin/diversity/checkData'
            }else{
                this.activePath = '/nonadmin/diversity/totalData';
            }
        }
        handleSelect(){
            //切换菜单滚动条位置初始化
            if(this.$scrollContainer()){
                this.$scrollContainer().scrollTop = 0
            }
        }
    }
</script>

<style scoped lang="scss">
.el-menu-item{ 
    background-repeat: no-repeat;
    background-position: 10px center;
}
</style>