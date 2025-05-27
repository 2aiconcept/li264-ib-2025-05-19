// features/orders/tests/ListOrders.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import ListOrders from "../views/ListOrders";
import type { OrderI } from "../interfaces/order.interface";
import { StateOrder, STATE_ORDER_LABELS } from "../enums/state-order.enum";

// Mock du module de navigation pour capturer les appels
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock des fonctions de preload
vi.mock("../orders.routes", () => ({
  preloadAddOrder: vi.fn(),
  preloadEditOrder: vi.fn(),
}));

// Mock du service orders avec des implémentations par défaut
vi.mock("../services/orders.service", () => ({
  getAllOrders: vi.fn(),
  updateOrderState: vi.fn(),
  deleteOrder: vi.fn(),
}));

// Mock des utilitaires
vi.mock("../../../utils/total", () => ({
  total: vi.fn((unitPrice: number, nbDays: number, vat?: number) => {
    const ht = unitPrice * nbDays;
    return vat ? ht * (1 + vat / 100) : ht;
  }),
}));

vi.mock("../../../utils/currency", () => ({
  formatCurrency: vi.fn(
    (amount: number, currency = "EUR", locale = "fr-FR") => {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
      }).format(amount);
    }
  ),
}));

// Import des mocks après leur définition
import {
  getAllOrders,
  updateOrderState,
  deleteOrder,
} from "../services/orders.service";
import { preloadAddOrder, preloadEditOrder } from "../orders.routes";

