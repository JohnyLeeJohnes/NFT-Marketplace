import {Col, Row} from "antd";
import React from "react";

export function CenterWrapper({children}) {
    return (
        <Row align={"center"}>
            <Col>
                {children}
            </Col>
        </Row>
    )
}