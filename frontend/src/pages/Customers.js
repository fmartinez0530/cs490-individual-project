import React, { useEffect, useState, useMemo, useRef } from "react";
import PaginationTest from '../components/PaginationTest';
import Filter from '../components/Filter';
import PopupInfo from "../components/PopupInfo";
import './Customers.css';
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
    const [updatedCustomer, setUpdatedCustomer] = useState(0);
    const [removedCustomer, setRemovedCustomer] = useState(0);
    const [newCustomer, setNewCustomer] = useState(0);

    const [addCustomerHiddenState, setAddCustomerHiddenState] = useState('fully-hidden');

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

    const { paginatedData, tableLength } = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        let newCustomersData = customersData;

        if (filterInput) {
            newCustomersData = customersData.filter(user => {
                if (filterTerm === "customer_id") {
                    return user.customer_id.toString().includes(filterInput.toString());
                } else if (filterTerm === "first_name") {
                    return user.first_name.toString().toLowerCase().includes(filterInput.toString().toLowerCase());
                } else if (filterTerm === "last_name") {
                    return user.last_name.toString().toLowerCase().includes(filterInput.toString().toLowerCase());
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
                    //console.log(customersData);
                    clearInterval(fetchCustomersDataInterval);
                })
                .catch(err => console.error('Error fetching data:', err));
        }

        fetchCustomersData();
        const fetchCustomersDataInterval = setInterval(fetchCustomersData, 5000);
        return () => clearInterval(fetchCustomersDataInterval);
    }, [updatedCustomer, newCustomer, removedCustomer]);

    function displayClickedRowData(row) {
        setCustomerId(row.customer_id);
        setCustomerName(`${row.first_name} ${row.last_name}`);
        setClickedRow(1);
        setPopupVisibility("visible");
    };

    function closePopup() {
        setPopupVisibility("hidden");
        setClickedRow(0);
    }

    function showAddCustomer() {
        setAddCustomerHiddenState('visible');
    }

    function hideAddCustomer() {
        setAddCustomerHiddenState('fully-hidden');
    }

    function addNewCustomer() {
        const inputName = inputRefs.current.name.value !== null ? inputRefs.current.name.value : "";
        const inputEmail = inputRefs.current.email.value !== null ? inputRefs.current.email.value : "";
        const inputAddress = inputRefs.current.address.value !== null ? inputRefs.current.address.value : "";
        const inputDistrict = inputRefs.current.district.value !== null ? inputRefs.current.district.value : "";
        const inputZipCode = inputRefs.current.zipCode.value !== null ? inputRefs.current.zipCode.value : "";
        const inputCity = inputRefs.current.city.value !== null ? inputRefs.current.city.value : "";
        const inputCountry = inputRefs.current.country.value !== null ? inputRefs.current.country.value : "";
        const inputPhoneNum = inputRefs.current.phone.value !== null ? inputRefs.current.phone.value : "";

        if (inputName === "" || inputEmail === "" || inputAddress === "" || inputDistrict === "" ||
            inputZipCode === "" || inputCity === "" || inputCountry === "" || inputPhoneNum === "") {
            alert("Every field must be filled in!");
            return;
        }
        else {
            clearInputData();
        }

        fetch('http://localhost:5000/add_new_customer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inputName, inputEmail, inputAddress, inputDistrict, inputZipCode, inputCity, inputCountry, inputPhoneNum }),
        })
            .then(res => res.json())
            .then(clearInputData)
            .then(newCustomerState)
            .catch(err => console.error('Error fetching data:', err));
    }

    function customerUpdated() {
        if (updatedCustomer === 0) {
            setUpdatedCustomer(1);
        }
        else {
            setUpdatedCustomer(0);
        }
    }

    function customerRemoved() {
        if (removedCustomer === 0) {
            setRemovedCustomer(1);
        }
        else {
            setRemovedCustomer(0);
        }
    }

    function newCustomerState() {
        if (newCustomer === 0) {
            setNewCustomer(1);
        }
        else {
            setNewCustomer(0);
        }
    }

    function clearInputData() {
        inputRefs.current.name.value = null;
        inputRefs.current.email.value = null;
        inputRefs.current.address.value = null;
        inputRefs.current.district.value = null;
        inputRefs.current.zipCode.value = null;
        inputRefs.current.city.value = null;
        inputRefs.current.country.value = null;
        inputRefs.current.phone.value = null;
    }


    return (
        <>
            <div className="flex-col flex-centered-evenly">
                <div className="flex-row flex-centered-evenly filter-add-cust-container">
                    <Filter
                        filters={["customer_id", "first_name", "last_name"]}
                        onFilterChange={filter => setFilterTerm(filter)}
                        onInputChange={input => {
                            setFilterInput(input);
                            setCurrentPage(1); // Reset to the first page
                        }}
                        className="filter-search"
                    />
                    <input type="button" value='ADD NEW CUSTOMER' onClick={showAddCustomer} className="add-cust-btn"></input>
                </div>
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
                            <th className="table-cell bot-border" style={{ width: "150px" }}>NAME</th>
                            <th className="table-cell bot-border" style={{ width: "320px" }}>EMAIL</th>
                            <th className="table-cell bot-border" style={{ width: "450px" }}>Address</th>
                            <th className="table-cell bot-border" style={{ width: "180px" }}>Phone</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map(row => (
                                <tr onClick={() => displayClickedRowData(row)} className="hoverable-row" key={`customer-${row.customer_id}`}>
                                    <td className="table-cell" style={{ textAlign: "center" }}>{row.customer_id}</td>
                                    <td className="table-cell">{`${row.first_name} ${row.last_name}`}</td>
                                    <td className="table-cell">{row.email}</td>
                                    <td className="table-cell wrap-cell">{`${row.address}, ${row.district}, ${row.postal_code}, ${row.city}, ${row.country}`}</td>
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
            </div >

            <div id="add-customer-container" className={addCustomerHiddenState}>
                <div className='flex-col'>
                    <div className='padding-info'>
                        <label htmlFor='inputName'>Input New Name</label>
                        <input type='text' ref={el => (inputRefs.current.name = el)} id='inputName' name='inputName'></input>
                    </div>

                    <div className='padding-info'>
                        <label htmlFor='inputEmail'>Input New Email</label>
                        <input type='text' ref={el => (inputRefs.current.email = el)} id='inputEmail' name='inputEmail'></input>
                    </div>

                    <div className='padding-info'>
                        <label htmlFor='inputAddress'> Input New Address</label>
                        <input type='text' ref={el => (inputRefs.current.address = el)} id='inputAddress' name='inputAddress'></input>
                    </div>

                    <div className='padding-info'>
                        <label htmlFor='inputDistrict'> Input New District</label>
                        <input type='text' ref={el => (inputRefs.current.district = el)} id='inputDistrict' name='inputDistrict'></input>
                    </div>

                    <div className='padding-info'>
                        <label htmlFor='inputZipCode'>Input New Zip Code</label>
                        <input type='text' ref={el => (inputRefs.current.zipCode = el)} id='inputZipCode' name='inputZipCode'></input>
                    </div>
                    <div className='padding-info'>
                        <label htmlFor='inputCity'>Input New City</label>
                        <input type='text' ref={el => (inputRefs.current.city = el)} id='inputCity' name='inputCity'></input>
                    </div>

                    <div className='padding-info'>
                        <label htmlFor='inputCountry'>Input New Country</label>
                        <input type='text' ref={el => (inputRefs.current.country = el)} id='inputCountry' name='inputCountry'></input>
                    </div>

                    <div className='padding-info'>
                        <label htmlFor='inputPhoneNum'>Input New Phone #</label>
                        <input type='text' ref={el => (inputRefs.current.phone = el)} id='inputPhoneNum' name='inputPhoneNum'></input>
                    </div>

                    <div className='padding-info'>
                        <input type='button' onClick={hideAddCustomer} value={"GO BACK"}></input>
                        <input type='button' onClick={addNewCustomer} value={"SUBMIT"}></input>
                    </div>
                </div>
            </div>

            <PopupInfo
                props={{ "tableId": 2, "tableData": customersData, "clickedId": customerId, "clickedName": customerName }}
                visible={popupVisible}
                closePopup={closePopup}
                rowClicked={clickedRow}
                updatedCustomer={customerUpdated}
                removedCustomer={customerRemoved}
            />
        </>
    );
};

export default Customers;