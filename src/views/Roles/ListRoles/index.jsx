import React, { Fragment, useState, useEffect, useMemo } from 'react';
import Spinner from '@mozilla-frontend-infra/components/Spinner';
import { makeStyles } from '@material-ui/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Dashboard from '../../../components/Dashboard';
import ErrorPanel from '../../../components/ErrorPanel';
import useAction from '../../../hooks/useAction';
import { getUsers } from '../../../services/users';

const ALL = 'all';
const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: theme.spacing(3),
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
  },
  roleWrapper: {
    marginBottom: theme.spacing(4),
  },
  options: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  dropdown: {
    minWidth: 200,
    marginBottom: theme.spacing(2),
  },
}));

function ListRules() {
  const classes = useStyles();
  const [usersAction, fetchUsers] = useAction(getUsers);
  const [roleFilter, setRoleFilter] = useState(ALL);
  const isLoading = usersAction.loading;
  const { error } = usersAction;
  const roles = useMemo(() => {
    if (!usersAction.data) {
      return [];
    }

    return Array.from(
      new Set(
        Object.values(usersAction.data.data).flatMap(({ roles }) =>
          roles.map(({ role }) => role)
        )
      )
    );
  }, [usersAction.data]);
  const users = useMemo(() => {
    if (!usersAction.data) {
      return [];
    }

    return Object.entries(usersAction.data.data).map(
      ([username, { roles }]) => ({
        username,
        roles,
      })
    );
  }, [usersAction.data]);
  const filteredRoles = useMemo(
    () => (roleFilter === ALL ? roles : [roleFilter]),
    [roles, roleFilter]
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFilterChange = ({ target: { value } }) => {
    setRoleFilter(value);
  };

  return (
    <Dashboard title="Roles">
      {isLoading && <Spinner loading />}
      {error && <ErrorPanel fixed error={error} />}
      {filteredRoles.length && users.length && (
        <Fragment>
          <div className={classes.options}>
            <TextField
              className={classes.dropdown}
              select
              label="Role"
              value={roleFilter}
              onChange={handleFilterChange}>
              <MenuItem value="all">All Roles</MenuItem>
              {roles.map(role => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
          </div>
          {filteredRoles.map(role => (
            <div key={role} className={classes.roleWrapper}>
              <Typography variant="h6" className={classes.title}>
                {role}
              </Typography>
              <div className={classes.paper}>
                <List>
                  {users
                    .filter(user =>
                      user.roles.map(({ role }) => role).includes(role)
                    )
                    .map(user => (
                      <ListItem key={user.username}>
                        <ListItemText primary={user.username} />
                      </ListItem>
                    ))}
                </List>
              </div>
            </div>
          ))}
        </Fragment>
      )}
    </Dashboard>
  );
}

export default ListRules;
