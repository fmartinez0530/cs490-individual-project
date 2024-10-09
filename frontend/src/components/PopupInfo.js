import React, { useState, useEffect } from 'react';

const PopupInfo = ({ props, visible, closePopup, rowClicked }) => {
    const [selectedCustomerData, setSelectedCustomerData] = useState(null);
    const [updateCustomerRental, setCustomerRental] = useState(0);
    const [selectedFilmData, setSelectedFilmData] = useState(null);

    //  Variables used for tabledId === 0
    var title, desc, rel_year, rating, spec_feat;

    //  Variable for tableId === 1
    var name;

    //  Variable for tableId === 2
    var name2;

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
        name2 = props.clickedName ? props.clickedName : "N/A";
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
    }, [props.clickedId, props.clickedName, rowClicked, updateCustomerRental]);

    function closePopupInfo() {
        if (selectedCustomerData) {
            setSelectedCustomerData(null);
            setSelectedFilmData(null);
        }
        closePopup();
    }

    //  Function used to update this row's return date
    function hasReturnedMovie(custId) {
        if (window.confirm("Proceed with removing this active rental?")) {
            console.log(custId);
            // Update the rental record in the database
            fetch('http://localhost:5000/update_customer_rental_history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ custId, return_date: new Date().toISOString().slice(0, 19).replace('T', ' ') }),
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
        console.log(customerId);
        console.log(filmId);
        console.log(selectedFilmData[0]);
        fetch('http://localhost:5000/rent_film', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ customerId, filmId, rentalDate: new Date().toISOString().slice(0, 19).replace('T', ' ') }),
        })
            .then(res => res.json())

            .catch(err => console.error('Error fetching data:', err));
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
                        <h2>{name2}</h2>
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
                                                    <tr key={row.rental_id} className='hoverable-row' onClick={() => hasReturnedMovie(row.customer_id)}>
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
                                        <tr key="row">
                                            <td key={"1"} className=''></td>
                                            <td key={"2"} className=''></td>
                                            <td key={"3"} className=''></td>
                                            <td key={"4"} className=''></td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <>
                        <h2>{name3}</h2>
                        {selectedFilmData && selectedFilmData.map(row => {
                            return (
                                <>
                                    <p key="description" className='padding-info'><u>Description:</u>&nbsp;&nbsp;&nbsp;{row.description}</p>
                                    <p key="release" className='padding-info'><u>Release Year:</u>&nbsp;&nbsp;&nbsp;{row.release_year}</p>
                                    <p key="duration" className='padding-info'><u>Rental Duration:</u>&nbsp;&nbsp;&nbsp;{row.rental_duration}&nbsp;days</p>
                                    <p key="rate" className='padding-info'><u>Rental Rate:</u>&nbsp;&nbsp;&nbsp;${row.rental_rate}</p>
                                    <p key="length" className='padding-info'><u>Film Length:</u>&nbsp;&nbsp;&nbsp;{row.length}&nbsp;min</p>
                                    <p key="cost" className='padding-info'><u>Replacement Cost:</u>&nbsp;&nbsp;&nbsp;${row.replacement_cost}</p>
                                    <p key="rating" className='padding-info'><u>Film Rating:</u>&nbsp;&nbsp;&nbsp;{row.rating}</p>
                                    <p key="features" className='padding-info'><u>Special Features:</u>&nbsp;&nbsp;&nbsp;{row.special_features}</p>
                                    <div key="rent-container" className='padding-info rent-film-container'>
                                        <input key="num-input" id='num-input' type='number' placeholder='Customer ID...'></input>
                                        <input key="submit-btn" type='submit' id='submit-btn' value="RENT FILM" onClick={rentFilm}></input>
                                    </div>
                                </>
                            )
                        })}
                    </>
                )}
            </div >
        </div>
    );
};

export default PopupInfo;