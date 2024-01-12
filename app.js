const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const session = require('express-session');
const ejsMate = require('ejs-mate');

const multer = require('multer');
const mammoth = require('mammoth');
const fs = require('fs');
const Docxtemplater = require('docxtemplater');
const path = require('path');
const app = express();
const port = 3000;
const bcrypt = require('bcrypt');

// Configure the PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ltsbeta',
  password: 'admin',
  port: 5432,
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('views', { 'extensions': ['html', 'htm', 'css'] }));

// Set up session middleware
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));

// Parse incoming request bodies in a middleware before your handlers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('ltsbeta/views'));
app.use(express.static('ltsbeta/'));
// Home route
app.get('/', (req, res) => {
  res.render('index');
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
    if (result.rows.length > 0) {
      // Store user information in the session
      req.session.user = result.rows[0];

      // Redirect to the dashboard
      res.redirect('/dashboard');
    } else {
      res.send('Invalid credentials. Please try again.');
    }
  } catch (error) {
    console.error('Error executing login query:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Dashboard route
app.get('/get-dashboard', (req, res) => {
  // Check if the user is logged in
  if (req.session.user) {
    const { name } = req.session.user;
    res.render('dashboard', { name });
  } else {
    // Redirect to the login page if not logged in
    res.redirect('/');
  }
});

// Home route
app.get('/register', (req, res) => {
    res.render('register');
  });

// Register route
app.post('/register', async (req, res) => {
  const { username, password, name } = req.body;

  try {
    const result = await pool.query('INSERT INTO users (username, password, name) VALUES ($1, $2, $3) RETURNING user_id', [username, password, name]);
    const userId = result.rows[0].user_id;
    res.send(`User registered with ID: ${userId}`);
  } catch (error) {
    console.error('Error executing registration query:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Logout route
app.get('/logout', (req, res) => {
    // Implement your logout logic here, e.g., destroy the session
    // Assuming you are using express-session
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
      res.render('index'); // Redirect to the login page after logout
    });
  });

  app.get('/trucking-companies', (req, res) => {
    // Assuming you have a PostgreSQL database connection
    const query = 'SELECT * FROM truckings';
  
    // Assuming you're using the 'pg' library
    pool.query(query, (error, result) => {
      if (error) {
        console.error('Error fetching trucking companies:', error);
        res.status(500).send('Internal Server Error');
      } else {
        truckings = result.rows;
        res.render('trucking', { truckings }); // Render 'trucking.ejs' with the truckings data
      }
    });
  });
  app.get('/get-drivers', (req, res) => {
    // Assuming you have a PostgreSQL database connection
    const query = 'SELECT * FROM drivers';
  
    // Assuming you're using the 'pg' library
    pool.query(query, (error, result) => {
      if (error) {
        console.error('Error fetching drivers:', error);
        res.status(500).send('Internal Server Error');
      } else {
        drivers = result.rows;
        res.render('drivers', { drivers }); // Render 'trucking.ejs' with the truckings data
      }
    });
  });
  
app.post('/add-trucking', (req, res) => {
  const trucking_name = req.query.trucking_name;
  const trucking_address = req.query.trucking_address;
  const trucking_phone = req.query.trucking_phone;

  // Assuming you have a PostgreSQL database connection
  const query = 'INSERT INTO truckings (trucking_name, trucking_address, trucking_phone, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *';
  const values = [trucking_name, trucking_address, trucking_phone];

  // Assuming you're using the 'pg' library
  pool.query(query, values, (error, result) => {
    if (error) {
      console.error('Error adding trucking company:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const addedTruckingCompany = result.rows[0];
      console.log('Trucking company added successfully:', addedTruckingCompany);
      res.json({ message: 'Trucking company added successfully', data: addedTruckingCompany });
    }
  });
});


  app.post('/delete-trucking/:truckingId', (req, res) => {
    const { truckingId } = req.params;
  
    // Assuming you have a truckings table in your database
    const query = 'DELETE FROM truckings WHERE trucking_id = $1';
    const values = [truckingId];
  
    // Assuming you're using the 'pg' library
    pool.query(query, values, (error) => {
        if (error) {
            console.error('Error deleting trucking company:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log(`Trucking company with ID ${truckingId} deleted successfully`);
            res.sendStatus(204); // Send a No Content status
        }
    });
});

app.get('/getInfo-trucking/:truckingId', (req, res) => {
  const { truckingId } = req.params;

  // Assuming you have a truckings table in your database
  const query = 'SELECT * FROM truckings WHERE trucking_id = $1';
  const values = [truckingId];

  // Assuming you're using the 'pg' library
  pool.query(query, values, (error, result) => {
    if (error) {
      console.error('Error fetching trucking data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const truckingData = result.rows[0]; // Assuming only one row is returned

      if (!truckingData) {
        // No data found for the specified truckingId
        res.status(404).json({ error: 'Trucking data not found' });
      } else {
        // Data found, send it as a JSON response
        res.json(truckingData);
      }
    }
  });
});

app.put('/updateInfo-trucking/:truckingId', async (req, res) => {
  const { truckingId } = req.params;
  const truckingName = req.query.truckingName;
  const truckingAddress = req.query.truckingAddress;
  const truckingPhone = req.query.truckingPhone;

  try {
    // Use a PostgreSQL query to update the trucking data
    const updateQuery = `
      UPDATE truckings
      SET trucking_name = $1, trucking_address = $2, trucking_phone = $3
      WHERE trucking_id = $4
      RETURNING *;
    `;

    const result = await pool.query(updateQuery, [truckingName, truckingAddress, truckingPhone, truckingId]);

    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Data updated successfully', updatedData: result.rows[0] });
    } else {
      res.status(404).json({ error: 'Trucking data not found' });
    }
  } catch (error) {
    console.error('Error updating trucking data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/get-truckings', (req, res) => {
  // Assuming you have a 'truckings' table in your database
  const query = 'SELECT trucking_id, trucking_name FROM truckings';

  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error fetching trucking data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const truckings = result.rows;
      res.json(truckings);
      console.log(truckings);
    }
  });
});

app.post('/add-driver', async (req, res) => {
  const {
    driver_name,
    driver_username,
    driver_password,
    driver_age,
    driver_address,
    driver_phone,
    driver_licence_no,
    driver_trucking_id,
  } = req.query;

  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(driver_password, 10);

    // Assuming you have a PostgreSQL database connection
    const query =
      'INSERT INTO drivers (driver_name, driver_username, password, age, driver_address, driver_phone, licence_no, trucking_id, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *';
    const values = [
      driver_name,
      driver_username,
      hashedPassword,
      driver_age,
      driver_address,
      driver_phone,
      driver_licence_no,
      driver_trucking_id,
    ];

    // Assuming you're using the 'pg' library
    const result = await pool.query(query, values);

    const addedDriver = result.rows[0];
    console.log('Driver added successfully:', addedDriver);
    res.json({ message: 'Driver added successfully', data: addedDriver });
  } catch (error) {
    console.error('Error adding driver:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/get-trucking-names', (req, res) => {
  // Assuming you have a truckings table in your database
  const query = 'SELECT trucking_id, trucking_name FROM truckings';

  // Assuming you're using the 'pg' library
  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error fetching trucking names:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(result.rows);
    }
  });
});

app.post('/delete-driver/:driverId', (req, res) => {
  const { driverId } = req.params;

  // Assuming you have a truckings table in your database
  const query = 'DELETE FROM drivers WHERE driver_id = $1';
  const values = [driverId];

  // Assuming you're using the 'pg' library
  pool.query(query, values, (error) => {
      if (error) {
          console.error('Error deleting driver:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          console.log(`Driver with ID ${driverId} deleted successfully`);
          res.sendStatus(204); // Send a No Content status
      }
  });
});

app.get('/getInfo-driver/:driverId', (req, res) => {
  const { driverId } = req.params;

  const query = 'SELECT * FROM drivers WHERE driver_id = $1';
  const values = [driverId];

  // Assuming you're using the 'pg' library
  pool.query(query, values, (error, result) => {
    if (error) {
      console.error('Error fetching driver data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const driverData = result.rows[0]; // Assuming only one row is returned

      if (!driverData) {
        // No data found for the specified truckingId
        res.status(404).json({ error: 'Driver data not found' });
      } else {
        // Data found, send it as a JSON response
        res.json(driverData);
      }
    }
  });
});

app.put('/updateDriverInfo/:driverId', async (req, res) => {
  const driverId = req.params.driverId;
  const driverName = req.query.driverName;
  const driverUsername = req.query.driverUsername;
  const driverPhone = req.query.driverPhone;
  const driverPassword = req.query.driverPassword;
  const driverAge = req.query.driverAge;
  const driverAddress = req.query.driverAddress;
  const licenceNo = req.query.licenceNo;
  const truckingId = req.query.truckingId;

  // Hash the password
  const hashed = await bcrypt.hash(driverPassword, 10);

  // Example PostgreSQL query using the 'pg' library
  const updateQuery = `
    UPDATE drivers
    SET
      driver_name = $1,
      driver_username = $2,
      driver_phone = $3,
      password = $4,
      age = $5,
      driver_address = $6,
      licence_no = $7,
      trucking_id = $8
    WHERE driver_id = $9
    RETURNING *;
  `;

  const values = [
    driverName,
    driverUsername,
    driverPhone,
    hashed, // Use hashed password
    driverAge,
    driverAddress,
    licenceNo,
    truckingId,
    driverId,
  ];

  try {
    // Execute the update query
    const result = await pool.query(updateQuery, values);

    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Driver data updated successfully', updatedData: result.rows[0] });
    } else {
      res.status(404).json({ error: 'Driver data not found' });
    }
  } catch (error) {
    console.error('Error updating driver data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/truck-units', (req, res) => {
  // Assuming you have a PostgreSQL database connection
  const query = 'SELECT * FROM truck_units';

  // Assuming you're using the 'pg' library
  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error fetching truck units:', error);
      res.status(500).send('Internal Server Error');
    } else {
      truck_units = result.rows;
      res.render('truckUnits', { truck_units }); // Render 'trucking.ejs' with the truckings data
    }
  });
});

app.post('/add-truck-unit', async (req, res) => {

  const truckUnitTruckingId = req.query.truckUnitTruckingId;
  const truckUnitName = req.query.truckUnitName;
  const truckUnitSourceType = req.query.truckUnitSourceType;
  const truckUnitPlateNo = req.query.truckUnitPlateNo;
  const truckUnitModel = req.query.truckUnitModel;
  const truckUnitChasisNo = req.query.truckUnitChasisNo;
  console.log(truckUnitTruckingId);
  console.log(truckUnitName);
  console.log(truckUnitSourceType);
  console.log(truckUnitPlateNo);
  console.log(truckUnitModel);
  console.log(truckUnitChasisNo);

  

  try {
    // Assuming you have a PostgreSQL database connection
    const query =
      'INSERT INTO truck_units (trucking_id, truck_name, source_type, truck_plateno, model, chasisno, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *';
    const values = [
      truckUnitTruckingId,
      truckUnitName,
      truckUnitSourceType,
      truckUnitPlateNo,
      truckUnitModel,
      truckUnitChasisNo,
    ];
    
    // Assuming you're using the 'pg' library
    const result = await pool.query(query, values);

    const addedTruckUnit = result.rows[0];
    console.log('Truck Unit added successfully:', addedTruckUnit);
    res.json({ message: 'Truck Unit added successfully', data: addedTruckUnit });
  } catch (error) {
    console.log('Request Body:', req.query);
    console.error('Error adding Truck unit:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/deliveries', (req, res) => {
  res.render('deliveries');
});

app.get('/truckings', (req, res) => {
  res.render('trucking');
});

app.get('/maintenance', (req, res) => {
  res.render('maintenance');
});

app.get('/dashboard', (req, res) => {
  res.redirect('/get-dashboard');
});

app.get('/driver', (req, res) => {
  res.render('drivers');
});

app.get('/get-truck-units', (req, res) => {
  res.render('truckUnits');
});

app.get('/deliveries', (req, res) => {
  res.redirect('/get-deliveries');
});


app.post('/delete-truck-unit/:truckUnitId', (req, res) => {
  const { truckUnitId } = req.params;

  // Assuming you have a truckings table in your database
  const query = 'DELETE FROM truck_units WHERE truck_id = $1';
  const values = [truckUnitId];

  // Assuming you're using the 'pg' library
  pool.query(query, values, (error) => {
      if (error) {
          console.error('Error deleting truck unit:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          console.log(`truck unit with ID ${truckUnitId} deleted successfully`);
          res.sendStatus(204); // Send a No Content status
      }
  });
});

app.get('/getInfo-truck-unit/:truckUnitId', (req, res) => {
  const { truckUnitId } = req.params;

  const query = 'SELECT * FROM truck_units WHERE truck_id = $1';
  const values = [truckUnitId];

  // Assuming you're using the 'pg' library
  pool.query(query, values, (error, result) => {
    if (error) {
      console.error('Error fetching truck unit data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const truckUnitData = result.rows[0]; // Assuming only one row is returned

      if (!truckUnitData) {
        // No data found for the specified truckingId
        res.status(404).json({ error: 'Truck unit data not found' });
      } else {
        // Data found, send it as a JSON response
        res.json(truckUnitData);
      }
    }
  });
});

app.get('/get-source-types', (req, res) => {
  // Assuming you have a PostgreSQL database connection
  const query = 'SELECT * FROM source_types';

  // Assuming you're using the 'pg' library
  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error fetching source types:', error);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(result.rows);
    }
  });
});


app.put('/updateTruckUnitInfo/:truckId', async (req, res) => {
  const truckId = req.params.truckId;
  const truckName = req.query.truckName;
  const truckPlateNo = req.query.truckPlateNo;
  const truckModel = req.query.truckModel;
  const truckChasisNo = req.query.truckChasisNo;
  const sourceType = req.query.sourceType;
  const truckingId = req.query.truckingId;

  // Example PostgreSQL query using the 'pg' library
  const updateQuery = `
    UPDATE truck_units
    SET
      trucking_id = $1,
      truck_name = $2,
      source_type = $3,
      truck_plateno = $4,
      model = $5,
      chasisno = $6
    WHERE truck_id = $7
    RETURNING *;
  `;

  const values = [
    truckingId,
    truckName,
    sourceType,
    truckPlateNo, 
    truckModel,
    truckChasisNo,
    truckId,
  ];

  try {
    // Execute the update query
    const result = await pool.query(updateQuery, values);

    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Truck Unit data updated successfully', updatedData: result.rows[0] });
    } else {
      res.status(404).json({ error: 'Truck Unit data not found' });
    }
  } catch (error) {
    console.error('Error updating Truck Unit data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/truck-units', (req, res) => {
  // Assuming you have a PostgreSQL database connection
  const query = 'SELECT * FROM truck_units';

  // Assuming you're using the 'pg' library
  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error fetching truck units:', error);
      res.status(500).send('Internal Server Error');
    } else {
      truck_units = result.rows;
      res.render('truckUnits', { truck_units }); // Render 'trucking.ejs' with the truckings data
    }
  });
});

app.get('/get-deliveries', (req, res) => {
  // Assuming you have a PostgreSQL database connection
  const query = 'SELECT * FROM deliveries';

  // Assuming you're using the 'pg' library
  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error fetching deliveries:', error);
      res.status(500).send('Internal Server Error');
    } else {
      deliveries = result.rows;
      res.render('deliveries', { deliveries }); // Render 'trucking.ejs' with the truckings data
    }
  });
});

app.get('/fetch-drivers', (req, res) => {
  // Assuming you have a 'truckings' table in your database
  const query = 'SELECT driver_id, driver_name FROM drivers';

  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error fetching drivers data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const drivers = result.rows;
      res.json(drivers);
      console.log(drivers);
    }
  });
});

app.get('/fetch-truck-units', (req, res) => {
  // Assuming you have a 'truckings' table in your database
  const query = 'SELECT truck_id, truck_name FROM truck_units';

  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error fetching truck units data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const truckUnits = result.rows;
      res.json(truckUnits);
      console.log(truckUnits);
    }
  });
});

