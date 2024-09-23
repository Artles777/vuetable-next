<template>
  <th
    v-if="isHeader"
    class="vuetable-th-component-checkbox">
    <input
      :checked="isAllItemsInCurrentPageSelected()"
      type="checkbox"
      @change="toggleAllCheckbox($event)"/>
  </th>
  <td
    v-else
    class="vuetable-td-component-checkbox">
    <input
      ref="checkbox"
      :checked="isSelected(rowData!)"
      type="checkbox"
      @change="toggleCheckbox(rowData!, $event)"/>
  </td>
</template>

<script setup lang="ts">
import { type ComponentPublicInstance, defineOptions, defineProps, inject, ref } from "vue-demi";
import type Vuetable from "./Vuetable.vue";

interface Props {
  rowData?: { [key: string]: any }
  rowIndex?: number
  rowField?: { [key: string]: any } | null
  isHeader?: boolean
  title?: string
}

type CustomEvent = Event & { target: { checked: boolean } };

defineOptions({
  name: "vuetable-field-checkbox"
});

const {
  rowField = null,
  isHeader = false,
} = defineProps<Props>();

const vuetable = inject("vuetable") as InstanceType<typeof Vuetable>;

const checkbox = ref<ComponentPublicInstance<HTMLInputElement> | null>(null);

function toggleCheckbox (dataItem: { [key: string]: unknown }, event: Event) {
  vuetable.onCheckboxToggled((event as CustomEvent).target.checked, rowField?.name, dataItem);
}

function toggleAllCheckbox (event: Event) {
  vuetable.onCheckboxToggledAll((event as CustomEvent).target.checked);
}

function isSelected (rowData: { [key: string]: any }): boolean {
  return vuetable.isSelectedRow(rowData[vuetable.trackBy]);
}

function isAllItemsInCurrentPageSelected () {
  if (!vuetable.tableData) return;

  const idColumn = vuetable.trackBy;
  const checkboxEl = checkbox.value?.$el.querySelector("input[type=checkbox]");
  const selected = vuetable.tableData.filter((item: { [key: string]: string }) => vuetable.isSelectedRow(item[idColumn]) );

  // count == 0, clear the checkbox
  if (selected.length <= 0) {
    checkboxEl.indeterminate = false;
    return false;
  }
  // count > 0 and count < perPage, set checkbox state to 'indeterminate'
  else if (selected.length < vuetable.perPage!) {
    checkboxEl.indeterminate = true;
    return true;
  }
  // count == perPage, set checkbox state to 'checked'
  else {
    checkboxEl.indeterminate = false;
    return true;
  }
}
</script>

<style scoped>

</style>