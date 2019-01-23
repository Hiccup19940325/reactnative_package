/* eslint-env jasmine, jest */

import createReactDOMStyle from '../createReactDOMStyle';

const reactNativeStyle = {
  boxShadow: '1px 1px 1px 1px #000',
  borderWidthLeft: 2,
  borderWidth: 1,
  borderWidthRight: 3,
  display: 'flex',
  marginVertical: 0,
  opacity: 0,
  shadowColor: 'red',
  shadowOffset: { width: 1, height: 2 },
  resizeMode: 'contain'
};

describe('StyleSheet/createReactDOMStyle', () => {
  test('noop on DOM styles', () => {
    const firstStyle = createReactDOMStyle(reactNativeStyle);
    const secondStyle = createReactDOMStyle(firstStyle);
    expect(firstStyle).toEqual(secondStyle);
  });

  test('shortform -> longform', () => {
    const style = {
      borderStyle: 'solid',
      boxSizing: 'border-box',
      borderBottomColor: 'white',
      borderBottomWidth: 1,
      borderWidth: 0,
      marginTop: 50,
      marginVertical: 25,
      margin: 10,
      overflow: 'hidden',
      overscrollBehavior: 'contain'
    };

    expect(createReactDOMStyle(style)).toMatchSnapshot();
  });

  describe('borderWidth styles', () => {
    test('defaults to 0 when "null"', () => {
      expect(createReactDOMStyle({ borderWidth: null })).toEqual({
        borderTopWidth: '0px',
        borderRightWidth: '0px',
        borderBottomWidth: '0px',
        borderLeftWidth: '0px'
      });
      expect(createReactDOMStyle({ borderWidth: 2, borderRightWidth: null })).toEqual({
        borderTopWidth: '2px',
        borderRightWidth: '0px',
        borderBottomWidth: '2px',
        borderLeftWidth: '2px'
      });
    });
  });

  describe('flexbox styles', () => {
    test('flex defaults', () => {
      expect(createReactDOMStyle({ display: 'flex' })).toEqual({
        display: 'flex',
        flexShrink: 0,
        flexBasis: 'auto'
      });
    });

    test('flex: -1', () => {
      expect(createReactDOMStyle({ display: 'flex', flex: -1 })).toEqual({
        display: 'flex',
        flexGrow: 0,
        flexShrink: 1,
        flexBasis: 'auto'
      });
    });

    test('flex: 0', () => {
      expect(createReactDOMStyle({ display: 'flex', flex: 0 })).toEqual({
        display: 'flex',
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: '0%'
      });
    });

    test('flex: 1', () => {
      expect(createReactDOMStyle({ display: 'flex', flex: 1 })).toEqual({
        display: 'flex',
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: '0%'
      });
    });

    test('flex: 10', () => {
      expect(createReactDOMStyle({ display: 'flex', flex: 10 })).toEqual({
        display: 'flex',
        flexGrow: 10,
        flexShrink: 1,
        flexBasis: '0%'
      });
    });

    test('flexBasis overrides', () => {
      // is flex-basis applied?
      expect(createReactDOMStyle({ display: 'flex', flexBasis: '25%' })).toEqual({
        display: 'flex',
        flexShrink: 0,
        flexBasis: '25%'
      });

      // can flex-basis override the 'flex' expansion?
      expect(createReactDOMStyle({ display: 'flex', flex: 1, flexBasis: '25%' })).toEqual({
        display: 'flex',
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: '25%'
      });
    });

    test('flexShrink overrides', () => {
      // is flex-shrink applied?
      expect(createReactDOMStyle({ display: 'flex', flexShrink: 1 })).toEqual({
        display: 'flex',
        flexShrink: 1,
        flexBasis: 'auto'
      });

      // can flex-shrink override the 'flex' expansion?
      expect(createReactDOMStyle({ display: 'flex', flex: 1, flexShrink: 2 })).toEqual({
        display: 'flex',
        flexGrow: 1,
        flexShrink: 2,
        flexBasis: '0%'
      });
    });
  });

  describe('fontFamily', () => {
    test('general case', () => {
      expect(createReactDOMStyle({ fontFamily: 'Georgia, Times, serif' })).toMatchSnapshot();
    });

    test('"monospace"', () => {
      expect(createReactDOMStyle({ fontFamily: 'monospace' })).toMatchSnapshot();
    });

    test('"System"', () => {
      expect(createReactDOMStyle({ fontFamily: 'System' })).toMatchSnapshot();
    });

    test('"Noto, System"', () => {
      expect(createReactDOMStyle({ fontFamily: 'Noto, System' })).toMatchSnapshot();
    });
  });

  test('fontVariant', () => {
    expect(createReactDOMStyle({ fontVariant: ['common-ligatures', 'small-caps'] })).toEqual({
      fontVariant: 'common-ligatures small-caps'
    });
  });

  test('textAlignVertical', () => {
    expect(
      createReactDOMStyle({
        textAlignVertical: 'center'
      })
    ).toEqual({
      verticalAlign: 'middle'
    });
  });

  test('textDecorationLine', () => {
    expect(
      createReactDOMStyle({
        textDecorationLine: 'underline'
      })
    ).toEqual({
      textDecoration: 'underline'
    });
  });

  describe('transform', () => {
    // passthrough if transform value is ever a string
    test('string', () => {
      const transform = 'perspective(50px) scaleX(20) translateX(20px) rotate(20deg)';
      const style = { transform };
      const resolved = createReactDOMStyle(style);

      expect(resolved).toEqual({ transform });
    });

    test('array', () => {
      const style = {
        transform: [{ perspective: 50 }, { scaleX: 20 }, { translateX: 20 }, { rotate: '20deg' }]
      };
      const resolved = createReactDOMStyle(style);

      expect(resolved).toEqual({
        transform: 'perspective(50px) scaleX(20) translateX(20px) rotate(20deg)'
      });
    });

    test('transformMatrix', () => {
      const style = { transformMatrix: [1, 2, 3, 4, 5, 6] };
      const resolved = createReactDOMStyle(style);

      expect(resolved).toEqual({
        transform: 'matrix3d(1,2,3,4,5,6)'
      });
    });
  });
});
