/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type { ViewProps } from './types';

import * as React from 'react';
import { forwardRef, useContext, useRef } from 'react';
import createElement from '../createElement';
import css from '../StyleSheet/css';
import pick from '../../modules/pick';
import setAndForwardRef from '../../modules/setAndForwardRef';
import useElementLayout from '../../hooks/useElementLayout';
import usePlatformMethods from '../../hooks/usePlatformMethods';
import useResponderEvents from '../../hooks/useResponderEvents';
import StyleSheet from '../StyleSheet';
import TextAncestorContext from '../Text/TextAncestorContext';

const forwardPropsList = {
  accessibilityLabel: true,
  accessibilityLiveRegion: true,
  accessibilityRelationship: true,
  accessibilityRole: true,
  accessibilityState: true,
  accessibilityValue: true,
  accessible: true,
  children: true,
  classList: true,
  disabled: true,
  importantForAccessibility: true,
  nativeID: true,
  onBlur: true,
  onClick: true,
  onClickCapture: true,
  onContextMenu: true,
  onFocus: true,
  onKeyDown: true,
  onKeyUp: true,
  onTouchCancel: true,
  onTouchCancelCapture: true,
  onTouchEnd: true,
  onTouchEndCapture: true,
  onTouchMove: true,
  onTouchMoveCapture: true,
  onTouchStart: true,
  onTouchStartCapture: true,
  pointerEvents: true,
  ref: true,
  style: true,
  testID: true,
  // unstable
  onMouseDown: true,
  onMouseEnter: true,
  onMouseLeave: true,
  onMouseMove: true,
  onMouseOver: true,
  onMouseOut: true,
  onMouseUp: true,
  onScroll: true,
  onWheel: true,
  href: true,
  itemID: true,
  itemRef: true,
  itemProp: true,
  itemScope: true,
  itemType: true,
  rel: true,
  target: true,
  unstable_ariaSet: true,
  unstable_dataSet: true
};

const pickProps = props => pick(props, forwardPropsList);

function createHitSlopElement(hitSlop) {
  const hitSlopStyle = {};
  for (const prop in hitSlop) {
    if (hitSlop.hasOwnProperty(prop)) {
      const value = hitSlop[prop];
      hitSlopStyle[prop] = value > 0 ? -1 * value : 0;
    }
  }
  return createElement('span', {
    classList: [classes.hitSlop],
    style: hitSlopStyle
  });
}

const View = forwardRef<ViewProps, *>((props, forwardedRef) => {
  const {
    hitSlop,
    onLayout,
    onMoveShouldSetResponder,
    onMoveShouldSetResponderCapture,
    onResponderEnd,
    onResponderGrant,
    onResponderMove,
    onResponderReject,
    onResponderRelease,
    onResponderStart,
    onResponderTerminate,
    onResponderTerminationRequest,
    onScrollShouldSetResponder,
    onScrollShouldSetResponderCapture,
    onSelectionChangeShouldSetResponder,
    onSelectionChangeShouldSetResponderCapture,
    onStartShouldSetResponder,
    onStartShouldSetResponderCapture
  } = props;

  if (process.env.NODE_ENV !== 'production') {
    React.Children.toArray(props.children).forEach(item => {
      if (typeof item === 'string') {
        console.error(`Unexpected text node: ${item}. A text node cannot be a child of a <View>.`);
      }
    });
  }

  const hasTextAncestor = useContext(TextAncestorContext);
  const hostRef = useRef(null);
  const setRef = setAndForwardRef({
    getForwardedRef: () => forwardedRef,
    setLocalRef: hostNode => {
      hostRef.current = hostNode;
    }
  });

  const children = hitSlop
    ? React.Children.toArray([createHitSlopElement(hitSlop), props.children])
    : props.children;
  const classList = [classes.view];
  const style = StyleSheet.compose(
    hasTextAncestor && styles.inline,
    props.style
  );

  useElementLayout(hostRef, onLayout);
  usePlatformMethods(hostRef, classList, style);
  useResponderEvents(hostRef, {
    onMoveShouldSetResponder,
    onMoveShouldSetResponderCapture,
    onResponderEnd,
    onResponderGrant,
    onResponderMove,
    onResponderReject,
    onResponderRelease,
    onResponderStart,
    onResponderTerminate,
    onResponderTerminationRequest,
    onScrollShouldSetResponder,
    onScrollShouldSetResponderCapture,
    onSelectionChangeShouldSetResponder,
    onSelectionChangeShouldSetResponderCapture,
    onStartShouldSetResponder,
    onStartShouldSetResponderCapture
  });

  const supportedProps = pickProps(props);
  supportedProps.children = children;
  supportedProps.classList = classList;
  supportedProps.ref = setRef;
  supportedProps.style = style;

  return createElement('div', supportedProps);
});

View.displayName = 'View';

const classes = css.create({
  view: {
    alignItems: 'stretch',
    border: '0 solid black',
    boxSizing: 'border-box',
    display: 'flex',
    flexBasis: 'auto',
    flexDirection: 'column',
    flexShrink: 0,
    margin: 0,
    minHeight: 0,
    minWidth: 0,
    padding: 0,
    position: 'relative',
    zIndex: 0
  },
  // this zIndex-ordering positions the hitSlop above the View but behind
  // its children
  hitSlop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1
  }
});

const styles = StyleSheet.create({
  inline: {
    display: 'inline-flex'
  }
});

export type { ViewProps };

export default View;
