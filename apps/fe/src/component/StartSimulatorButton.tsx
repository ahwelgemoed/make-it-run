type StartSimulator_Comp = {
  name: string;
  type: number;
  device: string;
};

const StartSimulatorButton = (props: StartSimulator_Comp) => {
  const startUpSimulator = async () => {
    const status = await window.android.startupSimulator(props.device);
    let deviceBooted = false;
    do {
      const devDone = await window.android.checkIfBootHasCompleted();
      if (devDone) {
        if (devDone.status === 0) {
          deviceBooted = true;
        }
      }
    } while (!deviceBooted);
    if (deviceBooted) {
      const installedAppName = await window.android.listAllAppsOnDevice(
        props.type
      );
      if (installedAppName) {
        // MX INSTALLED
        installedAppName &&
          (await window.android.openMendixApp(installedAppName));
      }
      if (!installedAppName) {
        await window.android.downloadMendixApps(props.type);
        // MX MUST BE INSTALLED
        await setTimeout(async () => {
          let installedSuccess;
          try {
            installedSuccess = await window.android.installMendixApp(
              props.type
            );
          } catch (error) {
            console.log("error", error);
          }
          if (installedSuccess && installedSuccess.includes("Success")) {
            const getNameOfInstalledApp =
              await window.android.listAllAppsOnDevice(props.type);
            getNameOfInstalledApp &&
              (await window.android.openMendixApp(getNameOfInstalledApp));
          }
        }, 5000);
      }
    }
  };

  return (
    <div>
      <button className="btn btn-secondary btn-sm" onClick={startUpSimulator}>
        {props.name}
      </button>
    </div>
  );
};

export default StartSimulatorButton;
