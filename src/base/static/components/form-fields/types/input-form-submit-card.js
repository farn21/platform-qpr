/** @jsx jsx */
import React from "react";
import PropTypes from "prop-types";
import { css, jsx } from "@emotion/core";
import { withTheme } from "emotion-theming";
import { withTranslation } from "react-i18next";
import classNames from "classnames";
import { Button } from "../../atoms/buttons";

const InputFormSubmitCard = props => {
  return (
    <div className={classNames("input-form-submit-card", {
      "border-color-protected-area": props.qprFormType === "protected-area",
      "border-color-water": props.qprFormType === "water",
      "border-color-relocations": props.qprFormType === "relocations"})}>
      <p style={{fontWeight: 700, color: '#000000'}}>Publicá tu experiencia en el mapa.</p>
      <p style={{fontSize: '12px', color: '#aeadb3'}}>Si compartís tu experiencia con QPR, se mostrará públicamente siempre que cumpla con las condiciones de uso.</p>
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
        className={classNames({
          "border-color-protected-area": props.qprFormType === "protected-area",
          "border-color-water": props.qprFormType === "water",
          "border-color-relocations": props.qprFormType === "relocations",
          "background-color-protected-area": props.qprFormType === "protected-area",
          "background-color-water": props.qprFormType === "water",
          "background-color-relocations": props.qprFormType === "relocations" })}
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
