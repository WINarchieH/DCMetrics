import React, { useState, useEffect } from 'react';
import api from '../../../components/api/api';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import PickProd from './pickProductivity';
import PutawayProd from './putawayProductivity';
import MoveProd from './moveProductivity';
import ReplenishmentProd from './replenishmentProductivity';
import PackProd from './packProductivity';
import LostTime from './lostTime';
//cca
import VPProductivity from './VPProductivity';
//Asics
import BatchPickProd from './batchPickProductivity';
import ChutePickProd from './chutePickProductivity';
//RPF
import DynamicPickProd from './dynamicPickProductivity';
import HRPickProductivity from './HRPickProuctivity';
import NormalPicksRates from './NormalPicksRates';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};



function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const useStylesTabs = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function GraphTabs(props) {
  const classesTabs = useStylesTabs();
  const [value, setValue] = React.useState(0);

  const [tabsData, setTabsData] = useState([]);

  const getTabsData = async () => {

    let body = new URLSearchParams({
      'UserID': props.userID,
      'StartDate': props.startDate,
      'EndDate': props.endDate
    });

    await api.post('/UserManagement/UserHistory/TabsforGraphs', body).then(
      res => {
        let data = res.data;
        setTabsData(data);

      }).catch(
        err => {
          // TODO: Error handling
          if (err.response) {
            console.log(err.response)
          }
          else {
          }
        }
      );
  };

  useEffect(() => { // Get data at tab load

    getTabsData();
    setValue(0); //always load first tab first when update btn is clicked

  }, [props.loadGraphs])
  // const arr = [{
  //   label: 'Pick Rates',
  //   comp: 'PickProd',
  //   c: 0
  // },
  // {
  //   label: 'Putaway Rates',
  //   comp: 'PutawayProd',
  //   c: 1
  // },
  // {
  //   label: 'Move Rates',
  //   comp: 'MoveProd',
  //   c: 2
  // },
  // {
  //   label: 'Replenishment Rates',
  //   comp: 'ReplenishmentProd',
  //   c: 3
  // }];

  const handleChange = (event, newValue) => {

    setValue(newValue);
  };

  return (
    <div className={classesTabs.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          {tabsData.map(obj =>
            <Tab label={obj.Label} {...a11yProps(obj.C)} />
          )}

        </Tabs>
      </AppBar>
      {tabsData.map(obj => {
        switch (obj.Comp) {
          case 'PickProd':
            return <TabPanel value={value} index={parseInt(obj.C)}>
              <PickProd
                startDate={props.startDate}
                endDate={props.endDate}
                userID={props.userID}
                loadGraphs={props.loadGraphs}
              />
            </TabPanel>
            break;
          case 'PutawayProd':
            return <TabPanel value={value} index={parseInt(obj.C)}>
              <PutawayProd
                startDate={props.startDate}
                endDate={props.endDate}
                userID={props.userID}
                loadGraphs={props.loadGraphs}
              />
            </TabPanel>
            break;
          case 'MoveProd':
            return <TabPanel value={value} index={parseInt(obj.C)}>
              <MoveProd
                startDate={props.startDate}
                endDate={props.endDate}
                userID={props.userID}
                loadGraphs={props.loadGraphs}
              />
            </TabPanel>
            break;
          case 'ReplenishmentProd':
            return <TabPanel value={value} index={parseInt(obj.C)}>
              <ReplenishmentProd
                startDate={props.startDate}
                endDate={props.endDate}
                userID={props.userID}
                loadGraphs={props.loadGraphs}
              />
            </TabPanel>
            break;
          case 'PackProd':
            return <TabPanel value={value} index={parseInt(obj.C)}>
              <PackProd
                startDate={props.startDate}
                endDate={props.endDate}
                userID={props.userID}
                loadGraphs={props.loadGraphs}
              />
            </TabPanel>
            break;
            case 'LostTime':
            return <TabPanel value={value} index={parseInt(obj.C)}>
              <LostTime
                startDate={props.startDate}
                endDate={props.endDate}
                userID={props.userID}
                loadGraphs={props.loadGraphs}
              />
            </TabPanel>
            break;
            //ASICS
            case 'BatchPickProd':
            return <TabPanel value={value} index={parseInt(obj.C)}>
              <BatchPickProd
                startDate={props.startDate}
                endDate={props.endDate}
                userID={props.userID}
                loadGraphs={props.loadGraphs}
              />
            </TabPanel>
            break;
            case 'ChutePickProd':
            return <TabPanel value={value} index={parseInt(obj.C)}>
              <ChutePickProd
                startDate={props.startDate}
                endDate={props.endDate}
                userID={props.userID}
                loadGraphs={props.loadGraphs}
              />
            </TabPanel>
            break;
            //RPF
            case 'Dynamic PicksProd':
            return <TabPanel value={value} index={parseInt(obj.C)}>
              <DynamicPickProd
                startDate={props.startDate}
                endDate={props.endDate}
                userID={props.userID}
                loadGraphs={props.loadGraphs}
              />
            </TabPanel>
            break;
            //cca
            case 'VPPicksProd':
            return <TabPanel value={value} index={parseInt(obj.C)}>
              <VPProductivity
                startDate={props.startDate}
                endDate={props.endDate}
                userID={props.userID}
                loadGraphs={props.loadGraphs}
              />
            </TabPanel>
            break;
            case 'HRPicksProd':
            return <TabPanel value={value} index={parseInt(obj.C)}>
              <HRPickProductivity
                startDate={props.startDate}
                endDate={props.endDate}
                userID={props.userID}
                loadGraphs={props.loadGraphs}
              />
            </TabPanel>
            break;
            case 'NormalPicksProd':
            return <TabPanel value={value} index={parseInt(obj.C)}>
              <NormalPicksRates
                startDate={props.startDate}
                endDate={props.endDate}
                userID={props.userID}
                loadGraphs={props.loadGraphs}
              />
            </TabPanel>
            break;
          default:
            break;
        }
      }


      )}


    </div>
  );
}
