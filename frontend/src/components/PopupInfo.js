import React from 'react';

const PopupInfo = ({ props, visible, closePopup }) => {
    /*
    Object.keys(props.selectedData).forEach(function (key) {
        console.log(props.selectedData[key]);
        console.log(key);
    });
    */
    var title, desc, rel_year, rating, spec_feat;
    var name;

    if (props.tableId === 0) {
        title = props.selectedData[0] ? props.selectedData[0].title : "N/A";
        desc = props.selectedData[0] ? props.selectedData[0].description : "N/A";
        rel_year = props.selectedData[0] ? props.selectedData[0].release_year : "N/A";
        rating = props.selectedData[0] ? props.selectedData[0].rating : "N/A";
        spec_feat = props.selectedData[0] ? props.selectedData[0].special_features : "N/A";
    }
    else {
        //console.log(props.tableData);
        for (let i = 0; i < props.tableData.length; i++) {
            //console.log(props.tableData[i])
            if (props.tableData[i].actor_id === props.actorId) {
                name = props.tableData[i].first_name + " " + props.tableData[i].last_name;
                break;
            }
        }

        //name = props.tableData.find(row => row.actor_id === props.actorId);
        //console.log(name);
    }

    //console.log(desc);

    return (
        <div id='backdrop-container' className={visible}>
            <button onClick={closePopup}>X</button>
            <div className='popup-info'>
                {props.tableId === 0 ? (
                    <>
                        <h2>{title}</h2>
                        <p>Description: {desc}</p>
                        <p>Release Year: {rel_year}</p>
                        <p>Rating: {rating}</p>
                        <p>Special Features: {spec_feat}</p>
                    </>
                ) : (
                    <>
                        <h2>{name}</h2>
                        {props.selectedData.map(row => (
                            <tr key={row.film_id}>
                                <>
                                    <td key={`film-${row.title}`}>{row.title}</td>
                                    <td key={`film-${row.rental_count}`}>{row.rental_count}</td>
                                </>
                            </tr>
                        ))}
                    </>
                )}
            </div >
        </div>
    );
};

export default PopupInfo;