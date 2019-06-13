import express from 'express';
import * as path from 'path';
import { HeliosRouteConfigurator } from '../HeliosRouteConfigurator';
import { HeliosContext } from '../../core/HeliosContext';
import { HeliosRouter } from '../HeliosRouter';
import { HeliosRoute } from '../HeliosRoute';
import { HeliosRouterLogUtils } from '../../util/route/HeliosRouterLogUtils';
import { AbstractHeliosRouteConfigurator } from './AbstractHeliosRouteConfigurator';
import { HttpStatusCode, AsteriaException, AsteriaErrorCode, ErrorUtil, StreamEventType } from 'asteria-gaia';
import { FileWalker } from '../../util/io/FileWalker';
import { HeliosFileStats, HeliosData } from 'asteria-eos';
import { HeliosLogger } from '../../util/logging/HeliosLogger';
import { SpiContext } from '../../spi/SpiContext';
import { Hyperion, HyperionConfig, HyperionBaseProcessType } from 'asteria-hyperion';
import { HeliosServiceName } from '../../core/HeliosServiceName';
import { ModuleRegistry } from '../../service/config/ModuleRegistry';
import { HeliosRouteUtils } from '../../util/route/HeliosRouteUtils';
import { HeliosDataBuilder } from '../../util/builder/HeliosDataBuilder';

/**
 * The <code>WorkspaceConfigurator</code> class is the <code>HeliosRouteConfigurator</code> implementation to declare 
 * the Helios <code>/workspace</code> route.
 */
export class WorkspaceConfigurator extends AbstractHeliosRouteConfigurator implements HeliosRouteConfigurator {

    /**
     * Create a new <code>WorkspaceConfigurator</code> instance.
     */
    constructor() {
        super('workspace');
    }

    /**
     * @inheritdoc
     */
    public createRoute(router: HeliosRouter, context: HeliosContext): void {
        const fileWalker: FileWalker = new FileWalker(context);
        router.getRouter().get(HeliosRoute.WOKSPACE_CONTROLLER_LIST, (req: express.Request, res: express.Response) => {
            const pathParam: string = req.params.path || '';
            const templateRef: string = 'GET /workspace/controller/list/' + pathParam;
            HeliosRouterLogUtils.logRoute(req, templateRef);
            fileWalker.readDir(pathParam, (error: AsteriaException, statsList: Array<HeliosFileStats>)=> {
                if (error) {
                    res.sendStatus(HttpStatusCode.INTERNAL_SERVER_ERROR);
                } else {
                    const result: HeliosData<Array<HeliosFileStats>> = 
                        HeliosDataBuilder.build<Array<HeliosFileStats>>(context.getId(), statsList);
                    res.send(result);
                }
            });
        });
        router.getRouter().get(HeliosRoute.WOKSPACE_CONTROLLER_PREVIEW, (req: express.Request, res: express.Response) => {
            const pathParam: string = req.params.path;
            const templateRef: string = 'GET /workspace/controller/preview/' + pathParam;
            HeliosRouterLogUtils.logRoute(req, templateRef);
            try {
                const spi: SpiContext = context.getSpiContext();
                const processor: Hyperion = this.getPreviewProcessor(context, pathParam);
                spi.getService(HeliosServiceName.PROCESSOR_REGISTRY)
                    .add(processor, (err: AsteriaException)=> {
                        if (err) {
                            HeliosRouteUtils.closeOnError(res, err, AsteriaErrorCode.PROCESS_FAILURE);
                        } else {
                            HeliosRouterLogUtils.logProcessorRegistryInfo(processor, true);
                            res.on(StreamEventType.FINISH, ()=> {
                                spi.getService(HeliosServiceName.PROCESSOR_REGISTRY)
                                .remove(processor, (err: AsteriaException)=> {
                                    if (err) {
                                        HeliosLogger.getLogger().error(err.toString());
                                    } else {
                                        HeliosRouterLogUtils.logProcessorRegistryInfo(processor, false);
                                    }
                                    
                                });
                            });
                            (processor.run() as any).pipe(res);
                        }
                    });
            } catch (e) {
                HeliosLogger.getLogger().error(e.toString());
                res.sendStatus(ErrorUtil.resolveHttpCode(AsteriaErrorCode.PROCESS_FAILURE));
            }
        });
        this.routeAdded(HeliosRoute.WOKSPACE);
    }

    /**
     * Create the preview processor for the specified file path.
     * 
     * @param {HeliosContext} context the reference to context for this Helios server instance.
     * @param {string} filePath the file path for which to get the preview.
     * 
     * @returns {Hyperion} the preview processor for the specified file path.
     */
    private getPreviewProcessor(context: HeliosContext, filePath: string): Hyperion {
        const spi: SpiContext = context.getSpiContext();
        const fullPath: string = path.join(context.getWorkspace(), filePath);
        const config: HyperionConfig = {
            name: 'PreviewFile',
            processes: [
                {
                    type: HyperionBaseProcessType.CSV_PREVIEW,
                    config: fullPath
                }
            ]
        };
        const processor: Hyperion = Hyperion.build(config);
        const moduleService: ModuleRegistry = spi.getService(HeliosServiceName.MODULE_REGISTRY) as ModuleRegistry;
        processor.setModuleRegistry(moduleService.getHyperionModuleRegistry());
        return processor;
    }
}