import ObjectMeta from "./ObjectMeta";

export default class Project {
    kind;

    apiVersion;

    metadata;

    constructor() {
        this.kind = "Project";
        this.apiVersion = "v1";
        this.metadata = new ObjectMeta();
    }
}