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

            <div className='popup-info'>
                <button onClick={closePopup}>X</button>
                {props.tableId === 0 ? (
                    <>
                        <h2>{title}</h2>
                        <p id='wrapDescription' className='padding-info'><u>Description:</u> {desc}</p>
                        <p className='padding-info'><u>Release Year:</u> {rel_year}</p>
                        <p className='padding-info'><u>Rating:</u> {rating}</p>
                        <p className='padding-info'><u>Special Features:</u> {spec_feat}</p>
                    </>
                ) : (
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
                                            <td key={`film-${row.title}`} className='cell-info-actor'>{row.title}</td>
                                            <td key={`film-${row.rental_count}`} className='cell-info-actor'>{row.rental_count}</td>
                                        </>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div >
        </div>
    );
};

export default PopupInfo;