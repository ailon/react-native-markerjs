# marker.js for React Native &mdash; add image annotation to your React Native apps

> **Note**: marker.js for React Native is in the early pre-release stage of its lifecycle and will have many additions and breaking changes before the official 1.0 release.

**marker.js for React Native** is a library to enable image annotation in your React Native applications. Add **marker.js for React Native** to your app and enable users to annotate and mark up images. You can save, share or otherwise process the results.

**marker.js for React Native** is based on the original [marker.js 3](https://markerjs.com) library, which is a mature and battle-tested image annotation library for the web. **marker.js for React Native** is a reimplementation of the original library, designed to work seamlessly in React Native environments. It is not, however, 100% compatible in terms of API and features, so please refer to the documentation below for details.

## Installation

```bash
npm install @markerjs/react-native-markerjs
```

## Usage

**marker.js for React Native** consists of two main components: `MarkerArea` (the editor) and `MarkerView` (the viewer).

### MarkerArea (The Editor)

Import `MarkerArea` from `@markerjs/react-native-markerjs`:

```js
import { MarkerArea } from '@markerjs/react-native-markerjs';
```

Add the `MarkerArea` component to your app, providing it with a target image source and an initial annotation state. You can use the `ref` prop to get a reference to the `MarkerArea` instance, which allows you to interact with the component programmatically (initiating marker creation, etc.).

```jsx
<MarkerArea
  ref={markerAreaRef}
  targetSrc={require('./sample-image.jpg')}
  annotation={annotation}
  onAnnotationChange={handleAnnotationChange}
/>
```

Refer to the [Quick Start Guide](https://markerjs.com/docs-rn/documents/Guides_and_tutorials.Getting_started.html) for more details on how to start using marker.js for React Native.

## Demos

You can find a demo app demonstrating marker creation, editing, displaying annotations, and rendering annotated images [here](https://github.com/ailon/react-native-markerjs-demo).

## More docs and tutorials

Check out the [marker.js for React Native documentation](https://markerjs.com/docs-rn/) for more details on how to use the library, including guides and tutorials.

## License

Linkware (see [LICENSE](https://github.com/ailon/react-native-markerjs/blob/master/LICENSE) for details) - the UI displays a small link back to the marker.js website which should be retained.

Alternative licenses will be available through the [marker.js website](https://markerjs.com).

## Credits

Made with:

- [react-native-svg](https://github.com/software-mansion/react-native-svg)
- [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
