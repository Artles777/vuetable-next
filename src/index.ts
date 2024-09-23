import type { App } from "vue-demi";
import Vuetable from "./components/Vuetable.vue";
import VuetableColGutter from "./components/VuetableColGutter.vue";
import VuetableFieldCheckbox from "./components/VuetableFieldCheckbox.vue";
import VuetableFieldHandle from "./components/VuetableFieldHandle.vue";
import VuetableFieldSequence from "./components/VuetableFieldSequence.vue";
import VuetablePagination from "./components/VuetablePagination.vue";
import VuetablePaginationDropdown from "./components/VuetablePaginationDropdown.vue";
import VuetablePaginationInfo from "./components/VuetablePaginationInfo.vue";
import VuetableRowHeader from "./components/VuetableRowHeader.vue";
import VuetableFieldMixin from "./components/VuetableFieldMixin.vue";
import VuetableFieldCheckboxMixin from "./components/VuetableFieldCheckboxMixin.vue";
import VuetablePaginationInfoMixin from "./components/VuetablePaginationInfoMixin.vue";
import VuetablePaginationMixin from "./components/VuetablePaginationMixin.vue";
import Promise from "promise-polyfill";

// @ts-ignore
const rootVariable = (typeof self === "object" && self.self === self && self) || (typeof global === "object" && global) || this;
if (!rootVariable!.Promise) {
  rootVariable!.Promise = Promise;
}

function install (Vue: App) {
  Vue.component("vuetable", Vuetable);
  Vue.component("vuetable-col-gutter", VuetableColGutter);
  Vue.component("vuetable-field-checkbox", VuetableFieldCheckbox);
  Vue.component("vuetable-field-handle", VuetableFieldHandle);
  Vue.component("vuetable-field-sequence", VuetableFieldSequence);
  Vue.component("vuetable-pagination", VuetablePagination);
  Vue.component("vuetable-pagination-dropdown", VuetablePaginationDropdown);
  Vue.component("vuetable-pagination-info", VuetablePaginationInfo);
  Vue.component("vuetable-row-header", VuetableRowHeader);
}

Vuetable.install = install;

export {
  Vuetable,
  // Mixins
  VuetableFieldMixin,
  VuetableFieldCheckboxMixin,
  VuetablePaginationInfoMixin,
  VuetablePaginationMixin,
  // Components
  VuetableColGutter,
  VuetableFieldCheckbox,
  VuetableFieldHandle,
  VuetableFieldSequence,
  VuetablePagination,
  VuetablePaginationDropdown,
  VuetablePaginationInfo,
  VuetableRowHeader,
  // Utils
  install
};

export default Vuetable;
