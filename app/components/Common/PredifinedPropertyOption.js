import PropertyOption from "./PropertyOption";
import {apiClient} from "../Utils/ApiClient/apiClient";

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
let namespacePropertyOption = new PropertyOption("metadata.namespace", "名称空间", "select");
namespacePropertyOption.selections = new Promise(resolve => {
    apiClient().then(function (client) {
        client.namespaces.list().then((data) => itemNameSelectionCallback(data, resolve));
    })
});

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
 * Role Property Options
 * @type {Array}
 */
let rolePropertyOption = [
    namePropertyOption,
    namespacePropertyOption
];

/**
 * each key is the resource plural name, e.g. users, roles
 * @type {{}}
 */
export const PredifinedPropertyOption = {
    users: userPropertyOption,
    roles: rolePropertyOption,
};