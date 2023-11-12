import React, {useContext, useEffect,useState,useRef} from 'react';
import {observer} from "mobx-react-lite";
import {ADMIN_ROUTE} from "../../utils/consts";
import {Context} from "../../index";
import {useNavigate} from "react-router-dom";
import {setIAttr, setBAttr, addBlock, auth, changeSite, setObjProperty, deleteBlock, order} from "../../http/API"
import {Editor} from '@tinymce/tinymce-react';
import Distrib from "../../components/Distrib"
import LazyImage from "../../components/LazyImage";

const Image = observer(() => {

    return true

})

export default Image;