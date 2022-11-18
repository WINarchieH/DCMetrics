import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../../components/api/api';
import Modal, { checkChange } from '../../../components/containers/modal/modal';
import TextField from '../../../components/fields/textfield';
import { useInputState, usePrevious } from '../../../components/hooks/hooks';
import Toggle, { booleanToOutput, outputToBoolean } from '../../../components/fields/toggle';
import DropDown from '../../../components/fields/dropdown';
import { SelectMultipleFilter } from '../../../components/table/filters';

// Ag Grid

// Importing Ag Grid Community Version

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';


import Header from '../../../components/header/header';

import './userGroupManagement.scss';

import FirstTab from './firstTab';
import SecondTab from  './secondTab';
import ThirdTab from './thirdTab';



import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import NoSsr from '@material-ui/core/NoSsr';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

function LinkTab(props) {
  return <Tab component="a" onClick={event => event.preventDefault()} {...props} />;
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tabs:
  {
   
    backgroundColor:'rgb(35,168,224)',
   fontFamily:'Montserrat' 
  
  }
});

class NavTabs extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div>
      <Header></Header>

      <div></div>

   
     <div className="screen-container">
    
    

      <NoSsr>
        <div className={classes.root}>
          <AppBar position="static">
            <Tabs className={classes.tabs} variant="fullWidth" value={value} onChange={this.handleChange}>
              <LinkTab label="Create New Group" href="page1" />
              <LinkTab label="Update Group" href="page2" />
              <LinkTab label="Update DCM User" href="page3" />
            </Tabs>
          </AppBar>
          {value === 0 && <TabContainer><FirstTab></FirstTab></TabContainer>}
          {value === 1 && <TabContainer><SecondTab></SecondTab></TabContainer>}
          {value === 2 && <TabContainer><ThirdTab></ThirdTab></TabContainer>}
        </div>
      </NoSsr>
      </div>
      </div>
     
    );
  }
}

NavTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavTabs);