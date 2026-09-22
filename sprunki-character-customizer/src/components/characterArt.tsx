import React from 'react';
import { Circle, Ellipse, G, Line, Path, Polygon, Rect, Text } from 'react-native-svg';
import type { AccessoryId, BackgroundId, ExpressionId, OutfitId } from '../types/character';

/**
 * Procedural vector art for the Sprunki character renderer.
 * Canvas is a 240x240 viewBox; the blob body occupies roughly x 58-182, y 44-200.
 * Everything uses thick dark outlines and rounded shapes to match the cute
 * app-icon aesthetic. No image assets — every pixel is drawn.
 */

export const OUTLINE = '#33334D';
const MOUTH_FILL = '#7A2E22';
const BLUSH = '#FF9AA2';
const GOLD = '#FFD93D';

/** Darken (negative amount) or lighten (positive amount) a #RRGGBB hex color. */
export function shade(hex: string, amount: number): string {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  const base = match ? match[1] : '888888';
  const num = parseInt(base, 16);
  const clamp = (v: number): number => Math.min(255, Math.max(0, v));
  const r = clamp((num >> 16) + amount);
  const g = clamp(((num >> 8) & 0xff) + amount);
  const b = clamp((num & 0xff) + amount);
  const hexStr = ((r << 16) | (g << 8) | b).toString(16).toUpperCase();
  const padded = ('000000' + hexStr).slice(-6);
  return `#${padded}`;
}

/** Points string for a star polygon centered at (cx, cy). */
function starPoints(cx: number, cy: number, outer: number, inner: number, n = 5): string {
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI * i) / n - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(' ');
}

/** Four-point sparkle polygon centered at (cx, cy). */
function sparklePoints(cx: number, cy: number, size: number): string {
  const s = size;
  const q = size * 0.25;
  return (
    `${cx},${cy - s} ${cx + q},${cy - q} ${cx + s},${cy} ${cx + q},${cy + q} ` +
    `${cx},${cy + s} ${cx - q},${cy + q} ${cx - s},${cy} ${cx - q},${cy - q}`
  );
}

// ---------------------------------------------------------------------------
// Background wash: a soft tinted disc behind the character so the `background`
// config field visibly changes the render (screens layer the PNG art behind).
// ---------------------------------------------------------------------------

const BACKGROUND_TINTS: Record<BackgroundId, string> = {
  city: '#8EA2C9',
  desert: '#E8C47A',
  forest: '#7FBF7F',
  space: '#5B4B8A',
};

export function BackgroundWash({ background }: { background: BackgroundId }): React.JSX.Element {
  return (
    <G testID={`background-${background}`}>
      <Circle cx={120} cy={120} r={112} fill={BACKGROUND_TINTS[background]} opacity={0.32} />
    </G>
  );
}

// ---------------------------------------------------------------------------
// Body: feet, arms, blob torso, belly highlight.
// ---------------------------------------------------------------------------

export function BodyArt({ baseColor }: { baseColor: string }): React.JSX.Element {
  const outline = shade(baseColor, -60);
  const limb = shade(baseColor, -28);
  return (
    <G testID="character-body">
      {/* feet */}
      <Rect x={80} y={186} width={36} height={30} rx={15} fill={limb} stroke={outline} strokeWidth={5} />
      <Rect x={124} y={186} width={36} height={30} rx={15} fill={limb} stroke={outline} strokeWidth={5} />
      {/* stub arms */}
      <Ellipse cx={50} cy={140} rx={13} ry={24} fill={limb} stroke={outline} strokeWidth={5} transform="rotate(12 50 140)" />
      <Ellipse cx={190} cy={140} rx={13} ry={24} fill={limb} stroke={outline} strokeWidth={5} transform="rotate(-12 190 140)" />
      {/* blob torso */}
      <Rect x={58} y={44} width={124} height={156} rx={58} fill={baseColor} stroke={outline} strokeWidth={6} />
      {/* belly highlight */}
      <Ellipse cx={120} cy={154} rx={36} ry={46} fill="#FFFFFF" opacity={0.22} />
    </G>
  );
}

// ---------------------------------------------------------------------------
// Head topper: a small per-character flourish so `characterId` visibly changes
// the render even when baseColor is recolored.
// ---------------------------------------------------------------------------

