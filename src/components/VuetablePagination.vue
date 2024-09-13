<template>
  <div v-show="tablePagination && lastPage > firstPage" :class="$_css.wrapperClass">
    <a :class="['btn-nav', $_css.linkClass, isOnFirstPage ? $_css.disabledClass : '']"
       @click="loadPage(firstPage)">
      <i v-if="$_css.icons.first != ''" :class="[$_css.icons.first]">
      </i>
      <span v-else>
        &laquo;
      </span>
    </a>
    <a :class="['btn-nav', $_css.linkClass, isOnFirstPage ? $_css.disabledClass : '']"
       @click="loadPage('prev')">
      <i v-if="$_css.icons.next != ''" :class="[$_css.icons.prev]">
      </i>
      <span v-else>
        &nbsp;&lsaquo;
      </span>
    </a>
    <template v-if="notEnoughPages">
      <template :key="i" v-for="(n, i) in totalPage">
        <a :class="[$_css.pageClass, isCurrentPage(i+firstPage) ? $_css.activeClass : '']"
           v-html="n"
           @click="loadPage(i+firstPage)">
        </a>
      </template>
    </template>
    <template v-else>
      <template :key="i" v-for="(n, i) in windowSize">
        <a :class="[$_css.pageClass, isCurrentPage(windowStart+i+firstPage-1) ? $_css.activeClass : '']"
           v-html="windowStart+n-1"
           @click="loadPage(windowStart+i+firstPage-1)">
        </a>
      </template>
    </template>
    <a :class="['btn-nav', $_css.linkClass, isOnLastPage ? $_css.disabledClass : '']"
       @click="loadPage('next')">
      <i v-if="$_css.icons.next != ''" :class="[$_css.icons.next]">
      </i>
      <span v-else>
        &rsaquo;&nbsp;
      </span>
    </a>
    <a :class="['btn-nav', $_css.linkClass, isOnLastPage ? $_css.disabledClass : '']"
       @click="loadPage(lastPage)">
      <i v-if="$_css.icons.last != ''" :class="[$_css.icons.last]">
      </i>
      <span v-else>
        &raquo;
      </span>
    </a>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, reactive, toRef } from "vue-demi";
import CssSemanticUI from "./VuetableCssSemanticUI.ts";
import { useVuetablePagination } from "./useVuetablePagination.ts";

interface Props {
  css?: { [key: string]: string }
  onEachSide?: number
  firstPage?: number
}

const {
  css = {},
  onEachSide = 2,
  firstPage = 1
} = defineProps<Props>();


const emit = defineEmits<{
  "vuetable-pagination:change-page": [page: string | number]
}>();

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
} = useVuetablePagination(() => onEachSide, () => firstPage);

defineExpose({
  tablePagination,
  $_css,
  totalPage,
  lastPage,
  onEachSide: toRef(() => onEachSide),
  firstPage: toRef(() => firstPage),
  isOnFirstPage,
  isOnLastPage,
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
</script>

<style>
.vuetable-pagination {
  background: #f9fafb !important;
}
</style>