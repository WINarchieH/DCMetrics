import React, {useState, useEffect, useCallback} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSite, setNavbar } from '../../redux/actions';
import {LOGOUT} from '../../redux/actionTypes';
import {useHistory, Link}  from "react-router-dom";
import './header.scss';
import DCMLogo from '../../images/DCM Logo only.png';
import api from '../api/api';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import HeaderDropdown from './headerDropdown';
import SelectButton from '../fields/selectButton';
import Popup, {PopupButton} from '../containers/popup/popup';
import { Tooltip, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';
import FeedbackIcon from '@material-ui/icons/Feedback';
import ContactMailTwoToneIcon from '@material-ui/icons/ContactMailTwoTone';

import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import {store} from 'react-notifications-component'
import Popover from '@mui/material/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import Typography from '@mui/material/Typography';
import feedbackicon from '../../components/header/icons/Feedback_updated.png';
import Notificationsicon from '../../components/header/icons/Notifications_updated.png';

import {
    Box,
    List,
    Button,
    Avatar,
    Divider,
    ListItemText,
    ListSubheader,
    ListItemAvatar,
    ListItemButton
  } from '@mui/material';

  import ic_notification_shipping from './static/icons/ic_notification_shipping.svg';
import ic_notification_mail from './static/icons/ic_notification_mail.svg';
import ic_notification_chat from '../../components/header/icons/PendingLeave.png';
import ic_notification_package from './static/icons/ic_notification_package.svg';
import { Link as RouterLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import { noCase } from 'change-case';
import clockFill from '@iconify/icons-eva/clock-fill';
import ic_expiry from '../../components/header/icons/CertficateExpiry_updated.png';
import ic_salary from '../../components/header/icons/Payroll_updated.png';
import ic_LogOut from './static/icons/logout.png';
import Ic_meeting from './static/icons/meeting.png'
import Notification_EventIcon from '../../components/header/icons/Event_updated.png';
import Notification_DailyViewIcon from '../../components/header/icons/DailyView_updated.png';
import LogOutIcon from '../../components/icons/LogOutIcon.png'

// Popover


/**
 * Component for DC4.0 Header.
 */

 const options = [ 'Report','Time And Attendance','User Management','Maintenance','Benchmark','Payroll','Dashboard'];

const Logo = () => {
    return (
        <div className='header-logo-container'>
            <Link to='/Dashboard'>
                <img src={DCMLogo} alt='DC Metrics Logo'></img>
            </Link>
        </div>
    )
};

const Settings = () => {
    const dispatch = useCallback(useDispatch(), []);  
    const history = useCallback(useHistory(), []);
    const user = useSelector(store => store.user);
    const sites = useSelector(store => store.sites);
    const [showPopup, setShowPopup] = useState(false);
    const [disableSite, setDisableSite] = useState(false); // Disable site popup
    const currentSite = useSelector(store => store.site);




    const openPopup = () => {
        setShowPopup(true);
    };
 // open feebackform




    const handleSite = useCallback(
        (new_site) => {
            dispatch(setSite(new_site));

            const body = new URLSearchParams({ 'Site': new_site });
            
            api.post('/Settings/SetSite', body).then(res => {
            
                let data = res.data;
                
                dispatch(setNavbar(JSON.parse(data.navbar)));
              
            

                   api.post('/HomeScreen/HomeScreenProductivity/GetHomeScreenRoute', body).then(res => {
            

                    
                    if (sites.length> 1)
                    {
                        
                     history.push(res.data.route);
                    }

    
                   
                }).catch(
                    err => {
                        console.log(err);
                        console.log('Failed to set site.');
                    }
                );
        
            }).catch(
                err => {
                    console.log(err);
                    console.log('Failed to set site.');
                }
            );
        }, [dispatch, history,sites]);

    useEffect(() => {
        // No site currently selected
        if (currentSite === null) {
            if (sites) {
               
                if (sites.length === 1) { // Default site if one
                
                    setShowPopup(false);
                    handleSite(sites[0]);
                
                }
                else {
                    setShowPopup(true);
                }

               
                
            }
        }
        else {

            setShowPopup(false);
        }
    }, [currentSite, sites, handleSite]);

    useEffect(() => { // Single Site - Disable button.
        if (sites && sites.length === 1) {
            setDisableSite(true);
        }
    }, [sites]);

    return (
        <div className='settings'>
            <HeaderDropdown title={<React.Fragment> {user} <ArrowDropDownIcon></ArrowDropDownIcon></React.Fragment>}>
                <Link className='link--remove-style header-dropdown--item' to='/Settings'>User Settings</Link>
                <PopupButton className={disableSite ? 'header-dropdown--item header-dropdown--disable-cursor' : 'header-dropdown--item'} name={'Site - ' + currentSite}  onClick={openPopup} disabled={disableSite}></PopupButton>
				<Link className='link--remove-style header-dropdown--item' to='/AddUser' >Add User</Link>
                <Link className='link--remove-style header-dropdown--item' to='/emailSubscription' >Email Subscription</Link>
            </HeaderDropdown>
            <Popup showPopup={showPopup} title='Select Site'>
                <SelectButton data={sites} closePopup={setShowPopup} onClick={handleSite}></SelectButton>
            </Popup>
        </div>
    )
};

// const OpenNotificationModel = ()=>
// {
    
// }

const LogOut = () => {
    const [name, setName] = useState('Log Out');
    const history = useHistory();
    const dispatch = useDispatch();
    const onLogOut = () => {
        setName('Logging Out');
        dispatch({ type: LOGOUT }); // Reset redux store on logout
        api.get('/Login/Logout').catch(
            err => {
                console.log(err);
            }
        );
        history.push('/');
    }
    return (
      <Tooltip title='Log Out'>
      <IconButton aria-label='Log Out'  onClick={onLogOut}>
      <img height= "35" width ="35" src={LogOutIcon}></img>
      </IconButton>
      </Tooltip>
      //  <button type='button' className='logout-button' onClick={onLogOut}>{name}</button>
    )
};



const Header = () => {
    const navbarData = useSelector(store => store.navbar);
    const [showModal, setShowModal] = useState(false);
    const [loadModal, setLoadModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const user = useSelector(store => store.user);
    const currentSite = useSelector(store => store.site);

    const [badgecount, setbadgecount] = useState(0);
    const [notifications, setNotifications ] = useState([]);  
    // const NOTIFICATIONS = [
    //     {
    //       id: 1,
    //       title: 'Your order is placed',
    //       description: 'waiting for shipping',
    //       avatar: null,
    //       type: 'order_placed',
    //       createdAt: new Date(),
    //       isUnRead: true
    //     },
    //     {
    //       id: 3,
    //       title: 'You have new message',
    //       description: '5 unread messages',
    //       avatar: null,
    //       type: 'chat_message',
    //       createdAt: new Date(),
    //       isUnRead: true
    //     }
    // ]


   

    function renderContent(notification) {

         var title = ""
        if (notification.title ==="Certification Expiry")
        {
         title = (
          <Typography variant="subtitle2"  >

            <strong>{notification.title}</strong> 
            <Typography   component="span" variant="body2" sx={{ color: 'text'}}>
              &nbsp; {notification.description}
            </Typography>
            <br></br>
            <Typography variant="subtitle3"  component="span" variant="body2" sx={{ color: 'text'}}>
            <Link to= {notification.URL}>
             <p> Click here to check.</p>   
            </Link>
            </Typography>

          </Typography>
        );
        }
        else  if (notification.title ==="Payroll")
        {
         title = (
          <Typography variant="subtitle2"  >

            <strong>{notification.title}</strong> 
            <Typography   component="span" variant="body2" sx={{ color: 'text'}}>
              &nbsp; {notification.description}
            </Typography>
            <br></br>
            <Typography variant="subtitle3"  component="span" variant="body2" sx={{ color: 'text'}}>
            <Link to= {notification.URL}>
             <p> Click here to check.</p>   
            </Link>
            </Typography>

          </Typography>
        );
        }
        else  if (notification.title ==="Daily View")
        {
         title = (
          <Typography variant="subtitle2"  >

            <strong>{notification.title}</strong> 
            <Typography   component="span" variant="body2" sx={{ color: 'text'}}>
              &nbsp; {notification.description}
            </Typography>
            <br></br>
            <Typography variant="subtitle3"  component="span" variant="body2" sx={{ color: 'text'}}>
            <Link to= {notification.URL}>
             <p> Click here to check.</p>   
            </Link>
            </Typography>

          </Typography>
        );
        }
        else  if (notification.title ==="Pending Leave")
        {
         title = (
          <Typography variant="subtitle2"  >

            <strong>{notification.title}</strong> 
            <Typography   component="span" variant="body2" sx={{ color: 'text'}}>
              &nbsp; {notification.description}
            </Typography>
            <br></br>
            <Typography variant="subtitle3"  component="span" variant="body2" sx={{ color: 'text'}}>
            <Link to= {notification.URL}>
             <p> Click here to check.</p>   
            </Link>
            </Typography>

          </Typography>
        );
        }
        else  if (notification.title ==="Event")
        {
         title = (
          <Typography variant="subtitle2"  >

            <strong>{notification.title}</strong> 
            <Typography   component="span" variant="body2" sx={{ color: 'text'}}>
              &nbsp; {notification.description}
            </Typography>
            <br></br>
            <Typography variant="subtitle3"  component="span" variant="body2" sx={{ color: 'text'}}>
            <Link to= {notification.URL}>
             <p> Click here to check.</p>   
            </Link>
            </Typography>

          </Typography>
        );
        }
      
        if (notification.title === 'Certification Expiry') {
          return {
            avatar: <img alt={notification.title} src= {ic_expiry} />,
            title
          };
        }
        if (notification.title === 'Payroll') {
          return {
            avatar: <img alt={notification.title} src= {ic_salary} />,
            title
          };
        }
        if (notification.title === 'Event') {
          return {
            avatar: <img alt={notification.title} src= {Notification_EventIcon} />,
            title
          };
        }
        if (notification.title === 'Daily View') {
          return {
            avatar: <img alt={notification.title}  src= {Notification_DailyViewIcon} />,
            title
          };
        }
        if (notification.title === 'Pending Leave') {
            return {
              avatar: <img alt={notification.title} src= {ic_notification_chat} />,
              title
            };
          }
      }
      
      NotificationItem.propTypes = {
        notification: PropTypes.object.isRequired
      };








      
      function NotificationItem({ notification }) {
        const { avatar, title } = renderContent(notification);


      
        return (
          <ListItemButton
            to="#"
            
            disableGutters
            component={RouterLink}
            sx={{
              py: 1.5,
              px: 2.5,
              mt: '1px',
              ...(notification.isUnRead && {
                bgcolor: 'action.selected'
              })
            }}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
            </ListItemAvatar>
           
            <ListItemText
              primary={title}
              secondary={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    color: 'text'
                  }}
                >

                </Typography>
              }
            />
          </ListItemButton>
        );
      }



    const ShowNotification = ()=>
    {
       store.removeAllNotifications();


       const body = new URLSearchParams({ 'UserID': user });
            
            api.post('/Maintenance/Notifications/GetAllUserNotifications', body).then(res => {
            
                let data = res.data;

                if (data.length >0)
                {
                    setbadgecount(data.length);
                    setNotifications(data.map(x=>x));

                }
          
                
            //   for (var i =0; i < data.length ; i ++)
            //   {
            //       setbadgecount(data.length);

            //     store.addNotification({
            //         title: data[i].Module,
            //         message: data[i].Message,
            //         type: data[i].Type,
            //         insert: data[i].insert,
            //         container: data[i].container,
            //         dismiss: {
            //           duration: 6000,
            //           onScreen: true
            //         }
            //       });
            //   }

                    
                }).catch(
                    err => {
                        console.log(err);
                        
                    }
                );
    }

    const history = useCallback(useHistory(), []);
    const useStyles = makeStyles((theme) => ({
        root: {
          '& > *': {
            margin: theme.spacing(2),
          },
        },
      }));
      

      const OpenFeedBackForm = () => {
   
        history.push('/FeedBack');
    };
      const defaultProps = {
        color: 'secondary',
        children: <MailIcon />,
      };

      const classes = useStyles();
      useEffect(() => { // Single Site - Disable button.

      
        if (currentSite) {
          
            const body = new URLSearchParams({ 'UserID': user });
            
            api.post('/Maintenance/Notifications/GetAllUserNotifications', body).then(res => {
            
                let data = res.data;

                if (data.length >0)
                {
                    setbadgecount(data.length);
                    setNotifications(data.map(x=>x));

                }
                console.log(notifications);
                
            //   for (var i =0; i < data.length ; i ++)
            //   {
            //       setbadgecount(data.length);

            //     store.addNotification({
            //         title: data[i].Module,
            //         message: data[i].Message,
            //         type: data[i].Type,
            //         insert: data[i].insert,
            //         container: data[i].container,
            //         dismiss: {
            //           duration: 6000,
            //           onScreen: true
            //         }
            //       });
            //   }

                    
                }).catch(
                    err => {
                        console.log(err);
                        
                    }
                );
        }
    }, []);

    return (
        <div className='header-container'>
            <div className='header-left'>
                <Logo></Logo>
                { navbarData ? 
      
                    options.map( title => {
                        if (navbarData[title] && navbarData[title].length > 0) {
                            return (
                                <HeaderDropdown  title={title} key={title}>
                                    { navbarData[title].map(x => {
                                        if (x.Header === 'Y')
                                        {
                                            return (<Link className='link--remove-style header-dropdown--item' key={x.Name} to={x.URL}>{x.Name}</Link>);
                                        }
                                        return null;
                                    }) }
                                </HeaderDropdown>
                            );
                        } 
                        else {
                            return null;
                        }
                    }) : null
                }
            </div>
            <div className='header-right'>
            <PopupState variant="popover" popupId="demo-popup-popover">
            {(popupState) => (
             <div>
                   <IconButton {...bindTrigger(popupState)}>
            <Badge  badgeContent={badgecount} color="secondary">
            <img height= "35" width ="35" src={Notificationsicon}></img>
            </Badge>
           </IconButton>
            
             <Popover
               {...bindPopover(popupState)}
               anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
                }}
              transformOrigin={{
               vertical: 'top',
               horizontal: 'center',
               }}
               >
            <Typography sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5, height:1 }}>
            <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {badgecount}  messages
            </Typography>
          </Box>
        </Box>

        <Divider />
        <List disablePadding >
            {notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </List>
            </Typography>
          </Popover>
        </div>
      )}
       </PopupState>
        
                <Tooltip title='Feedback'>
                <IconButton aria-label='Feedback'  onClick={OpenFeedBackForm}>
                <img height= "35" width ="35" src={feedbackicon}></img>
                </IconButton>
            </Tooltip>
               
                <Settings></Settings>
                <LogOut></LogOut>
               
            </div>
         
        </div>

        

    
    )
};

export default Header;