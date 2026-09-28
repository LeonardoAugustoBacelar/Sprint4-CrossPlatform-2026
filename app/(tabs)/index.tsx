/**
 * Rota principal — Motiva
 * Monta o estado global e entrega a navegação entre as telas.
 */

import { AppProvider } from "@/src/context/AppContext";
import { AppNavigator } from "@/src/screens/AppNavigator";

export default function Index() {
  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
}
