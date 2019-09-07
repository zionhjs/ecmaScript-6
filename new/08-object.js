//ES6允许直接写入变量和函数 作为对象的属性和方法 
const foo = 'bar';
const baz = {foo};
baz //{foo:'bar'}
//等同于
const baz = {foo:foo};

//方法简写
const o = {
    method: function(){
        return 'Hello!';
    }
};

let birth = '2000/01/01';
const Person = {
    name: 'david',
    birth,
    hello(){
        console.log('my name is', this.name);
    }
};

//属性名表达式
Object.foo = true;
obj['a' + 'bc'] = 123;

//ES6允许字面量的方式定义对象(使用大括号)
let proKey = 'foo';
let obj = {
    [propKey]:true,
    ['a' + 'bc']: 123
};
//另一个例子
let lastWord = 'last word';

const a = {
    'first word':'hello',
    [lastWord]:'world'
};
a['first word'] //hello
a[lastWord]  //"world"
a['last word'] //"world"

//表达式还可以用于定义方法名
let obj = {
    ['h' + 'ellp'](){
        return 'h1';
    }
};
obj.hello()  //hi

//属性表达式 如果是一个对象 默认情况下会自动将对象转为字符串[object, Object] 
const keyA = {a:1};
const keyB = {b:2};

const myObject = {
    [keyA]:'valueA',
    [keyB]:'valueB'
};
myObject   //Object{[object Object :"valueB"}
//这里为什么只有一个 valueB呢？因为[keyA]和[keyB]返回的都是[object Object], 而后者会把前者覆盖掉  而最后myObject对象只有一个object属性

//方法的name属性
//函数的name属性返回函数名 对象方法也是函数 因此也有name属性
const person = {
    sayName(){
        console.log('hello!');
    },
};
person.sayName.name   //"sayName"

//如果对象的方法使用了取值函数getter和存值函数setter 则name属性不是在该方法上面 而是该方法的属性描述对象的get set属性上面 返回值是方法名加上get和set
const obj = {
    get foo(){},
    set foo(x){}
},

obj.foo.name
// TypeError: Cannot read property 'name' of undefined

const descriptor = Object.getOwnPropertyDescriptor(obj, 'foo');

descriptor.get.name   //"get foo"
descriptor.set.name   //"set foo"

//有两种特殊情况 bind方法创造的函数 name属性返回bound加上原函数的名字 Functrion构造函数创造的函数 name属性返回anonymous
(new Function()).name   //anonymous

var doSomething = function(){
    //...
};
doSomething.bind()().name   //'bound doSomething'

//如果对象的方是一个Symbol值 那么name属性返回的是这个Symbol值的描述
const key1 = Symbol('description');
const key2 = Symbol();
let obj = {
    [key1](){},
    [key2](){},
};
obj[key1].name   //"[description]"
obj[key2].name  //""

//Object.is() 用来比较两个值是否严格相等 与严格比较运算符(===)的行为基本一直
Object.is('foo','foo');   //true
Object.is({}, {});  //false
//不同之处只有两个 +0不等于-0  NaN等于自身
+0 === -0 //true
NaN === NaN //false

Object.is(+0, -0)   //false
Object.is(NaN, NaN)   //true

// Object.assign()
// Object.assign() 方法用于对象的合并 将源对象(source)的所有可枚举属性 复制到目标对象(target)
const target = { a:1 };
const source1 = { b:2 };
const source2 = { c:3 };

Object.assign(target, source1, source2);
target //{a:1, b:2, c:3}
//Object.assign方法的第一个参数是目标对象 后面的参数都是源对象
//如果目标对象与源对象有同名属性 或多个源对象有同名属性 则后面的属性会覆盖前面的属性
const target = { a:1, b:1};
const source1 = { b:2, c:2};
const source2 = { c:3};

Object.assign(target, source1, source2);
target //{a:1, b:2, c:3}

//如果参数不是对象 则会先转问对象 然后返回
typeof Object.assign(2)  //"object"

//由于undefined 和 null 无法转换为对象 所以如果它们作为参数 就会报错
Object.assign(undefined)  //TypeError: Cannot convert undefined or null to object
Object.assign(null)  //TypeError: Cannot convert undefined or null to object
//如果非对象参数出现在源对象的位置 那么处理规则有所不同 首先这些参数都会转成对象 如果无法转换 则跳过 这意味着 undefined和null 不在首参数 就不会报错
let obj = {a:1};
Object.assign(obj, undefined) === obj   //true
Object.assign(obj, null) === obj  //true

//其他类型的值 数值，字符串和布尔值 不在首参数 也不会报错。但是，除了字符串会以数组的形式 拷贝入目标对象 其他值都不会产生效果
const v1 = 'abc';
const v2 = true;
const v3 = 10;

const obj = Object.assign({}, v1 ,v2 ,v3);  //v2 和 v3不会产生效果 因为它们不是字符串
console.log(obj);  //{'0':'a', '1':'b', '2':'c'}

Object('abc'); // => {0: "a", 1: "b", 2: "c", length: 3, [[PrimitiveValue]]: "abc"}  //原因在此

