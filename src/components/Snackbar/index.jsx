import React from 'react';
import { func, object, string, oneOf } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import IconButton from '@material-ui/core/IconButton';
import MuiSnackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { amber, green } from '@material-ui/core/colors';
import CheckCircleIcon from 'mdi-react/CheckCircleIcon';
import WarningIcon from 'mdi-react/WarningIcon';
import AlertCircleIcon from 'mdi-react/AlertCircleIcon';
import InformationIcon from 'mdi-react/InformationIcon';
import CloseIcon from 'mdi-react/CloseIcon';
import { SNACKBAR_AUTO_HIDE_DURATION } from '../../utils/constants';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: AlertCircleIcon,
  info: InformationIcon,
};
const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: green[600],
  },
  info: {
    backgroundColor: theme.palette.primary.main,
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));

function Snackbar(props) {
  const classes = useStyles();
  const { onClose, variant, message, snackbarContentProps, ...rest } = props;
  const Icon = variantIcon[variant];

  return (
    <MuiSnackbar
      autoHideDuration={SNACKBAR_AUTO_HIDE_DURATION}
      onClose={onClose}
      {...rest}>
      <SnackbarContent
        className={classes[variant]}
        action={
          <IconButton aria-label="Close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        }
        message={
          <span className={classes.message}>
            <Icon className={classes.iconVariant} />
            {message}
          </span>
        }
        {...snackbarContentProps}
      />
    </MuiSnackbar>
  );
}

Snackbar.propTypes = {
  /** Applies appropriate coloring to indicate purpose of message. */
  variant: oneOf(['success', 'info', 'error', 'warning']),
  /** The message to display. */
  message: string.isRequired,
  /** Properties applied to the SnackbarContent element. */
  snackbarContentProps: object,
  /** Callback fired when the component requests to be closed. */
  onClose: func.isRequired,
};

Snackbar.defaultProps = {
  variant: 'success',
  snackbarContentProps: null,
};

export default Snackbar;
