// Функция, которая определяет, начинается ли заказ через X дней
export function startsInXDays(orders, x) {
  const today = new Date().setHours(0,0,0,0)
  return !!orders.dates.find(
    (order) => Math.ceil((new Date(order.start_date).setHours(0,0,0,0) - today) / (1000 * 60 * 60 * 24)) === x
  )
}

// Функция, которая определяет, заканчивается ли заказ сегодня
export function endsToday(orders) {
  const today = new Date().setHours(0,0,0,0)
  return !!orders.dates.find(
    (order) => new Date(order.end_date).setHours(0,0,0,0) === today
  )
}

// Функция, которая endsInXDaysопределяет, заканчивается ли заказ завтра
export function endsTomorrow(orders) {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return !!orders.dates.find(
    (order) => new Date(order.end_date).setHours(0,0,0,0) === tomorrow.setHours(0,0,0,0)
  )
}

// Функция, которая определяет, заканчивается ли заказ через X дней
export function endsInXDays(orders, x) {
  const today = new Date().setHours(0,0,0,0);
  return !!orders.dates.find(
    (order) => Math.ceil((new Date(order.end_date) - today) / (1000 * 60 * 60 * 24)) === x
  )
}

// Функция, которая определяет, закончился ли заказ X дней назад
export function endedXDaysAgo(orders, x) {
  const today = new Date().setHours(0,0,0,0);
  return !!orders.dates.find(
    (order) => Math.ceil((today - new Date(order.end_date)) / (1000 * 60 * 60 * 24)) === x
  )
  
}