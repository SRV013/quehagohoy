import { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';

import BottomNav from '../components/BottomNav';
import CategoryList from '../components/CategoryList';
import ExperiencesSection from '../components/ExperiencesSection';
import FilterBar, { DEFAULT_FILTER_VALUES, FilterValues } from '../components/FilterBar';
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
  const [activeQuery, setActiveQuery] = useState('');
  const [filters, setFilters] = useState<FilterValues>(DEFAULT_FILTER_VALUES);
  const [planModalVisible, setPlanModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header />
        <HeroHeading />
        <FilterBar onChange={setFilters} />
        <SearchBar
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            if (text === '') setActiveQuery('');
          }}
          onSubmit={() => setActiveQuery(searchText.trim())}
        />
        <CategoryList />
        <View style={styles.body}>
          <PlansSection />
          <NearbyPlacesSection query={activeQuery} />
          <ExperiencesSection />
          <PromoBanner />
        </View>
      </ScrollView>
      <BottomNav onPressPlan={() => setPlanModalVisible(true)} />
      <PlanGeneratorModal
        visible={planModalVisible}
        filters={filters}
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
