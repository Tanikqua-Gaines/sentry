import isEqual from 'lodash/isEqual';

import {Form, FormState} from 'sentry/components/forms';
import LoadingIndicator from 'sentry/components/loadingIndicator';
import DefaultSettings from 'sentry/plugins/components/settings';

type Props = DefaultSettings['props'];

type State = DefaultSettings['state'] & {
  showOnPremisesConfiguration?: boolean;
};

class Settings extends DefaultSettings<Props, State> {
  REQUIRED_FIELDS = ['account_email', 'api_token', 'website_id'];
  ON_PREMISES_FIELDS = ['api_url', 'player_url'];

  renderFields(fields: State['fieldList']) {
    return fields?.map(f =>
      this.renderField({
        config: f,
        formData: this.state.formData,
        formErrors: this.state.errors,
        onChange: this.changeField.bind(this, f.name),
      })
    );
  }

  filterFields(fields: State['fieldList'], fieldNames: string[]) {
    return fields?.filter(field => fieldNames.includes(field.name)) ?? [];
  }

  toggleOnPremisesConfiguration = () => {
    this.setState({
      showOnPremisesConfiguration: !this.state.showOnPremisesConfiguration,
    });
  };

  render() {
    if (this.state.state === FormState.LOADING) {
      return <LoadingIndicator />;
    }

    if (this.state.state === FormState.ERROR && !this.state.fieldList) {
      return (
        <div className="alert alert-error m-b-1">
          An unknown error occurred. Need help with this?{' '}
          <a href="https://sentry.io/support/">Contact support</a>
        </div>
      );
    }

    const isSaving = this.state.state === FormState.SAVING;
    const hasChanges = !isEqual(this.state.initialData, this.state.formData);

    const requiredFields = this.filterFields(this.state.fieldList, this.REQUIRED_FIELDS);
    const onPremisesFields = this.filterFields(
      this.state.fieldList,
      this.ON_PREMISES_FIELDS
    );

    return (
      <Form onSubmit={this.onSubmit} submitDisabled={isSaving || !hasChanges}>
        {this.state.errors.__all__ && (
          <div className="alert alert-block alert-error">
            <ul>
              <li>{this.state.errors.__all__}</li>
            </ul>
          </div>
        )}
        {this.renderFields(requiredFields)}
        {onPremisesFields.length > 0 ? (
          <div className="control-group">
            <button
              className="btn btn-default"
              type="button"
              onClick={this.toggleOnPremisesConfiguration}
            >
              Configure on-premises
            </button>
          </div>
        ) : null}
        {this.state.showOnPremisesConfiguration
          ? this.renderFields(onPremisesFields)
          : null}
      </Form>
    );
  }
}

export default Settings;
