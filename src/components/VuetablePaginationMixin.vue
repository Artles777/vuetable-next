<script lang="ts">
import CssSemanticUI from "./VuetableCssSemanticUI";
import { defineComponent } from "vue-demi";

interface TablePagination {
  current_page: number;
  last_page: number;
}

interface Data {
  eventPrefix: string
  tablePagination: TablePagination | null
  customCss: Record<string, any>
}

export default defineComponent({
  emits: [
    "vuetable-pagination:change-page",
  ],
  props: {
    css: {
      type: Object,
      default () {
        return {};
      }
    },
    onEachSide: {
      type: Number,
      default () {
        return 2;
      }
    },
    firstPage: {
      type: Number,
      default: 1
    }
  },

  data () {
    return <Data>{
      eventPrefix: "vuetable-pagination:",
      tablePagination: null,
      customCss: {}
    };
  },

  created () {
    this.mergeCss();
  },

  computed: {
    totalPage () {
      return this.tablePagination === null
        ? 0
        : this.tablePagination.last_page - this.firstPage + 1;
    },
    lastPage () {
      return this.tablePagination === null
        ? 0
        : this.tablePagination.last_page;
    },
    isOnFirstPage () {
      return this.tablePagination === null
        ? false
        : this.tablePagination.current_page === this.firstPage;
    },
    isOnLastPage () {
      return this.tablePagination === null
        ? false
        : this.tablePagination.current_page === this.lastPage;
    },
    notEnoughPages () {
      return this.totalPage < (this.onEachSide * 2) + 4;
    },
    windowSize () {
      return this.onEachSide * 2 +1;
    },
    windowStart () {
      if (!this.tablePagination || this.tablePagination.current_page <= this.onEachSide) {
        return 1;
      } else if (this.tablePagination.current_page >= (this.totalPage - this.onEachSide)) {
        return this.totalPage - this.onEachSide * 2;
      }

      return this.tablePagination.current_page - this.onEachSide;
    },
  },

  methods: {
    mergeCss () {
      this.customCss = { ...CssSemanticUI.pagination, ...this.css };
    },
    loadPage (page: number) {
      this.$emit("vuetable-pagination:change-page", page);
    },
    isCurrentPage (page: number) {
      return page === this.tablePagination!.current_page;
    },
    setPaginationData (tablePagination: TablePagination) {
      this.tablePagination = tablePagination;
    },
    resetData () {
      this.tablePagination = null;
    }
  }
});
</script>