import './loadingIndicator.scss';
import React from 'react';
import LogoGIF from './logo_load.gif';
import CircularProgress from '@material-ui/core/CircularProgress';
import  GifPlayer  from'react-gif-player';

const CircleProgress = ({size}) => {
    return (
        <CircularProgress style={{ color: 'rgb(35,168,224)'}} size={size} />
    );
};

// const LoadingIndicator = () => {
//     return (
//        // <img className="indicator-size" src={LogoGIF}  />
//        // <GifPlayer gif={LogoGIF} still={LogoGIF} />
//        <CircularProgress size="50" className="indicator-size" />
    
//     );
// };
//export default CircleProgress;
//export default LoadingIndicator;
export { CircleProgress };
