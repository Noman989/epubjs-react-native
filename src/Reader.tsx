import React, { useContext, useEffect, useRef } from 'react';
import { View, TouchableWithoutFeedback, Text, useWindowDimensions } from 'react-native';
import {
  Directions,
  FlingGestureHandler,
  GestureHandlerRootView,
  State,
} from 'react-native-gesture-handler';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { defaultTheme as initialTheme, ReaderContext } from './context';
import { Pager } from './Pager';
import template from './template';
import type { ReaderProps } from './types';
import ViewPager from 'react-native-pager-view';
import PagerView from 'react-native-pager-view';
import { BookView } from './BookView';

export function Reader({
  src,
  onStarted = () => {},
  onReady = () => {},
  onDisplayError = () => {},
  onResized = () => {},
  onLocationChange = () => {},
  onRendered = () => {},
  onSearch = () => {},
  onLocationsReady = () => {},
  onSelected = () => {},
  onMarkPressed = () => {},
  onOrientationChange = () => {},
  onLayout = () => {},
  onNavigationLoaded = () => {},
  onBeginning = () => {},
  onFinish = () => {},
  onPress = () => {},
  onDoublePress = () => {},
  width,
  height,
  initialLocation,
  enableSwipe = true,
  onSwipeLeft = () => {},
  onSwipeRight = () => {},
  renderLoadingComponent = () => null,
  enableSelection = false,
  defaultTheme = initialTheme,
  initialLocations,
}: ReaderProps) {
  const {
    view1,
    view2,
    view3
    // registerBook,
    // setIsLoading,
    // setTotalLocations,
    // setCurrentLocation,
    // setProgress,
    // setLocations,
    // setAtStart,
    // setAtEnd,
    // goNext,
    // goPrevious,
    // isLoading,
    // goToLocation,
    // changeTheme,
    // setKey,
    // setSearchResults,
    // theme,
  } = useContext(ReaderContext);
  const book = useRef<WebView>(null);

  let injectedJS = `
    window.LOCATIONS = ${JSON.stringify(initialLocations)};
    window.THEME = ${JSON.stringify(defaultTheme)};
    window.ENABLE_SELECTION = ${enableSelection};
  `;

  if (src.base64) {
    injectedJS = `
      window.BOOK_BASE64 = ${JSON.stringify(src.base64)};
      ${injectedJS}
    `;
  } else if (src.uri) {
    injectedJS = `
      window.BOOK_URI = ${JSON.stringify(src.uri)};
      ${injectedJS}
    `;
  } else {
    throw new Error('src must be a base64 or uri');
  }

  function onMessage(event: WebViewMessageEvent) {
    let parsedEvent = JSON.parse(event.nativeEvent.data);

    let { type } = parsedEvent;

    delete parsedEvent.type;

    if (type === 'onStarted') {
      view1.setIsLoading(true);

      view1.changeTheme(defaultTheme);

      return onStarted();
    }

    if (type === 'onReady') {
      const { totalLocations, currentLocation, progress } = parsedEvent;
      view1.setIsLoading(false);
      view1.setTotalLocations(totalLocations);
      view1.setCurrentLocation(currentLocation);
      view1.setProgress(progress);

      if (initialLocation) {
        view1.goToLocation(initialLocation);
      }

      return onReady(totalLocations, currentLocation, progress);
    }

    if (type === 'onDisplayError') {
      const { reason } = parsedEvent;
      view1.setIsLoading(false);

      return onDisplayError(reason);
    }

    if (type === 'onResized') {
      const { layout } = parsedEvent;

      return onResized(layout);
    }

    if (type === 'onLocationChange') {
      const { totalLocations, currentLocation, progress } = parsedEvent;
      view1.setTotalLocations(totalLocations);
      view1.setCurrentLocation(currentLocation);
      view1.setProgress(progress);

      if (currentLocation.atStart) view1.setAtStart(true);
      else if (currentLocation.atEnd) view1.setAtEnd(true);
      else {
        view1.setAtStart(false);
        view1.setAtEnd(false);
      }
      return onLocationChange(totalLocations, currentLocation, progress);
    }

    if (type === 'onSearch') {
      const { results } = parsedEvent;
      view1.setSearchResults(results);

      return onSearch(results);
    }

    if (type === 'onLocationsReady') {
      const { epubKey } = parsedEvent;
      view1.setLocations(parsedEvent.locations);
      view1.setKey(epubKey);

      return onLocationsReady(epubKey, parsedEvent.locations);
    }

    if (type === 'onSelected') {
      const { cfiRange, text } = parsedEvent;

      return onSelected(text, cfiRange);
    }

    if (type === 'onMarkPressed') {
      const { cfiRange, text } = parsedEvent;

      return onMarkPressed(cfiRange, text);
    }

    if (type === 'onOrientationChange') {
      const { orientation } = parsedEvent;

      return onOrientationChange(orientation);
    }

    if (type === 'onBeginning') {
      view1.setAtStart(true);

      return onBeginning();
    }

    if (type === 'onFinish') {
      view1.setAtEnd(true);

      return onFinish();
    }

    if (type === 'onRendered') {
      const { section, currentSection } = parsedEvent;

      return onRendered(section, currentSection);
    }

    if (type === 'onLayout') {
      const { layout } = parsedEvent;

      return onLayout(layout);
    }

    if (type === 'onNavigationLoaded') {
      const { toc } = parsedEvent;

      return onNavigationLoaded(toc);
    }
  }

  useEffect(() => {
    if (book.current) view1.registerBook(book.current);
  }, [view1.registerBook]);

  let lastTap: number | null = null;
  let timer: NodeJS.Timeout;

  const handleDoublePress = () => {
    if (lastTap) {
      onDoublePress();
      clearTimeout(timer);
      lastTap = null;
    } else {
      lastTap = Date.now();
      timer = setTimeout(() => {
        onPress();
        lastTap = null;
        clearTimeout(timer);
      }, 300);
    }
  };

  return (
    <>
      {/* <Pager /> */}
      {/* <GestureHandlerRootView style={{ width, height }}>
        <FlingGestureHandler
          direction={Directions.RIGHT}
          onHandlerStateChange={({ nativeEvent }) => {
            if (nativeEvent.state === State.ACTIVE && enableSwipe) {
              goPrevious();
              onSwipeRight();
            }
          }}
        >
          <FlingGestureHandler
            direction={Directions.LEFT}
            onHandlerStateChange={({ nativeEvent }) => {
              if (nativeEvent.state === State.ACTIVE && enableSwipe) {
                goNext();
                onSwipeLeft();
              }
            }}
          > */}
          <View
            style={{
              height: '100%',
              flexGrow: 1,
            }}
          >
            <PagerView
              initialPage={0}
              style={{
                flex: 1
              }}
              onPageSelected={(e) => {
                console.log("Selected");
              }}
            >
              <BookView
                src={src}
                height={height}
                width={width}
                view={view1}
              >
              </BookView>
              <BookView

                onReady={() => {view2.goNext();}}
                src={src}
                height={height}
                width={width}
                view={view2}
              >
              </BookView>
              <BookView

                onReady={() => {view3.goNext(); view3.goNext()}}
                src={src}
                height={height}
                width={width}
                view={view3}
              >
              </BookView>
              <View>
                <WebView
                  source={{uri: 'https://www.google.com'}}
                ></WebView>
              </View>

            </PagerView>
          </View>
          {/* </FlingGestureHandler>
        </FlingGestureHandler>
      </GestureHandlerRootView> */}
    </>
  );
}
