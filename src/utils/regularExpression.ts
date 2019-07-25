/**
 * element表单--校验手机号
 * 使用场景：
 *   1.产品线列表|账户列表|转让角色：删除|更新公钥|复制公钥
 */
export const validateMobile = (rule:object, value:any, callback:any) => {
  let reg = /^1\d{10}$/
  if (value && !reg.test(value)) {
    callback(new Error('请输入正确的手机号码'))
  } else {
    callback()
  }
}
/**
 * element表单--校验验证码
 * 使用场景：
 *    1.产品线列表|账户列表|转让角色：删除|更新公钥|复制公钥
 */
export const validateCaptcha = (rule:object, value:any, callback:any) => {
    let reg = /^\d{6}$/
    if (value && !reg.test(value)) {
      callback(new Error('您输入6位数字验证码'))
    } else {
      callback()
    }
  }
/**
 * element表单--校验银行卡号，首位非0、15到19位
 * 使用场景：
 *    1.账户管理：银行账号
 *    
 */
export const validateBankcard = (rule:object, value:any, callback:any) => {
  let val = value ? value.replace(/\s+/g, '') : ''
  let reg = /^([1-9]{1})(\d{12}|\d{13}|\d{14}|\d{15}|\d{16}|\d{17}|\d{18})$/
  if (val && !reg.test(val)) { // 替换了输入中的空格，注意传参数时后端的需求
    callback(new Error('请输入正确的银行卡号码'))
  } else {
    callback()
  }
}
/**
 * element表单--校验正整数
 * 使用场景：
 *    
 */
export const validatePositiveInteger = (rule:object, value:any, callback:any) => {
  let reg = /^[0-9]\d*$/
  if (value && !reg.test(value)) {
    callback(new Error('请输入非负整数'))
  } else {
    callback()
  }
}
/**
 * element表单--校验非负数且保留两位小数
 * 使用场景：
 *    1.账户管理：期初金额
 */
export const validatePositiveNumber = (rule:object, value:any, callback:any) => {
  let reg = /^[0-9]+([.]{1}[0-9]{1,2})?$/
  if (value && !reg.test(value)) {
    callback(new Error('请输入大于等于0的数字，最多支持两位小数'))
  } else {
    callback()
  }
}
/**
 * element表单--校验正数，大于0并且小于100
 * 使用场景：
 *    1.账户管理：手续费率
 */
export const validatePositiveNumberBetween0And100 = (rule:object, value:any, callback:any) => {
  let reg = /^[0-9]+([.]{1}[0-9]{1,2})?$/
  if (value && (Number(value) < 0 || Number(value) > 100)) {
    callback(new Error('请输入0-100之间的数'))
  } else if (value && !reg.test(value)) {
    callback(new Error('最多只能有两位小数'))
  }else {
    callback()
  }
}