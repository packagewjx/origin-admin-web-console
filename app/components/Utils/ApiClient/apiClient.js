import DeleteOptions from "./model/DeleteOptions";
import {appHistory} from "../../../App";

const API_RESOURCE_LIST_URLS = ["https://116.56.140.108:8443/oapi/v1", "https://116.56.140.108:8443/api/v1"];

let client = {};
let fetchingPromise = undefined;
let token = "";

let verbFunctions = {
    create: createFunction,
    delete: deleteFunction,
    get: getFunction,
    list: listFunction,
    update: updateFunction,
    deletecollection: deleteCollectionFunction
};

class GlobalOption {
    namespace;

    constructor() {
        this.namespace = "";
    }
}

let defaultOption = new GlobalOption();

let failCallback = function (xhr, status, error) {
    console.log(xhr);
    if (xhr.responseJSON) {
        console.error("Error making api request, returned message: ", xhr.responseJSON.message, ". Status is");
        console.error(xhr.responseJSON);
    } else if (xhr.responseText) {
        console.error("Error making api request, returned message: ", xhr.responseText);
    }
    if (xhr.status === 401 || xhr.status === 403) {
        //jump to login page
        appHistory.push("/login");
    }
};

function setAccessToken(newToken) {
    token = "Bearer " + newToken;
    //clear fetchingPromise to clear all the functions that have been created
    fetchingPromise = undefined;
}

/**
 * Usage: apiClient return a Promise object. Use callback to use the client. Example usage
 * <code>
 *     apiClient().then(function(client) {
 *         //do what you want
 *     });
 * </code>
 * All api functions return jQuery.ajax Promise object. You can use then method to register callback.
 * Success callback is function(any data, String textStatus, jqXHR jqXHR)
 * Fail callback is function( jqXHR jqXHR, String textStatus, String errorThrown)
 * @returns {Promise<any>}
 */
function apiClient() {
    if (fetchingPromise)
        return fetchingPromise;
    else {
        fetchingPromise = new Promise((resolve, reject) => {
            let fetched = 0;
            API_RESOURCE_LIST_URLS.forEach((value) => {
                $.getJSON(value, null, function (data, status, xhr) {
                    if (data.kind !== "APIResourceList") {
                        console.error("Error getting api resource list from ", value);
                        reject(data, status, xhr);
                    }

                    for (let i = 0; i < data.resources.length; i++) {
                        data.resources[i].baseURL = value;
                        let resource = data.resources[i];
                        let api = {spec: resource};

                        for (let j = 0; j < resource.verbs.length; j++) {
                            if (verbFunctions.hasOwnProperty(resource.verbs[j])) {
                                api[resource.verbs[j]] = verbFunctions[resource.verbs[j]](resource);
                            }
                        }

                        client[resource.name] = api;
                        if (resource.shortNames) {
                            resource.shortNames.forEach(value => {
                                client[value] = api;
                            })
                        }
                    }

                    fetched++;

                    //if all fetched, resolve this Promise
                    if (fetched === API_RESOURCE_LIST_URLS.length) {
                        resolve(client);
                    }
                }).fail(function (xhr, status, error) {
                    reject(xhr, status, error);
                })
            });
        });
        fetchingPromise.catch(failCallback);
        return fetchingPromise;
    }
}


/**
 * Create the function for verb get, to get an object of a kind of resource
 * @return {function(name:string, options: GlobalOption)} a method to get an object of a resource kind.
 * @param resource
 */
function getFunction(resource) {
    return function (name, options) {
        options = options || defaultOption;

        let url = resource.baseURL;
        if (options.namespace !== "") {
            url += "/namespaces/" + options.namespace;
        }

        url += "/" + resource.name + "/" + name;

        return $.ajax(url, {
            headers: {authorization: token},
            method: "GET",
            error: failCallback
        });
    }
}

/**
 *
 * @param resource
 * @returns {function(obj:any, options:GlobalOption)} a function to create an object using <obj> object definition
 */
function createFunction(resource) {
    return function (obj, options) {
        options = options || defaultOption;

        let url = resource.baseURL;
        if (options.namespace !== "") {
            url += "/namespaces/" + options.namespace;
        }

        url += "/" + resource.name;

        return $.ajax(url, {
            headers: {authorization: token},
            method: "POST",
            processData: false,
            contentType: "application/json",
            data: JSON.stringify(obj),
            error: failCallback
        });
    }
}

/**
 *
 * @param resource
 * @returns {function(name:string, options:GlobalOption)} a function to delete an object whose name is <name>
 */
function deleteFunction(resource) {
    return function (name, options) {
        let deleteOptions = new DeleteOptions();

        let url = resource.baseURL;
        if (options.namespace !== "") {
            url += "/namespaces/" + options.namespace;
        }
        url += "/" + resource.name + "/" + name;

        return $.ajax(url, {
            headers: {authorization: token},
            method: "DELETE",
            contentType: "application/json",
            data: JSON.stringify(deleteOptions),
            processData: false,
            error: failCallback
        })
    }
}

/**
 *
 * @param resource
 * @returns {function(options:GlobalOption)} a function to delete all resource in a namespace
 */
function deleteCollectionFunction(resource) {
    return function (options) {
        let url = resource.baseURL;
        if (options.namespace !== "") {
            url += "/namespaces/" + options.namespace;
        }
        url += "/" + resource.name;

        return $.ajax(url, {
            headers: {authorization: token},
            method: "DELETE",
            error: failCallback
        })
    }
}

/**
 * Create a function for verb list, to list all objects of a kind of resource.
 * @returns {function(options:GlobalOption)} a function return jqXHR object, see here: http://api.jquery.com/jQuery.ajax/#jqXHR
 * @param resource
 */
function listFunction(resource) {
    return function (options) {
        options = options || defaultOption;
        let url = resource.baseURL;
        if (options.namespace !== "") {
            url += "/namespaces/" + options.namespace;
        }
        url += "/" + resource.name;

        return $.ajax(url, {
            method: "GET",
            headers: {"authorization": token},
            error: failCallback
        });
    }
}

/**
 *
 * @param resource
 */
function updateFunction(resource) {
    return function (obj, name, options) {
        options = options || defaultOption;

        let url = resource.baseURL;
        if (options.namespace !== "") {
            url += "/namespaces/" + options.namespace;
        }
        url += "/" + resource.name + "/" + name;

        return $.ajax(url, {
            headers: {authorization: token},
            method: "DELETE",
            contentType: "application/json",
            data: JSON.stringify(obj),
            processData: false,
            error: failCallback
        })
    }
}


export {client, apiClient, GlobalOption, setAccessToken}