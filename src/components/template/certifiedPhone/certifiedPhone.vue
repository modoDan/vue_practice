<template>
    <el-dialog :title="title" class="my-dialog phone-dialog" :visible.sync="phoneVisible" center :close-on-click-modal="false" :show-close="false">
            <el-dialog title="提示" class="my-dialog phone-dialog" :visible.sync="innerVisible" width="25%" center append-to-body>
                <div class="text-center">
                    <div class="q-wechat">
                        <span class="q-wechat-ok"><i class="el-icon-circle-check-outline">手机号绑定成功</i></span>
                        <p>您的手机： {{ruleForm.phoneNumber}}</p>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelHandle" class="min-btn-width"  size="small">关闭</el-button>
                </span>
            </el-dialog>
            <p  class="text-left" v-if="bindphone">请输入您要绑定的手机号，绑定手机号主要用于获取敏感信息的验证。</p>
            <div v-else class="text-left">
                <p>为了确认您的信息安全，需要验证手机号</p>
                <p>验证码已发送到您的手机 {{encryptPhone}}<span class="base-color left-gap"  @click="changeVerify">更换绑定手机</span></p>
            </div>
             <el-form :model="ruleForm" ref="ruleForm" :rules="rules" style="margin-top:20px;">
                <el-form-item label="手机号：" prop="phoneNumber" v-if="bindphone">
                   <el-input placeholder="请输入手机号" class="right-gap" v-model.trim="ruleForm.phoneNumber">
                    </el-input>
                    <el-button type="primary" size="small" @click="submitForm('ruleForm','phoneNumber')"  :disabled="disabled" class="base-bgcolor btn-width"  style="text-indent: -9px;">{{btnContent}}</el-button>
                </el-form-item>
                <el-form-item label="验证码：" prop="captcha">
                   <el-input placeholder="请输入验证码"  v-model.trim="ruleForm.captcha">
                 </el-input>
                 <div v-if="!bindphone" class="send-again">
                     <el-button type="primary" size="small" @click="submitForm('ruleForm','phoneNumber')" :disabled="disabled" class="base-bgcolor btn-width"  style="text-indent: -9px;">{{btnContent}}</el-button>
                 </div>
                 </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm('ruleForm','certified')" :disabled="submitDisabled" class="min-btn-width"  size="small">确 定</el-button>
                <el-button @click="cancelHandle" class="min-btn-width"  size="small">取 消</el-button>
            </span>
        </el-dialog>
