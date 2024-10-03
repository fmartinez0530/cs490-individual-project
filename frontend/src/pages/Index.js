import React from "react";
import { useState } from 'react';

import QueryTable from '../components/QueryTable';
import PopupInfo from "../components/PopupInfo";

import './Index.css'
import './PagesMobile.css'
import '../components/PopupInfo.css'
import '../presets.css'

const Index = () => {
    const [selectedValue, setSelectedValue] = useState("hidden"); // State to hold the selected value
    const [originalData, setOriginalData] = useState([]);
    const [selectedData, setSelectedData] = useState([]);
    const [tableId, setTableId] = useState(null);
    const [actorId, setActorId] = useState(null);

    const handleButtonClick = (visibility, tableId, originalTableData, selectedData, actorId) => {
        setSelectedValue(visibility); // Update the state with the clicked value
        setOriginalData(originalTableData);
        setSelectedData(selectedData);
        setTableId(tableId);

        if (actorId) {
            setActorId(actorId);
        }
    };

    const closePopup = () => {
        setSelectedValue("hidden");
    }

    //  Used for PopupInfo
    //const [state, setState] = useState("hidden");
    //const changeState = (newState) => {
    //    setState(newState);
    //};

    return (
        <>
            <div className="tables-container flex-row flex-centered-100">
                <div>
                    <h1>TOP 5 RENTED FILMS</h1>
                    <QueryTable tableId={0} onButtonClick={handleButtonClick} />
                </div>
                <div>
                    <h1>TOP 5 ACTORS</h1>
                    <QueryTable tableId={1} onButtonClick={handleButtonClick} />
                </div>
            </div>
            <PopupInfo
                props={{ "tableId": tableId, "tableData": originalData, "selectedData": selectedData, "actorId": actorId }}
                visible={selectedValue}
                closePopup={closePopup}
            />
        </>
    );
};

export default Index;