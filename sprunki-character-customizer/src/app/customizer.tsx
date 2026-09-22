import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type View as ViewType,
} from 'react-native';
import { useCustomizer } from '../context/CharacterContext';
import { useGallery } from '../context/GalleryContext';
import { shareCharacterImage } from '../services/shareService';
import { startPerformAudio, type PerformAudioHandle } from '../audio/performAudio';
import CharacterPreview from '../components/CharacterPreview';
import ColorPicker from '../components/ColorPicker';
import ExpressionSelector from '../components/ExpressionSelector';
import OutfitSelector from '../components/OutfitSelector';
import AccessorySelector from '../components/AccessorySelector';
import BackgroundPicker from '../components/BackgroundPicker';
import SaveButton from '../components/SaveButton';
import ShareButton from '../components/ShareButton';
import type { ScreenProps } from '../types/navigation';
import type { Phase } from '../types/character';

type Props = ScreenProps<'Customizer'>;

const SectionTitle = ({ children, horror }: { children: string; horror?: boolean }): React.ReactElement => (
  <Text style={[styles.sectionTitle, horror && styles.sectionTitleHorror]}>{children}</Text>
);

const PHASE_OPTIONS: { id: Phase; label: string; hint: string }[] = [
  { id: 'normal', label: 'Normal', hint: 'The character as you know them' },
  { id: 'horror', label: 'Horror', hint: 'Their corrupted phase' },
];