export function TopperArt({ characterId, baseColor }: { characterId: number; baseColor: string }): React.JSX.Element {
  const outline = shade(baseColor, -60);
  const variant = ((characterId - 1) % 4 + 4) % 4;
  return (
    <G testID={`character-topper-${characterId}`}>
      {variant === 0 && (
        <>
          <Line x1={120} y1={46} x2={120} y2={22} stroke={outline} strokeWidth={6} strokeLinecap="round" />
          <Circle cx={120} cy={16} r={9} fill={GOLD} stroke={outline} strokeWidth={4} />
        </>
      )}
      {variant === 1 && (
        <>
          <Line x1={106} y1={48} x2={94} y2={24} stroke={outline} strokeWidth={6} strokeLinecap="round" />
          <Line x1={134} y1={48} x2={146} y2={24} stroke={outline} strokeWidth={6} strokeLinecap="round" />
          <Circle cx={92} cy={20} r={8} fill={GOLD} stroke={outline} strokeWidth={4} />
          <Circle cx={148} cy={20} r={8} fill={GOLD} stroke={outline} strokeWidth={4} />
        </>
      )}
      {variant === 2 && (
        <>
          <Polygon points="100,50 94,26 112,42" fill={shade(baseColor, -28)} stroke={outline} strokeWidth={4} strokeLinejoin="round" />
          <Polygon points="120,48 120,22 134,42" fill={shade(baseColor, -28)} stroke={outline} strokeWidth={4} strokeLinejoin="round" />
          <Polygon points="140,50 148,28 128,44" fill={shade(baseColor, -28)} stroke={outline} strokeWidth={4} strokeLinejoin="round" />
        </>
      )}
      {variant === 3 && (
        <>
          <Ellipse cx={64} cy={76} rx={10} ry={16} fill={shade(baseColor, -28)} stroke={outline} strokeWidth={4} transform="rotate(-24 64 76)" />
          <Ellipse cx={176} cy={76} rx={10} ry={16} fill={shade(baseColor, -28)} stroke={outline} strokeWidth={4} transform="rotate(24 176 76)" />
        </>
      )}
    </G>
  );
}

// ---------------------------------------------------------------------------
// Faces: 8 expression variants. Eyes sit around cy=102, mouth around y=140-160.
// ---------------------------------------------------------------------------

function Blush(): React.JSX.Element {
  return (
    <>
      <Ellipse cx={76} cy={132} rx={9} ry={6} fill={BLUSH} opacity={0.75} />
      <Ellipse cx={164} cy={132} rx={9} ry={6} fill={BLUSH} opacity={0.75} />
    </>
  );
}

function HappyFace(): React.JSX.Element {
  return (
    <>
      <Path d="M78 104 Q96 88 114 104" fill="none" stroke={OUTLINE} strokeWidth={7} strokeLinecap="round" />
      <Path d="M126 104 Q144 88 162 104" fill="none" stroke={OUTLINE} strokeWidth={7} strokeLinecap="round" />
      <Path d="M96 136 Q120 168 144 136 Z" fill={MOUTH_FILL} stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
      <Ellipse cx={120} cy={154} rx={11} ry={7} fill="#FF8FA3" />
      <Blush />
    </>
  );
}

function SadFace(): React.JSX.Element {
  return (
    <>
      <Line x1={80} y1={84} x2={108} y2={92} stroke={OUTLINE} strokeWidth={6} strokeLinecap="round" />
      <Line x1={160} y1={84} x2={132} y2={92} stroke={OUTLINE} strokeWidth={6} strokeLinecap="round" />
      <Ellipse cx={96} cy={108} rx={16} ry={18} fill="#FFFFFF" stroke={OUTLINE} strokeWidth={5} />
      <Ellipse cx={144} cy={108} rx={16} ry={18} fill="#FFFFFF" stroke={OUTLINE} strokeWidth={5} />
      <Circle cx={90} cy={114} r={7} fill={OUTLINE} />
      <Circle cx={150} cy={114} r={7} fill={OUTLINE} />
      <Path d="M70 124 q-7 11 0 16 q7 -5 0 -16" fill="#7ED3F7" stroke={OUTLINE} strokeWidth={3} />
      <Path d="M100 158 Q120 142 140 158" fill="none" stroke={OUTLINE} strokeWidth={6} strokeLinecap="round" />
      <Blush />
    </>
  );
}