app.post('/add-delivery', async (req, res) => {

  const trucking_id = req.query.trucking_id;
  const hasno = req.query.hasno;
  const driver_id = req.query.driver_id;
  const truck_id = req.query.truck_id;
  const helper = req.query.helper;
  const bussiness_name = req.query.bussiness_name;
  const delivery_address = req.query.delivery_address;
  const contact_person = req.query.contact_person;
  const contactno = req.query.contactno;
  const delivery_date = req.query.delivery_date;
  const dispatch_by = req.query.dispatch_by;
  const dispatch_date = req.query.dispatch_date;
  const receive_by = req.query.receive_by;
  const receive_date = req.query.receive_date;
  const status_id = req.query.status_id;


  try {
    // Assuming you have a PostgreSQL database connection
    const query =
      'INSERT INTO deliveries (trucking_id, driver_id, hasno, bussiness_name, delivery_address, contact_person, contactno, delivery_date, dispatch_by, dispatch_date, receive_by, receive_date, created_at, updated_at, truck_id, helper, status_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW(), $13, $14, $15) RETURNING *';
    const values = [
      trucking_id,
      driver_id,
      hasno,
      bussiness_name,
      delivery_address,
      contact_person,
      contactno,
      delivery_date,
      dispatch_by,
      dispatch_date,
      receive_by,
      receive_date,
      truck_id,
      helper,
      status_id
    ];
    
    // Assuming you're using the 'pg' library
    const result = await pool.query(query, values);

    const addedTruckUnit = result.rows[0];
    console.log('Delivery added successfully:', addedTruckUnit);
    res.json({ message: 'Delivery added successfully', data: addedTruckUnit });
  } catch (error) {
    console.log('Request Body:', req.query);
    console.error('Error adding Delivery:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/get-status-names', (req, res) => {

  const query = 'SELECT status_id, status_name FROM status';

  // Assuming you're using the 'pg' library
  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error fetching status names:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(result.rows);
    }
  });
});

