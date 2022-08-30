import { useEffect, useState } from "react";
import Navbar from "./component/Navbar";
import StartSimulatorButton from "./component/StartSimulatorButton";
import WebAccessed from "./component/WebAccessed";

function App() {
  const [listOfSimulatorsInstalled, setListOfSimulatorsInstalled] = useState<
    Array<any> | undefined
  >(undefined);

  const getSimulators = async () => {
    const simulators = await window.android.witchSimulatorIsInstalled();
    const parseSimulators = simulators.split("\n").filter(Boolean);
    setListOfSimulatorsInstalled(parseSimulators);
  };
  useEffect(() => {
    getSimulators();
  }, []);

  if (!window.android) {
    return <WebAccessed />;
  }

  return (
    <div className="h-screen p-6">
      <Navbar />
      {/* <button onClick={window.android.createAPixelDevice}>Create</button> */}
      <div className="overflow-x-auto bg-base-100 p-6 rounded-md">
        <h2 className="normal-case text-xl">Installed Simulators</h2>
        <table className="table w-full">
          <tbody>
            {listOfSimulatorsInstalled?.map((sim) => {
              return (
                <tr key={sim}>
                  <td>{sim}</td>
                  <td>
                    <button
                      className="btn btn-accent btn-sm"
                      onClick={() => window.android.startupSimulator(sim)}
                    >
                      Open Simulator
                    </button>
                  </td>
                  <td>
                    <StartSimulatorButton
                      name="Open MiN 8"
                      type={8}
                      device={sim}
                    />
                  </td>
                  <td>
                    <StartSimulatorButton
                      name="Open MiN 9"
                      type={9}
                      device={sim}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
