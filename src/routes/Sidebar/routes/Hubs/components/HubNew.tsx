import React from 'react';

import HubSearchInput from 'components/autosuggest/HubSearchInput';
import RecentLayout from 'routes/Sidebar/components/RecentLayout';

import Message from 'components/semantic/Message';
import { Link } from 'react-router-dom';

import HubActions from 'actions/HubActions';
import HubSessionStore from 'stores/HubSessionStore';

import { HistoryEntryEnum } from 'constants/HistoryConstants';

import * as API from 'types/api';

import { Trans } from 'react-i18next';
import { NewSessionLayoutProps } from 'routes/Sidebar/components/SessionLayout';


class HubNew extends React.Component<NewSessionLayoutProps> {
  handleConnect = (hubUrl: string) => {
    HubActions.actions.createSession(this.props.location, hubUrl, HubSessionStore);
  }

  hasSession = (entry: API.HistoryItem) => {
    return HubSessionStore.getSessionByUrl(entry.hub_url);
  }

  recentHubRender = (entry: API.HistoryItem) => {
    return (
      <a onClick={ _ => this.handleConnect(entry.hub_url) }>
        { entry.name }
      </a> 
    );
  }

  render() {
    const { sessionT } = this.props;
    return (
      <div className="session new">
        <HubSearchInput 
          submitHandler={ this.handleConnect }
        />
        <Message
          description={(
            <Trans i18nKey={ sessionT.toI18nKey('favoriteHubsHint') }>
              Tip: visit the <Link to="/favorite-hubs">Favorite hubs</Link> page to connect using custom settings
            </Trans>
          )}
        />
        <RecentLayout
          entryType={ HistoryEntryEnum.HUB }
          hasSession={ this.hasSession }
          entryTitleRenderer={ this.recentHubRender }
          entryIcon="sitemap"
        />
      </div>
    );
  }
}

export default HubNew;
