import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const faults = [
    { id: 1, name: "Overheating", status: "critical" },
    { id: 2, name: "Low Voltage", status: "warning" },
  ];

  res.status(200).json(faults);
}
