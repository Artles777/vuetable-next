import { mount } from "@vue/test-utils";
import VuetableFieldCheckbox from "../src/components/VuetableFieldCheckbox.vue";
import Vuetable from "../src/components/Vuetable.vue";

describe("Vuetable - Components", () => {
  it("render VuetableFieldCheckbox", () => {
    const root = mount(Vuetable, {
      propsData: {
        apiMode: false,
        fields: [
          { name: "code", titleClass: "foo-bar" }
        ]
      }
    });
    const wrapper = mount(VuetableFieldCheckbox, {
      propsData: {
        rowData: ["code"]
      },
      global: {
        provide: {
          vuetable: root.vm
        }
      }
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});