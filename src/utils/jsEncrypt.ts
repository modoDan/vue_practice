import JsEncrypt from 'jsencrypt'

//超长字符串加密
var b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var b64pad = "=";
function hex2b64(d:any) {
    var b;
    var e;
    var a = "";
    for (b = 0; b + 3 <= d.length; b += 3) {
        e = parseInt(d.substring(b, b + 3), 16);
        a += b64map.charAt(e >> 6) + b64map.charAt(e & 63)
    }
    if (b + 1 == d.length) {
        e = parseInt(d.substring(b, b + 1), 16);
        a += b64map.charAt(e << 2)
    } else {
        if (b + 2 == d.length) {
            e = parseInt(d.substring(b, b + 2), 16);
            a += b64map.charAt(e >> 2) + b64map.charAt((e & 3) << 4)
        }
    }
    if (b64pad) {
        while ((a.length & 3) > 0) {
            a += b64pad
        }
    }
    return a
}
JsEncrypt.prototype.encryptLong = function(string:any) {  
    var k = this.getKey();
            try {
                var lt = "";
                var ct = "";
                //RSA每次加密117bytes，需要辅助方法判断字符串截取位置
                //1.获取字符串截取点
                var bytes = new Array();
                bytes.push(0);
                var byteNo = 0;
                var len, c;
                len = string.length;
                var temp = 0;
                for (var i = 0; i < len; i++) {
                    c = string.charCodeAt(i);
                    if (c >= 0x010000 && c <= 0x10FFFF) {
                        byteNo += 4;
                    } else if (c >= 0x000800 && c <= 0x00FFFF) {
                        byteNo += 3;
                    } else if (c >= 0x000080 && c <= 0x0007FF) {
                        byteNo += 2;
                    } else {
                        byteNo += 1;
                    }
                    if ((byteNo % 117) >= 114 || (byteNo % 117) == 0) {
                        if (byteNo - temp >= 114) {
                            bytes.push(i);
                            temp = byteNo;
                        }
                    }
                }
                //2.截取字符串并分段加密
                if (bytes.length > 1) {
                    for (var i = 0; i < bytes.length - 1; i++) {
                        var str;
                        if (i == 0) {
                            str = string.substring(0, bytes[i + 1] + 1);
                        } else {
                            str = string.substring(bytes[i] + 1, bytes[i + 1] + 1);
                        }
                        var t1 = k.encrypt(str);
                        ct += t1;
                    }
                    ;
                    if (bytes[bytes.length - 1] != string.length - 1) {
                        var lastStr = string.substring(bytes[bytes.length - 1] + 1);
                        ct += k.encrypt(lastStr);
                    }
                    return hex2b64(ct);
                }
                var t = k.encrypt(string);
                var y = hex2b64(t);
                return y;
            } catch (ex) {
                return false;
            }
  };
  //超长字符串解密
  //两个转换函数
  function hexToBytes(hex:any) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}
