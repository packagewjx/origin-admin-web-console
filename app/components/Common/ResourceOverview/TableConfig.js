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
        linkTo: "<<resourceName>>/<<name>>"
    },
    namespace: {
        title: "命名空间",
        referer: "metadata.namespace"
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
     * if set, this will open detail page. Format: resourceName.objectName. It will cal the route.
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