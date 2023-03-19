import * as React from 'react';

import * as UI from 'types/ui';
import t from 'utils/tcomb-form';

import HubSearchInput from 'components/autosuggest/HubSearchInput';

type TCombTemplate = {
  renderInput: (
    locals: UI.FormLocals<any, string | null, UI.EmptyObject>
  ) => React.ReactNode;
};

const HubUrlTemplate: TCombTemplate = {
  renderInput(locals) {
    return (
      <div className="ui fluid input">
        <HubSearchInput
          onChange={(hubUrl) => {
            locals.onChange(hubUrl);
          }}
          defaultValue={locals.value || undefined}
        />
      </div>
    );
  },
};

export const HubUrlField = t.form.Form.templates.textbox.clone(HubUrlTemplate);
