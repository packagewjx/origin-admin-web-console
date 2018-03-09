export default class PersistentVolumeSpec {
    /**
     * Name of StorageClass to which this persistent volume belongs. Empty value means that this volume does not belong to any StorageClass.
     * @member {String} storageClassName
     */
    storageClassName;

    /**
     * What happens to a persistent volume when released from its claim. Valid options are Retain (default) and Recycle. Recycling must be supported by the volume plugin underlying this persistent volume. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#reclaiming
     * @member {String} persistentVolumeReclaimPolicy
     */
    persistentVolumeReclaimPolicy;

    /**
     * ClaimRef is part of a bi-directional binding between PersistentVolume and PersistentVolumeClaim. Expected to be non-nil when bound. claim.VolumeName is the authoritative bind between PV and PVC. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#binding
     * @member {ObjectReference} claimRef
     */
    claimRef;

    /**
     * AccessModes contains all ways the volume can be mounted. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes
     * @member {Array.<String>} accessModes
     */
    accessModes;

    /**
     * StorageOS represents a StorageOS volume that is attached to the kubelet's host machine and mounted into the pod More info: https://releases.k8s.io/HEAD/examples/volumes/storageos/README.md
     * @member {StorageOSPersistentVolumeSource} storageos
     */
    storageos;

    /**
     * Local represents directly-attached storage with node affinity
     * @member {LocalVolumeSource} local
     */
    local;

    /**
     * ScaleIO represents a ScaleIO persistent volume attached and mounted on Kubernetes nodes.
     * @member {ScaleIOVolumeSource} scaleIO
     */
    scaleIO;

    /**
     * PortworxVolume represents a portworx volume attached and mounted on kubelets host machine
     * @member {PortworxVolumeSource} portworxVolume
     */
    portworxVolume;

    /**
     * PhotonPersistentDisk represents a PhotonController persistent disk attached and mounted on kubelets host machine
     * @member {PhotonPersistentDiskVolumeSource} photonPersistentDisk
     */
    photonPersistentDisk;

    /**
     * AzureDisk represents an Azure Data Disk mount on the host and bind mount to the pod.
     * @member {AzureDiskVolumeSource} azureDisk
     */
    azureDisk;

    /**
     * FlexVolume represents a generic volume resource that is provisioned/attached using an exec based plugin. This is an alpha feature and may change in future.
     * @member {FlexVolumeSource} flexVolume
     */
    flexVolume;

    /**
     * Flocker represents a Flocker volume attached to a kubelet's host machine and exposed to the pod for its usage. This depends on the Flocker control service being running
     * @member {FlockerVolumeSource} flocker
     */
    flocker;

    /**
     * FC represents a Fibre Channel resource that is attached to a kubelet's host machine and then exposed to the pod.
     * @member {FCVolumeSource} fc
     */
    fc;

    /**
     * CephFS represents a Ceph FS mount on the host that shares a pod's lifetime
     * @member {CephFSVolumeSource} cephfs
     */
    cephfs;

    /**
     * Cinder represents a cinder volume attached and mounted on kubelets host machine More info: https://releases.k8s.io/HEAD/examples/mysql-cinder-pd/README.md
     * @member {CinderVolumeSource} cinder
     */
    cinder;

    /**
     * ISCSI represents an ISCSI Disk resource that is attached to a kubelet's host machine and then exposed to the pod. Provisioned by an admin.
     * @member {ISCSIVolumeSource} iscsi
     */
    iscsi;

    /**
     * RBD represents a Rados Block Device mount on the host that shares a pod's lifetime. More info: https://releases.k8s.io/HEAD/examples/volumes/rbd/README.md
     * @member {RBDVolumeSource} rbd
     */
    rbd;

    /**
     * NFS represents an NFS mount on the host. Provisioned by an admin. More info: https://kubernetes.io/docs/concepts/storage/volumes#nfs
     * @member {NFSVolumeSource} nfs
     */
    nfs;

    /**
     * Glusterfs represents a Glusterfs volume that is attached to a host and exposed to the pod. Provisioned by an admin. More info: https://releases.k8s.io/HEAD/examples/volumes/glusterfs/README.md
     * @member {GlusterfsVolumeSource} glusterfs
     */
    glusterfs;

    /**
     * HostPath represents a directory on the host. Provisioned by a developer or tester. This is useful for single-node development and testing only! On-host storage is not supported in any way and WILL NOT WORK in a multi-node cluster. More info: https://kubernetes.io/docs/concepts/storage/volumes#hostpath
     * @member {HostPathVolumeSource} hostPath
     */
    hostPath;

    /**
     * AWSElasticBlockStore represents an AWS Disk resource that is attached to a kubelet's host machine and then exposed to the pod. More info: https://kubernetes.io/docs/concepts/storage/volumes#awselasticblockstore
     * @member {AWSElasticBlockStoreVolumeSource} awsElasticBlockStore
     */
    awsElasticBlockStore;

    /**
     * GCEPersistentDisk represents a GCE Disk resource that is attached to a kubelet's host machine and then exposed to the pod. Provisioned by an admin. More info: https://kubernetes.io/docs/concepts/storage/volumes#gcepersistentdisk
     * @member {GCEPersistentDiskVolumeSource} gcePersistentDisk
     */
    gcePersistentDisk;

    /**
     * A description of the persistent volume's resources and capacity. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#capacity
     * @member {Object} capacity
     */
    capacity;
}