const Tarea = require('../models/tareas');
const Proyecto =require('../models/Proyecto');
const { validationResult} =require('express-validator');


//Crear una nueva tarea 
exports.crearTarea = async (req, res )=>{


    //reviasr errores 
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({errores: errores.array() });
    }

  
    try {

        ///extraer el proyecto y comprobar si existe
    const { proyecto } = req.body;
    
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto){
            return res.status(404).json({msg:'proyecto no encontrado'});

        }
        //revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString()  !== req.usuario.id) {
            return res.status(401).json({msg:'no autorizado'})
        }

// creamos la tarea 
const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({tarea});

    } catch (error) {
        console.log(error);
        res.status(500).send('hubo un error')
    }
}


//obtine las tareas por proyecto
exports.obtenerTareas = async (req , res ) => {

    try {
        ///extraer el proyecto y comprobar si existe
    const { proyecto } = req.query;
    console.log(req.query)
    const existeProyecto = await Proyecto.findById(proyecto);
    if(!existeProyecto){
        return res.status(404).json({msg:'proyecto no encontrado'});

    }
    //revisar si el proyecto actual pertenece al usuario autenticado
    if(existeProyecto.creador.toString()  !== req.usuario.id) {
        return res.status(401).json({msg:'no autorizado'});

    }

     //obtner las tareas por proyecto
     const tareas = await Tarea.find({ proyecto }).sort({creado: - 1});
     res.json({ tareas});

    } catch (error) {
        console.log(error);
        res.status(500).send('hubo un error');
    }
}



//ACTUALIZAR TAREAS
exports.actualizarTarea = async (req , res) =>{
    try {
        
  ///extraer el proyecto y comprobar si existe
  const { proyecto, nombre, estado} = req.body;

//si esxite la tarea o no
let tarea = await Tarea.findById(req.params.id);
if(!tarea){
    return res.status(404).json({msg:'no existe la tarea'});
}

//extraer proyecto
  const existeProyecto = await Proyecto.findById(proyecto);


  
  //revisar si el proyecto actual pertenece al usuario autenticado
  if(existeProyecto.creador.toString()  !== req.usuario.id) {
      return res.status(401).json({msg:'no autorizado'});

  }


  //crear un objeto con la nueva tarea
const nuevaTarea = {};

    
     nuevaTarea.nombre = nombre;
    

    
        nuevaTarea.estado = estado;
    


    //Guradar la tarea
    tarea = await Tarea.findOneAndUpdate({_id:req.params.id} ,nuevaTarea , {new: true});
    res.json({tarea});


    } catch (error) {
        console.log(error);
        res.status(500).send('hubo un error');
        
    }
}

//Eliminar una tarea
exports.eliminarTarea =async(req, res)=> {
    try {
         ///extraer el proyecto y comprobar si existe
  const { proyecto } = req.query;

  //si esxite la tarea o no
  let tarea = await Tarea.findById(req.params.id);
  if(!tarea){
      return res.status(404).json({msg:'no existe la tarea'});
  }
  
  //extraer proyecto
    const existeProyecto = await Proyecto.findById(proyecto);
  
  
    
    //revisar si el proyecto actual pertenece al usuario autenticado
    if(existeProyecto.creador.toString()  !== req.usuario.id) {
        return res.status(401).json({msg:'no autorizado'});
  
    }

    //eliminar
    await Tarea.findOneAndRemove({_id :req.params.id});
    res.json({msg:'Tarea eliminada'});


} catch (error) {
    console.log(error);
    res.status(500).send('hubo un error');
    
}
}