import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
// import PagerView from 'react-native-pager-view';
import ViewPager from 'react-native-pager-view';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import template from './template';

const slide1 = () => {
    return (
        <View style={{ flexGrow: 1, backgroundColor: 'blue' }}>
            <Text>Hello 1</Text>
            <WebView
                source={{ uri: 'https://www.google.com' }}
            >

            </WebView>
        </View>
    )
};
const slide2 = () => (
    <View style={{ flexGrow: 1, backgroundColor: 'green' }}>
        <Text>Hello 2</Text>
    </View>
);
const slide3 = () => (
    <View style={{ flexGrow: 1, backgroundColor: 'red' }}>
        <Text>Hello 3</Text>
    </View>
);

interface PagerProps {
    src?: {
        /**
         * The base64 string of the ePub
         * @param {string} base64
         * @example
         * ```
         * <Reader
         *    src={{
         *    base64: 'base64 string'
         *  }}
         * />
         * ```
         */
        base64?: string;

        /**
         * The url of the ePub
         * @param {string} uri
         * @example
         * ```
         * <Reader
         *  src={{
         *    uri: 'https://example.com/epub.epub'
         *  }}
         * />
         * ```
         */
        uri?: string;
    };
    children?: (() => JSX.Element)[];
}
const Pager: React.FC<PagerProps> = ({ children, src }) => {
    const slides: (() => JSX.Element)[] = children || [slide1, slide2, slide3];
    const firstSlide = slides[0];
    const lastSlide = slides[slides.length - 1];
    const loopingSlides = [lastSlide, ...slides, firstSlide];
    const viewPagerRef = React.useRef<ViewPager | null>(null);
    const [page, setPage] = React.useState(1);

    return (
        <View
            style={{
                flexGrow: 1,
                height: '100%'
            }}
        >
            <ViewPager
                initialPage={1}
                ref={viewPagerRef}
                onPageSelected={event => {
                    const currentPage = event.nativeEvent.position;
                    const reachedFakeLastSlide = currentPage === 0;
                    const reachedFakeFirstSlide =
                        currentPage === loopingSlides.length - 1;

                    if (viewPagerRef.current) {
                        if (reachedFakeFirstSlide) {
                            setTimeout(() => {
                                if (viewPagerRef.current)
                                    viewPagerRef.current.setPageWithoutAnimation(1);
                            }, 300);
                        } else if (reachedFakeLastSlide) {
                            setTimeout(() => {
                                if (viewPagerRef.current)
                                    viewPagerRef.current.setPageWithoutAnimation(
                                        loopingSlides.length - 2,
                                    );
                            }, 300);
                        } else {
                            setPage(currentPage);
                        }
                    }
                }}
                style={styles.pagerView}>
                {loopingSlides.map((Slide, index) => (
                    <View key={index}>
                        <Slide />
                    </View>
                ))}
            </ViewPager>
            {/* <Indicators length={3} active={page - 1} /> */}
        </View>
    );
};

const styles = StyleSheet.create({
    pagerView: {
        flex: 1,
    },
});

export { Pager };