app.get('/get-driver-names', (req, res) => {

  const query = 'SELECT driver_id, driver_name FROM drivers';

  // Assuming you're using the 'pg' library
  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error fetching driver names:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(result.rows);
    }
  });
});

app.get('/get-truck-unit-names', (req, res) => {

  const query = 'SELECT truck_id, truck_name FROM truck_units';

  // Assuming you're using the 'pg' library
  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error fetching truck unit names:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(result.rows);
    }
  });
});

app.get('/get-truck-unit-plate-no', (req, res) => {

  const query = 'SELECT truck_id, truck_plateno FROM truck_units';

  // Assuming you're using the 'pg' library
  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error fetching truck unit plate no:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(result.rows);
    }
  });
});

app.post('/delete-delivery/:deliveryId', (req, res) => {
  const { deliveryId } = req.params;

  const query = 'DELETE FROM deliveries WHERE delivery_id = $1';
  const values = [deliveryId];

  // Assuming you're using the 'pg' library
  pool.query(query, values, (error) => {
      if (error) {
          console.error('Error deleting delivery:', error);
          res.status(500).json({ error: 'Internal Server Error' });
      } else {
          console.log(`delivery with ID ${deliveryId} deleted successfully`);
          res.sendStatus(204); // Send a No Content status
      }
  });
});

