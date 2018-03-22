/**
 Date: Unknown
 Author: <a href="mailto:wu812730157@gmail.com">packagewjx</a>
 Description: This file store some default PropertyOption, other component can use these option to quickly set up the
 common component like ResourceDetail, ResourceEditor, ResourceOverview.
 **/

import PropertyOption from "./PropertyOption";
import {apiClient} from "../Utils/ApiClient/apiClient";
import PolicyRule from "../Utils/ApiClient/model/PolicyRule";
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
            client.namespaces.list().then((data) => {
                let selections = [];
                for (let i = 0; i < data.items.length; i++) {
                    let project = data.items[i];
                    if (project.metadata.annotations["openshift.io/display-name"]) {
                        selections.push({
                            label: project.metadata.annotations["openshift.io/display-name"] + "(" + project.metadata.name + ")",
                            value: project.metadata.name
                        })
                    } else
                        selections.push({label: project.metadata.name, value: project.metadata.name});
                }
                resolve(selections);
            });
        })
    });
    namespacePropertyOption.immutable = true;
    return namespacePropertyOption;
}

function getRoleBindingsUserNamesOption() {
    let userNameOption = new PropertyOption("userNames", "关联用户", "select");
    userNameOption.isArray = true;
    userNameOption.selections = new Promise(resolve => {
        apiClient().then((client) => {
            let selections = [];
            let userPromise = client.users.list().then((data) => {
                for (let i = 0; i < data.items.length; i++) {
                    selections.push({label: data.items[i].metadata.name, value: data.items[i].metadata.name});
                }
            });
            let saPromise = client.serviceaccounts.list().then((data) => {
                for (let i = 0; i < data.items.length; i++) {
                    let name = "system:serviceaccount:" + data.items[i].metadata.namespace + ":" + data.items[i].metadata.name;
                    selections.push({label: name, value: name});
                }
            });
            Promise.all([userPromise, saPromise]).then(() => {
                resolve(selections);
            });
        })
    });
    return userNameOption;
}

