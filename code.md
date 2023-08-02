*****document.body.contentEditable = true

## 增强的strstr
知识点字符串

时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
C 语言有一个库函数： char *strstr(const char *haystack, const char *needle) ，实现在字符串 haystack 中查找第一次出现字符串 needle 的位置，如果未找到则返回 null。
现要求实现一个strstr的增强函数，可以使用带可选段的字符串来模糊查询，与strstr一样返回首次查找到的字符串位置。
可选段使用“[]”标识，表示该位置是可选段中任意一个字符即可满足匹配条件。比如“a[bc]”表示可以匹配“ab”或“ac”。
注意目标字符串中可选段可能出现多次。

输入描述：
与strstr函数一样，输入参数是两个字符串指针，分别是源字符串和目标字符串。

输出描述：
与strstr函数不同，返回的是源字符串中，匹配子字符串相对于源字符串地址的偏移（从0开始算），如果没有匹配返回-1。

补充说明：源字符串中必定不包含‘[]’；目标字符串中‘[]’必定成对出现，且不会出现嵌套。

输入的字符串长度在[1,100]之间。
示例1
输入：
abcd
b[cd]
输出：
1
说明：
相当于是在源字符串中查找bc或者bd，bc子字符串相对于abcd的偏移是1

解题思路：
将目标字符串中字符进行分割：

1、单独的字符作为单独的字符对象；单独的字符需要精确匹配

2、在中括号里面的字符作为一个完整的字符串对象；字符串只需要进行 contains 判断
// let yuan = readline();
// let mubiao = readline();
let yuan = "abcd";
let mubiao = "b[cd]";
 
let mubiaoList = [];
let temp = "";
//是否在中括号里面
let isKuohao = false;
for(let i=0; i<mubiao.length; i++){
    let c = mubiao.charAt(i);
    if((c == '[' || c == ']')){
        if(temp != ""){
            mubiaoList.push(temp);
            temp = "";
        }
        isKuohao = !isKuohao;
    }else if(isKuohao){
        //在中括号里面的则进行拼接（模糊查询）
        temp += c;
    }else {
        //不在中括号里面的需要精确匹配
        mubiaoList.push(c);
    }
}
 
let res = -1;
for(let i=0; i<yuan.length; i++){
 
    let s = yuan.charAt(i);
    //是否能够匹配
    let isMatch = true;
    if(s == mubiaoList[0]){
        //第一个字符对应上了
        //源字符串的索引
        let index = i + 1;
        //遍历目标字符串
        for(let j=1; j<mubiaoList.length; j++){
            let str = mubiaoList[j];
            if(index < yuan.length && str.includes(yuan.charAt(index))){
                //源字符串索引没有越界，且字符符合目标中的字符
                index ++;
            }else {
                isMatch = false;
                break;
            }
        }
        if(isMatch){
            res = i;
            break;
        }
    }
 
}
console.log(res);




##内存资源分配
知识点贪心编程基础

时间限制：1s 空间限制：32MB 限定语言：不限

题目描述：
有一个简易内存池，内存按照大小粒度分类，每个粒度有若干个可用内存资源，用户会进行一系列内存申请，需要按需分配内存池中的资源，返回申请结果成功失败列表。分配规则如下：
1、分配的内存要大于等于内存申请量，存在满足需求的内存就必须分配，优先分配粒度小的，但内存不能拆分使用。
2、需要按申请顺序分配，先申请的先分配。
3、有可用内存分配则申请结果为true，没有可用内存分配则返回false。
注：不考虑内存释放。
输入描述：
输入为两行字符串：
第一行为内存池资源列表，包含内存粒度数据信息，粒度数据间用逗号分割，一个粒度信息内部用冒号分割，冒号前为内存粒度大小，冒号后为数量。资源列表不大于1024，每个粒度的数量不大于4096
第二行为申请列表，申请的内存大小间用逗号分隔。申请列表不大于100000
如：
64:2,128:1,32:4,1:128
50,36,64,128,127

输出描述：
输出为内存池分配结果。
如：
true,true,true,false,false
示例1
输入：
64:2,128:1,32:4,1:128
50,36,64,128,127
输出：
true,true,true,false,false
说明：
内存池资源包含：64K共2个、128K共1个、32K共4个、1K共128个的内存资源；

针对50,36,64,128,127的内存申请序列，分配的内存依次是：64,64,128,NULL,NULL,第三次申请内存时已经将128分配出去，

因此输出结果是：true,true,true,false,false
解题思路：
1、使用map对象来存储内存粒子大小和其个数，并对粒子大小进行升序排序

2、对申请进行遍历，如果map中有大于等于其诉求的内存，且个数大于0，则为true
代码： 
// let string = readline().split(",");
// let application = readline().split(",").map(Number);
let string = "64:2,128:1,32:4,1:128".split(",");
let application = "50,36,64,128,127".split(",").map(Number);

//使用tree进行升序排序
/**
 * key：内存粒度大小
 * value：数量
 */
 let map = new Map();
for(let str of string){
    let strs = str.split(":").map(Number);
    map.set( strs[0], strs[1]);
}

var arrMap = Array.from(map);
arrMap.sort((a,b) => { return a[0] - b[0] })

let res = "";
for(let i=0; i<application.length; i++){

    let num = application[i];
    //不能分配资源
    let isFail = true;

    for(let j=0; j<arrMap.length; j++){
        if(arrMap[j][0] >= num && arrMap[j][1] > 0){
            //粒度大于等于申请，且内存个数大于0
            res += "true,";
            arrMap[j][1] --;
            isFail = false;
            break;
        }
    }

    if(isFail){
        res += "false,";
    }

}

console.log(res.substring( 0, res.length - 1));





## 跳房子I
知识点数组排序

时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
跳房子，也叫跳飞机，是一种世界性的儿童游戏。
游戏参与者需要分多个回合按顺序跳到第1格直到房子的最后一格。跳房子的过程中，可以向前跳，也可以向后跳。
假设房子的总格数是count，小红每回合可能连续跳的步数都放在数组steps中，请问数组中是否有一种步数的组合，可以让小红两个回合跳到最后一格？如果有，请输出索引和最小的步数组合。
注意：数组中的步数可以重复，但数组中的元素不能重复使用。提供的数据保证存在满足题目要求的组合，且索引和最小的步数组合是唯一的。
输入描述：
第一行输入为每回合可能连续跳的步数，它是int整数数组类型。实际字符串中整数与逗号间可能存在空格。

第二行输入为房子总格数count，它是int整数类型。

输出描述：
返回索引和最小的满足要求的步数组合（顺序保持steps中原有顺序）

补充说明：
count<=1000，0<=steps.length<=5000，-100000000<=steps[i]<=100000000

示例1
输入：
[1,4,5,2,2]
7
输出：
[5, 2]
示例2
输入：
[-1,2,4,9,6]
8
输出：
[-1, 9]
说明：
此样例有多种组合满足两回合跳到最后，譬如: [-1,9]，[2,6]，其中[-1,9]的索引和为0+3=3，[2,6]的索引和为1+4=5，所以索引和最小的步数组合[-1,9]
解题思路：
有两个注意点：

1、题目要求两步就要走完；

2、步数可以相同，但是不能重复使用；也就是说，两次可以走同步，但是索引肯定不能一样
代码： 
// let ints = readline().replace("[","")
//                              .replace("]","")
//                              .split(",").map(Number);
// let count = Number(readline());
let ints = "[1,4,5,2,2]".replace("[","")
                             .replace("]","")
                             .split(",").map(Number);
let count = Number("7");

/**
 * key：步数
 * value：步数的第一个索引和第二个索引（考虑到步数可以重复）
 */
 let map = new Map();
for(let i=0; i<ints.length; i++){
    let num = ints[i];
    if(map.has(num)){
        if(map.get(num).length == 1){
            map.get(num)[1] = i;
        }
    }else {
        let temp = [-1, -1];
        temp[0] = i;
        map.set( num, temp);
    }
}

let res = [];
let min = Number.MAX_VALUE;
for(let entry of map){
    //本次走的步数
    let a = entry[0];
    let indexs = entry[1];
    //剩余需要的步数（因为只允许两步）
    let b = count - a;
    //第一步的索引
    let countIndex = indexs[0];
    if(a == b){
        if(indexs[1] == -1){
            continue;
        }
        countIndex += entry[1][1];
    }else if(map.has(b)){
        countIndex += map.get(b)[0];
    }else {
        continue;
    }
    if(countIndex < min){
        min = countIndex;
        res = [a, b];
    }
}

console.log(res);




## 整型数组按个位值排序
知识点数组排序

时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
给定一个非空数组（列表），其元素数据类型为整型，请按照数组元素十进制最低位从小到大进行排序，十进制最低位相同的元素，相对位置保持不变。
当数组元素为负值时，十进制最低位等同于去除符号位后对应十进制值最低位。
输入描述：
给定一个非空数组，其元素数据类型为32位有符号整数，数组长度[1, 1000]

输出描述：
输出排序后的数组
示例1
输入：
1,2,5,-21,22,11,55,-101,42,8,7,32
输出：
1,-21,11,-101,2,22,42,32,5,55,7,8
解题思路：
就是通过最后一个字符进行升序排序。
代码： 
//let strings = readline().split(",");
let strings = "1,2,5,-21,22,11,55,-101,42,8,7,32".split(",");

strings.sort((a,b) => {
    //比最后一位数即可
    return a.charAt(a.length - 1) - b.charAt(b.length - 1);
});

console.log(strings);


## 二叉树遍历
知识点树

时间限制：1s 空间限制：64MB 限定语言：不限

题目描述：
根据给定的二叉树结构描述字符串，输出该二叉树按照中序遍历结果字符串。中序遍历顺序为：左子树，根结点，右子树。
输入描述：
由大小写字母、左右大括号、逗号组成的字符串：

1、字母代表一个节点值，左右括号内包含该节点的子节点。

2、左右子节点使用逗号分隔，逗号前为空则表示左子节点为空，没有逗号则表示右子节点为空。

3、二叉树节点数最大不超过100。

注：输入字符串格式是正确的，无需考虑格式错误的情况。

输出描述：
输出一个字符串，为二叉树中序遍历各节点值的拼接结果。

补充说明：
中序遍历是二叉树遍历的一种，遍历方式是首先遍历左子树，然后访问根结点，最后遍历右子树。
示例1
输入：
a{b{d,e{g,h{,i}}},c{f}}
输出：
dbgehiafc
说明：

中序遍历，首先遍历左子树，再访问根节点，最后遍历右子树，比如：

a有左子树，访问其左子树

b有左子树，访问其左子树

d没有左子树，读取值"d"

b的左子树已经访问，读取值“b”，再访问其右子树

e有左子树，访问其左子树

g没有左子树，读取其值“g”

e的左子树已经访问，读取值“e”，再访问其右子树

依次类推......

代码： 
//let str = readline();
let str = "a{b{d,e{g,h{,i}}},c{f}}";

class TreeNode{
    constructor(val) {
        this.val = val;
    }
}

//根节点
let rootNode = new TreeNode(str.charAt(0));
//树各子节点的队列
let stack = [];
stack.push(rootNode);
//初始化各节点
let currentNode = null;
//是否是左节点
let isLeft = true;
for(let i=1; i<str.length; i++){

    let c = str.charAt(i);
    if(c == '{'){
        if(currentNode != null){
            stack.push(currentNode);
        }
        isLeft = true;
    }else if(c == ','){
        //表示后面的应该是个右子节点
        isLeft = false;
    }else if(c == '}'){
        //右括号表示最后一个树节点已经完整了
        stack.pop();
    }else {
        currentNode = new TreeNode(c);
        if(isLeft){
            stack[stack.length - 1].left = currentNode;
        }else {
            stack[stack.length - 1].right = currentNode;
        }
    }
}

var res = "";
dfs( rootNode);

console.log(res);

/**
 * 中序输出二叉树
 * @param res
 * @param root
 */
function dfs( root) {
    if(root == null) {
        return;
    }
    //按照 左-打印-右的方式遍历
    dfs( root.left);
    res += root.val;
    dfs( root.right);
}



## 查找单入口空闲区域
 时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
给定一个 m x n 的矩阵，由若干字符 'X' 和 'O'构成，'X'表示该处已被占据，'O'表示该处空闲，请找到最大的单入口空闲区域。

解释：
空闲区域是由连通的'O'组成的区域，位于边界的'O'可以构成入口，单入口空闲区域即有且只有一个位于边界的'O'作为入口的由连通的'O'组成的区域。
如果两个元素在水平或垂直方向相邻，则称它们是“连通”的。
输入描述：
第一行输入为两个数字，第一个数字为行数m，第二个数字列数n，两个数字以空格分隔，1 <= m, n <= 200，
剩余各行为矩阵各行元素，元素为'X' 或 'O'，各元素间以空格分隔。
输出描述：
若有唯一符合要求的最大单入口空闲区域，输出三个数字，第一个数字为入口行坐标（范围为0~行数-1），第二个数字为入口列坐标（范围为0~列数-1），第三个数字为区域大小，三个数字以空格分隔；
若有多个符合要求的最大单入口空闲区域，输出一个数字，代表区域的大小；
若没有，输出NUL。
示例1
输入：
4 4

X X X X

X O O X

X O O X

X O X X

输出：
3 1 5

说明：
存在最大单入口区域，入口行坐标3，列坐标1，区域大小5

示例2
输入：
4 5

X X X X X

O O O O X

X O O O X

X O X X O

输出：
3 4 1

说明：
存在最大单入口区域，入口行坐标3，列坐标4，区域大小1

示例3
输入：
5 4

X X X X

X O O O

X O O O

X O O X

X X X X

输出：
NULL

说明：
不存在最大单入口区域

示例4
输入：
5 4

X X X X

X O O O

X X X X

X O O O

X X X X

输出：
3

说明：
存在两个大小为3的最大单入口区域，两个入口横纵坐标分别为1,3和3,3

解题思路：
通过回溯法求出所有满足的区域

在回溯的同时记录其入口坐标

        入口个数大于1则不符合要求；

        入口个数等于1时，判断其区域大小；如果存在多个区域，且区域大小相同，则

        只需记录其大小；其他情况则需要记录区域最大值和横纵坐标。

代码： 
// var m = Number(readline());
// var n = Number(readline());

var m = Number("5");
var n = Number("4");

var strings =  new Array(m).fill().map(() => Array(n).fill(0));

let test = ["X X X X","X O O O", "X O O O", "X O O X","X X X X"];
//let test = ["X X X X","X O O O", "X X X X", "X O O O","X X X X"];

var count = 0;
var rukou = new Array(2);
for(let i=0; i<m; i++){
    //let strInput = readline().split(" ");
    let strInput = test[i].split(" ");
    for(let j=0; j<n; j++){
        strings[i][j] = strInput[j];
    }
}

let max = 0;    //最大的区域大小
let quyu = new Array();   //最大区域的入口坐标和其区域大小的集合
for(let i=0; i<m; i++){
    for(let j=0; j<n; j++){
        if(strings[i][j] == "O"){
            strings[i][j] = "X";    //已经统计过的区域置为"X"
            let zuobiao = new Array();    //区域中的坐标集合
            zuobiao.push([ i, j]);
            qiuquyu( i, j, zuobiao);
            if(count == 1){  //只有一个入口的区域
                if(max == zuobiao.length){  //有大小相同的单入口空闲区域，只需要大小，无需坐标
                    quyu = [];
                }else if(max < zuobiao.length){
                    quyu = [];
                    quyu.push([rukou[0], rukou[1], zuobiao.length]);
                    max = zuobiao.length;
                }
            }
            count = 0;  //重置入口数量
            rukou = new Array(2);  //重置入口坐标
        }
    }
}

if(quyu.length == 1){
    let res = quyu[0];
    console.log(res[0] + " " + res[1] + " " + res[2]);
}else if(max != 0){
    console.log(max);
}else {
    console.log("NULL");
}

/**
 *
 * @param x     横坐标
 * @param y     纵坐标
 * @param list  区域内的坐标集合
 */
function qiuquyu( x, y, list){

    if(x==0 || x == m-1 || y ==0 || y == n-1){   //边界为入口坐标
        count++;  //入口的数量计数
        rukou[0] = x;
        rukou[1] = y;
    }

    if(x<m-1){
        if(strings[x+1][y] == "O"){
            strings[x+1][y] = "X";  //已经统计过的区域需要置为"X"，避免统计重复
            list.push([ x+1, y]);
            qiuquyu(x+1, y, list);
        }
    }
    if(x>0){
        if(strings[x-1][y] == "O"){
            strings[x-1][y] = "X";  //已经统计过的区域需要置为"X"，避免统计重复
            list.push([ x-1, y]);
            qiuquyu(x-1, y, list);
        }
    }
    if(y<n-1){
        if(strings[x][y+1] == "O"){
            strings[x][y+1] = "X";  //已经统计过的区域需要置为"X"，避免统计重复
            list.push([ x, y+1]);
            qiuquyu(x, y+1, list);
        }
    }
    if(y>0){
        if(strings[x][y-1] == "O"){
            strings[x][y-1] = "X";  //已经统计过的区域需要置为"X"，避免统计重复
            list.push([ x, y-1]);
            qiuquyu(x, y-1, list);
        }
    }
}

 满分答案：
//let input = readline().split(" ").map(Number);
let input = "4 5".split(" ").map(Number);
const m = input[0];
const n = input[1];
let ca = [];
let test = [
            "X O X X X",
            "X O X O X",
            "X O O O X",
            "X X X X X"
        ];
for (let i = 0; i < m; i++) {
    //ca[i] = readline().split(" ").map(Number);
    ca[i] = test[i].split(" ");
}

let maxCount = 0;
let map = new Map();
for (let j = 0; j < n; j++) {
    if (ca[0][j] == 'O') {
        let count = calc(copy(ca), 0, j, true);
        if (count > 0) {
            let key = 0 + " " + j;
            map.set(key, count);
            if (count > maxCount) {
                maxCount = count;
            }
        }
    }
    
    if (ca[m - 1][j] == 'O') {
        let count2 = calc(copy(ca), m - 1, j, true);
        if (count2 > 0) {
            let key = (m - 1) + " " + j;
            map.set(key, count2);
            if (count2 > maxCount) {
                maxCount = count2;
            }
        }
    }
}

for (let i = 1; i < m - 1; i++) {
    if (ca[i][0] == 'O') {
        let count = calc(copy(ca), i, 0, true);
        if (count > 0) {
            let key = i + " " + 0;
            map.set(key, count);
            if (count > maxCount) {
                maxCount = count;
            }
        }
    }
    
    if (ca[i][n - 1] == 'O') {
        let count2 = calc(copy(ca), i, n - 1, true);
        if (count2 > 0) {
            let key = i + " " + (n - 1);
            map.set(key, count2);
            if (count2 > maxCount) {
                maxCount = count2;
            }
        }
    }
}

let maxKey = "";
for (let e of map) {
    if (e[1] == maxCount) {
        if (maxKey == "") {
            maxKey = e[0];
        } else {
            maxKey = "more";
            break;
        }
    }
}

if (maxCount == 0) {
    console.log("NULL");
} else if (maxKey == "more") {
    console.log(maxCount);
} else {
    console.log(maxKey + " " + maxCount);
}

function copy( a) {
    let m = a.length;
    let n = a[0].length;
    let ca = [];
    for (let i = 0; i < m; i++) {
        ca[i] = a[i];
    }
    return ca;
}

function calc( ca, i, j, isRuKou) {
    if(!isRuKou) {
        if (i == 0 || i == ca.length - 1 || j == 0 || j == ca[0].length - 1) {
            return 0;
        }
    }
    
    ca[i][j] = 'X';
    let count = 1;
    
    if (j + 1 < ca[0].length && ca[i][j + 1] == 'O') {
        let count1 = calc(ca, i, j + 1, false);
        if (count1 == 0) {
            return 0;
        }
        count += count1;
    }
    
    if (i + 1 < ca.length && ca[i + 1][j] == 'O') {
        let count1 = calc(ca, i + 1, j, false);
        if (count1 == 0) {
            return 0;
        }
        count += count1;
    }
    
    if (j - 1 >= 0 && ca[i][j - 1] == 'O') {
        let count1 = calc(ca, i, j - 1,  false);
        if (count1 == 0) {
            return 0;
        }
        count += count1;
    }
    
    if (i - 1 >= 0 && ca[i - 1][j] == 'O') {
        let count1 = calc(ca, i - 1, j,  false);
        if (count1 == 0) {
            return 0;
        }
        count += count1;
    }
    
    return count;
}






## 文件目录大小
知识点递归

