// Copyright (C) 2025 Comrade Niobe
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// You can obtain one at https://mozilla.org/MPL/2.0/.

import { Suspense, type Component } from "solid-js";

const App: Component = (props: { children: Element }) => {
  return (
    <>
      <main>
        <Suspense>{props.children}</Suspense>
      </main>
    </>
  );
};

export default App;
