const express = require('express');
const router = express.Router();

module.exports = (pool) => {
  const fetchData = async (query, res) => {
    try {
      const [results] = await pool.query(query);
      res.json(results);
    } catch (err) {
      res.status(500).send(err);
    }
  };

  router.get('/companies', (req, res) => fetchData('SELECT * FROM companies', res));
  router.get('/u_hispatients', (req, res) => fetchData('SELECT * FROM u_hispatients', res));
  router.get('/countries', (req, res) => fetchData('SELECT * FROM countries', res));
  router.get('/ne_hisprefix', (req, res) => fetchData('SELECT * FROM ne_hisprefix', res));
  router.get('/u_hisgenders', (req, res) => fetchData('SELECT * FROM u_hisgenders', res));
  router.get('/u_hiscivilstatus', (req, res) => fetchData('SELECT * FROM u_hiscivilstatus', res));
  router.get('/u_hisnationalities', (req, res) => fetchData('SELECT * FROM u_hisnationalities', res));
  router.get('/u_hisreligions', (req, res) => fetchData('SELECT * FROM u_hisreligions', res));
  router.get('/ne_relationship', (req, res) => fetchData('SELECT * FROM ne_relationship', res));
  router.get('/ne_idtypes', (req, res) => fetchData('SELECT * FROM ne_idtypes', res));
  router.get('/contacttypes', (req, res) => fetchData('SELECT * FROM contacttypes', res));
  router.get('/emailcontacttypes', (req, res) => fetchData('SELECT * FROM emailcontacttypes', res));

  router.get('/u_hisaddrbrgys/NE_PROVINCE', (req, res) => {
    fetchData('SELECT DISTINCT NE_PROVINCE FROM u_hisaddrbrgys', res);
  });

  router.get('/u_hisaddrbrgys/NE_MINICIPALITY', async (req, res) => {
    const { province } = req.query;
    fetchData(`SELECT DISTINCT NE_MUNICIPALITY FROM u_hisaddrbrgys WHERE NE_PROVINCE = '${province}'`, res);
  });

  router.get('/u_hisaddrbrgys/NAME', async (req, res) => {
    const { city, province } = req.query;
    fetchData(`SELECT DISTINCT NAME FROM u_hisaddrbrgys WHERE NE_MUNICIPALITY = '${city}' AND NE_PROVINCE = '${province}'`, res);
  });

  router.get('/getPostalCode', async (req, res) => {
    const { barangay } = req.query;
    fetchData(`SELECT NE_ZIPCODE FROM u_hisaddrbrgys WHERE NAME = '${barangay}'`, res);
  });

  return router;
};
