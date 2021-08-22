// 15位号码正则匹配
const len_15 = /^\d{15}$/i;

// 18位号码正则匹配
const len_18 = /^\d{17}[0-9x]$/i;

/**
 * 地区码映射表
 */
const addMap: any = { "11": "北京", "12": "天津", "13": "河北省", "14": "山西省", "15": "内蒙古", "21": "辽宁省", "22": "吉林省", "23": "黑龙江省", "31": "上海", "32": "江苏省", "33": "浙江省", "34": "安徽省", "35": "福建省", "36": "江西省", "37": "山东省", "41": "河南省", "42": "湖北省", "43": "湖南省", "44": "广东省", "45": "广西", "46": "海南省", "50": "重庆", "51": "四川省", "52": "贵州省", "53": "云南省", "54": "西藏", "61": "陕西省", "62": "甘肃省", "63": "青海省", "64": "宁夏", "65": "新疆", "71": "台湾省", "81": "香港特别行政区", "82": "澳门特别行政区" }

/**
 * 省级地址码校验
 * @param val 地区码（2位）
 * @returns boolean
 */
const checkProv = (val: string) => !!(/^[1-9][0-9]/.test(val) && addMap[val])

/**
 * 日期校验
 * @param val 
 * @returns 
 */
const checkDate = (val: string) => {
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
}
/**
 * 18位身份证校验算法
 * @param val 
 * @returns 
 */
const checkCode = (val: string, isX: boolean = false) => {
	var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
	var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
	var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
	var code = val.substring(17);
	if (p.test(val)) {
		var sum = 0;
		for (var i = 0; i < 17; i++) sum += Number(val[i]) * factor[i];
		if (parity[sum % 11] == code.toUpperCase()) return true;
		if (isX) {
			console.log(val, parity[sum % 11])
		}
	}
	return false;
}

class Card {

	/**
 * _id  身份证号私有属性（自己类的内部进行访问）
 * @type {string}
 */
	private _id: string;
	/**
	 * _isInfo 返回身份证解析信息（自己类的内部进行访问）
	 * @type {boolean}
	 */
	private _isInfo: boolean;

	/**
	 * 解析信息
	 */
	private info: any = {
		valid: false
	};

	/**
	 * version SDK版本号
	 * @type {String}
	 */
	static version = 'v0.0.1';

	constructor(id: string, isInfo: boolean) {
		this._id = id;
		this._isInfo = isInfo;
		// this.isValid()
	}

	/**
	 * 
	 * @returns 验证过程
	 */
	isValid(): any {
		const { _id, _isInfo } = this
		// 不存在身份证号
		if (typeof _id !== "string") return this.back();
		// 18
		if (len_18.test(_id)) {
			if (this.initDate(18)) this.info.valid = true;
			return this.back();
		} else if (len_15.test(_id)) {
			if (this.initDate(15)) this.info.valid = true;
			return this.back();
		} else {
			return this.back();
		}
	}
	/**
	 * 根据状态返回
	 */
	back() {
		return this._isInfo ? this.info : this.info.valid;
	}
	/**
	 * 初始化数据
	 * @param len 
	 */
	initDate(length: number) {
		//身份证
		// let ids: any = this._id.split("");
		const id = this._id;
		// 身份证类型
		const len = length === 15 ? 0 : 2; // 15或18
		//年份
		const y = (len ? '' : '19') + id.substring(6, 8 + len)
		//月份
		const m = id.substring(8 + len, 10 + len)
		//日
		const d = id.substring(10 + len, 12 + len)
		//性别
		const sex = Number(id.substring(14, 15 + len)) % 2 === 0 ? "女" : "男";
		const province = addMap[id.slice(0, 2)] || '_';
		// 出生日期错误
		const dd = `${y}${m}${d}`;
		if (!checkDate(dd)) return;
		// 地区错误
		if (!checkProv(id.substring(0, 2))) return;
		this.info = {
			...this.info,
			id,
			length,
			y,
			m,
			d,
			sex,
			province
		};
		return checkCode(this._id, false)
	}

}

export default Card;