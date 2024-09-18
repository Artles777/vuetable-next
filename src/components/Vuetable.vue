<template>
  <div :class="$_css.tableWrapper">
    <div
      v-if="isFixedHeader"
      class="vuetable-head-wrapper">
      <table :class="['vuetable', $_css.tableClass, $_css.tableHeaderClass]">
        <vuetable-col-group is-header>
        </vuetable-col-group>
        <thead>
          <slot
            :fields="tableFields"
            name="tableHeader">
            <template
              :key="headerIndex"
              v-for="(header, headerIndex) in headerRows">
              <component
                :is="header"
                :index="headerIndex"
                @vuetable:header-event="onHeaderEvent">
              </component>
            </template>
          </slot>
        </thead>
      </table>
    </div>

    <div
      :class="{'fixed-header' : isFixedHeader}"
      :style="{ height: tableHeight! }"
      class="vuetable-body-wrapper">
      <table :class="['vuetable', isFixedHeader ? 'fixed-header' : '', $_css.tableClass, $_css.tableBodyClass]">
        <vuetable-col-group>
        </vuetable-col-group>
        <thead v-if="!isFixedHeader">
          <slot
            :fields="tableFields"
            name="tableHeader">
            <template :key="headerIndex" v-for="(header, headerIndex) in headerRows">
              <component
                :is="header"
                :index="headerIndex"
                @vuetable:header-event="onHeaderEvent">
              </component>
            </template>
          </slot>
        </thead>
        <tfoot>
          <slot
            :fields="tableFields"
            name="tableFooter">
          </slot>
        </tfoot>
        <tbody
          v-cloak
          class="vuetable-body">
          <template
            :key="itemIndex"
            v-for="(item, itemIndex) in tableData">
            <tr
              :item-index="itemIndex"
              :class="onRowClass(item, itemIndex)"
              @click="onRowClicked(item, itemIndex, $event)"
              @dblclick="onRowDoubleClicked(item, itemIndex, $event)"
              @mouseover="onMouseOver(item, itemIndex, $event)">
              <template v-for="(field, fieldIndex) in tableFields">
                <template v-if="field.visible">
                  <template v-if="isFieldComponent(field.name)">
                    <component
                      :is="field.name"
                      :key="fieldIndex"
                      :row-data="item"
                      :row-index="itemIndex"
                      :row-field="field"
                      :class="bodyClass('vuetable-component', field)"
                      :style="{ width: field.width }"
                      @vuetable:field-event="onFieldEvent">
                    </component>
                  </template>
                  <template v-else-if="isFieldSlot(field.name)">
                    <td
                      :key="fieldIndex"
                      :class="bodyClass('vuetable-slot', field)"
                      :style="{ width: field.width! }">
                      <slot
                        :name="field.name"
                        :row-data="item" :row-index="itemIndex" :row-field="field">
                      </slot>
                    </td>
                  </template>
                  <template v-else>
                    <td
                      :key="fieldIndex"
                      :class="bodyClass('vuetable-td-'+field.name, field)"
                      :style="{ width: field.width! }"
                      v-html="renderNormalField(field, item)"
                      @click="onCellClicked(item, itemIndex, field, $event)"
                      @dblclick="onCellDoubleClicked(item, itemIndex, field, $event)"
                      @contextmenu="onCellRightClicked(item, itemIndex, field, $event)">
                    </td>
                  </template>
                </template>
              </template>
            </tr>
            <template v-if="useDetailRow">
              <transition
                :key="itemIndex"
                :name="detailRowTransition">
                <tr
                  v-if="isVisibleDetailRow(item[trackBy])"
                  :class="onDetailRowClass(item, itemIndex)"
                  @click="onDetailRowClick(item, itemIndex, $event)">
                  <td :colspan="countVisibleFields">
                    <component
                      :is="detailRowComponent"
                      :row-data="item"
                      :row-index="itemIndex"
                      :options="detailRowOptions">
                    </component>
                  </td>
                </tr>
              </transition>
            </template>
          </template>
          <template v-if="displayEmptyDataRow">
            <tr>
              <td
                :colspan="countVisibleFields"
                class="vuetable-empty-result"
                v-html="noDataTemplate">
              </td>
            </tr>
          </template>
          <template v-if="lessThanMinRows">
            <tr
              :key="i"
              v-for="i in blankRows"
              class="blank-row">
              <template v-for="(field, fieldIndex) in tableFields">
                <td v-if="field.visible" :key="fieldIndex">
              &nbsp;
                </td>
              </template>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AxiosPromise, AxiosResponse } from "axios";