function bytesToHex(bytes:any) {
    for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
    }
    return hex.join("");
}
  var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
  function int2char(a:any) {
    return BI_RM.charAt(a)
}
  function b64tohex(f:any) {
    var d = "";
    var e;
    var b = 0;
    var c:any;
    var a;
    for (e = 0; e < f.length; ++e) {
        if (f.charAt(e) == b64pad) {
            break
        }
        a = b64map.indexOf(f.charAt(e));
        if (a < 0) {
            continue
        }
        if (b == 0) {
            d += int2char(a >> 2);
            c = a & 3;
            b = 1
        } else {
            if (b == 1) {
                d += int2char((c << 2) | (a >> 4));
                c = a & 15;
                b = 2
            } else {
                if (b == 2) {
                    d += int2char(c);
                    d += int2char(a >> 2);
                    c = a & 3;
                    b = 3
                } else {
                    d += int2char((c << 2) | (a >> 4));
                    d += int2char(a & 15);
                    b = 0
                }
            }
        }
    }
    if (b == 1) {
        d += int2char(c << 2)
    }
    return d
}
  JsEncrypt.prototype.decryptLong = function (string:any) {
    var k = this.getKey();
    var MAX_DECRYPT_BLOCK = 128;
    try {
        var ct = "";
        var t1;
        var bufTmp;
        var hexTmp;
        var str = b64tohex(string);
        var buf = hexToBytes(str);
        var inputLen = buf.length;
        //开始长度
        var offSet = 0;
        //结束长度
        var endOffSet = MAX_DECRYPT_BLOCK;

        //分段加密
        while (inputLen - offSet > 0) {
            if (inputLen - offSet > MAX_DECRYPT_BLOCK) {
                bufTmp = buf.slice(offSet, endOffSet);
                hexTmp = bytesToHex(bufTmp);
                t1 = k.decrypt(hexTmp);
                ct += t1;
                
            } else {
                bufTmp = buf.slice(offSet, inputLen);
                hexTmp = bytesToHex(bufTmp);
                t1 = k.decrypt(hexTmp);
                ct += t1;
             
            }
            offSet += MAX_DECRYPT_BLOCK;
            endOffSet += MAX_DECRYPT_BLOCK;
        }
        return ct;
    } catch (ex) {
        return false;
    }
};
// 实例化一个JSEncrypt对象
let jse = new JsEncrypt()
export function Encrypt(str:any){
    jse.setPublicKey(`-----BEGIN PUBLIC KEY-----
    MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCZwktt2YL3jcPzpww5sD3o/LThEhTymBlM7IEbCOs3pu1RCzRnts5gTDnuQKv5sjEBMV3EoITUkDX/HRLGi+IzLlLSY4jrf4X03miUClMUIBqUOLm84KNGf4CEYOsVc7uD8oErAxalpoXycaIRuQS5gFIED5CL+oL/X+E/xgOrpQIDAQAB
    -----END PUBLIC KEY-----`)
    let encrypted = jse.encryptLong(str)
    return encrypted;
}
export function Decrypt(str:any){
    jse.setPrivateKey(`-----BEGIN RSA PRIVATE KEY-----
    MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAJL8IPahtW4Q8qrrf8c3RdqSwUEsqXYdMj7+WJlfvwLwKOtug9LLILkYrIIBbc0ywLE5BCmqHUGZ8V+lRGzulBJZ/hmJSjCe40NbACxIprUThZl7o4e7npUIJwC6Zdn8CjQ3lZiX1NXWQ6pkTuUUcR0SAN9pohTSq+NLKOPeNIk9AgMBAAECgYBMGhbHG3rgfg3myP/jmY6lWI6OvB0RdpRpYS9mWdiAIPBO1W2TWnCa5VeMCEldkQWLvMWW/Okg6h+7Mcp3zB8FhtKwsNSXZhFz6du5dtGGqSZUUqJj6dFrbAWKxwuGCSawAIsRqiSrhLGbWho8KMHWIqZ7Z0pLftyA1nCY0pnbAQJBAN0b8JDGIyj2Lx16OeufkdJNHWc6uad4kXwPg2rwK6otNSU9lWSmbN/Sbjdikt8VhCxDRvBBTt9SpLyMC+QouzECQQCqLdHpLPzAjMQfd/q70xmEa2n+7q+BvrSHxN8Ft6wNJHq3fB5xB1EkVabq0kKsouqOMIcy7gP1KMff/e6OUhPNAkBZoOfFZ+v8wL6cjl1IPCjaPNQ8cjurvV4MEiXNhYnNtAGlFO+oGyZrHFv9K4Ip2Aj6AFOTNIYKVO/eVk7DsBchAkA39WUm1YIvFpqO9nbeOCYV4vQxve68LSdT1aq4SJMspygrGYcxB4To+7ktUgJWniOeqdprJtTqUoSW5PsClX6pAkEAtgXjuFdrPSHywEfuKZgEuIJOwVVQjutj6GCb5DgiwMM5Gmlg3+m/CMDWcHygTtcAzTcEHaFC92nDBlgfThV1kw==
    -----END RSA PRIVATE KEY-----`)
    let encrypted = jse.decryptLong(str)
    return encrypted;
}