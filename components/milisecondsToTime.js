const { NativeModules } = require("react-native")

const milisecondsToTime = (timeInMiliseconds) => {
    let h = Math.floor(timeInMiliseconds / 1000 / 60 / 60)
    let m = Math.floor((timeInMiliseconds / 1000 / 60 / 60 - h) * 60)
    let s = Math.floor(((timeInMiliseconds / 1000 / 60 / 60 - h) * 60 - m) * 60)
    h = doubleDigit(h)
    m = doubleDigit(m)
    s = doubleDigit(s)
    return (`${h}:${m}:${s}`)
}

const doubleDigit = (t) => (
    String(t).length === 1 ?
        '0' + t
        : t
)

export default milisecondsToTime