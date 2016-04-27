var pg = require('pg');
var config = require('../config');
var connectionString = process.env.DATABASE_URL || config.get('pg:url');


exports.query = function (queryString, data) {
	return new Promise(function (resolve, reject) {

		pg.connect(connectionString, function(err, client, done) {
			if(err) {
		    done();
		    reject(err);
		  }
	    client.query(queryString, data, function(err, result) {
        (err) ? reject(err) : resolve(result.rows[0]);
        done();  
      });
	  });
	  
  })
}


pg.connect(connectionString, function(err, client, done) {
	client.query('SELECT * FROM sessions;', function(err, result) {

		client.query('\
	  	CREATE TABLE IF NOT EXISTS users(\
	  		id SERIAL PRIMARY KEY,\
	  		login VARCHAR(50),\
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
				sent TIMESTAMP WITH TIME ZONE\
			);\
			CREATE TABLE IF NOT EXISTS responses(\
				id SERIAL PRIMARY KEY,\
				author VARCHAR(50),\
				answers JSON,\
				form_id SERIAL REFERENCES forms,\
				created TIMESTAMP(6) WITH TIME ZONE DEFAULT current_timestamp\
			);'
		)

		if(!result) {
			client.query('\
				CREATE TABLE IF NOT EXISTS "sessions" (\
			  	"sid" varchar NOT NULL COLLATE "default",\
					"sess" json NOT NULL,\
					"expire" TIMESTAMP(6) NOT NULL\
				) WITH (OIDS=FALSE);\
				ALTER TABLE "sessions" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;'
			);
		}

		done();
	})
});