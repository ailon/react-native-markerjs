# marker.js for React Native &mdash; add image annotation to your React Native apps

> **Note**: marker.js for React Native is in the early pre-release stage of its lifecycle and will have many additions and breaking changes before the official 1.0 release.

**marker.js for React Native** is a library to enable image annotation in your React Native applications. Add **marker.js for React Native** to your app and enable users to annotate and mark up images. You can save, share or otherwise process the results.

**marker.js for React Native** is based on the original [marker.js 3](https://markerjs.com) library, which is a mature and battle-tested image annotation library for the web. **marker.js for React Native** is a reimplementation of the original library, designed to work seamlessly in React Native environments. It is not, however, a 100% compatible in terms of API and features, so please refer to the documentation below for details.

## Installation

```bash
npm install @markerjs/react-native-markerjs
```

## Usage

**marker.js for React Native** consists of two main components: `MarkerArea` (the editor) and `MarkerView` (the viewer).

_more details TBD_

### MarkerArea (The Editor)

Import `MarkerArea` from `@markerjs/react-native-markerjs`:

```js
import { MarkerArea } from '@markerjs/react-native-markerjs';
```

```jsx
<MarkerArea
  ref={markerAreaRef}
  targetSrc={require('./sample-image.jpg')}
  annotation={annotation}
  onAnnotationChange={handleAnnotationChange}
/>
```

_TBD_

## Demos

_Coming soon..._

## More docs and tutorials

_Coming soon..._

## License

Linkware (see [LICENSE](https://github.com/ailon/react-native-markerjs/blob/master/LICENSE) for details) - the UI displays a small link back to the marker.js website which should be retained.

Alternative licenses will be available through the [marker.js website](https://markerjs.com).

## Credits

Made with:

- [react-native-svg](https://github.com/software-mansion/react-native-svg)
- [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
