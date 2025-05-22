// src/features/orders/views/ListOrders.test.tsx

import { render, screen } from "@testing-library/react"; // Importation des outils de test
import ListOrders from "./ListOrders"; // Importation du composant à tester
import { BrowserRouter } from "react-router-dom"; // Import du BrowserRouter de react-router-dom pour les tests
import { vi } from "vitest"; // Import de 'vi' pour les mocks

// 1. Mock de la fonction getAllOrders pour simuler un appel API réussi
vi.mock("../services/orders.service", () => ({
  getAllOrders: vi.fn().mockResolvedValueOnce({ data: [] }), // On simule ici un appel API qui retourne une liste vide
}));

describe("ListOrders Component", () => {
  // 2. Test : Vérification du texte de chargement
  test("should display loading text initially", async () => {
    render(
      <BrowserRouter>
        {/* Envelopper le composant avec BrowserRouter */}
        <ListOrders />
      </BrowserRouter>
    );

    // 3. Vérifier que "Chargement en cours..." est dans le DOM
    const loadingText = screen.queryByText(/Chargement en cours.../i);

    // Utilisation de `toBeTruthy()` pour vérifier la présence de l'élément dans le DOM
    expect(loadingText).toBeTruthy(); // L'élément doit être présent dans le DOM
  });
});
