#Superforms
-------
#Installation
-------
1. Install [Node.js](https://nodejs.org/en/) (version >= v5.2.0).

2. Install [PostgreSQL](https://www.postgresql.org/download/) (version >= 9.4.0).

3. Create database and change the db connection settings in config/config.json to your own. Format of connection string:
  `postgres://username:password@localhost:port/database_name`.
  
4. Install dependencies using npm from application folder:
  `npm install`.
  
5. Run it:
  `node server.js` and see on [localhost:3000](http://localhost:3000/).
