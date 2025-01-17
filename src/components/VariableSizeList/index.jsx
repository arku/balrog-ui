import React, { useEffect, useRef } from 'react';
import { number } from 'prop-types';
import { AutoSizer, WindowScroller, List } from 'react-virtualized';
import { APP_BAR_HEIGHT } from '../../utils/constants';

function VariableSizeList(props) {
  const { scrollToRow, ...rest } = props;
  const listRef = useRef(null);

  useEffect(() => {
    const rowOffset = listRef.current.getOffsetForRow({ index: scrollToRow });

    listRef.current.scrollToPosition(rowOffset - APP_BAR_HEIGHT);
  }, [scrollToRow]);

  return (
    <WindowScroller>
      {({ height, onChildScroll, isScrolling, scrollTop }) => (
        <AutoSizer disableHeight>
          {({ width }) => (
            <List
              autoHeight
              ref={listRef}
              isScrolling={isScrolling}
              onScroll={onChildScroll}
              scrollToAlignment="start"
              height={height}
              width={width}
              estimatedRowSize={400}
              overscanRowCount={5}
              scrollTop={scrollTop}
              {...rest}
            />
          )}
        </AutoSizer>
      )}
    </WindowScroller>
  );
}

VariableSizeList.propTypes = {
  scrollToRow: number,
};

VariableSizeList.defaultProps = {
  scrollToRow: null,
};

export default VariableSizeList;
