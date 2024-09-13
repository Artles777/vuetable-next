import {lang} from "./lang.ts";

export const fields = [
  {
    name: "__handle",
    width: "40px"
  },
  {
    name: "__sequence",
    title: "No.",
    width: "50px",
    titleClass: "right aligned",
    dataClass: "right aligned"
  },
  {
    name: "__checkbox",
    title: "checkbox",
    width: "30px",
    titleClass: "center aligned",
    dataClass: "center aligned"
  },
  {
    name: "id",
    title: "<i class=\"unordered list icon\"></i> Detail",
    width: "80px",
    dataClass: "center aligned",
    formatter: (value, vuetable) => {
      const icon = vuetable.isVisibleDetailRow(value) ? "down" : "right";
      return [
        "<a class=\"show-detail-row\">",
        "<i class=\"chevron circle " + icon + " icon\"></i>",
        "</a>"
      ].join("");
    },

  },
  {
    name: "name",
    title: "<i class=\"book icon\"></i> Full Name",
    sortField: "name",
    width: "150px",
    filterable: true,
  },
  {
    name: "email",
    title: "<i class=\"mail outline icon\"></i> Email",
    sortField: "email",
    width: "200px",
    visible: true,
    filterable: true,
  },
  {
    name: "nickname",
    title: (nameOnly = false) => {
      return nameOnly
        ? lang["nickname"]
        : `<i class="paw icon"></i> ${lang["nickname"]}`;
    },
    sortField: "nickname",
    width: "120px",
    formatter: (value) => {
      return value.toUpperCase();
    },
    filterable: true,
  },
  {
    name: "birthdate",
    title: (nameOnly = false) => {
      return nameOnly
        ? lang["birthdate"]
        : `<i class="orange birthday icon"></i> ${lang["birthdate"]}`;
    },
    width: "100px",
    sortField: "birthdate",
    formatter: (value) => {
      if (value === null) return "";
      return moment(value, "YYYY-MM-DD").format("D MMM YYYY");
    },
    filterable: true,
  },
  {
    name: "gender",
    title: "Gender",
    sortField: "gender",
    width: "100px",
    titleClass: "center aligned",
    dataClass: "center aligned",
    formatter: (value) => {
      return value === "M"
        ? "<span class=\"ui teal label\"><i class=\"male icon\"></i>Male</span>"
        : "<span class=\"ui pink label\"><i class=\"female icon\"></i>Female</span>";
    },
    filterable: true,
  },
  {
    name: "slot-actions",
    title: "Actions",
    width: "140px",
    titleClass: "center aligned",
    dataClass: "center aligned"
  }
];