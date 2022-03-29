import React from "react";
import "./Donut.scss";

function Donut(props) {
  console.log(props);
  return <div className="donut" {...props} />;
}

export default Donut;
