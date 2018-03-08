/**
 Date: Unknown
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description: This file store some default PropertyOption, other component can use these option to quickly set up the
 common component like ResourceDetail, ResourceEditor, ResourceOverview.
 **/

import PropertyOption from "./PropertyOption";
import {apiClient} from "../Utils/ApiClient/apiClient";
import PolicyRule from "../Utils/ApiClient/model/PolicyRule";

/**
 * Utils
 */
let itemNameSelectionCallback = function (data, resolve) {
    let selections = [];
    for (let i = 0; i < data.items.length; i++) {
        let item = data.items[i];
        selections.push({label: item.metadata.name, value: item.metadata.name});
    }
    resolve(selections);
};
let namePropertyOption = new PropertyOption("metadata.name", "名称", "text");
namePropertyOption.immutable = true;
let namespacePropertyOption = new PropertyOption("metadata.namespace", "名称空间", "select");
namespacePropertyOption.selections = new Promise(resolve => {
    apiClient().then(function (client) {
        client.namespaces.list().then((data) => itemNameSelectionCallback(data, resolve));
    })
});
namespacePropertyOption.immutable = true;

/**
 * User Property Option Definition
 */
let userGroupOption = new PropertyOption("groups", "用户组", "select");
userGroupOption.isArray = true;
userGroupOption.selections = new Promise(resolve => {
    apiClient().then(function (client) {
        client.groups.list().then((data) => itemNameSelectionCallback(data, resolve))
    })
});

let userIdentitiesOption = new PropertyOption("identities", "用户身份", "select");
userIdentitiesOption.isArray = true;
userIdentitiesOption.selections = new Promise(resolve => {
    apiClient().then(function (client) {
        client.identities.list().then((data) => itemNameSelectionCallback(data, resolve))
    })
});

let userPropertyOption = [
    new PropertyOption("metadata.name", "用户名", "text"),
    userGroupOption,
    userIdentitiesOption
];

/**
 * PolicyRule Property Options
 * @type {Array}
 */
let policyRulePropertyOption = [
    new PropertyOption("apiGroups", "API组", "text"),
    new PropertyOption("resources", "资源种类", "text"),
    new PropertyOption("resourceNames", "资源名", "text"),
    new PropertyOption("verbs", "操作", "select"),
    new PropertyOption("nonResourceURLs", "非资源URL", "text"),
    new PropertyOption("attributeRestrictions", "属性限制", "text"),
];
policyRulePropertyOption[0].isArray = true;
policyRulePropertyOption[1].isArray = true;
policyRulePropertyOption[2].isArray = true;
policyRulePropertyOption[3].isArray = true;
policyRulePropertyOption[3].selections = [
    {label: "获取单个对象", value: "get"},
    {label: "获取所有对象", value: "list"},
    {label: "创建对象", value: "create"},
    {label: "删除单个对象", value: "delete"},
    {label: "删除所有对象", value: "deletecollection"},
    {label: "更新单个对象属性", value: "update"},
    {label: "部分更新单个对象属性", value: "patch"},
    {label: "监视对象变化", value: "watch"},
];
policyRulePropertyOption[4].isArray = true;


/**
 * Role Property Options
 */
let newPolicyRuleFunc = function () {
    let rule = new PolicyRule();
    rule.apiGroups = [];
    rule.verbs = [];
    rule.resources = [];
    rule.resourceNames = [];
    rule.nonResourceURLs = [];
    rule.attributeRestrictions = "";
    return rule;
};
let subPolicyRuleOption = new PropertyOption("rules", "角色权限", "object", undefined, newPolicyRuleFunc);
subPolicyRuleOption.subOptions = policyRulePropertyOption;
subPolicyRuleOption.isArray = true;

let rolePropertyOption = [
    namePropertyOption,
    namespacePropertyOption,
    subPolicyRuleOption
];

/**
 * User Identity Options
 */
let identityPropertyOption = [
    namePropertyOption,
    new PropertyOption("user.name", "关联用户", "text"),
    new PropertyOption("providerName", "身份提供方", "text"),
    new PropertyOption("providerUserName", "身份提供方用户名", "text"),
    new PropertyOption("extra", "额外信息", "object"),
];
identityPropertyOption[1].displayIfUndefined = true;

/**
 * Some defined PropertyOptions, each key is the resource plural name, e.g. users, roles
 */
export const PredefinedPropertyOption = {
    users: userPropertyOption,
    roles: rolePropertyOption,
    identities: identityPropertyOption
};