import axios from "axios";
import VuetableRowHeader from "./VuetableRowHeader.vue";
import VuetableColGroup from "./VuetableColGroup.vue";
import CssSemanticUI from "./VuetableCssSemanticUI";
import {
  defineProps,
  defineSlots,
  defineEmits,
  defineExpose,
  defineOptions,
  ref,
  reactive,
  computed,
  getCurrentInstance,
  nextTick,
  onMounted,
  onUnmounted,
  watch,
  provide, toRefs
} from "vue-demi";
import type { ComponentPublicInstance, DefineComponent } from "vue-demi";
import { unref } from "vue";

type SortOrder = { field: string; sortField: string; direction: "asc" | "desc"; };

interface Props {
  fields: any[]
  loadOnStart?: boolean
  apiUrl?: string
  httpMethod?: "get" | "post"
  reactiveApiUrl?: boolean
  apiMode?: boolean
  data?: any | null
  dataManager?: ((sortOrder: SortOrder[], pagination: { [key: string]: any }) => any[]) | null
  dataPath?: string
  paginationPath?: string
  queryParams?: { [key: string]: string | number } | ((sortOrder: string, currentPage: number, perPage: number) => { [key: string]: string | number } | string | number)
  appendParams?: { [key: string]: string | number }
  httpOptions?: Record<string, unknown>
  httpFetch?: ((apiUrl: string, httpOptions: Record<string, unknown>) => AxiosResponse) | null
  perPage?: number
  initialPage?: number /** Page that should be displayed when the table is first displayed */
  firstPage?: number /** First page number. Set this prop to 0 for zero based pagination */
  sortOrder?: SortOrder[] | string
  multiSort?: boolean
  tableHeight?: string | null
  /*
   * physical key that will trigger multi-sort option
   * possible values: 'alt', 'ctrl', 'meta', 'shift'
   * 'ctrl' might not work as expected on Mac
   */
  multiSortKey?: "alt" | "ctrl" | "meta"| "shift"
  rowClass?: string | ((...args: any[]) => string | string[] | { [key: string]: boolean })
  detailRowComponent?: string | { [key: string]: any }
  detailRowTransition?: string
  detailRowClass?: string | ((...args: any[]) => any)
  detailRowOptions?: { [key: string]: any }
  trackBy?: string
  css?: { [key: string]: any }
  minRows?: number
  silent?: boolean
  noDataTemplate?: string
  showSortIcons?: boolean
  headerRows?: string[]
  transform?: ((response: AxiosResponse) => any) | null
  sortParams?: ((sortOrder: string | SortOrder[]) => string) | null
  fieldPrefix?: string
}

interface Field {
  name: string | DefineComponent
  sortField: string | null
  title: string | ((str?: any) => string)
  titleClass: string
  dataClass: string
  formatter: (<T>(...args: any[]) => T) | null
  visible: boolean
  width: string | null
  $_index: number
  [key: string]: unknown
}

interface Pagination {
  first_page: number
  last_page: number
  current_page: number
}

const {
  fields,
  loadOnStart = true,
  apiUrl = "",
  httpMethod = "get",
  reactiveApiUrl = true,
  apiMode = true,
  data = null,
  dataManager = null,
  dataPath = "data",
  paginationPath = "links.pagination",
  queryParams = {
    sort: "sort",
    page: "page",
    perPage: "per_page"
  },
  appendParams = {},
  httpOptions = {},
  httpFetch = null,
  perPage = 10,
  initialPage = 1,
  firstPage = 1,
  sortOrder = [],
  multiSort = false,
  tableHeight = null,
  multiSortKey = "alt",
  rowClass = "",
  detailRowComponent = "",
  detailRowTransition = "",
  detailRowClass = "vuetable-detail-row",
  detailRowOptions = {},
  trackBy = "id",
  css = {},
  minRows = 0,
  silent = false,
  noDataTemplate = "No Data Available",
  headerRows = ["VuetableRowHeader"],
  transform = null,
  sortParams = null,
  fieldPrefix = "vuetable-field-",
  showSortIcons = true
} = defineProps<Props>();

