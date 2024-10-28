import React, { useState, useEffect, useRef } from 'react';
import editCustomerIcon from '../editCustomerIcon.png';

const PopupInfo = ({ props, visible, closePopup, rowClicked, updatedCustomer, removedCustomer }) => {
    const [selectedCustomerData, setSelectedCustomerData] = useState(null);
    const [updateCustomerRental, setCustomerRental] = useState(0);
    const [selectedFilmData, setSelectedFilmData] = useState(null);
    const [rentalHiddenState, setRentalHiddenState] = useState('visible');
    const [detailsHiddenState, setDetailsHiddenState] = useState('fully-hidden');
    const [rentResponseHiddenState, setRentResponseHiddenState] = useState('fully-hidden');

    const [customerName, setCustomerName] = useState('');

    const inputRefs = useRef({
        name: null,
        email: null,
        address: null,
        district: null,
        zipCode: null,
        city: null,
        country: null,
        phone: null
    });

    const rentResponseRef = useRef({
        resContainer: null
    });

    //  Variables used for tabledId === 0
    var title, desc, rel_year, rating, spec_feat;

    //  Variable for tableId === 1
    var name;

    //  Variable for tableId === 2
    //var name2;

    //  Variable for tableId === 3
    var name3;

    if (props.tableId === 0) {
        title = props.selectedData[0] ? props.selectedData[0].title : "N/A";
        desc = props.selectedData[0] ? props.selectedData[0].description : "N/A";
        rel_year = props.selectedData[0] ? props.selectedData[0].release_year : "N/A";
        rating = props.selectedData[0] ? props.selectedData[0].rating : "N/A";
        spec_feat = props.selectedData[0] ? props.selectedData[0].special_features : "N/A";
    }
    else if (props.tableId === 1) {
        for (let i = 0; i < props.tableData.length; i++) {
            //console.log(props.tableData[i])
            if (props.tableData[i].actor_id === props.actorId) {
                name = props.tableData[i].first_name + " " + props.tableData[i].last_name;
                break;
            }
        }
    }
    else if (props.tableId === 2) {
        //name2 = props.clickedName ? props.clickedName : "N/A";
    }
    else {
        name3 = props.clickedName ? props.clickedName : "N/A";
    }

    useEffect(() => {
        if (props.tableId === 2) {
            fetch(`http://localhost:5000/customer_rental_hist?customerId=${encodeURIComponent(props.clickedId)}`)
                .then(res => res.json())
                .then(data => {
                    setSelectedCustomerData(data);
                    setCustomerRental(null);
                    setCustomerName(props.clickedName);
                })
                .catch(err => console.error('Error fetching data:', err));
        }
        else if (props.tableId === 3) {
            fetch(`http://localhost:5000/selected_movie_data?movieName=${encodeURIComponent(props.clickedName)}`)
                .then(res => res.json())
                .then(data => {
                    setSelectedFilmData(data);
                })
                .catch(err => console.error('Error fetching data:', err));
        }
    }, [props.clickedId, props.clickedName, rowClicked, updateCustomerRental, props.tableId]);

    function closePopupInfo() {
        if (selectedCustomerData) {
            setSelectedCustomerData(null);
            setSelectedFilmData(null);
            setRentalHiddenState('visible');
            setDetailsHiddenState('fully-hidden');
        }
        clearInputData();
        closePopup();
    }

    //  Function used to update this row's return date
    function hasReturnedMovie(custId, rentalId) {
        if (window.confirm("Proceed with removing this active rental?")) {
            // Update the rental record in the database
            fetch('http://localhost:5000/update_customer_rental_history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ custId, rentalId, return_date: new Date().toISOString().slice(0, 19).replace('T', ' ') }),
            })
                .then(response => response.json())
                .then(() => {
                    setCustomerRental(1);
                })
                .catch(err => console.error('Error updating rental:', err));
        }
    }

    function rentFilm() {
        let customerId = document.getElementById("num-input").value;
        let filmId = selectedFilmData[0].film_id;
        fetch('http://localhost:5000/rent_film', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ customerId, filmId, rentalDate: new Date().toISOString().slice(0, 19).replace('T', ' ') }),
        })
            .then(res => res.json())
            .then(data => {
                rentResponseRef.current.resContainer.innerHTML = data.message;
                setRentResponseHiddenState('visible');
            })
            /*
            .then(res => {
                return res.json().then(data => {
                    rentResponseRef.current.resContainer.innerHTML = data.message;
                    setRentResponseHiddenState('visible');
                });
            })
            */
            .catch(err => console.error('Error fetching data:', err));
    }

    function showEditCustomerDetails() {
        setDetailsHiddenState('visible');
        setRentalHiddenState('fully-hidden');
    }

    function showRentalHistory() {
        setDetailsHiddenState('fully-hidden');
        setRentalHiddenState('visible');

        clearInputData();
    }

    function hideRentResponse() {
        setRentResponseHiddenState('fully-hidden');
    }

    function sendUpdatedCustomerData() {
        const inputName = inputRefs.current.name.value !== null ? inputRefs.current.name.value : "";
        const inputEmail = inputRefs.current.email.value !== null ? inputRefs.current.email.value : "";
        const inputAddress = inputRefs.current.address.value !== null ? inputRefs.current.address.value : "";
        const inputDistrict = inputRefs.current.district.value !== null ? inputRefs.current.district.value : "";
        const inputZipCode = inputRefs.current.zipCode.value !== null ? inputRefs.current.zipCode.value : "";
        const inputCity = inputRefs.current.city.value !== null ? inputRefs.current.city.value : "";
        const inputCountry = inputRefs.current.country.value !== null ? inputRefs.current.country.value : "";
        const inputPhoneNum = inputRefs.current.phone.value !== null ? inputRefs.current.phone.value : "";

        console.log(inputName);
        console.log(inputAddress);
        if (inputRefs.current.name.value !== null) {
            setCustomerName(inputRefs.current.name.value.toUpperCase());
        }

        //name2 = inputRefs.current.name.value !== null ? inputRefs.current.name.value : props.clickedName;

        if (inputName === "") {
            console.log("No name inputted");
        }

        fetch('http://localhost:5000/update_existing_customer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ customerId: props.clickedId, inputName, inputEmail, inputAddress, inputDistrict, inputZipCode, inputCity, inputCountry, inputPhoneNum }),
        })
            .then(res => res.json())
            .then(updatedCustomer)
            .catch(err => console.error('Error fetching data:', err));
    }

    function clearInputData() {
        if (props.tableId === 2) {
            inputRefs.current.name.value = null;
            inputRefs.current.email.value = null;
            inputRefs.current.address.value = null;
            inputRefs.current.district.value = null;
            inputRefs.current.zipCode.value = null;
            inputRefs.current.city.value = null;
            inputRefs.current.country.value = null;
            inputRefs.current.phone.value = null;
        }
    }

    function removeCustomer() {
        if (window.confirm("This action will permanently remove this customer from the system. Proceed?")) {
            closePopupInfo();
            fetch('http://localhost:5000/remove_customer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ customerId: props.clickedId }),
            })
                .then(res => res.json())
                .then(removedCustomer)
                .catch(err => console.error('Error fetching data:', err));
        }
    }

    return (
        <div id='backdrop-container' className={visible}>
            <div className='popup-info'>
                <button onClick={closePopupInfo}>X</button>
                {props.tableId === 0 ? (
                    <>
                        <h2>{title}</h2>
                        <p id='wrapDescription' className='padding-info'><u>Description:</u> {desc}</p>
                        <p className='padding-info'><u>Release Year:</u> {rel_year}</p>
                        <p className='padding-info'><u>Rating:</u> {rating}</p>
                        <p className='padding-info'><u>Special Features:</u> {spec_feat}</p>
                    </>
                ) : props.tableId === 1 ? (
                    <>
                        <h2>{name}</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Film Title</th>
                                    <th>Rental Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.selectedData.map(row => (
                                    <tr key={row.film_id}>
                                        <>
                                            <td className='cell-info-actor'>{row.title}</td>
                                            <td className='cell-info-actor'>{row.rental_count}</td>
                                        </>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                ) : props.tableId === 2 ? (
                    <>
                        <div className='flex-row flex-centered'>
                            <h2>{customerName}</h2>
                            <input type='image' src={editCustomerIcon} width={50} height={50} alt='edit_customer_icon' onClick={showEditCustomerDetails} className={rentalHiddenState}></input>
                        </div>
                        <div className={`remove-customer-container ${rentalHiddenState}`}>
                            <input type='button' onClick={removeCustomer} value={'REMOVE CUSTOMER'} className='rm-cust-btn'></input>
                        </div>

                        <div id='rental-history-container' className={rentalHiddenState}>
                            <h3>Past Rentals</h3>
                            <div id="pastRentalsTable" className='overflowing-table-container'>
                                <table>
                                    <thead>
                                        <tr className='sticky-heading'>
                                            <th>RENTAL ID</th>
                                            <th>STORE ID</th>
                                            <th style={{ width: "210px" }}>DATE RENTED</th>
                                            <th style={{ width: "210px" }}>DATE RETURNED</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedCustomerData && selectedCustomerData.map(row => {
                                            if (row.return_date !== null) {
                                                return (
                                                    <tr key={row.rental_id}>
                                                        <td className=''>{row.rental_id}</td>
                                                        <td className=''>{row.staff_id}</td>
                                                        <td className=''>{row.rental_date}</td>
                                                        <td className=''>{row.return_date}</td>
                                                    </tr>
                                                )
                                            }
                                            return null;
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <h3>Active Rentals (Click to confirm film returned)</h3>
                            <div id="activeRentalsTable" className='overflowing-table-container'>
                                <table>
                                    <thead>
                                        <tr className='sticky-heading'>
                                            <th>RENTAL ID</th>
                                            <th>STORE ID</th>
                                            <th style={{ width: "210px" }}>DATE RENTED</th>
                                            <th style={{ width: "210px" }}>DATE RETURNED</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedCustomerData && selectedCustomerData.some(row => row.return_date === null) ? (
                                            selectedCustomerData.map(row => {
                                                if (row.return_date === null) {
                                                    return (
                                                        <tr key={`active-${row.rental_id}`} className='hoverable-row' onClick={() => hasReturnedMovie(row.customer_id, row.rental_id)}>
                                                            <td key={`cell-${row.rental_id}`} className=''>{row.rental_id}</td>
                                                            <td key={`cell-${row.staff_id}`} className=''>{row.staff_id}</td>
                                                            <td key={`cell-${row.rental_date}`} className=''>{row.rental_date}</td>
                                                            <td key={`cell-blank-${row.rental_id}}`} className=''>N/A</td>
                                                        </tr>
                                                    );
                                                }
                                                return null;
                                            })
                                        ) : (
                                            <tr key="no-active-rentals">
                                                <td colSpan="4">No active rentals</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div id='edit-details-container' className={`${detailsHiddenState}`}>
                            <div className='flex-col'>
                                <div className='flex-centered details-title'>EDIT DETAILS</div>
                                <div className='padding-info flex-row flex-space-between'>
                                    <label htmlFor='inputName'>New Name:&nbsp;&nbsp;</label>
                                    <input type='text' placeholder={props.clickedName} ref={el => (inputRefs.current.name = el)} name='inputName'></input>
                                </div>

                                <div className='padding-info flex-row flex-space-between'>
                                    <label htmlFor='inputEmail'>New Email&nbsp;&nbsp;</label>
                                    <input type='text' placeholder={props.tableData.length > 0 && props.clickedId && props.tableData[props.tableData.findIndex(item => item.customer_id === props.clickedId)] ? props.tableData[props.tableData.findIndex(item => item.customer_id === props.clickedId)].email : "N/A"} ref={el => (inputRefs.current.email = el)} name='inputEmail'></input>
                                </div>

                                <div className='padding-info flex-row flex-space-between'>
                                    <label htmlFor='inputAddress'>New Address:&nbsp;&nbsp;</label>
                                    <input type='text' placeholder={props.tableData.length > 0 && props.clickedId && props.tableData[props.tableData.findIndex(item => item.customer_id === props.clickedId)] ? props.tableData[props.tableData.findIndex(item => item.customer_id === props.clickedId)].address : "N/A"} ref={el => (inputRefs.current.address = el)} name='inputAddress'></input>
                                </div>

                                <div className='padding-info flex-row flex-space-between'>
                                    <label htmlFor='inputDistrict'>New District:&nbsp;&nbsp;</label>
                                    <input type='text' placeholder={props.tableData.length > 0 && props.clickedId && props.tableData[props.tableData.findIndex(item => item.customer_id === props.clickedId)] ? props.tableData[props.tableData.findIndex(item => item.customer_id === props.clickedId)].district : "N/A"} ref={el => (inputRefs.current.district = el)} name='inputDistrict'></input>
                                </div>


                                <div className='padding-info flex-row flex-space-between'>
                                    <label htmlFor='inputZipCode'>New Zip Code:&nbsp;&nbsp;</label>
                                    <input type='text' placeholder={props.tableData.length > 0 && props.clickedId && props.tableData[props.tableData.findIndex(item => item.customer_id === props.clickedId)] ? props.tableData[props.tableData.findIndex(item => item.customer_id === props.clickedId)].postal_code : "N/A"} ref={el => (inputRefs.current.zipCode = el)} name='inputZipCode'></input>
                                </div>
                                <div className='padding-info flex-row flex-space-between'>
                                    <label htmlFor='inputCity'>New City:&nbsp;&nbsp;</label>
                                    <input type='text' placeholder={props.tableData.length > 0 && props.clickedId && props.tableData[props.tableData.findIndex(item => item.customer_id === props.clickedId)] ? props.tableData[props.tableData.findIndex(item => item.customer_id === props.clickedId)].city : "N/A"} ref={el => (inputRefs.current.city = el)} name='inputCity'></input>
                                </div>

                                <div className='padding-info flex-row flex-space-between'>
                                    <label htmlFor='inputCountry'>New Country:&nbsp;&nbsp;</label>
                                    <input type='text' placeholder={props.tableData.length > 0 && props.clickedId && props.tableData[props.tableData.findIndex(item => item.customer_id === props.clickedId)] ? props.tableData[props.tableData.findIndex(item => item.customer_id === props.clickedId)].country : "N/A"} ref={el => (inputRefs.current.country = el)} name='inputCountry'></input>
                                </div>

                                <div className='padding-info flex-row flex-space-between'>
                                    <label htmlFor='inputPhoneNum'>New Phone #:&nbsp;&nbsp;</label>
                                    <input type='text' placeholder={props.tableData.length > 0 && props.clickedId && props.tableData[props.tableData.findIndex(item => item.customer_id === props.clickedId)] ? props.tableData[props.tableData.findIndex(item => item.customer_id === props.clickedId)].phone : "N/A"} ref={el => (inputRefs.current.phone = el)} name='inputPhoneNum'></input>
                                </div>

                                <div className='padding-info flex-row flex-centered'>
                                    <input type='button' onClick={showRentalHistory} value={"GO BACK"}></input>
                                    <input type='button' onClick={sendUpdatedCustomerData} value={"SUBMIT"}></input>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <h2>{name3}</h2>
                        {selectedFilmData && selectedFilmData.map(row => {
                            return (
                                <React.Fragment key={row.film_id}>
                                    <p className='padding-info'><u>Description:</u>&nbsp;&nbsp;&nbsp;{row.description}</p>
                                    <p className='padding-info'><u>Release Year:</u>&nbsp;&nbsp;&nbsp;{row.release_year}</p>
                                    <p className='padding-info'><u>Rental Duration:</u>&nbsp;&nbsp;&nbsp;{row.rental_duration}&nbsp;days</p>
                                    <p className='padding-info'><u>Rental Rate:</u>&nbsp;&nbsp;&nbsp;${row.rental_rate}</p>
                                    <p className='padding-info'><u>Film Length:</u>&nbsp;&nbsp;&nbsp;{row.length}&nbsp;min</p>
                                    <p className='padding-info'><u>Replacement Cost:</u>&nbsp;&nbsp;&nbsp;${row.replacement_cost}</p>
                                    <p className='padding-info'><u>Film Rating:</u>&nbsp;&nbsp;&nbsp;{row.rating}</p>
                                    <p className='padding-info'><u>Special Features:</u>&nbsp;&nbsp;&nbsp;{row.special_features}</p>
                                    <div className='padding-info rent-film-container'>
                                        <input className='input-cust-rent-btn' onClick={hideRentResponse} id='num-input' type='number' placeholder='Customer ID...' min={'1'}></input>
                                        <input className='submit-cust-rent-btn' type='submit' id='submit-btn' value="RENT FILM" onClick={rentFilm}></input>
                                    </div>
                                    <div className={`${rentResponseHiddenState} rent-response-container`} ref={el => (rentResponseRef.current.resContainer = el)}></div>
                                </React.Fragment>
                            )
                        })}
                    </>
                )}
            </div >
        </div >
    );
};

export default PopupInfo;