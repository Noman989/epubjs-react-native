import * as React from 'react';

import { Button, SafeAreaView, Text, useWindowDimensions, View } from 'react-native';
import { Reader, ReaderProvider } from 'epubjs-react-native';
import { useReader } from 'epubjs-react-native';

export default function App() {
  return (
    <SafeAreaView>
      <ReaderProvider>
        <Book />
      </ReaderProvider>
    </SafeAreaView>
  );
}

function Book() {
  type Loading = 'not-loading' | 'is-loading' | 'loaded';
  const { width, height } = useWindowDimensions();
  const { view1, view2, view3 } = useReader();
  const [view1_status, set_view1_status] = React.useState<Loading>('not-loading');

  React.useEffect(() => {
    if (view1.isLoading) {
      set_view1_status('is-loading');
    }
    if (view1_status === 'is-loading' && !view1.isLoading) {
      set_view1_status('loaded');
    }
  }, [view1.isLoading])

  const [view2_status, set_view2_status] = React.useState<Loading>('not-loading');

  React.useEffect(() => {
    if (view2.isLoading) {
      set_view2_status('is-loading');
    }
    if (view2_status === 'is-loading' && !view2.isLoading) {
      set_view2_status('loaded');
    }
    console.table("TABLE", view2.locations);
    console.log(view2.getCurrentLocation());
  }, [view2.isLoading])

  const [view3_status, set_view3_status] = React.useState<Loading>('not-loading');

  React.useEffect(() => {
    if (view3.isLoading) {
      set_view3_status('is-loading');
    }
    if (view3_status === 'is-loading' && !view3.isLoading) {
      set_view3_status('loaded');
    }
  }, [view3.isLoading])

  return (
    <View>
      <Button title='get-locations' onPress={() => {
        view2.goNext();
        view3.goNext();
        view3.goNext();
      }} />
      <Text>
        {view1_status}
      </Text>
      <Reader
        src={{ uri: 'https://s3.amazonaws.com/moby-dick/OPS/package.opf' }}
        width={width}
        height={height}
      />
    </View>
  );
}
