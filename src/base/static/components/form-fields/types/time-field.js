import React from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";

const TimeField = props => (
  <input
    type="time"
    className="datetime-field time-field"
    name={props.name}
    placeholder={props.t(
      `textFieldPlaceholder${props.formId}${props.name}`,
      props.placeholder || " ",
    )}
    value={props.value}
    onChange={e => props.onChange(e.target.name, e.target.value)}
  ></input>
);

TimeField.propTypes = {
  formId: PropTypes.string.isRequired,
  hasAutofill: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  t: PropTypes.func.isRequired,
  value: PropTypes.string,
};

export default withTranslation("TimeField")(TimeField);
