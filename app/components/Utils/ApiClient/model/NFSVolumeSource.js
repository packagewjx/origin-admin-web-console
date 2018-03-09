export default class NFSVolumeSource {
    /**
     * Server is the hostname or IP address of the NFS server. More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs
     * @member {String} server
     */
    server;

    /**
     * Path that is exported by the NFS server. More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs
     * @member {String} path
     */
    path;

    /**
     * ReadOnly here will force the NFS export to be mounted with read-only permissions. Defaults to false. More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs
     * @member {Boolean} readOnly
     */
    readOnly;
}