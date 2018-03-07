/**
 * Access the value of obj indicated by accessor. If this accessor cannot access a data, it WILL create the data parent,
 * @param {object} obj
 * @param {string} accessor
 * @param newVal new value for this data, if set.
 * @return {object} if newVal is set, return new object, otherwise the accessor data.
 */
export function accessData(obj, accessor, newVal) {
    if (accessor === "" || typeof obj === 'undefined' || obj === null)
        return obj;
    if (!accessor.match(/^([\w_$]+(\[\d+])?\.)*[\w_$]+(\[\d+])?$/)) {
        console.error("accessor ", accessor, " is of wrong format");
        return obj;
    }

    let keys = accessor.split(".");
    let cur = obj;
    let parent = null;
    let keyRegExp = /^([\w_$]+)(?:\[(\d+)])?$/;//e.g. a[1], a

    for (let i = 0; i < keys.length - 1; i++) {
        let key = keys[i];
        let keyMatch = keyRegExp.exec(key);
        parent = cur;
        cur = cur[keyMatch[1]];
        if (keyMatch[2] && cur instanceof Array) {
            cur = cur[keyMatch[2]];
        }
        if (typeof cur === 'undefined') {
            if (keyMatch[2]) {
                //two situations
                if (typeof parent[keyMatch[1]] === 'undefined') {
                    //create parent array if not exists
                    parent[keyMatch[1]] = new Array(parseInt(keyMatch[2]) + 1);
                }
                cur = parent[keyMatch[1]][keyMatch[2]] = {};
            } else {
                parent[keyMatch[1]] = cur = {};
            }
        }
    }

    let match = keyRegExp.exec(keys[keys.length - 1]);
    if (typeof newVal !== 'undefined') {
        if (match[2]) {
            if (typeof cur[match[1]] === 'undefined') {
                cur[match[1]] = new Array(parseInt(match[2]) + 1);
            } else if (!cur[match[1]] instanceof Array )
                console.warn(cur[match[1]], "is not an array");
            cur[match[1]][match[2]] = newVal;
        } else {
            cur[match[1]] = newVal;
        }
        return obj;
    } else {
        if (match[2]) {
            return cur[match[1]] instanceof Array ? cur[match[1]][match[2]] : undefined;
        } else {
            return cur[match[1]];
        }
    }
}

/**
 * Deep clone the entire object.
 * @param obj
 */
export function deepClone(obj) {
    if (typeof obj === 'object') {
        if (obj instanceof Array) {
            let copy = [];
            for (let i = 0; i < obj.length; i++) {
                copy.push(obj[i]);
            }
            return copy;
        } else if (obj === null) {
            //null is an object!
            return null;
        } else {
            let copy = {};
            for (let key in obj) {
                if (obj.hasOwnProperty(key))
                    copy[key] = deepClone(obj[key]);
            }
            return copy;
        }
    } else {
        return obj;
    }
}


function testAccessData() {
    let obj = {};
    console.log(accessData(obj, ""));
    console.log(accessData(obj, "metadata"));
    console.log(accessData(obj, "metadata.name12345"));
    console.log(accessData(obj, "groups[1].metadata.name1234"));

    obj = {metadata: {name: "Name"}, groups: []};
    console.log(accessData(obj, ""));
    console.log(accessData(obj, ""));
    console.log(accessData(obj, "metadata"));
    console.log(accessData(obj, "metadata.name"));
    console.log(accessData(obj, "groups[1].metadata.name"));

    obj = {metadata: {name: "Name"}, groups: [{}, {metadata: {name: "name"}}]};
    console.log(accessData(obj, "groups[1].metadata.name"));
}

export function testDeepClone() {
    let obj = JSON.parse("{\n" +
        "  \"kind\": \"User\",\n" +
        "  \"apiVersion\": \"v1\",\n" +
        "  \"metadata\": {\n" +
        "    \"name\": \"admin\",\n" +
        "    \"selfLink\": \"/oapi/v1/users/admin\",\n" +
        "    \"uid\": \"7ff86975-1ac6-11e8-9003-000af7b00488\",\n" +
        "    \"resourceVersion\": \"620411\",\n" +
        "    \"creationTimestamp\": \"2018-02-26T07:27:28Z\"\n" +
        "  },\n" +
        "  \"identities\": [\n" +
        "    \"htpasswd:admin\"\n" +
        "  ],\n" +
        "  \"groups\": []\n" +
        "}");
    obj.nullObject = null;
    obj.funcObject = function (hey) {
        console.log("hello world");
    };
    let copy = deepClone(obj);
    console.log(obj);
    console.log(copy);
}