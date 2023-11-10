import React, { Component } from "react";
import log from "loglevel";
import remote from "loglevel-plugin-remote";

const customJSON = (log) => ({
  msg: log.message,
  level: log.level.label,
  stacktrace: log.stacktrace,
});

// remote.apply(log, { format: customJSON, url: "/logger" });
// log.enableAll();

console.log(log.error("error message"));
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // log the error to our server with loglevel
    // log.error({ error, info });
    // console.log("frontend error", error);
    // console.log("frontend info", info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="text-center mt-5 pt-3">
          {" "}
          <h1>Something went wrong.</h1>{" "}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
