import React from 'react';

import Modal from 'components/semantic/Modal';
import Form, { FormSaveHandler } from 'components/form/Form';

import ModalRouteDecorator, { ModalRouteDecoratorChildProps } from 'decorators/ModalRouteDecorator';
import OverlayConstants from 'constants/OverlayConstants';

import DataProviderDecorator, { DataProviderDecoratorChildProps } from 'decorators/DataProviderDecorator';
import SocketService from 'services/SocketService';

import ExtensionConstants from 'constants/ExtensionConstants';
import IconConstants from 'constants/IconConstants';
import { RouteComponentProps } from 'react-router';

import * as API from 'types/api';
import * as UI from 'types/ui';


const getSettingsUrl = (extensionId: string) => {
  return `${ExtensionConstants.EXTENSIONS_URL}/${extensionId}/settings`;
};

interface ExtensionsConfigureDialogProps {

}

interface DataProps extends DataProviderDecoratorChildProps {
  fieldDefinitions: UI.FormFieldDefinition[];
  settings: UI.FormValueMap;
  extension: API.Extension;
}

type Props = ExtensionsConfigureDialogProps & DataProps & 
  ModalRouteDecoratorChildProps & RouteComponentProps<{ extensionId: string; }>;

class ExtensionsConfigureDialog extends React.Component<Props> {
  static displayName = 'ExtensionsConfigureDialog';

  form: Form;
  save = () => {
    return this.form.save();
  }

  onSave: FormSaveHandler<UI.FormValueMap> = (changedFields) => {
    return SocketService.patch(getSettingsUrl(this.props.extension.id), changedFields);
  }

  render() {
    const { extension, settings, fieldDefinitions, ...other } = this.props;
    return (
      <Modal 
        { ...other }
        className="extensions configure" 
        title={ extension.name } 
        onApprove={ this.save } 
        closable={ false } 
        icon={ IconConstants.EDIT }
        dynamicHeight={ true }
      >
        <Form
          ref={ (c: any) => this.form = c! }
          onSave={ this.onSave }
          fieldDefinitions={ fieldDefinitions }
          value={ settings }
        />
      </Modal>
    );
  }
}

export default ModalRouteDecorator<ExtensionsConfigureDialogProps>(
  DataProviderDecorator<Props, DataProps>(
    ExtensionsConfigureDialog, {
      urls: {
        fieldDefinitions: ({ match }) => {
          return SocketService.get(`${getSettingsUrl(match.params.extensionId)}/definitions`);
        },
        settings: ({ match }) => SocketService.get(getSettingsUrl(match.params.extensionId)),
        extension: ({ match }, socket) => {
          return socket.get(`${ExtensionConstants.EXTENSIONS_URL}/${match.params.extensionId}`);
        },
      },
    }
  ),
  OverlayConstants.EXTENSION_CONFIGURE_MODAL,
  'extensions/:extensionId'
);