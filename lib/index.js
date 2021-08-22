var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // 15位号码正则匹配
    var len_15 = /^\d{15}$/i;
    // 18位号码正则匹配
    var len_18 = /^\d{17}[0-9x]$/i;
    /**
     * 地区码映射表
     */
    var addMap = { "11": "北京", "12": "天津", "13": "河北省", "14": "山西省", "15": "内蒙古", "21": "辽宁省", "22": "吉林省", "23": "黑龙江省", "31": "上海", "32": "江苏省", "33": "浙江省", "34": "安徽省", "35": "福建省", "36": "江西省", "37": "山东省", "41": "河南省", "42": "湖北省", "43": "湖南省", "44": "广东省", "45": "广西", "46": "海南省", "50": "重庆", "51": "四川省", "52": "贵州省", "53": "云南省", "54": "西藏", "61": "陕西省", "62": "甘肃省", "63": "青海省", "64": "宁夏", "65": "新疆", "71": "台湾省", "81": "香港特别行政区", "82": "澳门特别行政区" };
    /**
     * 省级地址码校验
     * @param val 地区码（2位）
     * @returns boolean
     */
    var checkProv = function (val) { return !!(/^[1-9][0-9]/.test(val) && addMap[val]); };
    /**
     * 日期校验
     * @param val
     * @returns
     */
    var checkDate = function (val) {
        var pattern = /^(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/;
        if (pattern.test(val)) {
            var year = val.substring(0, 4);
            var month = val.substring(4, 6);
            var date = val.substring(6, 8);
            var date2 = new Date(year + "-" + month + "-" + date);
            if (date2 && date2.getFullYear() == (parseInt(year)) && date2.getMonth() == (parseInt(month) - 1) && date2.getDate() == (parseInt(date))) {
                return true;
            }
        }
        return false;
    };
    /**
     * 18位身份证校验算法
     * @param val
     * @returns
     */
    var checkCode = function (val, isX) {
        if (isX === void 0) { isX = false; }
        var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
        var code = val.substring(17);
        if (p.test(val)) {
            var sum = 0;
            for (var i = 0; i < 17; i++)
                sum += Number(val[i]) * factor[i];
            if (parity[sum % 11] == code.toUpperCase())
                return true;
            if (isX) {
                console.log(val, parity[sum % 11]);
            }
        }
        return false;
    };
    var Card = /** @class */ (function () {
        function Card(id, isInfo) {
            /**
             * 解析信息
             */
            this.info = {
                valid: false
            };
            this._id = id;
            this._isInfo = isInfo;
            // this.isValid()
        }
        /**
         *
         * @returns 验证过程
         */
        Card.prototype.isValid = function () {
            var _a = this, _id = _a._id, _isInfo = _a._isInfo;
            // 不存在身份证号
            if (typeof _id !== "string")
                return this.back();
            // 18
            if (len_18.test(_id)) {
                if (this.initDate(18))
                    this.info.valid = true;
                return this.back();
            }
            else if (len_15.test(_id)) {
                if (this.initDate(15))
                    this.info.valid = true;
                return this.back();
            }
            else {
                return this.back();
            }
        };
        /**
         * 根据状态返回
         */
        Card.prototype.back = function () {
            return this._isInfo ? this.info : this.info.valid;
        };
        /**
         * 初始化数据
         * @param len
         */
        Card.prototype.initDate = function (length) {
            //身份证
            // let ids: any = this._id.split("");
            var id = this._id;
            // 身份证类型
            var len = length === 15 ? 0 : 2; // 15或18
            //年份
            var y = (len ? '' : '19') + id.substring(6, 8 + len);
            //月份
            var m = id.substring(8 + len, 10 + len);
            //日
            var d = id.substring(10 + len, 12 + len);
            //性别
            var sex = Number(id.substring(14, 15 + len)) % 2 === 0 ? "女" : "男";
            var province = addMap[id.slice(0, 2)] || '_';
            // 出生日期错误
            var dd = "" + y + m + d;
            if (!checkDate(dd))
                return;
            // 地区错误
            if (!checkProv(id.substring(0, 2)))
                return;
            this.info = __assign(__assign({}, this.info), { id: id, length: length, y: y, m: m, d: d, sex: sex, province: province });
            return checkCode(this._id, false);
        };
        /**
         * version SDK版本号
         * @type {String}
         */
        Card.version = 'v0.0.1';
        return Card;
    }());
    exports.default = Card;
});
