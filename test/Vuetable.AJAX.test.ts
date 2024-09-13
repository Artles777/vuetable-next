import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { shallowMount } from "@vue/test-utils";
import Vuetable from "../src/components/Vuetable.vue";

describe("AJAX functionality", () => {
  let mock: MockAdapter;
  let  apiUrl: string;

  beforeEach( () => {
    mock = new MockAdapter(axios);
    apiUrl = "api.example.com/hello";
  });

  afterEach( () => {
    mock.reset();
    apiUrl = "";
  });

  describe("load-on-start", () => {
    it("calls API endpoint when load: load-on-start", context => new Promise(done => {
      mock.onGet(apiUrl).reply(200, [
        { id: 1, code: "AAA" },
        { id: 2, code: "BBB" }
      ]);

      const wrapper = shallowMount(Vuetable, {
        propsData: {
          apiUrl: apiUrl,
          fields: ["id", "code"],
          paginationPath: ""
        }
      });

      wrapper.vm.instanceFetch.then(res => {
        expect(res.request.responseURL).toContain("api.example.com/hello");
        expect(res.data[0].code).toEqual("AAA");
        done(context);
      });
    }));
  });

  describe("http-method", () => {
    const  stubResponse = [
      { id: 1, code: "AAA" },
      { id: 2, code: "BBB" }
    ];

    const shallowVuetable = (httpMethod) => shallowMount(Vuetable, {
      propsData: {
        apiUrl: apiUrl,
        fields: ["id", "code"],
        paginationPath: "",
        httpMethod
      }
    });

    it('calls API endpoint using "get" verb', context => new Promise(done => {
      mock.onGet(apiUrl).reply(200, stubResponse);

      const  wrapper = shallowVuetable("get");
      expect(wrapper.vm.httpMethod).toEqual("get");

      wrapper.vm.instanceFetch.then(res => {
        expect(res.request.responseURL).toContain("api.example.com/hello");
        expect(res.data[0].code).toEqual("AAA");
        done(context);
      });
    }));

    it('calls API endpoint using "post" verb', context => new Promise(done => {
      mock.onPost(apiUrl).reply(200, stubResponse);

      const  wrapper = shallowVuetable("post");
      expect(wrapper.vm.httpMethod).toEqual("post");

      wrapper.vm.instanceFetch.then(res => {
        expect(res.request.responseURL).toContain("api.example.com/hello");
        expect(res.data[0].code).toEqual("AAA");
        done(context);
      });
    }));
  });

  describe("query-params", () => {

    it("returns correct default", context => new Promise(done => {
      const queryParams = {
        sort: "sort",
        page: "page",
        perPage: "per_page"
      };

      const params = new URLSearchParams(queryParams).toString();

      mock.onGet(`${ apiUrl }?${ params }`).reply(200,  "foo");

      const wrapper = shallowMount(Vuetable, {
        propsData: {
          apiUrl: `${ apiUrl }?${ params }`,
          fields: ["id", "code"],
          paginationPath: ""
        }
      });

      expect(wrapper.vm.queryParams).toEqual({
        sort: "sort",
        page: "page",
        perPage: "per_page"
      });

      wrapper.vm.instanceFetch.then(res => {
        expect(res.status).toEqual(200);
        expect(res.request.responseURL).toEqual(
          `${ apiUrl }?${ params }`
        );
        done(context);
      });
    }));

    it("uses the given query params object to make a call to API endpoint", context => new Promise(done => {
      const queryParams = {
        sort: "sss",
        page: "ppp",
        perPage: "ggg"
      };

      const params = new URLSearchParams(queryParams).toString();
      mock.onGet(`${ apiUrl }?${ params }`).reply(200, "foo");


      const  wrapper = shallowMount(Vuetable, {
        propsData: {
          apiUrl: `${ apiUrl }?${ params }`,
          fields: ["id", "code"],
          paginationPath: "",
          queryParams
        }
      });

      expect(wrapper.vm.queryParams).toEqual(queryParams);

      wrapper.vm.instanceFetch.then(res => {
        expect(res.request.responseURL).toEqual(
          `${apiUrl}?${ params }`
        );
        done(context);
      });
    }));

    it("uses the given callback to construct query params", context => new Promise(done => {
      const  queryParams = () => {
        return {
          aaa: "111",
          bbb: "222",
          ccc: "333"
        };
      };

      const params = new URLSearchParams(queryParams()).toString();
      mock.onGet(`${ apiUrl }?${ params }`).reply(200, "foo");


      const  wrapper = shallowMount(Vuetable, {
        propsData: {
          apiUrl: `${ apiUrl }?${ params }`,
          fields: ["id", "code"],
          paginationPath: "",
          queryParams
        }
      });

      expect(wrapper.vm.queryParams).toEqual(queryParams);

      wrapper.vm.instanceFetch.then(res => {
        expect(res.request.responseURL).toEqual(
          `${apiUrl}?${ params }`
        );
        done(context);
      });
    }));

    it("defaults to empty object when the given queryParams function does not return Object", context => new Promise(done => {
      const  queryParams = () => "bar";

      mock.onGet(apiUrl).reply(200, "foo");

      const  wrapper = shallowMount(Vuetable, {
        propsData: {
          apiUrl: apiUrl,
          fields: ["id", "code"],
          paginationPath: "",
          queryParams
        }
      });

      expect(wrapper.vm.queryParams).toEqual(queryParams);

      wrapper.vm.instanceFetch.then(res => {
        expect(res.config.params).toEqual({});
        expect(res.request.responseURL).toEqual(apiUrl);
        done(context);
      });
    }));
  });

  describe("append-params", () => {
    const  appends = {
      "aaa": "111",
      "bbb": "222"
    };

    it("appends additional parameters to the API request", context => new Promise(done => {
      const params = new URLSearchParams(appends).toString();

      mock.onGet(`${apiUrl}?${ params }`).reply(200, "foo");

      const wrapper = shallowMount(Vuetable, {
        propsData: {
          apiUrl: `${apiUrl}?${ params }`,
          fields: ["id", "code"],
          paginationPath: "",
          appendParams: appends
        }
      });

      wrapper.vm.instanceFetch.then(res => {
        expect(res.config.params).toEqual(expect.objectContaining(appends));
        expect(res.request.responseURL).toEqual(expect.stringContaining("aaa=111&bbb=222"));
        done(context);
      });
    }));
  });

  describe("http-options", () => {
    const  options = {
      headers: {
        "Authorization": "my-token"
      }
    };

    it("attaches other options to the API request", context => new Promise(done => {
      mock.onGet(apiUrl).reply(200, "foo", { ...options.headers });

      const wrapper = shallowMount(Vuetable, {
        propsData: {
          apiUrl,
          fields: ["id", "code"],
          paginationPath: "",
          httpOptions: options
        }
      });

      wrapper.vm.instanceFetch.then(res => {
        expect(res.headers).toEqual(expect.objectContaining(options.headers));
        done(context);
      });
    }));
  });

  describe("http-fetch", () => {
    it("uses the given http-fetch function when specified", context => new Promise(done => {
      mock.onGet(apiUrl).reply(200);

      const myFetch = vi.fn( () => {
        return axios.get(apiUrl);
      });

      const wrapper = shallowMount(Vuetable, {
        propsData: {
          apiUrl,
          fields: ["id", "code"],
          paginationPath: "",
          httpFetch: myFetch as any
        }
      });

      wrapper.vm.instanceFetch.then(() => {
        expect(myFetch).toBeCalledWith(
          apiUrl,
          {
            params: {
              page: 1, per_page: 10, sort: ""
            }
          }
        );
        done(context);
      });
    }));
  });
});