import React, { useState } from 'react';
import { oneOfType, object, node, string, func, bool } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import ErrorPanel from '../ErrorPanel';
import tryCatch from '../../utils/tryCatch';

const useStyles = makeStyles(theme => ({
  executingActionWrapper: {
    position: 'relative',
  },
  buttonProgress: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -theme.spacing(1) * 1.5,
    marginTop: -theme.spacing(1) * 1.5,
  },
}));

function DialogAction(props) {
  const classes = useStyles();
  const [actionExecuting, setActionExecuting] = useState(false);
  const {
    open,
    title,
    body,
    confirmText,
    error,
    onClose,
    onSubmit,
    onComplete,
    onError,
    ...rest
  } = props;
  const handleSubmit = async () => {
    setActionExecuting(true);

    const [error, result] = await tryCatch(onSubmit());

    if (error) {
      if (onError) {
        onError(error);
      }

      setActionExecuting(false);

      return;
    }

    if (onComplete) {
      onComplete(result);
    }

    setActionExecuting(false);
  };

  return (
    <Dialog open={open} onClose={onClose} {...rest}>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>
        {error && (
          <DialogContentText component="div">
            <ErrorPanel error={error} />
          </DialogContentText>
        )}
        {body && <DialogContentText component="div">{body}</DialogContentText>}
      </DialogContent>
      <DialogActions>
        <Button disabled={actionExecuting} onClick={onClose}>
          Cancel
        </Button>
        <div className={classes.executingActionWrapper}>
          <Button
            disabled={actionExecuting}
            onClick={handleSubmit}
            color="secondary"
            variant="contained"
            autoFocus>
            {confirmText}
          </Button>
          {actionExecuting && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </div>
      </DialogActions>
    </Dialog>
  );
}

DialogAction.propTypes = {
  /** If true, the Dialog is open. */
  open: bool.isRequired,
  /** The title of the Dialog. */
  title: string,
  /** The body of the Dialog. */
  body: node,
  /** The text content of the executing action button */
  confirmText: string.isRequired,
  /** Callback fired when the executing action button is clicked */
  onSubmit: func.isRequired,
  /**
   * Callback fired when the action is complete with
   * the return value of onSubmit. This function will not
   * be called if onSubmit throws an error.
   * */
  onComplete: func,
  /** Callback fired when onSubmit throws an error.
   * The error will be provided in the callback. */
  onError: func,
  /** Callback fired when the component requests to be closed. */
  onClose: func.isRequired,
  /** Error to display. */
  error: oneOfType([string, object]),
};

DialogAction.defaultProps = {
  title: '',
  body: '',
  onComplete: null,
  onError: null,
  error: null,
};

export default DialogAction;
