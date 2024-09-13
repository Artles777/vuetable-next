import { useVuetablePaginationInfo } from "../src/components/useVuetablePaginationInfo";
import { createApp } from "vue";
import { expect } from "vitest";
import { useVuetablePagination } from "../src/components/useVuetablePagination";
import { mount } from "@vue/test-utils";
import { VuetablePagination, VuetablePaginationInfo } from "../src";

function withSetupPaginationInfo () {
  let result: any;

  const app = createApp({
    props: ["noDataTemplate", "infoTemplate"],
    setup (props) {
      result = useVuetablePaginationInfo(() => props.noDataTemplate as string, () => props.infoTemplate as string);
      return () => {};
    }
  }, {
    infoTemplate: "Displaying {from} to {to} of {total} items",
    noDataTemplate: "No relevant data"
  });
  app.mount(document.createElement("div"));
  return [result, app];
}

describe("Vuetable - Composable in the usePaginationInfo", () => {
  it("should tablePagination changed", () => {
    const [result] = withSetupPaginationInfo();

    const pagination = {
      total: 100,
      current_page: 1,
      last_page: 10,
      from: 1,
      to: 2
    };

    expect(result.tablePagination.value).toBe(null);

    result.setPaginationData(pagination);

    expect(result.tablePagination.value).toStrictEqual(pagination);

    result.resetData();

    expect(result.tablePagination.value).toBe(null);
  });

  it("isCurrentPage equal to current_page", () => {
    const [result] = withSetupPaginationInfo();

    result.tablePagination.value = {
      total: 100,
      current_page: 2,
      last_page: 10,
      from: 2,
      to: 3
    };

    expect(result.isCurrentPage(2)).toBeTruthy();
  });

  it("The paginationInfo changed", async () => {
    const wrapper = mount(VuetablePaginationInfo, {
      propsData: {
        infoTemplate: "Displaying {from} to {to} of {total} items",
        noDataTemplate: "No relevant data"
      }
    });

    await wrapper.setProps({
      noDataTemplate: "New noDataTemplate"
    });

    expect(wrapper.vm.noDataTemplate).toBe("New noDataTemplate");
    expect(wrapper.vm.paginationInfo).toBe(wrapper.vm.noDataTemplate);
  });
});

describe("Vuetable - Composable in the usePagination", () => {
  const app = createApp({}, {
    onEachSide: 2,
    firstPage: 1
  });

  it("should tablePagination changed", () => {
    const pagination = {
      total: 100,
      current_page: 1,
      last_page: 10,
      from: 1,
      to: 2
    };

    const {
      tablePagination,
      setPaginationData,
      resetData
    } = useVuetablePagination(() => app._props.onEachSide as number, () => app._props.firstPage as number);

    expect(tablePagination.value).toBe(null);

    setPaginationData(pagination);

    expect(tablePagination.value).toStrictEqual(pagination);

    resetData();

    expect(tablePagination.value).toBe(null);
  });

  it("should computed reactive", () => {
    const pagination = {
      total: 100,
      current_page: 1,
      last_page: 10,
      from: 1,
      to: 2
    };

    const {
      tablePagination,
      isOnFirstPage,
      isOnLastPage,
      notEnoughPages
    } = useVuetablePagination(() => app._props.onEachSide as number, () => app._props.firstPage as number);

    tablePagination.value = pagination;

    expect(isOnFirstPage.value).toBeTruthy();
    expect(isOnLastPage.value).toBeFalsy();

    tablePagination.value.current_page = 10;

    expect(isOnLastPage.value).toBeTruthy();

    expect(notEnoughPages.value).toBeFalsy();
  });

  it("should windowSize changed", async () => {
    const wrapper = mount(VuetablePagination);

    expect(wrapper.vm.windowSize).toBe(5);

    await wrapper.setProps({
      onEachSide: 4
    });

    expect(wrapper.vm.onEachSide).toBe(4);
    expect(wrapper.vm.windowSize).toBe(9);
  });
});