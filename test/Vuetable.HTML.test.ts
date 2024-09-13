import { mount } from "@vue/test-utils";
import Vuetable from "../src/components/Vuetable.vue";

describe("Vuetable - HTML structure", () => {
  const mountVuetable = (fields: string[]) => mount(Vuetable, {
    propsData: {
      loadOnStart: false,
      fields
    }
  });

  it("renders the HTML table", () => {
    const wrapper = mountVuetable(["code", "describe"]);
    expect(wrapper.element).toMatchSnapshot();
  });
});