const emit = defineEmits<{
  "vuetable:load-error": [response?: AxiosResponse],
  "vuetable:load-success": [response?: AxiosResponse],
  "vuetable:loaded": [],
  "vuetable:loading": [],
  "vuetable:scrollbar-visible": [visible: boolean],
  "vuetable:pagination-data": [tablePagination: Pagination | null],
  "vuetable:row-clicked": [args: { data: any; index: number; event: Event }],
  "vuetable:row-dblclicked": [args: { data: any; index: number; event: Event }],
  "vuetable:detail-row-clicked": [args: { data: any; index: number; event: Event }],
  "vuetable:cell-clicked": [args: { data: any; index: number; field: Field; event: Event }],
  "vuetable:cell-dblclicked": [args: { data: any; index: number; field: Field; event: Event }],
  "vuetable:cell-rightclicked": [args: { data: any; index: number; field: Field; event: Event }],
  "vuetable:row-mouseover": [args: { data: any; index: number; event: Event }],
  "vuetable:field-event": [type: string, payload: any, app?: ComponentPublicInstance | null],
  "vuetable:header-event": [type: string, payload: any, app?: ComponentPublicInstance | null],
  "vuetable:checkbox-toggled": [isChecked: boolean, fieldName: string],
  "vuetable:checkbox-toggled-all": [isChecked: boolean],
  "vuetable:data-reset": [],
  "vuetable:initialized": [tableFields: Field[]]
}>();

const slots = defineSlots();

defineOptions({
  name: "Vuetable",
  components: {
    VuetableRowHeader,
    VuetableColGroup,
  }
});

const app = getCurrentInstance();

const tableFields = ref<Field[]>([]);
const tableData = ref<any[] | null>(null);
const tablePagination = ref<Pagination | null>(null);
const currentPage = ref(initialPage);
const selectedTo = ref<string[]>([]);
const visibleDetailRows = ref<any[]>([]);
const lastScrollPosition = ref(0);
const scrollBarWidth = ref("17px");
const scrollVisible = ref(false);
const order = ref<SortOrder[]>(sortOrder as SortOrder[]);
const optionsHttp = ref<Record<string, unknown>>(httpOptions);
const instanceFetch = ref<Promise<AxiosResponse>>();

const $_css = reactive({ ...CssSemanticUI.table, ...css });

const dataIsAvailable = computed(() => !tableData.value?.length ? false : tableData.value?.length > 0);
const useDetailRow = computed(() => dataIsAvailable.value && detailRowComponent !== "");
const hasRowIdentifier = computed(() => tableData.value && typeof tableData.value[0][trackBy] !== "undefined");
const countVisibleFields = computed(() => tableFields.value.filter(field => field.visible).length);
const countTableData = computed(() => tableData.value?.length || 0);
const displayEmptyDataRow = computed(() => countTableData.value === 0 && noDataTemplate.length > 0);

const emptyDataTable = computed(() => tableData.value === null || tableData.value?.length === 0);
const lessThanMinRows = computed(() => emptyDataTable.value ? true : tableData.value!.length < minRows);
const blankRows = computed(() =>  emptyDataTable.value ? minRows : tableData.value!.length >= minRows ? 0 : minRows - tableData.value!.length);

const isApiMode = computed(() => apiMode);
const isDataMode = computed(() => !apiMode);
const isFixedHeader = computed(() => tableHeight != null);
const vuetable = computed(() => app?.proxy);

normalizeFields();
normalizeSortOrder();

nextTick( () => {
  emit("vuetable:initialized", tableFields.value);
});

onMounted(() => {
  if (loadOnStart) {
    loadData();
  }

  if (isFixedHeader) {
    scrollBarWidth.value = getScrollBarWidth() + "px";

    let elem = app?.proxy?.$el.getElementsByClassName("vuetable-body-wrapper")[0];
    if (elem != null) {
      elem.addEventListener("scroll", handleScroll);
    }
  }
});

onUnmounted(() => {
  let elem = app?.proxy?.$el.getElementsByClassName("vuetable-body-wrapper")[0];
  if (elem != null) {
    elem.removeEventListener("scroll", handleScroll);
  }
});

