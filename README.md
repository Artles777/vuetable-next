# Vuetable-next
> Simple table for displaying data!
>
> Suitable for data visualization of any complexity with minimal time consumption.
## 🤸‍♀️Get started in 30 seconds
#### 1. Install vuetable-next from:
```bash
npm install -D vuetable-next
# or
yarn add -D vuetable-next
# or
pnpm i -D vuetable-next
```

#### 2. Initialize to the current project:
## 👦Vue 3
### Global Registration
```ts
import Vuetable from "vuetable-next";
import { createApp } from "vue";

const app = createApp({...});
app.use(Vuetable);
```
### Local Registration
```vue
<script setup lang="ts">
import Vuetable from "vuetable-next";
</script>

<template>
    <Vuetable
        ref="table"
        v-bind="{/* local props & attrs */}">
    </Vuetable>
<template>
```
## 👨Vue 2.7
### Global Registration
```ts
import Vuetable from "vuetable-next";
import Vue from "vue";

Vue.use(Vuetable);
```
### Local Registration
```vue
<script setup>
import Vuetable from "vuetable-next";
</script>

<template>
    <Vuetable
        ref="table"
        v-bind="{/* local props & attrs */}">
    </Vuetable>
<template>
```

## 👴Vue 2.6
### Global Registration
```ts
import VueCompositionAPI from "@vue/composition-api";
import Vuetable from "vuetable-next";
import Vue from "vue";

Vue.use(VueCompositionAPI);
Vue.use(Vuetable);
```
### Local Registration
```vue
<script>
import VueCompositionAPI from "@vue/composition-api";
import Vuetable from "vuetable-next";
import Vue from "vue";
Vue.use(VueCompositionAPI);

export default {
  components: { Vuetable }
}
</script>

<template>
    <Vuetable
        ref="table"
        v-bind="{/* local props & attrs */}">
    </Vuetable>
<template>
```

Also you have the ability to access certain components if you need them:
```javascript
Vuetable: Vuetable.default/Vuetable.Vuetable,
VuetablePagination: Vuetable.VuetablePagination,
VuetablePaginationInfo: Vuetable.VuetablePaginationInfo,
VuetablePaginationDropdown: Vuetable.VuetablePaginationDropdown
```
# Contributions
Any contribution to the code must be done to the `next` branch.

# License
Vuetable is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).