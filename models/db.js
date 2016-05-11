var pg = require('pg');
var config = require('../config');
var connectionString = process.env.DATABASE_URL || config.get('pg:url');



pg.defaults.poolIdleTimeout = config.get('pg:poolIdleTimeout');


function query(queryString, data, allRows) {
	return new Promise((resolve, reject) => {

		pg.connect(connectionString, (err, client, done) => {
			if(err) { reject(err); }

			// show connection pool
			console.log('all: ', pg.pools.all['"postgres://hellmaker:justdoit@localhost:5432/superforms"'].getPoolSize());

	    client.query(queryString, data, (err, result) => {
	    	done();  
        (err) ? reject(err) : resolve( (allRows) ? result.rows : result.rows[0] );
      });
	  });
	  
  })
}


query('\
	CREATE TABLE IF NOT EXISTS users(\
		id SERIAL PRIMARY KEY,\
		email VARCHAR(50),\
		password VARCHAR(60),\
		registered TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,\
		status VARCHAR(10)\
	);\
	CREATE TABLE IF NOT EXISTS forms(\
		id SERIAL PRIMARY KEY,\
		user_id SERIAL REFERENCES users,\
		form JSON,\
		recipients JSON,\
		created TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp,\
		edited TIMESTAMP WITH TIME ZONE,\
		sent TIMESTAMP WITH TIME ZONE\
	);\
	CREATE TABLE IF NOT EXISTS responses(\
		id SERIAL PRIMARY KEY,\
		author VARCHAR(50),\
		answers JSON,\
		form_id SERIAL REFERENCES forms,\
		created TIMESTAMP(6) WITH TIME ZONE DEFAULT current_timestamp\
	);'
);


// create db tables
query('SELECT * FROM sessions;')
	["catch"](err => {
		console.log('creating "sessions" table...');
		query('\
			CREATE TABLE IF NOT EXISTS "sessions" (\
		  	"sid" varchar NOT NULL COLLATE "default",\
				"sess" json NOT NULL,\
				"expire" TIMESTAMP(6) NOT NULL\
			) WITH (OIDS=FALSE);\
			ALTER TABLE "sessions" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;'
		)
	})


exports.query = query;
