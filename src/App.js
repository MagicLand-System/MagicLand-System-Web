import RoutesApp from "./routes";
import { PrimeReactProvider } from "primereact/api";
function App() {
  return (
    <PrimeReactProvider>
      <RoutesApp />
    </PrimeReactProvider>
  );
}

export default App;
