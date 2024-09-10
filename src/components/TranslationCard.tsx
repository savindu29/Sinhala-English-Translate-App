// src/components/TranslationCard.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

interface TranslationCardProps {
  text: string;
  translation: string;
}

const TranslationCard: React.FC<TranslationCardProps> = ({ text, translation }) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title>Translation</Title>
        <Paragraph>{translation}</Paragraph>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
  },
});

export default TranslationCard;