defineExpose({
  apiUrl,
  isApiMode,
  tableFields,
  tableData,
  tablePagination,
  fieldPrefix,
  countVisibleFields,
  dataIsAvailable,
  countTableData,
  displayEmptyDataRow,
  useDetailRow,
  hasRowIdentifier,
  lessThanMinRows,
  blankRows,
  scrollVisible,
  scrollBarWidth,
  trackBy,
  showSortIcons,
  instanceFetch,
  setData,
  getFieldTitle,
  orderBy,
  camelCase,
  clearSortOrder,
  toggleDetailRow,
  clearSelectedValues,
  showField,
  hideField,
  toggleField,
  onCheckboxToggled,
  onCheckboxToggledAll,
  checkIfRowIdentifierExists,
  changePage,
  resetData,
  refresh,
  isFieldComponent,
  makeTitle,
  getAllQueryParams,
  isSortable,
  getDefaultSortParam,
  getObjectValue,
  isSelectedRow,
  loadData
});

provide("vuetable", {
  isApiMode,
  fieldPrefix,
  tableFields: unref(tableFields),
  tableData: unref(tableData),
  tablePagination: unref(tablePagination),
  countVisibleFields: unref(countVisibleFields),
  dataIsAvailable: unref(dataIsAvailable),
  countTableData: unref(countTableData),
  displayEmptyDataRow: unref(displayEmptyDataRow),
  useDetailRow: unref(useDetailRow),
  hasRowIdentifier: unref(hasRowIdentifier),
  lessThanMinRows: unref(lessThanMinRows),
  blankRows: unref(blankRows),
  scrollVisible: unref(scrollVisible),
  scrollBarWidth: unref(scrollBarWidth),
  sortOrder,
  trackBy,
  perPage,
  showSortIcons,
  css: toRefs($_css),
  isFieldSlot,
  setData,
  getFieldTitle,
  orderBy,
  camelCase,
  clearSortOrder,
  toggleDetailRow,
  clearSelectedValues,
  showField,
  hideField,
  toggleField,
  onCheckboxToggled,
  onCheckboxToggledAll,
  checkIfRowIdentifierExists,
  changePage,
  resetData,
  refresh,
  isFieldComponent,
  makeTitle,
  getAllQueryParams,
  isSortable,
  getDefaultSortParam,
  getObjectValue,
  isSelectedRow
});

function getScrollBarWidth () {
  const outer = document.createElement("div");
  const inner = document.createElement("div");

  outer.style.visibility = "hidden";
  outer.style.width = "100px";

  inner.style.width = "100%";

  outer.appendChild(inner);
  document.body.appendChild(outer);

  const widthWithoutScrollbar = outer.offsetWidth;
  outer.style.overflow = "scroll";
  const widthWithScrollbar = inner.offsetWidth;
  document.body.removeChild(outer);

  return (widthWithoutScrollbar - widthWithScrollbar);
}

//make sure that the header and the body are aligned when scrolling horizontally on a table that is wider than the viewport
function handleScroll (e: { currentTarget: HTMLElement }) {
  const horizontal = e.currentTarget?.scrollLeft;

  //don't modify header scroll if we are scrolling vertically
  if (horizontal != lastScrollPosition.value) {
    let header = vuetable.value?.$el.getElementsByClassName("vuetable-head-wrapper")[0];
    if (header != null) {
      header.scrollLeft = horizontal;
    }
    lastScrollPosition.value = horizontal;
  }
}

function warn (msg: string) {
  if (!silent) {
    console.warn(msg);
  }
}

function bodyClass (base: string, field: Field): string[] {
  return [ base, field.dataClass ];
}

function normalizeFields () {
  if (typeof fields === "undefined") {
    warn("You need to provide \"fields\" prop.");
    return;
  }

  tableFields.value = [];

  fields.forEach( (field, i) => {
    tableFields.value.push(newField(field, i));
  });
}

