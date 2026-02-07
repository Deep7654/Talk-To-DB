import { NextFunction, Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler.js";
import { Pool } from "pg"
import ApiError from "../../utils/apiError.js";
import { User } from "../../db/models/user.model.js";
import ApiResponse from "../../utils/apiResponse.js";
import {neon} from "@neondatabase/serverless"
import postgres from "postgres"


const dbConnect = asyncHandler(async(req: Request, res: Response, next: NextFunction)=>{
    const {query} = req.body
    if(!query){
        return next(new ApiError(400, "Query is required"))
    } 
    
try {

    const userid = req.user?.id
    const user = await User.findById(userid)
    if(!user){
        return next(new ApiError(404, "User not found"))
    }
    // const connectionString = user.connectionString || ""

    // if(!connectionString){
    //     return next(new ApiError(404, "Connection string not found"))
    // }

    let sql 
    try{
        sql = postgres(process.env.DATABSE_URI! , {
           ssl: "require"
       });
    }catch(error){
        console.log(error)
        return next(new ApiError( 400 , "dbError" , error))
    }


    const result = await sql.unsafe(query)

  const version = result;
  console.log(version)
  res.status(200).json(
    new ApiResponse(true , 200 , "Database connected successfully" , version)
  )
} catch (error) {
    console.log(error)
    return next(new ApiError(500, "Failed to connect to the database" , error))
}
})


const dbConnectController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { connectionString } = req.body
    if (!connectionString) {
        return next(new ApiError(400, "Connection string is required"))
    }
    try {

        const userid = req.user?.id
        let user;
        try{
            user = await User.findById(userid)
        }catch(error){
            return next(new ApiError(404 , "Error while finding the User in DB " , error))
        }
        
        user.connectionString = connectionString

        try{
            user.save()
        }catch(error){
            next(new ApiError(400 , "Error While SAving the User in DB" , error))
        }
        res.status(200).json(
            new ApiResponse(true , 200 , "Db Connection String Save to Db SuccesFully")
        )
        next()
        // const userId = req.body.id
        // const user = await User.findOne({
        //     where: {
        //         id: userId
        //     }
        // })
        // if (!user) {
        //     return next(new ApiError(404, "User not found"))
        // }
        // user.connectionString = connectionString
        // try {
        //     await user.save()
        // } catch (error) {
        //     return next(new ApiError(500, "Failed to save connection string"))
        // }

        let pool: Pool
        pool = new Pool({
                connectionString,
                ssl: false 
            })
        try {
            const user = 4545;
            
        } catch (error) {
            return next(new ApiError(500, "Failed to connect to the database" , error))
        }

        const result = await pool.query(`
            SELECT
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;`)

console.log(result)
const schema: Record<string, string[]> = {};
for (const row of result.rows) {
      schema[row.table_name] ??= [];
      schema[row.table_name].push(row.column_name);
    }

    res.status(200).json(
        new ApiResponse(true , 200 , "Schema fetch Succesfuly" , schema)
    )

    }
    catch (error) {
        return next(new ApiError(500, "Failed to connect to the database" , error))
    }
})

const dbCrateTable = asyncHandler(async (req : Request , res : Response , next : NextFunction)=>{
const { connectionString } = req.body
    if (!connectionString) {
        return next(new ApiError(400, "Connection string is required"))
    }
    try {
        // const userId = req.body.id
        // const user = await User.findOne({
        //     where: {
        //         id: userId
        //     }
        // })
        // if (!user) {
        //     return next(new ApiError(404, "User not found"))
        // }
        // user.connectionString = connectionString
        // try {
        //     await user.save()
        // } catch (error) {
        //     return next(new ApiError(500, "Failed to save connection string"))
        // }

        let pool: Pool

        try {
            pool = new Pool({
                connectionString
            })
        } catch (error) {
            return next(new ApiError(500, "Failed to connect to the database"))
        }

        await pool.query(`
      CREATE TABLE IF NOT EXISTS test_users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        age INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // 2️⃣ Insert 5 rows
    await pool.query(`
      INSERT INTO test_users (name, email, age)
      VALUES
        ('Alice', 'alice@test.com', 22),
        ('Bob', 'bob@test.com', 25),
        ('Charlie', 'charlie@test.com', 30),
        ('David', 'david@test.com', 28),
        ('Eva', 'eva@test.com', 21);
    `);

// console.log(result)
// const schema: Record<string, string[]> = {};
// for (const row of result.rows) {
//       schema[row.table_name] ??= [];
//       schema[row.table_name].push(row.column_name);
//     }

    res.status(200).json(
        new ApiResponse(true , 200 , "Schema fetch Succesfuly" )
    )

    }
    catch (error) {
        console.log(error)
        return next(new ApiError(500, "Failed to connect to the database" , error))
    }
})


export {
    dbConnectController,
    dbCrateTable,
    dbConnect
}
