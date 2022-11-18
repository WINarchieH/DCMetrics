import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ssrs from '../../../../components/ssrs/srss';
import Header from '../../../../components/header/header';
import '../../../../assets/panel.scss';
import './costperUnit.scss';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { CardContent } from '@material-ui/core';

const CostPerUnitPrint = () => {
  const useStyles = makeStyles((theme) => ({
    root: {
      width: "90vw",
      height: "90vh",
      background: 'whitesmoke',
      padding: "16px",
    },
    content: {
      height: "100%"
    },
    title:{
      fontWeight:"bold",
      fontFamily:"calibri",
      color:"blue"
    },
    AccordionDetails3: {
      backgroundColor: "white",
      color: "white",
      height: "90vh",
      width: "80vw"
    },
    IFrame: {
      width: "100%",
      height: "90%"
    }
  }));

  const classes = useStyles();
  const [url, setUrl] = useState('');
  const site = useSelector(store => store.site);

  useEffect(() => {
    let URL = ssrs + '%2fReports%2f'+site+'%2fCost+Per+Unit+-+Overall+and+Detailed+Per+Activity&rs:embed=true';
    setUrl(URL);
  }, [site]);

  
  return (
    <React.Fragment>
      <Header></Header>
      <div className='report-container'>
        <Card className={classes.root}>
          <CardContent className={classes.content}> 
            <Typography className={classes.title}  gutterBottom>
            Cost Per Line Report
            </Typography>
            <iframe className={classes.IFrame}
                    title="Cost Per Line Report"
                    src={url}/>
          </CardContent>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default CostPerUnitPrint;