</template>
<script lang="ts">
    import {
        Component,
        Prop,
        Vue,
        Emit 
    } from 'vue-property-decorator';
    import { Mutation, State, Action } from 'vuex-class';
    import {SendCertifiedCode,ChangeUserPhoneNumber,CertifiedPhone} from '@/api/auth'
    import { validateMobile, validateCaptcha } from '@/components/common/regularExpression'
    import clip from '@/utils/clipboard';

    @Component
    export default class certifiedPhone extends Vue {
        handleCopy:(text: string, event: any) => void = clip
        @Prop() phoneVisible!:boolean;
        @State private userAllRoles!: any;
        @Emit()
        closePhone() {
            return this.close_status
        }
        close_status:any = ''
        FormData:any = ''
        innerVisible:boolean = false
        ruleForm = {
            phoneNumber:'',
            captcha:''
        }
        rules = {
           phoneNumber:[{
                message: '请输入手机号',
                trigger: 'blur'
            },
            {
                validator: validateMobile, 
                trigger: 'blur'
            }],
           captcha:[{
                message: '请输入验证码',
                trigger: 'blur'
            },
            {
                validator: validateCaptcha, 
                trigger: 'blur'
            }]
        }
        title:string = '绑定手机号'
        bindphone:boolean = true
        verifyphone:boolean = false
        changephone:boolean = false
        encryptPhone:string = ''
        time:number = 0 //发送验证码间隔时间
        settimer:any = ''
        btnContent:string = '获取验证码'
        disabled:boolean = false
        submitDisabled:boolean = false
        created(){
            if(this.userAllRoles.phoneNumber){
                this.bindphone = false
                this.title = '验证手机号'
                this.ruleForm.phoneNumber = this.userAllRoles.phoneNumber
                this.encryptPhone =`${this.userAllRoles.phoneNumber.toString().substring(0, 3)}****${this.userAllRoles.phoneNumber.toString().substring(7, 11)}`
                this.sendSmsCode()
           }
        }
        // 获取验证码
            sendSmsCode() {
                this.time = 60;
                this.timer();
                //获取验证码请求
                let _this:any = this
                let param = {
                    phoneNumber: this.ruleForm.phoneNumber,
                    token:_this.$sha256(this.ruleForm.phoneNumber+this.userAllRoles.userId)
                };
                SendCertifiedCode(param).then((res:any) => {
                    if (res=='ok') {
                        this.$Notify(true, '发送验证码成功');
                    }else{
                        this.$Notify(false, res);
                    }
                });
            }
            changeVerify(){
                if(!this.ruleForm.captcha){
                    this.$Notify(false, "请输入6位数字验证码");
                }else{
                    this.verifyphone = true
                    this.bindPhoneSure()
                }
            }
            changePhone(){
                this.bindphone = true;
                this.changephone = true
                this.innerVisible = false
                this.disabled = false
                this.submitDisabled = false
                this.title = '绑定手机号'
                clearTimeout(this.settimer);
                this.btnContent = "获取验证码"
                this.ruleForm.captcha = ''
                this.ruleForm.phoneNumber = ''
            }
            bindPhoneSure(){
                var params = {
                        phoneNumber: this.userAllRoles.phoneNumber ? '' : this.ruleForm.phoneNumber,
                        captcha: this.ruleForm.captcha,
                    };
                    CertifiedPhone(params).then((res:any) => {
                        if (res=='ok') {
                            let tips = this.userAllRoles.phoneNumber ? '验证手机号成功' : '绑定手机号成功'
                            this.$Notify(true, tips);
                            if(!this.userAllRoles.phoneNumber){
                                //绑定手机号显示用户信息
                                this.innerVisible = true
                            }else if(this.verifyphone){
                                //旧手机验证跟换
                                this.changePhone()
                            }else{
                                this.close_status = {close:false,bindStatus:true}
                                //触发事件，传给父组件
                                this.closePhone()
                            }
                        }else{
                            this.$Notify(false, res);
                            this.close_status = {close:true,bindStatus:false}
                            this.closePhone()
                        }
                        this.submitDisabled = false
                    })
            }
            changePhoneSure(){
                var params = {
                        phoneNumber: this.ruleForm.phoneNumber,
                        captcha: this.ruleForm.captcha,
                    };
                    ChangeUserPhoneNumber(params).then((res:any) => {
                        if (res=='ok') {
                            this.$Notify(true, '绑定手机号成功');
                            this.innerVisible = true
                        }else{
                            this.$Notify(false, res);
                            this.close_status = {close:true,bindStatus:false}
                            this.closePhone()
                        }
                        this.submitDisabled = false
                    })
            }
            cancelHandle(){
                if(this.innerVisible){
                    this.innerVisible = false
                    this.close_status = {close:false,bindStatus:true}
                }else{
                    this.close_status = {close:false,bindStatus:false}
                }
                this.closePhone()
            }
            submitForm(formName:string,type:string) {
                this.FormData = this.$refs[formName]
                this.FormData.validate((valid:any) => {
                    if(this.ruleForm.phoneNumber && this.ruleForm.captcha){
                        if (valid) {
                            if(type==='certified'){
                                if(this.changephone){
                                    this.submitDisabled = true;
                                    this.changePhoneSure()
                                }else{
                                    //确认绑定手机号
                                    this.submitDisabled = true;
                                    this.bindPhoneSure()
                                }
                            }
                        } else {
                            this.submitDisabled = false
                            console.log('error submit!!');
                            return false;
                        }
                    }if(this.ruleForm.phoneNumber){
                        if (valid) {
                            if(type==='phoneNumber'){
                                // 获取验证码
                                this.sendSmsCode()
                            }
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    } else {
                        this.submitDisabled = false
                        this.$Notify(false, "请输入手机号或验证码");
                    }
                });
            }
            timer() {
                var timer;
                if (this.time > 0) {
                    this.time--;
                    this.btnContent = this.time + "s后重新获取";
                    this.disabled = true;
                    timer = setTimeout(this.timer, 1000);
                } else if (this.time == 0) {
                    this.btnContent = "获取验证码";
                    clearTimeout(timer);
                    this.disabled = false;
                }
                this.settimer = timer
            }
    }
</script>

<style scoped lang="scss">
.send-again{
    margin-left: 66px;
}
</style>