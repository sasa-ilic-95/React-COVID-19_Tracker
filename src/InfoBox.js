import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";

function InfoBox({ title, cases, active, isRed, total, ...props }) {
    return (
        <Card
            onClick={props.onClick}
            className={`infobox ${active && "infobox--selected"} ${
                isRed && "infobox--red"
            }`}
        >
            <CardContent>
                {/* title */}
                <Typography className="infobox__title" color="textSecondary">
                    {title}
                </Typography>

                {/* number of cases */}
                <h2
                    className={`infobox__cases ${
                        !isRed && "infobox__cases--green"
                    }`}
                >
                    {cases}
                </h2>

                {/* total */}
                <Typography className="infobox__total" color="textSecondary">
                    {total}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default InfoBox;
