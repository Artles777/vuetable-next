<template>
  <th v-if="isHeader"
      class="vuetable-th-component-sequence"
      v-html="title">
  </th>
  <td v-else
      class="vuetable-td-component-sequence"
      v-html="renderSequence()">
  </td>
</template>

<script setup lang="ts">
import { defineOptions, defineProps, inject } from "vue-demi";
import type Vuetable from "./Vuetable.vue";

interface Props {
  rowIndex?: number
  isHeader?: boolean
  title?: string
}

defineOptions({
  name: "vuetable-field-sequence"
});

const vuetable = inject("vuetable") as InstanceType<typeof Vuetable>;

const {
  rowIndex = 0,
  isHeader = false,
  title = "",
} = defineProps<Props>();

function renderSequence () {
  return vuetable.tablePagination
    ? vuetable.tablePagination.from + rowIndex
    : 1 + rowIndex;
}
</script>

<style scoped>

</style>