function AngryFace(): React.JSX.Element {
  return (
    <>
      <Polygon points="76,82 112,96 108,106 72,92" fill={OUTLINE} />
      <Polygon points="164,82 128,96 132,106 168,92" fill={OUTLINE} />
      <Rect x={78} y={100} width={34} height={24} rx={10} fill="#FFFFFF" stroke={OUTLINE} strokeWidth={5} />
      <Rect x={128} y={100} width={34} height={24} rx={10} fill="#FFFFFF" stroke={OUTLINE} strokeWidth={5} />
      <Circle cx={104} cy={112} r={6} fill={OUTLINE} />
      <Circle cx={136} cy={112} r={6} fill={OUTLINE} />
      <Path d="M104 158 Q120 146 136 158" fill="none" stroke={OUTLINE} strokeWidth={6} strokeLinecap="round" />
      <Blush />
    </>
  );
}

function SurprisedFace(): React.JSX.Element {
  return (
    <>
      <Circle cx={96} cy={102} r={22} fill="#FFFFFF" stroke={OUTLINE} strokeWidth={5} />
      <Circle cx={144} cy={102} r={22} fill="#FFFFFF" stroke={OUTLINE} strokeWidth={5} />
      <Circle cx={96} cy={102} r={9} fill={OUTLINE} />
      <Circle cx={144} cy={102} r={9} fill={OUTLINE} />
      <Ellipse cx={120} cy={150} rx={12} ry={15} fill={MOUTH_FILL} stroke={OUTLINE} strokeWidth={4} />
      <Blush />
    </>
  );
}

function ConfusedFace(): React.JSX.Element {
  return (
    <>
      <Line x1={80} y1={88} x2={110} y2={88} stroke={OUTLINE} strokeWidth={6} strokeLinecap="round" />
      <Line x1={130} y1={74} x2={160} y2={74} stroke={OUTLINE} strokeWidth={6} strokeLinecap="round" />
      <Ellipse cx={96} cy={104} rx={16} ry={18} fill="#FFFFFF" stroke={OUTLINE} strokeWidth={5} />
      <Ellipse cx={144} cy={104} rx={16} ry={18} fill="#FFFFFF" stroke={OUTLINE} strokeWidth={5} />
      <Circle cx={102} cy={108} r={7} fill={OUTLINE} />
      <Circle cx={138} cy={108} r={7} fill={OUTLINE} />
      <Path d="M98 152 Q108 145 118 152 Q128 159 138 152" fill="none" stroke={OUTLINE} strokeWidth={5} strokeLinecap="round" />
      <Blush />
    </>
  );
}

function ExcitedFace(): React.JSX.Element {
  return (
    <>
      <Polygon points={starPoints(96, 102, 21, 9)} fill={GOLD} stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
      <Polygon points={starPoints(144, 102, 21, 9)} fill={GOLD} stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
      <Path d="M92 134 Q120 174 148 134 Z" fill={MOUTH_FILL} stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
      <Ellipse cx={120} cy={160} rx={12} ry={8} fill="#FF8FA3" />
      <Polygon points={sparklePoints(50, 58, 10)} fill="#FFF3B0" stroke={OUTLINE} strokeWidth={2} />
      <Polygon points={sparklePoints(190, 62, 12)} fill="#FFF3B0" stroke={OUTLINE} strokeWidth={2} />
      <Blush />
    </>
  );
}

function BoredFace({ baseColor }: { baseColor: string }): React.JSX.Element {
  const lid = shade(baseColor, -18);
  return (
    <>
      <Ellipse cx={96} cy={104} rx={17} ry={15} fill="#FFFFFF" stroke={OUTLINE} strokeWidth={5} />
      <Ellipse cx={144} cy={104} rx={17} ry={15} fill="#FFFFFF" stroke={OUTLINE} strokeWidth={5} />
      <Path d="M76 104 L116 104 L116 90 Q96 82 76 90 Z" fill={lid} stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
      <Path d="M124 104 L164 104 L164 90 Q144 82 124 90 Z" fill={lid} stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
      <Circle cx={96} cy={110} r={6} fill={OUTLINE} />
      <Circle cx={144} cy={110} r={6} fill={OUTLINE} />
      <Line x1={104} y1={156} x2={136} y2={156} stroke={OUTLINE} strokeWidth={6} strokeLinecap="round" />
      <Blush />
    </>
  );
}

