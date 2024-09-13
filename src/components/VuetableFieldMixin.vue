<script lang="ts">
import { defineComponent } from "vue-demi";

export default defineComponent({
  props: {
    rowData: {
      type: Object,
      default: null
    },
    rowIndex: {
      type: Number
    },
    rowField: {
      type: Object
    },
    isHeader: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    vuetable: {
      type: Object,
      default: null
    }
  }
});
</script>