时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
一个文件目录的数据格式为：目录id，本目录中文件大小，(子目录id列表)。其中目录id全局唯一，取值范围[1,200]，本目录中文件大小范围[1,1000]，子目录id列表个数[0,10]
例如：1 20 (2,3）表示目录1中文件总大小是20，有两个子目录，id分别是2和3
现在输入一个文件系统中所有目录信息，以及待查询的目录 id ，返回这个目录和及该目录所有子目录的大小之和。
输入描述：
第一行为两个数字M，N，分别表示目录的个数和待查询的目录id，1 <= M <=100, 1<= N <=200
接下来M行，每行为1个目录的数据：目录id 本目录中文件大小 (子目录id列表)，子目录列表中的子目录id以逗号分隔。
 

输出描述：
待查询目录及其子目录的大小之和

示例1
输入：
3 1
3 15 ()
1 20 (2)
2 10 (3)
输出：
45
说明：
目录1大小为20，包含一个子目录2（大小为10），子目录2包含一个子目录3（大小为15），总的大小为20+10+15=45。

示例2
输入：
4 2
4 20 ()
5 30 ()
2 10 (4,5)
1 40 ()
输出：
60
说明：
目录2包含2个子目录4和5，总的大小为10+20+30 = 60

代码： 
//let input = readline().split(" ").map(Number);
let input = "3 1".split(" ").map(Number);

let M = input[0];
let N = input[1];

class Data{

    constructor( size, child) {
        this.size = size;
        this.child = child;
    }

}
var map = new Map();
let test = [
        "3 15 ()",
        "1 20 (2)",
        "2 10 (3)"
    ];
for(let i=0; i<M; i++){

    //let strings = readline().split(" ");
    let strings = test[i].split(" ");
    let id = Number(strings[0]);
    let size = Number(strings[1]);

    let childStr = strings[2].replace("(","").replace(")","");

    let child = [];
    if(childStr.length != 0){
        child = childStr.split(",").map(Number);
    }

    let data = new Data( size, child);
    map.set( id, data);
}

var count = 0;
handle(N);

console.log(count);

function handle( num){

    let temp = map.get(num);
    count += temp.size;
    for(let integer of temp.child){
        handle( integer);
    }

}




## 宜居星球改造计划
知识点广搜

 时间限制：1s 空间限制：32MB 限定语言：不限

题目描述：
        2XXX年，人类通过对火星的大气进行宜居改造分析，使得火星已在理论上具备人类宜居的条件；由于技术原因，无法一次性将火星大气全部改造，只能通过局部处理形式；假设将火星待改造的区域为row * column的网格，每个网格有3个值，宜居区、可改造区、死亡区，使用YES、NO、NA代替，YES表示该网格已经完成大气改造，NO表示该网格未进行改造，后期可进行改造，NA表示死亡区，不作为判断是否改造完成的宜居，无法穿过；
        初始化下，该区域可能存在多个宜居区，并且每个宜居区能同时在每个太阳日单位向上下左右四个方向的相邻格子进行扩散，自动将4个方向相邻的真空区改造成宜居区；请计算这个待改造区域的网格中，可改造区是否能全部变成宜居区，如果可以，则返回改造的太阳日天数，不可以则返回-1。
输入描述：
输入row * column个网格数据，每个网格值枚举值如下：YES，NO，NA；样例：

YES YES NO

NO NO NO

NA NO YES

输出描述：
可改造区是否能全部变成宜居区，如果可以，则返回改造的太阳日天数，不可以则返回-1。

补充说明：
grid[i][j]只有3种情况，YES、NO、NA
row == grid.length, column == grid[i].length, 1 <= row, column <= 8

示例1
输入：
YES YES NO

NO NO NO

YES NO NO

输出：
2

说明：
经过2个太阳日，完成宜居改造。



示例2
输入：
YES NO NO NO

NO NO NO NO

NO NO NO NO

NO NO NO NO

输出：
6

说明：
经过6个太阳日，可完成改造

示例3
输入：
NO NA

输出：
-1

说明：
 无改造初始条件，无法进行改造

示例4
输入：
YES NO NO YES

NO NO YES NO

NO YES NA NA

YES NO NA NO

输出：
-1

说明：
-1 // 右下角的区域，被周边三个死亡区挡住，无法实现改造

解题思路：
这道题看他罗里吧嗦说了一堆，其实不是很难。唯一需要注意的就是，当天被改造的区域无法在当天蔓延到周围。这里我们可以复制一个网格，用复制网格的数据表示当天是否被改造过了。

1、初始化 day 为天数，nototal 为 NO 区域的总数，coordinates 为当天待改造的区域坐标集合。

2、遍历网格，当网格为 YES 的时候，需要判断其四周是否为 NO；如果为 NO，则需要在coordinates 记录其坐标，同时将复制网格中此位置改为 YES，表示它是当天已经改造了，而原网格不变；

3、当所有网格遍历完成后，再通过 步骤1 所求的坐标将原网格中记录的各位置改为 YES；同时 nototal 需要减去 coordinates 的长度，表示剔除已经改造过的区域；day 需要加 1，代表已经过了一天。

代码： 
//待改造区域网格
let regions = [];
// while (line = readline()){
//     let input = line.split(" ");
//     regions.push(input);
//     regionsCopy.push(input);
// }
let index = 0;
let test = ["YES NO NO NO",
            "NO NO NO NO",
            "NO NO NO NO",            
            "NO NO NO NO"];
while (index < 4){
    let input = test[index].split(" ");
    //这里用于输出，实际机试中不需要
    regions.push(input);
    index ++;
}
//行
var row = regions.length;
//列
var col = regions[0].length;
//待改造的区域坐标
var coordinates = [];
//改造区网格
var regionsCopy = Array(row).fill().map(() => Array(col).fill(0));
//no区域的总数
let noTotal = 0;
for(let i=0; i<row; i++){
    for(let j = 0; j < col; j++){
        regionsCopy[i][j] = regions[i][j];
        if(regions[i][j] == "NO"){
            noTotal ++;
        }
    }
}

//是否需要改造
let isFlag = true;
//天数
let day = 0;
while ( noTotal != 0 && isFlag){

    for(let i=0; i<row; i++){
        for(let j=0; j<col; j++){
            if(regions[i][j] == "YES"){
                gaizao(i, j);
            }
        }
    }

    if(coordinates.length != 0){
        //有需要改造的区域
        for(let ints of coordinates){
            //根据坐标进行改造
            regions[ints[0]][ints[1]] = "YES";
        }
        //已改造区域剔除
        noTotal -= coordinates.length;
        coordinates = [];
        //天数加1
        day ++;
    }else {
        //没有需要改造的区域
        isFlag = false;
    }
}

if(noTotal == 0){
    //都改造完了
    console.log(day);
}else {
    console.log(-1);
}

/**
 * 进行改造区域
 * @param x 横坐标
 * @param y 纵坐标
 */
function gaizao( x, y) {

    //上
    if (x > 0 && regionsCopy[x - 1][y] == "NO") {
        regionsCopy[x - 1][y] = "YES";
        coordinates.push([x - 1, y]);
    }
    //下
    if (x < row - 1 && regionsCopy[x + 1][y] == "NO") {
        regionsCopy[x + 1][y] = "YES";
        coordinates.push([x + 1, y]);
    }
    //左
    if (y > 0 && regionsCopy[x][y - 1] == "NO") {
        regionsCopy[x][y - 1] = "YES";
        coordinates.push([x, y - 1]);
    }
    //右
    if (y < col - 1 && regionsCopy[x][y + 1] == "NO") {
        regionsCopy[x][y + 1] = "YES";
        coordinates.push([x, y + 1]);
    }
}




## 找最小数
知识点贪心

时间限制：1s 空间限制：32MB 限定语言：不限

题目描述：
给一个正整数NUM1，计算出新正整数NUM2，NUM2为NUM1中移除N位数字后的结果，需要使得NUM2的值最小。
输入描述：
1.输入的第一行为一个字符串，字符串由0-9字符组成，记录正整数NUM1，NUM1长度小于32。

2.输入的第二行为需要移除的数字的个数，小于NUM1长度。

如：

2615371
4

输出描述：
输出一个数字字符串，记录最小值NUM2。

如：131

示例1
输入：
2615371
4
输出：
131
说明：
移除2、6、5、7这四个数字，剩下1、3、1按原有顺序排列组成131，为最小值

解题思路：
根据题意，获取的最后值为原长度-需要移除的长度
因为是移除，所以数字的位置不能有所改变。
要最小数则前面的数要尽量的小
注：题意没有明确表示第一位不能为0，需要注意一下

如例一所示：

2615371

4

最后值 3（7-4） 位数

a、第一位数在前5位数种找最小值1，位置是3

b、第二位数在第3位数到第6位数找最小值3，位置是5

c、第三位数在第6位数到第7位数找最小值1

所以最后的值131

 代码：
let  s = readLine();
let m = Number(readLine());
// let  s = "2615371";
// let m = Number("4");

let l = m+1;        //截取字符的右边界
let index = 0;
let res = "";

while (res.length<s.length-m){

    let str = s.substring(index,l);        //求出第一个数字的最小值
    let min = Number.MAX_VALUE;
    let len = str.length;
    let ints = [];
    for(let i=0;i<len;i++){
        let temp = str.charAt(i);   //char转换成int
        ints[i] = temp; //放入数组求出下标
        if(res=="" && temp==0){ //第一位不能为0（如没有要求可以删掉）
            continue;
        }
        min = Math.min(min,temp);
    }
    res += String(min);

    for(let i=0;i<len;i++){
        if(ints[i] == min){
            index += i;      //求出第一个最小值的下标然后去截取循环获取最小值
            break;
        }
    }
    index++;
    l++;//数字要往后移一位

}

console.log(res);



## 服务失效判断
知识点图

时间限制：1s 空间限制：32MB 限定语言：不限

题目描述：
某系统中有众多服务，每个服务用字符串（只包含字母和数字，长度<=10）唯一标识，服务间可能有依赖关系，如A依赖B，则当B故障时导致A也故障。
依赖具有传递性，如A依赖B，B依赖C，当C故障时导致B故障，也导致A故障。
给出所有依赖关系，以及当前已知故障服务，要求输出所有正常服务。
依赖关系：服务1-服务2  表示“服务1”依赖“服务2”
不必考虑输入异常，用例保证：依赖关系列表、故障列表非空，且依赖关系数，故障服务数都不会超过3000，服务标识格式正常。
输入描述:
半角逗号分隔的依赖关系列表（换行）

半角逗号分隔的故障服务列表

输出描述:
依赖关系列表中提及的所有服务中可以正常工作的服务列表，用半角逗号分隔，按依赖关系列表中出现的次序排序。

特别的，没有正常节点输出单独一个半角逗号。

示例1
输入
a1-a2,a5-a6,a2-a3

a5,a2

输出
a6,a3

说明
a1依赖a2，a2依赖a3，所以a2故障，导致a1不可用，但不影响a3；a5故障不影响a6。所以可用的是a3、a6，在依赖关系列表中a6先出现，所以输出:a6,a3

示例2
输入
a1-a2

a2

输出
,

说明
a1依赖a2，a2故障导致a1也故障，没有正常节点，输出一个逗号

解题思路 
根据输入，整理出所有服务listSer，并将其中故障服务剔除。

遍历故障服务，通过依赖关系，将其服务的反依赖树中的所有服务查找出来，最后将其从listSer中剔除，剩余的则为正常服务。

如：a-b，b-c，c-d

b，c，d为a的正依赖树，判断a是否正常，需要判断b，c，d是否正常，其中有一个故障，则a服务故障

a，b，c为d的反依赖树，d故障，则a，b，c故障

代码： 
let strings = readLine().split(",");
let errorSer = readLine().split(",");
//let strings = "a1-a2,a5-a6,a2-a3".split(",");
//let errorSer = "a5,a2".split(",");

let errorLen = errorSer.length;
var list = [];    //依赖关系集合
let listSer = [];   //所有服务

for(let i=0; i<strings.length; i++){

    let temp = strings[i].split("-");

    list.push(temp);
    let a = temp[0];
    let b = temp[1];

    if(!listSer.includes(a)) listSer.push(a);
    if(!listSer.includes(b)) listSer.push(b);
}

for(let i=0; i<errorLen; i++){
    checkError(errorSer[i]);
}

let resList = listSer.filter(v=> !errorSer.includes(v));    //从所有服务中剔除故障服务
if(resList.length == 0){
    console.log(",");
}else {
    let res = "";
    for(let i=0; i<resList.length; i++){
        res += resList[i];
        if(i != resList.length-1){
            res += ",";
        }
    }
    console.log(res);
}

/**
 *
 * @param s 故障服务
 * 请求出所有依赖故障服务的服务，并将其放入故障服务集合中
 */
function checkError( s){

    for(let i=0; i<list.length; i++){
        let temp = list[i];
        if(temp[1] == s && !errorSer.includes(temp[0])){
            errorSer.push(temp[0]);
            checkError(temp[0]);
        }
    }
}




## 解压报文
知识点栈

 时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
为了提升数据传输的效率，会对传输的报文进行压缩处理。输入一个压缩后的报文，请返回它解压后的原始报文。
压缩规则：n[str]，表示方括号内部的 str 正好重复 n 次。注意 n 为正整数（0 < n <= 100），str只包含小写英文字母，不考虑异常情况。
输入描述:
输入压缩后的报文：

1）不考虑无效的输入，报文没有额外的空格，方括号总是符合格式要求的；

2）原始报文不包含数字，所有的数字只表示重复的次数 n ，例如不会出现像 5b 或 3[8] 的输入；

输出描述:
解压后的原始报文

注：

1）原始报文长度不会超过1000，不考虑异常的情况

示例1
输入
3[k]2[mn]

输出
kkkmnmn

说明
k 重复3次，mn 重复2次，最终得到 kkkmnmn

示例2
输入
3[m2[c]]

输出
mccmccmcc

说明
m2[c] 解压缩后为 mcc，重复三次为 mccmccmcc

 解题思路：
看到这种被括号控制的题目，就想到了栈，现在都是用双向队列（Deque）

遍历字符串，将数字和字母分别放入各自队列中
当碰到“]”的时候，取出队列最上层的数字和字母（Deque是先进先出，所以最上层的是最后放入的），进行解压
再将步骤2解压出的字符与字母队列中最上层的字符进行拼接，用于下次解压（因为括号里面的所有字符都受前面数字控制解压，所有需要拼接）
重复步骤1，直至遍历完整个字符串
代码：
let s = readLine();
//let s = "3[m2[c]]";
let res = "";  //处理前的字母串
let numStr = "";  //处理多位数
let num = [];    //数字队列
let zimu = [];  //放置处理后的字母串
for(let i=0;i<s.length;i++){
    let c = s.charAt(i);
    if(!isNaN(Number(c))){  //判断是否为数字
        if(res.length!=0){    //数字前的字母暂不处理
            zimu.push(res);
            res = "";
        }
        numStr += c;
    }else if(c=='['){
        num.push(Number(numStr));  //数字放入数字队列
        numStr = "";
    }else if(c==']'){
        let n = num.pop();  //碰到“]”，就需要取出最上面的数字进行解压
        if(res.length!=0){
            zimu.push(res);
            res = "";
        }
        let temp = zimu.pop(); //取出最上面的字母
        let sb = "";
        for(let j=0;j<n;j++){
            sb+=temp;    //对字母进行解压
        }
        if(zimu.length==0){
            zimu.push(sb);
        }else {
            zimu.push(zimu.pop()+sb);   //后面处理过的字符会跟最上面的字符一起被处理
        }
    }else {
        res+=c;
    }
}
console.log(zimu);


## 字符串比较
时间限制：1秒 | 内存限制：65536K | 语言限制：不限

题目描述：
给定字符串A、B和正整数V，A的长度与B的长度相等， 请计算A中满足如下条件的最大连续子串的长度：
1、该连续子串在A和B中的位置和长度均相同。
2、该连续子串|A[i] – B[i]|之和小于等于V。其中|A[i] – B[i]|表示两个字母ASCII码之差的绝对值。
输入描述:
输入为三行：

第一行为字符串A，仅包含小写字符，1 <= A.length <=1000。

第二行为字符串B，仅包含小写字符，1 <= B.length <=1000。

第三行为正整数V，0<= V <= 10000。

输出描述:
字符串最大连续子串的长度，要求该子串|A[i] – B[i]|之和小于等于V。

示例1
输入：
xxcdefg

cdefghi

5

输出：
2

说明：
字符串A为xxcdefg，字符串B为cdefghi，V=5。

它的最大连续子串可以是cd->ef,de->fg,ef->gh,fg->hi，所以最大连续子串是2。

解题思路：
如例1：

新建整数类型count为连续子串ASCII码之差的绝对值之和

遍历两个字符串，因为长度相等，所以公用一个索引

1、A[0]-B[0]=x-c=120-99=21>5，不符合要求

xxcdefg

cdefghi

2、A[1]-B[1]=x-d=120-100=20>5，不符合要求

xxcdefg

cdefghi

3、A[2]-B[2]=c-e=|99-101|=2<5，符合要求，count=2；

xxcdefg

cdefghi

4、A[3]-B[3]=d-f=|100-102|=2，count =count+2=4<5，符合要求，count=4；

xxcdefg

cdefghi

5、A[4]-B[4]=e-g=|101-103|=2，count=count+2=6>5；不符合要求，第一个子串为cd->ef；这时count需要减去第一个符合要求的A[2]-B[2]=2，count=4；

xxcdefg

cdefghi

6、A[5]-B[5]=f-h=|102-104|=2，count=count+2=6>5，不符要求，第二个子串为de->fg；这时count需要减去第一个符合要求的A[3]-B[3]=2，count=4；

xxcdefg

cdefghi

7、A[6]-B[6]=g-i=|103-105|=2，count=count+2=6>5，不符要求，第二个子串为ef->gh；这时count需要减去第一个符合要求的A[4]-B[4]=2，count=4；此时是最后一个字符，count<5,则fg->hi也是符合要求的。

xxcdefg

cdefghi

代码： 
let s1 = readline();
let s2 = readline();
let n = Number(readline());
// let s1 = "xxcdefg";
// let s2 = "cdefghi";
// let n = Number("5");

let max = 0;
let length = 0;
let list = [];     //用列表存放符合要求的数

list.push(Math.abs(s1.charCodeAt(0) - s2.charCodeAt(0)));      //假设第一个字母就符合要求
let count = list[0];        //第一个字母ASCII码之差的绝对值

for ( let i=1; i<s1.length; i++) {

    let temp = Math.abs(s1.charCodeAt(i) - s2.charCodeAt(i));

    list.push(temp);     //直接将本次的ASCII码之差的绝对值添加进列表
    count += Math.abs(temp);      //求最新的绝对值和

    if ( count <= n ) {
        length = list.length;       //若符合要求则最长的为列表的长度
    } else {
        count -= list[0];   //不符合则减去并删除列表第一个数
        list.splice(0, 1);
    }
    max = Math.max( length, max);
}

console.log(max);




## 找单词
时间限制：1秒 | 内存限制：32768K | 语言限制：不限

题目描述：
给一个字符串和一个二维字符数组，如果该字符串存在于该数组中，则按字符串的字符顺序输出字符串每个字符所在单元格的位置下标字符串，如果找不到返回字符串"N"。
1.需要按照字符串的字符组成顺序搜索，且搜索到的位置必须是相邻单元格，其中“相邻单元格”是指那些水平相邻或垂直相邻的单元格。
2.同一个单元格内的字母不允许被重复使用。
3.假定在数组中最多只存在一个可能的匹配。
输入描述:
1.第1行为一个数字（N）指示二维数组在后续输入所占的行数。

2.第2行到第N+1行输入为一个二维大写字符数组，每行字符用半角,分割。

3.第N+2行为待查找的字符串，由大写字符组成。

4.二维数组的大小为N*N，0<N<=100。

5.单词长度K，0<K<1000。

输出描述:
输出一个位置下标字符串，拼接格式为：第1个字符行下标+","+第1个字符列下标+","+第2个字符行下标+","+第2个字符列下标...+","+第N个字符行下标+","+第N个字符列下标

示例1
输入
4

A,C,C,F

C,D,E,D

B,E,S,S

F,E,C,A

ACCESS

输出
0,0,0,1,0,2,1,2,2,2,2,3

说明
ACCESS分别对应二维数组的[0,0]  [0,1] [0,2] [1,2] [2,2] [2,3]下标位置

代码： 
//var n = Number(readline());
var n = Number("4");

let test = ["A,C,C,F","C,D,E,D","B,E,S,S","F,E,C,A"];
let strings = [];
for(let i=0; i<n; i++){
    //let inputStrings = readline().split(",");
    let inputStrings = test[i].split(",");
    strings[i] = [];
    for(let j=0; j<n; j++){
        strings[i][j] = inputStrings[j];
    }
}

//var inputS = readline();
var inputS = "ACCESS";
var slen = inputS.length;
let first = inputS[0];//从第一个值开始
let isSuccess = false;
var res =  "";

for(let i=0; i<n; i++){
    for(let j=0; j<n; j++){
        if(strings[i][j] == first){
            let temp = copy(strings);    //对数组进行复制，否则影响第二次计算
            res = i + "," + j;
            temp[i][j] = ""; //已取出的值置空
            if(nextNum(0, i, j, temp)==1){ //表示已经成功取出数据
                isSuccess = true;
                console.log(res);
                break;
            }
        }
    }
    if(isSuccess){
        break;
    }
}
if(!isSuccess){
    console.log("N");
}

function copy( strings){
    let x = strings.length;
    let copyS = [];

    for ( let i=0; i<x; i++) {
        copyS[i] = [];
        for ( let j=0; j<x; j++) {
            copyS[i][j] = strings[i][j];
        }
    }
    return copyS;
}

function nextNum( index, row, col, temp){

    if(index == slen-1){  //递归到最后一位表示已经成功
        return 1;
    }
    index++;    //字符串下标
    let s= inputS[index];

    if(row>0 && temp[row-1][col] == s){    //对上边的字符串进行比较
        temp[row-1][col] = "";  //将已经取出的字符串进行置空，防止多次取值
        res += ","+ (row-1)+","+col;    //添加坐标
        if(nextNum(index, row-1, col, temp) == 1){ //值为1表示成功取出
            return 1;
        }else {
            res = res.substring(0,res.length-4);  //如果失败则进行还原
            temp[row-1][col] = s;
        }
    }
    if(col>0 && temp[row][col-1] == s){  // 左边
        temp[row][col-1] = "";
        res += ","+row+","+(col-1);
        if(nextNum(index, row, col-1, temp) == 1){
            return 1;
        }else {
            res = res.substring(0, res.length-4);
            temp[row][col-1] = s;
        }
    }
    if(row<n-1 && temp[row+1][col] == s){    //下边
        temp[row+1][col] = "";
        res += ","+(row+1)+","+col;
        if(nextNum(index, row+1, col, temp) == 1){
            return 1;
        }else {
            res = res.substring(0, res.length-4);
            temp[row+1][col] = s;
        }
    }
    if(col<n-1 && temp[row][col+1] == s){    //右边
        temp[row][col+1] = "";
        res += ","+row+","+(col+1);
        if(nextNum(index, row, col+1, temp) == 1){
            return 1;
        }else {
            res = res.substring(0, res.length-4);
            temp[row][col+1] = s;
        }
    }

    return 0;
}


## 找出通过车辆最多颜色
知识点滑窗

 时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
在一个狭小的路口，每秒只能通过一辆车，假如车辆的颜色只有3种，找出N秒内经过的最多颜色的车辆数量
三种颜色编号为0,1,2
输入描述：
第一行输入的是通过的车辆颜色信息

[0,1,1,2] 代表4秒钟通过的车辆颜色分别是0,1,1,2

第二行输入的是统计时间窗，整型，单位为秒

输出描述：
输出指定时间窗内经过的最多颜色的车辆数量

示例1
输入：
0 1 2 1

3

输出：
2

说明：
在[1,2,1]这个3秒时间窗内，1这个颜色出现2次，数量最多

示例2
输入：
0 1 2 1

2

输出：
1

说明：
在2秒时间窗内，每个颜色最多出现1次

解题思路：
题目规定只有3种颜色。我们可以使用长度为3的整数数组表示。

当颜色为0，ints[0]++;

当颜色为1，ints[1]++;

当颜色为2，ints[2]++;

满分答案： 
var lines = readline().split(" ").map(Number);
var n = parseInt(readline());
var arr = [];
if (n >= lines.length) {
    let a = {};
    for (var j = 0; j < lines.length; j++) {
        if (a[lines[j]]) {
            a[lines[j]]++;
        } else {
            a[lines[j]] = 1;
        }
    }
    console.log(Math.max(...Object.values(a)));
} else {
    for (var j = 0; j < lines.length; j++) {
        if (j + n > lines.length) break;
        let a = {};
        for (var i = 0; i < n; i++) {
            if (a[lines[i + j]]) {
                a[lines[i + j]]++;
            } else {
                a[lines[i + j]] = 1;
            }
        }
        arr.push(Math.max(...Object.values(a)));
    }
    console.log(Math.max(...arr));
}



## 整理扑克牌
知识点贪心排序

 时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
给定一组数字，表示扑克牌的牌面数字，忽略扑克牌的花色，请按如下规则对这一组扑克牌进行整理：
步骤1、对扑克牌进行分组，形成组合牌，规则如下：
当牌面数字相同张数大于等于4时，组合牌为“炸弹”；
3张相同牌面数字 + 2张相同牌面数字，且3张牌与2张牌不相同时，组合牌为“葫芦”；
3张相同牌面数字，组合牌为“三张”；
2张相同牌面数字，组合牌为“对子”；
剩余没有相同的牌，则为“单张”；
步骤2、对上述组合牌进行由大到小排列，规则如下：
不同类型组合牌之间由大到小排列规则：“炸弹” > "葫芦" > "三张" > "对子" > “单张”；
相同类型组合牌之间，除“葫芦”外，按组合牌全部牌面数字加总由大到小排列；
“葫芦”则先按3张相同牌面数字加总由大到小排列，3张相同牌面数字加总相同时，再按另外2张牌面数字加总由大到小排列；
由于“葫芦”>“三张”，因此如果能形成更大的组合牌，也可以将“三张”拆分为2张和1张，其中的2张可以和其它“三张”重新组合成“葫芦”，剩下的1张为“单张”
步骤3、当存在多个可能组合方案时，按如下规则排序取最大的一个组合方案：
依次对组合方案中的组合牌进行大小比较，规则同上；
当组合方案A中的第n个组合牌大于组合方案B中的第n个组合牌时，组合方案A大于组合方案B；
输入描述：
第一行为空格分隔的N个正整数，每个整数取值范围[1,13]，N的取值范围[1,1000]

输出描述：
经重新排列后的扑克牌数字列表，每个数字以空格分隔

示例1
输入：
1 3 3 3 2 1 5

输出：
3 3 3 1 1 5 2

示例2
输入：
4 4 2 1 2 1 3 3 3 4

输出：
4 4 4 3 3 2 2 1 1 3

解题思路：


 满分答案 ：
//let list = readline().split(" ");
let list = "4 4 2 1 2 1 3 3 3 4".split(" ");

let temp = [];
for (let i = 0; i < list.length; i++) {

    let num = list[i];

    let p = temp[num];
    if (p == null) {
        p = new Pair(num, 1);
        temp[num] = p;
    } else {
        p.count++;
    }
}

temp.sort((o1, o2) => {
    if (o1 == null) {
        return -1;
    }
    if (o2 == null) {
        return 1;
    }
    if (o2.count == o1.count) {
        return o2.k - o1.k;
    }
    return o2.count - o1.count;
});
let three = [];
let two = [];
let one = [];
for (let aTemp of temp) {
    if (aTemp == null) continue;
    if (aTemp.count > 3) {
        for (let j = 0; j < aTemp.count; j++) {
            console.log((aTemp.k) + " ");
        }
    } else {
        if (aTemp.count == 3) {
            three.push(aTemp);
        } else if (aTemp.count == 2) {
            two.push(aTemp);
        } else if (aTemp.count == 1) {
            one.push(aTemp);
        }
    }
}

let res = "";
for (let i = 0; i < three.length; i++) {
    for (let j = 0; j < 3; j++) {
        res += (three[i].k) + " ";
    }
    if (i + 1 == three.length) { // 没有3张了，和2张比
        if (two.length > 0) {
            for (let j = 0; j < 2; j++) {
                res += two[0].k + " ";
            }
            two.splice(0, 1);
        }
    } else {
        if (three[i + 1].k > two[0].k) {
            // 需要拆分
            one.push(new Pair(three[i + 1].k, 1));
            for (let j = 0; j < 2; j++) {
                res += three[i + 1].k + " ";
            }
            i++;
        } else {
            for (let j = 0; j < 2; j++) {
                res += two[0].k + " ";
            }
            two.splice(0, 1);
        }
    }
}
for (let aTwo of two) {
    for (let j = 0; j < 2; j++) {
        res += aTwo.k + " ";
    }
}
one.sort((o1, o2) => {
    if (o2.count == o1.count) {
        return o2.k - o1.k;
    }
    return o2.count - o1.count;
});
for (let anOne of one) {
    res += anOne.k + " ";
}

console.log(res.substring(0, res.length - 1))

function Pair( k, count) {
    this.k = k;
    this.count = count;
}



## 开心消消乐
知识点编程基础深搜广搜

 时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
给定一个N行M列的二维矩阵，矩阵中每个位置的数字取值为0或1。矩阵示例如：
1 1 0 0
0 0 0 1
0 0 1 1
1 1 1 1
现需要将矩阵中所有的1进行反转为0，规则如下：
1）当点击一个1时，该1变被反转为0，同时相邻的上、下、左、右，以及左上、左下、右上、右下8个方向的1（如果存在1）均会自动反转为0；
2）进一步地，一个位置上的1被反转为0时，与其相邻的8个方向的1（如果存在1）均会自动反转为0；
按照上述规则示例中的矩阵只最少需要点击2次后，所有值均为0。请问，给定一个矩阵，最少需要点击几次后，所有数字均为0？
输入描述：
第一行为两个整数，分别表示矩阵的行数N和列数M，取值范围均为[1, 100]

接下来N行表示矩阵的初始值，每行均为M个数，取值范围[0,1]

输出描述：
输出一个整数，表示最少需要点击的次数

示例1
输入：
3 3

1 0 1

0 1 0

1 0 1

输出：
1

说明：
上述样例中，四个角上的1均在中间的1的相邻8个方向上，因此只需要点击一次即可

示例2
输入：
4 4

1 1 0 0

0 0 0 1

0 0 1 1

1 1 1 1

输出：
2

说明：
在上述4 * 4的矩阵中，只需要点击2次，即可将所有的1进行消除

解题思路：
主要使用回溯进行深度搜索；

遍历二维数组，碰到1的时候判断其四周八个方向是否为1，如果是1，将其改为0，且对其坐标周围继续探索。

代码： 
//const nums = readline().split(" ").map(i => parseInt(i));
const nums = "4 4".split(" ").map(i => parseInt(i));

var N = nums[0];
var M = nums[1];

var juzhen = Array(N).fill().map(()=>Array(M).fill(0));;
let test = ["1 1 0 0","0 0 0 1","0 0 1 1","1 1 1 1"];
for(let i=0; i<N; i++){
    //let inputNums = readline().split(" ").map(i => parseInt(i));
    let inputNums = test[i].split(" ").map(i => parseInt(i));
    for(let j=0; j<M; j++){
        juzhen[i][j] = inputNums[j];
    }
}

let res = 0;
for(let i=0; i<N; i++){
    for(let j=0; j<M; j++){
        if(juzhen[i][j] == 1){
            juzhen[i][j] = 0;
            clearHappy( i, j);
            res ++;
        }
    }
}

console.log(res);

function clearHappy( x, y){

    if(x > 0){
        if(juzhen[x-1][y] == 1){    //正上
            juzhen[x-1][y] = 0;
            clearHappy( x-1, y);
        }
        if(y > 0){
            if(juzhen[x-1][y-1] == 1){  //左上
                juzhen[x-1][y-1] = 0;
                clearHappy( x-1, y-1);
            }
        }
        if(y < M - 1){
            if(juzhen[x-1][y+1] == 1){    //右上
                juzhen[x-1][y+1] = 0;
                clearHappy( x-1, y+1);
            }
        }
    }

    if(x < N - 1){
        if(juzhen[x+1][y] == 1){    //正下
            juzhen[x+1][y] = 0;
            clearHappy( x+1, y);
        }
        if(y > 0){
            if(juzhen[x+1][y-1] == 1){    //左下
                juzhen[x+1][y-1] = 0;
                clearHappy( x+1, y-1);
            }
        }
        if(y < M - 1){
            if(juzhen[x+1][y+1] == 1){  //右下
                juzhen[x+1][y+1] = 0;
                clearHappy( x+1, y+1);
            }
        }
    }

    if(y > 0){
        if(juzhen[x][y-1] == 1){    //正左
            juzhen[x][y-1] = 0;
            clearHappy( x, y-1);
        }
    }

    if(y < M - 1){
        if(juzhen[x][y+1] == 1){    //正右
            juzhen[x][y+1] = 0;
            clearHappy( x, y+1);
        }
    }
}

