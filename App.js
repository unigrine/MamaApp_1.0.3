import React from "react";
import Route from "./routes/index.js";
import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/lib/integration/react";
// import { persister, store } from "./redux";
import { configureStore } from "./store/configureStore";

const store = configureStore();

class App extends React.Component {
  componentDidMount = () => {

  };

  render() {
    return (
      <Provider store={store}>
          <Route />
      </Provider>
    );
  }
}

export default App;
