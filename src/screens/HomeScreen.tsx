import { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';

import BottomNav from '../components/BottomNav';
import CategoryList from '../components/CategoryList';
import ExperiencesSection from '../components/ExperiencesSection';
import Header from '../components/Header';
import HeroHeading from '../components/HeroHeading';
import NearbyPlacesSection from '../components/NearbyPlacesSection';
import PlanGeneratorModal from '../components/PlanGeneratorModal';
import PlansSection from '../components/PlansSection';
import PromoBanner from '../components/PromoBanner';
import SearchBar from '../components/SearchBar';
import { colors } from '../theme/colors';

export default function HomeScreen() {
  const [searchText, setSearchText] = useState('');
  const [categoryQuery, setCategoryQuery] = useState('');
  const [planModalVisible, setPlanModalVisible] = useState(false);
  const [planPrompt, setPlanPrompt] = useState('');

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header />
        <HeroHeading />
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          onSubmit={() => {
            if (!searchText.trim()) return;
            setPlanPrompt(searchText.trim());
            setPlanModalVisible(true);
          }}
        />
        <CategoryList
          onSelectCategory={(query) => {
            setSearchText(query);
            setCategoryQuery(query);
          }}
        />
        <View style={styles.body}>
          <PlansSection />
          <NearbyPlacesSection query={categoryQuery} />
          <ExperiencesSection />
          <PromoBanner />
        </View>
      </ScrollView>
      <BottomNav
        onPressPlan={() => {
          setPlanPrompt('');
          setPlanModalVisible(true);
        }}
      />
      <PlanGeneratorModal
        visible={planModalVisible}
        initialPrompt={planPrompt || undefined}
        onClose={() => setPlanModalVisible(false)}
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
