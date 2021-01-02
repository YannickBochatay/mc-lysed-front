import React from "react";
import { makeStyles } from "@material-ui/core";

const Marker = (props) => {
  const { position, type } = props;

  const classes = useMarkerStyles({ type, position });

  return <div className={classes.marker}></div>;
};

const SimulatorProgressBar = ({ results, progressBarColor }) => {
  const data = results[0];
  const max = data.ranges[2];
  const m1 = (data.markers[0] / max) * 100 - 0.25 + "%";
  const m2 = (data.markers[1] / max) * 100 - 0.25 + "%";
  const jaugeStart = -(data.markers[1] / max) * 100 + 0.5 + "%";
  const value = (data.measures[0] / max) * 100;
  const parentRef = React.createRef(null);

  // useEffect(() => {
  //   function handleResize(event) {
  //     const width = parentRef.current.getBoundingClientRect().width;
  //     setParentWidth(width);
  //   }
  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // });

  function handleClass() {
    return data.measures[0] >= data.ranges[2] - 15 ? "jauge-int-max" : "jauge-int";
  }

  return (
    <div
      className="jauge-ext"
      ref={parentRef}
      style={{
        height: "20px",
        width: "100%",
        backgroundColor: "white",
        border: "#E5EAEC solid 1px",
        position: "relative",
      }}
    >
      <Marker type="success" position={m1} />
      <Marker type="failure" position={m2} />
      <div
        className="tooltip sim-categorie-emissions"
        style={{
          left: `calc(${value > 100 ? 100 : value}%)`,
        }}
      >
        <p> Emissions: {Math.round(results[0].measures[0])} ktCO2e</p>
      </div>
      <div
        className={handleClass()}
        style={{
          borderRadius: "none",
          height: "18.5px",
          width: `${value > 100 ? 100 : value}%`,
          position: "absolute",
          left: `${jaugeStart}px`,
          transition: "1s",
          backgroundColor: progressBarColor,
        }}
      ></div>
    </div>
  );
};

const useMarkerStyles = makeStyles((theme) => ({
  marker: {
    backgroundColor: (props) =>
      props.type === "success" ? theme.palette.success.main : theme.palette.error.main,
    height: "18.5px",
    width: "2px",
    position: "absolute",
    left: (props) => `${props.position}`,
    zIndex: 4,
  },
}));

export default SimulatorProgressBar;
