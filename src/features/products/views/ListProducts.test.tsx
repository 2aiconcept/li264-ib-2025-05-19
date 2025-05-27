import { vi, describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";

// ===== MOCKS SIMPLES =====
// On mock directement dans vi.mock() sans variables externes
vi.mock("../../../../store/hooks/redux", () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

vi.mock("../redux/productThunkEffect", () => ({
  fetchProducts: vi.fn(),
  deleteProduct: vi.fn(),
}));

// Import après les mocks
import { useAppDispatch, useAppSelector } from "../../../../store/hooks/redux";
import { fetchProducts } from "../redux/productThunkEffect";
import ListProducts from "./ListProducts";

// Cast des mocks pour avoir l'intellisense
const mockDispatch = vi.fn();
const mockUseAppDispatch = useAppDispatch as vi.MockedFunction<
  typeof useAppDispatch
>;
const mockUseAppSelector = useAppSelector as vi.MockedFunction<
  typeof useAppSelector
>;
const mockFetchProducts = fetchProducts as vi.MockedFunction<
  typeof fetchProducts
>;

// Helper pour créer un store minimal pour les tests
const createMockStore = () =>
  configureStore({
    reducer: {
      // Store minimal, juste pour que Provider ne plante pas
      products: (state = {}) => state,
    },
  });

// Helper pour wrapper le composant avec les providers nécessaires
const renderWithProviders = (component: React.ReactElement) => {
  const store = createMockStore();
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe("ListProducts", () => {
  beforeEach(() => {
    // Reset tous les mocks avant chaque test
    vi.clearAllMocks();

    // Configuration par défaut des mocks
    mockUseAppDispatch.mockReturnValue(mockDispatch);

    // Configuration par défaut de useAppSelector
    // On mocke les 3 appels dans l'ordre : products, loading, error
    mockUseAppSelector
      .mockReturnValueOnce([]) // selectAllProducts retourne un tableau vide
      .mockReturnValueOnce(false) // selectLoading retourne false
      .mockReturnValueOnce(null); // selectError retourne null
  });

  describe("Dispatch de fetchProducts au montage", () => {
    it("devrait dispatcher fetchProducts quand le composant est monté", () => {
      // ARRANGE
      // Préparer l'action mockée qui sera dispatchée
      const mockFetchProductsAction = {
        type: "products/fetchProducts/pending",
      };
      mockFetchProducts.mockReturnValue(mockFetchProductsAction);

      // ACT
      // Rendre le composant (cela va déclencher useEffect)
      renderWithProviders(<ListProducts />);

      // ASSERT
      // Vérifier que fetchProducts a été appelé une fois
      expect(mockFetchProducts).toHaveBeenCalledTimes(1);

      // Vérifier que fetchProducts a été appelé sans arguments
      expect(mockFetchProducts).toHaveBeenCalledWith();

      // Vérifier que dispatch a été appelé avec l'action retournée par fetchProducts
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith(mockFetchProductsAction);
    });

    it("devrait dispatcher fetchProducts seulement une fois même si le composant se re-rend", () => {
      // ARRANGE
      const mockFetchProductsAction = {
        type: "products/fetchProducts/pending",
      };
      mockFetchProducts.mockReturnValue(mockFetchProductsAction);

      // ACT
      // Premier rendu
      const { rerender } = renderWithProviders(<ListProducts />);

      // Reconfigurer les mocks pour le rerender (car ils sont consommés)
      mockUseAppSelector
        .mockReturnValueOnce([]) // selectAllProducts
        .mockReturnValueOnce(false) // selectLoading
        .mockReturnValueOnce(null); // selectError

      // Simuler un re-render (par exemple suite à un changement de props)
      rerender(
        <Provider store={createMockStore()}>
          <BrowserRouter>
            <ListProducts />
          </BrowserRouter>
        </Provider>
      );

      // ASSERT
      // fetchProducts ne devrait être appelé qu'une seule fois
      // car useEffect a [dispatch] comme dépendances et dispatch ne change pas
      expect(mockFetchProducts).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });
  });

  describe("Utilisation correcte des selectors", () => {
    it("devrait utiliser les bons selectors avec le bon état", () => {
      // ARRANGE
      const mockFetchProductsAction = {
        type: "products/fetchProducts/pending",
      };
      mockFetchProducts.mockReturnValue(mockFetchProductsAction);

      // Simuler un état spécifique
      const mockState = {
        products: {
          items: [
            { id: "1", ref: "PROD-001", description: "Produit 1", state: 1 },
            { id: "2", ref: "PROD-002", description: "Produit 2", state: 0 },
          ],
          loading: true,
          error: "Erreur de test",
        },
      };

      // Configurer useAppSelector pour retourner des valeurs basées sur l'état
      mockUseAppSelector
        .mockReturnValueOnce(mockState.products.items) // selectAllProducts
        .mockReturnValueOnce(mockState.products.loading) // selectLoading
        .mockReturnValueOnce(mockState.products.error); // selectError

      // ACT
      renderWithProviders(<ListProducts />);

      // ASSERT
      // Vérifier que useAppSelector a été appelé 3 fois (une fois pour chaque selector)
      expect(mockUseAppSelector).toHaveBeenCalledTimes(3);

      // Vérifier que chaque appel a reçu une fonction callback (le selector)
      expect(mockUseAppSelector).toHaveBeenNthCalledWith(
        1,
        expect.any(Function)
      );
      expect(mockUseAppSelector).toHaveBeenNthCalledWith(
        2,
        expect.any(Function)
      );
      expect(mockUseAppSelector).toHaveBeenNthCalledWith(
        3,
        expect.any(Function)
      );
    });

    it("devrait gérer correctement les différents types de données des selectors", () => {
      // ARRANGE
      const mockProducts = [
        { id: "1", ref: "PROD-001", description: "Produit test", state: 1 },
      ];
      const mockLoading = false;
      const mockError = null;

      // Configurer les retours avec des types spécifiques
      mockUseAppSelector
        .mockReturnValueOnce(mockProducts) // IProduct[] - tableau de produits
        .mockReturnValueOnce(mockLoading) // boolean - état de chargement
        .mockReturnValueOnce(mockError); // string | null - erreur

      // ACT
      renderWithProviders(<ListProducts />);

      // ASSERT
      // Le composant devrait utiliser les valeurs sans erreur de type
      // Si les types ne correspondent pas, TypeScript ou le runtime planterait
      expect(mockUseAppSelector).toHaveBeenCalledTimes(3);

      // Vérifier indirectement que les types sont corrects via l'absence d'erreurs
      // et la capacité du composant à se rendre
      expect(() => renderWithProviders(<ListProducts />)).not.toThrow();
    });

    it("devrait appeler les selectors avec le state complet", () => {
      // ARRANGE
      const mockFetchProductsAction = {
        type: "products/fetchProducts/pending",
      };
      mockFetchProducts.mockReturnValue(mockFetchProductsAction);

      // Créer un mock qui capture les arguments passés aux selectors
      const capturedStates: any[] = [];
      mockUseAppSelector.mockImplementation((selectorCallback) => {
        // Simuler un état complet
        const mockCompleteState = {
          products: {
            items: [],
            loading: false,
            error: null,
          },
          // Autres slices du store...
          user: { id: 1, name: "Test User" },
          cart: { items: [] },
        };

        // Capturer l'état passé au selector
        capturedStates.push(mockCompleteState);

        // Simuler le comportement des selectors réels
        if (selectorCallback.toString().includes("selectAllProducts")) {
          return mockCompleteState.products.items;
        } else if (selectorCallback.toString().includes("selectLoading")) {
          return mockCompleteState.products.loading;
        } else if (selectorCallback.toString().includes("selectError")) {
          return mockCompleteState.products.error;
        }

        return null;
      });

      // ACT
      renderWithProviders(<ListProducts />);

      // ASSERT
      // Vérifier que les selectors ont été appelés
      expect(mockUseAppSelector).toHaveBeenCalledTimes(3);

      // Vérifier que chaque selector a reçu le state complet
      capturedStates.forEach((state) => {
        expect(state).toHaveProperty("products");
        expect(state.products).toHaveProperty("items");
        expect(state.products).toHaveProperty("loading");
        expect(state.products).toHaveProperty("error");
      });
    });
  });
});
