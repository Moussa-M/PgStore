function daysInMonth (year, month) {
  return new Date(year, month, 0).getDate()
}

function formatIsoDate (date) {
  var mm = date.getMonth() + 1
  var dd = date.getDate()

  return [
    date.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd
  ].join('-')
};

function diffInDays (d1, d2) {
  let timeDiff = Math.abs(d2.getTime() - d1.getTime())
  let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))
  return diffDays
}

function getStartYearDate (date) {
  let sdate = date.getFullYear() + '-01-01T00:00:00'
  return new Date(sdate)
}

function getStartMonthDate (date) {
  date.setDate(1)
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date
}

function randomColor () {
  var letters = '0123456789ABCDEF'
  var color = '#'
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}
export {
  daysInMonth,
  formatIsoDate,
  diffInDays,
  getStartYearDate,
  getStartMonthDate,
  randomColor
}