describe("ListOrders", () => {
  // Helper pour render avec Router
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  // Données de test réutilisables
  const mockOrders: OrderI[] = [
    {
      id: "1",
      customer: "Entreprise ABC",
      type: "Formation",
      unitPrice: 1000,
      nbOfDays: 5,
      vat: 20,
      state: StateOrder.OPTION,
      comment: "",
    },
    {
      id: "2",
      customer: "Société XYZ",
      type: "Développement",
      unitPrice: 800,
      nbOfDays: 10,
      vat: 20,
      state: StateOrder.CONFIRMED,
      comment: "",
    },
  ];

  beforeEach(() => {
    // Reset tous les mocks avant chaque test
    vi.clearAllMocks();
    // Reset du navigate pour éviter les effets de bord
    mockNavigate.mockReset();
  });

  afterEach(() => {
    // Nettoyage après chaque test
    vi.restoreAllMocks();
  });

  describe("Test 1: Affichage de la liste des commandes avec calculs", () => {
    it("devrait charger et afficher correctement la liste des commandes avec tous les calculs", async () => {
      // ===== ARRANGE =====
      // Configuration du mock pour retourner nos commandes de test
      vi.mocked(getAllOrders).mockResolvedValue(mockOrders);

      // ===== ACT =====
      // Render du composant
      renderWithRouter(<ListOrders />);

      // ===== ASSERT - Phase 1: État de chargement =====
      // Vérifier que le message de chargement s'affiche initialement
      expect(screen.getByText("Chargement en cours...")).toBeInTheDocument();

      // ===== ASSERT - Phase 2: Après chargement =====
      // Attendre que le chargement soit terminé et que le tableau apparaisse
      await waitFor(() => {
        expect(
          screen.queryByText("Chargement en cours...")
        ).not.toBeInTheDocument();
      });

      // Vérifier que getAllOrders a été appelé exactement une fois
      expect(getAllOrders).toHaveBeenCalledTimes(1);

      // ===== ASSERT - Vérification du titre et du bouton d'ajout =====
      expect(
        screen.getByRole("heading", { name: /list orders/i })
      ).toBeInTheDocument();

      const addButton = screen.getByRole("button", { name: /add order/i });
      expect(addButton).toBeInTheDocument();
      expect(addButton).toHaveClass("btn", "btn-primary");

      // ===== ASSERT - Vérification de la structure du tableau =====
      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
      expect(table).toHaveClass("table", "table-hover", "table-bordered");

      // Vérifier tous les en-têtes de colonnes
      const headers = [
        "Customer",
        "Type",
        "Unit Price",
        "Duration",
        "Total Ex. taxes",
        "Total Inc. taxes",
        "State",
        "Actions",
      ];
      headers.forEach((header) => {
        expect(
          screen.getByRole("columnheader", { name: header })
        ).toBeInTheDocument();
      });

      // ===== ASSERT - Vérification des données de la première commande =====
      // Commande 1: Entreprise ABC
      expect(screen.getByText("Entreprise ABC")).toBeInTheDocument();
      expect(screen.getByText("Formation")).toBeInTheDocument();
      expect(screen.getByText("1000")).toBeInTheDocument(); // Unit price
      expect(screen.getByText("5")).toBeInTheDocument(); // Duration

      // Vérifier les calculs (HT: 1000 * 5 = 5000€, TTC: 5000 * 1.2 = 6000€)
      expect(screen.getByText("5 000,00 €")).toBeInTheDocument(); // Total HT formaté
      expect(screen.getByText("$6,000.00")).toBeInTheDocument(); // Total TTC en USD

      // ===== ASSERT - Vérification du select d'état =====
      const selects = screen.getAllByRole("combobox");
      expect(selects).toHaveLength(2); // Un select par commande

      // Vérifier que le premier select a la bonne valeur sélectionnée
      const firstSelect = selects[0] as HTMLSelectElement;
      expect(firstSelect.value).toBe(String(StateOrder.OPTION));

      // Vérifier que toutes les options sont présentes
      const options = screen.getAllByRole("option");
      const expectedOptionsCount = Object.keys(STATE_ORDER_LABELS).length * 2; // 2 selects
      expect(options).toHaveLength(expectedOptionsCount);

      // ===== ASSERT - Vérification des boutons d'action =====
      const editButtons = screen.getAllByRole("button", { name: /edit/i });
      expect(editButtons).toHaveLength(2);
      expect(editButtons[0]).toHaveClass("btn", "btn-warning", "btn-sm");

      const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
      expect(deleteButtons).toHaveLength(2);
      expect(deleteButtons[0]).toHaveClass("btn", "btn-danger", "btn-sm");

      // ===== ASSERT - Vérification de la classe CSS selon l'état =====
      const rows = screen.getAllByRole("row");
      // rows[0] est le header, donc on commence à 1
      expect(rows[1]).toHaveClass("state-option"); // STATE_ORDER_LABELS[0] = 'Option'
      expect(rows[2]).toHaveClass("state-confirmed"); // STATE_ORDER_LABELS[1] = 'Confirmed'
    });
  });

  describe("Test 2: Gestion des erreurs et états vides", () => {
    it("devrait afficher un message d'erreur quand le chargement échoue", async () => {
      // ===== ARRANGE =====
      const errorMessage = "Impossible de charger les commandes";
      // Configuration du mock pour simuler une erreur
      vi.mocked(getAllOrders).mockRejectedValue(new Error(errorMessage));

      // ===== ACT =====
      renderWithRouter(<ListOrders />);

      // ===== ASSERT - État initial =====
      expect(screen.getByText("Chargement en cours...")).toBeInTheDocument();

      // ===== ASSERT - Après l'erreur =====
      await waitFor(() => {
        // Le message de chargement doit disparaître
        expect(
          screen.queryByText("Chargement en cours...")
        ).not.toBeInTheDocument();
      });

      // Vérifier l'affichage de l'erreur
      const errorAlert = screen.getByText(errorMessage);
      expect(errorAlert).toBeInTheDocument();
      expect(errorAlert).toHaveClass("alert", "alert-danger");

      // Vérifier que le tableau n'est pas affiché
      expect(screen.queryByRole("table")).not.toBeInTheDocument();

      // Le bouton Add Order doit toujours être présent
      expect(
        screen.getByRole("button", { name: /add order/i })
      ).toBeInTheDocument();
    });

    it("devrait afficher un tableau vide quand il n'y a pas de commandes", async () => {
      // ===== ARRANGE =====
      // Mock pour retourner un tableau vide
      vi.mocked(getAllOrders).mockResolvedValue([]);

      // ===== ACT =====
      renderWithRouter(<ListOrders />);

      // ===== ASSERT =====
      // Attendre la fin du chargement
      await waitFor(() => {
        expect(
          screen.queryByText("Chargement en cours...")
        ).not.toBeInTheDocument();
      });

      // Le tableau doit être présent mais sans lignes de données
      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();

      // Vérifier qu'il n'y a que la ligne d'en-tête
      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(1); // Seulement le header

      // Pas de boutons Edit ou Delete
      expect(
        screen.queryByRole("button", { name: /edit/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /delete/i })
      ).not.toBeInTheDocument();
    });
  });

  describe("Test 3: Interactions utilisateur (changement d'état et suppression)", () => {
    it("devrait permettre de changer l'état d'une commande et de la supprimer", async () => {
      // ===== ARRANGE =====
      const user = userEvent.setup();
      vi.mocked(getAllOrders).mockResolvedValue(mockOrders);

      // Mock pour la mise à jour d'état
      vi.mocked(updateOrderState).mockImplementation((order, newState) => {
        return Promise.resolve({ ...order, state: newState });
      });

      // Mock pour la suppression
      vi.mocked(deleteOrder).mockResolvedValue(undefined);

      // ===== ACT - Render initial =====
      renderWithRouter(<ListOrders />);

      // Attendre que les données soient chargées
      await waitFor(() => {
        expect(screen.getByText("Entreprise ABC")).toBeInTheDocument();
      });

      // ===== TEST 1: Changement d'état =====
      // Récupérer le premier select (commande Entreprise ABC)
      const selects = screen.getAllByRole("combobox");
      const firstSelect = selects[0] as HTMLSelectElement;

      // Vérifier l'état initial
      expect(firstSelect.value).toBe(String(StateOrder.OPTION));

      // Changer l'état vers CONFIRMED
      await user.selectOptions(firstSelect, String(StateOrder.CONFIRMED));

      // ===== ASSERT - Changement d'état =====
      // Vérifier que updateOrderState a été appelé avec les bons paramètres
      expect(updateOrderState).toHaveBeenCalledWith(
        mockOrders[0], // La première commande
        StateOrder.CONFIRMED // Le nouvel état
      );

      // Attendre que le state soit mis à jour dans le DOM
      await waitFor(() => {
        expect(firstSelect.value).toBe(String(StateOrder.CONFIRMED));
      });

      // ===== TEST 2: Navigation avec preload =====
      const addButton = screen.getByRole("button", { name: /add order/i });

      // Simuler le hover pour le preload
      fireEvent.mouseEnter(addButton);
      expect(preloadAddOrder).toHaveBeenCalled();

      // Cliquer sur le bouton
      await user.click(addButton);
      expect(mockNavigate).toHaveBeenCalledWith("/orders/add");

      // Test du bouton Edit avec preload
      const editButtons = screen.getAllByRole("button", { name: /edit/i });
      fireEvent.mouseEnter(editButtons[0]);
      expect(preloadEditOrder).toHaveBeenCalled();

      await user.click(editButtons[0]);
      expect(mockNavigate).toHaveBeenCalledWith("/orders/edit/1");

      // ===== TEST 3: Suppression avec confirmation =====
      // Mock de window.confirm pour accepter
      const confirmSpy = vi.spyOn(window, "confirm");
      confirmSpy.mockReturnValue(true);

      // Récupérer le premier bouton Delete
      const deleteButtons = screen.getAllByRole("button", { name: /delete/i });

      // Cliquer sur Delete
      await user.click(deleteButtons[0]);

      // ===== ASSERT - Suppression =====
      // Vérifier que la confirmation a été demandée
      expect(confirmSpy).toHaveBeenCalledWith(
        "Do you really want to delete this order ?"
      );

      // Vérifier que deleteOrder a été appelé
      expect(deleteOrder).toHaveBeenCalledWith("1");

      // Attendre que la commande soit supprimée du DOM
      await waitFor(() => {
        expect(screen.queryByText("Entreprise ABC")).not.toBeInTheDocument();
      });

      // Vérifier qu'il ne reste qu'une commande
      const remainingRows = screen.getAllByRole("row");
      expect(remainingRows).toHaveLength(2); // Header + 1 data row

      // ===== TEST 4: Annulation de suppression =====
      // Configurer confirm pour retourner false
      confirmSpy.mockReturnValue(false);

      // Essayer de supprimer la deuxième commande
      const remainingDeleteButton = screen.getByRole("button", {
        name: /delete/i,
      });
      await user.click(remainingDeleteButton);

      // Vérifier que deleteOrder n'a pas été appelé une deuxième fois
      expect(deleteOrder).toHaveBeenCalledTimes(1);

      // La commande doit toujours être présente
      expect(screen.getByText("Société XYZ")).toBeInTheDocument();

      // Cleanup
      confirmSpy.mockRestore();
    });
  });
});
