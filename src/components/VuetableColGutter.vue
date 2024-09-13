<template>
  <th
    :style="{ width: vuetable.scrollBarWidth }"
    class="vuetable-th-gutter">
  </th>
</template>

<script setup lang="ts">
import { defineOptions, inject } from "vue-demi";
import type Vuetable from "./Vuetable.vue";

defineOptions({
  name: "vuetable-th-gutter",
});

const vuetable = inject("vuetable") as InstanceType<typeof Vuetable>;
</script>

<style scoped>
.vuetable-th-gutter {
  padding: 0 !important;
  border-left: none  !important;
  border-right: none  !important;
}
</style>