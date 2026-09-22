import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { ExpressionId } from '../types/character';
import { expressions } from '../constants/expressions';

interface ExpressionSelectorProps {
  selectedExpression: ExpressionId;
  onSelect: (expression: ExpressionId) => void;
}

const ExpressionSelector: React.FC<ExpressionSelectorProps> = ({ selectedExpression, onSelect }) => {
  return (
    <View testID="expression-selector" style={styles.container}>
      <View style={styles.row}>
        {expressions.map((expression) => {
          const selected = expression.id === selectedExpression;
          return (
            <TouchableOpacity
              key={expression.id}
              testID={`expression-${expression.id}`}
              accessibilityRole="button"
              accessibilityLabel={`Expression ${expression.name}`}
              accessibilityState={{ selected }}
              style={[styles.chip, selected && styles.selectedChip]}
              onPress={() => onSelect(expression.id)}
            >
              <Text style={[styles.chipText, selected && styles.selectedChipText]}>
                {expression.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    margin: 4,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  selectedChip: {
    backgroundColor: '#FF6F61',
    borderColor: '#FF6F61',
  },
  chipText: {
    fontSize: 15,
    color: '#333333',
  },
  selectedChipText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default ExpressionSelector;
