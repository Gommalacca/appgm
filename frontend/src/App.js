import React, { useState } from "react";
import { IntlProvider } from "react-intl";
import Layout from "./pages/Layout";
import messages from "./messages";
import { Provider as ReduxProvider } from "react-redux";
import store from "./redux/configureStore";
import AlertTemplate from "react-alert-template-basic";
import { positions, Provider } from "react-alert";

function App() {
  const [locale, setLocale] = useState("it");
  const options = {
    timeout: 10000,
    position: positions.BOTTOM_CENTER,
  };
  return (
    <Provider template={AlertTemplate} {...options}>
      <IntlProvider locale={locale} messages={messages[locale]}>
        <ReduxProvider store={store}>
          <Layout setLocale={setLocale} />
        </ReduxProvider>
      </IntlProvider>
    </Provider>
  );
}

export default App;
