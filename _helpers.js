function today() {
  const todayDate = new Date()

  let year = todayDate.getFullYear()
  let month = todayDate.getMonth() + 1
  let day = todayDate.getDate()

  year = year.toString()
  month = month.toString().padStart(2, "0")
  day = day.toString().padStart(2, "0")

  return `${year}-${month}-${day}`
}

function displayDate(date) {
  let [year, month, day] = date.split("-")

  year = parseInt(year)
  month = parseInt(month)
  day = parseInt(day)

  return `${month}/${day}/${year}`
}

export { today, displayDate }
