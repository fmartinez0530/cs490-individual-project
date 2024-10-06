import React from "react";
import { useEffect, useState, useMemo } from "react";

import PaginationTest from '../components/PaginationTest';
import Filter from '../components/Filter';

import './FilterTable.css'
import '../presets.css'

let PageSize = 10;

const Films = () => {
    const [filmsData, setFilmsData] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);

    const [filterTerm, setFilterTerm] = useState("film_title");
    const [filterInput, setFilterInput] = useState(null);

    const { paginatedData, tableLength } = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        let newFilmsData = filmsData;
        if (filterInput) {
            if (filterTerm === "film_title") {
                newFilmsData = filmsData.filter(user => user.title?.toString().toLowerCase().includes(filterInput.toString().toLowerCase()));
            }
            else if (filterTerm === "actor_name") {
                newFilmsData = filmsData.filter(user => user.actors?.toString().toLowerCase().includes(filterInput.toString().toLowerCase()));

                // Rearrange the actor's names to show matching actors first
                newFilmsData = newFilmsData.map(user => {
                    const actorsArray = user.actors.split(', ');
                    const filteredActors = actorsArray.filter(actor =>
                        actor.toLowerCase().includes(filterInput.toLowerCase())
                    );

                    const otherActors = actorsArray.filter(actor =>
                        !actor.toLowerCase().includes(filterInput.toLowerCase())
                    );

                    // Combine matching actors first with the rest
                    return { ...user, actors: [...filteredActors, ...otherActors].join(', ') };
                });

            }
            else if (filterTerm === "film_genre") {
                newFilmsData = filmsData.filter(user => user.category?.toString().toLowerCase().includes(filterInput.toString().toLowerCase()));
            }
        }
        return {
            paginatedData: newFilmsData.slice(firstPageIndex, lastPageIndex),
            tableLength: newFilmsData.length
        };
    }, [currentPage, filmsData, filterInput, filterTerm]);

    useEffect(() => {
        function fetchFilmsData() {
            fetch(`http://localhost:5000/films_list`)
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    setFilmsData(data);
                    clearInterval(fetchFilmsDataInterval);
                    //window.clearInterval(0);
                })
                .catch(err => console.error('Error fetching data:', err));
        }

        fetchFilmsData();
        const fetchFilmsDataInterval = setInterval(fetchFilmsData, 5000);

        return () => clearInterval(fetchFilmsDataInterval);
    }, []);

    return (
        <>
            <div className="flex-col flex-centered">
                {/*
                <div>
                    <h1>
                        This is the Films Page.
                    </h1>
                </div>
                */}

                <Filter
                    filters={["film_title", "film_genre", "actor_name"]}
                    onFilterChange={filter => setFilterTerm(filter)}
                    onInputChange={input => {
                        setFilterInput(input);
                        setCurrentPage(1); // Reset to the first page
                    }}
                    className="filter-search"
                />
                <PaginationTest
                    //className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={tableLength}
                    pageSize={PageSize}
                    onPageChange={page => setCurrentPage(page)}
                />
                <table className="filtered-table">
                    <thead>
                        <tr>
                            <th className="table-cell bot-border" style={{ width: "100px" }}>ID</th>
                            <th className="table-cell bot-border" style={{ width: "300px" }}>Title</th>
                            <th className="table-cell bot-border" style={{ width: "200px" }}>Genre</th>
                            <th className="table-cell bot-border">Actors</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length > 0 ? (
                            <>
                                {paginatedData.map(row => (
                                    <tr className="hoverable-row" key={`film-${row.FID}`}>
                                        <td className="table-cell" style={{ textAlign: "center" }}>{row.FID}</td>
                                        <td className="table-cell">{row.title}</td>
                                        <td className="table-cell width-100">{row.category}</td>
                                        <td className="wrap-cell table-cell max-width-500">{row.actors}</td>
                                    </tr>
                                ))}
                                {/* Add empty rows if necessary */}
                                {Array.from({ length: PageSize - paginatedData.length }).map((_, index) => (
                                    <tr key={`empty-row-${index}`}>
                                        <td colSpan="3" className="empty-row table-cell"></td> {/* Adjust colspan based on your table structure */}
                                    </tr>
                                ))}
                            </>
                        ) : (
                            <>
                                <tr key={"empty-data"}>
                                    <td className="table-cell" colSpan="3">No films found.</td> {/* Adjust colspan based on your table structure */}
                                </tr>
                                {Array.from({ length: PageSize - paginatedData.length }).map((_, index) => (
                                    <tr key={`empty-row-${index}`}>
                                        <td colSpan="3" className="empty-row table-cell"></td> {/* Adjust colspan based on your table structure */}
                                    </tr>
                                ))}
                            </>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Films;