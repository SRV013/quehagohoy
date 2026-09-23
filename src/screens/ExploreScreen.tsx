import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CategoryGrid from '../components/CategoryGrid';
import NearbyPlacesSection from '../components/NearbyPlacesSection';
import { colors } from '../theme/colors';

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedQuery, setSelectedQuery] = useState('');

  const handleSelect = (key: string, query: string) => {
    if (key === selectedKey) {
      setSelectedKey(null);
      setSelectedQuery('');
      return;
    }
    setSelectedKey(key);
    setSelectedQuery(query);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Explorar</Text>
        <Text style={styles.subtitle}>
          Elegí una categoría para ver los mejores lugares cerca tuyo.
        </Text>
      </View>
      <CategoryGrid selectedKey={selectedKey} onSelectCategory={handleSelect} />
      {selectedQuery ? <NearbyPlacesSection query={selectedQuery} /> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textSecondary,
  },
});
