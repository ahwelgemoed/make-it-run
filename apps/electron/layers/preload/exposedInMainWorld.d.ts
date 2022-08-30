interface Window {
    readonly yerba: { version: number; };
    readonly android: { openMendixApp: any; installMendixApp: any; startupSimulator: any; createAPixelDevice: any; closeAllSimulators: any; downloadMendixApps: any; listAllAppsOnDevice: any; checkIfBootHasCompleted: any; witchSimulatorIsInstalled: any; };
    /**
     * Safe expose node.js API
     * @example
     * window.nodeCrypto('data')
     */
    readonly nodeCrypto: { sha256sum: any; };
}
