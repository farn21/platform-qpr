/** @jsx jsx */
import React from "react";
import PropTypes from "prop-types";
import { css, jsx } from "@emotion/core";
import { withTheme } from "emotion-theming";
import { withTranslation } from "react-i18next";
import { Button } from "../../atoms/buttons";

const InputFormSubmitCard = props => {
  return (
    <div className={"input-form-submit-card"}>
      <Button
        css={css`
          font-family: ${props.theme.text.bodyFontFamily};
        `}
        size="medium"
        color="primary"
        variant="raised"
        name={props.name}
        disabled={props.disabled}
        onClick={props.onClickSubmit}
      >
        {props.t("inputFormSubmitCardLabel", props.label)}
      </Button>
    </div>
  );
};

InputFormSubmitCard.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onClickSubmit: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withTheme(
  withTranslation("InputFormSubmitCard")(InputFormSubmitCard),
);