function SleepyFace({ baseColor }: { baseColor: string }): React.JSX.Element {
  const zColor = shade(baseColor, -70);
  return (
    <>
      <Path d="M80 104 Q96 112 112 104" fill="none" stroke={OUTLINE} strokeWidth={6} strokeLinecap="round" />
      <Path d="M128 104 Q144 112 160 104" fill="none" stroke={OUTLINE} strokeWidth={6} strokeLinecap="round" />
      <Circle cx={120} cy={150} r={7} fill={MOUTH_FILL} stroke={OUTLINE} strokeWidth={3} />
      <Text x={170} y={54} fontSize={24} fontWeight="bold" fill={zColor}>
        z
      </Text>
      <Text x={186} y={32} fontSize={32} fontWeight="bold" fill={zColor}>
        z
      </Text>
      <Blush />
    </>
  );
}

export function FaceArt({
  expression,
  baseColor,
}: {
  expression: ExpressionId;
  baseColor: string;
}): React.JSX.Element {
  return (
    <G testID={`expression-${expression}`}>
      {expression === 'happy' && <HappyFace />}
      {expression === 'sad' && <SadFace />}
      {expression === 'angry' && <AngryFace />}
      {expression === 'surprised' && <SurprisedFace />}
      {expression === 'confused' && <ConfusedFace />}
      {expression === 'excited' && <ExcitedFace />}
      {expression === 'bored' && <BoredFace baseColor={baseColor} />}
      {expression === 'sleepy' && <SleepyFace baseColor={baseColor} />}
    </G>
  );
}

// ---------------------------------------------------------------------------
// Outfits: torso overlays (drawn before the face so the face stays on top).
// ---------------------------------------------------------------------------

function CasualOutfit(): React.JSX.Element {
  return (
    <>
      <Path d="M78 158 L60 168 L67 184 L80 179 Z" fill="#FFFFFF" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
      <Path d="M162 158 L180 168 L173 184 L160 179 Z" fill="#FFFFFF" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
      <Rect x={78} y={156} width={84} height={44} rx={12} fill="#FFFFFF" stroke={OUTLINE} strokeWidth={5} />
      <Path d="M106 158 Q120 170 134 158" fill="none" stroke={OUTLINE} strokeWidth={4} strokeLinecap="round" />
      <Rect x={132} y={176} width={16} height={12} rx={3} fill="none" stroke={OUTLINE} strokeWidth={3} />
    </>
  );
}

function SportyOutfit(): React.JSX.Element {
  return (
    <>
      <Rect x={78} y={156} width={84} height={44} rx={12} fill="#FFD23F" stroke={OUTLINE} strokeWidth={5} />
      <Line x1={84} y1={174} x2={156} y2={174} stroke="#E63946" strokeWidth={7} />
      <Line x1={84} y1={187} x2={156} y2={187} stroke="#FFFFFF" strokeWidth={7} />
      <Rect x={62} y={54} width={116} height={18} rx={9} fill="#E63946" stroke={OUTLINE} strokeWidth={4} />
      <Rect x={112} y={54} width={16} height={18} fill="#FFFFFF" />
    </>
  );
}

function FormalOutfit(): React.JSX.Element {
  return (
    <>
      <Rect x={100} y={156} width={40} height={44} fill="#FFFFFF" stroke={OUTLINE} strokeWidth={4} />
      <Path d="M72 158 L100 158 L96 200 L72 200 Z" fill="#3D3D55" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
      <Path d="M168 158 L140 158 L144 200 L168 200 Z" fill="#3D3D55" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
      <Circle cx={120} cy={170} r={3.5} fill={OUTLINE} />
      <Circle cx={120} cy={182} r={3.5} fill={OUTLINE} />
      <Circle cx={120} cy={194} r={3.5} fill={OUTLINE} />
      <Polygon points="102,164 102,180 118,172" fill="#C0392B" stroke={OUTLINE} strokeWidth={3} strokeLinejoin="round" />
      <Polygon points="138,164 138,180 122,172" fill="#C0392B" stroke={OUTLINE} strokeWidth={3} strokeLinejoin="round" />
      <Circle cx={120} cy={172} r={6} fill="#A93226" stroke={OUTLINE} strokeWidth={3} />
    </>
  );
}

