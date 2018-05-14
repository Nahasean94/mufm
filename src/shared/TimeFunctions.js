export function addTimes(startTime, endTime) {
    const times = [0, 0, 0]
    const max = times.length

    let a = (startTime || '').split(':')
    let b = (endTime || '').split(':')

    // normalize time values
    for (let i = 0; i < max; i++) {
        a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i])
        b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i])
    }

    // store time values
    for (let i = 0; i < max; i++) {
        times[i] = a[i] + b[i]
    }

    let hours = times[0]
    let minutes = times[1]
    let seconds = times[2]

    if (seconds >= 60) {
        const m = (seconds / 60) << 0
        minutes += m
        seconds -= 60 * m
    }

    if (minutes >= 60) {
        const h = (minutes / 60) << 0
        hours += h
        minutes -= 60 * h
    }
    if(hours >= 24){
        hours = hours %24;
        hours = hours < 0 ? 24 + hours : +hours;
    }
    return ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2)
}
export  function tConv12(time24) {
    let ts = time24
    const H = +ts.substr(0, 2)
    let h = (H % 12) || 12
    h = (h < 10) ? ("0" + h) : h  // leading 0 at the left for 1 digit hours
    const ampm = H < 12 ? " AM" : " PM"
    ts = h + ts.substr(2, 3) + ampm
    return ts
}
export function  secondsToHms(d) {
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
