import {
  Button,
  PixelRatio,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {
  MarkerView,
  type MarkerViewHandle,
} from '@markerjs/react-native-markerjs';
import { useAnnotationContext } from '../context/AnnotationContext';
import { useRef } from 'react';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';

const RendererPage = () => {
  const { annotation } = useAnnotationContext();
  const markerViewRef = useRef<MarkerViewHandle>(null);

  const handleRenderClick = async () => {
    if (annotation && markerViewRef.current?.visualRef.current) {
      console.log('Rendering annotation...');
      try {
        // react-native-view-shot renders with pixel ratio in mind on iOS, but not on Android.
        const pixelRatio = Platform.OS === 'ios' ? PixelRatio.get() : 1;

        console.log('Pixel Ratio:', pixelRatio);

        const localUri = await captureRef(
          markerViewRef.current.visualRef.current,
          {
            width: annotation.width / pixelRatio,
            height: annotation.height / pixelRatio,
            quality: 1,
          }
        );

        console.log('Captured image URI:', localUri);

        await MediaLibrary.saveToLibraryAsync(localUri);
        if (localUri) {
          console.log('Image saved to library:', localUri);
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {annotation && (
        <>
          <View style={styles.markerViewContainer}>
            <MarkerView
              ref={markerViewRef}
              targetSrc={require('../../assets/sample-images/landscape_sm.jpg')}
              annotation={annotation}
              scaleStroke={false}
            />
          </View>
          <View style={styles.toolbar}>
            <Button title="Render" onPress={handleRenderClick} />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default RendererPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerViewContainer: {
    flex: 0.8,
    overflow: 'hidden',
    width: '100%',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    width: '100%',
  },
});
