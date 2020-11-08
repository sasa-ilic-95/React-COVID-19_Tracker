import {
    Card,
    CardContent,
    FormControl,
    MenuItem,
    Select,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import "./App.css";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import LineGraph from "./LineGraph";
import { sortData, prettyPrintStat } from "./util";
import "leaflet/dist/leaflet.css";

const App = () => {
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState("worldwide");
    const [countryInfo, setCountryInfo] = useState({});
    const [tableData, setTableData] = useState();
    const [mapCenterZoom, setMapCenterZoom] = useState({
        center: [34.80746, -40.4796],
        zoom: 3,
    });
    const [mapCountries, setMapCountries] = useState([]);
    const [casesType, setCasesType] = useState("cases");

    useEffect(() => {
        fetch("https://disease.sh/v3/covid-19/all")
            .then((response) => response.json())
            .then((data) => {
                setCountryInfo(data);
            });
    }, []);

    useEffect(() => {
        const getCountriesData = async () => {
            fetch("https://disease.sh/v3/covid-19/countries")
                .then((response) => response.json())
                .then((data) => {
                    const countries = data.map((country) => ({
                        name: country.country,
                        value: country.countryInfo.iso2,
                    }));

                    let sortedData = sortData(data);
                    setCountries(countries);
                    setMapCountries(data);
                    setTableData(sortedData);
                });
        };
        getCountriesData();
    }, []);

    const onCountryChange = async (event) => {
        const countryCode = event.target.value;

        const url =
            countryCode === "worldwide"
                ? "https://disease.sh/v3/covid-19/all"
                : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

        await fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setCountry(countryCode);
                setCountryInfo(data);

                countryCode === "worldwide"
                    ? setMapCenterZoom({
                          center: [34.80746, -40.4796],
                          zoom: 3,
                      })
                    : setMapCenterZoom({
                          center: [data.countryInfo.lat, data.countryInfo.long],
                          zoom: 6,
                      });
            });
    };

    return (
        <div className="app">
            {/* BEM */}

            <div className="app__left">
                {/* Header */}
                <div className="app__header">
                    <h1>COVID-19 Tracker</h1>
                    <FormControl>
                        <Select
                            variant="outlined"
                            onChange={onCountryChange}
                            value={country}
                        >
                            <MenuItem value="worldwide">Worldwide</MenuItem>
                            {/* Loop through all the countries and show a drop down list of the options */}
                            {countries.map((country) => (
                                <MenuItem value={country.value}>
                                    {country.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                {/* InfoBox */}
                <div className="app__stats">
                    <InfoBox
                        isRed
                        active={casesType === "cases"}
                        onClick={() => {
                            setCasesType("cases");
                            console.log("cases");
                        }}
                        title="Coronavirus Cases"
                        total={prettyPrintStat(countryInfo.cases)}
                        cases={prettyPrintStat(countryInfo.todayCases)}
                    />
                    <InfoBox
                        active={casesType === "recovered"}
                        onClick={() => {
                            setCasesType("recovered");
                            console.log("recovered");
                        }}
                        title="Recovered"
                        total={prettyPrintStat(countryInfo.recovered)}
                        cases={prettyPrintStat(countryInfo.todayRecovered)}
                    />
                    <InfoBox
                        isRed
                        active={casesType === "deaths"}
                        onClick={() => {
                            setCasesType("deaths");
                            console.log("deaths");
                        }}
                        title="Deaths"
                        total={prettyPrintStat(countryInfo.deaths)}
                        cases={prettyPrintStat(countryInfo.todayDeaths)}
                    />
                </div>
                {/* Map */}
                <Map
                    casesType={casesType}
                    countries={mapCountries}
                    center={mapCenterZoom.center}
                    zoom={mapCenterZoom.zoom}
                />
            </div>

            <Card className="app__right">
                <CardContent>
                    {/* Table */}
                    <h3>Live cases by country</h3>
                    <Table countries={tableData} />
                    <h3 className="app__graphTitle">
                        Worldwide new {casesType}
                    </h3>
                    {/* Graph */}
                    <LineGraph
                        className="app__graph"
                        casesType={casesType}
                    ></LineGraph>
                </CardContent>
            </Card>
        </div>
    );
};

export default App;
