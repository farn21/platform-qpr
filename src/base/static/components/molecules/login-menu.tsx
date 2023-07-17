/** @jsx jsx */
import * as React from "react";
import { jsx } from "@emotion/core";
import Button from "@material-ui/core/Button";
import { Button as LegacyButton } from "../atoms/buttons";
import LoginModal from "./login-modal";
import RegisterModal from "./register-modal";
import { AppConfig } from "../../state/ducks/app-config";
import { withTranslation, WithTranslation } from "react-i18next";
import mq from "../../../../media-queries";
import { MuiTheme } from "../../../../theme";
import { useTheme } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";

type Props = {
  appConfig: AppConfig;
  isMobileHeaderExpanded: boolean;
} & WithTranslation;

const LoginMenu: React.FunctionComponent<Props> = props => {
  const theme = useTheme<MuiTheme>();

  const MobileButton = ({ openModal, text }) => (
    <Button
      className="mapseed-navbar-login-button"
      css={{
        marginLeft: "auto",
        marginRight: "10px",
        display: "flex",
        justifyContent: "center",
        padding: "8px 16px",

        // NOTE: We are accessing the 'theme' object directly for now, until
        // we can sort out our theming schema.
        backgroundColor: theme.palette.secondary.main,
        borderRadius: "8px",
        maxWidth: "180px",

        [mq[0]]: {
          marginRight: "auto",
        },
      }}
      onClick={openModal}
    >
      <Typography
        css={{
          color: "tertiary",
          height: "24px",
          weight: "bold",
          textTransform: "uppercase",
        }}
      >
        {text}
      </Typography>
    </Button>
  );
  const DesktopButton = ({ openModal, text}) => (
    <LegacyButton
      color="primary"
      onClick={openModal}
      css={theme => ({
        fontFamily: theme.text.navBarFontFamily,
        fontSize: "0.75em",
        textAlign: "center",
        textDecoration: "none",
        lineHeight: "3.25",
        display: "block",
        padding: "0 0.5em",
        marginRight: "8px",
        height: "100%",
        cursor: "pointer",

        [mq[0]]: {
          display: "none",
        },

        [mq[1]]: {
          fontSize: "1em",
          textDecoration: "none",
          lineHeight: "1.5",
          padding: "0.5em",
          position: "relative",
          zIndex: 3,
        },
      })}
    >
      {text}
    </LegacyButton>
  );
  return (
    <React.Fragment>
      <LoginModal
        render={(openModal: () => void) => {
          return props.isMobileHeaderExpanded ? (
            <MobileButton openModal={openModal} text="Iniciar sesión"/>
          ) : (
            <DesktopButton openModal={openModal} text="Iniciar sesión" />
          );
        }}
        appConfig={props.appConfig}
      />
      <RegisterModal
        render={(openModal: () => void) => {
          return props.isMobileHeaderExpanded ? (
            <MobileButton openModal={openModal} text="Registrate"/>
          ) : (
            <DesktopButton openModal={openModal} text="Registrate"/>
          );
        }}
        appConfig={props.appConfig}
      />
    </React.Fragment>
  );
};

export default withTranslation("LoginMenu")(LoginMenu);
