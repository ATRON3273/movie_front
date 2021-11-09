function create_table(table_name, schema, err, conn) {
    if (err) {
        console.error(err.message);
        return;
    }
    
    let query = `CREATE TABLE ${table_name} ${schema}`
    conn.execute(query, [], (err, result) => {
        if (err) {
            console.error(err.message);
            doRelease(conn);
            return;
        }

        console.log(result.metaData);  //테이블 스키마
        doRelease(conn);
        console.log("TABLE CREATED")
    });
}