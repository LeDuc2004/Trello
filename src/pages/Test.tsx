import React from "react";
import MapDisplay from "@/components/MapDisplay";

const Test2 = () => {
  // Dữ liệu Polygon
  const polygonData = {
    type: "Polygon",
    coordinates: [
      [
        [140.78652361960218, 38.241478887424364],
        [140.7881548643432, 38.24025967618141],
        [140.78997028187695, 38.23990837423264],
        [140.79044386906043, 38.239495075648364],
        [140.78652361960218, 38.241478887424364],
      ],
    ],
  };

  // Dữ liệu MultiPolygon
  const multiPolygonData = {
    type: "MultiPolygon",
    coordinates: [
      [
        [
          [140.73689356791976, 38.22222614802109],
          [140.73930551107236, 38.220605643424705],
          [140.73979821985523, 38.219347593335385],
          [140.73689356791976, 38.22222614802109],
        ],
      ],
      [
        [
          [140.79044386906043, 38.239495075648364],
          [140.78997028187695, 38.23990837423264],
          [140.7881548643432, 38.24025967618141],
          [140.79044386906043, 38.239495075648364],
        ],
      ],
    ],
  };

  return (
    <div>
      <h1>Polygon Data</h1>
      <MapDisplay data={polygonData} />

      <h1>MultiPolygon Data</h1>
      <MapDisplay data={multiPolygonData} />
    </div>
  );
};

export default Test2;
