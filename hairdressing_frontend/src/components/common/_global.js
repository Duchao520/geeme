import Vue from "vue";
import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";

const requireComponent = require.context(
    ".",
    // 是否查询其子目录
    true,
    /.(vue)$/
);
requireComponent.keys().forEach(fileName => {
    // 获取组件配置
    const componentConfig = requireComponent(fileName);

    // 获取组件的 PascalCase 命名
    const componentName = upperFirst(
        camelCase(
            // 获取和目录深度无关的文件名
            fileName
            .split("/")
            .pop()
            .replace(/\.\w+$/, "")
        )
    );
    Vue.component(componentName, componentConfig.default || componentConfig);
});