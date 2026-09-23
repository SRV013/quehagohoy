import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import CategoryList from '../components/CategoryList';
import ExperiencesSection from '../components/ExperiencesSection';
import Header from '../components/Header';
import HeroHeading from '../components/HeroHeading';
import NearbyPlacesSection from '../components/NearbyPlacesSection';
import PromoBanner from '../components/PromoBanner';
import SearchBar from '../components/SearchBar';
import { MainTabParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Props = BottomTabScreenProps<MainTabParamList, 'Inicio'>;

export default function HomeScreen({ route }: Props) {
  const [searchText, setSearchText] = useState('');
  const [activeQuery, setActiveQuery] = useState('');

  const runSearch = (query: string) => {
    setSearchText(query);
    setActiveQuery(query);
  };

  // Sincronizamos el estado con el prompt que llega desde el modal "Dame ideas"
  // ajustando el estado durante el render, en vez de con un efecto (evita un
  // re-render en cascada): https://react.dev/learn/you-might-not-need-an-effect
  const incomingPrompt = route.params?.prompt;
  const [lastHandledPrompt, setLastHandledPrompt] = useState(incomingPrompt);
  if (incomingPrompt && incomingPrompt !== lastHandledPrompt) {
    setLastHandledPrompt(incomingPrompt);
    runSearch(incomingPrompt);
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header />
        <HeroHeading />
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          onSubmit={() => searchText.trim() && runSearch(searchText.trim())}
        />
        <CategoryList onSelectCategory={runSearch} />
        <View style={styles.body}>
          <NearbyPlacesSection query={activeQuery} />
          <ExperiencesSection />
          <PromoBanner />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  body: {
    backgroundColor: colors.backgroundLight,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 20,
    paddingTop: 4,
    paddingBottom: 8,
  },
});
