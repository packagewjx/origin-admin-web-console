export class TableConfig {
    /**
     * Configuration for columns in the table. There are default column config available in DefaultColumnConfig.
     * @see DefaultColumnConfig
     * @member {Array.<String|ColumnConfig>} rows
     */
    columns;
}

export const DefaultColumnConfig = {
    name: {
        title: "名称",
        referer: "metadata.name",
        linkTo: "<<resourceName>>/{metadata.name}"
    },
    namespacedName: {
        title: "名称",
        referer: "metadata.name",
        linkTo: "<<resourceName>>/namespaces/{metadata.namespace}/{metadata.name}"
    },
    namespace: {
        title: "名称空间",
        referer: "metadata.namespace",
    },
    creationTimestamp: {
        title: "创建时间",
        referer: "metadata.creationTimestamp"
    },
};



export class ColumnConfig {
    /**
     * Display column title
     * @member {String} title
     */
    title;

    /**
     * use this referer to get the data displayed for this column. Format: ([parent.])*data
     * @member {String} referer
     */
    referer;

    /**
     * If set, this will open detail page. Format: /path1/path2. It will cal the route.
     * You can supply a item property selector using this format: {a.b.c}, e.g /users/{metadata.name}, {metadata.name}
     * will be replaced with item.metadata.name. You can supply a constant placeholder '<<resourceName>>' to be replaced with
     * the real resource name, e.g. users. Then it will be the actual route for React-Router.
     * @member {String} linkTo
     */
    linkTo;

    /**
     * If above two member cannot meet your need, use this function to render your own cell. This comes first when referer,
     * linkTo and renderFunction are all set.
     * @member {Function(item:any)} renderFunction
     */
    renderFunction;

    constructor(title, referer, linkTo, customRenderFunction) {
        this.title = title;
        this.referer = referer;
        this.linkTo = linkTo;
        this.renderFunction = customRenderFunction;
    }
}