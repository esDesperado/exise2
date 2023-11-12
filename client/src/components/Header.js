import React, {useContext} from 'react';
import {Context} from '../index';
import {observer} from "mobx-react-lite";
import LazyImage from "./LazyImage";
import {changeSite} from "../http/API";
const Header = observer((data) => {
    const {inface} = useContext(Context)
    return(
        <header className='main-header'>
            <div style={{width:'1000px'}}>
                <LazyImage style={{height:'20px',minWidth: '30px',objectFit: 'contain',objectPosition: 'center'}} src={process.env.REACT_APP_API_URL + 'exise_logo.png'} alt=''/>
                <button className='header-link'>Услуги</button>
                <button className='header-link'>Цены</button>
                <button className='header-link'>Портфолио</button>
                <button className='header-link'>Заказать</button>
                <a style={{textDecoration:'none',fontWeight:'600',display:'grid',gridAutoFlow:'column',alignItems:'center',gridGap:'5px'}} href='tel:89083087955'>
                    <svg style={{width:'15px',height:'15px',cursor:'pointer',fill:'grey',overflow:'hidden',paddingTop:'4px'}} viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg"><use xlinkHref='#phoneSVG' ></use></svg>
                    <span>8 908 308 79 55</span>
                </a>
            </div>
        </header>
    );
});
export default Header;