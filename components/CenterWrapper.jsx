import {Col, Row} from "antd";
import React from "react";

export function CenterWrapper({children}) {
    return (
        <Row className={"center-wrapper"}>
            <Col>
                {children}
            </Col>
        </Row>
    )
}