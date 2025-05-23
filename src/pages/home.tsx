// Copyright (C) 2025 Comrade Niobe
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// You can obtain one at https://mozilla.org/MPL/2.0/.

import { A } from "@solidjs/router";
import axios from "axios";
import _ from "lodash";
import {
  createMemo,
  createResource,
  createSignal,
  For,
  Match,
  Suspense,
  Switch,
} from "solid-js";
import { useNavigate } from "@solidjs/router";

export type Server = {
  adult: boolean;
  id: string;
  name: string;
  players: number;
  updatedAt: string;
  snapshots: Array<Snapshot>;
};

export type Snapshot = {
  id: string;
  createdAt: string;
  playerCount: number;
};

const fetchAllStats = async () => {
  const navigate = useNavigate();

  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_ENDPOINT}/servers/simple`,
    );
    return response.data;
  } catch (error) {
    navigate("/404", { replace: true });
    console.error(error);
  }
};

export default function Home() {
  const [servers] = createResource(fetchAllStats);
  const sortedServers = createMemo(() =>
    _.reverse(_.sortBy(servers(), "players")),
  );

  return (
    <section class="container">
      <h1>SS13 Stats</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Match when={servers.error}>
            <span>Error: {servers.error}</span>
          </Match>
          <Match when={sortedServers()}>
            {/* TODO: Shove this into its own component. Alongside the associated state? */}
            <div id="stats" class="table-responsive border">
              <table class="table table-striped table-bordered">
                <thead class="table-secondary">
                  <tr>
                    <th scope="col">Players</th>
                    <th scope="col">Server</th>
                  </tr>
                </thead>
                <tbody>
                  <For each={sortedServers()} fallback={<div>Loading...</div>}>
                    {(server) => (
                      <tr>
                        <th scope="row">{server.players}</th>
                        <td>
                          <A href={`stats/${server.id}`}>{server.name}</A>
                        </td>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>
          </Match>
        </Switch>
      </Suspense>
    </section>
  );
}
