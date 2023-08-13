import * as React from 'react';
import { useState, useEffect, useUpdateEffect, useCallback } from 'react';
import { View, Image, Text, Pressable, StyleSheet, SectionList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createTable, getMenuItems, saveMenuItems, filterByQueryAndCategories } from '../components/database';
import { SearchBar } from 'react-native-screens';
import { validateEmail } from '../utils';
import Filters from '../components/Filters';

const API_URL = 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';

const Home = ({ navigation }) => {
  const sections = ['starters', 'mains', 'desserts'];
  const [filterSelections, setFilterSelections] = useState(sections.map(() => false));
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);
  const [searchBarText, setSearchBarText] = useState('');

  const fetchData = async () => {
    var fetchedData = [];

    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      fetchedData = json.menu.map((item, index) => ({
        id: index + 1, 
        title: item.title, 
        price: item.price, 
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

        if (!menuItems.length) {
          const menuItems = await fetchData();
          saveMenuItems(menuItems);
        }

        const sectionListData = getSectionListData(menuItems);
        setData(sectionListData);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);
  
  useUpdateEffect(() => {
    (async () => {
      const activeCategories = sections.filter((s, i) => {
        if (filterSelections.every((item) => item === false)) {
          return true;
        }
        return filterSelections[i];
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
          <Pressable
           onPress={() => navigation.navigate('Profile')}
          />
      </View>
      
      <View>
        <SearchBar 
          placeholder='Search'
          onChangeText={handleSearchChange}
          value={searchBarText}
        />
      </View>
      <Filters
        selections={filterSelections}
        onChange={handleFiltersChange}
        sections={sections}
      />
      <SectionList
        sections={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          <View>
            <Text>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text>{item.price}</Text>
            <Image source={{uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`}} />
          </View>
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        margin: 10,
    },
    image: {
        width: 150,
        height: 150,
    },
    regularText: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 50,
        marginVertical: 8,
        textAlign: 'center',
        color: 'black',
    },
    inputBox: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        fontSize: 16,
        borderColor: '#EDEFEE',
        backgroundColor: '#EDEFEE',
    },
    buttonEnabled: {
        fontSize: 22,
        padding: 10,
        marginVertical: 8,
        margin: 20,
        backgroundColor: '#495E57',
        borderRadius: 10,
    },
    buttonDisabled: {
        fontSize: 22,
        padding: 10,
        marginVertical: 8,
        margin: 20,
        backgroundColor: '#a3a5a8',
        borderRadius: 10,
    },
    buttonText: {
        color: '#EDEFEE',
        textAlign: 'center',
        fontSize: 18,
    }
})

export default Home;