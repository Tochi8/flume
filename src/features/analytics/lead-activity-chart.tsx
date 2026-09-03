"use client";
import { Bar, BarChart, ResponsiveContainer, Cell } from "recharts";
const data = [{ day: "1", leads: 6 }, { day: "2", leads: 9 }, { day: "3", leads: 7 }, { day: "4", leads: 11 }, { day: "5", leads: 8 }, { day: "6", leads: 10 }, { day: "7", leads: 7 }, { day: "8", leads: 12 }, { day: "9", leads: 9 }, { day: "10", leads: 6 }, { day: "11", leads: 11 }, { day: "12", leads: 8 }, { day: "13", leads: 14 }, { day: "14", leads: 16 }];
export function LeadActivityChart() {
  const max = Math.max(...data.map((d) => d.leads));
  return (
    <div className="h-32">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={4}>
          <Bar dataKey="leads" radius={[4, 4, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.leads === max ? "#16C45A" : i === data.length - 8 ? "#8FE3AE" : "#F1F4F2"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
