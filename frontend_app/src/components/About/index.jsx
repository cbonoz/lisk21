import React, { useEffect, useState } from "react";
import { Steps } from "antd";
import logo from "../../assets/logo_trans.png";
import { APP_NAME } from "../../utils/constants";

const { Step } = Steps;

function About(props) {
  return (
    <div className="content">
      <img src={logo} className="hero-logo" />
      <Steps current={3} size="large" className="header-steps">
        <Step
          title="Discover"
          description="Discover and purchase collections listed by other individuals"
        />
        <Step
          title="List"
          description={`Use ${APP_NAME} to list and sell rights and access to your previous NFTs.`}
        />
        <Step
          title="Earn"
          description="Get paid for your new and existing content."
        />
      </Steps>
      <hr />
    </div>
  );
}

export default About;
