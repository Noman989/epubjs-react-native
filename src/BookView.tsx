import React from "react";
import { Text, TouchableWithoutFeedback, View } from "react-native";
import type { ReaderProps } from "./types";
import { defaultTheme as initialTheme, EpubView } from './context'
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import template from './template';

interface BookViewProps extends ReaderProps {
  view: EpubView;
}
export const BookView: React.FC<BookViewProps> = ({
  src,
  onStarted = () => { },
  onReady = () => { },
  onDisplayError = () => { },
  onResized = () => { },
  onLocationChange = () => { },
  onRendered = () => { },
  onSearch = () => { },
  onLocationsReady = () => { },
  onSelected = () => { },
  onMarkPressed = () => { },
  onOrientationChange = () => { },
  onLayout = () => { },
  onNavigationLoaded = () => { },
  onBeginning = () => { },
  onFinish = () => { },
  onPress = () => { },
  onDoublePress = () => { },
  width,
  height,
  initialLocation,
  enableSwipe = true,
  onSwipeLeft = () => { },
  onSwipeRight = () => { },
  renderLoadingComponent = () => null,
  enableSelection = false,
  defaultTheme = initialTheme,
  initialLocations,
  view
}: BookViewProps) => {
  const book = React.useRef<WebView>(null);

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
      view.setIsLoading(true);

      view.changeTheme(defaultTheme);

      return onStarted();
    }

    if (type === 'onReady') {
      const { totalLocations, currentLocation, progress } = parsedEvent;
      view.setIsLoading(false);
      view.setTotalLocations(totalLocations);
      view.setCurrentLocation(currentLocation);
      view.setProgress(progress);

      if (initialLocation) {
        view.goToLocation(initialLocation);
      }

      return onReady(totalLocations, currentLocation, progress);
    }

    if (type === 'onDisplayError') {
      const { reason } = parsedEvent;
      view.setIsLoading(false);

      return onDisplayError(reason);
    }

    if (type === 'onResized') {
      const { layout } = parsedEvent;

      return onResized(layout);
    }

    if (type === 'onLocationChange') {
      const { totalLocations, currentLocation, progress } = parsedEvent;
      view.setTotalLocations(totalLocations);
      view.setCurrentLocation(currentLocation);
      view.setProgress(progress);

      if (currentLocation.atStart) view.setAtStart(true);
      else if (currentLocation.atEnd) view.setAtEnd(true);
      else {
        view.setAtStart(false);
        view.setAtEnd(false);
      }
      return onLocationChange(totalLocations, currentLocation, progress);
    }

    if (type === 'onSearch') {
      const { results } = parsedEvent;
      view.setSearchResults(results);

      return onSearch(results);
    }

    if (type === 'onLocationsReady') {
      const { epubKey } = parsedEvent;
      view.setLocations(parsedEvent.locations);
      view.setKey(epubKey);

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
      view.setAtStart(true);

      return onBeginning();
    }

    if (type === 'onFinish') {
      view.setAtEnd(true);

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

  React.useEffect(() => {
    if (book.current) view.registerBook(book.current);
  }, [view.registerBook]);

  return (
    <View
      style={{
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {view.isLoading && (
        <View
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            zIndex: 2,
          }}
        >
          {renderLoadingComponent()}
        </View>
      )}

      {/* <TouchableWithoutFeedback onPress={handleDoublePress}> */}
      <WebView
        ref={book}
        source={{ html: template }}
        showsVerticalScrollIndicator={false}
        javaScriptEnabled
        injectedJavaScriptBeforeContentLoaded={injectedJS}
        originWhitelist={['*']}
        scrollEnabled={false}
        mixedContentMode="compatibility"
        onMessage={onMessage}
        allowUniversalAccessFromFileURLs={true}
        allowFileAccessFromFileURLs={true}
        allowFileAccess
        style={{
          width,
          backgroundColor: view.theme.body.background,
          height,
        }}
      />
      {/* </TouchableWithoutFeedback> */}
    </View>
  )
}