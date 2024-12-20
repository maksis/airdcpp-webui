import { memo } from 'react';
import * as React from 'react';

import classNames from 'classnames';

import { NavLink } from 'react-router';
import CountLabel from 'components/CountLabel';
import Icon, { IconType } from 'components/semantic/Icon';

import * as UI from 'types/ui';
import { useStore } from 'effects/StoreListenerEffect';

type RouterMenuItemLinkProps = React.PropsWithChildren<{
  url: string;
  icon?: IconType;
  className?: string;
  onClick?: (evt: React.SyntheticEvent<any>) => void;
  unreadInfoStore?: UI.UnreadInfoStore | UI.SessionStore;
  session?: UI.SessionItemBase;
}>;

const getUrgencies = (props: RouterMenuItemLinkProps): UI.UrgencyCountMap | null => {
  const { unreadInfoStore, session } = props;
  if (!unreadInfoStore) {
    return null;
  }

  if (!!session && 'getSession' in unreadInfoStore) {
    // Session objects are immutable so the one received via props
    // may be outdated already
    const currentSession = unreadInfoStore.getSession(session.id);
    return !!currentSession ? unreadInfoStore.getItemUrgencies(currentSession) : null;
  }

  return unreadInfoStore.getTotalUrgencies();
};

// Route link with support for urgencies
const RouterMenuItemLink = memo<RouterMenuItemLinkProps>(
  function RouterMenuItemLink(props) {
    const urgencies = useStore<UI.UrgencyCountMap | null>(props.unreadInfoStore, () =>
      getUrgencies(props),
    );
    const { onClick, className, icon, url, children, unreadInfoStore } = props;
    return (
      <NavLink
        end={url === '/'}
        to={url}
        className={({ isActive }) => classNames('item', className, { active: isActive })}
        onClick={onClick}
      >
        <Icon icon={icon} />
        {children}
        {!!unreadInfoStore && <CountLabel urgencies={urgencies} />}
      </NavLink>
    );
  } /*,
  (prevProps, nextProps) => {
    return (
      // nextProps.location.key === prevProps.location.key &&
      nextProps.session === prevProps.session
    );
  }*/,
);

export default RouterMenuItemLink;
