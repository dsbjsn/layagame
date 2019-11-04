/*
* 推荐的方法
*
* 方法的实现代码相当酷炫，
* 实现思路：获取没重复的最右一值放入新数组。
* （检测到有重复值时终止当前循环同时进入顶层循环的下一轮判断）
*/
export function array_uniq(array) {
    var temp = [];
    var index = [];
    var l = array.length;
    for (var i = 0; i < l; i++) {
        for (var j = i + 1; j < l; j++) {
            if (array[i] === array[j]) {
                i++;
                j = i;
            }
        }
        temp.push(array[i]);
        index.push(i);
    }
    return temp;
}

/**
* 判断是否为json字符串
* @param {any} str 
*/
export const isJsonStr: Function = (str) => {
    if (typeof str === "string") {
        try {
            let obj = JSON.parse(str);
            if (typeof obj == 'object' && obj) {
                return true;
            } else {
                return false;
            }

        } catch (e) {
            return false;
        }
    } else {
        return false;
    }
}

/**
 * 画圆角矩形路径
 * @param {number} x 起始点x坐标
 * @param {number} y 起始点y坐标
 * @param {number} w 宽度
 * @param {number} h 高度
 * @param {number} r 圆角
 */
export const roundRectPath: Function = (x: number, y: number, w: number, h: number, r: number) => {
    return [
        ["moveTo", x + r, 0],
        ["lineTo", x + w - r, 0],
        ["arcTo", x + w, y, x + w, y + r, r],
        ["lineTo", x + w, y + h - r],
        ["arcTo", x + w, y + h, x + w - r, y + h, r],
        ["lineTo", x + r, y + h],
        ["arcTo", x, y + h, x, y + h - r, r],
        ["lineTo", x, y + r],
        ["arcTo", x, y, x + r, y, r],
        ["closePath"]
    ];
}

/**
 * 格式化日期：yyyy-MM-dd
 * @param {Date} date
 */
export const formatDate: Function = (date: Date = null): string => {
    if (date === null) date = new Date()
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    let d = date.getDate()
    return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d)
}