import React, {useState, useEffect} from "react"
import InputDatalist from "./input-datalist.js"
import DatePicker from "./date-picker.js"
import mealAllowances from "../data/meals"
import { DateTime, Interval, Info } from "luxon"
import * as yup from "yup"
import monthsContained from "./months-contained.js"
import { FormattedMessage } from 'react-intl';
import EstimatorRow from "./estimator-row.js";
import Tooltip from 'react-bootstrap/Tooltip'
// import EstimatorRowDropdown from "./estimator-row-dropdown.js";

import cities from "../data/cities.js"
import acrdRates from "../data/acrdRates.js"
import accommodations from "../data/accommodations.js"
import transportData from "../data/transport-data.js"

import { FaSpinner } from 'react-icons/fa';
import { FaQuestionCircle } from 'react-icons/fa';
import { FaExclamationTriangle } from 'react-icons/fa';

import { FaBed } from 'react-icons/fa';
import { FaPlane } from 'react-icons/fa';
import { FaTaxi } from 'react-icons/fa';
import { FaUtensils } from 'react-icons/fa';
import { FaSuitcase } from 'react-icons/fa';

const Estimator = () => {
    const citiesList = cities.citiesList;
    const suburbCityList = cities.suburbCityList;
    const [filteredCitiesList, setFilteredCitiesList] = useState([]);

    useEffect(() => {
        let list = cities.citiesList.map(city => {
            return {
                value: city,
                label: city,
            }
        })
        setFilteredCitiesList(list);
    }, []);


    // Variables/state for inputs
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');

    const [accommodation, setAccomodation] = useState('');
    const [transport, setTransport] = useState('');

    const [validationWarnings, setValidationWarnings] = useState([]);

    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState(false);
    const [errorPanel, setErrorPanel] = useState(false);

    const [accommodationCost, setAccomodationCost] = useState(0);
    const [transportationCost, setTransportationCost] = useState(0);
    const [localCost, setLocalCost] = useState(0);
    const [mealCost, setMealCost] = useState(0);
    const [otherCost, setOtherCost] = useState(0);
    const [summaryCost, setSummaryCost] = useState(0);

    useEffect(() => {
        calculateTotal()
    }, [accommodationCost, transportationCost, localCost, mealCost, otherCost])

    const fetchHotelCost = () => {
        let months = monthsContained(departureDate,returnDate);
        let rates = acrdRates[destination];
        let acrdRatesFiltered = Object.keys(rates)
            .filter(key => months.map(mon => mon.month).includes(key))
            .reduce((res, key) => {
                res[key] = rates[key];
                return res;
            }, {});

        try {
            let rates = rateDaysByMonth(departureDate, returnDate, acrdRatesFiltered)
            console.log(rates);

            let total = 0;

            for (const month in rates) {
                console.log(rates[month].monthTotal)
                total = total + rates[month].monthTotal
            }

            setAccomodationCost(total)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (accommodation === 'hotel') {


            fetchHotelCost()

            console.log("update to ACRD rates");
        } else if (accommodation === 'private') {
            let rate = (Interval.fromDateTimes(departureDate, returnDate).count('days') - 1) * 50;
            
            setAccomodationCost(rate)
            console.log("update to private rates");
        } else {
            setAccomodationCost(0)
            console.log("update to private rates");
        }
    }, [accommodation, transport])

    const fetchFlightCost = () => {
        setTransportationCost(987);
    }

    useEffect(() => {
        if (transport === 'flight') {
            fetchFlightCost()
            console.log("flight");
        } else if (transport === 'train') {
            setTransportationCost(436)
            console.log("train");
        } else if (transport === 'rental') {
            setTransportationCost(348)
            console.log("rental");
        } else if (transport === 'private') {
            setTransportationCost(203)
            console.log("private");
        }
    }, [transport])

    const updateMealCost = (newValue) => {
        setMealCost(newValue)
    }

    // since this function is used in two files, we should import it
    const calculateMeals = (departDate, returnDate, province) => {
        let departD = DateTime.fromISO(departDate);
        let returnD = DateTime.fromISO(returnDate);
        let duration = returnD.diff(departD, 'days')
        let provinceAllowances = Object.keys(mealAllowances);

        let estimatesForProvince = {};

        if (provinceAllowances.includes(province)) {
            estimatesForProvince = mealAllowances[province];
        } else {
            estimatesForProvince = mealAllowances['CAN'];
        };

        let breakfast = estimatesForProvince.breakfast;
        let lunch = estimatesForProvince.lunch;
        let dinner = estimatesForProvince.dinner;
        let incidentals = estimatesForProvince.incidentals;
        let dailyTotal = breakfast + lunch + dinner + incidentals;
        let total = dailyTotal * duration.values.days;

        return {
            dailyTotal,
            total,
            breakfast,
            lunch,
            dinner,
            incidentals,
        }
    }

    const rateDaysByMonth = (departureDate, returnDate, rates) => {
        // get all the dates in range

        let dates = Interval.fromDateTimes(
            departureDate.startOf("day"), 
            returnDate.endOf("day"))
            .splitBy({days: 1}).map(d => d.start)
        
        // remove the last date, since we won't need accommodation on that day

        dates.pop();

        // get month/year from each date object

        let months = dates.map((date) => {
            return date.month + '-' + date.year;
        });

        // count occurrences of each month

        var monthYearCount = months.reduce(function(obj, b) {
            obj[b] = ++obj[b] || 1;
            return obj;
        }, {});

        let result = {}

        for (const monthYear in monthYearCount) {
            let split = monthYear.split('-');
            let monthName = Info.months()[split[0] - 1]
            result[monthYear] = {
                dayCount: monthYearCount[monthYear],
                rate: rates[monthName],
                monthTotal: monthYearCount[monthYear] * rates[monthName],
            }
        }

        return result;
    }

    const handleSubmit =  async(e) => {
        setLoading(true);
        setGeneralError(false);
        e.preventDefault();
        handleValidation()
            .then((valid) => {
                setValidationWarnings([]);
                let city = suburbCityList[destination] || destination;
                let province = city.slice(-2); // This is bad.  We need to change the data structure.

                let mealsAndIncidentals = calculateMeals(departureDate, returnDate, province);

                updateMealCost(mealsAndIncidentals.total)
                fetchFlightCost()
                fetchHotelCost()
                // Calculate number of days
                console.log('departureDate', departureDate)
                console.log('returnDate', returnDate)



                // get ACRD rate for destination

                // calculate meals for destination

                setLoading(false);
                setErrorPanel(false);
            })
            .catch(err => {
                setLoading(false);
                setValidationWarnings(err.inner);
                setErrorPanel(true);
            });
    }

    const clearForm = () => {
    }

    const handleValidation = () => {
        let target = {origin, destination, departureDate, returnDate};
        let schema = yup.object().shape({
            origin: yup
                .string()
                .required(<FormattedMessage id="estimateOriginDestinationRequired" />)
                .test(
                    <FormattedMessage id="estimateOriginCityValid" />,
                    <FormattedMessage id="estimateOriginCityNotValid" />,
                    (value) => {
                        return citiesList.includes(value)
                    },
                  ),
            destination: yup
                .string()
                .required(<FormattedMessage id="estimateDestinationRequired" />)
                .test(
                    <FormattedMessage id="estimateDestinationCityValid" />,
                    <FormattedMessage id="estimateDestinationCityNotValid" />,
                    (value) => {
                        return citiesList.includes(value)
                    },
                ),
            departureDate: yup
                .date()
                .typeError(<FormattedMessage id="estimateDepartureDateNotValid" />)
                .required(),
            returnDate: yup
                .date()
                .typeError(<FormattedMessage id="estimateReturnDateNotValid" />)
                .required().min(
                yup.ref('departureDate'),
                <FormattedMessage id="noTimeTravel" />
            )
        });
        return schema.validate(target, {abortEarly: false})
    }

    const errorList =() => {
        let list = [];
        list = validationWarnings.map((error, index) =>
            <li key={index}><a className="alert-link" href={`#${error.path}`}>{error.errors}</a></li>
        );
        return list;
    }

    const calculateTotal = async () => {
        let total = parseInt(accommodationCost) + parseInt(transportationCost) + parseInt(localCost) + parseInt(mealCost) + parseInt(otherCost);
        await setSummaryCost(total)
    }


    return (
        <div className="mb-4">
            <h2><FormattedMessage id="estimateTitle" /></h2>
            <p className="lead"><FormattedMessage id="estimateLead" /></p>
             {errorPanel !== false && <div className="alert alert-danger alert-danger-banner">
                <h3><FormattedMessage id="estimateErrorTitle" /></h3>
                <p><FormattedMessage id="estimateErrorLead" /></p>
                <ul className="list-unstyled">
                    {errorList()}
                </ul>
            </div>}
            <form id="estimates-form" className="form-group mb-4" onSubmit={handleSubmit}>
                <InputDatalist
                    validationWarnings={validationWarnings}
                    setValidationWarnings={setValidationWarnings}
                    label={<FormattedMessage id="estimateOrigin" />}
                    name="origin"
                    options={filteredCitiesList}
                    updateValue={setOrigin} />
                <InputDatalist
                    validationWarnings={validationWarnings}
                    setValidationWarnings={setValidationWarnings}
                    label={<FormattedMessage id="estimateDestination" />}
                    name="destination"
                    options={filteredCitiesList}
                    updateValue={setDestination} />
                <DatePicker
                    validationWarnings={validationWarnings}
                    setValidationWarnings={setValidationWarnings}
                    label={<FormattedMessage id="estimateDepartureDate" />}
                    name="departureDate"
                    updateValue={setDepartureDate}
                ></DatePicker>
                <DatePicker
                    validationWarnings={validationWarnings}
                    setValidationWarnings={setValidationWarnings}
                    label={<FormattedMessage id="estimateReturnDate" />}
                    name="returnDate"
                    updateValue={setReturnDate}
                ></DatePicker>
                <button type="submit" className="btn btn-primary"><FormattedMessage id="estimate"/></button>
                <button type="button" className="btn btn-secondary ml-2" onClick={clearForm}><FormattedMessage id="clear"/></button>
                {loading && <FaSpinner className="fa-spin ml-3" size="24" />}
            </form>

            {generalError && <div className="alert-icon alert-danger" role="alert">
                <div className="icon" aria-hidden="true">
                    <FaExclamationTriangle size="24" />
                </div>
                <div className="message">
                    <h3><FormattedMessage id="estimateApplicationError" /></h3>
                    <p><FormattedMessage id="estimateApplicationErrorText" /></p>
                </div>
            </div>}

            {/* {!loading && result && */}
            {true &&
                <div className="card bg-light p-4">
                    <h3 className="mb-3"><FormattedMessage id="estimateSummaryTitle" /></h3>
                    {/* Each row could be a generic componemt with props passed in to define what they are */}

                    <div className="row mb-4">
                        <div className="col-sm-12 mb-2">
                            <div><FaBed className="mr-2" size="25" fill="#9E9E9E" /> <FormattedMessage id="accommodation" /></div>
                        </div>
                        <div className="col-sm-4 align-self-center">
                            <div className="align-self-center">
                                <div>
                                    {/* <label htmlFor={name}>{label}</label> */}
                                    <div id={`accommodation_container`}>
                                    <select
                                        className="custom-select"
                                        onChange={e => {setAccomodation(e.target.value)}}
                                    >
                                        <option value="hotel">Hotel</option>
                                        <option value="private">Private Accommodation</option>
                                    </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-2 align-self-center">
                            <input
                                type="text"
                                className="form-control"
                                id={`accommodation_select`}
                                placeholder="0"
                                name={'accommodation'}
                                onChange={(e) => {setAccomodationCost(e.target.value)}}
                                onBlur={calculateTotal}
                                value={accommodationCost}>
                            </input>
                        </div>
                        <div className="col-sm-6 align-self-center text-wrap">
                            <FormattedMessage id='accommodationDescription' />
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-sm-12 mb-2">
                            <div><FaPlane className="mr-2" size="25" fill="#9E9E9E" /> <FormattedMessage id="transportation" /></div>
                        </div>
                        <div className="col-sm-4 align-self-center">
                            <div className="align-self-center">
                                <div>
                                    {/* <label htmlFor={name}>{label}</label> */}
                                    <div id={`transportation_container`}>
                                    <select
                                        className="custom-select"
                                        onChange={e => {setTransport(e.target.value)}}
                                    >
                                        <option value="flight" >Flight</option>
                                        <option value="train">Train</option>
                                        <option value="rental">Rental Car</option>
                                        <option value="private">Private Vehicle</option>
                                    </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-2 align-self-center">
                            <input
                                type="text"
                                className="form-control"
                                id={`transportation_select`}
                                placeholder="0"
                                name={'transportation'}
                                onChange={(e)  => {setTransportationCost(e.target.value)}}
                                onBlur={calculateTotal}
                                value={transportationCost}
                            >
                            </input>
                        </div>
                        <div className="col-sm-6 align-self-center text-wrap">
                            <FormattedMessage id='transportationDescription' />
                        </div>
                    </div>


                    <EstimatorRow
                        value={localCost}
                        name="localTransportation"
                        id="localTransportation"
                        description="localTransportationDescription"
                        icon={<FaTaxi className="mr-2" size="25" fill="#9E9E9E" />}
                        title="localTransportation"
                        calculateTotal={calculateTotal}
                        updateCost={setLocalCost} 
                    />
                    <EstimatorRow
                        value={mealCost}
                        name="mealsAndIncidentals"
                        id="mealsAndIncidentals"
                        description="selectMealsToInclude"
                        icon={<FaUtensils className="mr-2" size="25" fill="#9E9E9E" />}
                        title="mealsAndIncidentals"
                        calculateTotal={calculateTotal}
                        updateCost={setMealCost}
                    />
                    <EstimatorRow
                        value={otherCost}
                        name="otherAllowances"
                        id="otherAllowances"
                        description="otherDescription"
                        icon={<FaSuitcase className="mr-2" size="25" fill="#9E9E9E" />}
                        title="otherAllowances"
                        calculateTotal={calculateTotal}
                        updateCost={setOtherCost}
                        tooltipIcon={FaQuestionCircle}
                        tooltipText={<FormattedMessage id="mealsTooltipText" />}
                    />
                    <div className="row mb-4">
                        <div className="col-sm-6 align-self-center text-right">
                            <hr />
                            <strong className="mr-2"><FormattedMessage id="totalCost" /></strong>{`$${summaryCost}`}
                        </div>
                        <div className="col-sm-6 align-self-center text-wrap">
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Estimator;
