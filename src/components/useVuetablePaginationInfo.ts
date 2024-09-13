import type { ComputedGetter, Ref } from "vue-demi";
import { computed, ref, toValue } from "vue-demi";

interface TablePagination {
  last_page: number
  current_page: number
  from: number
  to: number
  total: number
}

export function useVuetablePaginationInfo (noDataTemplate: Ref<string> | ComputedGetter<string>, infoTemplate: Ref<string> | ComputedGetter<string>) {
  const tablePagination = ref<TablePagination | null>(null);

  const isNoData = computed(() => tablePagination.value == null || tablePagination.value.total == 0);
  const paginationInfo = computed(() => isNoData.value ? toValue(noDataTemplate) : toValue(infoTemplate)
    .replace("{from}", `${ tablePagination.value!.from || 0 }`)
    .replace("{to}", `${ tablePagination.value!.to || 0 }`)
    .replace("{total}", `${ tablePagination.value!.total || 0 }`));
    
  function setPaginationData (value: TablePagination) {
    tablePagination.value = value;
  }

  function resetData () {
    tablePagination.value = null;
  }

  function isCurrentPage (page: number) {
    return page === tablePagination.value?.current_page;
  }

  return {
    tablePagination,
    paginationInfo,
    setPaginationData,
    resetData,
    isCurrentPage
  };
}