'use client';
import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

export default function TemezGraph({ data }) {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="month"
                    label={{ value: "Meses", position: "insideBottom", offset: -5 }}
                />
                <YAxis
                    label={{ value: "Caudal (m³/s)", angle: -90, position: "insideLeft" }}
                />
                <Tooltip />
                <Legend verticalAlign="top" />
                <Line type="monotone" dataKey="observed" stroke="#ff0000" name="Caudal observado" />
                <Line type="monotone" dataKey="simulated" stroke="#0000ff" name="Caudal simulado" />
            </LineChart>
        </ResponsiveContainer>
    );
}
