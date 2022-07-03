import express from "express"
import bodyParser from "body-parser"
import {Request, Response} from "express"
import {AppDataSource} from "./db/data-source.js"
import {Routes} from "./routes.js"
import {User} from "./db/entity/User.js"
import {fileURLToPath} from "url";
import {dirname} from "path";
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
AppDataSource.initialize().then(async () => {

    // create express app
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next)
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)

            } else if (result !== null && result !== undefined) {
                res.json(result)
            }
        })
    })
    app.use(express.static(path.join(__dirname, './ui/dist/ui')));
    app.use('*', (req, res) => {
        const indexPath = path.join(__dirname, './ui/dist/ui/index.html');
        res.sendFile(indexPath);
    });

    // start express server
    app.listen(3000)

    console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results")

}).catch(error => console.log(error))