function FantasyOutfit(): React.JSX.Element {
  return (
    <>
      <Path d="M78 156 Q60 180 66 202 L98 202 Q90 180 92 160 Z" fill="#8E5BE8" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
      <Path d="M162 156 Q180 180 174 202 L142 202 Q150 180 148 160 Z" fill="#8E5BE8" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
      <Ellipse cx={120} cy={152} rx={48} ry={14} fill="#7B4BD6" stroke={OUTLINE} strokeWidth={4} />
      <Polygon points={starPoints(120, 182, 15, 6)} fill={GOLD} stroke={OUTLINE} strokeWidth={3} strokeLinejoin="round" />
    </>
  );
}

function HorrorOutfit(): React.JSX.Element {
  return (
    <>
      <Path
        d="M72 156 L168 156 L172 178 L160 172 L156 190 L144 182 L138 200 L128 188 L120 202 L112 188 L102 200 L96 182 L84 190 L80 172 L68 178 Z"
        fill="#4A2C6A"
        stroke={OUTLINE}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <Rect x={84} y={162} width={18} height={14} rx={4} fill="#6B4A8F" stroke={OUTLINE} strokeWidth={3} strokeDasharray="4 3" />
      <Line x1={100} y1={168} x2={112} y2={180} stroke="#D9D9D9" strokeWidth={3} strokeLinecap="round" />
      <Line x1={112} y1={168} x2={100} y2={180} stroke="#D9D9D9" strokeWidth={3} strokeLinecap="round" />
      <Line x1={136} y1={170} x2={148} y2={182} stroke="#D9D9D9" strokeWidth={3} strokeLinecap="round" />
      <Line x1={148} y1={170} x2={136} y2={182} stroke="#D9D9D9" strokeWidth={3} strokeLinecap="round" />
    </>
  );
}

export function OutfitArt({ outfit }: { outfit: Exclude<OutfitId, null> }): React.JSX.Element {
  return (
    <G testID={`outfit-${outfit}`}>
      {outfit === 'casual' && <CasualOutfit />}
      {outfit === 'sporty' && <SportyOutfit />}
      {outfit === 'formal' && <FormalOutfit />}
      {outfit === 'fantasy' && <FantasyOutfit />}
      {outfit === 'horror' && <HorrorOutfit />}
    </G>
  );
}

// ---------------------------------------------------------------------------
// Accessories. Backpack renders behind the body; everything else in front.
// The scarf is drawn before the face so the mouth stays visible over the wrap.
// ---------------------------------------------------------------------------

export function BackAccessoryArt({ accessory }: { accessory: AccessoryId }): React.JSX.Element | null {
  if (accessory !== 'backpack') return null;
  return (
    <G testID="accessory-backpack">
      <Rect x={30} y={104} width={42} height={76} rx={16} fill="#2ECC71" stroke={OUTLINE} strokeWidth={5} />
      <Rect x={168} y={104} width={42} height={76} rx={16} fill="#2ECC71" stroke={OUTLINE} strokeWidth={5} />
      <Rect x={38} y={140} width={26} height={28} rx={8} fill="#27AE60" stroke={OUTLINE} strokeWidth={3} />
      <Rect x={176} y={140} width={26} height={28} rx={8} fill="#27AE60" stroke={OUTLINE} strokeWidth={3} />
      <Path d="M84 52 Q70 80 60 108" fill="none" stroke="#1E8449" strokeWidth={8} strokeLinecap="round" />
      <Path d="M156 52 Q170 80 180 108" fill="none" stroke="#1E8449" strokeWidth={8} strokeLinecap="round" />
    </G>
  );
}

