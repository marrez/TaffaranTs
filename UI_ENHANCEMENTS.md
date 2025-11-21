# UI Enhancements - November 21, 2025

## Changes Implemented

### 1. **Toggleable Scoreboard**
- **Location**: `src/pages/Index.tsx`
- **Features**:
  - Added `showScoreboard` state (default: `false`)
  - Replaced Trophy button with BarChart3 icon (Score button) in header
  - Scoreboard now renders as a modal overlay with backdrop blur
  - Click outside or X button to close
  - z-index: 40 (below tutorial at 50)
  - Smooth fade-in animation

### 2. **Face-Down Opponent Cards**
- **Location**: `src/pages/Index.tsx`, `src/components/game/PlayingCard.tsx`
- **Features**:
  - Added `faceDown` prop to `PlayingCard` component
  - When `faceDown={true}`: renders gradient card back with 🂠 emoji
  - Displays all 3 opponent hands (Player 2, 3, 4) above user's hand
  - Shows up to 5 cards with stacked overlap effect (`-ml-6`)
  - Current player's name highlighted with pulse animation
  - Card count displayed for each opponent
  - Only visible during `phase === 'playing'`

### 3. **Contract Status Indicators**
- **Location**: `src/components/game/ContractSelector.tsx`
- **Features**:
  - Added `playedContracts` prop (derived from `availableContracts`)
  - Shows ALL 7 contracts (no longer filtered)
  - Played contracts:
    - 50% opacity
    - Pointer events disabled
    - Green checkmark badge (✓) in top-right corner
    - No hover effects
  - Available contracts: full interactive effects (hover, scale, shadow)
  - Unavailable (future) contracts: 30% opacity

## Technical Details

### PlayingCard Face-Down Styling
```tsx
faceDown={true} renders:
- Gradient: from-slate-800 → via-slate-700 → to-slate-800
- Border: slate-700
- Icon: 🂠 (playing card back emoji)
- Size: controlled by existing `size` prop
```

### Opponent Hand Layout
```tsx
Grid: 3 columns
Stacking: -ml-6 (negative margin for card overlap)
Max visible: 5 cards + count indicator
Responsive: centered with max-width constraint
```

### Scoreboard Overlay
```tsx
Position: fixed inset-0
Backdrop: bg-background/95 + backdrop-blur-sm
Close handlers: outside click + X button
Stop propagation: inner div prevents close on scoreboard click
```

## Files Modified

1. `src/pages/Index.tsx`
   - Import changes: added `PlayingCard`, `BarChart3`, `X`
   - New state: `showScoreboard`
   - Score button with toggle
   - Scoreboard overlay component
   - Opponent hands grid
   - Derived `playedContracts` for ContractSelector

2. `src/components/game/PlayingCard.tsx`
   - Added `faceDown?: boolean` prop
   - Conditional rendering for card back
   - Maintains all existing size/styling props

3. `src/components/game/ContractSelector.tsx`
   - Added `playedContracts?: ContractType[]` prop
   - Imported `Check` icon from lucide-react
   - Renders all contracts with status-based styling
   - Conditional hover/click behavior

## Testing Checklist

- [x] No TypeScript compilation errors
- [x] Dev server starts successfully
- [ ] Score button toggles scoreboard overlay
- [ ] Scoreboard closes on outside click
- [ ] Scoreboard closes on X button
- [ ] Opponent hands show correct card counts
- [ ] Opponent hands update when cards are played
- [ ] Current player indicator works for opponents
- [ ] Played contracts show checkmark
- [ ] Played contracts cannot be selected
- [ ] Available contracts remain interactive
- [ ] Face-down cards render correctly
- [ ] Mobile responsive layout (opponents fit on screen)

## Design Decisions

1. **Card Back**: Chose gradient + emoji for simplicity (vs. complex pattern)
2. **Opponent Layout**: Row layout for mobile compatibility (vs. circular table positioning)
3. **Contract Marking**: Checkmark badge for clarity (kept contract visible for reference)
4. **Scoreboard**: Modal overlay to avoid layout shift (vs. inline toggle)
5. **Z-index**: Tutorial (50) > Scoreboard (40) to maintain tutorial priority

## Future Enhancements

- Add keyboard shortcuts (Esc to close scoreboard)
- Animate opponent card removal on play
- Add card flip animation when revealing tricks
- Consider circular table layout for tablet/desktop breakpoints
- Add sound effects for UI interactions
