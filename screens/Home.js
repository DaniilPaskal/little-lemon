import * as React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Image, Text, Pressable, StyleSheet, SectionList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import debounce from 'lodash.debounce';
import { createTable, getMenuItems, saveMenuItems, filterByQueryAndCategories } from '../components/database';
import { Searchbar } from 'react-native-paper';
import { getSectionListData, useUpdateEffect } from '../utils/utils';
import Filters from '../components/Filters';

const API_URL = 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';

const Item = ({ name, price, description, image }) => (
  <View style={styles.item}>
    <View style={styles.itemInfo}>
      <Text style={styles.itemText}>{name}</Text>
      <Text>{description}</Text>
      <Text>${price}</Text>
    </View>
    <Image style={styles.itemImage} source={{uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${image}?raw=true`}} />
  </View>
);

const Home = ({ navigation }) => {
  const sections = ['starters', 'mains', 'desserts'];
  const [filterSelections, setFilterSelections] = useState(sections.map(() => false));
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);
  const [user, setUser] = useState({});
  const [searchBarText, setSearchBarText] = useState('');

  const fetchData = async () => {
    var fetchedData = [];

    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      fetchedData = json.menu.map((item, index) => ({
        id: index + 1,
        name: item.name,
        price: item.price.toString(),
        description: item.description,
        image: item.image,
        category: item.category
      }));
    } catch (e) {
      console.error(e);
    } finally {
      return fetchedData;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await createTable();
        var menuItems = await getMenuItems();

        if (menuItems.length === 0) {
          const menuItems = await fetchData();
          saveMenuItems(menuItems);
        }

        const sectionListData = getSectionListData(menuItems);
        const user = await AsyncStorage.getItem('user');

        setData(sectionListData);
        setUser(JSON.parse(user));
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);
  
  useUpdateEffect(() => {
    (async () => {
      const activeCategories = sections.filter((s, index) => {
        if (filterSelections.every((item) => item === false)) {
          return true;
        }
        return filterSelections[index];
      });
      
      try {
        const menuItems = await filterByQueryAndCategories(query, activeCategories);
        const sectionListData = getSectionListData(menuItems);

        setData(sectionListData);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [filterSelections, query]);

  const lookup = useCallback((q) => {
    setQuery(q);
  }, []);

  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

  const handleSearchChange = (text) => {
    setSearchBarText(text);
    debouncedLookup(text);
  };

  const handleFiltersChange = async (index) => {
    const arrayCopy = [...filterSelections];
    arrayCopy[index] = !filterSelections[index];
    setFilterSelections(arrayCopy);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
          <Image
              style={styles.image}
              source={require('../assets/little-lemon-logo.png')}
              resizeMode='contain'
              accessible={true}
              accessibilityLabel={'Little Lemon Logo'}
          />
          <Pressable style={styles.avatarContainer} onPress={() => navigation.navigate('Profile')}>
            {user.image ? (
              <Image style={styles.avatar} source={{ uri: user.image }} />
            ) : (
              <View style={styles.emptyAvatar}>
                <Text style={styles.emptyAvatarText}>
                  {user.firstName && user.firstName.charAt(0).toUpperCase()}
                  {user.firstName && user.lastName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </Pressable>
      </View>
      
      <View>
        <Text style={styles.regularText}>
          Order from our menu below!
        </Text>
        <Searchbar
          placeholder="Search"
          placeholderTextColor="white"
          onChangeText={handleSearchChange}
          value={searchBarText}
          style={styles.searchBar}
          iconColor="white"
          inputStyle={{ color: 'white' }}
          elevation={0}
        />
      </View>
      <Filters
        selections={filterSelections}
        onChange={handleFiltersChange}
        sections={sections}
      />
      <SectionList
        style={styles.sectionList}
        sections={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Item name={item.name} price={item.price} description={item.description} image={item.image} />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  sectionList: {
    paddingHorizontal: 16,
  },
  searchBar: {
    marginBottom: 24,
    backgroundColor: '#495E57',
    shadowRadius: 0,
    shadowOpacity: 0,
  },
  itemHeader: {
    fontSize: 24,
    paddingVertical: 8,
    color: '#FBDABB',
    backgroundColor: '#495E57',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  itemInfo: {
    flex: 1,
  }, 
  title: {
    fontSize: 20,
    color: 'white',
  },
  image: {
    width: 50,
    height: 150,
  },
  avatarContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 50,
  },
  emptyAvatar: {
    width: 75,
    height: 75,
    borderRadius: 50,
    backgroundColor: '#495E57',
  },
  emptyAvatarText: {
      fontSize: 32,
      color: '#FFF',
      textAlign: 'center',
      marginTop: 12
  },
  regularText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  }
})

export default Home;