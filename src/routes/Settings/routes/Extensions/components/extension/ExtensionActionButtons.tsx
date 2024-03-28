import * as React from 'react';

import ExtensionInstallActions from 'actions/ui/extension/ExtensionInstallActions';
import ExtensionConstants from 'constants/ExtensionConstants';

import ActionButton from 'components/ActionButton';
import ExternalLink from 'components/ExternalLink';

import * as API from 'types/api';
import * as UI from 'types/ui';
import { ActionMenu } from 'components/action-menu';
import MenuConstants from 'constants/MenuConstants';
import IconConstants from 'constants/IconConstants';
import Icon from 'components/semantic/Icon';
import ExtensionManageActions from 'actions/ui/extension/ExtensionManageActions';

export interface ExtensionActionButtonsProps {
  npmPackage?: UI.NpmPackage;
  installedPackage?: API.Extension;
  hasUpdate: boolean;
  installing: boolean;
  moduleT: UI.ModuleTranslator;
}

type InstallButtonProps = Omit<ExtensionActionButtonsProps, 'moduleT'>;

const InstallButton: React.FC<InstallButtonProps> = ({
  npmPackage,
  installedPackage,
  hasUpdate,
  installing,
}) => {
  if (installedPackage && !hasUpdate) {
    return null;
  }

  return (
    <ActionButton
      actions={ExtensionInstallActions.npm}
      actionId={hasUpdate ? 'updateNpm' : 'installNpm'}
      className="right floated primary"
      itemData={npmPackage}
      loading={installing}
    />
  );
};

const ExtensionActionButtons: React.FC<ExtensionActionButtonsProps> = ({
  npmPackage,
  installedPackage,
  hasUpdate,
  installing,
  moduleT,
}) => (
  <div className="extra buttons">
    {npmPackage && (
      <InstallButton
        npmPackage={npmPackage}
        installedPackage={installedPackage}
        hasUpdate={hasUpdate}
        installing={installing}
      />
    )}
    {installedPackage && (
      <ActionMenu
        actions={ExtensionManageActions}
        ids={['configure', 'divider', 'remove']}
        remoteMenuId={MenuConstants.EXTENSION}
        remoteMenuNestingThreshold={10}
        itemData={installedPackage}
        className="right floated"
        caption={moduleT.translate('Manage...')}
        button={true}
        contextElement="#setting-scroll-context"
        menuElementClassName="left floated"
      />
    )}
    {npmPackage && (
      <ExternalLink
        className="ui right floated button"
        url={ExtensionConstants.NPM_HOMEPAGE_URL + npmPackage.name}
      >
        <Icon icon={IconConstants.EXTERNAL} />
        {moduleT.translate('Read more')}
      </ExternalLink>
    )}
    {installedPackage && (
      <ActionButton
        actions={ExtensionManageActions}
        actionId={installedPackage.running ? 'stop' : 'start'}
        className="right floated"
        itemData={installedPackage}
      />
    )}
  </div>
);

export default ExtensionActionButtons;
