import React, { useEffect, useState, useMemo } from "react";
import PaginationTest from '../components/PaginationTest';
import Filter from '../components/Filter';
import PopupInfo from "../components/PopupInfo";
import './FilterTable.css';
import '../presets.css';

const PageSize = 10;

const Customers = () => {
    const [customersData, setCustomersData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterTerm, setFilterTerm] = useState("customer_id");
    const [filterInput, setFilterInput] = useState(null);

    const [popupVisible, setPopupVisibility] = useState("hidden");
    const [customerId, setCustomerId] = useState(null);
    const [customerName, setCustomerName] = useState(null);
    const [clickedRow, setClickedRow] = useState(0);

    const { paginatedData, tableLength } = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        let newCustomersData = customersData;

        if (filterInput) {
            newCustomersData = customersData.filter(user => {
                if (filterTerm === "customer_id") {
                    return user.ID.toString().includes(filterInput.toString());
                } else if (filterTerm === "first_name") {
                    return user.name.toString().toLowerCase().split(" ")[0].includes(filterInput.toString().toLowerCase());
                } else if (filterTerm === "last_name") {
                    return user.name.toString().toLowerCase().split(" ")[1].includes(filterInput.toString().toLowerCase());
                }
                return false;
            });
        }

        return {
            paginatedData: newCustomersData.slice(firstPageIndex, lastPageIndex),
            tableLength: newCustomersData.length
        };
    }, [currentPage, customersData, filterInput, filterTerm]);

    useEffect(() => {
        function fetchCustomersData() {
            fetch(`http://localhost:5000/customers_list`)
                .then(res => res.json())
                .then(data => {
                    setCustomersData(data);
                    clearInterval(fetchCustomersDataInterval);
                })
                .catch(err => console.error('Error fetching data:', err));
        }

        fetchCustomersData();
        const fetchCustomersDataInterval = setInterval(fetchCustomersData, 5000);
        return () => clearInterval(fetchCustomersDataInterval);
    }, []);

    const displayClickedRowData = (row) => {
        setCustomerId(row.ID);
        setCustomerName(row.name);
        setClickedRow(1);
        setPopupVisibility("visible");
    };

    const closePopup = () => {
        setPopupVisibility("hidden");
        setClickedRow(0);
    }

    return (
        <>
            <div className="flex-col flex-centered">
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
                            paginatedData.map(row => (
                                <tr onClick={() => displayClickedRowData(row)} className="hoverable-row" key={`customer-${row.ID}`}>
                                    <td className="table-cell" style={{ textAlign: "center" }}>{row.ID}</td>
                                    <td className="table-cell">{row.name}</td>
                                    <td className="table-cell wrap-cell max-width-340">{row.address}</td>
                                    <td className="table-cell">{row["zip code"]}</td>
                                    <td className="table-cell">{row.city}</td>
                                    <td className="table-cell">{row.country}</td>
                                    <td className="table-cell">{row.phone}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">No customers found.</td>
                            </tr>
                        )}
                        {/* Add empty rows if necessary */}
                        {Array.from({ length: PageSize - paginatedData.length }).map((_, index) => (
                            <tr key={`empty-row-${index}`}>
                                <td colSpan="7" className="empty-row"></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <PopupInfo
                props={{ "tableId": 2, "tableData": customersData, "clickedId": customerId, "clickedName": customerName }}
                visible={popupVisible}
                closePopup={closePopup}
                rowClicked={clickedRow}
            />
        </>
    );
};

export default Customers;