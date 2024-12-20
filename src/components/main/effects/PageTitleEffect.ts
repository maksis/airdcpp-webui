import { useSession } from 'context/SessionContext';
import { useEffect } from 'react';

import { LoginState } from 'stores/LoginStore';

import * as API from 'types/api';
import * as UI from 'types/ui';

import { UrgencyEnum } from 'types/ui';
import { maxUrgency } from 'utils/UrgencyUtils';

const updateTitle = (systemInfo: API.SystemInfo | null, prefix = '') => {
  let title = 'AirDC++ Web Client';
  if (!!systemInfo) {
    title = `${systemInfo.hostname} - ${title}`;
  }

  document.title = prefix + title;
};

// Add hostname in the title if we are authentication
export const useAuthPageTitle = (login: LoginState) => {
  const { systemInfo } = useSession();
  useEffect(() => {
    updateTitle(systemInfo);
    return () => updateTitle(null);
  }, [login.socketAuthenticated]);
};

const getUrgencyPrefix = (urgencies: UI.UrgencyCountMap | null) => {
  if (!!urgencies) {
    const max = maxUrgency(urgencies);
    if (!!max && max >= UrgencyEnum.HIGH) {
      return max === UrgencyEnum.HIGH ? '* ' : '(!) ';
    }
  }

  return '';
};

// Add urgency notification symbol in the page title
export const useUrgencyPageTitle = (urgencies: UI.UrgencyCountMap | null) => {
  const { systemInfo } = useSession();
  const prefix = getUrgencyPrefix(urgencies);
  useEffect(() => {
    updateTitle(systemInfo, prefix);
  }, [prefix]);
};
