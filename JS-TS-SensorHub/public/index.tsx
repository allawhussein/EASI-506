import * as React from "react";
import { render } from "react-dom";

import GageArray from "./GagesDemo";

const rootElement = document.getElementById("root");
const gageArray = <GageArray />
render(<GageArray />, rootElement);