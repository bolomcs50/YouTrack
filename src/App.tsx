import AppContainer from "./gui/components/AppContainer";
import { TransactionsProvider } from "./gui/components/TransactionsContextProvider";

function App() {
  return (
    <TransactionsProvider>
      <AppContainer />
    </TransactionsProvider>
  );
}

export default App;
