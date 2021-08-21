interface R{
	y:any,
    m:any,
    d:any,
    sex:string | "male",
    valid: boolean | false,
    length: number | 0
}


// 验证参数
interface Params{
	// 身份证号码
	_id:string,	
	// 是否返回身份证解析信息
	_isInfo?:boolean | false
}

// info 身份证信息解析对象
let info:R={
    y: "1900",
    m: "01",
    d: "01",
    sex: "male",
    valid: false,
    length: 0
}
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
class Card{
	/**
	 * _id  身份证号私有属性（自己类的内部进行访问）
	 * @type {string}
	 */
	private _id:string;
	/**
	 * _isInfo 返回身份证解析信息（自己类的内部进行访问）
	 * @type {boolean}
	 */
	private _isInfo:boolean;

	/**
	 * version SDK版本号
	 * @type {String}
	 */
	static version='v0.0.1';

	/**
	 * 定义一个构造器
	 * @param {string}  _id     身份证号
	 * @param {boolean} _isInfo 是否返回身份证解析信息
	 */
	constructor(_id:string,_isInfo:boolean){
		this._id=_id;
		this._isInfo=_isInfo
	}

	/**
	 * get 方法
	 * cardId 获取身份证
	 * @return {string}  返回身份证ID号
	 */
	get getId():string{
		return this._id;
	}


	/**
	 * set方法
	 * cardId 设置身份证
	 * @param {string} id 传入身份证ID号
	 */
	set setId(id:string){
		this._id=id;
	}

	/**
	 * 根据条件返回身份证解析信息
	 */
	back() {
        return this._isInfo ? info : info.valid;
    }

    /**
     * initDate  初始化身份证信息
     * @param {number} length 身份证号码长度
     */
	initDate(length:number) {
		//身份证号码
		const id=this._id;
		// 身份证类型
		const a = length === 15 ? 0 : 2; // 15:18
		let temp,y,m,d,sex;
		//身份证长度
	 	info.length = length;
	 	//年份
	 	y= (a ? "" : "19") + id.substring(6, 8 + a)
	 	//月份
		m = id.substring(8 + a, 10 + a)
		//日
		d = id.substring(10 + a, 12 + a)
		//性别
		sex = Number(id.substring(14, 15 + a)) % 2  === 0 ? "女" : "男";
		temp = new Date(Number(y),Number(m)-1,Number(d))
		info={
			...info,
			y,
			m,
			d,
			sex,
			length
		}
		return (temp.getFullYear() == Number(y) * 1) && (temp.getMonth() + 1 ==Number(m) * 1) && (temp.getDate() == Number(d) * 1)
	}
	/**
	 * isValid 身份证检验方法
	 */
	isValid(){
		let id=this._id;
		if (typeof id !== "string") return this.back();
		// 18
		if (/^\d{17}[0-9x]$/i.test(id)) {
			if (!this.initDate(18)) return this.back();
			let ids:any = id.toLowerCase().split("");
			var wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
			y = "10x98765432".split(""),
			sum = 0;
			for (var i = 0; i < 17; i++) sum += wi[i] * ids[i];
			if (y[sum % 11] === ids.pop().toLowerCase()) info.valid = true;
			return this.back();
		}
		// 15
		else if (/^\d{15}$/.test(id)) {
			if (this.initDate(15)) info.valid = true;
			return this.back();
		} else {
			return this.back();
		}
	}

}
export default Card;