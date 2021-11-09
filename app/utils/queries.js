import fs from "fs"

export function doRelease(conn){
    conn.release((err)=>{
        if(err) {
            console.log("RELEASE FAIL : ", err.message)
        }
    })
}

export function create_schema(conn, table){
    let schema_path = `${BASE_SCHEMA}${table}.sql`
    console.log(`create ${table}`)
    
}

function execute(conn, table, query){
    conn.execute(query, [], (err, result) => {
        if (err) {
            if(err.errorNum == 955){
                return
            } else if(err.errorNum == 942){
                return
            }
            console.log(`${err.errorNum} QUERY(${table}) can not excuted`);
            console.error(` - ${err.message}`)
            // doRelease(conn);
        } else {
            for(var temp = 1; temp < 100; temp++){
                temp *= temp
            }
            console.log(`${table} QUERY is SUCCESS`)
            // doRelease(conn);
        }
    });
    conn.commit()
}

const BASE_SCHEMA = "./queries/schema/"
export function query_schema(conn, command, table){
    switch(command){
    case "CREATE":
        let schema_path = `${BASE_SCHEMA}${table}.sql`

        try {
            if(!fs.existsSync(schema_path)){
                console.log(`File(${schema_path}) Error`)
                return false
            }

            let query_body = fs.readFileSync(schema_path).toString();
            execute(conn, table, `CREATE TABLE ${table} (${query_body})`)

        } catch(err) {
            console.log(`Query error ${err}`)
            return false
        }
        break
    case "DROP":
        execute(conn, table, `DROP TABLE ${table}`)
        break
        
    case "SHOW":
        execute(conn, table, `SELECT TABLE_NAME FROM ALL_TABLES WHERE OWNER='${table}'`)
        break
    default:
        console.log(`Command(${command}) is invalid`)
        return false
    }

    return true
}
