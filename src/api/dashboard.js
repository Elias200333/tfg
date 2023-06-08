const bd = require('../bd')

function Dashboard() {
    this.getStadistics = async function (email) {
        const query = `SELECT 
                        SUM(websites.visits) AS TotalVisits, 
                        (SUM(websites.size) / 1024 / 1024) AS mbUpload, 
                        (
                        SELECT p.nombre
                        FROM proyectos AS p
                        JOIN websites AS w ON p.ID = w.idProyecto
                        JOIN usuarios AS u ON p.email = u.email
                        WHERE u.email = '${email}'
                        GROUP BY p.ID
                        ORDER BY SUM(w.visits) DESC LIMIT 1
                        ) AS mostPopular,
                        (
                        SELECT 
                            SUM(
                            CASE 
                                WHEN proyectos.can_update = 0 THEN pl.precioLvl1
                                WHEN proyectos.can_update = 1 THEN pl.precioLvl2
                                ELSE 0
                            END
                            ) 
                        FROM planes AS pl
                        JOIN proyectos AS pr ON pl.ID = pr.idPlan
                        JOIN usuarios AS u ON u.email = pr.email
                        WHERE u.email = '${email}'
                        ) AS totalInversion
                    FROM proyectos
                    JOIN websites ON proyectos.ID = websites.idProyecto
                    JOIN usuarios ON proyectos.email = usuarios.email
                    WHERE usuarios.email = '${email}';`

        return await bd.query(query);
    }

    this.getTotalProyects = async function (email) {
        const query = `SELECT COUNT(p.ID) AS total
                        FROM proyectos p 
                        JOIN usuarios u ON p.email = u.email 
                        WHERE u.email = '${email}';`
        return await bd.query(query);
    }

    this.getTop = async function (email) {
        const query = `SELECT 
                        p.nombre, SUM(w.visits) AS totalVisits
                        FROM proyectos AS p
                        JOIN websites AS w ON p.ID = w.idProyecto
                        JOIN usuarios AS u ON p.email = u.email
                        WHERE u.email = '${email}'
                        GROUP BY p.ID
                        ORDER BY totalVisits DESC LIMIT 15;`

        return await bd.query(query);
    }

    this.getListProyects = async function (email, min) {
        let query = `SELECT 
                        p.ID,
                        p.nombre, 
                        ((SELECT websites.size 
                        FROM websites 
                        JOIN proyectos ON websites.idProyecto = proyectos.ID 
                        JOIN usuarios ON proyectos.email = usuarios.email 
                        WHERE usuarios.email = '${email}'  AND p.ID = proyectos.ID
                        ORDER BY date_time DESC LIMIT 1) / 1024 / 1024) AS size,
                        DATE_FORMAT(p.date_up, '%d/%m/%Y %H:%i:%s') as date_up,
                        SUM(w.visits) AS visits,
                        p.times_updated AS updates,
                        (SELECT ID FROM websites WHERE websites.idProyecto = p.ID ORDER BY websites.date_time DESC LIMIT 1) AS actual_website
                    FROM proyectos p 
                    JOIN usuarios u ON p.email = u.email 
                    JOIN websites w ON p.ID = w.idProyecto
                    WHERE u.email = '${email}' 
                    GROUP BY p.ID
                    ORDER BY date_up ASC`
        if (min) {
            query += ` LIMIT ${min}, 15;`
        } else {
            query += ` LIMIT 15;`
        }

        return await bd.query(query);
    }
}

const dashboard = new Dashboard();

module.exports = dashboard;