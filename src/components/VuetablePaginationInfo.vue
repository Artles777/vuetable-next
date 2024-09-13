<template>
  <div :class="['vuetable-pagination-info', $_css.infoClass]"
       v-html="paginationInfo">
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, toRef } from "vue-demi";
import { useVuetablePaginationInfo } from "./useVuetablePaginationInfo.ts";
import CssSemanticUI from "./VuetableCssSemanticUI.ts";

interface Props {
  css?: any;
  infoTemplate?: string;
  noDataTemplate?: string;
}


const {
  css = {},
  infoTemplate = "Displaying {from} to {to} of {total} items",
  noDataTemplate = "No relevant data"
} = defineProps<Props>();

const {
  tablePagination,
  paginationInfo,
  setPaginationData,
  resetData
} = useVuetablePaginationInfo(() => noDataTemplate, () => infoTemplate);

const $_css = ref({ ...CssSemanticUI.paginationInfo, ...css });

defineExpose({
  tablePagination,
  $_css,
  infoTemplate: toRef(() => infoTemplate),
  noDataTemplate: toRef(() => noDataTemplate),
  paginationInfo,
  setPaginationData,
  resetData
});

</script>

<style>
  .vuetable-pagination-info {
    margin-top: auto;
    margin-bottom: auto;
  }
</style>