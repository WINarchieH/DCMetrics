import React, { useState, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import { Box } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography'; import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import {LinearProgress
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useInputState, usePrevious } from '../../../../components/hooks/hooks';

import api from '../../../../components/api/api';
import props from 'prop-types';

import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import Avatar from '@material-ui/core/Avatar';
import lateAvatar from './Late Arrivals.png';
import holiday from './Leave Taken.png';
import incident from './HR_updated.png';
import losttime from './Lost Time.png';
import './userhistory.scss'

const useStylesCards = makeStyles({
    root: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,

    },
});

const useStylesGrid = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}));

const useStylesAvatar = makeStyles((theme) => ({
    root: {
        display: 'flex',
        
    },
}));

const defaultInput = {
    'UserID': '',
    'DCMUser': ''
}



export default function UserAttributes(props) {
    // console.log(props.userID);
    const classesCards = useStylesCards();
    const classesGrid = useStylesGrid();
    const classesAvatar = useStylesAvatar();

    const user = useSelector(store => store.user);

    const [input, setInput, setInputName, handleInputEvent] = useInputState(defaultInput);
    const [tableData, setTableData] = React.useState([]);
    const [hideprogress, sethideprogress] = useState(true);

    const bull = <span className={classesCards.bullet}>•</span>;

    useEffect(() => { // Get data at tab load

        getUserAttributes(props.userID);
        // getDropdownAllCertsForUser(props.userID);

    }, [])

    useEffect(() => { // Get data at tab load

        getUserAttributes(props.userID);
        // getDropdownAllCertsForUser(props.userID);

    }, [props.loadAttributes])

    const getUserAttributes = async (selectedUser) => {

        sethideprogress(false);
        input.DCMUser = user;
        input.UserID = selectedUser;

        input.StartDate = props.startDate;
        input.EndDate = props.endDate;
        let body = new URLSearchParams(input);

        await api.post('/UserManagement/UserHistory/GetAttributes', body).then(
            res => {
                let data = res.data;
                data = data.map(x => {
                    return x;
                });
                setTableData(res.data[0]);
                sethideprogress(true);
            }).catch(
                err => {
                    // TODO: Error handling
                    if (err.response) {

                    }
                    else {
                    }
                }
            );


    };



    return (
        <div className={classesGrid.root} style={{ padding: '4px' }}>

            <Grid container spacing={1}>
                <Grid item xs={3}>
                    <Card className={classesCards.root} style={{ backgroundColor: 'rgb(241,242,242)' }}>
                        <CardContent>
                            <Box
                                sx={{
                                    alignItems: 'center',
                                    display: 'flex',
                                }}
                            >
                                <Typography
                                    color="textSecondary"
                                    gutterBottom
                                    variant="h6"
                                    style={{ color:'black', fontWeight:'bold', fontFamily:'Montserrat'}}
                                >
                                    HR INCIDENTS
                                </Typography>

                                <div  style={{ marginRight: "1em", marginLeft: "auto" }}>
                                    <Avatar style={{ width: 70, height: 70  }} alt="Incident" src={incident} />
                                </div>
                            </Box>
                            <Typography
                                color="textPrimary"
                                variant="h5"
                            >
                                {tableData.NumOfHRIncidents}
                            </Typography>

                            <Box
                                sx={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    pt: 2
                                }}
                            >
                                {tableData.IncidentsDiff <= 0 ? <ArrowDownwardIcon style={{ color: '#228B22', paddingRight: '5px' }} /> : <ArrowUpwardIcon style={{ color: '#FF2400', paddingRight: '5px' }} />}
                                <Typography
                                    style={{ paddingRight: '5px' }}
                                    variant="body2"
                                >
                                    {Math.abs(tableData.IncidentsDiff)}
                                </Typography>
                                <Typography
                                    color="textSecondary"
                                    variant="caption"
                                >
                                    Incident(s)
                                </Typography>
                            </Box>

                        </CardContent>
                        {/* <CardActions>
                            <Button size="small">Learn More</Button>
                        </CardActions> */}
                        <div hidden={hideprogress}> <LinearProgress color="secondary" /></div>
                    </Card>
                </Grid>

                <Grid item xs={3}>
                    <Card className={classesCards.root} style={{ backgroundColor: 'rgb(241,242,242)'  }}>
                        <CardContent>
                            <Box
                                sx={{
                                    alignItems: 'center',
                                    display: 'flex',
                                }}
                            >
                                <Typography
                                    color="textSecondary"
                                    gutterBottom
                                    variant="h6"
                                    style={{  color:'black', fontWeight:'bold', fontFamily:'Montserrat'}}
                                >
                                    LATE ARRIVALS
                                </Typography>

                                <div className={classesAvatar.root} style={{ marginRight: "1em", marginLeft: "auto" }}>
                                    <Avatar  style={{ width: 70, height: 70  }} alt="Late" src={lateAvatar} />
                                </div>
                            </Box>
                            <Typography
                                color="textPrimary"
                                variant="h5"
                            >
                                {tableData.NumOfDaysLoggedOnLate}
                            </Typography>

                            <Box
                                sx={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    pt: 2
                                }}
                            >
                                {tableData.LoggedOnLateDiff <= 0 ? <ArrowDownwardIcon style={{ color: '#228B22', paddingRight: '5px' }} /> : <ArrowUpwardIcon style={{ color: '#FF2400', paddingRight: '5px' }} />}
                                <Typography
                                    style={{ paddingRight: '5px' }}
                                    variant="body2"
                                >
                                    {Math.abs(tableData.LoggedOnLateDiff)}
                                </Typography>
                                <Typography
                                    color="textSecondary"
                                    variant="caption"
                                >
                                    Day(s)
                                </Typography>
                            </Box>

                        </CardContent>
                        <div hidden={hideprogress}> <LinearProgress color="secondary" /></div>
                    </Card>
                </Grid>

                <Grid item xs={3}>
                    <Card className={classesCards.root} style={{ backgroundColor: 'rgb(241,242,242)'  }}>
                        <CardContent>
                        <Box
                                sx={{
                                    alignItems: 'center',
                                    display: 'flex',
                                }}
                            >
                                <Typography
                                    color="textSecondary"
                                    gutterBottom
                                    variant="h6"
                                    style={{  color:'black', fontWeight:'bold', fontFamily:'Montserrat'}}
                                >
                                    LEAVE TAKEN
                                </Typography>

                                <div className={classesAvatar.root} style={{ marginRight: "1em", marginLeft: "auto" }}>
                                    <Avatar style={{ width: 70, height: 70  }} alt="Holiday" src={holiday} />
                                </div>
                            </Box>
                            <Typography
                                color="textPrimary"
                                variant="h5"
                            >
                                {tableData.NumOfLeaves}
                            </Typography>

                            <Box
                                sx={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    pt: 2
                                }}
                            >
                                {tableData.LeavesDiff < 0 ? <ArrowDownwardIcon style={{ color: '#2B65EC', paddingRight: '5px' }} /> : <ArrowUpwardIcon style={{ color: '#2B65EC', paddingRight: '5px' }} />}
                                <Typography
                                    style={{ paddingRight: '5px' }}
                                    variant="body2"
                                >
                                    {Math.abs(tableData.LeavesDiff)}
                                </Typography>
                                <Typography
                                    color="textSecondary"
                                    variant="caption"
                                >
                                    Day(s)
                                </Typography>
                            </Box>

                        </CardContent>
                        <div hidden={hideprogress}> <LinearProgress color="secondary" /></div>
                    </Card>
                </Grid>

                <Grid item xs={3}>
                    <Card className={classesCards.root} style={{ backgroundColor: 'rgb(241,242,242)'  }}>
                        <CardContent>
                        <Box
                                sx={{
                                    alignItems: 'center',
                                    display: 'flex',
                                }}
                            >
                                <Typography
                                    color="textSecondary"
                                    gutterBottom
                                    variant="h6"
                                    style={{ color:'black',  fontWeight:'bold', fontFamily:'Montserrat'}}
                                >
                                    AVG LOST TIME
                                </Typography>

                                <div className={classesAvatar.root} style={{ marginRight: "1em", marginLeft: "auto" }}>
                                    <Avatar style={{ width: 70, height: 70  }} alt="Incident" src={losttime} />
                                </div>
                            </Box>
                            <Typography
                                color="textPrimary"
                                variant="h5"
                            >
                                {tableData.AvgLostTime}
                            </Typography>

                            <Box
                                sx={{
                                    alignItems: 'center',
                                    display: 'flex',
                                    pt: 2
                                }}
                            >
                                {tableData.AvgLostTimeDiff <= 0 ? <ArrowDownwardIcon style={{ color: '#228B22', paddingRight: '5px' }} /> : <ArrowUpwardIcon style={{ color: '#FF2400', paddingRight: '5px' }} />}
                                <Typography
                                    style={{ paddingRight: '5px' }}
                                    variant="body2"
                                >
                                    {Math.abs(tableData.AvgLostTimeDiff)}
                                </Typography>
                                <Typography
                                    color="textSecondary"
                                    variant="caption"
                                >
                                    Minute(s)
                                </Typography>
                            </Box>
                        </CardContent>
                        <div hidden={hideprogress}> <LinearProgress color="secondary" /></div>
                    </Card>

                </Grid>

                {/* <Grid item xs={6}>
                    <Card className={classesCards.root} style={{ backgroundColor: 'rgb(241,242,242)'  }}>
                        <CardContent>
                            <Typography
                                color="textSecondary"
                                gutterBottom
                                variant="h6"
                            >
                                TOTAL LOST TIME
                            </Typography>
                            <Typography
                                color="textPrimary"
                                variant="h5"
                            >
                                {tableData.TotalLostTime}
                            </Typography>
                            <Typography
                                color="textSecondary"
                                variant="caption"
                            >
                                X Up/Down
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid> */}
            </Grid>

        </div>
    );
}
