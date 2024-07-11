var express = require('express');
var router = express.Router();
const multer =require('multer');
const upload =multer({dest:'uploads/'});
const fs = require('fs');
const connection = require("./../bbdd");
var mysql      = require('mysql');


 
/* GET pagina de productos. */
router.get('/', function(req, res, next) {
    connection.query('select * from productos', function (error, results, fields) {
        if (error) throw error;
        //res.json({data: results});  
        //console.log(results)
        res.render('produc', {data:results});
      });
});

/* GET pagina de contactos. */
router.get('/contacto/', function(req, res, next) {
  connection.query( function (error, results, fields) {
      if (error) throw error;
      res.render('contactos', {data:results});
    });
});

/* GET listado de productos. */
router.get('/listado/', function(req, res, next) {
  connection.query('select * from productos', function (error, results, fields) {
      
    if (error) throw error;
      //res.json({data: results});  
      res.render('1_listadoProduc', {data:results});
    });

});

/* Carga de Productos. */
router.get('/alta', function(req, res, next) {
      res.render('2_formularioAlta')
});

router.post('/alta', upload.single("imagen"), async function(req, res, next) {

let sentencia = 'insert into productos (Nombre, Descripcion, Cant_disponible, Precio, Imagen) values("' + req.body.nombre + '","' + req.body.descripcion + '","' + req.body.cant_disponible + '","' + req.body.precio + '","/images/' + req.file.originalname + '")'
let results = await connection.query(sentencia)    

fs.createReadStream("./uploads/" + req.file.filename).pipe(fs.createWriteStream("./public/images/" + req.file.originalname), function(error){})
res.render("finalizado", {mensaje: "Producto cargado exitosamente"})

});

/* Modificacion de Productos. */
router.get('/produc/modificar/:id', function(req, res, next) {
  connection.query('select * from productos where id = '+ req.params.id, function (error, results, fields) {
   
    if (error) throw error;
    //res.json({data: results});  
    res.render('3_formularioModificar', {data:results});
  });
});

router.post('/modificar'), upload.single("imagen"), async function(req, res, next) {

  let sentancia;

  if (req.file){
    sentancia = `update productos set nombre  = '${req.body.nombre}', descripcion  = '${req.body.descripcion}', cantidad = '${req.body.cant_disponible}', precio = '${req.body.precio}',  imagen = '/images/${req.file.originalname}' 
     where id = ${req.params.id} `

     fs.createReadStream("./uploads/" + req.file.filename).pipe(fs.createWriteStream("./public/images/" + req.file.originalname), function(error){})
  }
    else {
      sentencia = `update productos set nombre  = '${req.body.nombre}', descripcion  = '${req.body.descripcion}', cantidad = '${req.body.cant_disponible}', precio = '${req.body.precio}', where id = ${req.params.id}` 
  }  
  
   connection.query(sentencia, function (error, results, fields) {
    if (error) throw error;
    //res.json({data: results});  
    res.render('finalizado', {mensaje: "E producto fue modificado correctamente"});
  });

};

/*Eliminar Productos. */
router.get('/produc/eliminar/:id', function(req, res, next) {
  connection.query('select * from productos where id = '+ req.params.id, function (error, results, fields) {
    if (error) throw error;
    //res.json({data: results});  
    res.render('4_formularioEliminar', {data:results});
  });
});

router.post('/eliminar/:id'), upload.single("imagen"), async function(req, res, next) {

  connection.query('delete from productos where id = '+ req.params.id, function (error, results, fields) {
    
    if (error) throw error;
    //res.json({data: results});  
    res.render('finalizado', {mensaje: "E producto fue eliminado correctamente"});
  });

};

module.exports = router;