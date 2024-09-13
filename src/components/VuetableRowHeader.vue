<template>
  <tr>
    <template v-for="(field, fieldIndex) in vuetable.tableFields">
      <template v-if="field.visible">
        <template v-if="vuetable.isFieldComponent(field.name)">
          <component :is="field.name"
                     :key="fieldIndex"
                     is-header
                     :row-field="field"
                     :title="renderTitle(field)"
                     :class="headerClass('vuetable-th-component', field)"
                     :style="{width: field.width}"
                     @vuetable:header-event="vuetable.onHeaderEvent"
                     @click="onColumnHeaderClicked(field, $event)">
          </component>
        </template>
        <template v-else-if="vuetable.isFieldSlot(field.name)">
          <th :key="fieldIndex"
              :class="headerClass('vuetable-th-slot', field)"
              :style="{width: field.width}"
              v-html="renderTitle(field)"
              @click="onColumnHeaderClicked(field, $event)">
          </th>
        </template>
        <template v-else>
          <th :key="fieldIndex"
              :id="'_' + field.name"
              :class="headerClass('vuetable-th', field)"
              :style="{width: field.width}"
              v-html="renderTitle(field)"
              @click="onColumnHeaderClicked(field, $event)">
          </th>
        </template>
      </template>
    </template>
    <VuetableColGutter v-if="vuetable.scrollVisible">
    </VuetableColGutter>
  </tr>
</template>

<script setup lang="ts">
import VuetableFieldCheckbox from "./VuetableFieldCheckbox.vue";
import VuetableFieldHandle from "./VuetableFieldHandle.vue";
import VuetableFieldSequence from "./VuetableFieldSequence.vue";
import VuetableColGutter from "./VuetableColGutter.vue";
import type { Component } from "vue-demi";
import { inject } from "vue-demi";
import { defineOptions } from "vue-demi";
import type Vuetable from "./Vuetable.vue";

interface Field {
  name: Component | string
  titleClass?: string;
  sortField?: string;
  title?: string | (()  => string);
}

defineOptions({
  name: "vuetable-row-header",
  components: {
    "vuetable-field-checkbox": VuetableFieldCheckbox,
    "vuetable-field-handle": VuetableFieldHandle,
    "vuetable-field-sequence": VuetableFieldSequence
  }
});

const vuetable = inject("vuetable") as InstanceType<typeof Vuetable>;

defineExpose({
  stripPrefix,
  isInCurrentSortGroup,
  hasSortableIcon,
  currentSortOrderPosition,
  fieldIsInSortOrderPosition
});

function stripPrefix (name: string) {
  return name.replace(vuetable.fieldPrefix, "");
}

function headerClass (base: string, field: Field) {
  return [
    `${ base }-${ toSnakeCase(field.name) }`,
    field.titleClass || "",
    sortClass(field),
    { "sortable": vuetable.isSortable(field) }
  ];
}

function toSnakeCase (str: Field["name"]) {
  return typeof(str) === "string" && str.replace(/([A-Z])/g, (chr) => "_"+chr.toLowerCase())
    .replace(" ", "_")
    .replace(".", "_");
}

function sortClass (field: Field) {
  const index = currentSortOrderPosition(field);
  return index ? (vuetable.sortOrder[index].direction == "asc") ? vuetable.css.ascendingClass : vuetable.css.descendingClass : "";
}

function sortIcon (field: Field) {
  const index = currentSortOrderPosition(field);

  return index ? vuetable.css.sortableIcon : (vuetable.sortOrder[index].direction == "asc") ? vuetable.css.ascendingIcon : vuetable.css.descendingIcon;
}

function isInCurrentSortGroup (field: Field) {
  return !!currentSortOrderPosition(field);
}

function hasSortableIcon (field: Field) {
  return vuetable.isSortable(field) && vuetable.css.sortableIcon != "";
}

function currentSortOrderPosition (field: Field): number {
  if ( !vuetable.isSortable(field)) {
    return 0;
  }

  for (let i = 0; i < vuetable.sortOrder.length; i++) {
    if (fieldIsInSortOrderPosition(field, i)) {
      return i;
    }
  }

  return 0;
}

function fieldIsInSortOrderPosition (field: Field, index: number) {
  return vuetable.sortOrder[index].field === field.name && vuetable.sortOrder[index].sortField === field.sortField;
}

function renderTitle (field: Field) {
  const title = getTitle(field);

  if (title.length > 0 && isInCurrentSortGroup(field) || hasSortableIcon(field)) {
    const style = `opacity:${sortIconOpacity(field)};position:relative;float:right`;
    const iconTag = vuetable.showSortIcons ? renderIconTag(["sort-icon", sortIcon(field)], `style="${style}"`) : "";
    return title + " " + iconTag;
  }

  return title;
}

function getTitle (field: Field) {
  if (typeof field.title === "function") return field.title();

  return typeof field.title === "undefined"
    ? field.name.toString().replace(".", " ")
    : field.title;
}

function sortIconOpacity (field: Field) {
  /*
  * fields with stronger precedence have darker color
  *
  * if there are few fields, we go down by 0.3
  * ex. 2 fields are selected: 1.0, 0.7
  *
  * if there are more we go down evenly on the given spectrum
  * ex. 6 fields are selected: 1.0, 0.86, 0.72, 0.58, 0.44, 0.3
  */
  const max = 1.0;
  const min = 0.3;
  let step = 0.3;

  const count = vuetable.sortOrder.length;
  const current = currentSortOrderPosition(field);

  if (max - count * step < min) {
    step = (max - min) / (count-1);
  }

  return max - current * step;
}

function renderIconTag (classes: string[], options = "") {
  return typeof vuetable.css.renderIcon === "undefined"
    ? `<i class="${classes.join(" ")}" ${options}></i>`
    : vuetable.css.renderIcon(classes, options);
}

function onColumnHeaderClicked (field: Field, event: Event): void {
  vuetable.orderBy(field, event);
}
</script>

<style scoped>

</style>