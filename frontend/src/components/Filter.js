const Filter = (props) => {
    const {
        filters,
        onFilterChange,
        onInputChange
    } = props;

    const filterObjects = filters.map((filter, index) => ({
        id: index,
        name: filter
    }));

    return (
        <div className="filter-search filter-margins">Filter By:&nbsp;
            <select onChange={(e) => onFilterChange(e.target.value)}>
                {filterObjects.map(filter => (
                    <option id={"option-" + filter.id} key={filter.id} value={filter.name}>{filter.name.split("_").join(" ").replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}</option>
                ))}
            </select>
            <input type="search" onChange={(e) => onInputChange(e.target.value)} placeholder="Search..." />
        </div>
    );
}

export default Filter;