import express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { HeliosRouteConfigurator } from '../HeliosRouteConfigurator';
import { HeliosContext } from '../../core/HeliosContext';
import { HeliosRouter } from '../HeliosRouter';
import { HeliosRoute } from '../HeliosRoute';
import { HeliosRouterLogUtils } from '../../util/route/HeliosRouterLogUtils';
import { AbstractHeliosRouteConfigurator } from './AbstractHeliosRouteConfigurator';
import { HttpStatusCode, AsteriaException } from 'asteria-gaia';
import { FileWalker } from '../../util/io/FileWalker';
import { HeliosFileStats } from 'asteria-eos';

/**
 * The <code>WorkspaceConfigurator</code> class is the <code>HeliosRouteConfigurator</code> implementation to declare 
 * the Helios <code>/workspace</code> route.
 */
export class WorkspaceConfigurator extends AbstractHeliosRouteConfigurator implements HeliosRouteConfigurator {

    /**
     * The reference to the file worker used by this configurator to list files.
     */
    private readonly _fileWalker: FileWalker = null;
    
    /**
     * Create a new <code>WorkspaceConfigurator</code> instance.
     */
    constructor() {
        super('workspace');
        this._fileWalker = new FileWalker();
    }

    /**
     * @inheritdoc
     */
    public createRoute(router: HeliosRouter, context: HeliosContext): void {
        /*router.getRouter().post(HeliosRoute.WOKSPACE, (req: express.Request, res: express.Response) => {
            HeliosRouterLogUtils.logRoute(req, 'POST /workspace');
            res.sendStatus(HttpStatusCode.OK);
        });*/
        router.getRouter().get(HeliosRoute.WOKSPACE_CONTROLLER_LIST, (req: express.Request, res: express.Response) => {
            const pathParam: string = req.params.path || '';
            const templateRef: string = 'GET /workspace/controller/list/' + pathParam;
            const directoryPath = path.join(context.getWorkspace(), pathParam);
            HeliosRouterLogUtils.logRoute(req, templateRef);
            this._fileWalker.readDir(directoryPath, (error: AsteriaException, statsList: HeliosFileStats[])=> {
                if (error) {
                    res.sendStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
                } else {
                    res.send({ data: statsList });
                }
            });
        });
        this.routeAdded(HeliosRoute.WOKSPACE);
    }
}