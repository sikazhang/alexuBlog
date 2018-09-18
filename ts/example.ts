
let name: string = 'muyy'
let isBool1: boolean = false
let number: number = 10;
let arr: number[] = [1,2,3,4]
enum Role {Employee = 3,Manager,Admin}
let role: Role = Role.Employee
console.log(role)
let notSure:any = 10
let notSure2:any[] = [1,'2',false]
function alertName():void{
    console.log('my name')
}
//函数
let add3 = function(x:string,y:string):string{
    return 'hello typescript'
}
//可选参数和默认参数
function buildname(firstName:string,lastname?:string){
    console.log(lastname?firstName+''+lastname:firstName)
}
//默认参数出现在必须参数前面，用户必须明确的传入undefined来获得默认值。
function buildname2(firstName = 'ming',lastName?:string){
    console.log()
}
buildname2(undefined,'人')

//类：本质上是es6的知识
class Person{
    name:string;//对this.name类型的定义
    age:number;
    constructor(name:string,age:number){
        this.name = name;
        this.age = age 
    }
    print(){
        return this.name + this.age
    }
}
let person:Person = new Person('muyy',23)
console.log(person.print())

//继承
class Person{
    public name:string;//类访问修饰符，默认为public。
    age:number;
    constructor(name:string,age:number){
        this.name = name;
        this.age = age;
    }
    tell(){
        console.log(this.name+this.age)
    }
}

class Student extends Person{
    gender:string;
    constructor(gender:string){
        super('muyy',23)
        this.gender = gender
    }
    tell(){
        console.log(this.name + this.age + this.gender)
    }
}

var student = new Student('male')
student.tell()

//通过getter/setters来截取对象成员的访问，它能帮助你有效的控制对象成员的访问。
class Hello{
    private _name:string;
    private _age:number;
    get name():string{
        return this._name
    }
    set name(value:string){
        this._name = value
    }
    get age():number{
        return this._age
    }
    set age(age:number){
        if(age>0 && age<100){
            console.log('age should be between 0 and 100')
            return
        }
        this._age = age
    }
}
let hello = new Hello()
hello.name = 'muyy'
hello.age = 23
console.log(hello.name)

//接口：对值所具有的结构进行类型检查，在typescript里，借口的作用就是为这些类型命名和为你的代码或第三方代码定义契约。
interface LabelValue{
    label:string
}
function printLabel(labelObj:LabelValue){
    console.log(labelObj.label)
}
let myObj = {
    'label':'hello Interface'
}
printLabel(myobj)//没有顺序
//可选属性
//带有可选属性的接口与普通的接口定义差不多，？
//可以捕获引用了不存在的属性时的错误
interface Person{
    name?:string;
    age?:number;
}
function printInfo(info:Person){
    console.log(info)
}
let info = {
    "name":"muyy",
    "age":23
};

printInfo(info); // {"name": "muyy", "age": 23}

let info2 = {
    "name":"muyy"
};

printInfo(info2); // {"name": "muyy"}
//函数类型
interface SearchFunc{
    (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string,subString: string){
    return source.search(subString) !== -1;
};

console.log(mySearch("鸣人","鸣")); // true
console.log(mySearch("鸣人","缨")); // false

//可索引类型
interface StringArray{
    [index:number]:string
}
let MyArray:StringArray;
MyArray = [1,2,3,4]
console.log(MyArray[2])
//类类型
//在接口中描述一个方法，在类里实现它
interface ClockInterface{
    currentTime: Date;
    setTime(d: Date);
}

class Clock implements ClockInterface{
    currentTime: Date;
    setTime(d: Date){
        this.currentTime = d;
    }
    constructor(h: number, m: number) {}
}
//继承接口
interface shape{
    color:string
}
interface PenStroke{
    penWidth: number;
}

interface Square extends Shape,PenStroke{
    sideLength: number;
}
let s = <Square>{};
s.color = "blue";
s.penWidth = 100;
s.sideLength = 10;

//模块
//TypeScript 与 ECMAScript 2015 一样，任何包含顶级 import 或者 export 的文件都被当成一个模块

export interface StringValidator{
    isAcceptable(s:string): boolean;
}

var strReg = /^[A-Za-z]+$/;
var numReg = /^[0-9]+$/;

export class letterValidator implements StringValidator{
    isAcceptable(s:string): boolean{
        return strReg.test(s);
    }
}

export class zipCode implements StringValidator{
    isAcceptable(s: string): boolean{
        return s.length == 5 && numReg.test(s);
    }
}
//范型
//适用于多个类型