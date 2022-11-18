import React, { useState, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import {Box} from '@material-ui/core';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography'; import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import { useSelector } from 'react-redux';
import { useInputState, usePrevious } from '../../../components/hooks/hooks';

import api from '../../../components/api/api';
import props from 'prop-types';

import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

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

const defaultInput = {
    'UserID': '',
    'DCMUser': ''
}



export default function UserSummaryPerformance(props) {
    const classesCards = useStylesCards();
    const classesGrid = useStylesGrid();

    const user = useSelector(store => store.user);

    const [input, setInput, setInputName, handleInputEvent] = useInputState(defaultInput);
    const [tableData, setTableData] = React.useState([]);

    const [cardsPerRow, setCardsPerRow] = React.useState();

    useEffect(() => { // Get data at tab load

        getSummary(props.userID);
        // getDropdownAllCertsForUser(props.userID);

    }, [])

    useEffect(() => { // Get data at tab load

        getSummary(props.userID);
        // getDropdownAllCertsForUser(props.userID);
    }, [props.loadSummaryPerformance])

    const calcCardsPerRow = (n) => {
        switch (n) {
            case 1:
                return 1;
            case 2:
                return 2;
            case 3:
                return 3;
            case 4:
                return 2;
            default:
                return 3;
        }
    }

    const getSummary = async (selectedUser) => {

        input.DCMUser = user;
        input.UserID = selectedUser;

        input.StartDate = props.startDate;
        input.EndDate = props.endDate;
        let body = new URLSearchParams(input);

        await api.post('/UserManagement/UserHistory/GetUserSummaryPerformance', body).then(
            res => {
                let data = res.data;
                setCardsPerRow(calcCardsPerRow(data.length));
                data = data.map(x => {
                    return x;
                });
                setTableData(res.data);
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

                {tableData.map(obj => {
                    return (
                        <Grid item xs={12 / cardsPerRow}>
                            <Card className={classesCards.root} style={{ backgroundColor: 'rgb(241,242,242) ' }}>
                                <CardContent>
                                    <Typography
                                        color="textSecondary"
                                        gutterBottom
                                        variant="h6"
                                        style={{  color:'black',  fontWeight:'bold', fontFamily:'Montserrat' }}
                                    >
                                        {obj.Activity}
                                    </Typography>
                                    <Typography
                                        color="textPrimary"
                                        variant="h5"
                                    >
                                        {obj.AvgRate}
                                    </Typography>
                                    <Typography
                                        color="textSecondary"
                                        variant="caption"
                                    >
                                        Ranked <span style={{ color: obj.RankColor, fontSize: '18px', fontWeight: 'bold' }} > {obj.UserRank}/{obj.TotalUsers}</span>
                                    </Typography>
                                    <Box
                                        sx={{
                                            alignItems: 'center',
                                            display: 'flex',
                                            pt: 2
                                        }}
                                    >
                                        {obj.RateChange < 0 ? <ArrowDownwardIcon style={{ color: '#FF2400', paddingRight:'5px' }} /> : <ArrowUpwardIcon style={{ color: '#228B22', paddingRight:'5px' }} /> }
                                        <Typography
                                            style={{paddingRight:'5px'}}
                                            variant="body2"
                                            
                                        >
                                            {Math.abs(obj.RateChange)} 
                                        </Typography>
                                        <Typography
                                            color="textSecondary"
                                            variant="caption"
                                        >
                                             Units/Hr
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                    )
                })}

            </Grid>

        </div>
    );



}
