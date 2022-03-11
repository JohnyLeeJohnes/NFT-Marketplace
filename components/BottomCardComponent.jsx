import Picture from "next/image";
import matic from "../public/matic.svg";
import {Typography} from "antd";
import React from "react";

const {Text} = Typography;

export function BottomCardComponent({type, bottomText}) {
    return (
        <Typography.Title level={4} style={{margin: 0}}>
            <Text type={type}>
                {bottomText}
            </Text>
            <span style={{float: "right"}}>
                <Picture width={25} height={25} src={matic} alt={"MATIC"}/>
            </span>
        </Typography.Title>
    )
}