满分答案：
let N = 0;
let M = 0;
let arr = [];
let count = 0;
while ((line = readline())) {
    let cur = line.split(" ").map((v) => parseInt(v));
    if (N == 0) {
        N = cur[0];
        M = cur[1];
    } else {
        arr.push(cur);
    }
}
// 中心两侧查找
for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
        if (arr[i][j] == 1) {
            changeX(i,j);
            count+=1;
        }
    }
}
console.log(count);
// 交换
function changeX(i,j) {
    if (i<0 || j <0 || i > N - 1 || j > M-1 || arr[i][j] !== 1) {
        return;
    }
    if(arr[i][j] == 1) {
        arr[i][j] = 0;
    }
    changeX(i-1,j-1);
    changeX(i-1,j);
    changeX(i-1,j+1);
    changeX(i,j-1);
    changeX(i,j+1);
    changeX(i+1,j-1);
    changeX(i+1,j);
    changeX(i+1,j+1);
}



## 查找重复代码
 时间限制：1s 空间限制：32MB 限定语言：不限

题目描述：
小明负责维护项目下的代码，需要查找出重复代码，用以支撑后续的代码优化，请你帮助小明找出重复的代码，。
重复代码查找方法：以字符串形式给定两行代码（字符串长度 1 < length <= 100，由英文字母、数字和空格组成），找出两行代码中的最长公共子串。
注： 如果不存在公共子串，返回空字符串
输入描述：
输入的参数text1, text2分别表示两行代码
输出描述：
输出任一最长公共子串
示例1
输入：
hello123world

hello123abc4

输出：
hello123

说明：
text1 = "hello123world", text2 = "hello123abc4", 最长的公共子串为 "hello123"

示例2
输入：
private_void_method

public_void_method

输出：
_void_method

说明：
text1 = "private_void_method", text2 = "public_void_method", 最长的公共子串为 "_void_method"

示例3
输入：
hiworld

hiweb

输出：
hiw

说明：
text1 = "hiworld", text2 = "hiweb", 最长的公共子串为 "hiw"

解题思路：
比较出两个字符串的长短
使用双层for循环截取短字符串，并判断是否为长字符串的子串，并找出其中最长的。没有的话，输出空字符串。
代码： 
// let text1 = readline();
// let text2 = readline();

let text1 = "private_void_method";
let text2 = "public_void_method";

let minStr = text1.length <= text2.length ? text1 : text2;
let maxStr = minStr == text1 ? text2 : text1;
let resStr = "";

for(let i=0; i<minStr.length-1; i++){
    for(let j=i+1; j<=minStr.length; j++){
        let temp = minStr.substring( i, j);
        if(maxStr.includes(temp) && temp.length > resStr.length){
            resStr = temp;
        }
    }
}

console.log(resStr);

满分答案：
// let str1 = readline();
// let str2 = readline();
let str1 = "hello123world";
let str2 = "hello123abc4";
let result = "";
let start = 0;
let end = 1;
while(end <= str2.length){
    let subStr = str2.substring(start, end);
    if (str1.includes(subStr)){
        result = subStr;
    }else {
        start++;
    }
    end++;
}
console.log(result);




## 区间交集
时间限制：1秒 | 内存限制：262144K | 语言限制：不限

题目描述：
给定一组闭区间，其中部分区间存在交集。任意两个给定区间的交集，称为公共区间（如：[1,2],[2,3]的公共区间为[2,2]，[3,5],[3,6]的公共区间为[3,5]）。公共区间之间若存在交集，则需要合并（如：[1,3],[3,5]区间存在交集[3,3]，须合并为[1,5])。按升序排列输出合并后的区间列表。
输入描述:
一组区间列表，

区间数为N：

0 <= N <= 1000；

区间元素为X：

-10000 <= X <= 10000。

输出描述:
升序排列的合并后区间列表

示例1
输入
0 3

1 3

3 5

3 6

输出
1 5

说明
[0,3]和[1,3]的公共区间为[1,3]，[0,3]和[3,5]的公共区间为[3,3]，[0,3]和[3,6]的公共区间为[3,3]，[1,3]和[3,5]的公共区间为[3,3]，[1,3]和[3,6]的公共区间为[3,3]，[3,5]和[3,6]的公共区间为[3,5]，公共区间列表为[[1,3],[3,3],[3,5]]；[1,3],[3,3],[3,5]存在交集，须合并为[1,5]。

示例2
输入
0 3

1 4

4 7

5 8

输出
1 3

4 4

5 7

示例3
输入
1 2

3 4

输出
None

说明
[1,2]和[3,4]无交集

备注:
1、区间元素均为数字，不考虑字母、符号等异常输入。

2、单个区间认定为无公共区间。

代码： 
let list = [];
//let test = ["0 3","1 4","4 7","5 8"];
//let test = ["1 2","3 4"];
let test = ["0 3","1 3","3 5","3 6"];

for(let i=0;i<test.length;i++){
	let x = test[i].split(" ");
	let node = new qujian(x[0], x[1]);
	list.push(node);
}

// while (readline()) {
// 	let input = readline().split(" ").map(Number);
// 	let node = new qujian(input[0], input[1]);
// 	list.push(node);
// }

let list1 = [];
collection(list);

for(let i=0;i<list.length-1;i++){
	for(let j=i+1;j<list.length;j++){
		let a = list[i];
		let b = list[j];
		if(b.left <= a.right){
			let l = Math.max(a.left, b.left);
			let r = Math.min(a.right, b.right);
			let node = new qujian(l, r);
			list1.push(node);
		}
	}
}

if(list1.length==0){
	console.log("None");
	return;
}
collection(list1);
let l = list1[0].left;
let r = list1[0].right;

for(let i=1; i<list1.length; i++){
	let node = list1[i];
	if(node.left > r){
		console.log(l+" "+r);
		l = node.left;
		r = node.right;
	}else {
		l = Math.min(node.left, l);
		r = Math.max(node.right, r);
	}
}
console.log(l+" "+r);

function qujian(l, r){
	this.left = l;
	this.right = r;
}

function collection( list){
	list.sort((a,b) => {
		if(a.left==b.left){
			return a.right-b.right;
		}
		return a.left-b.left;
	});
}




## We Are A Team
时间限制：1秒 | 内存限制：32768K | 语言限制：不限

题目描述：
总共有n个人在机房，每个人有一个标号（1 <= 标号 <=n），他们分成了多个团队，需要你根据收到的m条消息判定指定的两个人是否在一个团队中，具体的：
1、消息构成为：a b c，整数a、b分别代表了两个人的标号，整数c代表指令。
2、c==0代表a和b在一个团队内。
3、c==1代表需要判定a和b的关系，如果a和b是一个团队，输出一行“we are a team”，如果不是，输出一行“we are not a team”。
4、c为其它值，或当前行a或b超出1~n的范围，输出“da pian zi”。
输入描述:
1、第一行包含两个整数n, m(1 <= n, m <= 100000)，分别表示有n个人和m条消息。
2、随后的m行，每行一条消息，消息格式为:a b c (1 <= a, b <= n, 0 <= c <= 1)。

输出描述:
1、c==1时，根据a和b是否在一个团队中输出一行字符串，在一个团队中输出“we are a team”，不在一个团队中输出“we are not a team”。

2、c为其他值，或当前行a或b的标号小于1或者大于n时，输出字符串“da pian zi”。

3、如果第一行n和m的值超出约定的范围时，输出字符串"NULL"。

示例1
输入
5 6

1 2 0

1 2 1

1 5 0

2 3 1

2 5 1

1 3 2

输出
we are a team

we are not a team

we are a team

da pian zi

说明
第2行定义了1和2是一个团队

第3行要求进行判定，输出"we are a team"

第4行定义了1和5是一个团队，自然2和5也是一个团队

第5行要求进行判定，输出"we are not a team"

第6行要求进行判定，输出"we are a team"

第7行c为其它值，输出"da pian zi"

解题思路：
1、新建一个teams做为所有team的集合

2、当c=0的时候，遍历teams，如果其中有team包含a，则表示b也属于该team，或者

      有team包含b，则表示a也属于该team；如果有俩个team，一个包含a，一个包含b，

      则将两个team进行合并

3、当c=1的时候，遍历teams，如果有team同时包含a和b，则表示a和b为一个team，反之

      不为同一个team

代码： 
let s = readLine().split(" ").map(Number);
//let s = "4 4".split(" ").map(Number);
//let s = "5 6".split(" ").map(Number);
 
let n = s[0];
let m = s[1];
let teams  = []; //所有teams的集合
 
// let test = ["1 2 0",
//             "3 4 0",
//             "2 3 0",
//             "1 4 1"];
//let test = ["1 2 0","1 2 1","1 5 0","2 3 1","2 5 1","1 3 2"];
 
if(n<1 || n>100000 || m<1 || m>100000){ //越界了
    console.log("NULL");
}else {
    for(let i=0;i<m;i++){
 
        let str = readLine().split(" ").map(Number);
        //let str = test[i].split(" ").map(Number);
 
        let a = str[0];
        let b = str[1];
        let c = str[2];
 
        if(a<1 || a>n || b<1 || b>n || (c!=0 && c!=1)){ //a,b越界，c只能0和1
            console.log("da pian zi");
        }else if(c==0){
            let hasTeam = false;    //a和b是否有了team
            let teamIndex = -1;
            let isCombine = false;
            for(let j=0;j<teams.length;j++){
                if(teams[j].includes(a)){   //team中有了a，则b也是其中成员
                    teams[j].push(b);
                    if(hasTeam){    //已经有了team，可以进行合并
                        teams[teamIndex].forEach(v=>{
                            if(!teams[j].includes(v)){
                                teams[j].push(v); 
                            }
                        })
                        isCombine = true;
                        break;
                    }
                    teamIndex = j;
                    hasTeam = true;
                    continue;
                }
                if(teams[j].includes(b)){   //team中有了b，则a也是其中成员
                    teams[j].push(a);
                    if(hasTeam){
                        teams[teamIndex].forEach(v=>{
                            if(!teams[j].includes(v)){
                                teams[j].push(v); 
                            }
                        })
                        isCombine = true;
                        break;
                    }
                    teamIndex = j;
                    hasTeam = true;
                }
            }
            if(isCombine){
                teams.splice(teamIndex,1);    //剔除合并过的team
            }
            if(!hasTeam){   //a和b都没有team，则新建team加入teams的集合中
                let team = [];
                team.push(a);
                team.push(b);
                teams.push(team);
            }
        }else {
            let isATeam = false;
            for(let j=0;j<teams.length;j++){
                if(teams[j].includes(a) && teams[j].includes(b)){   //a和b同时在一个team中
                    isATeam = true;
                }
            }
            console.log(isATeam ? "we are a team" : "we are not a team");
        }
    }
}




## 书籍叠放
时间限制：1秒 | 内存限制：65536K | 语言限制：不限

题目描述：
书籍的长、宽都是整数对应 (l,w)。如果书A的长宽度都比B长宽大时，则允许将B排列放在A上面。
现在有一组规格的书籍，书籍叠放时要求书籍不能做旋转，请计算最多能有多少个规格书籍能叠放在一起。
输入描述:
输入: books = [[20,16],[15,11],[10,10],[9,10]]

说明：总共4本书籍，第一本长度为20宽度为16；第二本书长度为15宽度为11，依次类推，最后一本书长度为9宽度为10.

输出描述:
输出: 3 

说明: 最多3个规格的书籍可以叠放到一起, 

从下到上依次为: [20,16],[15,11],[10,10]

示例1
输入
[[20,16],[15,11],[10,10],[9,10]]

输出
3

说明
说明: 最多3个规格的书籍可以叠放到一起, 从下到上依次为: [20,16],[15,11],[10,10]

解题思路：
将书籍从大到小进行排列。

将第一本书（最大的书）放在最下面，同时作为第一个参照物；遍历参照物后面的书籍，找到最近的满足长和宽都小于参照物的书进行叠加，同时将其作为第二个参照物，再遍历第二个参照物后面的书籍进行比较，以此类推。。。直至所有书遍历完成。最终参照物的个数则是书籍叠放的最大规格。

代码： 
/**
 * 筛选出所有书籍
 */
// let str = readine().replace("[[","")
//                     .replace("]]","")
//                     .split("],\\[");
let str = "[[20,16],[15,11],[10,10],[9,10]]".replace("[[","")
                    .replace("]]","")
                    .split("],[");

let list = [];

for(let i=0; i<str.length; i++){
    let shuji = str[i].split(",");
    let length = Number(shuji[0]);  //长
    let width = Number(shuji[1]); //宽
    let ints = [];
    ints.push(length);
    ints.push(width);
    list.push(ints);
}

/**
 * 书籍按照长和宽进行降序排列
 */
list.sort((a, b) => {
    if(a[0]<b[0] || (a[0]==b[0] && a[1]<b[1])){
        return 1;
    }
    return -1;
});

//第一个参照物
let lenDown = list[0][0];
let widDown = list[0][1];
let count = 1;  //规格

for(let i=1;i<list.length;i++){
    let length = list[i][0];
    let width = list[i][1];
    if(lenDown>length && widDown>width){    //长和宽同时满足
        lenDown = length;
        widDown = width;
        count++;
    }
}

console.log(count);





## 寻找最大价值的矿堆
知识点广搜

时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
给你一个由 '0'（空地）、 '1'（银矿）、'2'（金矿）组成的的地图，矿堆只能由上下左右相邻的金矿或银矿连接形成。超出地图范围可以认为是空地。
假设银矿价值1 ，金矿价值2 ，请你找出地图中最大价值的矿堆并输出该矿堆的价值
输入描述：
地图元素信息如： 

22220 

00000 

00000 

11111 

  

地图范围最大 300*300 

0<= 地图元素 <=2 

输出描述：
矿堆的最大价值

示例1
输入：
22220
00000
00000
01111
输出：
8
示例2
输入：
22220
00020
00010
01111
输出：
15
示例3
输入：
20000
00020
00000
00111
输出：
3
解题思路：
典型的广度搜索。

满分答案： 
let map = [];
let index = 0;
let test = ["22220","00000","00000","01111"];
// while(line = readline()){
//     map[index] = line.split("");
//     index ++;
// }
for(let i=0; i<test.length; i++){
    map[i] = test[i].split("").map(Number);
}

var row = map.length;
var col = map[0].length;
// bfs
let result  = 0 ;
for(let i = 0 ; i < map.length ; i ++){
    for(let j = 0; j < map[0].length ; j++){
        result = Math.max(result, bfs( 0, i, j,map));
    }
}

console.log(result);

/**
 * 广度搜索
 * @param result    矿堆的总价值
 * @param x         行坐标
 * @param y         列坐标
 * @param map       地图
 * @return
 */
function bfs( result, x , y, map){

    if(map[x][y] == 0){
        // 不可挖掘
        return result;
    }

    result += map[x][y];
    //已挖掘的置为0
    map[x][y] = 0 ;
    //向上
    if(can(x-1, y, map)){
        result = bfs( result,x-1, y, map);
    }
    //向下
    if(can(x+1,y,map)){
        result = bfs(result,x+1,y,map);
    }
    //向左
    if(can(x,y-1,map)){
        result = bfs(result,x,y-1,map);
    }
    //向右
    if(can(x,y+1,map)){
        result = bfs(result,x,y+1,map);
    }

    return result;
}

function can( x , y , map){

    if(x<0 || x >= row){
        return false;
    }
    if(y<0 || y >= col){
        return false;
    }
    //大于0才能挖掘
    return map[x][y] > 0;
}





## 数据最节约的备份方法
知识点动态规划

 时间限制：2s 空间限制：256MB 限定语言：不限

题目描述：
有若干个文件，使用刻录光盘的方式进行备份，假设每张光盘的容量是500MB，求使用光盘最少的文件分布方式
所有文件的大小都是整数的MB，且不超过500MB；文件不能分割、分卷打包
输入描述：
一组文件大小的数据

输出描述：
使用光盘的数量

补充说明：
不用考虑输入数据不合法的情况；假设最多100个输入文件。

示例1
输入：
100,500,300,200,400
输出：
3
说明：
(100,400),(200,300),(500) 3张光盘即可。
输入和输出内容都不含空格。

示例2
输入：
1,100,200,300
输出：
2
解题思路：
经典桶装水的问题。题目提示可以用动态规划，大家可以自己尝试一下！

满分答案： 
//let num = readline().split(",").map(Number);
let num = "100,500,300,200,400".split(",").map(Number);

num.sort();
let isUsed = Array(num.length).fill(false);
let count = 0,thisDisk = 0;
while(true){

    thisDisk = 0;
    for (let i = num.length-1; i>=0; i--){
        if (isUsed[i]) continue;

        if (num[i]+thisDisk <= 500){
            isUsed[i] = true;
            thisDisk = num[i] + thisDisk;
        }
    }
    count++;

    let isOk = true;
    for (let diskOk of isUsed) {
        if (diskOk == false) isOk = false;
    }
    if (isOk) break;
}

console.log(count);




## 最长广播响应
知识点图

 时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
某通信网络中有N个网络结点，用1到N进行标识。网络中的结点互联互通，且结点之间的消息传递有时延，相连结点的时延均为一个时间单位。
现给定网络结点的连接关系link[i]={u,v}，其中u和v表示网络结点。
当指定一个结点向其他结点进行广播，所有被广播结点收到消息后都会在原路径上回复一条响应消息，请计算发送结点至少需要等待几个时间单位才能收到所有被广播结点的响应消息。

注：
1、N的取值范围为[1,100]；
2、连接关系link的长度不超过3000，且1 <= u,v <= N；
3、网络中任意结点间均是可达的；
输入描述:
输入的第一行为两个正整数，分别表示网络结点的个数N，以及时延列表的长度I；
接下来的I行输入，表示结点间的连接关系列表；
最后一行的输入为一个正整数，表示指定的广播结点序号；

输出描述:
输出一个整数，表示发送结点接收到所有响应消息至少需要等待的时长。

示例1
输入
5 7

2 1

1 4

2 4

2 3

3 4

3 5

4 5

2

输出
4

说明
2到5的最小时延是2个时间单位，而2到其他结点的最小时延是1个时间单位，所以2收到所有结点的最大响应时间为2*2=4。

解题思路：
1、通过递归，遍历出广播节点到其他所有节点的最小时延

2、找出步骤1中最大值，其值*2位最短时间单位

 代码： 
//let input = readLine().split(" ").map(Number);
let input = "5 7".split(" ").map(Number);
let m = input[0];
let n = input[1];
 
let list = []; //信号集合
for(let i=1; i<=m; i++){
    list.push(i);
}
 
var linkArr = Array(m).fill().map(()=>Array(m).fill(0));   //信号联通数组
let test = ["2 1","1 4","2 4","2 3","3 4","3 5","4 5"];
//let test = ["2 3","3 1"];
for(let i=0; i<n; i++){
    //let int = readLine().split(" ").map(Number);
    let int = test[i].split(" ").map(Number);
    linkArr[int[0]-1][int[1]-1] = 1;
    linkArr[int[1]-1][int[0]-1] = 1;
}
 
//let start = Number(readLine());
let start = Number("2");
list.splice(start-1, 1);   //将广播节点移除
let max = 0;    //所有节点传播的最小时延
 
for(let i=0; i<m-1; i++){
    var min = Number.MAX_VALUE;    //广播的节点到各个节点之间的最小传播时延
    if(linkArr[start-1][list[i]-1] == 1 ||
        linkArr[list[i]-1][start-1] == 1){
        min = 1;
    }else{
        time(start-1, list[i]-1, []);
    }
    max = Math.max(max, min);
}
 
console.log(max*2);
 
function time( start, end, count){
 
    for(let i=0; i<linkArr.length; i++){
        if(!count.includes(i) && (linkArr[start][i] == 1 || linkArr[i][start] == 1)){
            if(i == end){
                min = Math.min(min, count.length+1);
            }else {
                let temp = []
                for(let j=0;j<count.length;j++){
                    temp.push(count[j]);
                }
                temp.push(i);
                time(i, end, temp);
            }
        }
    }
}



## 查字典
知识点字符串二分查找

时间限制：1s 空间限制：32MB 限定语言：不限

题目描述：
输入一个单词前缀和一个字典，输出包含该前缀的单词
输入描述：
单词前缀+字典长度+字典

字典是一个有序单词数组

输入输出都是小写

输出描述：
所有包含该前缀的单词，多个单词换行输出

若没有则返回-1

示例1
输入：
b 3 a b c
输出：
b
示例2
输入：
abc 4 a ab abc abcd
输出：
abc
abcd
示例3
输入：
a 3 b c d
输出：
-1
解题思路：
这道题也是非常简单。就是送分题。

满分答案：
//let string = readline().split(" ");
let string = "abc 4 a ab abc abcd".split(" ");

let target = string[0];
let size = Number(string[1]);
let flag = true;
for (let i = 0; i < size; i++) {
    let source = string[i+2];
    if (source.length >= target.length && 
        source.substring(0, target.length) == target){
        console.log(source);
        flag = false;
    }
}
if (flag){
    console.log(-1);
}




## 数字游戏
 时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
小明玩一个游戏。系统发1+n张牌，每张牌上有一个整数。第一张给小明，后n张按照发牌顺序排成连续的一行。需要小明判断，后n张牌中，是否存在连续的若干张牌，其和可以整除小明手中牌上的数字。
输入描述：
输入数据有多组，每组输入数据有两行，输入到文件结尾结束。

第一行有两个整数n和m，空格隔开。m代表发给小明牌上的数字。

第二行有n个数，代表后续发的n张牌上的数字，以空格隔开。

输出描述：
对每组输入，如果存在满足条件的连续若干张牌，则输出1；否则，输出0

补充说明：
1 <= n <= 1000

1 <= 牌上的整数 <= 400000

输入的组数，不多于1000

用例确保输入都正确，不需要考虑非法情况。

示例1
输入：
6 7
2 12 6 3 5 5
10 11
1 1 1 1 1 1 1 1 1 1
输出：
1
0
说明：
两组输入。第一组小明牌的数字为7，再发了6张牌。第1、2两张牌数字和为14，可以整除7，输出1。第二组小明牌的数字为11，再发了10张牌，这10张牌数字和为10，无法整除11，输出0。

解题思路：
这道题还是比较难的，虽然满分答案看起来不复杂，但是理解起来有困难。

如：

6 7

2 6 12 3 5 5

1、我们先计算出 2 与 7 的余数，是 2

2、再将之前的余数 2 加上第二个数字 6 对 7 取余，是 1

3、再将上面的余数 1 加上第三个数字 12 对 7 取余，是 6

4、在将上面的余数 6 加上第四个数字 3 对 7 取余，是 2，而第一步已经有一个余数 2 了，我们可以把它看做是第一步多给的，也就是说去掉第一个数，我们就能整除 7。实际上 

6 + 12 + 3 = 21，确实是 7 的倍数。

满分答案：
//let input = readline().split(" ");
let input = "6 7".split(" ").map(Number);
const n = input[0];
const m = input[1];

//var ints = readline().split(" ").map(Number);
var ints = "2 12 6 3 5 5".split(" ").map(Number);

var preSum = 0;
//是否满足条件
var isTrue = false;
//余数数组
var yushu = Array(m).fill(0);
yushu[0] = 1;
for(let i=0; i<n; i++){

    preSum += ints[i];
    preSum %= m;
    if(yushu[preSum] != 0){
        //前面有这个余数，说明可以进行整除
        isTrue = true;
        break;
    }
    yushu[preSum] ++;
}

console.log(isTrue ? 1 : 0);




## 二维伞的雨滴效应
知识点递归树

时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
普通的伞在二维平面世界中，左右两侧均有一条边，而两侧伞边最下面各有一个伞坠子，雨滴落到伞面，逐步流到伞坠处，会将伞坠的信息携带并落到地面，随着日积月累，地面会呈现伞坠的信息。
1、为了模拟伞状雨滴效应，用二叉树来模拟二维平面伞（如下图所示），现在输入一串正整数数组序列（不含0，数组成员至少是1个），若此数组序列是二叉搜索树的前序遍历的结果，那么请输出一个返回值1，否则输出0.
2、同时请将此序列构成的伞状效应携带到地面的数字信息输出来(左边伞坠信息，右边伞坠信息，详细参考示例图地面上数字)，若此树不存在左或右扇坠，则对应位置返回0。同时若非二叉排序树那么左右伞坠信息也返回0。


输入描述：
一个通过空格分割的整数序列字符串，数组不含0，数组成员至少1个，输入的数组的任意两个数字都互不相同，最多1000个正整数，正整数值范围1~655350

输出描述：
输出如下三个值，以空格分隔：是否二叉排序树，左侧地面呈现的伞坠数字值，右侧地面呈现的伞坠数字值。

若是二叉排序树，则输出1，否则输出0（其左右伞坠值也直接赋值0）。

若不存存在左侧或者右侧伞坠值，那么对应伞坠值直接赋值0。

示例1
输入：
8 3 1 6 4 7 10 14 13
输出：
1 1 13
说明：
1表示是二叉搜索树前序遍历结果，1表示左侧地面呈现的伞坠数字值，13表示右侧地面呈现的伞坠数字值

解题思路：
这道题看上去很复杂，其实就是求两个问题：

1、通过二叉树的前序遍历还原出二叉树，如果还原不出来，则代表二叉树不存在（因为是前序遍历，所以左树< 根<右树）

2、求出二叉树的最左侧叶子节点和最右侧叶子节点

代码： 
//var ints = readline().split(" ").map(Number);
var ints = "8 3 1 6 4 7 10 14 13".split(" ").map(Number);

class TreeNode{

    constructor( val){
        this.val = val;
    }

}

let rootNode = new TreeNode(ints[0]);
let stack = [];
stack.push(rootNode);
//祖父节点，主要用来判断是否是二叉树
let gfNode = new TreeNode(-1);
let isTree = true;
for (let i = 1; i < ints.length; i++) {
    //将栈的最后一个元素作为父元素，并从下一个前序遍历的节点创建子节点
    let node = stack[stack.length - 1];
    let currentNode = new TreeNode(ints[i]);

    // 栈中小于当前节点值的元素全部出栈，当前节点连接到最后一个弹出栈的结点的右边
    while (stack.length > 0 && stack[stack.length - 1].val < currentNode.val) {
        node = stack.pop();
        if(stack.length > 0 ){
            gfNode =  stack[stack.length - 1];
        }
    }

    if (node.val < currentNode.val) {
        node.right = currentNode;
        gfNode = node;
    } else {
        if(currentNode.val < gfNode.val){
            isTree = false;
            break;
        }
        node.left = currentNode;
    }
    stack.push(currentNode);
}

if(isTree){
    //最左侧节点
    let leftNode = rootNode;
    while (leftNode.left != null || leftNode.right != null){

        if(leftNode.left != null){
            leftNode = leftNode.left;
        }else {
            leftNode = leftNode.right;
        }
    }
    //最右侧节点
    let rightNode = rootNode;
    while (rightNode.left != null || rightNode.right != null){

        if(rightNode.right != null){
            rightNode = rightNode.right;
        }else {
            rightNode = rightNode.left;
        }
    }

    console.log("1 " + 
                (leftNode.val == rootNode.val ? 0 : leftNode.val) + " " +
                (rightNode.val == rootNode.val ? 0 : rightNode.val));
}else {
    console.log("0 0 0");
}