function getRoleBindingsGroupNamesOption() {
    let groupsOption = new PropertyOption("groupNames", "关联组", "select");
    groupsOption.isArray = true;
    groupsOption.selections = new Promise(resolve => {
        apiClient().then((client) => {
            client.groups.list().then((data) => itemNameSelectionCallback(data, resolve));
        })
    });
    return groupsOption;
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

        return [
            globalNamePropertyOption,
            getNamespacePropertyOption(),
            roleOption,
            getRoleBindingsUserNamesOption(),
            getRoleBindingsGroupNamesOption()
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

        return [
            globalNamePropertyOption,
            clusterRoleOption,
            getRoleBindingsUserNamesOption(),
            getRoleBindingsGroupNamesOption()
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
        let accessModeOption = new PropertyOption("spec.accessModes", "存取模式", "select");
        accessModeOption.isArray = true;
        accessModeOption.selections = [
            {label: "ReadWriteOnce-单用户读写", value: "ReadWriteOnce"},
            {label: "ReadOnlyMany-多用户只读", value: "ReadOnlyMany"},
            {label: "ReadWriteMany-多用户读写", value: "ReadWriteMany"},
        ];
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
        //reference policy
        let specTagRType = new PropertyOption("type", "引用策略类型", "select");
        specTagRType.selections = [
            {label: "源地址", value: "Source"},
            {label: "本地", value: "Local"}
        ];
        let specTagReferencePolicy = new PropertyOption("referencePolicy", "引用策略", "object");
        specTagReferencePolicy.subOptions = [specTagRType];
        //import policy
        let specTagImportPolicy = new PropertyOption("importPolicy", "导入镜像策略", "object");
        let specImportPolicyInsecured = new PropertyOption("insecure", "是否导入不安全镜像库的镜像", "boolean");
        let specImportPolicyScheduled = new PropertyOption("scheduled", "是否定时更新镜像", "boolean");
        specTagImportPolicy.subOptions = [specImportPolicyInsecured, specImportPolicyScheduled];


        specTagOption.subOptions = [
            new PropertyOption("name", "标签名", "text"),
            new PropertyOption("annotations", "注解", "keyValue"),
            specTagFromOption,
            new PropertyOption("reference", "是否已经导入此标签代表的镜像", "boolean"),
            new PropertyOption("generation", "年代数", "number"),
            specTagImportPolicy,
            specTagReferencePolicy,
        ];

        specOption.subOptions = [
            new PropertyOption("lookupPolicy.local", "是否本地查找", "boolean"),
            new PropertyOption("dockerImageRepository", "docker镜像库", "text"),
            specTagOption,
        ];

        return [
            globalNamePropertyOption,
            globalAnnotationPropertyOption,
            specOption
        ]
    },
    resourcequotas: function () {
        let specHardOption = new PropertyOption("spec.hard", "资源限制", "selectSet");
        specHardOption.selections = [
            {label: "CPU核数上限", propertyOption: new PropertyOption("cpu", "CPU核数上限", "number")},
            {label: "内存占用上限", propertyOption: new PropertyOption("memory", "内存占用上限（单位Gi，Mi）", "text")},
            {label: "请求CPU数量上限", propertyOption: new PropertyOption("requests\\.cpu", "请求CPU数量上限", "number")},
            {label: "请求内存大小上限", propertyOption: new PropertyOption("requests\\.memory", "请求内存大小上限（单位Gi，Mi）", "text")},
            {label: "CPU限制值上限", propertyOption: new PropertyOption("limits\\.cpu", "CPU限制值上限", "number")},
            {label: "内存限制值上限", propertyOption: new PropertyOption("limits\\.memory", "内存限制值上限（单位Gi，Mi）", "text")},
            {
                label: "请求持久存储空间容量上限",
                propertyOption: new PropertyOption("requests\\.storage", "请求持久存储空间容量上限（单位Gi，Mi）", "text")
            },
            {label: "持久存储申请数量上限", propertyOption: new PropertyOption("persistentvolumeclaims", "持久存储申请数量上限", "number")},
            {label: "容器（Pods）数量上限", propertyOption: new PropertyOption("pods", "容器（Pods）数量上限", "number")},
            {
                label: "复制控制器（ReplicationControllers）数量上限",
                propertyOption: new PropertyOption("replicationcontrollers", "复制控制器（ReplicationControllers）数量上限")
            },
            {label: "资源配额数量上限", propertyOption: new PropertyOption("resourcequotas", "资源配额数量上限", "number")},
            {label: "服务数量上限", propertyOption: new PropertyOption("services", "服务数量上限", "number")},
            {label: "密钥数量上限", propertyOption: new PropertyOption("secrets", "密钥数量上限", "number")},
            {
                label: "配置表（ConfigMaps）数量上限",
                propertyOption: new PropertyOption("configmaps", "配置表（ConfigMaps）数量上限", "number")
            },
            {label: "镜像流数量上限", propertyOption: new PropertyOption("openshift\\.io/imagestreams", "镜像流数量上限", "number")}
        ];

        let specScopeOption = new PropertyOption("spec.scopes", "限制范围", "select");
        specScopeOption.isArray = true;
        specScopeOption.selections = [
            {label: "停止中的容器", value: "Terminating"},
            {label: "运行中的容器", value: "NotTerminating"},
            {label: "尽力服务的容器", value: "BestEffort"},
            {label: "非尽力服务的容器", value: "NotBestEffort"}
        ];


        return [
            globalNamePropertyOption,
            getNamespacePropertyOption(),
            specHardOption,
            specScopeOption
        ]
    },
    projects: function () {
        return [
            globalNamePropertyOption,
            new PropertyOption("metadata.annotations.openshift\\.io/display-name", "显示名", "text")
        ]
    },
    groups: function () {
        let usersOption = new PropertyOption("users", "组内用户", "select");
        usersOption.isArray = true;
        usersOption.selections = new Promise((resolve, reject) => {
            apiClient().then((client) => {
                client.users.list().then((data) => itemNameSelectionCallback(data, resolve), () => reject());
            }, () => reject());
        });

        return [
            globalNamePropertyOption,
            usersOption
        ]
    }
};

export {getNamespacePropertyOption};