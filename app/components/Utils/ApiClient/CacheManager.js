export default class CacheManager {
    /**
     * this is the cache object that storing the cached data.
     */
    static cache;
    /**
     * 5 seconds for default timeout. If the cache was fetched 5 seconds ago, it will be out-dated.
     * @type {number}
     */
    static INVALID_TIMEOUT;

    static saveCache(kind, verb, namespace, name, data) {
        /*
        When no namespace, we set the namespace to NONAMESPACE,
        in order to keep the object's sturcture, treating them like the resource that has namespace
        */
        if (typeof namespace === 'undefined' || namespace === "")
            namespace = "NONAMESPACE";
        /*
        When verb is list, no name for the object, so we set a name for this object which is LIST.
         */
        if (verb === "list") {
            name = "LIST";
        }

        let parent = this.cache;
        let key = [kind, verb, namespace];
        let cur = {};
        for (let i = 0; i < key.length; i++) {
            cur = parent[key[i]];
            if (typeof cur === 'undefined')
                parent[key[i]] = {};
            parent = parent[key[i]];
        }
        let cache = new Cache();
        cache.data = data;
        cache.updateTimestamp = new Date().getTime();
        cache.verb = verb;
        cache.kind = kind;
        cache.name = name;
        cache.namespace = namespace;
        parent[name] = cache;
    }

    /**
     *
     * @param {String} kind kind of the resource, lowercase plural kind e.g. users.
     * @param {String} verb verb that is used to get this resource, normally is list and get
     * @param {String|undefined} namespace namespace of the object, can be undefined or '' if no namespace
     * @param {String|undefined} name name of the object
     * @return {undefined|Object} if no cache, return undefined, otherwise return the cached object.
     */
    static getCache(kind, verb, namespace, name) {
        /*
        When no namespace, we set the namespace to NONAMESPACE,
        in order to keep the object's sturcture, treating them like the resource that has namespace
        */
        if (typeof namespace === 'undefined' || namespace === "")
            namespace = "NONAMESPACE";
        /*
        When verb is list, no name for the object, so we set a name for this object which is LIST.
         */
        if (verb === "list") {
            name = "LIST";
        }

        let array = [kind, verb, namespace, name];
        let cur = this.cache;
        for (let i = 0; i < array.length; i++) {
            cur = cur[array[i]];
            if (cur === undefined)
                return undefined;
        }

        let currentTimestamp = new Date().getTime();

        if (currentTimestamp - cur.updateTimestamp > this.INVALID_TIMEOUT)
            return undefined;
        else {
            console.debug("Returning cached version of ", kind, " of verb ", verb, " of namespace ", namespace, " of name ", name);
            return cur.data;
        }
    }
}

CacheManager.cache = {};
CacheManager.INVALID_TIMEOUT = 5000;

class Cache {
    data;
    name;
    namespace;
    kind;
    verb;
    updateTimestamp;
}