## 数字序列比大小
知识点数组排序贪心

时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
A，B两个人玩一个数字比大小的游戏，在游戏前，两个人会拿到相同长度的两个数字序列，两个数字序列不相同的，且其中的数字是随机的。
A，B各自从数字序列中挑选出一个数字进行大小比较，赢的人得1分，输的人扣1分，相等则各自的分数不变。 用过的数字需要丢弃。
求A可能赢B的最大分数。
输入描述：
输入数据的第1个数字表示数字序列的长度N，后面紧跟着两个长度为N的数字序列。

输出描述：
A可能赢B的最大分数

补充说明：
提示：

1、这里要求计算A可能赢B的最大分数，不妨假设，A知道B的数字序列，且总是B先挑选数字并明示。

2、可以采用贪心策略，能赢的一定要赢，要输的尽量减少损失。

示例1
输入：
3
4 8 10
3 6 4
输出：
3
说明：
输入数据第1个数字表示数字序列长度为3，后面紧跟着两个长度为3的数字序列。
序列A：
4 8 10
序列B：
3 6 4

A可以赢的最大分数是3。获得该分数的比大小过程可以是：

1）A：4   B：3 

2）A：8   B：6

3）A：10  B：4

解题思路：
田忌赛马

1、对A、B进行升序排序

2、用 A 最小的数跟 B 中最小的数对比

     a）小于 B 中最小的数，则让它跟 B 中最大的数比，明显比不过，这样直接 -1，而 

           B 也损失了最大的数

     b）大于 B 中最小的数，则直接 +1

     c）等于 B 中最小的数，则啥也不做

代码： 
// let N = Number(readline());
// let A = readline().split(" ").map(Number);
// let B = readline().split(" ").map(Number);
let N = Number("3");
let A = "4 8 10".split(" ").map(Number);
let B = "3 6 4".split(" ").map(Number);

let listA = [];
let listB = [];
for(let i=0; i<N; i++){
    listA.push(A[i]);
    listB.push(B[i]);
}

listA.sort((a,b) => {return a-b});
listB.sort((a,b) => {return a-b});

let res = 0;
for(let i=0; i<N; i++){
    let numA = listA[i];
    if(numA < listB[0]){
        //A小于B的第一个数，则让他跟B的最大数比
        res --;
        listB.pop();
    }else {
        if(numA > listB[0]){
            res ++;
        }
        listB.shift();
    }
}

console.log(res);




## 树状结构查询
知识点递归哈希表

时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
通常使用多行的节点、父节点表示一棵树，比如
西安 陕西
陕西 中国
江西 中国
中国 亚洲
泰国 亚洲
输入一个节点之后，请打印出来树中他的所有下层节点
输入描述：
第一行输入行数，下面是多行数据，每行以空格区分节点和父节点

接着是查询节点

输出描述：
输出查询节点的所有下层节点。以字典序排序

补充说明：
树中的节点是唯一的，不会出现两个节点，是同一个名字

示例1
输入：
5
b a
c a
d c
e c
f d
c
输出：
d
e
f
解题思路：
广度搜索

代码：
//let n = Number(readline());
let n = Number("5");

let list = [];
let test = [
    "b a",
    "c a",
    "d c",
    "e c",
    "f d"
];
for(let i=0; i<n; i++){
    //let strings = readline().split(" ");
    let strings = test[i].split(" ");
    list.push(strings);
}

//let check = readline();
let check = "c";
//set可以去重
var set = new Set();
handle( list, check);
//转换成集合进行排序
let res = [...set]
//升序排序
res.sort((a, b) => a.localeCompare(b)); 

for(let s of res){
    console.log(s);
}

function handle( list, check){

    for(let i=0; i<list.length; i++){
        let strings = list[i];
        if(strings[1] == check){
            set.add( strings[0]);
            handle( list, strings[0]);
        }
    }

}



## 人气最高的店铺
知识点贪心排序

时间限制：1s 空间限制：32MB 限定语言：不限】

题目描述：
某购物城有m个商铺，现决定举办一场活动选出人气最高店铺。活动共有n位市民参与，每位市民只能投一票，但1号店铺如果给该市民发放q元的购物补贴，该市民会改为投1号店铺。
请计算1号店铺需要最少发放多少元购物补贴才能成为人气最高店铺（即获得的票数要大于其他店铺），如果1号店铺本身就是票数最高店铺，返回0。
输入描述：
第一行为小写逗号分割的两个整数n，m，其中第一个整数n表示参与的市民总数， 第二个整数m代表店铺总数，1 <= n, m <= 3000。

第2到n+1行，每行为小写逗号分割的两个整数p，q，表示市民的意向投票情况，其中每行的第一个整数p表示该市民意向投票给p号店铺，第二个整数q表示其改投1号店铺所需给予的q元购物补贴，1 <= p <= m, 1 <= q <= 10^9。

不考虑输入的格式问题。

输出描述：
1号店铺需要最少发放购物补贴金额。

示例1
输入：
5,5
2,10
3,20
4,30
5,40
5,90
输出：
50
说明：
有5个人参与，共5个店铺。
如果选择发放 10元+20元+30元=60元 的补贴来抢2,3,4号店铺的票，总共发放了60元补贴(5号店铺有2票，1号店铺要3票才能胜出)
如果选择发放 10元+40元=50元 的补贴来抢2,5号店铺的票，总共发放了50元补贴(抢了5号店铺的票后，现在1号店铺只要2票就能胜出)
所以最少发放50元补贴

示例2
输入：
5,5
2,10
3,20
4,30
5,80
5,90
输出：
60
说明：
有5个人参与，共5个店铺。
如果选择发放 10元+20元+30元=60元 的补贴来抢2,3,4号店铺的票，总共发放了60元补贴(5号店铺有2票，1号店铺要3票才能胜出)
如果选择发放 10元+80元=90元 的补贴来抢2,5号店铺的票，总共发放了90元补贴(抢了5号店铺的票后，现在1号店铺只要2票就能胜出)
所以最少发放60元补贴

代码： 
//let input1 = readline().split(",").map(Number);
let input1 = "5,5".split(",").map(Number);
let n = input1[0];
let m = input1[1];

/**
 * key：店铺
 * value：人气
 */
var map = new Map();
let peopleList = [];
//给一号店铺初始化一个 0 人气
let test = [
    "2,10",
    "3,20",
    "4,30",
    "5,40",
    "5,90",
];
map.set( 1, 0);
for(let i=0; i<n; i++){
    //let input2 = readline().split(",").map(Number);
    let input2 = test[i].split(",").map(Number);
    //店铺
    let a = input2[0];
    //人气
    let b = input2[1];
    if(a != 1){
        peopleList.push([ a, b]);
    }
    if(map.has(a)){
        map.set( a, map.get( a) + 1);
    }else{
        map.set( a, 1);
    }
    
}

//获得最高人气的最少钱
var min = Number.MAX_VALUE;
//换票需要的钱
var money;
handle( peopleList, [], 0);

console.log(min);

/**
 * 
 * @param peopleList    人员投票集合
 * @param changeList    换票集合
 * @param index         索引
 */
function handle( peopleList, changeList, index){

    if(isMax( changeList) && min > money){
        min = money;
    }else {

        for(let i=index; i<peopleList.length; i++){

            changeList.push(peopleList[i]);
            handle( peopleList, changeList, i+1);
            changeList.pop();

        }

    }

}

function isMax( changeList){

    let newMap = new Map(map);
    //换票需要的钱
    money = 0;
    for(let ints of changeList){
        //支持的店铺
        let num = ints[0];
        money += ints[1];
        //被换票的店铺人气 -1
        newMap.set( num, newMap.get(num) - 1);
        //一号店铺人气 +1
        newMap.set( 1, newMap.get(1) + 1);
    }

    let list = Array.from(newMap);
    //根据人气降序排序
    list.sort((a,b) => {
        return b[1] - a[1];
    });

    //人气第一个的店铺
    let firstNum = list[0][0];
    if(firstNum == 1 && (list.length == 1 || list[0][1] > list[1][1])){
        //人气第一的店铺是一号铺，且只有一号店铺有人气或者大于排名第二的人气
        return true;
    }

    return false;
}




## 采样过滤
知识点滑窗

时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
在做物理实验时，为了计算物体移动的速率，通过相机等工具周期性的采样物体移动距离。由于工具故障，采样数据存在误差甚至错误的情况。需要通过一个算法过滤掉不正确的采样值。不同工具的故障模式存在差异，算法的各类门限会根据工具类型做相应的调整。请实现一个算法，计算出给定一组采样值中正常值的最长连续周期。
判断第i个周期的采样数据S[i]是否正确的规则如下（假定物体移动速率不超过10个单元,前一个采样周期S[i-1])：
S[i] <= 0，即为错误值
S[i] < S[i-1]，即为错误值
S[i] - S[i-1] >= 10，即为错误值
其它情况为正常值
判断工具是否故障的规则如下：
在M个周期内，采样数据为错误值的次数为T（次数可以不连续），则工具故障。
判断故障恢复的条件如下：
产生故障后的P个周期内，采样数据一直为正常值，则故障恢复。
错误采样数据的处理方式：
检测到故障后，丢弃从故障开始到故障恢复的采样数据。
在检测到工具故障之前，错误的采样数据，则由最近一个正常值代替；如果前面没有正常的采样值，则丢弃此采样数据。
给定一段周期的采样数据列表S，计算正常值的最长连续周期。
输入描述：
故障确认周期数和故障次数门限分别为M和T，故障恢复周期数为P。

第i个周期，检测点的状态为Si

输入为两行，格式如下：

M T P

S1 S2 S3 ...

M、T和P的取值范围为[1, 100000]

Si取值范围为[0, 100000]，i从0开始编号

输出描述：
一行输出正常值的最长连续周期

示例1
输入：
10 6 3
-1 1 2 3 100 10 13 9 10
输出：
8
说明：
S[0]，S[4]，S[7]，S[8]为错误值。S[0]之前没有正常的采样数据，丢弃S[0]。S[4]和S[7]不满足故障条件，此值分别由S[3]和S[6]代替，即S[4]为3，S[7]为13。替换后，S[8]小于S[7]，也是错误值。

示例2
输入：
5 3 3
0 1 2 -1 4 3 6 7 6 6 10 11 12
输出：
9
说明：
S[3]，S[5]，S[8]，S[9]为错误值。从S[3]到S[7]的5个周期内只有两个错误值S[3]和S[5]。从S[5]到S[9]的5个周期内有三个错误值S[5]、S[8]和S[9]，工具故障。丢弃S[9]到S[12]的值。

示例3
输入：
5 3 3
1 2 -1 -2 -3 6 7 8 9 10 11 12
输出：
5
说明：
S[2]，S[3]，S[4]为错误值。从S[2]到S[6]的5个周期内有三个错误值，工具故障。丢弃S[4]到S[6]的值。有两段正常连续周期，S[0]到S[3]（周期数为4）和S[7]到S[11]（周期数为5）。

代码： 
//let input1 = readline().split(" ").map(Number);
let input1 = "5 3 3".split(" ").map(Number);

let M = input1[0];
let T = input1[1];
let P = input1[2];

//let ints = readline().split(" ").map(Number);
let ints = "0 1 2 -1 4 3 6 7 6 6 10 11 12".split(" ").map(Number);
let len = ints.length;

//存放故障下标
let badNum = [];
//故障开始的下标
let badEnd = 0;
//最新的正常数据（用来判断后面数据是否故障）
let right = 0;
//正常数据的连续周期（最终所求数据）
let rightLen = 0;
//故障恢复的下标（表示从此刻开始恢复采样）
let rightBegin = 0;
//故障后的正常连续周期（用来判断故障是否恢复）
let huifu = 0;
//是否故障
let isBad = false;

if(ints[0] < 0){
    badNum.push(0);
    //第一个数据如果故障直接丢弃
    rightBegin = 1;
}

for(let i=1; i<len; i++){
    if(i == len-1 && !isBad){
        //遍历到最后一位，且没有故障
        rightLen = Math.max( rightLen, len-rightBegin);
        break;
    }
    if(ints[i] < 0 || ints[i] < right || ints[i] - right >= 10){
        //数据异常
        badNum.push(i);
        //有了故障数据，恢复周期清零
        huifu = 0;
    }else {
        //最新的正常数据
        right = ints[i];
        if(isBad){
            huifu ++;
            if(huifu == P){
                //故障恢复，正常数据开始，标记正常数据开始下标
                rightBegin = i;
                //故障清除
                isBad = false;
            }
        }
    }
    if(badNum.length > 0 && i - badNum[0] + 1 == M){
        //从故障到当前M个周期内
        if(badNum.length >= T){
            //故障个数大于T，表示工具故障
            //故障开始下标为最后一个故障下标
            badEnd = badNum[badNum.length - 1];
            //故障开始下标减去正常数据开始下标则为正常周期
            rightLen = Math.max( rightLen, badEnd - rightBegin);
            isBad = true;
            huifu = i - badEnd;
            badNum = [];
        }else {
            //M周期内没有T个故障
            badNum.shift();
        }
    }
}

console.log(rightLen);




## 跳格子
时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
小明和朋友玩跳格子游戏， 有 n 个连续格子，每个格子有不同的分数，小朋友可以选择从任意格子起跳，但是不能跳连续的格子，也不能回头跳;
给定一个代表每个格子得分的非负整数数组，计算能够得到的最高分数。
输入描述：
给定一个数例，如：

1 2 3 1

输出描述：
输出能够得到的最高分，如：

4

补充说明：
1 <= nums.length <= 100 

0 <= nums[i] <= 1000

示例1
输入：
1 2 3 1
输出：
4
说明：
选择跳第一个格子和第三个格子

示例2
输入：
2 7 9 3 1
输出：
12
说明：
2+9+1=12

解题思路：
这个道题跟跳格子2差不多，还简单点，因为不需要考虑首位相连的问题。

动态规划：

                   f [i] = Math.max( f[i-1]， f[i-2] + nums[i])

代码： 
//let nums = readline().split(" ").map(Number);
let nums = "2 7 9 3 1".split(" ").map(Number);

let core = Array(nums.length);
core[0] = nums[0];
core[1] = Math.max( core[0], nums[1]);
for(let i=2; i<nums.length; i++){

    core[i] = Math.max( core[i-1], core[i-2] + nums[i]);

}

console.log(core[nums.length - 1]);



## 字符匹配
知识点贪心

时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
给你一个字符串数组（每个字符串均由小写字母组成）和一个字符规律（由小写字母和.和*组成），识别数组中哪些字符串可以匹配到字符规律上。
'.' 匹配任意单个字符，'*' 匹配零个或多个任意字符；判断字符串是否匹配，是要涵盖整个字符串的，而不是部分字符串。
输入描述：
第一行为空格分割的多个字符串，1<单个字符串长度<100，1<字符串个数<100

第二行为字符规律，1<=字符规律长度<=50

不需要考虑异常场景

输出描述：
匹配的字符串在数组中的下标（从0开始），多个匹配时下标升序并用,分割，若均不匹配输出-1

示例1
输入：
ab aab abacd
.*
输出：
0,1,2
说明：
ab中a匹配. b匹配* 可以全匹配；aab中a匹配. ab匹配* 可以全匹配；abacd中a匹配. bacd匹配* 可以全匹配；输出对应字符串数组下标 0,1,2

示例2
输入：
ab aab
a.b
输出：
1
说明：
aab中第一个a匹配a 第二个a匹配. b匹配b 可以全匹配； 输出对应字符串数组下标1

代码： 
// let  strArr = readline().split(" ");
// let ruler = readline();
let  strArr = "jghaabaa".split(" ");
let ruler = ".*ab";

let len = strArr.length;
let res = "";
for (let i = 0; i < len; i++) {
    if (handle( ruler, strArr[i], 0, 0)) {
        res += i + ",";
    }
}

if (res == "") {
    console.log(-1);
}else {
    console.log(res.substring( 0, res.length - 1));
}

function handle( ruler, string, rulIndex, strIndex) {

    //匹配规则
    let rulLen = ruler.length;
    //字符串
    let strLen = string.length;

    for (let i = rulIndex, j = strIndex; i < rulLen && j < strLen; i++, j++) {

        // i 是规则索引，j是字符串索引
        let c = ruler.charAt(i);

        if (c >= 'a' && c <= 'z') {
            //规则是字符直接进行匹配
            if(string.charAt(j) != c) {
                //字符匹配失败，则失败
                return false;
            }
        }else if (c == '*') {

            if (i == rulLen - 1) {
                // * 作为规则的最后一个，说明字符串后面可以是任意字符，则成功
                return true;
            }

            let res = false;
            for (let k = j; k < strLen; k++) {
                if(ruler.charAt(i + 1) == string.charAt(k)
                    && handle( ruler, string, i + 1, k))
                {
                    res = true;
                    break;
                }

            }
            return res;
        }

        if (i == rulLen - 1 && j != strLen - 1) {
            //规则匹配完成，但是字符串还没有匹配完成
            return false;
        }

        if (j == strLen - 1) {
            //字符串匹配完成
            for (let k = i+1; k < rulLen; k++) {
                if (ruler.charAt(k) != '*') {
                    //规则后面如果有除了*的字符，则失败
                    return false;
                }
            }
            return true;
        }

    }

    return true;
}




## 找出两个整数数组中同时出现的整数
知识点数组哈希表排序

时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
现有两个整数数组，需要你找出两个数组中同时出现的整数，并按照如下要求输出：
1、有同时出现的整数时，先按照同时出现次数（整数在两个数组中都出现并且出现次数较少的那个）进行归类，然后按照出现次数从小到大依次按行输出。
2、没有同时出现的整数时，输出NULL。
输入描述：
第一行为第一个整数数组，第二行为第二个整数数组，每行数据中整数与整数之间以英文逗号分隔，整数的取值范围为[-200,200]，数组长度的范围为[1,10000]之间的整数。

输出描述：
按照出现次数从小到大依次按行输出，每行输出的格式为:出现次数:该出现次数下的整数升序排序的结果。

格式中的":"为英文冒号，整数间以英文逗号分隔。

示例1
输入：
5,3,6,-8,0,11
2,8,8,8,-1,15
输出：
NULL
说明：
两个整数数组没有同时出现的整数，输出NULL。

示例2
输入：
5,8,11,3,6,8,8,-1,11,2,11,11
11,2,11,8,6,8,8,-1,8,15,3,-9,11
输出：
1:-1,2,3,6
3:8,11
说明：
两个整数数组中同时出现的整数为-1、2、3、6、8、11，其中同时出现次数为1的整数为-1,2,3,6(升序排序)，同时出现次数为3的整数为8,11(升序排序)，先升序输出出现次数为1的整数，再升序输出出现次数为3的整数。

解题思路：
这道题基本没有啥难度，只需要使用map来统计数字出现的次数，然后再进行比较。

代码： 
// let strings1 = readline().split(",").map(Number);
// let strings2 = readline().split(",").map(Number);
let strings1 = "5,8,11,3,6,8,8,-1,11,2,11,11".split(",").map(Number);
let strings2 = "11,2,11,8,6,8,8,-1,8,15,3,-9,11".split(",").map(Number);

let map1 = handle(strings1);
let map2 = handle(strings2);

let resMap = new Map();
for(let map of map1){

    let str = map[0];
    if(map2.has(str)){

        let num = Math.min( map[1], map2.get(str));

        if(resMap.has(num)){
            resMap.get(num).add(str);
        }else {
            let treeSet = new Set();
            treeSet.add(str);
            resMap.set( num, treeSet);
        }
    }
}

if(resMap.size == 0){
    console.log("null");
    System.exit(0);
} else {
    let list = Array.from(resMap);
    list.sort((a,b) => a[0] - b[0]);
    
    for(let map of list){
        console.log(map[0] + ":" + Array.from(map[1]).sort());
    }
}

function handle(nums){

    let map = new Map();
    for(let n of nums){
        map.set( n, (map.has(n) ? map.get(n) : 0)  + 1);
    }

    return map;
}




## 评论转换输出
时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
在一个博客网站上，每篇博客都有评论。每一条评论都是一个非空英文字母字符串。
评论具有树状结构，除了根评论外，每个评论都有一个父评论。
当评论保存时，使用以下格式：
首先是评论的内容；
然后是回复当前评论的数量。
最后是当前评论的所有子评论。（子评论使用相同的格式嵌套存储）
所有元素之间都用单个逗号分隔。
例如，如果评论如下：


第一条评论是"hello,2,ok,0,bye,0"，第二条评论是"test,0"，第三条评论是"one,1,two,1,a,0"。
所有评论被保存成"hello,2,ok,0,bye,0,test,0,one,1,two,1,a,0"。

对于上述格式的评论，请以另外一种格式打印：
首先打印评论嵌套的最大深度。
然后是打印n行，第i（1<=i<=n)行对应于嵌套级别为i的评论（根评论的嵌套级别为1）。
对于第i行，嵌套级别为i的评论按照它们出现的顺序打印，用空格分隔开。
输入描述：
一行评论。由英文字母、数字和英文逗号组成。

保证每个评论都是由英文字符组成的非空字符串。

每个评论的数量都是整数（至少由一个数字组成）。

整个字符串的长度不超过106。

给定的评论结构保证是合法的。

输出描述：
按照给定的格式打印评论。对于每一级嵌套，评论应该按照输入中的顺序打印

示例1
输入：
hello,2,ok,0,bye,0,test,0,one,1,two,1,a,0
输出：
3
hello test one 
ok bye two 
a
说明：
如题目描述中图所示，最大嵌套级别为3。嵌套级别为1的评论是"hello test one"，嵌套级别为2的评论是"ok bye two"，嵌套级别为3的评论为"a"。

示例2
输入：
A,5,A,0,a,0,A,0,a,0,A,0
输出：
2
A
A a A a A
说明：
如下图所示，最大嵌套级别为2，嵌套级别为1的评论是"A"，嵌套级别为2的评论是"A a A a A"



示例3
输入：
A,3,B,2,C,0,D,1,E,0,F,1,G,0,H,1,I,1,J,0,K,1,L,0,M,2,N,0,O,1,P,0
输出：
4
A K M 
B F H L N O 
C D G I P 
E J
说明：
如下图所示。



解题思路：
主要使用联表思路去解决这个问题！

代码： 
//let strings = readline().split(",");
let strings = "A,3,B,2,C,0,D,1,E,0,F,1,G,0,H,1,I,1,J,0,K,1,L,0,M,2,N,0,O,1,P,0".split(",");
//评论的集合
let nodeList = [];
let map = new Map();

class Node{
    
    /**
     * @param row       评论层数
     * @param content   评论内容
     * @param child     评论回复
     */
    constructor( row, content, child){

        this.row = row;
        this.content = content;
        this.child = child;

    }

}

for(let i=0; i<strings.length; i+=2){
    //当前评论的内容
    let content = strings[i];
    //当前评论有几个回复
    let child = Number(strings[i+1]);
    //初始化层数
    let row = 1;

    //从后往前遍历
    for(let j = nodeList.length - 1; j >= 0; j--){
        let node = nodeList[j];
        if(node.child != 0){
            //如果这个节点还有子节点，那就属于这个节点
            node.child --;
            row = node.row + 1;
            break;
        }
    }

    let node = new Node( row, content, child);
    nodeList.push(node);
    map.set( row, (map.has(row) ? map.get(row) : "") + content + " ");
}

for(let str of map.values()){
    console.log(str.substring(0, str.length - 1));
}




## 最佳植树距离
知识点二分查找

时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
按照环保公司要求，小明需要在沙化严重的地区进行植树防沙工作，初步目标是种植一条直线的树带。由于有些区域目前不适合种植树木，所以只能在一些可以种植的点来种植树木。

在树苗有限的情况下，要达到最佳效果，就要尽量散开种植，不同树苗之间的最小间距要尽量大。给你一个适合种植树木的点坐标和一个树苗的数量，请帮小明选择一个最佳的最小种植间距。
 
例如，适合种植树木的位置分别为1,3,5,6,7,10,13  树苗数量是3，种植位置在1,7,13，树苗之间的间距都是6，均匀分开，就达到了散开种植的目的，最佳的最小种植间距是6
输入描述：
第1行表示适合种树的坐标数量
第2行是适合种树的坐标位置
第3行是树苗的数量
例如，
7
1 5 3 6 10 7 13
3

输出描述：
最佳的最小种植间距

补充说明：
位置范围为1~10000000，种植树苗的数量范围2~10000000，用例确保种植的树苗数量不会超过有效种植坐标数量。

示例1
输入：
7
1 5 3 6 10 7 13
3
输出：
6
解题思路：
这道题主要使用二分法。

1、最小的间隔距离为1，最大的间隔距离为最后一棵树到第一棵数的距离。

2、每次对距离进行折中，然后按照折中的距离进行栽树，如果载的树的数量

大于等于题目要求的树的数量，则表示此距离还可以进行放大；如果是小于要

求的树的数量，则表示需要缩小。以此类推，找到其中最大距离。

代码： 
// let n = Number(readline());
// var positions = readline().split(" ").map(Number);
// var num = Number(readline());
let n = Number("7");
var positions = "1 5 3 6 10 7 13".split(" ").map(Number);
var num = Number("3");

positions.sort((a,b) => {return a-b});
//假定最小距离为1，最大距离为 最大位置-最小位置
let min = 1, max = positions[n - 1] - positions[0];
while (min < max) {
    //取中间位置
    let mid = Math.floor((min + max) / 2);

    if (handle(mid)) {
        min = mid;
    } else {
        max = mid - 1;
    }
}

console.log(max);

function handle( mid) {
    //植树的总棵数
    let count = 1;
    //第一棵树的位置
    let curPos = positions[0];
    for (let i = 1; i < positions.length; i++) {
        if (positions[i] - curPos >= mid) {
            //相距位置大于等于 mid，则可以种树
            count ++;
            //相对位置需要改变
            curPos = positions[i];
        }
    }

    return count >= num;
}




## 观看文艺汇演问题
时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
为庆祝中国共产党成立100周年，某公园将举行多场文艺汇演，很多演出都是同时进行。
一个人只能同时观看一场演出，且不能迟到早退。由于演出分散在不同的演出场地，所以连续观看的演出最少要有15分钟的时间间隔。
小明是一个狂热的文艺迷，想观看尽可能多的演出。现给出演出时间表，请帮小明计算他最多能观看几场演出。
输入描述：
第一行为一个数N，表示演出场数，1<=N<=1000
接下来N行，每行两个空格分隔的整数，第一个整数T表示演出开始时间，第二个整数L表示演出持续时间。T和L的单位都是分钟，0<=T<=1440，0<L<=180

输出描述：
请输出最多能观看的演出场数

示例1
输入：
2
720 120
840 120
输出：
1
说明：
两场演出间隔时间为0，不满足最小15分钟时间间隔的要求，所以最多只能观看一场演出

