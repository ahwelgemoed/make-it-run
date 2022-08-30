import spawnAsync from "@expo/spawn-async";
import {
  uniqueNamesGenerator,
  Config,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

import axios from "axios";

import { exec } from "child_process";

import path from "path";
import fs from "fs";
import AdmZip from "adm-zip";

export const dataPath =
  process.env.NODE_ENV === "development"
    ? path.join(__dirname, "../../..")
    : path.join(process.resourcesPath, "data");

const electron = require("electron");
const spawn = require("cross-spawn");

export const witchSimulatorIsInstalled = async () => {
  try {
    // const { stdout } = await spawnAsync("emulator", ["-list-avds"], {
    //   env: {
    //     NODE_ENV: "production",
    //     PATH: process.env.PATH,
    //   },
    // });
    const { stdout } = await spawnAsync("emulator", ["-list-avds"]);
    return stdout;
  } catch (error) {
    console.log("witchSimulatorIsInstalled", error);
    throw new Error("error");
  }
};

export const startupSimulator = async (selectedDevice: string) => {
  // title: "Starting Up",

  exec(`emulator -avd ${selectedDevice}`, (err, stdout, stderr) => {});
};

export const installMendixApp = async (version: number) => {
  // description: `Make It Native V${version}`,

  try {
    if (version === 8) {
      for (let index = 1; index < 5; index++) {
        const { stdout } = await spawnAsync("adb", [
          "install-multiple",
          getApk8(index),
        ]);
        return stdout;
      }
    }
    if (version === 9) {
      console.log("getIDofApk()", getIDofApk());
      const { stdout } = await spawnAsync("adb", [
        "install-multiple",
        getIDofApk(),
      ]);
      return stdout;
    }
  } catch (error) {
    console.log("installMendixApp", error);
    throw new Error("error");
  }
};
const getApk8 = (name: number): string => {
  return `${dataPath}/mx8.apk`;
};
const getIDofApk = (): string => {
  return `${dataPath}/mx9.apk`;
};

export const openMendixApp = async (installedAppName: string) => {
  //   const openAppSusses = new electron.remote.Notification({
  //     title: "Opened",
  //     body: "Make it Native Has Been Opened",
  //     silent: true,
  //   });
  //   openAppSusses.show();
  // toast({
  //   status: "success",
  //   title: "Opening",
  //   description: `${installedAppName}`,
  //   duration: 7000,
  //   position: "top",
  //   isClosable: true,
  // });
  try {
    const { stdout } = await spawnAsync("adb", [
      "shell",
      "monkey",
      `-p ${installedAppName}`,
      "-v 1",
    ]);
    return stdout;
  } catch (error) {
    //   description: `${error}`,

    // openMendixAppSpinner.fail("Mendix App could not be Opened");
    throw new Error("error");
  }
};

export const listAllAppsOnDevice = async (version: number) => {
  try {
    //   package:com.mendix.developerapp
    const { stdout } = await spawnAsync("adb", ["shell", "pm list packages"]);
    const allApps = stdout.split("\n").find((x: any) => {
      if (x.includes("mendix")) {
        if (version === 9 && x.includes("mx9")) {
          return x;
        }
        if (version === 8 && !x.includes("mx9")) {
          return x;
        }
      }
    });
    if (allApps) {
      return allApps.split("package:")[1];
    } else {
      return false;
    }
  } catch (error) {
    console.log("error", error);
  }
};

export const checkIfBootHasCompleted = async () => {
  try {
    const result = await spawnAsync("adb", [
      "shell",
      "am broadcast",
      "-a android.intent.action.ACTION_BOOT_COMPLETED",
    ]);

    return result;
  } catch (error) {
    console.log("error", error);
    return error;
  }
};

export async function downloadMendixApps(version: number) {
  const done = false;
  //   description: `Make It Native V${version}`,

  try {
    const response = await axios.get(
      `https://raw.githubusercontent.com/ahwelgemoed/rg-mx/main/github-images/mx${version}.zip`,
      { responseType: "blob" }
    );

    const blob = await new Blob([response.data], { type: "application/zip" });
    // const downloadUrl = await window.URL.createObjectURL(blob);
    const filePath = `${dataPath}/mx${version}.zip`;
    const buffer = await new Buffer(await blob.arrayBuffer());
    await fs.writeFile(filePath, buffer, async function (err: any) {
      if (err) {
        console.log("downloadMendixApps", err);
        //   description: `${err}`,

        return;
      }
      //   description: `Make It Native V${version}`,
      // title: "Download Done",

      const zip = await new AdmZip(filePath);
      await zip.extractAllTo(`${dataPath}/`, true);
    });

    return done;
  } catch (err) {
    console.log(err);

    // Handle Error Here
    console.error(err);
    return;
  }
}

const getTargetVersion = async () => {
  try {
    const { stdout } = await spawnAsync("avdmanager", ["list", "target"]);
    let y;
    const t = stdout.split("\n").find((x: any) => {
      if (x.includes("API level: ")) {
        const androidV = x.replace("API level: ", "");
        const valueAndroidV = parseInt(androidV);
        return (y = valueAndroidV);
      }
    });
    return y;
  } catch (error) {
    console.log("createAPixelDevice", error);
  }
};

const customConfig: Config = {
  dictionaries: [adjectives, colors, animals],
  separator: "-",
  length: 3,
};

export const createAPixelDevice = async () => {
  const shortName: string = uniqueNamesGenerator(customConfig);
  const target = await getTargetVersion();
  const cmd = [
    "--verbose",
    "create",
    "avd",
    "--force",
    "--name",
    "pooap",
    "--device",
    "pixel",
    "--package",
    "system-images;android-30;google_apis;x86",
    "--tag",
    "google_apis",
    "--abi",
    "x86",
  ];
  console.log("target", target);
  try {
    // avdmanager;
    console.log('"avdmanager", cmd', "avdmanager");

    const { stdout } = await spawnAsync(`avdmanager`, [""]);
    console.log("stdout", stdout);
  } catch (error) {
    console.log("error", error);
  }
};

export const closeAllSimulators = async () => {
  // adb emu kill
  try {
    const { stdout } = await spawnAsync(`adb`, ["emu", "kill"]);
  } catch (error) {
    console.log("error", error);
  }
};
