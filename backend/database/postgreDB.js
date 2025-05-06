import {Pool} from "pg";

const client = new Pool({
  connectionString: "postgresql://postgres:12345@localhost:5432/biyaheroDB"
});

console.log("connected to database")



// const ff = async (lat, lng, routeId) => {
//   const query = `
//     SELECT id, latitude, longitude, sequence
//     FROM route_point
//     WHERE jeepney_route_id = $1
//     ORDER BY 
//       (latitude - $2) * (latitude - $2) + 
//       (longitude - $3) * (longitude - $3)
//     LIMIT 1
//   `;
  
//   const result = await client.query(query, [routeId, lat, lng]);
//   console.log(result.rows[0]);
//   return result.rows[0];
// };

// ff(13.7746, 121.0664, 1);

export default client;