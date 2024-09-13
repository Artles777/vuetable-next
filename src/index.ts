import { install, createApp } from "vue-demi";
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
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Promise from "promise-polyfill";

// @ts-ignore
const rootVariable = (typeof self === "object" && self.self === self && self) || (typeof global === "object" && global) || this;
if (!rootVariable!.Promise) {
  rootVariable!.Promise = Promise;
}

const app = createApp(Vuetable);

app.component("vuetable", Vuetable);
app.component("vuetable-col-gutter", VuetableColGutter);
app.component("vuetable-field-checkbox", VuetableFieldCheckbox);
app.component("vuetable-field-handle", VuetableFieldHandle);
app.component("vuetable-field-sequence", VuetableFieldSequence);
app.component("vuetable-pagination", VuetablePagination);
app.component("vuetable-pagination-dropdown", VuetablePaginationDropdown);
app.component("vuetable-pagination-info", VuetablePaginationInfo);
app.component("vuetable-row-header", VuetableRowHeader);

install(app);

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
