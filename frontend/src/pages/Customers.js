import React from "react";
import { useEffect, useState, useMemo } from "react";

import PaginationTest from '../components/PaginationTest';
import Filter from '../components/Filter';

import './FilterTable.css'
import '../presets.css'

let PageSize = 10;

const Customers = () => {
    const [customersData, setCustomersData] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);

    const [filterTerm, setFilterTerm] = useState("customer_id");
    const [filterInput, setFilterInput] = useState(null);

    const { paginatedData, tableLength } = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        let newCustomersData = customersData;
        if (filterInput) {
            if (filterTerm === "customer_id") {
                newCustomersData = customersData.filter(user => user.ID.toString().includes(filterInput.toString()));
            }
            else if (filterTerm === "first_name") {
                newCustomersData = customersData.filter(user => user.name.toString().toLowerCase().split(" ")[0].includes(filterInput.toString().toLowerCase()));
            }
            else if (filterTerm === "last_name") {
                newCustomersData = customersData.filter(user => user.name.toString().toLowerCase().split(" ")[1].includes(filterInput.toString().toLowerCase()));
            }
        }
        return {
            paginatedData: newCustomersData.slice(firstPageIndex, lastPageIndex),
            tableLength: newCustomersData.length
        };
    }, [currentPage, customersData, filterInput, filterTerm]);



    useEffect(() => {
        fetchCustomersData();
        function fetchCustomersData() {
            fetch(`http://localhost:5000/customers_list`)
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    setCustomersData(data);
                    clearInterval(fetchCustomersDataInterval);
                })
                .catch(err => console.error('Error fetching data:', err))
        }

        const fetchCustomersDataInterval = setInterval(() => {
            fetchCustomersData();
        }, 5000);

        return () => clearInterval(fetchCustomersDataInterval);

    }, []);
    return (
        <>
            <div className="flex-col flex-centered">
                {/*
                <div>
                    <h1>
                        This is the Customers Page.
                    </h1>
                </div>
                */}

                <Filter
                    filters={["customer_id", "first_name", "last_name"]}
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
                            <th className="table-cell bot-border">NAME</th>
                            <th className="table-cell bot-border">Address</th>
                            <th className="table-cell bot-border" style={{ width: "150px" }}>Zip Code</th>
                            <th className="table-cell bot-border">City</th>
                            <th className="table-cell bot-border">Country</th>
                            <th className="table-cell bot-border" style={{ width: "180px" }}>Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length > 0 ? (
                            <>
                                {customersData && paginatedData.map(row => (
                                    <tr className="hoverable-row" key={`customer-${row.ID}`}>
                                        <td className="table-cell" key={row.ID} style={{ textAlign: "center" }}>{row.ID}</td>
                                        <td className="table-cell" key={row.name}>{row.name}</td>
                                        <td className="table-cell wrap-cell max-width-340" key={row.address}>{row.address}</td>
                                        <td className="table-cell" key={row["zip code"]}>{row["zip code"]}</td>
                                        <td className="table-cell" key={row.city}>{row.city}</td>
                                        <td className="table-cell" key={row.country}>{row.country}</td>
                                        <td className="table-cell" key={row.phone}>{row.phone}</td>
                                    </tr>
                                ))}
                                {/* Add empty rows if necessary */}
                                {Array.from({ length: PageSize - paginatedData.length }).map((_, index) => (
                                    <tr key={`empty-row-${index}`}>
                                        <td colSpan="7" className="empty-row"></td> {/* Adjust colspan based on your table structure */}
                                    </tr>
                                ))}
                            </>
                        ) : (
                            <>
                                <tr key={"empty-data"}>
                                    <td colSpan="7">No customers found.</td> {/* Adjust colspan based on your table structure */}
                                </tr>
                                {Array.from({ length: PageSize - paginatedData.length }).map((_, index) => (
                                    <tr key={`empty-row-${index}`}>
                                        <td colSpan="7" className="empty-row"></td> {/* Adjust colspan based on your table structure */}
                                    </tr>
                                ))}
                            </>
                        )}
                    </tbody>
                </table>
            </div >
        </>
    );
};

export default Customers;