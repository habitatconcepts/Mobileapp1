import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { expressions } from '../constants/expressions';

interface ExpressionSelectorProps {
  selectedExpression: string;
  onSelect: (expression: string) => void;
}

const ExpressionSelector: React.FC<ExpressionSelectorProps> = ({ selectedExpression, onSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Expression</Text>
      <View style={styles.expressionContainer}>
        {expressions.map((expression) => (
          <TouchableOpacity
            key={expression}
            style={[
              styles.expressionButton,
              selectedExpression === expression && styles.selectedButton,
            ]}
            onPress={() => onSelect(expression)}
          >
            <Text style={styles.expressionText}>{expression}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  expressionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  expressionButton: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  selectedButton: {
    backgroundColor: '#e0e0e0',
  },
  expressionText: {
    fontSize: 16,
  },
});

export default ExpressionSelector;