app.get('/getInfo-delivery/:deliveryId', (req, res) => {
  const { deliveryId } = req.params;

  // Assuming you have a truckings table in your database
  const query = 'SELECT * FROM deliveries WHERE delivery_id = $1';
  const values = [deliveryId];

  // Assuming you're using the 'pg' library
  pool.query(query, values, (error, result) => {
    if (error) {
      console.error('Error fetching delivery data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const deliveryData = result.rows[0]; // Assuming only one row is returned

      if (!deliveryData) {
        // No data found for the specified truckingId
        res.status(404).json({ error: 'delivery data not found' });
      } else {
        // Data found, send it as a JSON response
        res.json(deliveryData);
      }
    }
  });
});

app.put('/update-info-delivery/:edit_delivery_id', async (req, res) => {
  const edit_delivery_id = req.params.edit_delivery_id;
  const edit_hasno = req.query.edit_hasno;
  const edit_helper = req.query.edit_helper;
  const edit_bussiness_name = req.query.edit_bussiness_name;
  const edit_delivery_address = req.query.edit_delivery_address;
  const edit_contact_person = req.query.edit_contact_person;
  const edit_contactno = req.query.edit_contactno;
  const edit_delivery_date = req.query.edit_delivery_date;
  const edit_dispatch_by = req.query.edit_dispatch_by;
  const edit_dispatch_date = req.query.edit_dispatch_date;
  const trucking_id = req.query.trucking_id;
  const driver_id = req.query.driver_id;
  const truck_id = req.query.truck_id;

  // Example PostgreSQL query using the 'pg' library
  const updateQuery = `
    UPDATE deliveries
    SET
      trucking_id = $1,
      driver_id = $2,
      hasno = $3,
      bussiness_name = $4,
      delivery_address = $5,
      contact_person = $6,
      contactno = $7,
      delivery_date = $8,
      dispatch_by = $9,
      dispatch_date = $10,
      truck_id = $11,
      helper = $12
    WHERE delivery_id = $13
    RETURNING *;
  `;

  const values = [
    trucking_id,
    driver_id,
    edit_hasno,
    edit_bussiness_name, // Use hashed password
    edit_delivery_address,
    edit_contact_person,
    edit_contactno,
    edit_delivery_date,
    edit_dispatch_by,
    edit_dispatch_date,
    truck_id,
    edit_helper,
    edit_delivery_id
  ];

  try {
    // Execute the update query
    const result = await pool.query(updateQuery, values);

    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Driver data updated successfully', updatedData: result.rows[0] });
    } else {
      res.status(404).json({ error: 'Driver data not found' });
    }
  } catch (error) {
    console.error('Error updating driver data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // 'uploads' is the directory where uploaded files will be stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
  }
});

const upload = multer({ storage: storage });

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static('uploads'));