示例2
输入：
2
0 60
90 60
输出：
2
说明：
两场演出间隔大于15分钟，都能观看到

解题思路：
1、首先我们先将所有演出的开始时间和结束时间计算出来，并进行排序：演出时间早的在前；演出时间相等的，结束时间早的在前。

2、类似动态规划的解法：新建一个长度为 N 的数组，表示每一时刻的最多观看场次：

      a)  如果本场演出的开始时间 与 上场演出的结束时间 相差大于等于 15 分钟，则

            f [ i ] = f [ i -1] + 1，同时将本场的结束时间作为下场演出的对比时间

      b)  如果本场演出的开始时间 与 上场演出的结束时间 相差小于 15 分钟，则

            f [ i ] = f [ i -1] ，且需要将本场的结束时间与上场的结束时间做个对比，将较小

            的时间作为下场演出的对比时间

         （相当于这场与上场二选一，当然选择结束较早的了）

3、最后输出步骤2中数组的最后一个值，即为最多观看场数

代码： 
//let n = Number(readline());
let n = Number("8");
//演出集合
let list = [];
let test = ["10 10",
    "15 10",
    "40 10",
    "45 15",
    "70 130",
    "75 10",
    "100 20",
    "150 30"]
for(let i=0; i<n; i++){
    //let ints = readline().split(" ").map(Number);
    let ints = test[i].split(" ").map(Number);
    //演出结束时间
    ints[1] += ints[0];
    list.push(ints);
}

list.sort((a,b) => {
    if(a[0] == b[0]){
        //开始时间相等的，结束时间小的在前
        return a[1] - b[1];
    }
    //开始时间小的在前
    return a[0] - b[0];
});

let res = Array(n).fill(0);
res[0] = 1;
//第一个演出的结束时间
let end = list[0][1];
for(let i=1; i<list.length; i++){
    //当前演出的开始时间
    let left = list[i][0];
    //当前演出的结束时间
    let right = list[i][1];
    if(left - end >= 15){
        //当前演出的开始时间与上场演出的结束时间相差大于等于15
        //场次+1
        res[i] = res[i-1] + 1;
        //更新结束时间
        end = right;
    }else {
        //不能观看演出则直接取前一个值
        res[i] = res[i-1];
        //结束时间去比较小的，方便后面再观看其他演出
        end = Math.min( end, right);
    }
}

console.log(res[res.length-1]);




## 跳格子游戏
知识点图

时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
地上共有N个格子，你需要跳完地上所有的格子，但是格子间是有强依赖关系的，跳完前一个格子后，后续的格子才会被开启，格子间的依赖关系由多组steps数组给出，steps[0]表示前一个格子,steps[1]表示steps[0]可以开启的格子:
比如[0,1]表示从跳完第0个格子以后第1个格子就开启了，比如[2,1]，[2,3]表示跳完第2个格子后第1个格子和第3个格子就被开启了
请你计算是否能由给出的steps数组跳完所有的格子,如果可以输出yes，否则输出no
说明：
1.你可以从一个格子跳到任意一个开启的格子
2.没有前置依赖条件的格子默认就是开启的
3.如果总数是N，则所有的格子编号为[0,1,2,3....N-1]连续的数组
输入描述：
输入一个整数N表示总共有多少个格子，接着输入多组二维数组steps表示所有格子之间的依赖关系

输出描述：
如果能按照steps给定的依赖顺序跳完所有的格子输出yes

否则输出no

补充说明：
1 <= N <500

steps[i].length=2

0<=step[i][0]，step[i][1]<N

示例1
输入：
3
0 1
0 2
输出：
yes
说明：
总共有三个格子[0,1,2]，跳完0个格子后第1个格子就开启了，跳到第0个格子后第2个格子也被开启了，按照0->1->2或者0->2->1的顺序都可以跳完所有的格子

示例2
输入：
2
1 0
0 1
输出：
no
说明：
总共有2个格子，第1个格子可以开启第0格子，但是第1个格子又需要第0个格子才能开启，相互依赖，因此无法完成

示例3
输入：
6
0 1
0 2
0 3
0 4
0 5
输出：
yes
说明：
总共有6个格子，第0个格子可以开启第1,2,3,4,5个格子，所以跳完第0个格子之后其他格子都被开启了，之后按任何顺序可以跳完剩余的格子

示例4
输入：
5
4 3
0 4
2 1
3 2
输出：
yes
说明：
跳完第0个格子可以开启格子4，跳完格子4可以开启格子3，跳完格子3可以开启格子2，跳完格子2可以开启格子1，按照0->4->3->2->1这样就跳完所有的格子

示例5
输入：
4
1 2
1 0
输出：
yes
说明：
总共4个格子[0,1,2,3]，格子1和格子3没有前置条件所以默认开启，格子1可以开启格子0和格子2，所以跳到格子1之后就可以开启所有的格子，因此可以跳完所有格子

解题思路
例如：依赖键值对为 {4,3}{0,4}{2,1}{3,2}{2,0}
 遍历所有的键值对
 例：
   从第一个{4,3}开始
   {4,3}->{3,2}  {4,3,2}
       ┊
       --{4,3,2}->{2,1}  {4,3,2,1}
       ┊
       --{4,3,2}->{2,0} {4,3,2,0}
           ┊
           --{4,3,2,0}->{0,4}  {4,3,2,0}中包含4产生闭环，返回false

代码：
let n = Number(readLine());
//let n = Number("2");
//let test = ["1 0","0 1"];

let list = []

while (readLine()){
    list.push(readLine().split(" ").map(Number));
}
// for(let i=0;i<test.length;i++){
//     list.push(test[i].split(" ").map(Number));
// }

let isTrue = true;
let len = list.length;  //依赖关系的键值对长度

for (let i=0;i<len;i++){
    if(isBH(list[i])){
        isTrue = false;
        break;
    }
}

console.log(isTrue ? "yes" : "no");

/**
 * {4,3}{0,4}{2,1}{3,2}{2,0}
 * 遍历所有的键值对
 *例：
 *  从第一个{4,3}开始
 *  {4,3}->{3,2}  {4,3,2}
 *      ┊
 *      --{4,3,2}->{2,1}  {4,3,2,1}
 *      ┊
 *      --{4,3,2}->{2,0} {4,3,2,0}
 *          ┊
 *          --{4,3,2,0}->{0,4}  {4,3,2,0}中包含4产生闭环，返回false
 */
function isBH( listC){

    for(let i=0; i<list.length; i++){

        let temp = list[i];
        if(temp[0] == listC[listC.length-1]){
            if(listC.includes(temp[1])){
                return true;
            }
            listC.push(temp[1]);
            isBH(listC);
        }
    }

    return false;
}





## 分积木
知识点位运算线性表

时间限制：1s 空间限制：32MB 限定语言：不限

题目描述：
Solo和koko是两兄弟，妈妈给了他们一大堆积木，每块积木上都有自己的重量。现在他们想要将这些积木分成两堆。哥哥Solo负责分配，弟弟koko要求两个人获得的积木总重量“相等”（根据Koko的逻辑），个数可以不同，不然就会哭，但koko只会先将两个数转成二进制再进行加法，而且总会忘记进位（每个进位都忘记）。如当25（11101）加11（1011）时，koko得到的计算结果是18（10010）：
 11001
+01011
--------
 10010
Solo想要尽可能使自己得到的积木总重量最大，且不让koko哭。
输入描述：
3

3 5 6

第一行是一个整数N(2≤N≤100)，表示有多少块积木；第二行为空格分开的N个整数Ci(1≤Ci≤106)，表示第i块积木的重量。

输出描述：
11

让koko不哭，输出Solo所能获得积木的最大总重量；否则输出“NO”。

补充说明：
如果能让koko不哭，输出Solo所能获得的积木的总重量，否则输出-1。

该样例输出为11。

解释：Solo能获得重量为5和6的两块积木，5转成二级制为101，6转成二进制位110，按照koko的计算方法（忘记进位），结果为11(二进制)。Koko获得重量为3的积木，转成二进制位11(二进制)。Solo和koko得到的积木的重量都是11(二进制)。因此Solo可以获得的积木的总重量是5+6=11（十进制）。

示例1
输入：
3
3 5 6
输出：
11
解题思路：
在不进位的情况下进行二进制运算，其实就是异或运算。

根据题意，就是需要所有值的异或运算最终结果为0

当所有值的异或运算为0，就可以进行平分，只要减去最小的积木重量，solo就能获取最多的积木重量；否则返回No。

代码： 
let n = Number(readLine());
let arr = readLine().split(" ").map(Number);
// let n = Number("3");
// let arr = "3 5 6".split(" ").map(Number);

console.log(getResult(arr));

function getResult(arr){

    if(arr.length == 2 && arr[0] != arr[1]) return "NO";
    let min = arr[0];
    let sum = min;
    let temp = min;
    for(let i = 1; i<arr.length; i++){
        sum += arr[i];
        min = min< arr[i]?min:arr[i];
        temp ^= arr[i];
    }
    if(temp != 0) {
        return "NO";
    }else{
        return sum-min;
    }
}



## 篮球比赛
知识点广搜

时间限制：1s 空间限制：64MB 限定语言：不限

题目描述：
篮球（5V5）比赛中，每个球员拥有一个战斗力，每个队伍的所有球员战斗力之和为该队伍的总体战斗力。现有10个球员准备分为两队进行训练赛，教练希望2个队伍的战斗力差值能够尽可能的小，以达到最佳训练效果。给出10个球员的战斗力，如果你是教练，你该如何分队，才能达到最佳训练效果？请输出该分队方案下的最小战斗力差值。
输入描述：
10个篮球队员的战斗力（整数，范围[1,10000]），战斗力之间用空格分隔，如：10 9 8 7 6 5 4 3 2 1

不需要考虑异常输入的场景。

输出描述：
最小的战斗力差值，如：1

示例1
输入：
10 9 8 7 6 5 4 3 2 1
输出：
1
说明：
1 2 5 9 10分为一队，3 4 6 7 8分为一队，两队战斗力之差最小，输出差值1。备注：球员分队方案不唯一，但最小战斗力差值固定是1

代码（暴力解法）： 
let people = readLine().split(" ").map(i=>parseInt(i));
//let people = "10 9 8 7 6 5 4 3 2 1".split(" ").map(i=>parseInt(i));

let count = 0;  //总队员战力
for(let i=0;i<10;i++){
    count+=people[i];
}
let n ;
let min = Number.MAX_VALUE;
for(let i=0;i<6;i++){
    for(let j=i+1;j<7;j++){
        for(let k=j+1;k<8;k++){
            for(let l=k+1;l<9;l++){
                for(let m=l+1;m<10;m++){
                    n = people[i] + people[j] + people[k] + people[l] + people[m];
                    min = Math.min(min, Math.abs(count-2*n));
                }
            }
        }
    }
}
console.log(min);



## 跳格子2
时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
小明和朋友玩跳格子游戏， 有 n 个连续格子组成的圆圈，每个格子有不同的分数，小朋友可以选择从任意格子起跳，但是不能跳连续的格子，不能回头跳，也不能超过一圈 ;
给定一个代表每个格子得分的非负整数数组，计算能够得到的最高分数。
输入描述：
给定一个数例，第一个格子和最后一个格子收尾相连，如：2 3 2

输出描述：
输出能够得到的最高分，如：3

补充说明：
1 <= nums.length <= 100 

0 <= nums[i] <= 1000

示例1
输入：
2 3 2
输出：
3
说明：
只能跳3这个格子，因为第一个格子和第三个格子收尾相连

示例2
输入：
1 2 3 1
输出：
4
说明：
1+3=4

解题思路：
看到这道题基本就想到了动态规划。

                        dp[i] = Math.max( dp[i-1]，dp[i-2] + nums[i])

dp[i] 的值等于往前第二格的值 + 当前位置的值 与 前一格值 的最大值（因为不能连续跳）

不过题目还提示了第一格和最后一格也算相邻，所以我们将数组分成两组：

一组是包含第一格不包含最后一格

一组是包含最后一格不包含第一格

分别计算出上面两组数据，再求出其中最大值。

 代码：
//let ints = sc.nextLine().split(" ");
let ints = "30 7 4 6 10".split(" ").map(Number);

if(ints.length == 1){
    console.log(ints[0]);
} else {
    //包含第一个数字，不包含最后一个数字
    let numsStart = [];
    //不包含第一个数，包含最后一个数
    let numsEnd = [];
    const len = ints.length;
    for(let i=0; i<len; i++){
        let num = ints[i];
        if(i == 0){
            numsStart[i] = num;
            continue;
        }
        if(i == len - 1){
            numsEnd[i-1] = num;
            break;
        }
        numsStart[i] = num;
        numsEnd[i-1] = num;
    }

    let res = Math.max( handle(numsStart), handle(numsEnd));

    console.log(res);
}


/**
 * 动态规划 d[i] = Math.max( dp[i-1], dp[i-2] + nums[i])
 * @param nums
 * @return
 */

function handle( nums){

    let dp = [];
    dp[0] = nums[0];

    for(let i=1; i<nums.length; i++){
        if(i == 1){
            dp[i] = Math.max(nums[i], dp[i-1]);
        }else {
            dp[i] = Math.max( dp[i-1], dp[i-2] + nums[i]);
        }
    }

    return dp[nums.length-1];
}



## 招聘
知识点贪心排序

时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
某公司组织一场公开招聘活动，假设由于人数和场地的限制，每人每次面试的时长不等，并已经安排给定，用(S1,E1)、(S2,E2)、(Sj,Ej)...(Si < Ei，均为非负整数)表示每场面试的开始和结束时间。面试采用一对一的方式，即一名面试官同时只能面试一名应试者，一名面试官完成一次面试后可以立即进行下一场面试，且每个面试官的面试人次不超过m。
为了支撑招聘活动高效顺利进行，请你计算至少需要多少名面试官。
输入描述：
输入的第一行为面试官的最多面试人次m，第二行为当天总的面试场次n，接下来的n行为每场面试的起始时间和结束时间，起始时间和结束时间用空格分隔。

其中，1 <= n, m <= 500

输出描述：
输出一个整数，表示至少需要的面试官数量。

示例1
输入：
2
5
1 2
2 3
3 4
4 5
5 6
输出：
3
说明：
总共有5场面试，且面试时间都不重叠，但每个面试官最多只能面试2人次，所以需要3名面试官。

示例2
输入：
3
3
1 2
2 3
3 4
输出：
1
说明：
总共有3场面试，面试时间都不重叠，每个面试官最多能面试3人次，所以只需要1名面试官。

示例3
输入：
3
3
8 35
5 10
1 3
输出：
2
说明：
总共有3场面试，[5,10]和[8,35]有重叠，所以至少需要2名面试官。

解题思路：
这道题也不是很难。

将所有面试场次放在一个集合里面，并对面试场次进行升序排序：

开始时间小的在前；开始时间相等的，结束时间小的在前。

外层遍历面试场次，内层遍历面试官：

1、如果当前面试官面试场次 等于 m，则需要看下一个面试官；以此类推

2、如果当前面试官 最后一场面试 的 结束时间大于当前面试的开始时间，则表示当前面试官没空，需要看看下一个面试官，以此类推。

3、如果所有面试官都不能进行面试，则新建一个面试官进行面试

最终得所需面试官的个数。

代码：
// const m = Number(readline());
// const n = Number(readline());
const m = Number("3");
const n = Number("3");

class Interview{
    constructor( start, end){
        this.start = start;
        this.end = end;
    }
}

//面试集合
let msList = [];
let test = ["8 35","5 10","1 3"];
for(let i=0; i<n; i++){
    //let input = readline().split(" ").map(Number);
    let input = test[i].split(" ").map(Number);
    let interview = new Interview( input[0], input[1]);
    msList.push(interview);
}
//面试场次进行排序
msList.sort((a,b) => {
    if(a.start == b.start){
        return a.end - b.end;
    }
    return a.start - b.start;
})
//面试官集合
let msgList = [];
for(let ms of msList){
    //面试的开始时间
    let start = ms.start;
    //是否成功进行面试
    let isSuccess = false;
    for(let msg of msgList){
        if(msg.length == m){
            //面试官的面试场次满了
            continue;
        }
        if(msg[msg.length - 1].end <= start){
            //面试的开始时间大于等于面试官上场面试的结束时间
            msg.push(ms);
            //说明成功进行面试
            isSuccess = true;
            break;
        }
    }
    if(!isSuccess){
        //没有成功进行面试，需要新加面试官
        let newList = [];
        newList.push(ms);
        msgList.push(newList);
    }
}
//输出面试官的个数
console.log(msgList.length);


## 最小传输时延
知识点图

时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
某通信网络中有N个网络结点，用1到N进行标识。网络通过一个有向无环图表示，其中图的边的值表示结点之间的消息传递时延。
现给定相连节点之间的时延列表times[i]={u,v,w}，其中u表示源结点，v表示目的结点，w表示u和v之间的消息传递时延。请计算给定源结点到目的结点的最小传输时延，如果目的结点不可达，返回-1。

注：
1、N的取值范围为[1,100]；
2、时延列表times的长度不超过6000，且1 <= u,v <= N, 0 <= w <= 100；
输入描述：
输入的第一行为两个正整数，分别表示网络结点的个数N，以及时延列表的长度M，用空格分隔；
接下来的M行为两个结点间的时延列表[u v w]；
输入的最后一行为两个正整数u和v，分别表示源结点和目的结点；

输出描述：
输出一个整数，表示源结点到目的结点的最小时延。

示例1
输入：
3 3
1 2 11
2 3 13
1 3 50
1 3
输出：
24
说明：
1->3的时延是50，1->2->3时延是11+13=24，所以1到3的最小时延是24；

解题思路：
使用递归求得所有从初始节点到目标节点的时延，输出其中最小值。

 代码：
let input1 = readLine().split(" ").map(Number);
//let input1 = "4 6".split(" ").map(Number);

let N = input1[0];   //节点个数
let M = input1[1];   //时延列表长度
var res = [];    //完成传播的时延集合
var list = []; //时延列表的集合
//let test = ["1 2 11","2 3 13","1 3 50"];
//let test = ["1 2 4","1 3 1","1 4 100","2 3 2","2 4 6","3 4 1"];

for(let i=0;i<M;i++){
    let ints = readLine().split(" ").map(Number);
    //let ints = test[i].split(" ").map(Number);

    if((ints[0]<1 || ints[0]>N) ||
        (ints[1]<1 || ints[1]>N)){
        break;
    }

    list.push(ints);
}

let input2 = readLine().split(" ").map(Number);
//let input2 = "1 4".split(" ").map(Number);

let start = input2[0];   //初始节点
let end = input2[1]; //目标节点

qiushiyan(start, end, 0);

if(res.length == 0){
    console.log(-1);
}else {
    console.log(Math.min(...res));
}

/**
 *
 * @param start 初始节点
 * @param end   目标节点
 * @param count 时延总数
 */
function qiushiyan( start,  end,  count){

    for(let i=0;i<list.length;i++){
        let temp = list[i];
        if(temp[0]==start){
            if(temp[1]==end){
                res.push(count + temp[2]);
                continue;
            }
            qiushiyan(temp[1], end, count + temp[2]);
        }
    }

}



## 猜密码
知识点DFS搜索数组

时间限制：1s 空间限制：32MB 限定语言：不限

题目描述：
小杨申请了一个保密柜，但是他忘记了密码。只记得密码都是数字，而且所有数字都是不重复的。请你根据他记住的数字范围和密码的最小数字数量，帮他算下有哪些可能的组合，规则如下：
1、输出的组合都是从可选的数字范围中选取的，且不能重复；
2、输出的密码数字要按照从小到大的顺序排列，密码组合需要按照字母顺序，从小到大的顺序排序。
3、输出的每一个组合的数字的数量要大于等于密码最小数字数量；
4、如果可能的组合为空，则返回“None”
输入描述：
1、输入的第一行是可能的密码数字列表，数字间以半角逗号分隔

2、输入的第二行是密码最小数字数量

输出描述：
可能的密码组合，每种组合显示成一行，每个组合内部的数字以半角逗号分隔，从小到大的顺序排列。

输出的组合间需要按照字典序排序。

比如：

2,3,4放到2,4的前面

补充说明：
字典序是指按照单词出现在字典的顺序进行排序的方法，比如：

a排在b前

a排在ab前

ab排在ac前

ac排在aca前

示例1
输入：
2,3,4
2
输出：
2,3
2,3,4
2,4
3,4
说明：
最小密码数量是两个，可能有三种组合：

2,3

2,4

3,4

三个密码有一种：

2,3,4

示例2
输入：
2,0
1
输出：
0
0,2
2
说明：
可能的密码组合，一个的有两种 ：

0

2

两个的有一个：

0,2

解题思路：
1、因为密码是升序的，所以首先要对输入的数字进行升序排序。

2、根据题意是从可选的密码数字列表中选出对应数量的数字作为密码。

      也就是从M个字符中取出N个字符的全排列（经典算法）

3、因为最小数字数量是N，所以需要一直遍历到可选密码数字列表的长度，才能得到

      所有可能的密码

代码： 
let strings = readLine().split(",");
//let strings = "2,0".split(",");

strings.sort();   //先对输入数字进行升序，因为密码是升序的
let n = Number(readLine());
//let n = Number("1");

let len = strings.length;
var list = [];

for(let i=n;i<=len;i++){    //对数组从最小长度到最大长度求全组合排列
    combine(strings,i,new String(),0);
}

list.sort();

if(list.length==0){
    console.log("None");
}else {
    list.forEach(v=>{
        let str = "";
        for(let i=0;i<v.length;i++){
            str+=v.charAt(i);
            if(i!=v.length-1){
                str+=",";
            }
        }
        console.log(str);
    });
}

/**
 *  经典的 M 中取 N 个字符排列的递归算法，大家如果理解不了可以记一下
 * @param str    数字池（从中取数字）
 * @param n      数字个数（每添加一个数字进行减一，到0时满足，输出）
 * @param res    数字排列
 * @param index  下标（数字池中的索引）
 */
function combine(str, n, res, index){

    if(n==0){
        list.push(res);
    }else {
        for(let i=index;i<str.length;i++){
            res += str[i];
            combine(str,n-1,res,i+1);
            res = res.substring(0,res.length-1);  //非常关键的一步
        }
    }
}



## 跳房子II
知识点数组排序

时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
跳房子，也叫跳飞机，是一种世界性的儿童游戏。
游戏参与者需要分多个回合按顺序跳到第1格直到房子的最后一格，然后获得一次选房子的机会，直到所有房子被选完，房子最多的人获胜。
跳房子的过程中，如果有踩线等违规行为会结束当前回合，甚至可能倒退几步。
假设房子的总格数是count，小红每回合可能连续跳的步数都放在数组steps中，请问数组中是否有一种步数的组合，可以让小红三个回合跳到最后一格？如果有，请输出索引和最小的步数组合(数据保证索引和最小的步数组合是唯一的)。
注意：数组中的步数可以重复，但数组中的元素不能重复使用。
输入描述：
第一行输入为房子总格数count，它是int整数类型。

第二行输入为每回合可能连续跳的步数，它是int整数数组类型。

输出描述：
返回索引和最小的满足要求的步数组合（顺序保持steps中原有顺序）

补充说明：
count<=10000，3<=steps.length<=10000，-100000<=steps[i]<=100000

示例1
输入：
[1,4,5,2,0,2]
9
输出：
[4,5,0]
示例2
输入：
[1,5,2,0,2,4]
9
输出：
[5,2,2]
示例3
输入：
[-1,2,4,9]
12
输出：
[-1,4,9]
解题思路：
通过穷举将所有可能的情况列举出来，然后再筛选出符合要求的最小索引和。

代码： 
// var ints = readline().replace("[","")
//                      .replace("]","")
//                      .split(",").map(Number);
// var count = Number(readline());

var ints = "[-1,2,4,9]".replace("[","")
                     .replace("]","")
                     .split(",").map(Number);
//房子总数
var count = Number("12");
//最小索引和
var min = Number.MAX_VALUE;
//最终结果
var resList;

combine(ints, 3, [], [], 0 );

console.log(resList);

/**
 * M 中取 N 个数字
 * @param ints          steps数组
 * @param n             步数
 * @param list          小红跳的步数集合
 * @param indexList     小红跳的步数的索引集合
 * @param index         当前步数索引
 */
function combine( ints, n, list, indexList, index){

    if(n == 0){
        let total = 0;
        let indexTotal = 0;
        for(let i=0; i<3; i++){
            total += list[i];
            indexTotal += indexList[i];
        }
        if(total == count && indexTotal < min){
            //走完所有房子且索引和比之前的小
            min = indexTotal;
            resList = [...list];
        }
    }else {
        for(let i=index; i<ints.length; i++){

            list.push(ints[i]);
            indexList.push(i);

            combine(ints, n-1, list, indexList, i + 1);

            list.splice(list.length - 1);
            indexList.splice(indexList.length - 1);
        }
    }
    
}




## 完全二叉树非叶子部分后序遍历
知识点数组树递归

时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
给定一个以顺序储存结构存储整数值的完全二叉树序列（最多1000个整数），请找出此完全二叉树的所有非叶子节点部分，然后采用后序遍历方式将此部分树（不包含叶子）输出。
1、只有一个节点的树，此节点认定为根节点（非叶子）。
2、此完全二叉树并非满二叉树，可能存在倒数第二层出现叶子或者无右叶子的情况


其他说明：二叉树的后序遍历是基于根来说的，遍历顺序为：左-右-根
输入描述：
一个通过空格分割的整数序列字符串

输出描述：
非叶子部分树结构的后序遍历结果

补充说明：
输出数字以空格分隔

示例1
输入：
1 2 3 4 5 6 7
输出：
2 3 1
说明：
找到非叶子部分树结构，然后采用后续遍历输出

解题思路：
这题还是比较有难度的，大家先消化消化。

代码： 
//let ints = readline().split(" ").map(Number);
let ints = "1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19".split(" ").map(Number);

var list = [];
handle( ints, 0);

let res = "";
for(let i of list){
    res += ints[i] + " ";
}

console.log(res.substring(0, res.length - 1));

/**
 *
 * @param ints      完全二叉树数组
 * @param index     数组索引
 * @return
 */
function handle( ints, index){
    //是否有叶子
    let hasLeaf = false;

    if(index < ints.length){

        hasLeaf = true;
        //左叶子
        if(handle( ints, (index + 1)*2 - 1)){
            //当前节点包含叶子节点则加入list
            list.push(index);
            if(index == 0){
                //index=0，说明到顶了，之后不需要了
                return false;
            }
            //隔壁节点 index 只需要 +1
            if(handle( ints, ((index + 1) + 1)*2 - 1)){
                //当前节点的隔壁节点满足，则直接加入list（先左后右）
                list.push(index + 1);
            }
        }
    }

    return hasLeaf;
}



