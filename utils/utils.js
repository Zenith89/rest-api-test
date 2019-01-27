const handlePing= (req,res) =>{
    res.status(200).send({ping:'Pong'}).json()
}
const handleVersionNumber= (req,res) =>{
    res.status(200).send({version:process.version}).json()
}
const handleInvalidUrl= (req,res) =>{
    res.send({message:'Invalid request'}, 404);
}
module.exports= {handlePing,handleVersionNumber, handleInvalidUrl}