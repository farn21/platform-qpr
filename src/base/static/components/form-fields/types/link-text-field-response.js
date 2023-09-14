/** @jsx jsx */
import React from "react";
import PropTypes from "prop-types";
import { css, jsx } from "@emotion/core";
import { withTheme } from "emotion-theming";

import { ExternalLink, RegularText } from "../../atoms/typography";

const LinkTextFieldResponse = props => {
  return (
    <ExternalLink
    target="_blank"
      css={css`
        margin: 8px 0 16px 0;
      `}
      href={props.value}
    >
      <RegularText>{props.value}</RegularText>
    </ExternalLink>
  );
};

LinkTextFieldResponse.propTypes = {
  value: PropTypes.string.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withTheme(LinkTextFieldResponse);
