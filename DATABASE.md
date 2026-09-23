# AGB CHANTIER — Schéma et Persistance des Données

## Moteur Local : IndexedDB
Base de données : `agb_chantier_db` (Version 1)

### Object Stores Déclarés :
1. `users` : Comptes et profils des intervenants
2. `projects` : Chantiers de construction
3. `clients` : Maîtres d'ouvrage et clients
4. `stakeholders` : Intervenants et partenaires
5. `teams` : Équipes de corps d'état
6. `phases` : Phases de travaux
7. `tasks` : Tâches et activités de chantier
8. `attendance` : Feuilles de présence et pointage
9. `inventory_items` : Matériaux et articles de stock
10. `stock_movements` : Entrées, sorties et transferts
11. `suppliers` : Fiches fournisseurs
12. `purchase_orders` : Bons de commande et livraisons
13. `expenses` : Dépenses de chantier et caisse
14. `budgets` : Lignes budgétaires prévisionnelles
15. `equipments` : Engins, matériels et outillage
16. `site_diary_entries` : Journal quotidien de chantier
17. `photos` : Photos géolocalisées et classées
18. `quality_inspections` : Fiches de contrôle qualité
19. `hse_incidents` : Déclarations d'incidents et sécurité
20. `reservations` : Réserves et non-conformités (OPR)
21. `documents` : Plans, contrats et pièces jointes
22. `receptions` : Procès-verbaux de réception
23. `notifications` : Alertes et rappels
24. `audit_logs` : Journal d'audit et traçabilité
25. `sync_queue` : File d'attente de synchronisation
