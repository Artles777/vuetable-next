<template>
  <colgroup>
    <template v-for="(field, fieldIndex) in vuetable.tableFields">
      <template v-if="field.visible">
        <col
          :key="fieldIndex"
          :style="{width: field.width}"
          :class="columnClass(field, fieldIndex)"/>
      </template>
    </template>
    <col
      v-if="isHeader && vuetable.scrollVisible"
      :style="{ width: vuetable.scrollBarWidth }"
      class="vuetable-col-gutter"/>
  </colgroup>
</template>

<script setup lang="ts">
import {
  defineOptions,
  defineProps,
  inject
} from "vue-demi";
import type { DefineComponent } from "vue-demi";
import type Vuetable from "./Vuetable.vue";

interface Props {
  isHeader?: boolean;
}

interface Field {
  name: string | DefineComponent
  sortField: string | null
  title: string | ((str?: any) => string)
  titleClass: string
  dataClass: string
  formatter: (<T>(...args: any[]) => T) | null
  visible: boolean
  width: string
  $_index: number
  [key: string]: unknown
}

const vuetable = inject("vuetable") as InstanceType<typeof Vuetable>;

defineOptions({
  name: "vuetable-col-group",
});

const {
  isHeader = false
} = defineProps<Props>();

function columnClass (field: Field, fieldIndex: number) {
  let fieldName = typeof field.name === "object" && field.name !== null
    ? (field.name as DefineComponent).name
    : field.name as string;
  fieldName = fieldName!.replace(vuetable.fieldPrefix as string, "");

  return [`vuetable-col-${ fieldName }`, field.titleClass, `${ fieldName }-${ fieldIndex }`];
}
</script>

<style scoped>

</style>