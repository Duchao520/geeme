export const floatReg = new RegExp(/(^[0]{1}[.]{1}[0-9]+$)|0|(^[1-9]+[0-9]*[.]{1}[0-9]+$)|(^[1-9]+[0-9]*$)/)

export const intReg = new RegExp(/(^[0]{1}$)|(^[1-9]+[0-9]*$)/)

export const naturalNumber = /^\d*$/ // 自然数: 0 + 正整数

export const positiveInt = /^[1-9]\d*$/ // 正整数