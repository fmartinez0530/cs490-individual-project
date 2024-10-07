import React from "react";
import { useEffect, useState } from 'react';

import './QueryTable.css'

const QueryTable = ({ tableId, onButtonClick }) => {
    const [tableData, setTableData] = useState(null);
    const [movieData, setMovieData] = useState(null);
    const [actorData, setActorData] = useState(null);
    const [actorId, setActorId] = useState(null);

    useEffect(() => {
        fetchLandingPageData();
        function fetchLandingPageData() {
            fetch(`http://localhost:5000/landing_page_tables?tableId=${encodeURIComponent(tableId)}`)
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    setTableData(data);
                    clearInterval(fetchLandingPageInterval);
                })
                .catch((err) => {
                    console.error('Error fetching data:', err);
                })
        }

        const fetchLandingPageInterval = setInterval(() => {
            fetchLandingPageData();
        }, 5000);
        return () => clearInterval(fetchLandingPageInterval);
    }, [tableId]);

    useEffect(() => {
        if (movieData && tableData) {
            onButtonClick("visible", tableId, tableData, movieData);
        }
    }, [movieData, tableData, tableId]);

    useEffect(() => {
        if (actorData && tableData) {
            onButtonClick("visible", tableId, tableData, actorData, actorId);
        }
    }, [actorData, actorId, tableData, tableId]);

    function displayClickedRowData(clicked_elem, table_id) {
        if (table_id === 0) {
            let movieName = clicked_elem.title;
            console.log(movieName);

            fetch(`http://localhost:5000/selected_movie_data?movieName=${encodeURIComponent(movieName)}`)
                .then(res => res.json())
                .then(data => {
                    console.log(data); // Log the data to check the order
                    setMovieData(data);
                })
                .catch(err => console.error('Error fetching data:', err))
        }
        else {
            let actorId = clicked_elem.actor_id;

            fetch(`http://localhost:5000/selected_actor_data?actorId=${encodeURIComponent(actorId)}`)
                .then(res => res.json())
                .then(data => {
                    console.log(data); // Log the data to check the order
                    setActorData(data);
                    setActorId(actorId);
                })
                .catch(err => console.error('Error fetching data:', err))
        }
        //changeState("visible");
        //onButtonClick("visible", table_id, tableData, table_id === 0 ? movieData : actorData);
    }

    return (
        <>
            <div>
                {tableData && tableData.length > 0 ? (
                    <table className="table" border={1}>
                        <thead>
                            <tr>
                                {tableId === 0 ? (
                                    <>
                                        <th className="table-cell bot-border">Film Id</th>
                                        <th className="table-cell bot-border">Film Title</th>
                                        <th className="table-cell bot-border">Film Category</th>
                                        <th className="table-cell bot-border">Rental Count</th>
                                    </>
                                ) : (
                                    <>
                                        <th className="table-cell bot-border">Actor Id</th>
                                        <th className="table-cell bot-border">First Name</th>
                                        <th className="table-cell bot-border">Last Name</th>
                                        <th className="table-cell bot-border">Movies</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map(row => (
                                <tr key={tableId === 0 ? row.film_id : row.actor_id}>
                                    {tableId === 0 ? (
                                        <>
                                            <td className="table-cell" onClick={() => displayClickedRowData(row, tableId)} key={`film-${row.film_id}`}>{row.film_id}</td>
                                            <td className="table-cell" onClick={() => displayClickedRowData(row, tableId)} key={`film-${row.title}`}>{row.title}</td>
                                            <td className="table-cell" onClick={() => displayClickedRowData(row, tableId)} key={`film-${row.category}`}>{row.category}</td>
                                            <td className="table-cell" onClick={() => displayClickedRowData(row, tableId)} key={`film-${row.rental_count}`}>{row.rental_count}</td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="table-cell" onClick={() => displayClickedRowData(row, tableId)} key={`actor-${row.actor_id}`}>{row.actor_id}</td>
                                            <td className="table-cell" onClick={() => displayClickedRowData(row, tableId)} key={`actor-${row.first_name}`}>{row.first_name}</td>
                                            <td className="table-cell" onClick={() => displayClickedRowData(row, tableId)} key={`actor-${row.last_name}`}>{row.last_name}</td>
                                            <td className="table-cell" onClick={() => displayClickedRowData(row, tableId)} key={`actor-${row.movies}`}>{row.movies}</td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No data available</p>
                )}
            </div>
        </>
    )
}

export default QueryTable;