// Handle POST request for file upload
app.post('/upload', upload.single('c_receive_proof'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // File uploaded successfully
  const filePath = '/uploads/' + req.file.filename;
  res.send(filePath);
});


// Handle POST request for file upload
app.post('/receipt', upload.single('receipt_proof'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // File uploaded successfully
  const filePath = '/uploads/' + req.file.filename;
  res.send(filePath);
});

app.put('/update-status-delivery/:c_delivery_id', async (req, res) => {
  const c_delivery_id = req.params.c_delivery_id;
  const c_receive_by = req.query.c_receive_by;
  const c_receive_date = req.query.c_receive_date;
  const c_status_id = req.query.c_status_id;
  const c_receive_proof = req.query.c_receive_proof;

  // Example PostgreSQL query using the 'pg' library
  const updateQuery = `
    UPDATE deliveries
    SET
      receive_by = $1,
      receive_date = $2,
      status_id = $3,
      receive_proof = $4
    WHERE delivery_id = $5
    RETURNING *;
  `;

  const values = [
    c_receive_by,
    c_receive_date,
    c_status_id,
    c_receive_proof,
    c_delivery_id
  ];

  try {
    // Execute the update query
    const result = await pool.query(updateQuery, values);

    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Delivery data updated successfully', updatedData: result.rows[0] });
    } else {
      res.status(404).json({ error: 'Delivery data not found' });
    }
  } catch (error) {
    console.error('Error updating delivery data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/get-maintenance', (req, res) => {
  // Assuming you have a PostgreSQL database connection
  const query = 'SELECT * FROM maintenance';

  // Assuming you're using the 'pg' library
  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error fetching maintenance:', error);
      res.status(500).send('Internal Server Error');
    } else {
      maintenances = result.rows;
      res.render('maintenance', { maintenances }); // Render 'trucking.ejs' with the truckings data
    }
  });
});

