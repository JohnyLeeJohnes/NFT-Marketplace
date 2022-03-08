import {Col, Row} from "antd";
import React from "react";

export function CenterWrapper({children}) {
    return (
        <Row class={"center-wrapper"}>
            <Col>
                {children}
            </Col>
        </Row>
    )
}