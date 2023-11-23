<template>
  <div>
    <table>
      <tr>
        <th><TableHeader title="ID" attribute="o_id" /></th>
        <th><TableHeader title="Имя клиента" attribute="client_name" /></th>
        <th><TableHeader title="Диета" attribute="diets" /></th>
        <th><TableHeader title="Тариф" attribute="tariff" /></th>
        <th><TableHeader title="Адрес" attribute="address" /></th>
        <th><TableHeader title="Телефон" attribute="phone" /></th>
        <th>
          <TableHeader title="Дата" attribute="dates" :filter="dateFilters" :sort="datesSort" />
        </th>
        <th><TableHeader title="Скидка" attribute="discount" /></th>
        <th><TableHeader title="Сумма" attribute="order_sum" /></th>
        <th><TableHeader title="Оплаченная сумма" attribute="order_payed" /></th>
        <th><TableHeader title="Статус оплаты" attribute="pay_status" /></th>
        <th><TableHeader title="Комментарий курьера" attribute="courier_comment" /></th>
        <th><TableHeader title="Комментарий заказчика" attribute="inner_comment" /></th>
      </tr>

      <tr v-for="item in filteredData" :key="item.o_id">
        <td>{{ item.o_id }}</td>
        <td>{{ item.client_name }}</td>
        <td>
          <span v-for="(diet, index) in item.diets" :key="item.o_id + diet">
            {{ diet }}
            <hr style="margin: 0 5px" v-if="item.diets.length - 1 !== index" />
          </span>
        </td>
        <td>
          <span v-for="(tariff, index) in item.tariff" :key="item.o_id + tariff">
            {{ tariff }}
            <hr style="margin: 0 5px" v-if="item.tariff.length - 1 !== index" />
          </span>
        </td>
        <td>{{ item.address }}</td>
        <td>{{ item.phone }}</td>
        <td>
          <span v-for="(date, index) in item.dates" :key="item.o_id + date">
            {{ shotDate(date.start_date) }} - {{ shotDate(date.end_date) }}
            <hr style="margin: 0 5px" v-if="item.dates.length - 1 !== index" />
          </span>
        </td>
        <td>{{ item.discount }}</td>
        <td>{{ item.order_sum }}</td>
        <td>{{ item.order_payed }}</td>
        <td>{{ item.pay_status }}</td>
        <td>{{ item.courier_comment }}</td>
        <td>{{ item.inner_comment }}</td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { data, formatDate } from '@/utils/data'
