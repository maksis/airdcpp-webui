//import PropTypes from 'prop-types';
import * as React from 'react';

import { ActionMenu } from 'components/menu';
import { formatRelativeTime } from 'utils/ValueFormat';

import RSSActions from '../actions/RSSActions';
import { FeedItem } from '../types';
import { parseNodeContent } from '../utils';

import * as UI from 'types/ui';

const parseTitle = (entry: FeedItem) => {
  if (!entry.title) {
    return '(title missing)';
  }

  let title = parseNodeContent(entry.title);
  if (typeof title !== 'string') {
    title = '(unsupported title format)';
  }

  return title;
};

export interface EntryProps extends Pick<UI.WidgetProps, 'widgetT' | 'componentId'> {
  entry: FeedItem;
  feedUrl: string;
}

const Entry: React.FC<EntryProps> = ({ entry, feedUrl, widgetT }) => {
  const date = entry.pubDate ? entry.pubDate : entry.updated;
  return (
    <div className="item">
      <div className="header">
        <ActionMenu
          leftIcon={true}
          caption={parseTitle(entry)}
          actions={{
            actions: RSSActions,
            moduleId: widgetT.moduleId,
          }}
          itemData={{
            entry,
            feedUrl,
          }}
          //contextElement={ '.' + componentId + ' .list.rss' } // TODO
        />
      </div>

      <div className="description">
        {!!date && formatRelativeTime(Date.parse(parseNodeContent(date)) / 1000)}
      </div>
    </div>
  );
};

/*Entry.propTypes = {
	// Feed entry
  entry: PropTypes.shape({
    title: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
    updated: PropTypes.string, // Atom feeds
    pubDate: PropTypes.string, // RSS feeds
  }),

  feedUrl: PropTypes.string.isRequired,

  componentId: PropTypes.string.isRequired,
};*/

export default Entry;
