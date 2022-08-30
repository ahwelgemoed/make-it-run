import React from "react";

const Navbar = () => {
  return (
    <div className="mb-6">
      <div className="navbar bg-base-100 text-primary-content rounded-md">
        <div className="navbar-start">
          <a className="btn btn-ghost normal-case text-xl">MAKE IT RUN</a>
        </div>
        <div className="navbar-end">
          <button
            onClick={window.android.closeAllSimulators}
            className="btn btn-warning btn-sm"
          >
            Stop Simulators
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
