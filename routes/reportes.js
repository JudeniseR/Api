// routes/reportes.js
const { Router } = require('express');
const db = require('../db');           // <- tu db.js (mysql con callbacks)
const { Parser } = require('json2csv');

const router = Router();

function run(sql, params, res) {
  db.query(sql, params, (err, rows) => {
    if (err) {
      console.error('[SQL ERROR]', err);
      return res.status(500).json({
        error: err.code || 'SQL_ERROR',
        message: err.sqlMessage || String(err),
        sql
      });
    }
    res.json(rows);
  });
}

// /api/reportes/ventas?rango=dia|semana|mes
router.get('/ventas', (req, res) => {
  const rango = String(req.query.rango || 'dia');
  let sql = '';
  if (rango === 'dia') {
    sql = `
      SELECT DATE(fecha_cotizacion) AS periodo, COUNT(*) AS cantidad
      FROM producto_factura
      GROUP BY DATE(fecha_cotizacion)
      ORDER BY periodo;
    `;
  } else if (rango === 'semana') {
    sql = `
      SELECT YEARWEEK(fecha_cotizacion,3) AS periodo, COUNT(*) AS cantidad
      FROM producto_factura
      GROUP BY YEARWEEK(fecha_cotizacion,3)
      ORDER BY periodo;
    `;
  } else {
    sql = `
      SELECT DATE_FORMAT(fecha_cotizacion,'%Y-%m') AS periodo, COUNT(*) AS cantidad
      FROM producto_factura
      GROUP BY DATE_FORMAT(fecha_cotizacion,'%Y-%m')
      ORDER BY periodo;
    `;
  }
  run(sql, [], res);
});

// /api/reportes/dolar-semanal
router.get('/dolar-semanal', (_req, res) => {
  const sql = `
    SELECT YEARWEEK(fecha_cotizacion,3) AS semana,
           ROUND(AVG(cotizacion_usd),2)  AS valor
    FROM producto_factura
    WHERE cotizacion_usd IS NOT NULL
    GROUP BY YEARWEEK(fecha_cotizacion,3)
    ORDER BY semana;
  `;
  run(sql, [], res);
});

router.get('/top-productos', (_req, res) => {
  const sql = `
    SELECT p.nombre AS producto, SUM(f.cantidad) AS cantidad
    FROM producto_factura f
    JOIN productos p ON p.id = f.id_producto
    GROUP BY p.nombre
    ORDER BY cantidad DESC
    LIMIT 10;
  `;
  run(sql, [], res);
});

router.get('/facturas-csv', (_req, res) => {
  const sql = `
    SELECT
      f.fecha_cotizacion AS fecha,
      CONCAT(u.nombre,' ',u.apellido) AS cliente,
      p.nombre AS producto,
      f.cantidad,
      f.precio_unitario,
      f.total_ars,
      f.total_usd,
      f.cotizacion_usd
    FROM producto_factura f
    LEFT JOIN usuarios u  ON u.id = f.id_usuario
    LEFT JOIN productos p ON p.id = f.id_producto
    ORDER BY f.fecha_cotizacion DESC;
  `;
  db.query(sql, [], (err, rows) => {
    if (err) {
      console.error('[SQL ERROR]', err);
      return res.status(500).json({ error: err.code, message: err.sqlMessage, sql });
    }
    const parser = new Parser();
    const csv = parser.parse(rows);
    res.header('Content-Type', 'text/csv');
    res.attachment('facturas.csv');
    res.send(csv);
  });
});

module.exports = router;
