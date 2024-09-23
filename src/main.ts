import { createApp } from "vue";
import Vuetable from "./components/Vuetable.vue";
import VuetablePagination from "./components/VuetablePagination.vue";
import VuetablePaginationDropdown from "./components/VuetablePaginationDropdown.vue";
import VuetablePaginationInfo from "./components/VuetablePaginationInfo.vue";
import type { AxiosResponse } from "axios";
import sweetAlert from "sweetalert";

import VuetableFieldCheckbox from "./components/VuetableFieldCheckbox.vue";
import VuetableFieldHandle from "./components/VuetableFieldHandle.vue";
import VuetableFieldSequence from "./components/VuetableFieldSequence.vue";
import { lang } from "./data/lang";
import { fields } from "./data/fields";

interface Field {
  name: string
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

const E_SERVER_ERROR = "Error communicating with the server";

const app = createApp({
  el: "#app",
  components: {
    Vuetable,
    VuetablePagination,
    VuetablePaginationDropdown,
    VuetablePaginationInfo
  },
  data () {
    return {
      loading: "",
      searchFor: "",
      moreParams: {},
      fields,
      tableHeight: "600px",
      vuetableFields: false,
      fieldPrefix: "vuetable-",
      sortOrder: [{
        field: "name",
        direction: "asc",
      }],
      multiSort: true,
      paginationComponent: "vuetable-pagination",
      perPage: 10,
      paginationInfoTemplate: "Showing record: {from} to {to} from {total} item(s)",
      lang,
    };
  },

  watch: {
    perPage () {
      this.$nextTick(() => {
        this.$refs.vuetable.refresh();
      });
    },

    paginationComponent () {
      this.$nextTick(() => {
        this.$refs.pagination.setPaginationData(this.$refs.vuetable.tablePagination);
      });
    }
  },

  methods: {
    transform (data: any) {
      const transformed = {
        pagination: {},
        data: <any>[]
      };
      transformed.pagination = {
        total: data.total,
        per_page: data.per_page,
        current_page: data.current_page,
        last_page: data.last_page,
        next_page_url: data.next_page_url,
        prev_page_url: data.prev_page_url,
        from: data.from,
        to: data.to
      };

      transformed.data = [];
      data = data.data;
      for (let i = 0; i < data.length; i++) {
        transformed.data.push({
          id: data[i].id,
          name: data[i].name,
          nickname: data[i].nickname,
          email: data[i].email,
          age: data[i].age,
          birthdate: data[i].birthdate,
          gender: data[i].gender,
          address: data[i].address.line1 + " " + data[i].address.line2 + " " + data[i].address.zipcode
        });
      }

      return transformed;
    },
    showSettingsModal () {
      // @ts-expect-error
      $("#settingsModal").modal({
        detachable: true,
        onVisible () {
          // @ts-expect-error
          $(".ui.checkbox").checkbox();
        }
      }).modal("show");
    },
    showLoader () {
      this.loading = "loading";
    },
    hideLoader () {
      this.loading = "";
    },
    setFilter () {
      this.moreParams.filter = this.searchFor;
      this.$nextTick(() => {
        this.$refs.vuetable.refresh();
      });
    },
    resetFilter () {
      this.searchFor = "";
      this.setFilter();
    },
    pregQuote (str: string) {
      // http://kevin.vanzonneveld.net
      // +   original by: booeyOH
      // +   improved by: Ates Goral (http://magnetiq.com)
      // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // +   bugfixed by: Onno Marsman
      // *     example 1: preg_quote("$40");
      // *     returns 1: '\$40'
      // *     example 2: preg_quote("*RRRING* Hello?");
      // *     returns 2: '\*RRRING\* Hello\?'
      // *     example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
      // *     returns 3: '\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:'
      return (str+"").replace(/([\\.+*?[^\]$(){}=!<>|:])/g, "\\$1");
    },
    highlight (needle: string, haystack: string) {
      return haystack.replace(
        new RegExp("(" + this.pregQuote(needle) + ")", "ig"),
        "<span class=\"highlight\">$1</span>"
      );
    },
    rowClassCB (_: any, index: number) {
      return (index % 2) === 0 ? "odd" : "even";
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onCellClicked (data: any, field: any, _: Event) {
      console.log("cellClicked", field.name);
      if (field.name !== this.fieldPrefix+"actions") {
        this.$refs.vuetable.toggleDetailRow(data.id);
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onCellDoubleClicked (data: any, field: any, event: Event) {
      console.log("cellDoubleClicked:", field.name, data, event);
    },
    onCellRightClicked (data: any, field: any, event: Event) {
      console.log("cellRightClicked:", field.name, data, event);
    },
    onLoadSuccess (response: AxiosResponse) {
      // set pagination data to pagination-info component
      this.$refs.paginationInfo.setPaginationData(response.data);

      const data = response.data.data;
      if (this.searchFor !== "") {
        for (const n in data) {
          data[n].name = this.highlight(this.searchFor, data[n].name);
          data[n].email = this.highlight(this.searchFor, data[n].email);
        }
      }
    },
    onLoadError (response: AxiosResponse) {
      if (response.status == 400) {
        sweetAlert("Something's Wrong!", response.data.message, "error");
      } else {
        sweetAlert("Oops", E_SERVER_ERROR, "error");
      }
    },
    onPaginationData (tablePagination: any) {
      this.$refs.paginationInfo.setPaginationData(tablePagination);
      this.$refs.pagination.setPaginationData(tablePagination);
    },
    onChangePage (page: number) {
      this.$refs.vuetable.changePage(page);
    },
    onInitialized (fields: any) {
      console.log("onInitialized", fields);
      this.vuetableFields = fields;
    },
    onDataReset () {
      console.log("onDataReset");
      this.$refs.paginationInfo.resetData();
      this.$refs.pagination.resetData();
    },
    onActionClicked (action: any, data: any) {
      console.log("slot actions: on-click", data.name);
      sweetAlert(action, data.name);
    },
    onFieldEvent (type: string, payload: any, vuetable: any) {
      if (type === "checkbox-toggled") {
        vuetable.onCheckboxToggled(payload.isChecked, payload.field, payload.dataItem);
      } else if (type === "checkbox-toggled-all") {
        vuetable.onCheckboxToggledAll(payload.isChecked, payload.field);
      }
    },
    onHeaderEvent (type: string, payload: any) {
      console.log("onHeaderEvent:", type, payload);
      const vuetable = this.$refs.vuetable;
      switch (type) {
        case "order-by":
          vuetable.orderBy(payload.field, payload.event);
          break;
        case "refresh":
          vuetable.refresh();
          break;
        case "add-sort-column":
          vuetable.addSortColumn(payload.field, payload.direction);
          break;
        case "remove-sort-column":
          vuetable.removeSortColumn(payload.index);
          break;
        case "set-sort-column":
          vuetable.setSortColumnDirection(payload.index, payload.direction);
          break;
        case "clear-sort-column":
          vuetable.clearSortOrder();
          break;
        case "toggle-row":
          vuetable.onCheckboxToggled(payload.isChecked, payload.field, payload.dataItem);
          break;
        case "toggle-all-rows":
          vuetable.onCheckboxToggledAll(payload.isChecked, payload.field);
          break;
        case "filter":
          break;
        default:
          console.log("Unhandled event: ", type, payload);
      }
    }
  }
});

app.component("custom-actions", {
  template: [
    "<div>",
    "<button class=\"ui red button\" @click=\"onClick('view-item', rowData)\"><i class=\"zoom icon\"></i></button>",
    "<button class=\"ui blue button\" @click=\"onClick('edit-item', rowData)\"><i class=\"edit icon\"></i></button>",
    "<button class=\"ui green button\" @click=\"onClick('delete-item', rowData)\"><i class=\"delete icon\"></i></button>",
    "</div>"
  ].join(""),
  props: {
    rowData: {
      type: Object,
      required: true
    }
  },
  methods: {
    onClick (action: any, data: any) {
      console.log("actions: on-click", data.name);
      sweetAlert(action, data.name);
    },
  }
});

app.component("my-detail-row", {
  template: [
    "<div @click=\"onClick\">",
    "<div class=\"inline field\">",
    "<label>Name: </label>",
    "<span>{{rowData.name}}</span>",
    "</div>",
    "<div class=\"inline field\">",
    "<label>Email: </label>",
    "<span>{{rowData.email}}</span>",
    "</div>",
    "<div class=\"inline field\">",
    "<label>Nickname: </label>",
    "<span>{{rowData.nickname}}</span>",
    "</div>",
    "<div class=\"inline field\">",
    "<label>Birthdate: </label>",
    "<span>{{rowData.birthdate}}</span>",
    "</div>",
    "<div class=\"inline field\">",
    "<label>Gender: </label>",
    "<span>{{rowData.gender}}</span>",
    "</div>",
    "</div>"
  ].join(""),
  props: {
    rowData: {
      type: Object,
      required: true
    }
  },
  methods: {
    onClick (event: Event) {
      console.log("my-detail-row: on-click", event.target);
    }
  },
});

app.component("settings-modal", {
  template: `
    <div class="ui small modal" id="settingsModal">
      <div class="header">Settings</div>
      <div class="content ui form">
        <div class="field">
          <div class="ui checkbox">
            <input type="checkbox" v-model="$parent.multiSort">
            <label>Multisort (use Alt+Click)</label>
          </div>
        </div>
        <div class="ui divider"></div>
        <div class="field">
          <label>Pagination:</label>
          <select class="ui simple dropdown" v-model="$parent.paginationComponent">
            <option value="vuetable-pagination">vuetable-pagination</option>
            <option value="vuetable-pagination-dropdown">vuetable-pagination-dropdown</option>
          </select>
        </div>
        <div class="field">
          <label>Per Page:</label>
          <select class="ui simple dropdown" v-model="$parent.perPage">
            <option :value="10">10</option>
            <option :value="15">15</option>
            <option :value="20">20</option>
            <option :value="25">25</option>
          </select>
        </div>
        <div class="ui fluid card">
          <div class="content">
            <div class="header">Visible fields</div>
          </div>
          <div v-if="vuetableFields" class="content">
            <div v-for="(field, idx) in vuetableFields" class="field">
              <div class="ui checkbox">
                <input type="checkbox" :checked="field.visible" @change="toggleField(idx, $event)">
                <label>{{ getFieldTitle(field) }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="actions">
        <div class="ui cancel button">Close</div>
      </div>
    </div>
  `,
  props: ["vuetableFields", "fieldPrefix"],
  data () {
    return {
    };
  },
  methods: {
    getFieldTitle (field: Field) {
      if (typeof(field.title) === "function") return field.title(true);

      let title = field.title;
      if (title !== "") return this.stripHTML(title);

      title = "";
      // @ts-ignore
      if (field.name.slice(0, 2) === this.fieldPrefix) {
        title = field.name.indexOf(":") >= 0
          ? field.name.split(":")[1]
        // @ts-ignore
          : field.name.replace(this.fieldPrefix, "");
      }

      return title;
    },
    stripHTML (str: string) {
      return str ? str.replace(/(<([^>]+)>)/ig,"") : "";
    },
    toggleField (index: number, event: Event & { target: { checked: boolean } }) {
      console.log("toggleField: ", index, event.target.checked);
      // @ts-ignore
      this.$parent.$refs.vuetable.toggleField(index);
    }
  }
});

app.component("vuetable-field-checkbox", VuetableFieldCheckbox);
app.component("vuetable-field-handle", VuetableFieldHandle);
app.component("vuetable-field-sequence", VuetableFieldSequence);

app.mount("#app");