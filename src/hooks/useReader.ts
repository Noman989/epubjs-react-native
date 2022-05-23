import { useContext } from 'react';
import { ReaderContext, ReaderContextProps } from '../context';

export function useReader() {
  const {
    view1,
    view2,
    view3,
    // changeFontSize,
    // changeFontFamily,
    // changeTheme,
    // goToLocation,
    // goPrevious,
    // goNext,
    // getLocations,
    // getCurrentLocation,
    // search,
    // addMark,
    // removeMark,
    // theme,
    // atStart,
    // atEnd,
    // totalLocations,
    // currentLocation,
    // progress,
    // locations,
    // isLoading,
    // key,
    // searchResults,
  } = useContext(ReaderContext);

  return {
    view1,
    view2,
    view3,
    // changeFontSize,
    // changeFontFamily,
    // changeTheme,
    // goToLocation,
    // goPrevious,
    // goNext,
    // getLocations,
    // getCurrentLocation,
    // search,
    // addMark,
    // removeMark,
    // theme,
    // atStart,
    // atEnd,
    // totalLocations,
    // currentLocation,
    // progress,
    // locations,
    // isLoading,
    // key,
    // searchResults,
  } as Pick<
    ReaderContextProps,
    | 'view1'
    | 'view2'
    | 'view3'
    // | 'changeFontSize'
    // | 'changeFontFamily'
    // | 'changeTheme'
    // | 'goToLocation'
    // | 'goPrevious'
    // | 'goNext'
    // | 'getLocations'
    // | 'getCurrentLocation'
    // | 'search'
    // | 'addMark'
    // | 'removeMark'
    // | 'theme'
    // | 'atStart'
    // | 'atEnd'
    // | 'totalLocations'
    // | 'currentLocation'
    // | 'progress'
    // | 'locations'
    // | 'isLoading'
    // | 'key'
    // | 'searchResults'
  >;
}
