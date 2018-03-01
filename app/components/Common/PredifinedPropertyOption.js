import PropertyOption from "./PropertyOption";

let userPropertyOption = [
    new PropertyOption("metadata.name", "用户名", "text"),
];

let rolePropertyOption = [];

/**
 * each key is the resource plural name, e.g. users, roles
 * @type {{}}
 */
export const PredifinedPropertyOption = {
    users: userPropertyOption,
    roles: rolePropertyOption,
};