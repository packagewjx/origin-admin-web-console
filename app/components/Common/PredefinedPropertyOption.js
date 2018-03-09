/**
 Date: Unknown
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description: This file store some default PropertyOption, other component can use these option to quickly set up the
 common component like ResourceDetail, ResourceEditor, ResourceOverview.
 **/

import PropertyOption from "./PropertyOption";
import {apiClient} from "../Utils/ApiClient/apiClient";
import PolicyRule from "../Utils/ApiClient/model/PolicyRule";
import Subject from "../Utils/ApiClient/model/Subject";

/**
 * Utils. Global Property Options, and common option.
 */
let itemNameSelectionCallback = function (data, resolve) {
    let selections = [];
    for (let i = 0; i < data.items.length; i++) {
        let item = data.items[i];
        selections.push({label: item.metadata.name, value: item.metadata.name});
    }
    resolve(selections);
};

let globalNamePropertyOption = new PropertyOption("metadata.name", "名称", "text");
globalNamePropertyOption.immutable = true;

function getNamespacePropertyOption() {
    let namespacePropertyOption = new PropertyOption("metadata.namespace", "项目", "select");
    namespacePropertyOption.selections = new Promise(resolve => {
        apiClient().then(function (client) {
            client.namespaces.list().then((data) => itemNameSelectionCallback(data, resolve));
        })
    });
    namespacePropertyOption.immutable = true;
    return namespacePropertyOption;
}

function getRoleSubjectOption() {
    let option = new PropertyOption("subjects", "关联主体", "object", () => new Subject());
    let namespaceOption = getNamespacePropertyOption();
    namespaceOption.accessor = "namespace";
    let subOptions = [
        namespaceOption,
        new PropertyOption("name", "名称", "text"),
        new PropertyOption("kind", "主体类型", "select"),
        new PropertyOption("apiGroup", "所属API组", "text")
    ];
    subOptions[2].selections = [
        {label: "系统组", value: "SystemGroup"},
        {label: "软件服务帐号", value: "ServiceAccount"},
        {label: "用户", value: "User"}
    ];
    option.subOptions = subOptions;
    option.isArray = true;
    return option;
}

let globalAnnotationPropertyOption = new PropertyOption("metadata.annotations", "注解", "keyValue");

function getSubPolicyRuleOption() {
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
    //ALL VERBS!
    policyRulePropertyOption[3].selections = [
        {label: "获取单个对象", value: "get"},
        {label: "获取所有对象", value: "list"},
        {label: "创建对象", value: "create"},
        {label: "删除单个对象", value: "delete"},
        {label: "删除所有对象", value: "deletecollection"},
        {label: "更新单个对象属性", value: "update"},
        {label: "部分更新单个对象属性", value: "patch"},
        {label: "监视对象变化", value: "watch"},
        {label: "编辑", value: "edit"},
        {label: "查看", value: "view"},
        {label: "更新单个对象属性(POST)", value: "post"},
        {label: "创建对象(PUT)", value: "put"},
        {label: "管理", value: "admin"},
        {label: "assign", value: "assign"},
        {label: "impersonate", value: "impersonate"},
        {label: "代理", value: "proxy"},
    ];
    policyRulePropertyOption[4].isArray = true;

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
    let subPolicyRuleOption = new PropertyOption("rules", "角色权限", "object", newPolicyRuleFunc);
    subPolicyRuleOption.subOptions = policyRulePropertyOption;
    subPolicyRuleOption.newValue = newPolicyRuleFunc;
    subPolicyRuleOption.isArray = true;

    return subPolicyRuleOption;
}

/**
 * Some defined PropertyOptions, each key is the resource plural name, e.g. users, roles. Each contains a function.
 * to get the new value every time.
 */
export const PredefinedPropertyOption = {
    users: function () {
        let userGroupOption = new PropertyOption("groups", "用户组", "select");
        userGroupOption.isArray = true;
        userGroupOption.selections = new Promise(resolve => {
            apiClient().then(function (client) {
                client.groups.list().then((data) => itemNameSelectionCallback(data, resolve))
            })
        });
        userGroupOption.immutable = true;

        let userIdentitiesOption = new PropertyOption("identities", "用户身份", "select");
        userIdentitiesOption.isArray = true;
        userIdentitiesOption.selections = new Promise(resolve => {
            apiClient().then(function (client) {
                client.identities.list().then((data) => itemNameSelectionCallback(data, resolve))
            })
        });
        userIdentitiesOption.immutable = true;

        return [
            globalNamePropertyOption,
            userGroupOption,
            userIdentitiesOption
        ];
    },
    identities: function () {
        let identityPropertyOption = [
            globalNamePropertyOption,
            new PropertyOption("user.name", "关联用户", "text"),
            new PropertyOption("providerName", "身份提供方", "text"),
            new PropertyOption("providerUserName", "身份提供方用户名", "text"),
            new PropertyOption("extra", "额外信息", "object"),
        ];
        identityPropertyOption[1].displayIfUndefined = true;
        identityPropertyOption[1].immutable = true;
        return identityPropertyOption;
    },
    roles: function () {
        let subPolicyRuleOption = getSubPolicyRuleOption();

        return [
            globalNamePropertyOption,
            getNamespacePropertyOption(),
            globalAnnotationPropertyOption,
            subPolicyRuleOption
        ];
    },
    rolebindings: function () {
        let roleOption = new PropertyOption("roleRef.name", "关联角色", "select");
        roleOption.selections = new Promise(resolve => {
            //this binding includes roles in namespace and clusterroles
            let roleNames = [];
            apiClient().then((client) => {
                let p1 = client.roles.list().then((data) => {
                    for (let i = 0; i < data.items.length; i++) {
                        let name = data.items[i].metadata.name;
                        roleNames.push({label: "项目" + data.items[i].metadata.namespace + "角色" + name, value: name});
                    }
                });
                let p2 = client.clusterroles.list().then((data) => {
                    for (let i = 0; i < data.items.length; i++) {
                        let name = data.items[i].metadata.name;
                        roleNames.push({label: "集群角色" + name, value: name});
                    }
                });
                Promise.all([p1, p2]).then(function () {
                    resolve(roleNames);
                });
            })
        });
        let subjectOption = getRoleSubjectOption();

        return [
            globalNamePropertyOption,
            getNamespacePropertyOption(),
            roleOption,
            subjectOption
        ];
    },
    clusterroles: function () {
        return [
            globalNamePropertyOption,
            globalAnnotationPropertyOption,
            getSubPolicyRuleOption(),
        ];
    },
    clusterrolebindings: function () {
        let clusterRoleOption = new PropertyOption("roleRef.name", "关联集群角色", "select");
        clusterRoleOption.selections = new Promise(resolve => {
            apiClient().then((client) => {
                client.clusterroles.list().then((data) => itemNameSelectionCallback(data, resolve));
            })
        });
        let subjectOption = getRoleSubjectOption();

        return [
            globalNamePropertyOption,
            clusterRoleOption,
            subjectOption
        ];
    },
};