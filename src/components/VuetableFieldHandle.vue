<template>
  <th v-if="isHeader"
      class="vuetable-th-component-handle"
      v-html="title">
  </th>
  <td v-else
      class="vuetable-td-component-handle"
      v-html="renderIconTag(['handle-icon', css.handleIcon])">
  </td>
</template>

<script setup lang="ts">
import { defineOptions, inject, defineProps } from "vue-demi";
import type Vuetable from "./Vuetable.vue";

interface Props {
  isHeader?: boolean
  title?: string
}

defineOptions({
  name: "vuetable-field-handle"
});

const vuetable = inject("vuetable") as InstanceType<typeof Vuetable>;

const {
  isHeader = false,
  title = ""
} = defineProps<Props>();

function renderIconTag (classes: string[], options = "") {
  return typeof(vuetable.css.renderIcon) === "undefined"
    ? `<i class="${classes.join(" ")}" ${options}></i>`
    : vuetable.css.renderIcon(classes, options);
}
</script>

<style scoped>

</style>