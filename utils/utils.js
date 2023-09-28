import { useEffect, useRef } from 'react';

export const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

export function getSectionListData(data) {
  var categories = [];
  var sectionListData = [];

  data.map((item) => {
    if (!categories.includes(item.category)) {
      categories.push(item.category);
    }
  })

  categories.map((category) => {
    sectionListData.push({
      title: category.charAt(0).toUpperCase() + category.slice(1),
      data: data.filter((item) => item.category === category)
    });
  });
  
  return sectionListData;
}

export function useUpdateEffect(effect, dependencies = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies)
}