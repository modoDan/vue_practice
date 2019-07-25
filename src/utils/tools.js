/**
 * 对象数组的深度拷贝.
 * source是原数据，extendObj是新增的键值对
 */
export const objArrDeepCopy = (source, extendObj) => {
  var sourceCopy = source instanceof Array ? [] : {};
  for (var item in source) {
    // 遍历prototype上的属性，vue.prototype split
    if (source.hasOwnProperty(item)) {
      sourceCopy[item] = typeof source[item] === 'object' ? objArrDeepCopy(source[item], extendObj) : source[item];
      if (typeof extendObj === 'object' && !(sourceCopy instanceof Array)) {
        for (var param in extendObj) {
          sourceCopy[param] = extendObj[param];
        }
      }
    }
  }

  return sourceCopy;
}
/**
 * 对象数组去重
 */
export const reduceArr = (Arr) => {
    //Arr对象数组
    let hash:any = {};
    const newArr = Arr.reduceRight((item, next) => {
      hash[next.id] ? '' : hash[next.id] = true && item.push(next);
      return item
    }, []);
    return newArr;
  }
  /**
 * 文字截断
 */
export const handleTitleVisible = (title) => {
    if(title) {
        let titleLen = String(title).replace(/[^\x00-\xff]/g, '..').length;
        if(titleLen > 16) {
            return title;
        } else {
            return '';
        }
    }
}
 /**
 * 设置两位小数点的数字格式
 */
export const formatTwoDecimal = (num) => {
    if(/\d+/.test(num)){
        let value = num + ''
        let newval = value.replace(/((?:[.]{1})([0-9]{1,2}))?/g,(c)=>{
            return c.length == 2 ? c + '0' : c
        });
        if(!/(?:[.]{1})/.test(newval)){
            //整数
            return newval + '.00'
        }else{
            return newval
        }
    }else{
        return '--'
    }
  }
 /**
 * 下载文件
 */
  export function loadData (res){
    let fileName = res.headers['content-disposition'].match(/(\S*)xls/)[0];
    let name = fileName.split('=')[1]
    let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'});
    let url = window.URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.href = url;
    a.download = decodeURI(name);
    a.click();
    window.URL.revokeObjectURL(url);
}
/**
 * 扁平化数组
 */
export function flatten (arr){
    return arr.reduce(function(prev, cur) {
        var moreArr = [].concat(cur).some(Array.isArray);  //判断cur是不是一个数组
        return prev.concat(moreArr ? cur.flatten() : cur);
    },[])
}
/**
 * 防抖节流函数
 */
export const debounce = (func, delay,that) => {
    let timer:any
    return function (...args) {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        func.apply(that, args)
      }, delay)
    }
}
/**
 * 随机颜色
*/
const randomColor = (index,arr) =>{
    let colorType = ['#ffa633', '#0ec4a4', '#18b7f2', '#4d98ff'];
    let arrColor = [];
    /*完全随机*/
  //    var num = Math.floor(Math.random() * 4)　
  //    if(arrColor[arrColor.length - 1] != num) {　
  //      if(arrColor.length < arr.length) {　　　
  //        arrColor.push(num)　　　　
  //      }　
  //    }
    /*伪随机，第一次随机，之后按顺序循环*/
    var num = Math.floor(Math.random() * 4)
    for(var i = num; i < colorType.length + 1; i++) {
        if(arrColor.length < arr.length) {
            if(i == colorType.length) {
                i = 0
            }
            arrColor.push(i)
        }
    }
    return colorType[arrColor[index]];
}

import moment from 'moment'

export function fullDate (date){
    return moment(date).format('YYYY-MM-DD')
}
export function fullTime (date){
    return moment(date).format('YYYY-MM-DD HH:mm:ss')
}
export function NowStartTime (date){
    return moment(date).format('YYYY-MM-DD 00:00:00')
}
export function NowEndTime (date){
    return moment(date).format('YYYY-MM-DD 23:59:59')
}
export function FirstDate (){
    //本月1号
    return new Date(new Date().getFullYear(), new Date().getMonth(), 1)
}
//合并对象
// let addParams = (Object as any).assign({},common,pay,rateParams) //合并对象
// //扩展运算符
// addParams = {
//     ...common,
//     ...pay,
//     ...rateParams
// }