<template>
  <div :class="[$_css.wrapperClass]">
    <a :class="[$_css.linkClass, {[$_css.disabledClass] : isOnFirstPage}]"
       @click="loadPage('prev')">
      <i :class="$_css.icons.prev">
      </i>
    </a>
    <select :class="['vuetable-pagination-dropdown', $_css.dropdownClass]" @change="loadPage(($event.target as any).selectedIndex + firstPage)">
      <option :key="n" v-for="(n, i) in totalPage" :class="[$_css.pageClass]" :value="i+firstPage" :selected="isCurrentPage(i+firstPage)">
        {{pageText}} {{n}}
      </option>
    </select>
    <a :class="[$_css.linkClass, {[$_css.disabledClass] : isOnLastPage}]"
       @click="loadPage('next')">
      <i :class="$_css.icons.next">
      </i>
    </a>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, reactive } from "vue-demi";
import mitt from "mitt";
import CssSemanticUI from "./VuetableCssSemanticUI.ts";
import { useVuetablePagination } from "./useVuetablePagination.ts";

interface Props {
  css: { [key: string]: string }
  pageText?: string;
  onEachSide: number
  firstPage: number
}

const {
  css = {},
  pageText = "Page",
  onEachSide = 2,
  firstPage = 1
} = defineProps<Props>();

const emitter = mitt();

const emit = defineEmits(["vuetable-pagination:change-page"]);

const $_css = reactive({ ...CssSemanticUI.pagination, ...css });

const {
  tablePagination,
  totalPage,
  lastPage,
  isOnFirstPage,
  isOnLastPage,
  notEnoughPages,
  windowSize,
  windowStart,
  isCurrentPage,
  setPaginationData,
  resetData
} = useVuetablePagination(onEachSide, firstPage);

defineExpose({
  tablePagination,
  $_css,
  firstPage,
  lastPage,
  onEachSide,
  pageText,
  notEnoughPages,
  windowSize,
  windowStart,
  loadPage,
  isCurrentPage,
  setPaginationData,
  resetData
});

function loadPage (page: string | number) {
  emit("vuetable-pagination:change-page", page);
}

emitter.on("vuetable:pagination-data", tablePagination => {
  setPaginationData(tablePagination as any);
});
</script>

<style scoped>

</style>