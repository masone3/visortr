import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <main className="app" role="alert">
          <h1>Something went wrong</h1>
          <p>Visortr hit an unexpected error. Reloading usually fixes it.</p>
          <pre style={{ whiteSpace: "pre-wrap", opacity: 0.7 }}>
            {String(this.state.error)}
          </pre>
          <button onClick={() => window.location.reload()}>Reload</button>
        </main>
      );
    }
    return this.props.children;
  }
}