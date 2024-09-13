<script lang="ts">
import { defineComponent } from "vue-demi";
import CssSemanticUI from "./VuetableCssSemanticUI";

interface TablePagination {
  from: number;
  to: number;
  total: number;
}

interface Data {
  tablePagination: TablePagination | null
  customCss: Record<string, any>
}

export default defineComponent({
  props: {
    css: {
      type: Object,
      default: () => ({})
    },
    infoTemplate: {
      type: String,
      default: "Displaying {from} to {to} of {total} items"
    },
    noDataTemplate: {
      type: String,
      default: "No relevant data"
    },
  },
  data () {
    return <Data>{
      tablePagination: null,
      customCss: {}
    };
  },
  computed: {
    paginationInfo () {
      if (this.tablePagination == null || this.tablePagination.total === 0) {
        return this.noDataTemplate;
      }

      return this.infoTemplate
        .replace("{from}", `${ this.tablePagination.from || 0 }`)
        .replace("{to}", `${ this.tablePagination.to || 0 }`)
        .replace("{total}", `${ this.tablePagination.total || 0}`);
    },
  },
  created () {
    this.mergeCss();
  },
  methods: {
    mergeCss () {
      this.customCss = {...CssSemanticUI.paginationInfo, ...this.css};
    },
    setPaginationData (tablePagination: TablePagination) {
      this.tablePagination = tablePagination;
    },
    resetData () {
      this.tablePagination = null;
    }
  },
});
</script>