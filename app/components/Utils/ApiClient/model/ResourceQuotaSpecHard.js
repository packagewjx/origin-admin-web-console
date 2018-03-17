export default class ResourceQuotaSpecHard {
    /**
     * The sum of CPU requests across all pods in a non-terminal state cannot exceed this value. cpu and requests.cpu are the same value and can be used interchangeably.
     */
    cpu;

    /**
     * The sum of memory requests across all pods in a non-terminal state cannot exceed this value. memory and requests.memory are the same value and can be used interchangeably.
     */
    memory;

    /**
     * The sum of CPU requests across all pods in a non-terminal state cannot exceed this value. cpu and requests.cpu are the same value and can be used interchangeably.
     */
    "requests.cpu";

    /**
     * The sum of memory requests across all pods in a non-terminal state cannot exceed this value. memory and requests.memory are the same value and can be used interchangeably.
     */
    "requests.memory";

    /**
     *
     The sum of CPU limits across all pods in a non-terminal state cannot exceed this value.
     */
    "limits.cpu";

    /**
     *
     The sum of memory limits across all pods in a non-terminal state cannot exceed this value.
     */
    "limits.memory";

    /**
     * The sum of storage requests across all persistent volume claims in any state cannot exceed this value.
     */
    "requests.storage";

    /**
     * The total number of persistent volume claims that can exist in the project.
     */
    persistentvolumeclaims;

    /**
     * The sum of storage requests across all persistent volume claims in any state that have a matching storage class, cannot exceed this value.
     */
    "<storage-class-name>.storageclass.storage.k8s.io/requests.storage";

    /**
     * The total number of persistent volume claims with a matching storage class that can exist in the project.
     */
    "<storage-class-name>.storageclass.storage.k8s.io/persistentvolumeclaims";

    /**
     * The total number of pods in a non-terminal state that can exist in the project.
     */
    pods;

    /**
     * The total number of replication controllers that can exist in the project.
     */
    replicationcontrollers;

    /**
     * The total number of resource quotas that can exist in the project.
     */
    resourcequotas;

    /**
     * The total number of services that can exist in the project.
     */
    services;

    /**
     * The total number of secrets that can exist in the project.
     */
    secrets;

    /**
     * The total number of ConfigMap objects that can exist in the project.
     */
    configmaps;

    /**
     * The total number of image streams that can exist in the project.
     */
    "openshift.io/imagestreams";


}