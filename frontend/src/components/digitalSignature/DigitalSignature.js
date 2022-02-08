import React from "react";
import SignatureCanvas from "react-signature-canvas";
export default function DigitalSignature() {
  return (
    <SignatureCanvas
      penColor="green"
      canvasProps={{ width: 500, height: 200, className: "sigCanvas" }}
    />
  );
}
