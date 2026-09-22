# Sprunki Character Customizer

A mobile app for creating and customizing Sprunki characters. Pick one of four
characters, then customize its color, expression, outfit, accessories, and
background — with a live preview at every step. Save favorites to a persistent
gallery, reload any save to keep editing, and share your creation as an image.

## Features

- **Character Select** — browse the 4-character roster (name, description, live
  preview each); tapping one starts the customizer with that character.
- **Customizer** — large live preview over the selected background image, with
  sections for color swatches, 8 expressions, 5 outfits (+ None), 6 toggleable
  accessories, and 4 backgrounds. Every tap updates the preview instantly.
- **Gallery** — grid of saved characters persisted to AsyncStorage. Tap a save
  to load it back into the customizer; long-press (or the × badge) deletes it
  with confirmation.
- **Profile** — app info, counts (characters customized, saved in gallery),
  and a "Reset all data" button that clears saved gallery data.
- **Share** — captures the preview as a PNG (`react-native-view-shot`) and
  shares it (`expo-sharing`); falls back to a text summary via React Native
  `Share` if capture/sharing is unavailable. Never a dead button.

## Prerequisites

- Node.js (LTS)
- The **Expo Go** app on your phone (for development), or an EAS build for
  distribution

## Install & run

```bash
cd sprunki-character-customizer
npm install
npx expo start
```

Scan the QR code in the terminal with Expo Go (Android) or the Camera app
(iOS) to open the app.

## EAS builds

```bash
# one-time setup
npm install -g eas-cli
eas login
eas build:configure

# builds
eas build -p android --profile preview
eas build -p ios --profile preview
eas build -p android --profile production
eas build -p ios --profile production
```

Build profiles live in `eas.json`.

## Project structure

```
index.js                     # Expo entry: registers src/app/index
src/
  app/
    index.tsx                # thin entry, renders _layout
    _layout.tsx              # providers (once) + typed stack navigator
    character-select.tsx     # roster grid
    customizer.tsx           # live preview + all customization sections
    gallery.tsx              # saved characters grid / empty state
    profile.tsx              # stats, reset-all-data, version
  components/
    CharacterFigure.tsx      # procedural SVG renderer (art-owned)
    CharacterPreview.tsx     # figure over its background image
    CharacterCard.tsx        # roster tile
    ColorPicker.tsx          # color swatch palette
    ExpressionSelector.tsx   # 8 expressions
    OutfitSelector.tsx       # 5 outfits + None
    AccessorySelector.tsx    # 6 accessories, multi-toggle
    BackgroundPicker.tsx     # 4 background thumbnails
    GalleryGrid.tsx          # 2-column saved-character grid
    SaveButton.tsx / ShareButton.tsx
  constants/                 # characters, expressions, outfits,
                             # accessories, backgrounds, colors, theme
  context/
    CharacterContext.tsx     # single source of truth: useCustomizer()
    GalleryContext.tsx       # persisted gallery: useGallery()
  services/
    storageService.ts        # AsyncStorage load/save/clear
    shareService.ts          # view-shot capture -> expo-sharing,
                             # fallback to Share text summary
  types/                     # character, customization, navigation
  utils/
    colorUtils.ts            # hex/rgb helpers
__tests__/
  components/                # CharacterCard, ColorPicker (+ art-owned
                             # CharacterFigure test)
  context/                   # CharacterContext, GalleryContext state tests
  services/                  # shareService tests
assets/backgrounds/          # city, desert, space (+ forest, art-owned)
```

## State model

One source of truth: `CharacterProvider` + `useCustomizer()` in
`src/context/CharacterContext.tsx` exposes the `CharacterConfig`
(characterId, baseColor, expression, outfit, accessories, background) and
setters (`setCharacter`, `setBaseColor`, `setExpression`, `setOutfit`,
`toggleAccessory`, `setBackground`, `replaceConfig`, `reset`). The gallery
(`GalleryProvider` / `useGallery()`) persists `SavedCharacter[]` to
AsyncStorage and can push any save back into the customizer via
`loadIntoCustomizer`. There are no parallel character hooks — the old
`useCharacter`/`useCustomization` hooks were removed.

## Testing & type checks

```bash
npx jest            # run the test suite
npx tsc --noEmit    # strict TypeScript check
npx eslint src __tests__   # lint
```

## Key dependencies

- `expo` ~57.0.0, `react-native` 0.86.3, `react` 19.2.3
- `@react-navigation/native` ^7.0.0, `@react-navigation/stack` ^7.0.0 (typed stack)
- `@react-native-async-storage/async-storage` 2.2.0 (gallery persistence)
- `react-native-view-shot` 5.1.0 (preview capture) + `expo-sharing` ~57.0.0 (image share)
- `react-native-svg` 15.15.4 (procedural character art)
- dev: `typescript` ~6.0.3, `jest` ^29.7.0, `@testing-library/react-native` ^14.0.0, `eslint` ^9.0.0

See `package.json` for the full list. Note: `expo-file-system` is currently
installed but unused — the share flow captures via `react-native-view-shot`
(which writes its own tmpfile), so the dependency can be dropped.
