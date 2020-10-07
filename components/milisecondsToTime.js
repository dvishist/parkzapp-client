const milisecondsToTime = (timeInMiliseconds) => {
    let h = Math.floor(timeInMiliseconds / 1000 / 60 / 60)
    let m = Math.floor((timeInMiliseconds / 1000 / 60 / 60 - h) * 60)
    let s = Math.floor(((timeInMiliseconds / 1000 / 60 / 60 - h) * 60 - m) * 60)
    let outputString = ""
    outputString += h > 0 ? String(h) + " hr " : ""
    outputString += m > 0 ? String(m) + " min " : ""
    outputString += (h === 0 && s > 0) ? String(s) + " sec" : ""
    return (outputString)
}


export default milisecondsToTime