function newField (field: Field | string, index: number): Field {
  const defaultField = {
    name: "",
    // title:
    // this allow the code to detect undefined title
    // and replace it with capitalized name instead
    titleClass: "",
    dataClass: "",
    sortField: null,
    formatter: null,
    visible: true,
    width: null,
    $_index: index,
  };

  if (typeof field === "string") {
    return {
      ...defaultField,
      name: normalizeFieldName(field),
      title: makeTitle(field)
    };
  }

  const obj = Object.assign({}, defaultField, field) as Field;
  obj.name = normalizeFieldName(obj.name);
  if (obj.title === undefined) {
    obj.title = makeTitle(obj.name as string);
  }
  if (obj.formatter !== null && typeof obj.formatter !== "function") {
    console.error(obj.name + " field formatter must be a function");
    obj.formatter = null;
  }
  return obj;
}

function normalizeFieldName (fieldName: string | DefineComponent) {
  if (fieldName instanceof Object) {
    return fieldName;
  }

  return fieldName.replace("__", fieldPrefix);
}

function setData (data: any | null) {
  if (data === null || typeof(data) === "undefined") return;

  emit("vuetable:loading");

  if (Array.isArray(data)) {
    tableData.value = data;
    emit("vuetable:loaded");
    return;
  }

  tableData.value = getObjectValue(data, dataPath, null);
  tablePagination.value = getObjectValue(data, paginationPath, null);

  nextTick( () => {
    checkIfRowIdentifierExists();
    updateHeader();
    emit("vuetable:pagination-data", tablePagination.value);
    emit("vuetable:loaded");
  });
}

function checkIfRowIdentifierExists () {
  if (!dataIsAvailable.value) {
    return;
  }

  if (!hasRowIdentifier.value) {
    warn("Invalid your data! Use \"track-by\" prop to specify.");
    return false;
  }

  return true;
}

function makeTitle (str: string | DefineComponent) {
  return isFieldComponent(str) ? "" : titleCase(str.replace(".", " "));
}

function getFieldTitle (field: Field): string {
  if (typeof field.title === "function") {
    return field.title();
  }

  return field.title;
}

function renderNormalField (field: Field, item: any) {
  return hasFormatter(field) ? callFormatter(field, item) : getObjectValue(item, field.name, "");
}

function isFieldComponent (fieldName: any) {
  if (fieldName instanceof Object) {
    // let's assume it is a Vue component
    return true;
  }

  return fieldName.slice(0, fieldPrefix.length) === fieldPrefix || fieldName.slice(0, 2) === "__";
}

function isFieldSlot (fieldName: string) {
  return typeof slots[fieldName] !== "undefined";
}

