# Sprunki Character Customizer — Baseline Audit

**Branch:** `phoenix/finish-sprunki` (verified via `git branch --show-current`; `main`/`staging` untouched)
**Audited:** 2026-09-22, read-only (no files modified, no installs, no commits)
**Scope:** `sprunki-character-customizer/` — every file under `src/` and `__tests__/`, `package.json`, `app.json`
**Headline:** The scaffold is complete (~1,200 lines, all intended screens/components present), but the app **cannot compile, cannot boot, and cannot run**. There are 14+ broken imports across files, ~19 missing PNG assets, 4 missing npm packages (plus a bogus one declared), two incompatible state models wired to different screens, and tests that describe an API that doesn't exist. Any import of the asset catalogs alone (`accessories.ts`, `outfits.ts`, `expressions.ts`) crashes Metro at bundle time because `require()` of missing files throws at load.

---

## 1. File-by-file status (`src/` and `__tests__/`)

### `src/app/` — screens
| File | What it does | Status |
|---|---|---|
| `src/app/_layout.tsx` | Stack navigator (react-navigation v6) + wraps everything in `CharacterProvider`/`GalleryProvider` | **Broken** — imports `@react-navigation/native`/`@react-navigation/stack` (not in package.json); navigation can never leave CharacterSelect (no `navigation.navigate` calls anywhere) |
| `src/app/index.tsx` | App entry: duplicates the provider nesting AND a second `<NavigationContainer>` around `<Layout/>` | **Broken** — nested `NavigationContainer` inside `NavigationContainer` is a runtime error; providers nested twice |
| `src/app/character-select.tsx` | FlatList of characters; taps call `selectCharacter(item)` | **Broken** — named-imports `{ useCharacter }` from `hooks/useCharacter` which has only a **default** export |
| `src/app/customizer.tsx` | Main editing screen; preview + 5 selectors + save/share | **Broken** — imports unexported `CharacterContext` (file only exports `CharacterProvider`/`useCharacter`); destructures `character, updateCharacter`, neither of which the provider supplies (`character` shape also wrong: reads `character.accessory/.hat/.color` which don't exist on type `Character`) |
| `src/app/gallery.tsx` | Saved-characters grid screen | **Broken** — imports unexported `GalleryContext`; reads `galleryItems` but provider exposes `gallery` |
| `src/app/profile.tsx` | Lists saved characters via `CharacterCard` | **Broken** — imports unexported `CharacterContext`; reads `savedCharacters` which no state model provides; passes `character={character}` to a component that expects `characterName`/`characterImage`/`customization` |

### `src/context/`
| File | What it does | Status |
|---|---|---|
| `src/context/CharacterContext.tsx` | Global state: `character: Character\|null`, `customization: Customization`, `setCharacter`, `updateCustomization`; exports named `useCharacter` hook | **Broken** — imports type `Customization` from `types/customization`, which **does not exist** (file exports `CustomizationOptions`, `CharacterCustomization`). `CharacterContext` itself is NOT exported, so the three screens importing it fail |
| `src/context/GalleryContext.tsx` | Global state: `gallery: string[]`, `addCharacterToGallery`, `removeCharacterFromGallery`; exports named `useGallery` hook | **Broken** — `GalleryContext` itself is NOT exported, so `hooks/useGallery.ts` and `app/gallery.tsx` importing it fail. Note: gallery holds plain `string[]`, not character objects |

### `src/hooks/`
| File | What it does | Status |
|---|---|---|
| `src/hooks/useCharacter.ts` | Local (non-context) hook: fetches characters, tracks `selectedCharacter` | **Broken** — imports `getCharacters` from `constants/characters`, which only exports `characters`; default export only, but two consumers import it **named** |
| `src/hooks/useCustomization.ts` | Local hook: `customization: CustomizationOptions` + per-field updaters (`updateOutfit`, `addAccessory`, …) | **Works in isolation** — the only state file that compiles; **but** its shape conflicts with `CharacterContext` (§3) and every consumer destructures fields it doesn't return |
| `src/hooks/useGallery.ts` | Thin wrapper over `GalleryContext` | **Broken** — imports unexported `GalleryContext`; destructures `galleryState` which the provider doesn't supply (it supplies `gallery`); `isCharacterInGallery` treats strings as `{id}` objects |
| `src/hooks/useStorage.ts` | AsyncStorage key-value wrapper (`getValue`/`setValue`/`removeValue` via `setValue`) | **Broken at install level** — imports `@react-native-async-storage/async-storage`, not in package.json. Logic itself is sound; nothing calls it |

### `src/components/`
| File | What it does | Status |
|---|---|---|
| `src/components/CharacterCard.tsx` | Card showing one saved character (name, image, customization) | **Broken** — props (`characterName`, `characterImage`, `customization`) don't match how profile.tsx calls it (`character={…}`); imports nonexistent type `Customization`; renders nothing from customization (stub comment) |
| `src/components/CharacterPreview.tsx` | Live preview of current character + customization | **Broken** — named-imports from two default-only hooks; destructures `outfit, accessories, expression, backgroundColor` which `useCustomization` doesn't return; crashes on `selectedCharacter.image` (null on first render); `useCustomization` never returns `backgroundColor` |
| `src/components/ColorPicker.tsx` | Row of tappable color swatches; props `colors`, `selectedColor`, `onSelectColor` | **Works** as a component, but **wired wrong** — customizer.tsx passes `onChange` (unhandled) and no color list; untested |
| `src/components/CustomSlider.tsx` | Labeled `Slider` from `react-native` | **Broken** — `Slider` was **removed from react-native core** (lives in `@react-native-community/slider`, not installed); component is unused anywhere (dead code) |
| `src/components/AccessorySelector.tsx` | Horizontal accessory picker; props `selectedAccessory`, `onAccessorySelect` | **Broken** — treats `accessories` (array of `{id,name,image}` objects) as strings; `keyExtractor={(item) => item}` returns an object; customizer passes `onChange` instead of `onAccessorySelect` |
| `src/components/BackgroundPicker.tsx` | Grid of 4 background thumbnails | **Broken** — `require('../../assets/backgrounds/forest.png')` — file doesn't exist (assets/backgrounds/ has only `city.png`, `desert.png`, `space.png`); unused by any screen (dead code) |
| `src/components/ExpressionSelector.tsx` | Wrap of expression buttons; props `selectedExpression`, `onSelect` | **Broken** — `expressions` are `{id,name,image}` objects but rendered as `<Text>{expression}</Text>` (object child → crash) and `key={expression}` (object key); customizer passes `onChange` instead of `onSelect` |
| `src/components/GalleryGrid.tsx` | 2-column gallery grid using `useGallery()` | **Broken** — takes no props but gallery.tsx passes `item={item}`; reads `galleryItems` from `useGallery()`, which returns `galleryState` etc. (names don't match); both sides broken |
| `src/components/HatSelector.tsx` | Hat picker wired to `useCustomization()` | **Broken** — imports `hats` from `constants/accessories` (not exported, only `accessories`); destructures `selectedHat`/`setSelectedHat` which the hook doesn't return |
| `src/components/OutfitSelector.tsx` | Horizontal outfit picker; props `selectedOutfit`, `onSelectOutfit` | **Broken** — same object-as-string bug as AccessorySelector (`keyExtractor` returns object); customizer passes `onChange` instead of `onSelectOutfit` |
| `src/components/SaveButton.tsx` | "Save Character" button; requires `onSave` prop | **Wired wrong** — customizer renders `<SaveButton />` with no `onSave`; saving is not connected to any state or storage service |
| `src/components/ShareButton.tsx` | RN `Share.share` with `character.name` | **Wired wrong** — customizer renders `<ShareButton />` with no `character` prop → crash on share (`character.name` of undefined) |

### `src/constants/`
| File | What it does | Status |
|---|---|---|
| `src/constants/characters.ts` | 4 hardcoded characters (`id: number`, `name`, `description`, `attributes.{baseColor,height,weight}`) | **Works**, but shape disagrees with `types/character.ts` (`id: string`, plus `outfit`/`accessories`/`color`/`expression`/`background` that are absent here) |
| `src/constants/accessories.ts` | 6 accessories with `require('../../assets/accessories/*.png')` | **Broken** — `assets/accessories/` directory **does not exist**; `require` of missing files throws at bundle time, so importing this module crashes the app |
| `src/constants/outfits.ts` | 5 outfits with `require('../../assets/outfits/*.png')` | **Broken** — `assets/outfits/` **does not exist**; same bundle-time crash |
| `src/constants/expressions.ts` | 8 expressions with `require('../assets/expressions/*.png')` | **Broken twice** — path resolves to `src/assets/expressions/` (should be `../../assets/`); directory doesn't exist either way |
| `src/constants/colors.ts` | Theme palette object | **Works**; unused by any component (all screens use hardcoded hex) — effectively dead code |
| `src/constants/theme.ts` | Full theme (colors incl. horror/normal modes, Roboto fonts) | **Works**; unused everywhere; references `Roboto-Regular` fonts not in `assets/fonts/` — dead code |

### `src/types/`, `src/utils/`, `src/services/`
| File | What it does | Status |
|---|---|---|
| `src/types/character.ts` | `Character` (`id: string`, outfit/accessories/color/expression/background as required strings) + `CharacterData` | **Mismatched** — `id: string` vs `characters.ts` `id: number`; all customization fields required but no character object ever carries them |
| `src/types/customization.ts` | `CustomizationOptions` (all-required strings) + `CharacterCustomization` | **Mismatched** — hooks initialize every field to `null`, violating the non-nullable types; `Customization` (imported by context + CharacterCard) doesn't exist here |
| `src/types/navigation.ts` | `RootStackParamList` for the 4 screens | **Works**; unused (screens don't use typed navigation) |
| `src/utils/colorUtils.ts` | `hexToRgb`/`rgbToHex`/`lightenColor`/`darkenColor` | **Works**; unused anywhere — dead code |
| `src/utils/imageUtils.ts` | `resizeImage` via blob→Image→manipulate pipeline | **Stub** — `createImageFromBlob` and `manipulateImage` have empty bodies (return `undefined`); `resizeImage` therefore resolves `undefined`; unused |
| `src/services/shareService.ts` | Writes customization JSON, shares via `expo-sharing` | **Broken at install level** — imports `expo-file-system` (not in package.json); unused |
| `src/services/storageService.ts` | AsyncStorage save/load/clear under `@sprunki_character_customizations` | **Broken at install level** — AsyncStorage not in package.json; unused |

### `__tests__/`
| File | Covers | Status |
|---|---|---|
| `__tests__/components/CharacterCard.test.tsx` | `CharacterCard` | **Broken** — renders `<CharacterCard character={mockCharacter}/>` (prop doesn't exist); expects `getByTestId('character-card')` (no testID in component); expects text `Outfit: Casual` etc. (component renders none); `Customization` import fails |
| `__tests__/components/ColorPicker.test.tsx` | `ColorPicker` | **Broken** — expects `getByTestId('color-picker')` / `color-button-red` / `selected-color` (no testIDs exist); passes no required props; expects `onChange` callback (component uses `onSelectColor`) |
| `__tests__/hooks/useCharacter.test.ts` | `useCharacter` hook | **Broken** — imports **named** `useCharacter` from `hooks/useCharacter` (default export only); expects API `result.current.character`, `.setCharacterName`, `.addAccessory`, `.removeAccessory`, `.setOutfit` — none exist (hook returns `characters`, `selectedCharacter`, `selectCharacter`, `clearSelection`) |

Also: `@testing-library/react-native` and `@testing-library/react-hooks` are imported by all three test files but **neither is in package.json**; the jest config uses the `react-native` preset but `react-test-renderer` (required by the testing library) is not installed either. `npm test` cannot run as-is.

---

## 2. Broken imports and references (complete list)

**Packages imported but NOT in `package.json`:**
| Import | Used in | In package.json? |
|---|---|---|
| `@react-navigation/native` | `src/app/_layout.tsx`, `src/app/index.tsx` | ❌ |
| `@react-navigation/stack` | `src/app/_layout.tsx` | ❌ |
| `@react-native-async-storage/async-storage` | `src/hooks/useStorage.ts`, `src/services/storageService.ts` | ❌ |
| `expo-file-system` | `src/services/shareService.ts` | ❌ |
| `@testing-library/react-native` | 2 test files | ❌ (dev) |
| `@testing-library/react-hooks` | 1 test file | ❌ (dev) |
| `@react-native-community/slider` (needed — `Slider` removed from RN core) | `src/components/CustomSlider.tsx` | ❌ |
| `react-test-renderer` (needed by testing library) | — | ❌ (dev) |

**Declared but bogus:** `react-navigation@^6.0.0` in `dependencies` — this package does not exist on npm (v6 lives under the `@react-navigation/*` scoped packages). Nothing imports it.

**Symbols imported that don't exist in the source module:**
| Import | File | Actual module exports |
|---|---|---|
| `getCharacters` | `src/hooks/useCharacter.ts:3` ← `constants/characters` | only `characters` |
| `galleryState` | `src/hooks/useGallery.ts:3` ← `context/GalleryContext` | `gallery` (and `GalleryContext` isn't exported at all) |
| `hats` | `src/components/HatSelector.tsx:4` ← `constants/accessories` | only `accessories` |
| `Customization` (type) | `src/context/CharacterContext.tsx:3`, `src/components/CharacterCard.tsx:3` ← `types/customization` | only `CustomizationOptions`, `CharacterCustomization` |
| `CharacterContext` | `src/app/customizer.tsx:4`, `src/app/profile.tsx:4` ← `context/CharacterContext` | only `CharacterProvider`, `useCharacter` (context object not exported) |
| `GalleryContext` | `src/app/gallery.tsx:4`, `src/hooks/useGallery.ts:2` ← `context/GalleryContext` | only `GalleryProvider`, `useGallery` (context object not exported) |
| `{ useCharacter }` named | `src/app/character-select.tsx:4`, `src/components/CharacterPreview.tsx:3` ← `hooks/useCharacter` | default export only |
| `{ useCustomization }` named | `src/components/CharacterPreview.tsx:4`, `src/components/HatSelector.tsx:3` ← `hooks/useCustomization` | default export only |

**Missing PNG assets (`require()` of these throws at Metro bundle time):**
- `assets/accessories/` — entire directory missing (`sunglasses.png`, `hat.png`, `scarf.png`, `earrings.png`, `necklace.png`, `backpack.png`) — imported by `constants/accessories.ts`
- `assets/outfits/` — entire directory missing (`casual.png`, `sporty.png`, `formal.png`, `fantasy.png`, `horror.png`) — imported by `constants/outfits.ts`
- `assets/expressions/` (and `src/assets/expressions/` per the wrong `../` path) — missing (`happy.png`, `sad.png`, `angry.png`, `surprised.png`, `confused.png`, `excited.png`, `sleepy.png`, `bored.png`) — imported by `constants/expressions.ts`
- `assets/backgrounds/forest.png` — missing (only `city.png`, `desert.png`, `space.png` exist) — imported by `components/BackgroundPicker.tsx`
- `assets/splash.png` — referenced by `app.json` splash config, doesn't exist
- `assets/favicon.png` — referenced by `app.json` web config, doesn't exist
- Note: `assets/icon.png` and `assets/adaptive-icon.png` DO exist (both 444,702 bytes — appear to be the same generated image); a `.webp` + generation `.json` for the icon also exist but aren't referenced.

---

## 3. The two competing state models

**Model A — Context (`CharacterContext` + `GalleryContext`), provided at the root in `_layout.tsx`:**
- `CharacterContext` value: `{ character: Character|null, customization: Customization, setCharacter, updateCustomization }`, where `customization = { outfit, accessories, colors, expression }` — note `colors` (object), **no** `hat`, **no** `color` (singular), **no** `background`.
- `GalleryContext` value: `{ gallery: string[], addCharacterToGallery, removeCharacterFromGallery }` — strings, not objects.
- **Consumers:** `customizer.tsx` (expects `character` + `updateCharacter` — neither exists), `profile.tsx` (expects `savedCharacters` — doesn't exist), `gallery.tsx` (expects `galleryItems` — it's `gallery`).

**Model B — Local hooks (`useCharacter` + `useCustomization`), not connected to any provider:**
- `useCharacter` returns `{ characters, selectedCharacter, selectCharacter, clearSelection }`.
- `useCustomization` returns `{ customization: { outfit, accessories, color, expression, background }, updateOutfit, addAccessory, removeAccessory, updateColor, updateExpression, updateBackground }` — note `color` (singular, string), **no** `colors` object, **no** `hat`.
- **Consumers:** `character-select.tsx` (uses `selectCharacter` — but writes to hook-local state, invisible to the customizer screen), `CharacterPreview` (expects `outfit, accessories, expression, backgroundColor` destructured at top level — the hook nests them under `customization`, and has no `backgroundColor`), `HatSelector` (expects `selectedHat`/`setSelectedHat` — don't exist).

**Where they disagree:**
1. Field naming: `colors` (object) vs `color` (string); `background` vs `backgroundColor`; hat exists in neither, but customizer writes `character.hat`.
2. Character shape: `types/character.ts` requires `id: string` + full customization fields; `constants/characters.ts` has `id: number` + `description`/`attributes` and none of the customization fields.
3. Selection flow is severed: selecting a character in Model B (`character-select`) never reaches Model A (customizer reads context), so the customizer always sees `character: null`.
4. Gallery stores `string[]` in the provider, but `GalleryGrid`/`gallery.tsx` treat items as `{id, image}` objects, and `useGallery`'s `isCharacterInGallery` treats them as `{id}` objects — three shapes for the same list.
5. Nothing is persisted: `storageService`/`useStorage` exist but no screen or provider calls them; `SaveButton` has no `onSave`.

---

## 4. `package.json` vs actual imports

Declared (relevant): `expo ~48.0.0`, `react 18.0.0`, `react-native 0.71.0`, `react-dom 18.0.0`, `react-native-gesture-handler ~2.0.0`, `react-native-reanimated ~2.0.0`, `react-native-safe-area-context 4.0.0`, `react-native-screens ~3.0.0`, `expo-font ~11.0.0`, `expo-sharing ~11.0.0`.

- `react`, `react-native`, `expo-sharing` — declared and imported. ✅
- `expo-font` — declared but **never imported**; `theme.ts` references Roboto fonts that aren't bundled in `assets/fonts/` (only a `.gitkeep`-era dir with fonts subfolder present — fonts dir exists but contents unverified; no font loading code exists anyway).
- `react-native-gesture-handler`, `react-native-reanimated`, `react-native-safe-area-context`, `react-native-screens`, `react-dom` — declared, never imported (harmless).
- Missing but imported: `@react-navigation/native`, `@react-navigation/stack`, `@react-native-async-storage/async-storage`, `expo-file-system` (§2 table).
- **Bogus:** `react-navigation@^6.0.0` — not a real npm package; nothing imports it. Must be replaced by the `@react-navigation/*` scoped packages.
- Test-only imports with no devDependencies: `@testing-library/react-native`, `@testing-library/react-hooks`, `react-test-renderer`.
- Note: Expo SDK 48 is end-of-life; `app.json` `updates.fallbackToCacheTimeout: 0` is a deprecated SDK-48-era key.

---

## 5. Tests — coverage and reality check

- `__tests__/` covers exactly 3 units: `CharacterCard`, `ColorPicker`, `useCharacter` hook.
- **None of the three can pass:** all import APIs that don't exist (wrong props, wrong hook shape, nonexistent testIDs — §1 table). They describe a *third*, aspirational API (`setCharacterName`, `addAccessory`, `onChange`, `testID="character-card"`) matching neither state model.
- No coverage for: navigation, contexts, gallery, storage/share services, utils, selectors, customizer screen.
- Test infra itself is missing (`@testing-library/*`, `react-test-renderer` not installed), so `npm test` fails before running anything.

---

## 6. `app.json` — store-readiness gaps

Present: `name` ("Sprunki Character Customizer"), `slug`, `version 1.0.0`, `orientation: portrait`, `icon` (file exists), `splash` config, `android.adaptiveIcon` (file exists), `ios.supportsTablet`.
Missing / problems:
- **`splash.image` → `./assets/splash.png` does not exist** (splash will fail).
- **`web.favicon` → `./assets/favicon.png` does not exist.**
- **No `ios.bundleIdentifier`** (required for App Store / TestFlight builds).
- **No `android.package`** (required for Play Store builds).
- No `versionCode`/`buildNumber`, no `runtimeVersion`/`updates.url` strategy, no `permissions` scoping, no `privacy`/`description` metadata.
- `icon.png` and `adaptive-icon.png` are byte-identical files (likely a placeholder duplicated, not a proper adaptive-icon foreground).

---

## 7. TODO/FIXME/placeholder scan

`grep -rn "TODO\|FIXME\|placeholder\|PLACEHOLDER\|lorem" src/ README.md` → **no hits**. Placeholders instead take the form of:
- Empty-function stubs: `createImageFromBlob`, `manipulateImage` in `src/utils/imageUtils.ts` (empty bodies, `// Logic to …` comments) — `resizeImage` silently resolves `undefined`.
- Stub comments: `CharacterCard.tsx` (`{/* Additional customization options can be displayed here */}`), `ShareButton.tsx` (`// shared`, `// dismissed` no-ops).
- Unused-but-present modules: `CustomSlider`, `BackgroundPicker`, `colorUtils`, `theme`, `colors`, `navigation` types, both storage modules — wired to nothing.