//Object.assign拷贝的属性是有限制的 只拷贝源对象的自身属性,也不拷贝不可枚举的属性
Object.assign({b:'c'}, Object.defineProperty({}, 'invisible',{
    enumerable:false,
    value:'hello'
}))
//{b:'c'}  //因为enumerable:false

//属性名为Symbol值的属性 也会被Object.assign拷贝s
Object.assign({a:'b'},{[Symbol('c')]:d})
//{a:'b', Symbol(c):'d'}

//Object.assign()是浅拷贝 如果源对象的某个属性是对象那么目标对象得到的是这个对象的引用
const obj1 = {a:{b:1}};
const obj2 = Object.assign({}, obj1);

obj1.a.b = 2;
obj2.a.b  //2

//同名属性的替换
//对于这种嵌套对象 一旦遇到同名属性 Object.assign的处理方法是替换 而不是添加
const target = {a:{b:'c', d:'e'}}
const source = {a:{b:'hello'}}
Object.assign(target, source)  //{a:{b:'hello}}  //d:'e'就被替换掉了

//数组的处理
//Object.assign可以用来处理数组 但是会把数组视为对象
Object.assign([1,2,3],[4,5])  //[4,5,3]  //被按index顺序覆盖掉了

//取值函数的处理
// Object.assign只能进行值的复制 如果复制的值是一个取值函数 那么将求值后再复制
const source = {
    get foo(){return 1}
};
const target = {};

Object.assign(target, source)   //{foo:1}

//常见的应用
//1.为对象添加属性
const Point{
    constructor(x,y){
        Object.assign(this, {x,y});
    }
}
//2.为对象添加方法
Object.assign(SomeClass.prototype,{
    someMethod(arg1, arg2){
        //...
    },
    anotherMethod(){
        //...
    }
});

//等同于下面的写法
SomeClass.prototype.someMethod = function (arg1, arg2){
    //...
};
SomeClsss.prototype.anotherMethod = function(){
    //...
};

//克隆对象
function clone(origin){
    return Object.assign({}, origin);
}

//合并多个对象
//将多个对象合并到某个对象
const merge = (target, ...source) => Object.assign(target, ...source);

//为属性指定默认值
const DEFAULTS = {
    logLevel:0, 
    outputFormat:'html'
};
function processContent(options){
    options = Object.assign({}, DEFAULTS, options);
    console.log(options);
}
//DEFAULTS是默认值 options是用户提供的参数 将两者合成一个新对象

//属性的可枚举性和遍历
//可枚举性
//对象的每个属性都有一个描述对象(Descriptor), 用来控制该属性的行为 Object.getOwnPropertyDescriptor方法可以获取该属性的描述对象
let obj = {foo:123};
Object.getOwnPropertyDescriptor(obj, 'foo')
// {value: 123, writable: true, enumerable: true, configurable: true}
//有四个操作会忽略enumerable为false的属性
//for...in循环:只遍历对象自身的和继承的可枚举属性
//Object.keys():返回对象自身的所有可枚举属性的键名
//JSON.stringigy():只串行化对象自身的可枚举属性
//Object.assign():忽略enumerable为false属性 只拷贝对象自身的可枚举属性

//其中只有for...in会返回继承的属性 其他三个方法都会忽略继承的属性 只处理对象自身的属性

//属性的遍历
//1.for...in
// for...in循环遍历对象自身的和继承的可枚举属性(不含Symbol属性)

//2.Object.keys(obj)
//Object.keys 返回一个数组 包含对象自身的所有可枚举属性的键名

//3.Object.getOwnPropertyNames(obj)
//Obkect.getOwnPropertyNames(obj) 返回一个数组 包含对象自身的所有属性(不包含Symbol属性，但是包括不可枚举属性)键名

//4.Object.getOwnPropertySymbols(obj)
//Object.getOwnPropertySymbols返回一个数组 包含对象自生的所有Symbol属性键名

//5.Reflect.ownKeys(obj)
//Reflect.ownKeys返回一个数组 包含对象自身的所有键名 不管键名是Symbol还是字符串 也不管是否可枚举
//以上5种方法遍历对象的键名，都遵循同样的属性遍历的次序规则
//首先遍历所有数值键 按照数值生序排列, 其次遍历所有字符串键 按照加入时间生序排列, 最后遍历所有Symbol键 按照加入时间生序排列

//Object.getOwnPropertyDescriptors()
//次方法返回某个对象属性的描述对象(descriptors) 
const obj = {
    foo:123,
    get bar(){return 'abc'}
};

Object.getOwnPropertyDescriptors(obj);
//{foo: {…}, bar: {…}}
//上述方法返回一个对象 所有原对象的属性名都是该对象的属性名 对应的属性值就是该属性的描述对象

//该方法的函数实现
function getOwnPropertyDescriptor(obj){
    const result = {};
    for(let key of Reflect.ownKeys(obj)){
        result[key] = Object.getOwnPropertyDescriptor(obj, key);
    }
    return result;
}

//__proto__属性 Object.setPrototypeOf(), Object.getPrototypeOf()