app.post('/add-maintenance', (req, res) => {
  const trucking_id = req.query.trucking_id;
  const truck_id = req.query.truck_id;
  const driver_id = req.query.driver_id;
  const receipt_proof = req.query.receipt_proof;

  // Assuming you have a PostgreSQL database connection
  const query = 'INSERT INTO maintenance (trucking_id, truck_id, driver_id, receipt_proof, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *';
  const values = [trucking_id, truck_id, driver_id, receipt_proof];

  // Assuming you're using the 'pg' library
  pool.query(query, values, (error, result) => {
    if (error) {
      console.error('Error adding maintenance:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const addedMaintenance = result.rows[0];
      console.log('maintenance added successfully:', addedMaintenance);
      res.json({ message: 'maintenance added successfully', data: addedMaintenance });
    }
  });
});

app.delete('/delete-maintenance/:maintenanceId', (req, res) => {
  const { maintenanceId } = req.params;

  // Assuming you have a maintenance table in your database
  const query = 'DELETE FROM maintenance WHERE maintenance_id = $1';
  const values = [maintenanceId];

  // Assuming you're using the 'pg' library
  pool.query(query, values, (error) => {
    if (error) {
      console.error('Error deleting maintenance record:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log(`Maintenance with ID ${maintenanceId} deleted successfully`);
      res.sendStatus(204); // Send a No Content status
    }
  });
});

app.get('/getInfo-maintenance/:maintenanceId', (req, res) => {
  const { maintenanceId } = req.params;

  // Assuming you have a truckings  table in your database
  const query = 'SELECT * FROM maintenance WHERE maintenance_id = $1';
  const values = [maintenanceId];

  // Assuming you're using the 'pg' library
  pool.query(query, values, (error, result) => {
    if (error) {
      console.error('Error fetching maintenance data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const maintenanceData = result.rows[0]; // Assuming only one row is returned

      if (!maintenanceData) {
        // No data found for the specified truckingId
        res.status(404).json({ error: 'maintenance data not found' });
      } else {
        // Data found, send it as a JSON response
        res.json(maintenanceData);
      }
    }
  });
});

app.put('/update-maintenance/:maintenance_id', async (req, res) => {
  const maintenance_id = req.params.maintenance_id;
  const trucking_id = req.query.trucking_id;
  const driver_id = req.query.driver_id;
  const truck_id = req.query.truck_id;
  const receipt_proof = req.query.receipt_proof;

  // Example PostgreSQL query using the 'pg' library
  const updateQuery = `
    UPDATE maintenance
    SET
      trucking_id = $1,
      driver_id = $2,
      truck_id = $3,
      receipt_proof = $4
    WHERE maintenance_id = $5
    RETURNING *;
  `;

  const values = [
    trucking_id,
    driver_id,
    truck_id,
    receipt_proof,
    maintenance_id
  ];

  try {
    // Execute the update query
    const result = await pool.query(updateQuery, values);

    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Maintenance data updated successfully', updatedData: result.rows[0] });
    } else {
      res.status(404).json({ error: 'Maintenance data not found' });
    }
  } catch (error) {
    console.error('Error updating maintenance data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/get-billing', (req, res) => {
  // Assuming you have a PostgreSQL database connection
  const query = 'SELECT * FROM billing';

  // Assuming you're using the 'pg' library
  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error fetching billings:', error);
      res.status(500).send('Internal Server Error');
    } else {
      billings = result.rows;
      res.render('billing', { billings }); // Render 'trucking.ejs' with the truckings data
    }
  });
});
app.get('/billing', (req, res) => {
  res.render('billing');
});

app.get('/get-delivery/:id', async (req, res) => {
  const deliveryId = req.params.id;

  try {
    const result = await pool.query('SELECT * FROM deliveries WHERE delivery_id = $1', [deliveryId]);

    if (result.rows.length === 0) {
      res.status(404).send('Delivery not found');
      return;
    }

    const deliveryData = result.rows[0];
    res.json(deliveryData);
  } catch (error) {
    console.error('Error fetching delivery data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/getDeliveriesWithOrigin', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT delivery_id FROM billing WHERE origin IS NOT NULL');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching deliveries with origin:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/get-delivery-ids', async (req, res) => {
  try {
    const result = await pool.query('SELECT delivery_id FROM deliveries WHERE status_id = 1');
    const deliveryIds = result.rows.map(row => row.delivery_id);
    res.json(deliveryIds);
  } catch (error) {
    console.error('Error fetching delivery IDs:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/add-billing', async (req, res) => {

    const delivery_id = req.query.delivery_id;
    const delivery_date = req.query.delivery_date;
    const delivery_address = req.query.delivery_address;
    const truck_id = req.query.truck_id;
    const hasno = req.query.hasno;
    const origin = req.query.origin;
    const consignee = req.query.consignee;
    const qty = req.query.qty;
    const items = req.query.items;


  try {
    // Assuming you have a PostgreSQL database connection
    const query =
      'INSERT INTO billing (delivery_id, delivery_address, delivery_date, hasno, truck_id, origin, consignee, items, qty, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) RETURNING *';
    const values = [
      delivery_id,
      delivery_address,
      delivery_date,
      hasno,
      truck_id,
      origin,
      consignee,
      items,
      qty
    ];
    
    // Assuming you're using the 'pg' library
    const result = await pool.query(query, values);

    const addedBilling = result.rows[0];
    console.log('Billing added successfully:', addedBilling);
    res.status(200).json({ message: 'Billing added successfully', data: addedBilling });
  } catch (error) {
    console.error('Error adding Billing:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/delete-billing/:billingId', (req, res) => {
  const { billingId } = req.params;

  // Assuming you have a maintenance table in your database
  const query = 'DELETE FROM billing WHERE billing_id = $1';
  const values = [billingId];

  // Assuming you're using the 'pg' library
  pool.query(query, values, (error) => {
    if (error) {
      console.error('Error deleting billing record:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.log(`billing with ID ${billingId} deleted successfully`);
      res.sendStatus(204); // Send a No Content status
    }
  });
});

app.get('/getInfo-billing/:billingId', (req, res) => {
  const { billingId } = req.params;

  // Assuming you have a truckings table in your database
  const query = 'SELECT * FROM billing WHERE billing_id = $1';
  const values = [billingId];

  // Assuming you're using the 'pg' library
  pool.query(query, values, (error, result) => {
    if (error) {
      console.error('Error fetching billing data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const truckingData = result.rows[0]; // Assuming only one row is returned

      if (!truckingData) {
        // No data found for the specified truckingId
        res.status(404).json({ error: 'billing data not found' });
      } else {
        // Data found, send it as a JSON response
        res.json(truckingData);
      }
    }
  });
});

app.put('/updateInfo-billing/:edit_billing_id', async (req, res) => {
  const { edit_billing_id } = req.params;
  const edit_origin = req.query.edit_origin;
  const edit_consignee = req.query.edit_consignee;
  const edit_items = req.query.edit_items;
  const edit_qty = req.query.edit_qty;

  try {
    // Use a PostgreSQL query to update the trucking data
    const updateQuery = `
      UPDATE billing
      SET origin = $1, consignee = $2, items = $3, qty = $4
      WHERE billing_id = $5
      RETURNING *;
    `;

    const result = await pool.query(updateQuery, [edit_origin, edit_consignee, edit_items, edit_qty, edit_billing_id]);

    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Data updated successfully', updatedData: result.rows[0] });
    } else {
      res.status(404).json({ error: 'billing data not found' });
    }
  } catch (error) {
    console.error('Error updating billing data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getCompletedDeliveries', async (req, res) => {
  try {
    // Perform a database query to get completed deliveries
    const result = await pool.query('SELECT delivery_id, delivery_date FROM deliveries WHERE status_id = 1');

    // Send the result as JSON to the client
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching completed deliveries:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getOngoingDeliveries', async (req, res) => {
  try {
    // Perform a database query to get completed deliveries
    const result = await pool.query('SELECT delivery_id, delivery_date FROM deliveries WHERE status_id = 0');

    // Send the result as JSON to the client
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching completed deliveries:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getTruckUnitsGraph', async (req, res) => {
  try {
    // Perform a database query to get truck units
    const result = await pool.query('SELECT truck_id, source_type FROM truck_units');

    // Send the result as JSON to the client
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching truck units:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/fetch-users', (req, res) => {
  // Assuming you have a PostgreSQL database connection
  const query = 'SELECT * FROM users';

  // Assuming you're using the 'pg' library
  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error fetching users:', error);
      res.status(500).send('Internal Server Error');
    } else {
      users = result.rows;
      res.render('users', { users }); // Render 'trucking.ejs' with the truckings data
    }
  });
});

app.get('/user', (req, res) => {
  res.redirect('/fetch-users');
});

app.put('/updateInfo-user/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const username = req.query.username;
  const password = req.query.password;

  try {
    // Use a PostgreSQL query to update the trucking data
    const updateQuery = `
      UPDATE users
      SET username = $1, password = $2
      WHERE user_id = $3
      RETURNING *;
    `;

    const result = await pool.query(updateQuery, [username, password, user_id]);

    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Data updated successfully', updatedData: result.rows[0] });
    } else {
      res.status(404).json({ error: 'data not found' });
    }
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