## 乘坐保密电梯
时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
有一座保密大楼，你从0楼到达指定楼层m，必须这样的规则乘坐电梯：
给定一个数字序列，每次根据序列中的数字n上升n层或者下降n层，前后两次操作的方向必须相反，规定首次的方向向上，自行组织序列的顺序按规定操作到达指定楼层。
求解到达楼层的序列组合，如果不能到达楼层，给出小于该楼层的最近序列组合。
说明：
操作电梯时不限定楼层范围。
必须对序列中的每个项进行操作，不能只使用一部分。
输入描述：
第一行：期望的楼层，取值范围[1,50]；序列总个数，取值范围[1,23]
第二行：序列，每个值取值范围[1,50]

输出描述：
能够达到楼层或者小于该楼层最近的序列

补充说明：
操作电梯时不限定楼层范围。

必须对序列中的每个项进行操作，不能只使用一部分。

示例1
输入：
5 3
1 2 6
输出：
6 2 1
说明：
1 2 6,6 2 1均为可行解，按先处理大值的原则结果为6 2 1

解题思路：
这道题没有想到很好的办法，所以就用了回溯，不知道会不会超时。

1、先假设全部上升，求出总楼层 sum

2、因为上升和下降是交替进行的，而第一次必须是上升，所以进行下降的次数应该为

长度/2

3、从序列中随机取出步骤1长度的数组进行下降，求出下降集合的楼层总和

4、到达的楼层 = sum - 2*下降总楼层

5、最后求出上升集合（序列集合剔除下降集合），然后和下降集合进行交替输出（同时需要进行降序）

代码： 
//let input1 = readline().split(" ").map(Number);
let input1 = "5 3".split(" ").map(Number);
//指定楼层
var floorNum = input1[0];
let len = input1[1];

//let allList = readline().split(" ").map(Number);
let allList = "6 2 1".split(" ").map(Number);

//所有楼层序列的总和
var sum = 0;
for(let i=0; i<len; i++){
    sum += allList[i];
}

//与指定楼层的最小距离
var min = Number.MAX_VALUE;
//已经到达楼层
var isOver = false;
//最终楼层的下降组合（只记录下降楼层）
var downList = [];
combine( allList, Math.floor(len/2), [], 0);

for(let i=0; i<downList.length; i++){
    let num = downList[i];
    let index = allList.indexOf(num);
    if(index != -1){
        //从所有层数集合剔除下降层数（那就只剩下上升层数）
        allList.splice( index, 1);
    }
}
//大的层数在前
allList.sort((a,b) => {return b-a});
downList.sort((a,b) => {return b-a});

let res = "";
//上升和下降交替存在
for(let i=0; i<allList.length; i++){

    res += allList[i];
    if(i < downList.length){
        res += " " + downList[i] + " ";
    }
}

console.log(res);

/**
 * 求出所有下降层数的组合
 * @param allList   所有层数组合
 * @param n         下降的次数
 * @param list      下降层数的集合  
 * @param index     层数索引
 */
function combine( allList, n, list, index){

    if(isOver){
        return;
    }

    if(n == 0){
        //到达的楼层
        let arriveFloor = sum - 2 * floor(list);
        //到达楼层与指定楼层的距离
        let distance = Math.abs( arriveFloor - floorNum);
        if(distance == 0){
            //到达了指定楼层
            downList = [...list];
            isOver = true;
        }else if(min > distance){
            //接近了指定楼层
            min = distance;
            downList = [...list];
        }
    }else {
        for(let i=index; i<allList.length; i++){
            list.push(allList[i]);
            combine( allList, n-1, list, i+1);
            list.pop();
        }
    }

}

/**
 * 计算下降的总层数
 * @param list      下降的层数集合
 * @return
 */
function floor( list){

    let res = 0;
    for(let i=0; i<list.length; i++){
        res += list[i];
    }

    return res;
}




## ai面板识别
知识点排序数组

时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
AI识别到面板上有N（1<= N <= 100）个指示灯，灯大小一样，任意两个灯之间无重叠。 由于AI识别误差, 每次识别到的指示灯位置可能有差异，以4个坐标值描述AI识别的指示灯的大小和位置(左上角x1,y1, 右下角x2,y2)，
请输出先行后列排序的指示灯的编号，排序规则：
1、每次在尚未排序的灯中挑选最高的灯作为的基准灯，
2、找出和基准灯属于同一行所有的灯进行排序。两个灯高低偏差不超过灯半径算同一行（即两个灯y坐标的差 <= 灯高度的一半）。
输入描述：
第一行为N，表示灯的个数
接下来N行，每行为1个灯的坐标信息，格式为：编号 x1 y1 x2 y2，编号全局唯一，1<= 编号 <= 100，0 <= x1 < x2 <= 1000，0 <= y1 < y2 <= 1000

输出描述：
排序后的编号列表，编号之间以空格分隔

补充说明：

示例1
输入：
5
1 0 0 2 2
2 6 1 8 3
3 3 2 5 4
5 5 4 7 6
4 0 4 2 6
输出：
1 2 3 4 5
说明：


代码： 
//let N = Number(readline());
let N = Number("5");

let list = [];
class Panel{
    constructor( id, x1, y1, x2, y2){

        this.id = id;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;

    }

    compareTo(o) {
        if(this.y1 == o.y1){
            return this.x1 - o.x1;
        }
        return this.y1 - o.y1;
    }
}

let test = ["1 0 0 2 2",
    "2 6 1 8 3",
    "3 3 2 5 4",
    "5 5 4 7 6",
    "4 0 4 2 6"];
for(let i=0; i<N; i++){
    //let ints = readline().split(" ").map(Number);
    let ints = test[i].split(" ").map(Number);
    let panel = new Panel(ints[0], ints[1], ints[2], ints[3], ints[4]);
    list.push(panel);
}

list.sort((a,b) => { return a.compareTo(b) });
//基准灯
let jizhun = list[0];
//灯的高度
let height = jizhun.y2 - jizhun.y1;
//灯的索引
let index = 1;
while (index < list.length){

    let temp = list[index];
    if(temp.y1 - jizhun.y1 <= Math.floor(height/2)){
        temp.y1 = jizhun.y1;
        temp.y2 = jizhun.y2;
    }else {
        jizhun = temp;
    }

    index ++;
}

list.sort((a,b) => { a.compareTo(b) });

let res = "";
for(let p of list){
    res += p.id + " ";
}

console.log(res.substring(0, res.length - 1));




## 支持优先级的队列
知识点队列

时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
实现一个支持优先级的队列，高优先级先出队列；同优先级时先进先出。
如果两个输入数据和优先级都相同，则后一个数据不入队列被丢弃。
队列存储的数据内容是一个整数。
输入描述：
一组待存入队列的数据（包含内容和优先级）

输出描述：
队列的数据内容（优先级信息输出时不再体现）

补充说明：
不用考虑输入数据不合法的情况，测试数据不超过100个

示例1
输入：
(10,1),(20,1),(30,2),(40,3)
输出：
40,30,10,20
说明：
输入样例中，向队列写入了4个数据，每个数据由数据内容和优先级组成。

输入和输出内容都不含空格。

数据40的优先级最高，所以最先输出，其次是30；10和20优先级相同，所以按输入顺序输出。

示例2
输入：
(10,1),(10,1),(30,2),(40,3)
输出：
40,30,10
说明：
输入样例中，向队列写入了4个数据，每个数据由数据内容和优先级组成。

输入和输出内容都不含空格。

数据40的优先级最高，所以最先输出，其次是30；两个10和10构成重复数据，被丢弃一个。

代码：
class Task{

    constructor( data, id){
        this.data = data;
        this.id = id;
    }

    equals(task) {
        if(task == null) return false;
        return this.data == task.data 
                && this.id == task.id;
    }
}

let ints = "(10,1),(10,1),(30,2),(40,3)".replace(/\(/g, "")
                        .replace(/\)/g, "")
                        .split(",").map(Number);

//优先级队列
let queue = [];
for(let i=0; i<ints.length; i+=2){
    let task = new Task( ints[i], ints[i+1]);
    queue.push(task);
}

queue.sort((a,b) => {
    return b.id - a.id;
})

let resList = [];
//等待记录的task
let waitTask = queue.shift();
while (waitTask != null){

    let topTask = queue[0];
    if(!waitTask.equals(topTask)){
        //两个task不相等则记录
        resList.push(waitTask.data);
    }

    waitTask = queue.shift();
}

console.log(resList);




## 矩阵最大值
知识点矩阵数组

时间限制：1s 空间限制：32MB 限定语言：不限

题目描述：
给定一个仅包含0和1的N*N二维矩阵，请计算二维矩阵的最大值，计算规则如下：
1、 每行元素按下标顺序组成一个二进制数（下标越大越排在低位），二进制数的值就是该行的值。矩阵各行值之和为矩阵的值。
2、允许通过向左或向右整体循环移动每行元素来改变各元素在行中的位置。
      比如： [1,0,1,1,1]向右整体循环移动2位变为[1,1,1,0,1]，二进制数为11101，值为29。
                  [1,0,1,1,1]向左整体循环移动2位变为[1,1,1,1,0]，二进制数为11110，值为30。
输入描述:
1、输入的第一行为正整数，记录了N的大小，0 < N <= 20。
2、输入的第2到N+1行为二维矩阵信息，行内元素边角逗号分隔。

输出描述:
矩阵的最大值。

示例1
输入：
5
1,0,0,0,1
0,0,0,1,1
0,1,0,1,0
1,0,0,1,1
1,0,1,0,1
输出：
122
说明：
第一行向右整体循环移动1位，得到本行的最大值[1,1,0,0,0]，二进制值为11000，十进制值为24。

第二行向右整体循环移动2位，得到本行的最大值[1,1,0,0,0]，二进制值为11000，十进制值为24。

第三行向左整体循环移动1位，得到本行的最大值[1,0,1,0,0]，二进制值为10100，十进制值为20。

第四行向右整体循环移动2位，得到本行的最大值[1,1,1,0,0]，二进制值为11100，十进制值为28。

第五行向右整体循环移动1位，得到本行的最大值[1,1,0,1,0]，二进制值为11010，十进制值为26。

因此，矩阵的最大值为122。

 解题思路
1、通过substring对输入字符串前后段进行分割拼接。

2、通过parseInt对字符串进行二进制转十进制

满分答案：
let n = Number(readLine());
//let n = Number("5");
let res = 0;

// let test = ["1,0,0,0,1",
//             "0,0,0,1,1",
//             "0,1,0,1,0",
//             "1,0,0,1,1",
//             "1,0,1,0,1"]

for(let i=0;i<n;i++){
    let s = readLine().replaceAll(",","");   //直接将输入值转换为字符串
    //let s = test[i].replaceAll(",","");
    let max = 0;
    for(let j=0;j<n;j++){
        let newS = s.substring(j) + s.substring(0,j); //字符串分段拼接相当于右移
        max = Math.max(max,parseInt(newS,2));
    }
    res+=max;
}
console.log(res);




## 矩阵稀疏扫描
时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
如果矩阵中的许多系数都为零，那么该矩阵就是稀疏的。对稀疏现象有兴趣是因为它的开发可以带来巨大的计算节省，并且在许多大的实践中都会出现矩阵稀疏的问题。
给定一个矩阵，现在需要逐行和逐列地扫描矩阵，如果某一行或者某一列内，存在连续出现的0的个数超过了行宽或者列宽的一半【W/2】（地板除），则认为该行或者该列是稀疏的。
扫描给定的矩阵，输出稀疏的行数和列数。
输入描述：
第一行输入为M和N，表示矩阵的大小 M * N，0<M<=100，0<N<=100。

接下来M行输入为矩阵的成员，每行N个成员，矩阵成员都是有符号整数，范围-32,768到32,767。

输出描述：
输出两行，第一行表示稀疏行的个数，第二行表示稀疏列的个数。

示例1
输入：
3 3
1 0 0
0 1 0
0 0 1
输出：
3
3
说明：
给定的 3 x 3 矩阵里，每一行和每一列内都存在2个0，行宽3，列宽3，【3/2】 = 1，因此稀疏行有3个，稀疏列有3个。

示例2
输入：
5 3
-1 0 1
0 0 0
-1 0 0
0 -1 0
0 0 0
10
输出：
5
3
说明：
给定的 5 x 3 矩阵，每行里面0的个数大于等于1表示稀疏行，每列里面0的个数大于等于2表示稀疏行，所以有5个稀疏行，3个稀疏列。

解题思路：
1、将每一行拿出来判断其中连续出现的0的个数是否大于等于其列数的一半

2、将每一列拿出来判断其中连续出现的0的个数是否大于等于其行数的一半

代码：
//let input1 = readline().split(" ").map(Number);
let input1 = "5 3".split(" ").map(Number);
const row = input1[0];
const col = input1[1];

//正矩阵（行是行，列是列）
let rowMatrix = Array(row).fill().map(()=>Array(col).fill(0));
//倒矩阵（第一行是正矩阵第一列，第一列是正矩阵第一行）
let colMatrix = Array(col).fill().map(()=>Array(row).fill(0));

//稀疏行的个数
let rowTotal = 0;
let test = ["-1 0 1","0 0 0","-1 0 0","0 -1 0","0 0 0"];
for(let i=0; i<row; i++){
    //let input2 = readline().split(" ").map(Number);
    let input2 = test[i].split(" ").map(Number);
    rowMatrix[i] = input2;
    for(let j=0; j<col; j++){
        colMatrix[j][i] = input2[j];
    }
    if(isXishu(rowMatrix[i], Math.floor(col/2))){
        //满足稀疏行
        rowTotal ++;
    }
}

console.log(rowTotal);

//稀疏列的个数
let colTotal = 0;
for(let i=0; i<col; i++){
    if(isXishu(colMatrix[i], Math.floor(row/2))){
        //满足稀疏列
        colTotal ++;
    }
}
console.log(colTotal);

function isXishu( ints, num){
    //连续出现的0的个数
    let count = 0;
    for(let i=0; i<ints.length; i++){
        if(ints[i] == 0){
            count ++;
        }else {
            if(count >= num){
                //根据题意应该是大于，但是根据示例2又可以等于
                return true;
            }
            count = 0;
        }
    }

    return count >= num;
}




## 最长连续子序列
知识点数组滑窗

时间限制：2s 空间限制：100MB 限定语言：不限

题目描述：
有N个正整数组成的一个序列。给定整数sum，求长度最长的连续子序列，使他们的和等于sum，返回此子序列的长度，如果没有满足要求的序列，返回-1。
输入描述：
序列：1,2,3,4,2

sum：6

输出描述：
序列长度：3

补充说明：
输入序列仅由数字和英文逗号构成，数字之间采用英文逗号分隔；

序列长度：1 <= N <= 200；

输入序列不考虑异常情况，由题目保证输入序列满足要求。

示例1
输入：
1,2,3,4,2
6
输出：
3
说明：
解释：1,2,3和4,2两个序列均能满足要求，所以最长的连续序列为1,2,3，因此结果为3

示例2
输入：
1,2,3,4,2
20
输出：
-1
说明：
解释：没有满足要求的子序列，返回-1

解题思路：
只要是求连续子序列的基本都是用滑窗去解决。

代码： 
// let ints = readline().split(",").map(Number);
// let sum = Number(readline());
let ints = "1,2,3,4,2".split(",").map(Number);
let sum = Number("6");

let left = 0, right = 0, count = ints[0], max = -1;
while (left < ints.length){

    if(count >= sum){
        if(count == sum){
            max = Math.max( max, right - left + 1);
        }
        count -= ints[left];
        left ++;
    }else if(count < sum){
        right ++;
        if(right == ints.length){
            break;
        }
        count += ints[right];
    }
}

console.log(max);




## 喊7的次数重排
时间限制：1秒 | 内存限制：262144K | 语言限制：不限

题目描述：
喊7是一个传统的聚会游戏，N个人围成一圈，按顺时针从1到N编号。编号为1的人从1开始喊数，下一个人喊的数字为上一个人的数字加1，但是当将要喊出来的数字是7的倍数或者数字本身含有7的话，不能把这个数字直接喊出来，而是要喊"过"。假定玩这个游戏的N个人都没有失误地在正确的时机喊了"过"，当喊到数字K时，可以统计每个人喊"过"的次数。
现给定一个长度为N的数组，存储了打乱顺序的每个人喊"过"的次数，请把它还原成正确的顺序，即数组的第i个元素存储编号i的人喊"过"的次数。
输入描述:
输入为一行，为空格分隔的喊"过"的次数，注意K并不提供，K不超过200，而数字的个数即为N。

输出描述:
输出为一行，为顺序正确的喊"过"的次数，也由空格分隔。

示例1
输入
0 1 0

输出
1 0 0

说明
一共只有一次喊"过"，那只会发生在需要喊7时，按顺序，编号为1的人会遇到7，故输出1 0 0。注意，结束时的K不一定是7，也可以是8、9等，喊过的次数都是1 0 0。

示例2
输入
0 0 0 2 1

输出
0 2 0 1 0

说明
一共有三次喊"过"，发生在7 14 17，按顺序，编号为2的人会遇到7 17，编号为4的人会遇到14，故输出0 2 0 1 0。

解题思路：
根据输入的数字相加可以得到喊“过”的次数和总人数
根据模拟发现 （报数/总人数）的余数 -1 就等于报数人的下标（下标从0开始所以需要-1）   总人数为5：喊1的下标为0；喊2 的下标为1。。。喊6的下标为0（6%5-1）
根据2的规律就可以筛选出符合条件的下标，然后再做叠加的动作
代码（JS）： 
let s = sc.radLine().split(" ").map(i=>parseInt(i));;
//let s = "0 0 0 2 1".split(" ").map(i=>parseInt(i));
let len = s.length;

let ints = new Array(len).fill(0);

let num = 0;
for(let i=0;i<len;i++){
    num += s[i];     //计算出符合的次数
}
let step = 7;   //直接从7开始
while (num>0){
    if(step%7==0 || String(step).indexOf("7")!=-1){
        ints[(step-1)%len]++;      //同过数组长度算出符合的下标
        num--;      //符合的次数递减
    }
    step++;     //报数的次数递增
}

let res = "";
for(let i=0;i<len;i++){
    res+=String(ints[i]);
    if(i == len-1){
        break;
    }
    res+=" ";
}

console.log(res);



## 分班
时间限制：1秒 | 内存限制：262144K | 语言限制：不限

题目描述：
幼儿园两个班的小朋友在排队时混在了一起，每位小朋友都知道自己是否与前面一位小朋友是否同班，请你帮忙把同班的小朋友找出来。
小朋友的编号为整数，与前一位小朋友同班用Y表示，不同班用N表示。
输入描述:
输入为空格分开的小朋友编号和是否同班标志。

比如：6/N 2/Y 3/N 4/Y，表示共4位小朋友，2和6同班，3和2不同班，4和3同班。

其中，小朋友总数不超过999，每个小朋友编号大于0，小于等于999。

不考虑输入格式错误问题。

输出描述:
输出为两行，每一行记录一个班小朋友的编号，编号用空格分开。且：

1、编号需要按照大小升序排列，分班记录中第一个编号小的排在第一行。

2、若只有一个班的小朋友，第二行为空行。

3、若输入不符合要求，则直接输出字符串ERROR。

示例1
输入
1/N 2/Y 3/N 4/Y

输出
1 2

3 4

说明
2的同班标记为Y，因此和1同班。

3的同班标记为N，因此和1、2不同班。

4的同班标记为Y，因此和3同班。

所以1、2同班，3、4同班，输出为

1 2

3 4

解题思路：
需要一个boolean值来转换班级

True：一班

N：表示在二班

Y：表示在一班

False：二班

N：表示在一班

Y：表示在二班

代码（JS）： 
//let strings = readline().split(" ");
let strings = "6/N 8/Y 6/N 10/Y".split(" ");

let list1 = [];  //一班
let list2 = [];  //二班

let b = true;   //用来转换班级 true为一班 false为二班
let isError = false;
let isDigit = new RegExp("^[0-9]*$")

for(let i=0; i<strings.length; i++){
    let x = strings[i].split("/");
    if(!isDigit.test(x[0])){
        isError = true;
        break;
    }
    let stu = Number(x[0]);
    if((x[1] != "N" && x[1] != ("Y"))
        || list1.includes(stu)
        || list2.includes(stu))
    {
        isError = true;
        break;
    }
    if(list1.length == 0){    //第一位直接安排一班
        list1.push(stu);
        continue;
    }
    if(b){  //此时是一班
        if(x[1] == "N"){
            list2.push(stu) ;   //非一班
            b = false;
        }else {
            list1.push(stu);
        }
    } else {    //此时是二班
        if(x[1] == "N"){
            list1.push(stu);   //非二班
            b = true;
        }else {
            list2.push(stu);
        }
    }

}

if(isError){
    console.log("ERROR");
}else {
    list1.sort((a,b) =>{return a-b});
    list2.sort((a,b) =>{return a-b});
    let res1 = "";
    let res2 = "";
    for(let i=0; i<list1.length; i++){
        res1 += list1[i] + " ";
    }
    for(let i=0; i<list2.length; i++){
        res2 += list2[i] + " ";
    }
    if(list2.length == 0){
        console.log(res1.substring(0, res1.length-1));
    }else if(list1[0] < list2[0]){
        console.log(res1.substring(0, res1.length-1));
        console.log(res2.substring(0, res2.length-1));
    }else {
        console.log(res2.substring(0, res2.length-1));
        console.log(res1.substring(0, res1.length-1));
    }
}




## 斗地主之顺子
时间限制：1秒 | 内存限制：32768K | 语言限制：不限

题目描述：
在斗地主扑克牌游戏中， 扑克牌由小到大的顺序为：3,4,5,6,7,8,9,10,J,Q,K,A,2，玩家可以出的扑克牌阵型有：单张、对子、顺子、飞机、炸弹等。
其中顺子的出牌规则为：由至少5张由小到大连续递增的扑克牌组成，且不能包含2。
例如：{3,4,5,6,7}、{3,4,5,6,7,8,9,10,J,Q,K,A}都是有效的顺子；而{J,Q,K,A,2}、 {2,3,4,5,6}、{3,4,5,6}、{3,4,5,6,8}等都不是顺子。
给定一个包含13张牌的数组，如果有满足出牌规则的顺子，请输出顺子。
如果存在多个顺子，请每行输出一个顺子，且需要按顺子的第一张牌的大小（必须从小到大）依次输出。
如果没有满足出牌规则的顺子，请输出No。
输入描述:
13张任意顺序的扑克牌，每张扑克牌数字用空格隔开，每张扑克牌的数字都是合法的，并且不包括大小王：

2 9 J 2 3 4 K A 7 9 A 5 6

不需要考虑输入为异常字符的情况

输出描述:
组成的顺子，每张扑克牌数字用空格隔开：

3 4 5 6 7

示例1
输入
2 9 J 2 3 4 K A 7 9 A 5 6

输出
3 4 5 6 7

说明
13张牌中，可以组成的顺子只有1组：3 4 5 6 7

示例2
输入
2 9 J 10 3 4 K A 7 Q A 5 6

输出
3 4 5 6 7

9 10 J Q K A

说明
13张牌中，可以组成2组顺子，从小到大分别为：3 4 5 6 7 和 9 10 J Q K A

示例3
输入
2 9 9 9 3 4 K A 10 Q A 5 6

输出
No

说明
13张牌中，无法组成顺子

解题思路：
将输入转换成集合，将2剔除（不参与排序），J、Q、K转换成数字11，12，13
对处理过的集合进行排序，方便找顺子
 从第一个数字开始遍历，判断相邻数字是否严格递增（相差1）：若数字相同则跳过；若严格递增，则添加到集合中；若不相同也不严格递增，则判断集合的长度是否大于等于5：若大于等于5则符合顺子，添加到顺子集合中。
若集合长度小于5则判断是否整个集合都遍历完全：若遍历完全，则直接退出整个循环；若没有遍历完全，则剃除步骤3处理过的数字；再重复步骤3。
将得到的数据还原，11、12、13还原成J、Q、K
代码（JS）： 
let s = readLine().split(" ");
//let s = "2 9 J 10 3 4 K A 7 Q A 5 6".split(" ");
let len = s.length;
let list = [];

for(let i=0;i<len;i++){ //剔除2，转化A,J,Q,K
    switch (s[i]){
        case "J":
            list.push(11);
            break;
        case "Q":
            list.push(12);
            break;
        case "K":
            list.push(13);
            break;
        case "A":
            list.push(14);
            break;
        case "2":
            break;
        default:
            list.push(Number(s[i]));
    }
}

list.sort((a,b)=>{
    return a-b;
}); //从小到大排序方便取值2 9 J 10 2 3 4 K A 7 Q A 5 6

let ress = [];

let isA = false; //是否遍历完整个数组

while (!isA){
    let res = [];
    res.push(list[0]);   //放入第一个数字
    let count = 1;
    for(let i=1;i<list.length;i++){
        let x = list[i];    //  本次数字
        if(x==list[i-1]+1){ //符合严格递增
            count++;
            res.push(x);
        }else if(x==list[i-1] && i!=list.length-1){
            continue;   //本次数字等于前面一个数字且不是数组最后一位,则进入下次循环
        }
        if(x!=list[i-1]+1 || i==list.length-1){
            if(count>=5){   //符合顺子
                ress.push(res);
            }else if(i==list.length-1){   //整个数组遍历完全，直接退出
                isA = true;
                break;
            }
            for(let j=0;j<res.length;j++){
                for(let k=0;k<list.length;k++){
                    if(res[j] == list[k]){
                        list.splice(list.indexOf(list[k]),1); //剔除已经处理过的数字
                        break;
                    }
                }
            }
            if(list.length<5){  //集合剩余数字不满足成为顺子
                isA = true;
            }
            break;  //顺子已经提取，跳出本次循环
        }
    }
}

if(ress.length==0){
    console.log("No");
}else {
    for(let i=0;i<ress.length;i++){
        let stringRes = "";
        for(let j=0;j<ress[i].length;j++){
            switch (ress[i][j]){    //将A\J\Q\K还原
                case 11:
                    stringRes+="J";
                    break;
                case 12:
                    stringRes+="Q";
                    break;
                case 13:
                    stringRes+="K";
                    break;
                case 14:
                    stringRes+="A";
                    break;
                default:
                    stringRes+=ress[i][j];
            }
            if(j<ress[i].length-1){
                stringRes+=" ";
            }
        }
        console.log(stringRes);
    }
}





## 补种未成活胡杨
时间限制：1秒 | 内存限制：262144K | 语言限制：不限

题目描述：
近些年来，我国防沙治沙取得显著成果。某沙漠新种植N棵胡杨（编号1-N），排成一排。一个月后，有M棵胡杨未能成活。
现可补种胡杨K棵，请问如何补种（只能补种，不能新种），可以得到最多的连续胡杨树？
输入描述:
N 总种植数量

M 未成活胡杨数量

M 个空格分隔的数，按编号从小到大排列
K 最多可以补种的数量

其中：
1<=N<=100000

1<=M<=N

0<=K<=M

输出描述:
最多的连续胡杨棵树

示例1
输入
5

2

2 4

1

输出
3

说明
补种到2或4结果一样，最多的连续胡杨棵树都是3

