// @flow
import moveCrossAxis from '../../../../src/state/move-cross-axis/';
import noImpact from '../../../../src/state/no-impact';
import getViewport from '../../../../src/view/window/get-viewport';
import getArea from '../../../../src/state/get-area';
import { getDroppableDimension, getDraggableDimension } from '../../../../src/state/dimension';
import { getPreset } from '../../../utils/dimension';
import type { Result } from '../../../../src/state/move-cross-axis/move-cross-axis-types';
import type {
  Viewport,
  DraggableDimension,
  DroppableDimension,
  DraggableDimensionMap,
  DroppableDimensionMap,
} from '../../../../src/types';

const preset = getPreset();
const viewport: Viewport = getViewport();

// The functionality of move-cross-axis is covered by other files in this folder.
// This spec file is directed any any logic in move-cross-axis/index.js

describe('move cross axis', () => {
  it('should return null if there are draggables in a destination list but none are visible', () => {
    const custom: DroppableDimension = getDroppableDimension({
      descriptor: {
        id: 'custom',
        type: 'TYPE',
      },
      paddingBox: getArea({
        left: preset.home.client.marginBox.left + 1,
        right: preset.home.client.marginBox.left + 10,
        top: 0,
        bottom: viewport.subject.bottom + 200,
      }),
    });
    const notVisible: DraggableDimension = getDraggableDimension({
      descriptor: {
        id: 'not-visible',
        droppableId: custom.descriptor.id,
        index: 0,
      },
      paddingBox: getArea({
        left: preset.home.client.marginBox.left + 1,
        right: preset.home.client.marginBox.left + 10,
        // outside of the viewport
        top: viewport.subject.bottom + 1,
        bottom: viewport.subject.bottom + 10,
      }),
    });
    const draggables: DraggableDimensionMap = {
      ...preset.draggables,
      [notVisible.descriptor.id]: notVisible,
    };
    const droppables: DroppableDimensionMap = {
      [preset.home.descriptor.id]: preset.home,
      [custom.descriptor.id]: custom,
    };

    const result: ?Result = moveCrossAxis({
      isMovingForward: true,
      pageCenter: preset.inHome1.page.marginBox.center,
      draggableId: preset.inHome1.descriptor.id,
      droppableId: preset.home.descriptor.id,
      home: {
        droppableId: preset.home.descriptor.id,
        index: 0,
      },
      draggables,
      droppables,
      previousImpact: noImpact,
      viewport,
    });

    expect(result).toBe(null);
  });

  // this test is a validation that the previous test is working correctly
  it('should return a droppable if its children are visible (and all other criteria are met)', () => {
    const result: ?Result = moveCrossAxis({
      isMovingForward: true,
      pageCenter: preset.inHome1.page.marginBox.center,
      draggableId: preset.inHome1.descriptor.id,
      droppableId: preset.home.descriptor.id,
      home: {
        droppableId: preset.inHome1.descriptor.droppableId,
        index: preset.inHome1.descriptor.index,
      },
      draggables: preset.draggables,
      droppables: preset.droppables,
      previousImpact: noImpact,
      viewport,
    });

    // not asserting anything about the behaviour - just that something was returned
    expect(result).toBeTruthy();
  });
});
