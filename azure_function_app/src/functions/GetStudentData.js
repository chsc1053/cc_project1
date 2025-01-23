const sql = require("mssql");
const { app } = require("@azure/functions");

app.http("GetStudentData", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const config = {
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      server: process.env.SQL_SERVER,
      database: process.env.SQL_DATABASE,
      options: {
        encrypt: true,
        trustServerCertificate: false,
      },
    };

    try {
      await sql.connect(config);
      const result =
        await sql.query`SELECT Country, COUNT(*) AS StudentCount FROM Students GROUP BY Country`;
      return { body: JSON.stringify(result.recordset) };
    } catch (err) {
      context.log(`Error: ${err.message}`);
      return { status: 500, body: JSON.stringify({ error: err.message }) };
    } finally {
      await sql.close();
    }
  },
});
