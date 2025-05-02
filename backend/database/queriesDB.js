import client from "./postgreDB.js"


const queriesDB = {

    // // retrieve all history of a specific user_id only
    // async viewingHistory (req, res, next) {
    //     const id = req.params.user_id;
    //     const query = `SELECT * FROM public."history" WHERE user_id = $1`;
    //     await client.query( query, [id], (err, result) => {
    //         if (!err) {
    //             console.log(result.rows);
    //             res.send(result.rows);
    //         } else {
    //             console.log(err.message);
    //         }   
    //     });
    // },

    // // retrieve all favorites rides from history
    // async viewingFavorites (req, res, next) {
    //     const id = req.params.user_id;
    //     const isfav = true;
    //     const query = `SELECT * FROM public."history" WHERE user_id = $1 AND "isFavorite" = $2`;
    //     await client.query( query, [id, isfav], (err, result) => {
    //         if (!err) {
    //             console.log(result.rows);
    //             res.send(result.rows);
    //         } else {
    //             console.log(err.message);
    //         }
    //     });
    // },

    

    // check existing email
    async checkExistingEmail (email) {
        const query = `SELECT email FROM public."user" WHERE email = $1`;
        await client.query( query, [email], (err, result) => {
            if (!err) {
                console.log(result.rows[0]['email']);
                return result.rows[0]['email'];
            } else {
                console.log(err.message);
            }
        });
    },

    // adding user to DB
    async addUser (email, password, passengerType) {
        const query = `INSERT INTO public."user"(email, password, "passengerType") VALUES ($1, $2, $3);`;
        await client.query( query, [email, password, passengerType], (err, result) => {
            if (!err) {
                console.log(result.rows);
            } else {
                console.log(err.message);
            }
        });
    },

    // retrieve password
    async retrievePassword (email) {
        const query = `SELECT password FROM public."user" WHERE email = $1`;
        await client.query( query, [email], (err, result) => {
            if (!err) {
                console.log(result.rows[0]['password']);
                return result.rows[0]['password'];
            } else {
                console.log(err.message);
            }
        });
    },

    // retrieve passengerType, timeStamp
    async retrievePassTypeAndTime (email) {
        const query = `SELECT "passengerType", "timeStamp"::date FROM public."user" WHERE email = $1`;
        await client.query( query, [email], (err, result) => {
            if (!err) {
                console.log(result.rows[0]);
                return result.rows[0];
            } else {
                console.log(err.message);
            }
        });
    },

    // // mark ride history as favorite
    // async markingAsFavorite (req, res, next) {
    //     const id = ;
    //     const isfav = true;
    //     const query = `UPDATE public.history SET "isFavorite" = $1 WHERE id = $2`;
    //     await client.query( query, [id, isfav], (err, result) => {
    //         if (!err) {
    //             console.log(result.rows);
    //             res.send(result.rows);
    //         } else {
    //             console.log(err.message);
    //         }
    //     });
    // }



}

export default queriesDB;