function titleCase (str: string) {
  return str.replace(/\w+/g, txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
}

function camelCase (str: string, delimiter = "_") {
  return str.split(delimiter).map(item => titleCase(item)).join("");
}

function loadData (success = loadSuccess, failed = loadFailed) {
  if (isDataMode.value) {
    handleDataMode();
    return;
  }

  emit("vuetable:loading");

  optionsHttp.value["params"] = getAppendParams(getAllQueryParams());

  instanceFetch.value = fetch(apiUrl, optionsHttp.value);

  return instanceFetch.value.then(
    success,
    failed
  ).catch(() => failed());
}

async function fetch (apiUrl: string, httpOptions: Record<string, unknown>): Promise<AxiosResponse> {
  if (httpFetch) {
    return httpFetch(apiUrl, httpOptions);
  }
  if (httpMethod === "get") {
    return axios.get(apiUrl, httpOptions);
  }
  else { // Is a POST request
    const params = await optionsHttp.value.params;
    delete httpOptions.params;
    delete optionsHttp.value.params;
    return axios.post(apiUrl, params, optionsHttp.value);
  }
}

function loadSuccess (response: AxiosResponse) {
  emit("vuetable:load-success", response);

  const body = transform ? transform(response!.data) : response!.data;

  tableData.value = getObjectValue(body, dataPath, null);
  tablePagination.value = getObjectValue(body, paginationPath, null);

  if (tablePagination.value === null) {
    warn(`vuetable: pagination-path ${ paginationPath } not found.
        It looks like the data returned from the server does not have pagination information
        or you may have set it incorrectly.\n
        You can explicitly suppress this warning by setting pagination-path="".`);
  }

  nextTick( () => {
    checkIfRowIdentifierExists();
    updateHeader();
    emit("vuetable:pagination-data", tablePagination.value);
    emit("vuetable:loaded");
  });
}

function updateHeader () {
  // nextTick doesn't seem to work in all cases. This might be because
  // nextTick is finished before the transition element (just my guess)
  //
  // the scrollHeight value does not yet changed, causing scrollVisible
  // to remain "true", therefore, the header gutter never gets updated
  // to reflect the display of scrollbar in the table body.
  // setTimeout 80ms seems to work in this case.
  setTimeout(checkScrollbarVisibility, 80);
}

function checkScrollbarVisibility () {
  nextTick( () => {
    let elem = vuetable.value?.$el.getElementsByClassName("vuetable-body-wrapper")[0];
    if (elem != null) {
      scrollVisible.value = (elem.scrollHeight > elem.clientHeight);
      emit("vuetable:scrollbar-visible", scrollVisible.value);
    }
  });
}

function loadFailed (response?: AxiosResponse) {
  console.error("load-error", response);
  emit("vuetable:load-error", response);
  emit("vuetable:loaded");
}

function getAllQueryParams () {
  let params: Record<string, string | number> | string | number = {};

  if (typeof queryParams === "function") {
    params = queryParams(order.value, currentPage.value, perPage);
    return typeof params === "object" ? params : {};
  }

  params[queryParams.sort] = getSortParam();
  params[queryParams.page] = currentPage.value;
  params[queryParams.perPage] = perPage;

  return params;
}

function getSortParam () {
  if (!order.value || order.value[0]?.field == "") {
    return "";
  }

  if (typeof sortParams === "function") {
    return sortParams(order.value);
  }

  return getDefaultSortParam();
}

function getDefaultSortParam () {
  return order.value.map(item => `${item.sortField}|${item.direction}`).join(",");
}

function getAppendParams (params: Record<string, string | number>) {
  for (let x in appendParams) {
    params[x] = appendParams[x];
  }

  return params;
}

function isSortable (field: Field) {
  return field.sortField !== null;
}

function currentSortOrderPosition (field: Field) {
  if (!isSortable(field)) {
    return false;
  }

  for (let i = 0; i < order.value.length; i++) {
    if (fieldIsInSortOrderPosition(field, i)) {
      return i;
    }
  }

  return false;
}

function fieldIsInSortOrderPosition (field: Field, i: number) {
  return order.value[i].field === field.name && order.value[i].sortField === field.sortField;
}

function orderBy (field: Field, event: Event & { [key: string]: string }) {
  if (!isSortable(field) ) return;

  const key = multiSortKey.toLowerCase() + "Key";

  if (multiSort && event[key]) { //adding column to multisort
    multiColumnSort(field);
  } else {
    //no multisort, or resetting sort
    singleColumnSort(field);
  }

  currentPage.value = firstPage;    // reset page index
  if (isApiMode.value || dataManager) {
    loadData();
  }
}

function addSortColumn (field: Field, direction?: "asc" | "desc") {
  order.value.push({
    field: field.name as string,
    sortField: field.sortField!,
    direction: direction || "asc"
  });
}

function removeSortColumn (index: number) {
  order.value.splice(index, 1);
}

function setSortColumnDirection (index: number, direction: "asc" | "desc") {
  order.value[index].direction = direction;
}

function multiColumnSort (field: Field) {
  let i = currentSortOrderPosition(field);

  if (i === false) { //this field is not in the sort array yet
    addSortColumn(field, "asc");
  } else { //this field is in the sort array, now we change its state
    if (order.value[i].direction === "asc") {
      // switch direction
      setSortColumnDirection(i, "desc");
    } else {
      removeSortColumn(i);
    }
  }
}

function singleColumnSort (field: Field) {
  if (sortOrder.length === 0) {
    // this.clearSortOrder()
    addSortColumn(field, "asc");
    return;
  }

  order.value.splice(1); //removes additional columns

  if (fieldIsInSortOrderPosition(field, 0)) {
    // change sort direction
    order.value[0].direction = sortOrder[0].direction === "asc" ? "desc" : "asc";
  } else {
    // reset sort direction
    order.value[0].direction = "asc";
  }
  order.value[0].field = field.name as string;
  order.value[0].sortField = field.sortField!;
}

function clearSortOrder () {
  order.value = [];
}

function hasFormatter (item: Field) {
  return typeof item.formatter === "function";
}

function callFormatter (field: Field, item: any) {
  if (!hasFormatter(field)) return;

  if (typeof(field.formatter) === "function") {
    return field.formatter(getObjectValue(item, field.name), app?.proxy);
  }
}

function getObjectValue (object: any, path: string | DefineComponent, defaultValue?: any) {
  defaultValue = (typeof defaultValue === "undefined") ? null : defaultValue;

  let obj = object;
  if (path.trim() != "") {
    let keys = path.split(".");
    keys.forEach( (key: string) => {
      if (obj !== null && typeof obj[key] !== "undefined" && obj[key] !== null) {
        obj = obj[key];
      } else {
        obj = defaultValue;
        return;
      }
    });
  }
  return obj;
}

function selectId (key: string) {
  if (!isSelectedRow(key)) {
    selectedTo.value.push(key);
  }
}

function unselectId (key: string) {
  selectedTo.value = selectedTo.value.filter(item => {
    return item !== key;
  });
}

function isSelectedRow (key: string) {
  return selectedTo.value.indexOf(key) >= 0;
}

function clearSelectedValues () {
  selectedTo.value = [];
}

function gotoPreviousPage () {
  if (currentPage.value > firstPage) {
    currentPage.value -= 1;
    loadData();
  }
}

function gotoNextPage () {
  if (currentPage.value < tablePagination.value!.last_page) {
    currentPage.value += 1;
    loadData();
  }
}

function gotoPage (page: number) {
  if (page != currentPage.value && (page >= firstPage && page <= tablePagination.value!.last_page)) {
    currentPage.value = page;
    loadData();
  }
}

function isVisibleDetailRow (rowId: string) {
  return visibleDetailRows.value.indexOf(rowId) >= 0;
}

function showDetailRow (rowId: string) {
  if (!isVisibleDetailRow(rowId)) {
    visibleDetailRows.value.push(rowId);
  }
  checkScrollbarVisibility();
}

function hideDetailRow (rowId: string) {
  if (isVisibleDetailRow(rowId)) {
    visibleDetailRows.value.splice(
      visibleDetailRows.value.indexOf(rowId),
      1
    );
    updateHeader();
  }
}

function toggleDetailRow (rowId: string) {
  if (isVisibleDetailRow(rowId)) {
    hideDetailRow(rowId);
  } else {
    showDetailRow(rowId);
  }
}

function showField (index: number) {
  if (index < 0 || index > tableFields.value.length) return;

  tableFields.value[index].visible = true;
}

function hideField (index: number) {
  if (index < 0 || index > tableFields.value.length) return;

  tableFields.value[index].visible = false;
}

function toggleField (index: number) {
  if (index < 0 || index > tableFields.value.length) return;

  tableFields.value[index].visible = !tableFields.value[index].visible;
}

function makePagination (total: number | null = null, per_page: number | null = null, current_page: number | null = null) {
  total = total === null ? 0 : total;
  per_page = per_page === null ? perPage : per_page;
  current_page = current_page === null ? currentPage.value : current_page;

  return {
    "total": total,
    "per_page": perPage,
    "current_page": currentPage.value,
    "last_page": Math.ceil(total / perPage) || 0,
    "next_page_url": "",
    "prev_page_url": "",
    "from": (current_page -1) * per_page +1,
    "to": Math.min(current_page * per_page, total)
  };
}

function normalizeSortOrder () {
  order.value.forEach(item => {
    item.sortField = item.sortField || item.field;
  });
}

function handleDataMode () {
  // data is array
  if (data !== null && Array.isArray(data)) {
    setData(data);
    return;
  }

  // data must be an object, check if dataManager is present
  if (dataManager) {
    callDataManager();
  } else {
    setData(data);
  }
}

function callDataManager () {
  const result = dataManager!(order.value, makePagination()) as any;

  if (isPromiseObject(result)) {
    result.then((data: any[]) => setData(data));
  } else {
    setData(result);
  }
}

function isObject (unknown: AxiosPromise) {
  return typeof unknown === "object" && unknown !== null;
}

function isPromiseObject (unknown: any) {
  return isObject(unknown) && typeof(unknown.then) === "function";
}

function onRowClass (dataItem: any, index: number) {
  if (typeof rowClass === "function") {
    return rowClass(dataItem, index);
  }

  return rowClass;
}

function onDetailRowClass (dataItem: any, index: number): string {
  if (typeof(detailRowClass) === "function") {
    return detailRowClass(dataItem, index);
  }

  return detailRowClass;
}

function onRowClicked (data: any, index: number, event: Event) {
  emit("vuetable:row-clicked", { data, index, event });
  return true;
}

function onRowDoubleClicked (data: any, index: number, event: Event) {
  emit("vuetable:row-dblclicked", { data, index, event });
}

function onDetailRowClick (data: any, index: number, event: Event) {
  emit("vuetable:detail-row-clicked", { data, index, event });
}

function onCellClicked (data: any, index: number, field: Field, event: Event) {
  emit("vuetable:cell-clicked", { data, index, field, event });
}

function onCellDoubleClicked (data: any, index: number, field: Field, event: Event) {
  emit("vuetable:cell-dblclicked", { data, index, field, event });
}

function onCellRightClicked (data: any, index: number, field: Field, event: Event) {
  emit("vuetable:cell-rightclicked", { data, index, field, event });
}

function onMouseOver (data: any, index: number, event: Event) {
  emit("vuetable:row-mouseover", { data, index, event });
}

function onFieldEvent (type: string, payload: any) {
  emit("vuetable:field-event", type, payload, app?.proxy);
}

function onHeaderEvent (type: string, payload: any) {
  emit("vuetable:header-event", type, payload, app?.proxy);
}

function onCheckboxToggled (isChecked: boolean, fieldName: string, dataItem: any) {
  if (dataItem[trackBy] === undefined) {
    warn(`checkbox field: The "${ trackBy }" field does not exist! Make sure the field you specify in "track-by" prop does exist.`);
    return;
  }

  const key = dataItem[trackBy];
  if (isChecked) {
    selectId(key);
  } else {
    unselectId(key);
  }

  emit("vuetable:checkbox-toggled", isChecked, fieldName);
}

function onCheckboxToggledAll (isChecked: boolean) {
  if (isChecked) {
    tableData.value?.forEach( (dataItem) => {
      selectId(dataItem[trackBy]);
    });
  } else {
    tableData.value?.forEach( (dataItem) => {
      unselectId(dataItem[trackBy]);
    });
  }

  emit("vuetable:checkbox-toggled-all", isChecked);
}

/*
 * API for externals
 */
function changePage (page: string | number) {
  if (page === "prev") {
    gotoPreviousPage();
  } else if (page === "next") {
    gotoNextPage();
  } else {
    gotoPage(page as number);
  }
}

function reload () {
  return loadData();
}

function refresh () {
  currentPage.value = firstPage;
  return loadData();
}

function resetData () {
  tableData.value = null;
  tablePagination.value = null;
  emit("vuetable:data-reset");
}

watch(() => multiSort, value => {
  if (!value && order.value.length > 1) {
    order.value.splice(1);
    loadData();
  }
});

watch(() => apiUrl, (newValue, oldValue) => reactiveApiUrl && newValue !== oldValue && refresh());
watch(() => data, setData, { immediate: true });
watch(() => tableHeight, checkScrollbarVisibility);
watch(() => fields, normalizeFields, { immediate: true });
watch(() => perPage, reload);

// No mutation props
watch(() => sortOrder, value => {
  order.value = value;
}, { immediate: true });
watch(() => httpOptions, value => {
  optionsHttp.value = value;
}, { immediate: true });
</script>

<style>
  [v-cloak] {
    display: none;
  }
  table.vuetable.fixed-header {
    table-layout: fixed;
  }
  .vuetable th.sortable:hover {
    color: #2185d0;
    cursor: pointer;
  }
  .vuetable-head-wrapper {
    overflow-x: hidden;
  }
  .vuetable-head-wrapper table.vuetable {
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }
  .vuetable-body-wrapper.fixed-header {
    position:relative;
    overflow-y:auto;
  }
  .vuetable-body-wrapper table.vuetable.fixed-header {
    border-top:none !important;
    margin-top:0 !important;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
  }
  .vuetable-empty-result {
    text-align: center;
  }
</style>