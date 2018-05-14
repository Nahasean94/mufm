"use strict"
 function  secondsToHms(d) {
    d = Number(d)

    const h = Math.floor(d / 3600)
    const m = Math.floor(d % 3600 / 60)
    const s = Math.floor(d % 3600 % 60)
    // if (h === 0) {
    //     return ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2)
    // }
    // if (m === 0) {
    //     return ('0' + s).slice(-2)
    // }

    return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2)
}

// console.log()
console.log(new Date().toLocaleTimeString() )