function SunglassesArt(): React.JSX.Element {
  return (
    <>
      <Line x1={76} y1={98} x2={60} y2={92} stroke={OUTLINE} strokeWidth={4} strokeLinecap="round" />
      <Line x1={164} y1={98} x2={180} y2={92} stroke={OUTLINE} strokeWidth={4} strokeLinecap="round" />
      <Rect x={74} y={88} width={40} height={30} rx={12} fill="#1E1E2E" stroke={OUTLINE} strokeWidth={4} />
      <Rect x={126} y={88} width={40} height={30} rx={12} fill="#1E1E2E" stroke={OUTLINE} strokeWidth={4} />
      <Line x1={114} y1={98} x2={126} y2={98} stroke={OUTLINE} strokeWidth={5} strokeLinecap="round" />
      <Line x1={82} y1={94} x2={94} y2={110} stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.85} />
      <Line x1={134} y1={94} x2={146} y2={110} stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.85} />
    </>
  );
}

function HatArt(): React.JSX.Element {
  return (
    <>
      <Polygon points="120,6 90,62 150,62" fill="#FF6B6B" stroke={OUTLINE} strokeWidth={4} strokeLinejoin="round" />
      <Line x1={106} y1={36} x2={134} y2={36} stroke={GOLD} strokeWidth={6} />
      <Line x1={98} y1={50} x2={142} y2={50} stroke="#4ECDC4" strokeWidth={6} />
      <Circle cx={120} cy={10} r={9} fill="#FFFFFF" stroke={OUTLINE} strokeWidth={4} />
      <Ellipse cx={120} cy={62} rx={34} ry={9} fill="#E85555" stroke={OUTLINE} strokeWidth={4} />
    </>
  );
}

function ScarfArt(): React.JSX.Element {
  return (
    <>
      <Rect x={62} y={150} width={116} height={26} rx={13} fill="#E74C3C" stroke={OUTLINE} strokeWidth={4} />
      <Line x1={92} y1={152} x2={92} y2={174} stroke={GOLD} strokeWidth={5} />
      <Line x1={148} y1={152} x2={148} y2={174} stroke={GOLD} strokeWidth={5} />
      <Rect x={138} y={172} width={22} height={36} rx={8} fill="#C0392B" stroke={OUTLINE} strokeWidth={4} />
      <Line x1={144} y1={208} x2={144} y2={202} stroke={OUTLINE} strokeWidth={3} />
      <Line x1={152} y1={208} x2={152} y2={202} stroke={OUTLINE} strokeWidth={3} />
    </>
  );
}

function EarringsArt(): React.JSX.Element {
  return (
    <>
      <Line x1={56} y1={110} x2={56} y2={118} stroke={OUTLINE} strokeWidth={3} strokeLinecap="round" />
      <Line x1={184} y1={110} x2={184} y2={118} stroke={OUTLINE} strokeWidth={3} strokeLinecap="round" />
      <Circle cx={56} cy={126} r={8} fill={GOLD} stroke={OUTLINE} strokeWidth={3} />
      <Circle cx={184} cy={126} r={8} fill={GOLD} stroke={OUTLINE} strokeWidth={3} />
    </>
  );
}

function NecklaceArt(): React.JSX.Element {
  return (
    <>
      <Path d="M94 160 Q120 198 146 160" fill="none" stroke={GOLD} strokeWidth={5} strokeLinecap="round" />
      <Circle cx={120} cy={190} r={10} fill="#FF5A5A" stroke={OUTLINE} strokeWidth={4} />
      <Circle cx={120} cy={190} r={4} fill="#FFFFFF" opacity={0.8} />
    </>
  );
}

/** Front accessories (sunglasses, hat, earrings, necklace) — drawn after the face. */
export function FrontAccessoryArt({ accessory }: { accessory: AccessoryId }): React.JSX.Element | null {
  if (accessory === 'backpack' || accessory === 'scarf') return null;
  return (
    <G testID={`accessory-${accessory}`}>
      {accessory === 'sunglasses' && <SunglassesArt />}
      {accessory === 'hat' && <HatArt />}
      {accessory === 'earrings' && <EarringsArt />}
      {accessory === 'necklace' && <NecklaceArt />}
    </G>
  );
}

/** Scarf — drawn before the face so the mouth stays visible over the wrap. */
export function ScarfAccessoryArt(): React.JSX.Element {
  return (
    <G testID="accessory-scarf">
      <ScarfArt />
    </G>
  );
}