示例2
输入
10

3

2 4 7

1

输出
6

说明
补种第7棵树，最多的连续胡杨棵树为6(5,6,7,8,9,10)

解题思路：
例：10棵胡杨 4棵死亡 2，3，6，8  可以补种2棵

则应该是2，3 / 3，6 / 6，8这样补种才会最多

2，3 ： 连续胡杨  6（未成活） -1 = 5

3，6 ： 连续胡杨 8（未成活）-2（未成活）-1 = 5

6，8 ： 连续胡杨10（总数目）-3（未成活）= 7

由此可以对未成活的胡杨进行遍历补种。

代码（JS）： 
let n = Number(readLine());   //总共棵树
let m = Number(readLine());   //未成活的棵树
let dead = readLine().split(" ").map(i=>parseInt(i));   //未成活的数
let k = Number(readLine()); //补种的棵树
// let n = Number("10");   //总共棵树
// let m = Number("3");   //未成活的棵树
// let dead = "2 4 7".split(" ").map(i=>parseInt(i));   //未成活的数
// let k = Number("1"); //补种的棵树

let max = 0;

for(let i=k-1;i<m;i++){ //i为补种的最后一棵胡杨下标
    if(i==k-1){
        max = Math.max(max,dead[k]-1);  //种最前面的k棵树
    }else if(i==m-1){
        max = Math.max(max,n-dead[i-k]);  //种最后面的k棵树
    }else {
        max = Math.max(max,dead[i+1]-dead[i-k]-1);  //种中间的k棵树
    }
}

console.log(max);




## IPv4地址转换成整数
时间限制：1秒 | 内存限制：262144K | 语言限制：不限

题目描述：
存在一种虚拟IPv4地址，由4小节组成，每节的范围为0~255，以#号间隔，虚拟IPv4地址可以转换为一个32位的整数，例如：
128#0#255#255，转换为32位整数的结果为2147549183（0x8000FFFF）
1#0#0#0，转换为32位整数的结果为16777216（0x01000000）
现以字符串形式给出一个虚拟IPv4地址，限制第1小节的范围为1~128，即每一节范围分别为(1~128)#(0~255)#(0~255)#(0~255)，要求每个IPv4地址只能对应到唯一的整数上。如果是非法IPv4，返回invalid IP
输入描述:
输入一行，虚拟IPv4地址格式字符串

输出描述:
输出以上，按照要求输出整型或者特定字符

示例1
输入
100#101#1#5

输出
1684340997

示例2
输入
1#2#3

输出
invalid IP

备注:
输入不能确保是合法的IPv4地址，需要对非法IPv4（空串，含有IP地址中不存在的字符，非合法的#分十进制，十进制整数不在合法区间内）进行识别，返回特定错误

代码（JS）： 
let strings = readLine().split("#");
//let strings = "100#101#1#5".split("#");
let len = strings.length;
let count = 0;
let isF = true;

if(len==4){
    for(let i=0;i<len;i++){
        let n = Number(strings[i]);
        if(i==0 && (n<1 || n>128)){ //第一节 1~128
            isF = false;
            break;
        }else if(n<0 || n>255){ //二、三、四节 0~255
            isF = false;
            break;
        }
        /**
         * 首先使用把IP地址分成4个数字： 128 199 231 44
         *
         * 把每个数字转换为2进制，如果转换后这个数字对应的二进制数不够8位，在左侧补0： 10000000 11000111 11100111 00101100
         */
        count += n<<(8*(3-i));
    }
}else {
    isF = false;
}

if(isF){
    console.log(count);
}else {
    console.log("invalid IP");
}




## 最大花费金额
知识点数组

时间限制：1s 空间限制：32MB 限定语言：不限

题目描述：
双十一众多商品进行打折销售，小明想购买自己心仪的一些物品，但由于受购买资金限制，所以他决定从众多心仪商品中购买三件，而且想尽可能的花完资金，现在请你设计一个程序帮助小明计算尽可能花费的最大资金数额。
输入描述：
输入第一行为一维整型数组M，数组长度小于100，数组元素记录单个商品的价格，单个商品价格小于1000。

输入第二行为购买资金的额度R，R小于100000。

输出描述：
输出为满足上述条件的最大花费额度。

注意：如果不存在满足上述条件的商品，请返回-1。

补充说明：
输入格式是正确的，无需考虑格式错误的情况。

示例1
输入：
23,26,36,27

78

输出：
76

说明：
金额23、26和27相加得到76，而且最接近且小于输入金额78

示例2
输入：
23,30,40

26

输出：
-1

说明：
因为输入的商品，无法组合出来满足三件之和小于26.故返回-1

满分答案： 
// let M = readline().split(",").map(Number);
// let R = Number(readline());
let M = "23,26,36,27".split(",").map(Number);
let R = Number("78");

let len = M.length;
M.sort();
let sum = 0;
for(let i=len-1; i>=2; i--){
    if(M[i] > R){
        continue;
    }
    for(let j=i-1; j>=1; j--){
        if(M[i] + M[j] > R){
            continue;
        }
        for(let k=j-1; k>=0; k--){
            let temp = M[i] + M[j] + M[k];
            if(temp <= R && temp > sum){
                sum = temp;
            }
        }
    }
}

console.log(sum == 0 ? -1 : sum);





## 座位调整
知识点迭代

 时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
疫情期间课堂的座位进行了特殊的调整，不能出现两个同学紧挨着，必须隔至少一个空位。
给你一个整数数组  desk表示当前座位的占座情况，由若干 0 和 1 组成，其中 0 表示没有占位，1 表示占位。在不改变原有座位秩序情况下，还能安排坐几个人？
输入描述：
第一行是个子数组表示作为占座情况，由若干 0 和 1 组成，其中 0 表示没有占位，1 表示占位

输出描述：
输出数值表示还能坐几个人

补充说明：
1 <= desk.length <= 2 * 10^4

示例1
输入：
1,0,0,0,1

输出：
1

说明：
只有desk[2]的位置可以坐一个人

解题思路：
我们首先求出两个 1 之间的 0（空位）的个数 count；因为 1 的两侧不能坐人，所有 count 需要  -2，能坐的座位个数就是 （count - 2） / 2，考虑到奇偶数的情况，我们可以直接向上取整。比如 count = 5， 5/2=2.5，向上取整为 3；

注：同时需要考虑到首端和尾端的情况。如果首端或者尾端不为 1，则 count 只需要 -1。

代码： 
//var strings = readline().split(",");
var strings = "1,1,0,0,1".split(",");
const len = strings.length;
var list = [];
//空位0的个数
var count = 0;
//是否是第一个1
var isFirst = true;
//是否有人占座
var isHasOne = false;
for(let i=0; i<len; i++){
    let str = strings[i];
    if(str == "1"){
        if(isFirst && count > 1){
            //如果是第一个1，且前面的0大于1，则除了1的左侧外都可以坐人
            list.push( count - 1);
        }else if(count > 2){
            //因为前面1的右侧和后面1的左侧无法坐人
            list.push(count - 2);
        }
        count = 0;
        isFirst = false;
        isHasOne = true;
    }else {
        count ++;
    }
    if(i == len - 1 && count > 1){
        list.push(isHasOne ? count - 1 : count);
    }
}

var res = 0;
for(let i of list){
    res += Math.ceil(i/2);
}

console.log(res);




## 路灯照明问题
时间限制：1秒 | 内存限制：262144K | 语言限制：不限

题目描述：
在一条笔直的公路上安装了N个路灯，从位置0开始安装，路灯之间间距固定为100米。
每个路灯都有自己的照明半径，请计算第一个路灯和最后一个路灯之间，无法照明的区间的长度和。
输入描述:
第一行为一个数N，表示路灯个数，1<=N<=100000
第二行为N个空格分隔的数，表示路径的照明半径，1<=照明半径<=100000*100

输出描述:
第一个路灯和最后一个路灯之间，无法照明的区间的长度和

示例1
输入
2

50 50

输出
0

说明
路灯1覆盖0-50，路灯2覆盖50-100，路灯1和路灯2之间(0米-100米)无未覆盖的区间

示例2
输入
4

50 70 20 70

输出
20

说明
[170,180],[220,230]，两个未覆盖的区间，总里程为20

解题思路：
使用区间并集的思路。

代码（JS）： 
// let n = Number(readline());
// let str = readline().split(" ").map(Number);
let n = Number("4");
let str = "50 70 20 70".split(" ").map(Number);

class Node{

    constructor( left, right) {
        this.left = left;
        this.right = right;
    }

}

let list = [];

for(let i=0; i<n; i++){
    let x = str[i];
    let l = i*100 - x > 0 ? i*100 - x : 0 ;    //边界处理
    let r = i*100 + x > (n-1)*100 ? (n-1)*100 : i*100 + x;
    let node = new Node(l, r);
    list.push(node);
}

list.sort((a,b) => {
    if(a.left == b.left){
        return a.right - b.right;
    }
    return a.left - b.left;
});
let left = list[0].left;
let right = list[0].right;
let list1 = [];

for(let i=1; i<list.length; i++){
    let node = list[i];
    if(node.left > right){
        let node1 = new Node( left, right);
        list1.push(node1);
        left = node.left;
        right = node.right;
    }else {
        left = Math.min(left, node.left);
        right = Math.max(right, node.right);
    }
}

list1.push(new Node(left, right));
let res = 0;
for(let i=1; i<list1.length; i++){
    res += (list1[i].left-list1[i-1].right);
}

console.log(res);




## 判断一组不等式是否满足约束并输出最大差
知识点数组循环

 时间限制：1s 空间限制：64MB 限定语言：不限

题目描述：
给定一组不等式，判断是否成立并输出不等式的最大差(输出浮点数的整数部分)，要求：1）不等式系数为double类型，是一个二维数组；2）不等式的变量为int类型，是一维数组；3）不等式的目标值为double类型，是一维数组；4）不等式约束为字符串数组，只能是：">",">=","<","<=","="，例如,不等式组：
a11*x1+a12*x2+a13*x3+a14*x4+a15*x5<=b1;
a21*x1+a22*x2+a23*x3+a24*x4+a25*x5<=b2;
a31*x1+a32*x2+a33*x3+a34*x4+a35*x5<=b3;
最大差=max{  (a11*x1+a12*x2+a13*x3+a14*x4+a15*x5-b1),   (a21*x1+a22*x2+a23*x3+a24*x4+a25*x5-b2),   (a31*x1+a32*x2+a33*x3+a34*x4+a35*x5-b3)  }，类型为整数(输出浮点数的整数部分)
输入描述:
1）不等式组系数(double类型)：

a11,a12,a13,a14,a15 

a21,a22,a23,a24,a25 
a31,a32,a33,a34,a35
2）不等式变量(int类型)：
x1,x2,x3,x4,x5
3）不等式目标值(double类型)：b1,b2,b3

4)不等式约束(字符串类型):<=,<=,<=

输入：a11,a12,a13,a14,a15;a21,a22,a23,a24,a25;a31,a32,a33,a34,a35;x1,x2,x3,x4,x5;b1,b2,b3;<=,<=,<=

输出描述:
true 或者 false, 最大差

示例1
输入
2.3,3,5.6,7,6;11,3,8.6,25,1;0.3,9,5.3,66,7.8;1,3,2,7,5;340,670,80.6;<=,<=,<=

输出
false 458

示例2
输入
2.36,3,6,7.1,6;1,30,8.6,2.5,21;0.3,69,5.3,6.6,7.8;1,13,2,17,5;340,67,300.6;<=,>=,<=

输出
false 758

解题思路：（就是逻辑题）
对输入数据用”;”进行分割，分割后的的数组最后三个数组分别为不等式变量、不等式目标值，不等式约束，剩下的都是不等式系数
然后根据题意对系数和变量进行×、+处理
通过目标值和约束进行判断处理，并获取最大值
代码：
let strings = readLine().split(";");
//let strings = "2.36,3,6,7.1,6;1,30,8.6,2.5,21;0.3,69,5.3,6.6,7.8;1,13,2,17,5;340,67,300.6;<=,>=,<=".split(";");

let length = strings.length;
let bianliang = strings[length-3].split(",").map(i=>Number(i)); //不等式变量
let mubiao = strings[length-2].split(",").map(i=>Number(i)); //不等式目标值
let ys = strings[length-1].split(","); //不等式约束

let m = ys.length;  //约束的数量等于数组的数量
let n = bianliang.length;  //变量的数量等于数组中数据的数量

let doubles = [];  //不等式系数是二维数组

for(let i=0;i<m;i++){
    let xs = strings[i].split(","); //不等式系数
    doubles[i] = new Array;
    for(let j=0;j<n;j++){
        doubles[i][j] = Number(xs[j]);  //将不等式系数放入double类型二维数组
    }
}

let isYueshu = true;
let max = 0;

for (let i=0;i<m;i++){  //循环遍历不等式数组
    let d=0;
    let b = true;
    for(let j=0;j<n;j++){
        d+=doubles[i][j]*bianliang[j];   //不等式数组值
    }
    max = Math.max(max,d-mubiao[i]);    //求出最大差
    if(ys[i] == ">"){  //等于不等式进行判断
        b = d>mubiao[i];
    }else if(ys[i] == ">="){
        b = d>=mubiao[i];
    }else if(ys[i] == "<"){
        b = d<mubiao[i];
    }else if(ys[i] == "<="){
        b = d<=mubiao[i];
    }else if(ys[i] == "="){
        b = d==mubiao[i];
    }
    if(!b){ //只要一个等式不成立就为false
        isYueshu = false;
    }
}

console.log(isYueshu+" "+  parseInt(max));




## 乱序整数序列两数之和绝对值最小
知识点排序数组

 时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
给定一个随机的整数（可能存在正整数和负整数）数组 nums ，请你在该数组中找出两个数，其和的绝对值(|nums[x]+nums[y]|)为最小值，并返回这个两个数（按从小到大返回）以及绝对值。
每种输入只会对应一个答案。但是，数组中同一个元素不能使用两遍。
输入描述:
一个通过空格分割的有序整数序列字符串，最多1000个整数，且整数数值范围是 [-65535, 65535]。

输出描述:
两数之和绝对值最小值

示例1
输入
-1 -3 7 5 11 15

输出
-3 5 2

说明
因为 |nums[0] + nums[2]| = |-3 + 5| = 2 最小，所以返回 -3 5 2

解题思路
使用双层循环进行两两计算，请求出最小绝对值

满分答案： 
let strings = readLine().split(" ").map(i=>parseInt(i));
//let nums = "-1 -3 7 5 11 15".split(" ").map(i=>parseInt(i));

let n = nums.length;
let min = Number.MAX_VALUE;
let num1 = 0;
let num2 = 0;

for(let i=0;i<n-1;i++){
    for(let j=i+1;j<n;j++){
        let a = nums[i];
        let b = nums[j];
        let count = Math.abs(a+b);
        min = Math.min(count, min);
        if(min==count){
            num1 = a;
            num2 = b;
        }
    }
}

console.log(num1+" "+num2+" "+min);




## 数组拼接
知识点数组字符串

时间限制：1s 空间限制：32MB 限定语言：不限

题目描述：
现在有多组整数数组，需要将它们合并成一个新的数组。合并规则，从每个数组里按顺序取出固定长度的内容合并到新的数组中，取完的内容会删除掉，如果该行不足固定长度或者已经为空，则直接取出剩余部分的内容放到新的数组中，继续下一行。
输入描述:
第一行是每次读取的固定长度，0<长度<10
第二行是整数数组的数目，0<数目<1000
第3-n行是需要合并的数组，不同的数组用回车换行分隔，数组内部用逗号分隔，最大不超过100个元素。

输出描述:
输出一个新的数组，用逗号分隔。

示例1
输入
3

2

2,5,6,7,9,5,7

1,7,4,3,4

输出
2,5,6,1,7,4,7,9,5,3,4,7

说明
1、获得长度3和数组数目2。

2、先遍历第一行，获得2,5,6；

3、再遍历第二行，获得1,7,4；

4、再循环回到第一行，获得7,9,5；

5、再遍历第二行，获得3,4；

6、再回到第一行，获得7，按顺序拼接成最终结果。

示例2
输入
4

3

1,2,3,4,5,6

1,2,3

1,2,3,4

输出
1,2,3,4,1,2,3,1,2,3,4,5,6

代码：
// let step = Number(readline());
// let m = Number(readline());
let step = Number("3");
let m = Number("2");
let test = ["2,5,6,7,9,5,7","1,7,4,3,4"];
let lists = [];

for(let i=0; i<m; i++){
    //let strings = readline().split(",").map(Number);
    let strings = test[i].split(",").map(Number);
    lists.push(strings);  //将数组放入集合中
}

let res = "";
let n = 0;  //起始下标
let count = 0;  //取完数字的数组
while (count<m){    //当取完的数组数量小于m时进入循环
    for(let i=0; i<m; i++){
        let list = lists[i];
        if(n>list.length){  //当其实下标大于数组长度时退出本次循环
            continue;
        }
        let end = n + step; //结束位置下标
        if(end >= list.length){   //当结束位置下标大于等于数组长度时
            end = list.length;
            count++;    //取完数字数组数量+1
        }
        for(let j=n; j<end; j++){
            res += list[j] + ",";
        }
    }
    n+=step;    //起始位置下标变更（+step）
}

console.log(res.substring(0,res.length-1));




## 根据某条件聚类最少交换次数
知识点滑窗

 时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
给出数字K,请输出所有结果小于K的整数组合到一起的最少交换次数。
组合一起是指满足条件的数字相邻，不要求相邻后在数组中的位置。
数据范围
-100 <= K <= 100
-100 <=  数组中数值<=  100
输入描述：
第一行输入数组：1 3 1 4 0 

第二行输入K数值：2 

输出描述：
第一行输出最少较好次数：1

补充说明：
小于2的表达式是1 1 0, 共三种可能将所有符合要求数字组合一起，最少交换1次

示例1
输入
1 3 1 4 0

2

输出
1

示例2
输入
0 0 0 1 0

2

输出
0

示例3
输入
2 3 2

1

输出
0

备注:
小于2的表达式是1 1 0, 共三种可能将所有符合要求数字组合一起，最少交换1次

解题思路：
1、计算出数组中满足条件的数字个数

2、以步骤1求出的数字长度作为区间长度，遍历数组在这些区间内不满足条件的个数，此值为此区间内的交换次数，其中最小值则为最少交换次数。

注意边界值。

如例一

输入

1 3 1 4 0

2

131中不满足条件的只有一个3，3 1 4 不满足条件的有两个3、4，140中不满足的只有一个4，其中最小值为1，则输出1。

代码： 
let ints = readLine().split(" ").map(Number);
let n = Number(readLine());
// let ints = "1 3 1 4 0".split(" ").map(Number);
// let n = Number("2");

let len = ints.length;
let num = 0;    //满足条件的数字个数

for(let i=0; i<len; i++){
    if (ints[i] < n) {
        num++;
    }
}

let res = Number.MAX_VALUE;
for(let i=0; i<len-num+1; i++){
    let count = 0;
    for(let j=0; j<num; j++){
        if(ints[i+j]>=n){
            count++;
        }
    }
    res = Math.min(res, count);
}

console.log(res);




## 模拟消息队列
知识点排序

时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
让我们来模拟一个消息队列的运作，有一个发布者和若干消费者，发布者会在给定的时刻向消息队列发送消息，若此时消息队列有消费者订阅，这个消息会被发送到订阅的消费者中优先级最高（输入中消费者按优先级升序排列）的一个；若此时没有订阅的消费者，该消息被消息队列丢弃。消费者则会在给定的时刻订阅消息队列或取消订阅。

当消息发送和订阅发生在同一时刻时，先处理订阅操作，即同一时刻订阅的消费者成为消息发送的候选。

当消息发送和取消订阅发生在同一时刻时，先处理取消订阅操作，即消息不会被发送到同一时刻取消订阅的消费者。
输入描述：
输入为两行。

第一行为2N个正整数，代表发布者发送的N个消息的时刻和内容（为方便解析，消息内容也用正整数表示）。第一个数字是第一个消息的发送时刻，第二个数字是第一个消息的内容，以此类推。用例保证发送时刻不会重复，但注意消息并没有按照发送时刻排列。

第二行为2M个正整数，代表M个消费者订阅和取消订阅的时刻。第一个数字是第一个消费者订阅的时刻，第二个数字是第一个消费者取消订阅的时刻，以此类推。用例保证每个消费者的取消订阅时刻大于订阅时刻，消费者按优先级升序排列。

两行的数字都由空格分隔。N不超过100，M不超过10，每行的长度不超过1000字符。

输出描述：
输出为M行，依次为M个消费者收到的消息内容，消息内容按收到的顺序排列，且由空格分隔；若某个消费者没有收到任何消息，则对应的行输出-1。

示例1
输入：
2 22 1 11 4 44 5 55 3 33
1 7 2 3
输出：
11 33 44 55
22
说明：
消息11在1时刻到达，此时只有第一个消费者订阅，消息发送给它；消息22在2时刻到达，此时两个消费者都订阅了，消息发送给优先级最高的第二个消费者；消息33在时刻3到达，此时只有第一个消费者订阅，消息发送给它；余下的消息按规则也是发送给第一个消费者。

示例2
输入：
5 64 11 64 9 97
9 11 4 9
输出：
97
64
说明：
消息64在5时刻到达，此时只有第二个消费者订阅，消息发送给它；消息97在9时刻到达，此时只有第一个消费者订阅（因为第二个消费者刚好在9时刻取消订阅），消息发送给它；11时刻也到达了一个内容为64的消息，不过因为没有消费者订阅，消息被丢弃。

解题思路：
这道题最大的难点在于：首次订阅的消费者可以优先消费消息。

发布者和消费者我们都是用集合来整理。发布者根据发布时间来排序；消费者集合不需要排序，其下标代表其优先级，值越小优先级越高，也可作为消费者id。

代码： 
class Message{
    constructor( time, content){

        this.time = time;
        this.content = content;

    }
}

// let strings = readline().split(" ").map(Number);
let strings = "2 22 1 11 4 44 5 55 3 33".split(" ").map(Number);
let len = strings.length;
//发布者集合
let pubList = [];
for(let i=0; i<len; i+=2){
    //发布时间
    let time = strings[i];
    //消息详情
    let message = new Message( time, strings[i+1]);
    pubList.push(message);
}

pubList.sort((a,b) => {
    return a.time - b.time;
});

// let strings1 = readline().split(" ").map(Number);
let strings1 = "1 7 2 3".split(" ").map(Number);
let len1 = strings1.length;
//消费者集合
let conList = [];
for(let i=0; i<len1; i+=2){
    //订阅时间
    let a = strings1[i];
    //取消订阅时间
    let b = strings1[i+1];
    let ints = [a, b];
    conList.push(ints);
}

let map = new Map();
for (let message of pubList){

    let time = message.time;
    let content = message.content;
    //消费者id
    let index = -1;
    for(let i=0; i<conList.length; i++){
        //消费者订阅和取消订阅时间
        let times = conList[i];
        if(time == times[0] || (time > times[0] && time < times[1])){
            //订阅时间内的最后一个消费者（优先级最高）
            index = i;
        }
    }

    if(index == -1){
        //没有消费者消费信息
        continue;
    }

    if(map.has(index)){
        map.get(index).push(content);
    }else {
        let list = [];
        list.push(content);
        map.set( index, list);
    }

}

for(let i=0; i<len1/2; i++){

    if(!map.has(i)){
        //没有任何消息则输出-1
        console.log(-1);
        continue;
    }

    let res = "";
    for(let str of map.get(i)){
        res += str + " ";
    }
    console.log(res.substring(0, res.length - 1));
}




## 五子棋迷
知识点数组双指针

 时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
    张兵和王武是五子棋迷，工作之余经常切磋棋艺。这不，这会儿又下起来了。走了一会儿，轮张兵了，对着一条线思考起来了，这条线上的棋子分布如下:
    用数组表示:  -1 0 1 1 1 0 1 0 1 -1 
    棋子分布说明: 
        1. -1代表白子，0代表空位，1 代表黑子
        2. 数组长度L, 满足 1 < L < 40, 且L为奇数

    你得帮他写一个程序，算出最有利的出子位置。 最有利定义:
    1. 找到一个空位(0)，用棋子(1/-1)填充该位置，可以使得当前子的最大连续长度变大; 
    2. 如果存在多个位置，返回最靠近中间的较小的那个坐标; 
    3. 如果不存在可行位置，直接返回-1; 
    4. 连续长度不能超过5个(五字棋约束); 
输入描述：
第一行: 当前出子颜色
第二行: 当前的棋局状态

输出描述：
1个整数，表示出子位置的数组下标

示例1
输入：
1
-1 0 1 1 1 0 1 0 1 -1 1
输出：
5
说明：
当前为黑子（1），放置在下标为5的位置，黑子的最大连续长度，可以由3到5

示例2
输入：
-1
-1 0 1 1 1 0 1 0 1 -1 1
输出：
1
说明：
当前为白子，唯一可以放置的位置下标为1， 白子的最大长度，由1变为2

示例3
输入：
1
0 0 0 0 1 0 0 0 0 1 0
输出：
5
说明：
可行的位置很多，5最接近中间的位置坐标

解题思路：
主要思路：找到 0 的位置，由 0 的位置向左向右统计相同棋子的数量，求出其中最大值。

注：1、如果多个位置是最大值，则需要找离中间最近的位置

        2、连续长度不能超过 5

代码：
// let n = Number(readline());
// let L = readline().split(" ").map(Number);
let n = Number("1");
let L = "0 0 0 0 1 0 0 0 0 1 0".split(" ").map(Number);

//最大连续棋子长度
let max = Number.MIN_VALUE;
//到中间位置的距离
let midDistance = 0;
//最终下标
let res = -1;
for(let i=0; i<L.length; i++){

    if(L[i] == 0){
        //左指针
        let left = i-1;
        //右指针
        let right = i+1;
        //左侧相同棋子的个数
        let totalLeft = 0;
        //右侧相同棋子的个数
        let totalRight = 0;
        //左侧棋子统计
        for(let j=left; j>=0; j--){
            if(L[j] == n){
                totalLeft ++;
            }else {
                break;
            }
        }
        //右侧棋子统计
        for(let j=right; j<L.length; j++){
            if(L[j] == n){
                totalRight ++;
            }else {
                break;
            }
        }
        //两侧总共的棋子
        let total = totalLeft + totalRight;
        //题目要求不能赢
        if(total > 4){
            continue;
        }
        //坐标到中间位置距离
        let indexToMid = Math.abs( i - Math.floor(L.length / 2));
        if(total > max){
            //大于之前的最大值
            max = total;
            res = i;
            midDistance = indexToMid;
        }else if (total == max && indexToMid < midDistance){
            //等于之前的最大值且距离中间位置较近
            res = i;
            midDistance = indexToMid;
        }
    }

}

console.log(res);



## 食堂供餐
知识点编程基础循环

时间限制：1s 空间限制：32MB 限定语言：不限

