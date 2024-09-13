import { computed, type ComputedGetter, type Ref, ref, toValue } from "vue-demi";

interface TablePagination {
  last_page: number
  current_page: number
  from: number
  to: number
  total: number
}

export function useVuetablePagination (onEachSide: Ref<number> | ComputedGetter<number>, firstPage: Ref<number> | ComputedGetter<number>) {
  const tablePagination = ref<TablePagination | null>(null);

  const lastPage = computed(() => tablePagination.value?.last_page ?? 0);
  const isOnFirstPage = computed(() => tablePagination.value?.current_page === toValue(firstPage));
  const isOnLastPage = computed(() => tablePagination.value?.current_page === lastPage.value);
  const windowSize = computed(() => (toValue(onEachSide) * 2) + 1);
  const totalPage = computed(() =>
    tablePagination.value ? (tablePagination.value.last_page - toValue(firstPage) + 1) : 0);
  const notEnoughPages = computed(() => totalPage.value < (toValue(onEachSide) * 2) + 4);

  const windowStart = computed(() => {
    if (!tablePagination.value || tablePagination.value.current_page <= toValue(onEachSide)) {
      return 1;
    } else if (tablePagination.value.current_page >= (totalPage.value - toValue(onEachSide))) {
      return totalPage.value - toValue(onEachSide) * 2;
    }
    return tablePagination.value.current_page - toValue(onEachSide);
  });

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
    lastPage,
    isOnFirstPage,
    isOnLastPage,
    notEnoughPages,
    windowSize,
    windowStart,
    totalPage,
    setPaginationData,
    resetData,
    isCurrentPage
  };
}