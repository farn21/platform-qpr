import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withTranslation } from "react-i18next";

import "./textarea-field.scss";

const TextareaField = props => {
  const cn = classNames("textarea-field", {
    "textarea-field--has-autofill": props.hasAutofill, 
    "border-color-protected-area": props.qprFormType === "protected-area",
    "border-color-water": props.qprFormType === "water",
    "border-color-relocations": props.qprFormType === "relocations"
    
  });

  return (
    <textarea
      className={cn}
      name={props.name}
      placeholder={props.t(
        `textareaFieldPlaceholder${props.formId}${props.name}`,
        props.placeholder || " ",
      )}
      value={props.value}
      onChange={e => props.onChange(e.target.name, e.target.value)}
    />
  );
};

TextareaField.propTypes = {
  formId: PropTypes.string.isRequired,
  hasAutofill: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  t: PropTypes.func.isRequired,
  value: PropTypes.string,
};

export default withTranslation("TextareaField")(TextareaField);