题目描述：
某公司员工食堂以盒饭方式供餐。为将员工取餐排队时间降低为0，食堂的供餐速度必须要足够快。现在需要根据以往员工取餐的统计信息，计算出一个刚好能达成排队时间为0的最低供餐速度。即，食堂在每个单位时间内必须至少做出多少份盒饭才能满足要求。
输入描述：
第1行为一个正整数N，表示食堂开餐时长。1 <= N <= 1000。
第2行为一个正整数M，表示开餐前食堂已经准备好的盒饭份数。P1 <= M <= 1000。
第3行为N个正整数，用空格分隔，依次表示开餐时间内按时间顺序每个单位时间进入食堂取餐的人数Pi。1 <= i <= N，0 <= Pi <= 100。

输出描述：
一个整数，能满足题目要求的最低供餐速度（每个单位时间需要做出多少份盒饭）。

补充说明：
每人只取一份盒饭。

需要满足排队时间为0，必须保证取餐员工到达食堂时，食堂库存盒饭数量不少于本次来取餐的人数。

第一个单位时间来取餐的员工只能取开餐前食堂准备好的盒饭。

每个单位时间里制作的盒饭只能供应给后续单位时间来的取餐的员工。

食堂在每个单位时间里制作的盒饭数量是相同的。

示例1
输入：
3
14
10 4 5
输出：
3
说明：
本样例中，总共有3批员工就餐，每批人数分别为10、4、5。

开餐前食堂库存14份。

食堂每个单位时间至少要做出3份餐饭才能达成排队时间为0的目标。具体情况如下：

第一个单位时间来的10位员工直接从库存取餐。取餐后库存剩余4份盒饭，加上第一个单位时间做出的3份，库存有7份。

第二个单位时间来的4员工从库存的7份中取4份。取餐后库存剩余3份盒饭，加上第二个单位时间做出的3份，库存有6份。

第三个单位时间来的员工从库存的6份中取5份，库存足够。

如果食堂在单位时间只能做出2份餐饭，则情况如下：

第一个单位时间来的10位员工直接从库存取餐。取餐后库存剩余4份盒饭，加上第一个单位时间做出的2份，库存有6份。

第二个单位时间来的4员工从库存的6份中取4份。取餐后库存剩余2份盒饭，加上第二个单位时间做出的2份，库存有4份。

第三个单位时间来的员工需要取5份，但库存只有4份，库存不够。

解题思路：
这道题难度不大，可以使用穷举法，从1开始遍历；也可以使用二分法。

代码： 
// var N = Number(readline());
// let M = Number(readline());
var N = Number("3");
let M = Number("14");
var P = "10 4 5 ".split(" ").map(Number);
//总共需要的盒饭个数
let total = 0;
for(let i=0; i<N; i++){
    total += P[i];
}

//最小出参速度
let min = 0;
//最大出参速度
let max = total - M;
while (min < max){
    //二分法
    let mid = Math.floor((min + max) / 2);
    if(outFood( mid, M)){
        max = mid;
    }else {
        min = mid + 1;
    }
}

console.log(min);

/**
 * 是否能正常出参
 * @param speed     出参速度
 * @param foods    准备的盒饭个数
 * @return
 */
function outFood( speed, foods){

    let res = true;
    for(let i=0; i<N; i++){
        foods -= P[i];
        if(foods < 0){
            res = false;
            break;
        }
        foods += speed;
    }

    return res;
}




## 报文重排序
 时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
对报文进行重传和重排序是常用的可靠性机制，重传缓冲区内有一定数量的子报文，每个子报文在原始报文中的顺序已知，现在需要恢复出原始报文。。
输入描述：
输入第一行为N，表示子报文的个数，0 < N <= 1000。

输入第二行为N个子报文，以空格分开，子报文格式为字符串报文内容+后缀顺序索引，字符串报文内容由[a-z,A-Z]组成，后缀为整形值，表示顺序。顺序值唯一，不重复。

输出描述：
输出恢复出的原始报文。按照每个子报文的顺序的升序排序恢复出原始报文，顺序后缀需要从恢复出的报文中删除掉

示例1
输入：
4
rolling3 stone4 like1 a2
输出：
like a rolling stone
说明：
4个子报文的内容分别为 'rolling', 'stone', 'like', 'a'，顺序值分别为3，4，1，2，按照顺序值升序并删除掉顺序后缀，得到恢复的原始报文：like a rolling stone

示例2
输入：
8
gifts6 and7  Exchanging1 all2 precious5 things8 kinds3 of4
输出：
Exchanging all kinds of precious gifts and things
解题思路：
这道题也是比较简单的。通过遍历找出数字开始的位置，然后通过分割字符串找到其顺序，最后对数字进行排序。

注：这里需要注意的示例2多了个空格，我们也需要考虑到这种情况

代码： 
// let N = Number(readline());
// let strings = readline().split(" ");
let N = Number("8");
let strings = "gifts6 and7  Exchanging1 all2 precious5 things8 kinds3 of4".split(" ");

class Word{
    constructor( letter, num){

        this.letter = letter;
        this.num = num;

    }
}

let letterList = [];
for(let i=0; i<strings.length; i++){
    let str = strings[i];
    //防止空格
    if(str == ""){
        continue;
    }
    //数字开始的下标
    let index = 0;
    let reg = new RegExp("^[0-9]+$");
    for(let j=0; j<str.length; j++){
        if(reg.test(str.charAt(j))){
            index = j;
            break;
        }
    }
    //字母部分
    let letter = str.substring(0, index);
    //顺序部分
    let num = Number(str.substring(index));
    let word = new Word( letter, num);
    letterList.push(word);
}

letterList.sort((a,b) => {
    return a.num - b.num;
});

let res = "";
for(let word of letterList){
    res += word.letter + " ";
}

console.log(res.substring(0, res.length - 1));




## TLV解码
知识点数组字符串

 时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
TLV编码是按[Tag Length Value]格式进行编码的，一段码流中的信元用Tag标识，Tag在码流中唯一不重复，Length表示信元Value的长度，Value表示信元的值。
码流以某信元的Tag开头，Tag固定占一个字节，Length固定占两个字节，字节序为小端序。
现给定TLV格式编码的码流，以及需要解码的信元Tag，请输出该信元的Value。
输入码流的16机制字符中，不包括小写字母，且要求输出的16进制字符串中也不要包含小写字母；码流字符串的最大长度不超过50000个字节。
输入描述：
输入的第一行为一个字符串，表示待解码信元的Tag；
输入的第二行为一个字符串，表示待解码的16进制码流，字节之间用空格分隔。

输出描述：
输出一个字符串，表示待解码信元以16进制表示的Value。

示例1
输入：
31
32 01 00 AE 90 02 00 01 02 30 03 00 AB 32 31 31 02 00 32 33 33 01 00 CC
输出：
32 33
说明：
需要解析的信元的Tag是31，从码流的起始处开始匹配，Tag为32的信元长度为1（01 00，小端序表示为1）；第二个信元的Tag是90，其长度为2；第三个信元的Tag是30，其长度为3；第四个信元的Tag是31，其长度为2（02 00），所以返回长度后面的两个字节即可，即32 33。

解题思路：
这道题可能比较难理解。示例1为例：

32 01 00 AE 90 02 00 01 02 30 03 00 AB 32 31 31 02 00 32 33 33 01 00 CC
32 就是 tag，后面的 2 个字符串 01 00 表示的是十六进制的长度，而题目所说的字节序为小端序，所以需要转化为 00 01，然后再转化为二进制为 1，最终 tag 32 的 value 长度为 1，就是 AE。以此类推，找到 tag 为 31 的value

代码： 
// let tag = readline();
// let code = readline().split(" ");
let tag = "31";
let code = "32 01 00 AE 90 02 00 01 02 30 03 00 AB 32 31 31 02 00 32 33 33 01 00 CC".split(" ");

let index = 0;
//value的末尾位置
let end = code.length - 1;
//value的长度
let len;
//是否为匹配的tag
let isMatch = false;
let res = "";
while (index <= end){

    if(isMatch){
        res += code[index] + " ";
    }else {
        //value的长度，因为长度是2个字节，所以将后面的2个字符串传过去
        len = getLength( code[index + 1], code[index + 2]);
        if(code[index] == tag){
            //找到符合的tag，则进行value输出
            index += 2;
            //表示满足tag
            isMatch = true;
            end = index + len;
        }else {
            //下一个tag的位置
            index += 2 + len;
        }
    }

    index ++;
}

console.log(res.substring(0, res.length - 1));

function getLength( str1, str2){
    //因为是小端序，所以第二个字符串排在前面，第一个字符串排在后面
    let  string = str2 + str1;
    return parseInt( string, 16);

}



## 数据分类
知识点位运算

时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
对一个数据a进行分类，分类方法为：此数据a（四个字节大小）的四个字节相加对一个给定的值b取模，如果得到的结果小于一个给定的值c，则数据a为有效类型，其类型为取模的值；如果得到的结果大于或者等于c，则数据a为无效类型。
比如一个数据a=0x01010101，b=3，按照分类方法计算（0x01+0x01+0x01+0x01）%3=1，所以如果c=2，则此a为有效类型，其类型为1，如果c=1，则此a为无效类型；
又比如一个数据a=0x01010103，b=3，按照分类方法计算（0x01+0x01+0x01+0x03）%3=0，所以如果c=2，则此a为有效类型，其类型为0，如果c=0，则此a为无效类型。
输入12个数据，第一个数据为c，第二个数据为b，剩余10个数据为需要分类的数据，请找到有效类型中包含数据最多的类型，并输出该类型含有多少个数据。
输入描述：
输入12个数据，用空格分隔，第一个数据为c，第二个数据为b，剩余10个数据为需要分类的数据。

输出描述：
输出最多数据的有效类型有多少个数据。

示例1
输入：
3 4 256 257 258 259 260 261 262 263 264 265
输出：
3
说明：
10个数据4个字节相加后的结果分别为1 2 3 4 5 6 7 8 9 10，故对4取模的结果为1 2 3 0 1 2 3 0 1 2，c为3，所以0 1 2都是有效类型，类型为1和2的有3个数据，类型为0的只有2个数据，故输出3

示例2
输入：
1 4 256 257 258 259 260 261 262 263 264 265
输出：
2
说明：
10个数据4个字节相加后的结果分别为1 2 3 4 5 6 7 8 9 10，故对4取模的结果为1 2 3 0 1 2 3 0 1 2，c为1，所以只有0是有效类型，类型为0的有2个数据，故输出2

解题思路：
这道题其实没啥难度，最主要的还是要读懂题目意思。通过题目给出的 0x01010101，我们可以判断出这是十六进制数据，而根据 （0x01+0x01+0x01+0x01）%3=1，可以看出是将十六进制中的8位数平分为4个两位数然后进行相加。

代码： 
//var ints = readline().split(" ").map(Number);
var ints = "1 4 256 257 258 259 260 261 262 263 264 265".split(" ").map(Number);
var c = ints[0];
var b = ints[1];

var count = new Map();
for (let i=0; i<10; i++){
    let s = 0;
    while (ints[i+2] > 0){
        s += ints[i+2]%256;
        ints[i+2] = Math.floor(ints[i+2] / 256);
    }
    s %= b;
    if (s < c){
        if(count.has(s)){
            count.set(s, count.get(s) + 1);
        }else{
            count.set(s, 1);
        }
        
    }
}
var ans = 0;
for (let value of count.values()) {
    ans = Math.max(ans, value);
}
console.log(ans);



## 阿里巴巴找黄金宝箱(V)
知识点数组哈希表滑窗

 时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
一贫如洗的樵夫阿里巴巴在去砍柴的路上，无意中发现了强盗集团的藏宝地，藏宝地有编号从0~N的箱子，每个箱子上面贴有一个数字。
阿里巴巴念出一个咒语数字k(k<N)，找出连续k个宝箱数字和的最大值，并输出该最大值。
输入描述：
第一行输入一个数字字串，数字之间使用逗号分隔，例如: 2,10,-3,-8,40,5

字串中数字的个数>=1，<=100000；每个数字>=-10000，<=10000；

第二行输入咒语数字，例如：4，咒语数字大小小于宝箱的个数

输出描述：
连续k个宝箱数字和的最大值，例如：39

示例1
输入：
2,10,-3,-8,40,5
4
输出：
39
示例2
输入：
8
1
输出：
8
解题思路：
主要使用滑窗。使用左边界和右边界控制滑窗大小，同时在滑窗向右滑动的时候，控制连续和的大小。

代码： 
// var ints = readline().split(",").map(Number);
// const k = Number(readline());

var ints = "2,10,-3,-8,40,5".split(",").map(Number);
const k = Number("4");
//滑窗的左侧边界
var left = 0;
//滑窗的右侧边界
var right = 0;
//滑窗内的总和
var count = 0;
//最大和
var max = Number.MIN_VALUE;
while (right < ints.length){

    count += ints[right];
    right ++;
    if(right - left < k){
        //滑窗大小不满足咒语数字则右边界继续向右滑动
        continue;
    }
    max = Math.max( max, count);
    //滑窗大小已经满足咒语数字，则左边界需要右移
    count -= ints[left];
    left ++;
}

console.log(max);
.





## 阿里巴巴找黄金宝箱(IV)
知识点数组栈单调栈

时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
一贫如洗的樵夫阿里巴巴在去砍柴的路上，无意中发现了强盗集团的藏宝地，藏宝地有编号从0~N的箱子，每个箱子上面贴有一个数字，箱子排列成一个环，编号最大的箱子的下一个是编号为0的箱子。
请输出每个箱子贴的数字之后的第一个比它大的数，如果不存在则输出-1。
输入描述：
输入一个数字字串，数字之间使用逗号分隔，例如: 1,2,3,1
字串中数字个数>=1，<=10000；每个数字值>=-100000，<=100000

输出描述：
下一个大的数列表，以逗号分隔，例如：2,3,6,-1,6

示例1
输入：
2,5,2
输出：
5,-1,5
说明：
第一个2的下一个更大的数是5；

数字5找不到下一个更大的数； 

第二个2的下一个最大的数需要循环搜索，结果也是 5

示例2
输入：
3,4,5,6,3
输出：
4,5,6,-1,4
解题思路：
1、因为题目说是可以循环搜索，所以我们将输入的数组复制为双份数组

[1,2,3] -> [1,2,3,1,2,3]

2、通过单调栈找出所有位置对于的第一个比他大的值

代码： 
//let nums = readline().split(",").map(Number);
let nums = "3,4,5,6,3".split(",").map(Number);

let len = nums.length;
//将数组复制成双份数组（[1,2,3] -> [1,2,3,1,2,3]）
let doubleNums = [ ...nums, ...nums];

//初始化为 -100001，因为宝箱数值范围 >= -100000，<=100000
let resInts = Array(len).fill(-100001);

let deque = [];
for(let i=0; i<len*2; i++){

    let num = doubleNums[i];
    while (deque.length != 0 && num > nums[deque[deque.length - 1]]){
        let index = deque.pop();
        resInts[index] = num;
    }

    if(i < len){
        deque.push(i);
    }
}

let res = "";
for(let i of resInts){
    if(i == -100001){
        //等于-100001说明不存在，则输出 -1
        i = -1;
    }
    res += i + ",";
}

console.log(res.substring( 0, res.length - 1));




## MELON的难题
知识点DFS搜索

时间限制：2s 空间限制：32MB 限定语言：不限

题目描述：
MELON有一堆精美的雨花石（数量为n，重量各异），准备送给S和W。MELON希望送给俩人的雨花石重量一致，请你设计一个程序，帮MELON确认是否能将雨花石平均分配。
输入描述：
第1行输入为雨花石个数：n， 0 < n < 31。

第2行输入为空格分割的各雨花石重量：m[0] m[1] ….. m[n- 1]， 0 < m[k] < 1001。

不需要考虑异常输入的情况。

输出描述：
如果可以均分，从当前雨花石中最少拿出几块，可以使两堆的重量相等；如果不能均分，则输出-1。

示例1
输入：
4
1 1 2 2
输出：
2
说明：
输入第一行代表共4颗雨花石，第二行代表4颗雨花石重量分别为1、1、2、2。 

均分时只能分别为1,2，需要拿出重量为1和2的两块雨花石，所以输出2。

示例2
输入：
10
1 1 1 1 1 9 8 3 7 10
输出：
3
说明：
输入第一行代表共10颗雨花石，第二行代表4颗雨花石重量分别为1、1、1、1、1、9、8、3、7、10 。 

均分时可以1,1,1,1,1,9,7和10,8,3，也可以1,1,1,1,9,8和10,7,3,1，或者其他均分方式，但第一种只需要拿出重量为10,8,3的3块雨花石，第二种需要拿出4块，所以输出3(块数最少)。

代码：
// var n = Number(readline());
// let ints = readline().split(" ").map(Number);
var n = Number("10");
let ints = "1 1 1 1 1 9 8 3 7 10".split(" ").map(Number);

let total =0;
for(let i=0; i<n; i++){
    total += ints[i];
}

//重量的一半
var half = total/2;
//最小数量
var min = Number.MAX_VALUE;

handle( ints, 0, [], 0);

console.log(min);

/**
 * 
 * @param ints      雨花石数组
 * @param count     雨花石重量
 * @param list      雨花石集合
 * @param index     雨花石索引
 */
function handle( ints, count, list, index){

    if(count == half){
        //可以进行平分
        if(list.length < min){
            //雨花石数量小于最小值
            min = list.length;
        }
        if(n - list.length < min){
            //剩下的雨花石数量小于最小值
            min = n - list.length;
        }
    }else {
        for(let i=index; i<ints.length; i++){
            //雨花石添加
            list.push(ints[i]);
            //重量计算
            count += ints[i];
            if(count <= half && (list.length < min || n - list.length < min)){
                //重量小于等于一半，且雨花石数量或者剩下的数量小于最小数
                handle( ints, count, list, i+1);
            }
            //重量移除、雨花石移除
            count -= list.pop();

        }
    }

}





## 计算误码率
知识点双指针

时间限制：1s 空间限制：256MB 限定语言：不限

题目描述：
误码率是最常用的数据通信传输质量指标。它可以理解为“在多少位数据中出现一位差错”。
移动通信网络中的误码率主要是指比特误码率，其计算公式如下：比特误码率=错误比特数/传输总比特数，
为了简单，我们使用字符串来标识通信的信息，一个字符错误了，就认为出现了一个误码
输入一个标准的字符串，和一个传输后的字符串，计算误码率
字符串会被压缩，
例如：“2A3B4D5X1Z” 表示 “AABBBDDDDXXXXXZ
用例会保证两个输入字符串解压后长度一致，解压前的长度不一定一致。
每个生成后的字符串长度<100000000。
输入描述：
两行，分别为两种字符串的压缩形式。 每行字符串（压缩后的）长度<100000

输出描述：
一行，错误的字符数量 / 展开后的总长度

补充说明：
注意：展开后的字符串不含数字。

示例1
输入：
3A3B
2A4B
输出：
1/6
示例2
输入：
5Y5Z
5Y5Z
输出：
0/10
示例3
输入：
4Y5Z
9Y
输出：
5/9
解题思路：
满分答案是通过各字符的个数去进行了对比。

大家也可以先进行解压，然后再遍历进行对比，这样可能比较好理解。

满分答案： 
// let str1 = readline();
// let str2 = readline();
let str1 = "3A3B";
let str2 = "2A4B";

let map1 = [];
let map2 = [];

let total = getMap( str1, map1);
getMap( str2, map2);

let index = 0;
let len1 = map1.length;
let len2 = map2.length;

let tmp1 = 0, tmp2 = 0;
let i = 0, j = 0;
//误码个数
let res = 0;

while(i < len1 && j < len2) {
    //已在统计中的字符总数
    tmp1 += map1[i][1];
    tmp2 += map2[j][1];
    //在统计中的字符个数置为0
    map1[i][1] = 0;
    map2[j][1] = 0;
    //当前字符
    let cahr1 = map1[i][0];
    let char2 = map2[j][0];
    
    while(index < tmp1 && index < tmp2) {
        if(cahr1 != char2) {
            //不匹配则计数
            res++;
        }
        index ++;
    }
    if(index >= tmp1) {
        i ++;
    }
    if(index >= tmp2) {
        j ++;
    }
    
}

console.log(res + "/" + total)

function getMap( string, list){

    let index = 0;
    //字符的总数
    let count = 0;
    
    let len = string.length;
    while(index < len) {
        //当前字符的个数
        let num = 0;
        while(index < len && string[index] <= '9' && string[index] >= '0') {
            //防止数字是多位数
            num *= 10;
            num += string[index] - '0';
            index ++;
        }
        //当前字符
        let char = string[index];
        list.push([ char, num]);
        count += num;
        index ++;
    }
    
    return count;
}




## 叠积木
知识点哈希表

时间限制：1秒 | 内存限制：262144K | 语言限制：不限

题目描述：
有一堆长方体积木，它们的宽度和高度都相同，但长度不一。小橙想把这堆积木叠成一面墙，墙的每层可以放一个积木，也可以将两个积木拼接起来，要求每层的长度相同。若必须用完这些积木，叠成的墙最多为多少层？
如下是叠成的一面墙的图示，积木仅按宽和高所在的面进行拼接。


输入描述:
输入为一行，为各个积木的长度，数字为正整数，并由空格分隔。积木的数量和长度都不超过5000。

输出描述:
输出一个数字，为墙的最大层数，如果无法按要求叠成每层长度一致的墙，则输出-1。

示例1
输入：
3 6 6 3
输出：
3
说明：
可以每层都是长度3和6的积木拼接起来，这样每层的长度为9，层数为2；也可以其中两层直接用长度6的积木，两个长度3的积木拼接为一层，这样层数为3，故输出3。

示例2
输入：
1 4 2 3 6
输出：
-1
说明：
无法用这些积木叠成每层长度一致的墙，故输出-1。

解题思路：
每层只能放一个或两个积木（非常重要）
积木的总长度可以被积木层数整除
积木每层的最小长度为最短积木，最大长度为最短积木和最大积木和（因为一层最多两个积木）
根据步骤2对总长度进行分解因子，从最小长度开始，如果因数符合积木要求，则输出层数；如不符合，则输出-1
代码： 
let strings = readLine().split(" ");
//let strings = "4 5 3 6".split(" ");

let list = [];
let count = 0;  //积木总长度
let len = strings.length;

for(let i=0;i<len;i++){
    let n = Number(strings[i]);
    count += n;
    list.push(n);    //所有积木集合
}

list.sort((a,b)=>{return a-b});
let min = list[len-1];  //最小宽度
let max = list[0] + list[len-1];    //最大宽度（因为最多是两个积木拼接）
let res = -1;

for(let i=min;i<=max;i++){
    if(count%i==0){
        let copyList = copyArr(list); //因为要对list进行多次操作，需要copy一下
        if(isSuccess(copyList,i)){
            res = count/i;
            break;
        }
    }
}

console.log(res);

function copyArr(list){

    let len = list.length;
    let copyList = [];

    for(let i=0;i<len;i++){
        copyList.push(list[i]);
    }

    return copyList;
}

/**
 *
 * @param list 积木集合
 * @param n 积木所需宽度
 * @return
 */
function isSuccess(list, n){

    let isTrue = true;

    while (list.length >0 && isTrue){
        let i = list.length-1;
        if(n==list[i]){
            list.splice(i,1); //最长的一根积木符合要求则剔除进行下次循环
        }else if(n == list[i]+list[0]){
            list.splice(i,1); //最长一根跟最短一根积木之和符合要求则剔除两个积木进行下次循环
            list.splice(0,1);
        }else {
            isTrue = false; //上面两个都不符合则表示无法完成一堵墙
        }
    }

    return isTrue;
}




## 最长方连续方波信号
知识点滑窗

时间限制：1秒 | 内存限制：262144K | 语言限制：不限

题目描述：
输入一串方波信号，求取最长的完全连续交替方波信号，并将其输出，如果有相同长度的交替方波信号，输出任一即可，方波信号高位用1标识，低位用0标识，如图：


说明：
1） 一个完整的信号一定以0开始然后以0结尾，即010是一个完整信号，但101，1010，0101不是
2）输入的一串方波信号是由一个或多个完整信号组成
3） 两个相邻信号之间可能有0个或多个低位，如0110010，011000010
4） 同一个信号中可以有连续的高位，如01110101011110001010，前14位是一个具有连续高位的信号
5） 完全连续交替方波是指10交替，如01010是完全连续交替方波，0110不是
输入描述:
输入信号字符串（长度>=3且<=1024）：

0010101010110000101000010

注：输入总是合法的，不用考虑异常情况

输出描述:
输出最长的完全连续交替方波信号串：

01010

若不存在完全连续交替方波信号串，输出 -1

补充说明：
输入信号串中有三个信号：0 010101010110(第一个信号段) 00 01010(第二个信号段) 010(第三个信号段)

第一个信号虽然有交替的方波信号段，但出现了11部分的连续高位，不算完全连续交替方波，在剩下的连续方波信号串中01010最长

示例1
输入：
00101010101100001010010
输出：
01010
解题思路：
根据题意可知：

信号方波要以0开始，以0结尾。

遍历字符串，遇到第一个0，开始统计

00101010101100001010010

遍历到第二个字符，还是0，则抛弃第一个0，从第二个0开始统计

00101010101100001010010

遍历到第三个字符，是1，则符合方波

00101010101100001010010

遍历到第四个字符，是0，注意：此时需要看第五个字符，如果第五个为1，则符合方波，如果为0，则方波统计结束

00101010101100001010010

以此类推。。。

00101010101100001010010

遍历到第十三个字符是0，符合方波

00101010101100001010010

遍历到第十四个字符是0，因为前面一个字符已经是0，所以方波统计结束

00101010101100001010010

出现第一个方波010101010110

继续遍历找出了另外两个方波

01010    010

因为需要连续方波，而连续的方波中间是10相互交替的，只有 01010和010符合，

最长的就是01010

代码： 
let s = readLine();
//let s = "00101010101100001010010";

let res = "";
let temp = "";
let b = false;  //是否开始识别
let isFomat = true; //是否满足条件
if(s.charAt(0)=='0'){       //如果第一个为0，则从第一个开始识别
    temp ="0";
    b = true;
}

for(let i=1;i<s.length;i++){
    if(b){      //识别中
        if(s.charAt(i)==s.charAt(i-1)){     //此时的数等于前一个数
            if(s.charAt(i)=='0'){       //出现重复的0则出局
                if(temp.length>=3 && isFomat){        //如果都是0，且符合规则（不含连续1大于3个长度）
                    res = temp.length>res.length ? temp : res;      //取最长信号
                }
                temp = "0";     //容器重置
                isFomat = true;
            }else {
                temp += s.charAt(i);      //出现重复的1继续，不过已不符合要求（不含连续的1）
                isFomat = false;
            }
        }else {
            temp += s.charAt(i);      //无重复的值则继续
        }
    } else {
        if(s.charAt(i)=='0'){   //遇到0就开始识别
            temp = "0";
            b = true;
        }
    }
}
console.log(res);