// Copyright (C) 2025 Comrade Niobe
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// You can obtain one at https://mozilla.org/MPL/2.0/.

import { createResource, Switch, Match, Suspense, onMount } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";
import axios from "axios";
import {
  Chart,
  Title,
  Tooltip,
  Legend,
  Colors,
  type ChartOptions,
  type ChartData,
} from "chart.js";
import chartTrendline from "chartjs-plugin-trendline";
import type { Server, Snapshot } from "./home";
import _ from "lodash";
import { Line } from "solid-chartjs";
import { format } from "date-fns";

const fetchStats = async (id: string) => {
  const navigate = useNavigate();

  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_ENDPOINT}/server/${id}`,
    );
    console.log(response);
    return response.data as Server;
  } catch (error) {
    navigate("/404", { replace: true });
    console.error(error);
  }
};

function StatsTable(props: { server: Server; snapshots: Snapshot[] }) {
  onMount(() => {
    Chart.register(Title, Tooltip, Legend, Colors, chartTrendline);
    Chart.defaults.font.family =
      "'Atkinson Hyperlegible Next Variable', sans-serif";
  });

  const chartData: ChartData = {
    labels: props.snapshots.map((r) => {
      return format(new Date(r.createdAt), "Pp");
    }),
    datasets: [
      {
        label: "# of Players",
        data: props.snapshots.map((r) => {
          return r.playerCount;
        }),
      },
    ],
  };

  const chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: props.server.name,
        color: "hsl(0, 0%, 53%)",
        font: {
          weight: "bold",
          size: 28,
          lineHeight: 1.2,
        },
      },
    },
  };

  return (
    <Line data={chartData} options={chartOptions} width={500} height={500} />
  );
}

export default function Stats() {
  const cxt = useParams();
  const [server] = createResource(cxt.id, fetchStats);

  return (
    <section class="container">
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Match when={server.error}>
            <span>Error: {server.error}</span>
          </Match>
          <Match when={server()}>
            <div class="border">
              <StatsTable server={server()} snapshots={server().snapshots} />
            </div>
          </Match>
        </Switch>
      </Suspense>
    </section>
  );
}
