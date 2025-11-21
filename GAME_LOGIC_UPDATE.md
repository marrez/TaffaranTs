# Modifications de la logique du jeu - 21 Novembre 2025

## Changements implémentés

### 1. **Sélection des jeux en début de partie**
- Nouvelle phase `game-setup` au démarrage
- Composant `GameSetup.tsx` permettant de choisir les contrats à jouer
- Les joueurs peuvent sélectionner 1 à 9 jeux
- Bouton "Tout sélectionner" pour jouer tous les contrats
- Le nombre total de rounds s'adapte dynamiquement : `(nombre de jeux × 4)`

### 2. **Nouveaux contrats**

#### **Salade** 🥗
- Combine toutes les pénalités :
  - No Tricks : -2 points par pli
  - No Queens : -20 points par dame
  - No Hearts : -10 points par cœur
  - King of Hearts : -80 points
  - No Last Two : -10 et -20 points

#### **Belotte** 🎲
- Choix de l'atout obligatoire
- Scoring Belote classique :
  - **Atout** : Valet (20), 9 (14), As (11), 10 (10), Roi (4), Dame (3)
  - **Couleur normale** : As (11), 10 (10), Roi (4), Dame (3), Valet (2)

### 3. **Nouveaux scores**

| Contrat | Ancien Score | Nouveau Score |
|---------|--------------|---------------|
| No Hearts | -2 par cœur, -6 pour l'As | **-10 par cœur** |
| No Queens | -6 par dame | **-20 par dame** |
| King of Hearts | -20 | **-80** |
| No Tricks | -2 par pli (max -26) | -2 par pli (max -16, 8 plis) |
| Trumps | +5 par pli (max +65) | +5 par pli (max +40, 8 plis) |

### 4. **Sélection d'atout**
- Nouvelle phase `trump-selection`
- Composant `TrumpSelector.tsx` avec interface visuelle
- S'active automatiquement pour les contrats **Trumps** et **Belotte**
- Affiche les 4 couleurs avec symboles et noms en français

### 5. **Modifications techniques**

#### Types (`src/types/game.ts`)
```typescript
export type ContractType = 
  | 'no-tricks' | 'no-queens' | 'no-last-two' 
  | 'no-hearts' | 'no-king' | 'trumps' | 'dominoes'
  | 'salade'   // NOUVEAU
  | 'belotte'; // NOUVEAU

export interface GameState {
  // ... 
  phase: 'setup' | 'game-setup' | 'contract-selection' | 
         'trump-selection' | 'doubling' | 'playing' | 'scoring' | 'complete';
  selectedContracts?: ContractType[]; // NOUVEAU
}
```

#### Logique de score (`src/utils/gameLogic.ts`)
- Ajout du paramètre `trumpSuit` à `calculateContractScore()`
- Nouvelle fonction `calculateBelotteScore()` pour le scoring Belote
- Mise à jour de tous les calculs de points

#### Nouveaux composants
1. **`GameSetup.tsx`** : Sélection initiale des contrats
2. **`TrumpSelector.tsx`** : Choix de l'atout

### 6. **Flux de jeu modifié**

```
1. game-setup (nouveau)
   ↓ Sélection des contrats
2. setup
   ↓ Distribution des cartes
3. contract-selection
   ↓ Choix du contrat
4. trump-selection (si Trumps/Belotte)
   ↓ Choix de l'atout
5. playing
   ↓ Jeu des cartes
6. scoring
   ↓ Calcul des points
7. Retour à l'étape 2 ou 8
8. complete (fin de partie)
```

## Interface utilisateur

### GameSetup
- Grille 2 colonnes (responsive)
- Cartes cliquables avec icône, nom, description
- Sélection visuelle avec bordure primaire + checkmark ✓
- Compteur de jeux sélectionnés
- Bouton "Tout sélectionner"

### TrumpSelector
- Grille 2×2 des 4 couleurs
- Symboles de couleur grand format
- Noms en français (Cœurs, Carreaux, Trèfles, Piques)
- Hover effects + animation

### ContractSelector (modifié)
- Affiche tous les contrats (y compris Salade et Belotte)
- Contrats joués : grayed out + checkmark
- Contrats disponibles : interactifs
- Support des nouveaux contrats

## Compatibilité

- ✅ Toutes les fonctionnalités existantes préservées
- ✅ Scoreboard adaptatif au nombre de jeux
- ✅ AI compatible avec les nouveaux contrats
- ✅ Haptics sur toutes les interactions
- ✅ Animations et transitions cohérentes

## Tests recommandés

1. Sélectionner 1 seul jeu et jouer une partie complète
2. Sélectionner tous les jeux (9) et vérifier le compteur de rounds
3. Tester Salade : vérifier cumul des pénalités
4. Tester Belotte : sélection d'atout + scoring correct
5. Vérifier que les nouveaux scores s'affichent correctement
6. Tester sur mobile : responsive des nouvelles interfaces

## Notes de développement

- Salade utilise la logique cumulée de tous les contrats négatifs
- Belotte nécessite toujours un atout (pas de "sans atout")
- Le nombre de rounds total = `selectedContracts.length × 4`
- Phase `game-setup` masque le tutorial par défaut
- Trump selection peut être étendu pour ajouter "Sans Atout" si nécessaire
