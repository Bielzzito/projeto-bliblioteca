import mysql from "mysql2/promise";
import "dotenv/config";

const pool=mysql.createPool({
    host: process.env.DB_host,
    port: process.env.DB_port,
    user: process.env.DB_user,
    password: process.env.DB_password,
    database: process.env.DB_name,
    waitForConnections:true,
    connectionLimit:10
})

async function testarConexao(){
    const conexao= await pool.getConnection();
    try{
    await conexao.query("select 1");
    console.log("banco de dados conectado com sucesso!");
    }catch (erro) {
        console.error('não foi possivel conectar ao banco de dados!');
        console.error(`detalhes do erro: ${erro.message}`);
        process.exit(1);
    }finally{
        if(conexao){
            conexao.release();
        }
    }
}
export {pool, testarConexao};