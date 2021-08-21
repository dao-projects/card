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
    // info 身份证信息解析对象
    var info = {
        y: "1900",
        m: "01",
        d: "01",
        sex: "male",
        valid: false,
        length: 0
    };
    /**
     * 身份证验证及解析
     * @example
     * 		const Card = require('@dao/card').default
     * 		const card=new Card('513022199509151234')
     * 		console.log('静态方法：',Card.version)
     * 		console.log('实例方法_id：',card._id)
     * 		console.log(card.getId)
     * 		card.setId='111111111'
     * 		console.log(card.getId)
     * 		card.isValid()
     */
    var Card = /** @class */ (function () {
        /**
         * 定义一个构造器
         * @param {string}  _id     身份证号
         * @param {boolean} _isInfo 是否返回身份证解析信息
         */
        function Card(_id, _isInfo) {
            this._id = _id;
            this._isInfo = _isInfo;
        }
        Object.defineProperty(Card.prototype, "getId", {
            /**
             * get 方法
             * cardId 获取身份证
             * @return {string}  返回身份证ID号
             */
            get: function () {
                return this._id;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Card.prototype, "setId", {
            /**
             * set方法
             * cardId 设置身份证
             * @param {string} id 传入身份证ID号
             */
            set: function (id) {
                this._id = id;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * 根据条件返回身份证解析信息
         */
        Card.prototype.back = function () {
            return this._isInfo ? info : info.valid;
        };
        /**
         * initDate  初始化身份证信息
         * @param {number} length 身份证号码长度
         */
        Card.prototype.initDate = function (length) {
            //身份证号码
            var id = this._id;
            // 身份证类型
            var a = length === 15 ? 0 : 2; // 15:18
            var temp, y, m, d, sex;
            //身份证长度
            info.length = length;
            //年份
            y = (a ? "" : "19") + id.substring(6, 8 + a);
            //月份
            m = id.substring(8 + a, 10 + a);
            //日
            d = id.substring(10 + a, 12 + a);
            //性别
            sex = Number(id.substring(14, 15 + a)) % 2 === 0 ? "女" : "男";
            temp = new Date(Number(y), Number(m) - 1, Number(d));
            info = __assign(__assign({}, info), { y: y, m: m, d: d, sex: sex, length: length });
            return (temp.getFullYear() == Number(y) * 1) && (temp.getMonth() + 1 == Number(m) * 1) && (temp.getDate() == Number(d) * 1);
        };
        /**
         * isValid 身份证检验方法
         */
        Card.prototype.isValid = function () {
            var id = this._id;
            if (typeof id !== "string")
                return this.back();
            // 18
            if (/^\d{17}[0-9x]$/i.test(id)) {
                if (!this.initDate(18))
                    return this.back();
                var ids = id.toLowerCase().split("");
                var wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2], y = "10x98765432".split(""), sum = 0;
                for (var i = 0; i < 17; i++)
                    sum += wi[i] * ids[i];
                if (y[sum % 11] === ids.pop().toLowerCase())
                    info.valid = true;
                return this.back();
            }
            // 15
            else if (/^\d{15}$/.test(id)) {
                if (this.initDate(15))
                    info.valid = true;
                return this.back();
            }
            else {
                return this.back();
            }
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
