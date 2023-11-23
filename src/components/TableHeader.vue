<template>
  <div>
    <div class="title">
      <span @click.prevent="changeSort()" class="link">{{ title }}</span>
      <div v-if="!sort.length" class="title__button">
        <svg
          @click.prevent="changeSort('ASC')"
          class="arrow-top link"
          :fill="colorASC"
          viewBox="0 0 9 14"
        >
          <path
            class="svg-arrow"
            d="M6.660,8.922 L6.660,8.922 L2.350,13.408 L0.503,11.486 L4.813,7.000 L0.503,2.515 L2.350,0.592 L8.507,7.000 L6.660,8.922 Z"
          />
        </svg>
        <svg
          @click.prevent="changeSort('DESC')"
          class="arrow-bottom link"
          :fill="colorDESC"
          viewBox="0 0 9 14"
        >
          <path
            class="svg-arrow"
            d="M6.660,8.922 L6.660,8.922 L2.350,13.408 L0.503,11.486 L4.813,7.000 L0.503,2.515 L2.350,0.592 L8.507,7.000 L6.660,8.922 Z"
          />
        </svg>
      </div>
      <template v-else>
        <select :value="selectedSort" @change="sortBy($event)">
          <option v-for="item in sort" :key="item.value" :value="item.value">
            {{ item.title }}
          </option>
        </select>
        <button @click.prevent="clearSort()">Очистить сортировку</button>
      </template>
    </div>
    <template v-if="filter.length">
      <hr />
      <select :value="selectedFilter" @change="filterBy($event)">
        <option v-for="item in filter" :key="item.value" :value="item.value">
          {{ item.title }}
        </option>
      </select>
      <span>X = </span>
      <input
        class="input-param"
        v-model.number="param"
        @keypress="isNumber($event)"
        @change="changeParam($event.target.value)"
      />
      <button @click.prevent="clearFilter()">Очистить фильтр</button>
    </template>
  </div>
</template>
<script setup>
import { computed, defineProps, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const props = defineProps({
  title: String,
  attribute: String,
  filter: { type: Array, default: () => [] },
  sort: { type: Array, default: () => [] }
})

const route = useRoute()
const router = useRouter()

const selectedFilter = ref(route.query[props.attribute])
const selectedSort = ref(route.query.order)

const param = ref(Math.round(+route.query.param || 0))

const colorASC = computed(() => {
  if (route.query.sort === props.attribute && route.query.order === 'ASC') {
    return '#66b1ff'
  }
  return '#ebebeba3'
})

if (props.sort.length) {
  watch(
    () => route.query.order,
    () => {
      if (route.query.sort === props.attribute) {
        selectedSort.value = route.query.order
      } else {
        selectedSort.value = ""
      }
    }
  )
}

const colorDESC = computed(() => {
  if (route.query.sort === props.attribute && route.query.order === 'DESC') {
    return '#66b1ff'
  }
  return '#ebebeba3'
})

function isNumber(evt) {
  const keysAllowed = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  const keyPressed = evt.key

  if (!keysAllowed.includes(keyPressed)) {
    evt.preventDefault()
  }
}

function changeSort(order) {
  if (order) {
    router.push({ query: { ...route.query, sort: props.attribute, order } })
  } else if (route.query.sort === props.attribute) {
    if (route.query.order === 'ASC') {
      router.push({ query: { ...route.query, sort: props.attribute, order: 'DESC' } })
    } else if (route.query.order === 'DESC') {
      router.push({ query: { ...route.query, sort: undefined, order: undefined } })
    } else {
      router.push({ query: { ...route.query, sort: props.attribute, order: 'ASC' } })
    }
  } else {
    router.push({ query: { ...route.query, sort: props.attribute, order: 'ASC' } })
  }
}

function changeParam(value) {
  selectedFilter.value = ''
  router.push({ query: { ...route.query, param: +value, [props.attribute]: undefined  } })
}

function filterBy(value) {
  selectedFilter.value = value.target.value
  router.push({ query: { ...route.query, [props.attribute]: value.target.value } })
}

function clearFilter() {
  selectedFilter.value = ''
  router.push({ query: { ...route.query, [props.attribute]: undefined } })
}

function sortBy(value) {
  selectedSort.value = value.target.value
  router.push({ query: { ...route.query, sort: props.attribute, order: value.target.value } })
}

function clearSort() {
  selectedSort.value = ''
  router.push({ query: { ...route.query, sort: undefined, order: undefined } })
}
</script>
<style lang="scss" scope>
.arrow-top,
.arrow-bottom {
  width: 15px;
  height: 15px;
}
.arrow-top {
  transform: rotate(270deg);
}
.arrow-bottom {
  transform: rotate(90deg);
}

.title {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;

  &__button {
    display: flex;
    flex-direction: column;
  }
}

.input-param {
  width: 60px;
  text-align: center;
}
</style>
