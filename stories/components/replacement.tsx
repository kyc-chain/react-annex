import * as React from "react";
import { SFC } from "react";

import { replace } from "../../src";

const ReplacementContent: SFC<{}> = () => (
  <div>
    <h1>Default Content</h1>
    <p>This is the default content before replacement.</p>
  </div>
);

export const Replacement: SFC<{}> = replace("replacement")(ReplacementContent);