import { quickSort } from '@/utils/sort'
import { endsToday, endsTomorrow, startsInXDays, endsInXDays, endedXDaysAgo } from '@/utils/filters'
import TableHeader from '@/components/TableHeader.vue'
import { watch, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

let sortedData = ref(data)

let filteredData = ref(data)

const datesSort = [
  {
    title: 'Начинается через Х дней',
    value: 'startAccross'
  },
  {
    title: 'Заканчивается через Х дней',
    value: 'endAccross'
  },
  {
    title: 'Закончилось Х дней назад',
    value: 'endedAccross'
  }
]

const dateFilters = [
  {
    title: 'Заканчивается сегодня',
    value: 'endTodayFilter'
  },
  {
    title: 'Заканчивается завтра',
    value: 'endTomorrowFilter'
  },
  ...datesSort
]

filterData()
sortData()

watch(
  () => route.query,
  (newValue, oldValue) => {
    if (newValue.order !== oldValue.order || newValue.sort !== oldValue.sort) {
      sortData()
    }
    if (newValue.dates !== oldValue.dates) {
      filterData()
    }
  }
)

function filterData() {
  if (route.query.dates === 'endTodayFilter') {
    filteredData.value = sortedData.value.filter((order) => endsToday(order))
  } else if (route.query.dates === 'endTomorrowFilter') {
    filteredData.value = sortedData.value.filter((order) => endsTomorrow(order))
  } else if (route.query.dates === 'startAccross') {
    filteredData.value = sortedData.value.filter((order) =>
      startsInXDays(order, +route.query.param || 0)
    )
  } else if (route.query.dates === 'endAccross') {
    filteredData.value = sortedData.value.filter((order) =>
      endsInXDays(order, +route.query.param || 0)
    )
  } else if (route.query.dates === 'endedAccross') {
    filteredData.value = sortedData.value.filter((order) =>
      endedXDaysAgo(order, +route.query.param || 0)
    )
  } else {
    if (route.query.order) {
      sortData()
      filteredData.value = sortedData.value
    } else {
      filteredData.value = data
      sortedData.value = data
    }
  }
}

function sortData() {
  if (route.query.order === 'ASC') {
    sortedData.value = quickSort(route.query.dates ? filteredData.value : data, (a, b) => {
      if (typeof a[route.query.sort] === 'number') {
        return a[route.query.sort] - b[route.query.sort]
      } else if (typeof a[route.query.sort] === 'string' || a[route.query.sort] === null) {
        return String(a[route.query.sort]).localeCompare(String(b[route.query.sort]))
      } else if (typeof a[route.query.sort] === 'object') {
        return a[route.query.sort].length - b[route.query.sort].length
      }
    })
    filteredData.value = sortedData.value
  } else if (route.query.order === 'DESC') {
    sortedData.value = quickSort(route.query.dates ? filteredData.value : data, (a, b) => {
      if (typeof a[route.query.sort] === 'number') {
        return b[route.query.sort] - a[route.query.sort]
      } else if (typeof a[route.query.sort] === 'string' || a[route.query.sort] === null) {
        return -String(a[route.query.sort]).localeCompare(String(b[route.query.sort]))
      } else if (typeof a[route.query.sort] === 'object') {
        return b[route.query.sort].length - a[route.query.sort].length
      }
    })
    filteredData.value = sortedData.value
  } else if (route.query.order === 'startAccross') {
    const today = new Date().setHours(0, 0, 0, 0)
    sortedData.value = quickSort(route.query.dates ? filteredData.value : data, (a, b) => {
      const firstDate = Math.max(...a.dates.map((date) => new Date(date.start_date).getTime()))
      const secondDate = Math.max(...b.dates.map((date) => new Date(date.start_date).getTime()))
      return (
        Math.ceil((secondDate - today) / (1000 * 60 * 60 * 24)) -
        Math.ceil((firstDate - today) / (1000 * 60 * 60 * 24))
      )
    })
    filteredData.value = sortedData.value
  } else if (route.query.order === 'endAccross') {
    const today = new Date().setHours(0, 0, 0, 0)
    sortedData.value = quickSort(route.query.dates ? filteredData.value : data, (a, b) => {
      const aArray = a.dates.filter((date) => new Date(date.end_date).getTime() - today > 0)
      const bArray = b.dates.filter((date) => new Date(date.end_date).getTime() - today > 0)
      const firstDate = Math.min(
        ...(aArray.length ? aArray : a.dates.map((date) => new Date(date.end_date).getTime()))
      )
      const secondDate = Math.min(
        ...(bArray.length ? bArray : b.dates.map((date) => new Date(date.end_date).getTime()))
      )
      const daysDiffA = Math.ceil((firstDate - today) / (1000 * 60 * 60 * 24))
      const daysDiffB = Math.ceil((secondDate - today) / (1000 * 60 * 60 * 24))
      if (daysDiffA <= 0) {
        return 1
      }

      return daysDiffA - daysDiffB
    })
    filteredData.value = sortedData.value
  } else if (route.query.order === 'endedAccross') {
    const today = new Date().setHours(0, 0, 0, 0)
    sortedData.value = quickSort(route.query.dates ? filteredData.value : data, (a, b) => {
      const aArray = a.dates.filter((date) => today - new Date(date.end_date).getTime() > 0)
      const bArray = b.dates.filter((date) => today - new Date(date.end_date).getTime() > 0)
      const firstDate = Math.min(
        ...(aArray.length ? aArray : a.dates.map((date) => new Date(date.end_date).getTime()))
      )
      const secondDate = Math.min(
        ...(bArray.length ? bArray : b.dates.map((date) => new Date(date.end_date).getTime()))
      )
      const daysDiffA = Math.ceil((today - firstDate) / (1000 * 60 * 60 * 24))
      const daysDiffB = Math.ceil((today - secondDate) / (1000 * 60 * 60 * 24))
      if (daysDiffA < 0 && daysDiffB > 0) {
        return 1
      } else if (daysDiffA > 0 && daysDiffB < 0) {
        return -1
      } else {
        return daysDiffA - daysDiffB
      }
    })
    filteredData.value = sortedData.value
  } else {
    sortedData.value = data
    filterData()
    sortedData.value === filterData.value
  }
}

function shotDate(date) {
  return formatDate(date)
}
</script>
