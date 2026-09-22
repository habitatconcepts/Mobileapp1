import React, { useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View, type View as ViewType } from 'react-native';
import { useCustomizer } from '../context/CharacterContext';
import { useGallery } from '../context/GalleryContext';
import { shareCharacterImage } from '../services/shareService';
import CharacterPreview from '../components/CharacterPreview';
import ColorPicker from '../components/ColorPicker';
import ExpressionSelector from '../components/ExpressionSelector';
import OutfitSelector from '../components/OutfitSelector';
import AccessorySelector from '../components/AccessorySelector';
import BackgroundPicker from '../components/BackgroundPicker';
import SaveButton from '../components/SaveButton';
import ShareButton from '../components/ShareButton';
import type { ScreenProps } from '../types/navigation';

type Props = ScreenProps<'Customizer'>;

const SectionTitle = ({ children }: { children: string }): React.ReactElement => (
  <Text style={styles.sectionTitle}>{children}</Text>
);

const Customizer = ({ navigation }: Props): React.ReactElement => {
  const {
    config,
    setBaseColor,
    setExpression,
    setOutfit,
    toggleAccessory,
    setBackground,
  } = useCustomizer();
  const { addToGallery } = useGallery();
  const previewRef = useRef<ViewType | null>(null);
  const [busy, setBusy] = useState(false);

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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.previewBlock}>
        {/* collapsable={false} so react-native-view-shot can capture this view */}
        <View ref={previewRef} collapsable={false} testID="customizer-preview">
          <CharacterPreview config={config} size={300} />
        </View>
      </View>

      <SectionTitle>Color</SectionTitle>
      <ColorPicker selectedColor={config.baseColor} onSelectColor={setBaseColor} />

      <SectionTitle>Expression</SectionTitle>
      <ExpressionSelector selectedExpression={config.expression} onSelect={setExpression} />

      <SectionTitle>Outfit</SectionTitle>
      <OutfitSelector selectedOutfit={config.outfit} onSelect={setOutfit} />

      <SectionTitle>Accessories</SectionTitle>
      <AccessorySelector selectedAccessories={config.accessories} onToggle={toggleAccessory} />

      <SectionTitle>Background</SectionTitle>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
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
