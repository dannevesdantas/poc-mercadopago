import { DateTime } from "luxon";

const isoDate = DateTime.now().setZone('UTC').plus({hours:24}).toISO();

console.log(isoDate);
