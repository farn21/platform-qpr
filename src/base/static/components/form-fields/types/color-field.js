import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withTranslation } from "react-i18next";

import "./text-field.scss";

const ColorField = props => {
    const cn = classNames("text-field", {
        "text-field--has-autofill": props.hasAutofill,
    });

    return ( <
        input className = { cn }
        name = { props.name }
        required = { props.required }
        type = "color"
        value = { props.value }
        placeholder = {
            props.t(
                `textFieldLabel${props.formId}${props.name}`,
                props.placeholder || " ",
            )
        }
        onChange = { e => props.onChange(e.target.name, e.target.value) }
        />
    );
};

ColorField.propTypes = {
    formId: PropTypes.string.isRequired,
    hasAutofill: PropTypes.bool,
    required: PropTypes.bool,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    t: PropTypes.func.isRequired,
    value: PropTypes.string,
};

export default withTranslation("ColorField")(ColorField);