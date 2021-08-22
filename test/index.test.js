
var assert = require('assert').strict;
var Card = require('../lib/index').default

console.log('身份证no',new Card("513022199509151233").isValid())
console.log('身份证ok',new Card("513022199509151234").isValid())
console.log('身份证ok_info',new Card("173022199509151234",true).isValid())
console.log('身份证ok_info',new Card("513022199509151234",true).isValid())
console.log('身份证no_info',new Card("513022199519131234",true).isValid())
console.log('身份证no_info',new Card("16302219930910123",true).isValid())
console.log('身份证no',new Card().isValid())
console.log('身份证no',new Card())