import { ScrollView, View, StyleSheet } from 'react-native';

import BottomNav from '../components/BottomNav';
import CategoryList from '../components/CategoryList';
import ExperiencesSection from '../components/ExperiencesSection';
import FilterBar from '../components/FilterBar';
import Header from '../components/Header';
import HeroHeading from '../components/HeroHeading';
import NearbyPlacesSection from '../components/NearbyPlacesSection';
import PlansSection from '../components/PlansSection';
import PromoBanner from '../components/PromoBanner';
import SearchBar from '../components/SearchBar';
import { colors } from '../theme/colors';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header />
        <HeroHeading />
        <FilterBar />
        <SearchBar />
        <CategoryList />
        <View style={styles.body}>
          <PlansSection />
          <NearbyPlacesSection />
          <ExperiencesSection />
          <PromoBanner />
        </View>
      </ScrollView>
      <BottomNav />
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
