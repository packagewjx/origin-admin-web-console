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
import Parameter from "../Utils/ApiClient/model/Parameter";

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


function getGlobalObjectReferenceProertySubOptions() {
    let namespace = getNamespacePropertyOption();
    namespace.accessor = "namespace";

    return [
        new PropertyOption("kind", "引用类型", "text"),
        namespace,
        new PropertyOption("name", "名称", "text"),
        new PropertyOption("uid", "UID", "text"),
        new PropertyOption("apiVersion", "API版本", "text"),
        new PropertyOption("resourceVersion", "资源版本", "text"),
        new PropertyOption("fieldPath", "JSON路径表达式", "text")
    ];
}

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
        {label: "所有操作", value: "*"}
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
    persistentvolumes: function () {
        let nfsOption = new PropertyOption("spec.nfs", "NFS存储定义", "object");
        nfsOption.subOptions = [
            new PropertyOption("server", "NFS服务器地址", "text"),
            new PropertyOption("path", "路径", "text"),
            new PropertyOption("readOnly", "是否只读", "boolean")
        ];
        let phaseOption = new PropertyOption("status.phase", "状态", "text");
        phaseOption.immutable = true;
        let claimOption = new PropertyOption("spec.claimRef.name", "已分配给", "text");
        claimOption.immutable = true;
        let accessModeOption = new PropertyOption("spec.accessModes", "存取模式", "text");
        accessModeOption.isArray = true;
        let reclaimOption = new PropertyOption("spec.persistentVolumeReclaimPolicy", "再利用策略", "select");
        reclaimOption.selections = [
            {label: "保存内容，手动删除", value: "Retain"},
            {label: "删除内容循环使用（只支持NFS与HostPath）", value: "Recycle"},
            {label: "自动删除但不重新使用", value: "Delete"}
        ];


        return [
            globalNamePropertyOption,
            new PropertyOption("spec.capacity.storage", "容量", "text"),
            accessModeOption,
            reclaimOption,
            phaseOption,
            claimOption,
            nfsOption
        ];
    },
    templates: function () {
        let parameterOption = new PropertyOption("parameters", "参数", "object", () => new Parameter());
        parameterOption.isArray = true;
        parameterOption.subOptions = [
            new PropertyOption("name", "参数名", "text"),
            new PropertyOption("displayName", "显示名", "text"),
            new PropertyOption("description", "描述", "text"),
            new PropertyOption("required", "必要参数", "boolean"),
            new PropertyOption("value", "默认值", "text"),
            new PropertyOption("generate", "生成表达式", "text"),
            new PropertyOption("from", "生成表达式参数", "text")
        ];
        let objectsOption = new PropertyOption("objects", "模版内部对象", "object", () => {
        });
        objectsOption.isArray = true;
        objectsOption.subOptions = [];

        return [
            globalNamePropertyOption,
            getNamespacePropertyOption(),
            new PropertyOption("message", "帮助消息", "text"),
            globalAnnotationPropertyOption,
            parameterOption,
            objectsOption,
        ]
    },
    imagestreams: function () {
        let specOption = new PropertyOption("spec", "镜像流定义", "object");
        let specTagOption = new PropertyOption("tags", "镜像标签列表", "object");
        specTagOption.isArray = true;
        let specTagFromOption = new PropertyOption("from", "引用其他标签名", "object");
        specTagFromOption.subOptions = getGlobalObjectReferenceProertySubOptions();
        let specTagRType = new PropertyOption("referencePolicy.type", "引用策略类型", "select");
        specTagRType.selections = [
            {label: "源地址", value: "Source"},
            {label: "本地", value: "Local"}
        ];
        specTagOption.subOptions = [
            new PropertyOption("name", "标签名", "text"),
            new PropertyOption("annotations", "注解", "keyValue"),
            specTagFromOption,
            new PropertyOption("reference", "是否已经导入此标签代表的镜像", "boolean"),
            new PropertyOption("generation", "年代数", "number"),
            new PropertyOption("importPolicy.insecure", "是否导入不安全镜像库的镜像", "boolean"),
            new PropertyOption("importPolicy.scheduled", "是否定时更新镜像", "boolean"),
            specTagRType
        ];
        specOption.subOptions = [
            new PropertyOption("lookupPolicy.local", "是否本地查找", "boolean"),
            new PropertyOption("dockerImageRepository", "docker镜像库", "text"),
            specTagOption
        ];

        return [
            globalNamePropertyOption,
            globalAnnotationPropertyOption,
            specOption
        ]
    }
};