const Customizer = ({ navigation }: Props): React.ReactElement => {
  const {
    config,
    setBaseColor,
    setExpression,
    setOutfit,
    toggleAccessory,
    setBackground,
    setPhase,
  } = useCustomizer();
  const { addToGallery } = useGallery();
  const previewRef = useRef<ViewType | null>(null);
  const [busy, setBusy] = useState(false);
  const [performing, setPerforming] = useState(false);
  const [audioStarting, setAudioStarting] = useState(false);
  const audioRef = useRef<PerformAudioHandle | null>(null);
  const horror = config.phase === 'horror';

  const stopAudio = async (): Promise<void> => {
    const handle = audioRef.current;
    audioRef.current = null;
    if (handle) {
      try {
        await handle.stop();
      } catch {
        // stopping is best-effort
      }
    }
  };

  const togglePerform = async (): Promise<void> => {
    if (performing) {
      setPerforming(false);
      await stopAudio();
      return;
    }
    setAudioStarting(true);
    try {
      await stopAudio();
      audioRef.current = await startPerformAudio(config.characterId, config.phase);
      setPerforming(true);
    } catch {
      Alert.alert('No sound', 'Could not start audio on this device, but the dance goes on.');
      setPerforming(true);
    } finally {
      setAudioStarting(false);
    }
  };

  // If the phase flips mid-performance, the song must flip with it.
  useEffect(() => {
    if (!performing) return;
    let cancelled = false;
    (async (): Promise<void> => {
      await stopAudio();
      if (cancelled) return;
      try {
        audioRef.current = await startPerformAudio(config.characterId, config.phase);
      } catch {
        // dance continues without sound
      }
    })();
    return (): void => {
      cancelled = true;
    };
  }, [config.phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // Never leave audio playing after leaving the screen.
  useEffect(() => {
    return (): void => {
      void stopAudio();
    };
  }, []);

  const handleSave = async (): Promise<void> => {
    setBusy(true);
    try {
      await addToGallery(config);
      navigation.navigate('Gallery');
    } finally {
      setBusy(false);
    }
  };

  const handleShare = async (): Promise<void> => {
    setBusy(true);
    try {
      const outcome = await shareCharacterImage(previewRef, config);
      if (outcome === 'text-shared') {
        Alert.alert('Shared', 'Image capture was unavailable, so a text summary was shared instead.');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, horror && styles.containerHorror]}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.previewBlock, horror && styles.previewBlockHorror]}>
        {/* collapsable={false} so react-native-view-shot can capture this view */}
        <View ref={previewRef} collapsable={false} testID="customizer-preview">
          <CharacterPreview config={config} size={300} performing={performing} />
        </View>
        <TouchableOpacity
          testID="perform-button"
          accessibilityRole="button"
          accessibilityLabel={performing ? 'Stop performance' : 'Perform: sing and dance'}
          style={[
            styles.performButton,
            performing && styles.performButtonActive,
            horror && styles.performButtonHorror,
          ]}
          onPress={togglePerform}
          disabled={audioStarting}
        >
          <Text style={styles.performButtonText}>
            {audioStarting ? 'Starting…' : performing ? '■ Stop' : '▶ Perform'}
          </Text>
        </TouchableOpacity>
        {performing && (
          <Text style={[styles.performHint, horror && styles.performHintHorror]}>
            {horror ? 'The corrupted loop — dance if you dare' : 'Singing and dancing on the beat'}
          </Text>
        )}
      </View>

      <SectionTitle horror={horror}>Phase</SectionTitle>
      <View style={styles.phaseRow}>
        {PHASE_OPTIONS.map((option) => {
          const selected = config.phase === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              testID={`phase-${option.id}`}
              accessibilityRole="button"
              accessibilityLabel={`Phase: ${option.label}`}
              style={[
                styles.phaseOption,
                selected && styles.phaseOptionSelected,
                option.id === 'horror' && styles.phaseOptionHorror,
                selected && option.id === 'horror' && styles.phaseOptionHorrorSelected,
              ]}
              onPress={() => setPhase(option.id)}
            >
              <Text
                style={[
                  styles.phaseLabel,
                  selected && styles.phaseLabelSelected,
                  option.id === 'horror' && styles.phaseLabelHorror,
                ]}
              >
                {option.label}
              </Text>
              <Text style={[styles.phaseHint, selected && styles.phaseHintSelected]}>
                {option.hint}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <SectionTitle horror={horror}>Color</SectionTitle>
      <ColorPicker selectedColor={config.baseColor} onSelectColor={setBaseColor} />

      <SectionTitle horror={horror}>Expression</SectionTitle>
      <ExpressionSelector selectedExpression={config.expression} onSelect={setExpression} />

      <SectionTitle horror={horror}>Outfit</SectionTitle>
      <OutfitSelector selectedOutfit={config.outfit} onSelect={setOutfit} />

      <SectionTitle horror={horror}>Accessories</SectionTitle>
      <AccessorySelector selectedAccessories={config.accessories} onToggle={toggleAccessory} />

      <SectionTitle horror={horror}>Background</SectionTitle>
      <BackgroundPicker selectedBackground={config.background} onSelect={setBackground} />

      <View style={styles.buttonRow}>
        <View style={styles.buttonHalf}>
          <SaveButton onPress={handleSave} disabled={busy} />
        </View>
        <View style={styles.buttonHalf}>
          <ShareButton onPress={handleShare} disabled={busy} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  containerHorror: {
    backgroundColor: '#0D0D0D',
  },
  content: {
    paddingBottom: 32,
  },
  previewBlock: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  previewBlockHorror: {
    backgroundColor: '#1A0A0A',
    borderBottomColor: '#7A0E0E',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
  },
  sectionTitleHorror: {
    color: '#FF6B6B',
  },
  performButton: {
    marginTop: 16,
    backgroundColor: '#6200EE',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 28,
    alignItems: 'center',
  },
  performButtonActive: {
    backgroundColor: '#C0392B',
  },
  performButtonHorror: {
    backgroundColor: '#7A0E0E',
  },
  performButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  performHint: {
    marginTop: 8,
    fontSize: 13,
    color: '#666666',
  },
  performHintHorror: {
    color: '#B03A3A',
  },
  phaseRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  phaseOption: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  phaseOptionSelected: {
    borderColor: '#6200EE',
    backgroundColor: '#F0E8FF',
  },
  phaseOptionHorror: {
    backgroundColor: '#FFF5F5',
  },
  phaseOptionHorrorSelected: {
    borderColor: '#C0392B',
    backgroundColor: '#2B0A0A',
  },
  phaseLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#333333',
  },
  phaseLabelSelected: {
    color: '#6200EE',
  },
  phaseLabelHorror: {
    color: '#7A0E0E',
  },
  phaseHint: {
    marginTop: 2,
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
  },
  phaseHintSelected: {
    color: '#666666',
  },
  buttonRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginTop: 12,
  },
  buttonHalf: {
    flex: 1,
    paddingHorizontal: 4,
  },
});

export default Customizer;
