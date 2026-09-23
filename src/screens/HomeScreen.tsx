import { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';

import BottomNav from '../components/BottomNav';
import CategoryList from '../components/CategoryList';
import ExperiencesSection from '../components/ExperiencesSection';
import Header from '../components/Header';
import HeroHeading from '../components/HeroHeading';
import NearbyPlacesSection from '../components/NearbyPlacesSection';
import PromoBanner from '../components/PromoBanner';
import PromptModal from '../components/PromptModal';
import SearchBar from '../components/SearchBar';
import { colors } from '../theme/colors';

export default function HomeScreen() {
  const [searchText, setSearchText] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [promptModalVisible, setPromptModalVisible] = useState(false);

  const runSearch = (query: string) => {
    setSearchText(query);
    setActiveQuery(query);
  };

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
      <BottomNav onPressPlan={() => setPromptModalVisible(true)} />
      <PromptModal
        visible={promptModalVisible}
        onSubmit={(prompt) => {
          runSearch(prompt);
          setPromptModalVisible(false);
        }}
        onClose={() => setPromptModalVisible(false)}
      />
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
